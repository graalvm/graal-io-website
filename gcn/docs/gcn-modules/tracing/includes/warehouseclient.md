### 1.4. Warehouse Client

The GCN Launcher created the `WarehouseClient` class in a file named _lib/src/main/java/com/example/WarehouseClient.java_, as follows:

```java
package com.example;

import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.QueryValue;
import io.micronaut.http.client.annotation.Client;
import io.micronaut.tracing.annotation.ContinueSpan;
import io.micronaut.tracing.annotation.NewSpan;
import io.micronaut.tracing.annotation.SpanTag;

import java.util.Map;

@Client("/warehouse") // <1>
public interface WarehouseClient {

    @Post("/order")
    @NewSpan
    void order(@SpanTag("warehouse.order") Map<String, ?> json);

    @Get("/count")
    @ContinueSpan
    int getItemCount(@QueryValue String store,
                     @SpanTag @QueryValue int upc);
}
```

**1** Some external service without tracing.
