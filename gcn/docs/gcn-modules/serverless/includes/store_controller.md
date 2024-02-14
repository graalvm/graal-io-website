Create an HTTP controller in the file _lib/src/main/java/com/example/StoreController.java_, as follows:

```java
package com.example;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.PathVariable;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.exceptions.HttpStatusException;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Collection;
import java.util.stream.Collectors;

import static io.micronaut.http.HttpStatus.BAD_REQUEST;
import static io.micronaut.http.HttpStatus.NOT_FOUND;

@Controller("/store") // <1>
class StoreController {

    private final StorageService storageService;

    StoreController(StorageService storageService) { // <2>
        this.storageService = storageService;
    }

    @Get("/all") // <3>
    Collection<StoreItem> listAllItems() {
        return storageService.getItems();
    }

    @Get("/available") // <4>
    Collection<StoreItem> listAvailableItems() {
        return storageService.getItems().stream()
                .filter(i -> i.getNumberInStorage() > 0)
                .collect(Collectors.toList());
    }

    @Post(uri = "/order/{name}/{amount}", consumes = "*/*") // <5>
    HttpResponse<StoreItem> orderItem(@NotBlank @PathVariable String name, @Min(1) int amount) {
        if (storageService.findItem(name).isEmpty()) {
            throw new HttpStatusException(NOT_FOUND, "Item '" + name + "' not found");
        }
        try {
            storageService.orderItem(name, amount);
        } catch (StorageService.StorageException e) {
            throw new HttpStatusException(BAD_REQUEST, "Could not order item '" + name + "'. " + e.getMessage());
        }
        return HttpResponse.ok(storageService.findItem(name).orElse(null));
    }
}
```

**1** The class is defined as a controller with the [`@Controller`](https://docs.micronaut.io/4.2.1/api/io/micronaut/http/annotation/Controller.html) annotation mapped to the path `/store`.

**2** Use [Micronaut argument injection](https://docs.micronaut.io/4.2.1/guide/#qualifiers) to inject a `StorageService` bean by defining it as the constructor argument. You will create the `StorageService` in next section.

**3** The [`@Get`](https://docs.micronaut.io/4.2.1/api/io/micronaut/http/annotation/Get.html) annotation maps the `listAllItems` method to an HTTP GET request on `/store/all`.

**4** The [`@Get`](https://docs.micronaut.io/4.2.1/api/io/micronaut/http/annotation/Get.html) annotation maps the `listAvailableItems` method to an HTTP GET request on `/store/available`.

**5** The [`@Post`](https://docs.micronaut.io/4.2.1/api/io/micronaut/http/annotation/Post.html) annotation maps the `orderItem` method to an HTTP POST request on `/store/order/{name}/{amount}`. Use the `consumes` argument to specify which content-types are allowed in the request. Throwing `HttpStatusException` will set the corresponding HTTP status in the response.