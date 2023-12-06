To keep this guide simple there is no database persistence: the _Books_ microservice keeps the list of books in memory. The GCN launcher created a class named `BookService` in _lib/src/main/java/com/example/publisher/BookService.java_ with the following contents:

```java
package com.example.publisher;

import jakarta.annotation.PostConstruct;
import jakarta.inject.Singleton;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Singleton
public class BookService {

    private final List<Book> bookStore = new ArrayList<>();

    @PostConstruct
    void init() {
        bookStore.add(new Book("1491950358", "Building Microservices"));
        bookStore.add(new Book("1680502395", "Release It!"));
        bookStore.add(new Book("0321601912", "Continuous Delivery"));
    }

    public List<Book> listAll() {
        return bookStore;
    }

    public Optional<Book> findByIsbn(String isbn) {
        return bookStore.stream()
                .filter(b -> b.getIsbn().equals(isbn))
                .findFirst();
    }
}
```
