To keep this guide simple there is no database persistence: the _Analytics_ microservice keeps book analytics in memory. The GCN Launcher created a class named `AnalyticsService` in _lib/src/main/java/com/example/consumer/AnalyticsService.java_ with the following contents:

```java
package com.example.consumer;

import jakarta.inject.Singleton;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Singleton
public class AnalyticsService {

    private final Map<Book, Long> bookAnalytics = new ConcurrentHashMap<>(); // <1>

    public void updateBookAnalytics(Book book) { // <2>
        bookAnalytics.compute(book, (k, v) -> {
            return v == null ? 1L : v + 1;
        });
    }

    public List<BookAnalytics> listAnalytics() { // <3>
        return bookAnalytics
                .entrySet()
                .stream()
                .map(e -> new BookAnalytics(e.getKey().getIsbn(), e.getValue()))
                .collect(Collectors.toList());
    }
}
```

**1** Keep the book analytics in memory.

**2** Initialize and update the analytics for the book passed as parameter.

**3** Return all the analytics.
