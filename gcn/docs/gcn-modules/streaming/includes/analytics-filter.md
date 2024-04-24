Sending a message to the streaming service is as simple as injecting `AnalyticsClient` and calling its `updateAnalytics` method.
The goal is to send a message every time the details of a book are returned from the _Books_ microservice or, in other words, every time there is a call to `http://localhost:8080/books/{isbn}`.
To achieve this, the GCN Launcher created an [Http Server Filter](https://docs.micronaut.io/4.2.1/guide/#filters) in a file named _lib/src/main/java/com/example/publisher/AnalyticsFilter.java_ as follows:

```java
package com.example.publisher;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.annotation.Filter;
import io.micronaut.http.filter.HttpServerFilter;
import io.micronaut.http.filter.ServerFilterChain;
import reactor.core.publisher.Flux;
import org.reactivestreams.Publisher;

@Filter("/books/?*") // <1>
class AnalyticsFilter implements HttpServerFilter { // <2>

    private final AnalyticsClient analyticsClient;

    AnalyticsFilter(AnalyticsClient analyticsClient) { // <3>
        this.analyticsClient = analyticsClient;
    }

    @Override
    public Publisher<MutableHttpResponse<?>> doFilter(HttpRequest<?> request,
                                                      ServerFilterChain chain) { // <4>
        return Flux
                .from(chain.proceed(request)) // <5>
                .flatMap(response -> {
                    Book book = response.getBody(Book.class).orElse(null); // <6>
                    if (book == null) {
                        return Flux.just(response);
                    }
                    return Flux.from(analyticsClient.updateAnalytics(book)).map(b -> response); // <7>
                });
    }
}
```

**1** Annotate the class with [`@Filter`](https://docs.micronaut.io/4.2.1/api/io/micronaut/http/annotation/Filter.html) and define the [Ant-style matcher pattern](https://ant.apache.org/manual/dirtasks.html#patterns) to intercept all calls to the desired URIs.

**2** The class must implement [`HttpServerFilter`](https://docs.micronaut.io/4.2.1/api/io/micronaut/http/filter/HttpServerFilter.html).

**3** Dependency injection for `AnalyticsClient`.

**4** Implement the [`doFilter`](https://docs.micronaut.io/4.2.1/api/io/micronaut/http/filter/HttpServerFilter.html#doFilter-io.micronaut.http.HttpRequest-io.micronaut.http.filter.FilterChain-) method.

**5** Call the request; this will invoke the controller action.

**6** Get the response from the controller and return the body as an instance of the `Book` class.

**7** If the book is retrieved, use the client to send a message.
