The GCN Launcher created a client interface to send messages to the streaming service in a file named _lib/src/main/java/com/example/publisher/AnalyticsClient.java_ with the contents shown below. (Micronaut generates an implementation for the client interface at compilation time.)


```java
package com.example.publisher;

import io.micronaut.configuration.kafka.annotation.KafkaClient;
import io.micronaut.configuration.kafka.annotation.Topic;
import reactor.core.publisher.Mono;

@KafkaClient
public interface AnalyticsClient {

    @Topic("analytics") // <1>
    Mono<Book> updateAnalytics(Book book); // <2>
}
```

**1** Set the name of the topic. This matches the name of the topic used by `AnalyticsListener` in the _Analytics_ microservice.
>Note: This **must** match the name of the stream that you will create later in Oracle Cloud Infrastructure.

**2** Send the `Book` POJO. Micronaut will automatically convert it to JSON before sending it.