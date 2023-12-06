The GCN launcher created a class to act as a consumer of the messages sent to the streaming service by the _Books_ microservice. The Micronaut framework implements logic to invoke the consumer at compile time. The `AnalyticsListener` class is in a file named _lib/src/main/java/com/example/consumer/AnalyticsListener.java_, as follows:

```java
package com.example.consumer;

import io.micronaut.configuration.kafka.annotation.KafkaListener;
import io.micronaut.configuration.kafka.annotation.Topic;
import io.micronaut.context.annotation.Requires;
import io.micronaut.context.env.Environment;

@Requires(notEnv = Environment.TEST) // <1>
@KafkaListener // <2>
class AnalyticsListener {

    private final AnalyticsService analyticsService; // <3>

    AnalyticsListener(AnalyticsService analyticsService) { // <3>
        this.analyticsService = analyticsService;
    }

    @Topic("analytics") // <4>
    void updateAnalytics(Book book) {
        analyticsService.updateBookAnalytics(book); // <5>
    }
}
```

**1** Do not load this bean in the `test` environment: you can run tests without access to a streaming service.

**2** Annotate the class with `@KafkaListener` to indicate that this bean consumes messages from Kafka.

**3** Constructor injection for `AnalyticsService`.

**4** Annotate the method with `@Topic` and specify the topic name. This matches the name of the topic used by `AnalyticsClient` in the _Books_ microservice.
>Note: This **must** match the name of the stream that you will create later in Oracle Cloud Infrastructure. (See section **2.4**.)

**5** Call `AnalyticsService` to update the analytics for the book.