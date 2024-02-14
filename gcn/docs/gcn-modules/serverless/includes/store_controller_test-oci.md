Create a test class for the controller in _oci/src/test/java/com/example/StoreControllerTest.java_, as follows:

```java
package com.example;

import io.micronaut.context.annotation.Requires;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.client.annotation.Client;
import io.micronaut.http.client.exceptions.HttpClientResponseException;
import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static io.micronaut.http.HttpStatus.BAD_REQUEST;
import static io.micronaut.http.HttpStatus.NOT_FOUND;
import static io.micronaut.http.HttpStatus.OK;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

@MicronautTest(environments = "test-storage-service") // <1>
class StoreControllerTest {

   @Inject
   StoreClient client;

   @Test
   void testAvailableItems() {
      List<StoreItem> availableItems = client.getAvailable();

      assertEquals(2, availableItems.size());
      assertEquals("pot", availableItems.get(1).getName());
      assertEquals(10, availableItems.get(1).getNumberInStorage());
      assertNotNull(availableItems.get(1).getDescription());
   }

   @Test
   void testNotFoundException() {
      HttpResponse<?> response = client.order("lamp", 1);

      assertEquals(NOT_FOUND, response.getStatus());
   }

   @Test
   void testNotSufficientException() {
      HttpClientResponseException e = assertThrows(HttpClientResponseException.class, () -> {
         client.order("pot", 100);
      });

      assertEquals(BAD_REQUEST, e.getStatus());
   }

   @Test
   void testOrderRequest() {
      StoreItem plate = client.getAll().stream()
              .filter(i -> i.getName().equals("plate"))
              .findFirst().orElse(null);
      assertNotNull(plate);
      assertEquals(100, plate.getNumberInStorage());

      HttpResponse<StoreItem> response = client.order("plate", 10);
      assertEquals(OK, response.getStatus());
      assertNotNull(response.body());
      assertEquals("plate", response.body().getName());
      assertEquals(90, response.body().getNumberInStorage());
   }

   @Singleton
   @Requires(env = "test-storage-service")
   static class TestStorageService extends DefaultStorageService {
      TestStorageService() { // <2>
         items = List.of(
                 new StoreItem("plate", "A large plate", 100),
                 new StoreItem("pot", "A cooking pot", 10),
                 new StoreItem("pan", "A large pan", 0)
         );
      }
   }

   @Client("/store") // <3>
   interface StoreClient {
      @Get("/all") // <4>
      List<StoreItem> getAll();

      @Get("/available") // <4>
      List<StoreItem> getAvailable();

      @Post("/order/{name}/{amount}") // <4>
      HttpResponse<StoreItem> order(String name, Integer amount);
   }
}
```
**1** Annotate the class with [`@MicronautTest`](https://micronaut-projects.github.io/micronaut-test/latest/api/io/micronaut/test/annotation/MicronautTest.html) so the Micronaut framework will initialize the application context. This enables you to inject beans using the Jakarta `@Inject` annotation and to send requests to the `StoreController` defined in the application. Configure this test to use an identified environment using the `@MicronautTest(environments="test-storage-service")` annotation.

**2** Create a mock implementation of `StorageService` so that the test is independent of the current state of the storage. The `@Requires(env="test-storage-service")` annotation specifies that the bean should only be available in the identified environment. (In this case it matches the one identified in the `@MicronautTest` annotation.)

**3** Create a [Micronaut Declarative Client](https://docs.micronaut.io/4.2.1/guide/#clientAnnotation) with the same `/store` path to send requests to the controller.

**4** Create three tests using the defined client and assuming that `TestStorageService` is used.