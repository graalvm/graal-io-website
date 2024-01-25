Create a `StoreItem` model to represent an item in the store in the file _lib/src/main/java/com/example/StoreItem.java_ with the following contents:

```java
package com.example;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.core.annotation.NonNull;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Serdeable
@Introspected // <1>
public class StoreItem {

    @NotBlank
    @NonNull
    private final String name;

    private final String description;

    @Min(0)
    private int numberInStorage;

    public StoreItem(String name, String description, int numberInStorage) { // <2>
        this.name = name;
        this.description = description;
        this.numberInStorage = numberInStorage;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Integer getNumberInStorage() {
        return numberInStorage;
    }

    public void setNumberInStorage(Integer numberInStorage) {
        this.numberInStorage = numberInStorage;
    }
}
```

**1** The [`@Introspected`](https://micronaut-projects.github.io/micronaut-core/latest/api/io/micronaut/core/annotation/Introspected.html) annotation enables Micronaut to serialize and deserialize the model from different formats including `JSON`. This provides the ability to use the type inside HTTP requests or responses.

**2** The model has fields to store the item's name, description, and number available.