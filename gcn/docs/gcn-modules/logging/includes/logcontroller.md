### 1.1. Controller Class

The example code includes a controller in a file named _{{ include.cloud }}/src/main/java/com/example/LogController.java_, which enables you to send `POST` requests to publish a message to a log:

```java
package com.example;

import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Controller
class LogController {

    private static final Logger LOG = LoggerFactory.getLogger(LogController.class);

    @Post("/log")
    void log(@Body String message) {
        LOG.info(message);
    }
}
```