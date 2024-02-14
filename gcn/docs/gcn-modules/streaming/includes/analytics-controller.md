The GCN Launcher created a Controller to create an endpoint for the _Analytics_ microservice in a file named _lib/src/main/java/com/example/consumer/AnalyticsController.java_, as follows:

```java
package com.example.consumer;

import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;

import java.util.List;

@Controller("/analytics") // <1>
class AnalyticsController {

    private final AnalyticsService analyticsService;

    AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @Get // <2>
    List<BookAnalytics> listAnalytics() {
        return analyticsService.listAnalytics();
    }
}
```

**1** The [`@Controller`](https://docs.micronaut.io/4.2.1/api/io/micronaut/http/annotation/Controller.html) annotation defines the class as a controller mapped to the root URI `/analytics`.

**2** The [`@Get`](https://docs.micronaut.io/4.2.1/api/io/micronaut/http/annotation/Get.html) annotation maps the `listAnalytics` method to an HTTP GET request on `/analytics`.

The application doesn't expose the method `updateBookAnalytics` created in `AnalyticsService`. This method will be invoked when reading messages from Kafka.
