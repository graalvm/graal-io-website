The GCN Launcher created a controller to access `Book` instances in a file named _lib/src/main/java/com/example/publisher/BookController.java_ with the following contents:

```java
package com.example.publisher;

import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;

import java.util.List;
import java.util.Optional;

@Controller("/books") // <1>
class BookController {

    private final BookService bookService;

    BookController(BookService bookService) { // <2>
        this.bookService = bookService;
    }

    @Get // <3>
    List<Book> listAll() {
        return bookService.listAll();
    }

    @Get("/{isbn}") // <4>
    Optional<Book> findBook(String isbn) {
        return bookService.findByIsbn(isbn);
    }
}
```

**1** The [`@Controller`](https://docs.micronaut.io/4.0.3/api/io/micronaut/http/annotation/Controller.html) annotation defines the class as a controller mapped to the root URI `/books`.

**2** Use constructor injection to inject a bean of type `BookService`.

**3** The [`@Get`](https://docs.micronaut.io/4.0.3/api/io/micronaut/http/annotation/Get.html) annotation maps the `listAll` method to an HTTP GET request on `/books`.

**4** The [`@Get`](https://docs.micronaut.io/4.0.3/api/io/micronaut/http/annotation/Get.html) annotation maps the `findBook` method to an HTTP GET request on `/books/{isbn}`.