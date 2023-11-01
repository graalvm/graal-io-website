### 1.2. InventoryService

>Note: The `InventoryService` class demonstrates how to create and use spans from `io.micronaut.tracing.annotation` and OpenTelemetry.

The launcher created the `InventoryService` class in a file named _lib/src/main/java/com/example/InventoryService.java_, as follows:

```java
package com.example;

import io.micronaut.tracing.annotation.NewSpan;
import io.micronaut.tracing.annotation.SpanTag;
import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;
import jakarta.inject.Singleton;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Singleton
public class InventoryService {

    private static final String storeName = "my_store";

    private final Tracer tracer;
    private final WarehouseClient warehouse;
    private final Map<String, Integer> inventory = new ConcurrentHashMap<>();

    InventoryService(Tracer tracer, WarehouseClient warehouse) { // <1>
        this.tracer = tracer;
        this.warehouse = warehouse;

        inventory.put("laptop", 4);
        inventory.put("desktop", 2);
        inventory.put("monitor", 11);
    }

    public Collection<String> getProductNames() {
        return inventory.keySet();
    }

    @NewSpan("stock-counts") // <2>
    public Map<String, Integer> getStockCounts(@SpanTag("inventory.item") String item) { // <3>
        Map<String, Integer> counts = new HashMap<>();
        if (inventory.containsKey(item)) {
            int count = inventory.get(item);
            counts.put("store", count);

            if (count < 10) {
                counts.put("warehouse", inWarehouse(storeName, item));
            }
        }

        return counts;
    }

    private int inWarehouse(String store, String item) {
        Span.current().setAttribute("inventory.store-name", store); // <4>

        return warehouse.getItemCount(store, getUPC(item));
    }

    public void order(String item, int count) {
        orderFromWarehouse(item, count);
        if (inventory.containsKey(item)) {
            count += inventory.get(item);
        }
        inventory.put(item, count);
    }

    private void orderFromWarehouse(String item, int count) {
        Span span = tracer.spanBuilder("warehouse-order") // <5>
                .setAttribute("item", item)
                .setAttribute("count", count)
                .startSpan();

        warehouse.order(Map.of(
                "store", storeName,
                "product", item,
                "amount", count,
                "upc", getUPC(item)));

        span.end(); // <6>
    }

    private int getUPC(String item) {
        return Math.abs(item.hashCode());
    }
}
```
**1** Inject an OpenTelemetry Tracing bean into the class.

**2** Create a new `io.micronaut.tracing.annotation` span called "stock-counts".

**3** Add a `io.micronaut.tracing.annotation` tag called "inventory.item" that will contain the value contained in the parameter `item`.

**4** Get the current OpenTelemetry span and set the value of its attribute named "inventory.store-name" to the `store` parameter.

**5** Create an OpenTelemetry span named "warehouse-order", set its attributes and start the span.

**6** End the span started in **5**.