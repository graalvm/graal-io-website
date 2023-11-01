### 1.4. Store Controller

The launcher created the `StoreController` class in a file named _lib/src/main/java/com/example/StoreController.java_, as follows:

```java
package com.example;

import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Status;
import io.micronaut.scheduling.TaskExecutors;
import io.micronaut.scheduling.annotation.ExecuteOn;
import io.micronaut.tracing.annotation.ContinueSpan;
import io.micronaut.tracing.annotation.NewSpan;
import io.micronaut.tracing.annotation.SpanTag;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static io.micronaut.http.HttpStatus.CREATED;

@ExecuteOn(TaskExecutors.IO)
@Controller("/store")
class StoreController {

    private final InventoryService inventory;

    StoreController(InventoryService inventory) {
        this.inventory = inventory;
    }

    @Post("/order")
    @Status(CREATED)
    @NewSpan("store.order") // <1>
    void order(@SpanTag("order.item") String item, @SpanTag int count) { // <2>
        inventory.order(item, count);
    }

    @Get("/inventory") // <3>
    List<Map<String, Object>> getInventory() {
        return inventory.getProductNames().stream()
                .map(this::getInventory)
                .collect(Collectors.toList());
    }

    @Get("/inventory/{item}")
    @ContinueSpan // <4>
    Map<String, Object> getInventory(@SpanTag("item") String item) { // <5>
        Map<String, Object> counts = new HashMap<>(inventory.getStockCounts(item));
        if (counts.isEmpty()) {
            counts.put("note", "Not available at store");
        }

        counts.put("item", item);

        return counts;
    }
}
```

**1** Create a new span called "store.order".

**2** Add tags for the method parameters. Name the first parameter "order.item", and use the default name for the second parameter.

**3** A span is created automatically if your build configuration file contains the `io.micronaut.tracing` dependency.

**4** Required for `@SpanTag` (see **5**).

**5** Add a tag for the method parameter.