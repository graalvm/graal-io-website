### 1.5. Warehouse Controller

The launcher created a `WarehouseController` class to represent an external service that will be called by `WarehouseClient` in a file named _lib/src/main/java/com/example/WarehouseController.java_, as follows:

```java
package com.example;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;
import io.micronaut.scheduling.TaskExecutors;
import io.micronaut.scheduling.annotation.ExecuteOn;

import java.util.Random;

@ExecuteOn(TaskExecutors.IO) //<1>
@Controller("/warehouse") // <2>
class WarehouseController {

    @Get("/count") // <3>
    HttpResponse<?> getItemCount() {
        return HttpResponse.ok(new Random().nextInt(11));
    }

    @Post("/order") // <4>
    HttpResponse<?> order() {
        try {
            //To simulate an external process taking time
            Thread.sleep(500);
        } catch (InterruptedException ignored) {
        }

        return HttpResponse.accepted();
    }
}
```
 **1** It is critical that any blocking I/O operations (such as fetching the data from the database) are offloaded to a separate thread pool that does not block the Event loop.

 **2** The class is defined as a controller with the [`@Controller`](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Controller.html) annotation mapped to the path `/warehouse`.

 **3** The [`@Get`](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Get.html) annotation maps the `getItemCount` method to an HTTP GET request on `/warehouse/count`.

 **4** The [`@Get`](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Get.html) annotation maps the `order` method to an HTTP GET request on `/warehouse/order`.
