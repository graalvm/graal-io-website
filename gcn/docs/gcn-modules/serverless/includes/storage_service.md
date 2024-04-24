1. Create an interface for a service that represents the store's inventory in _lib/src/main/java/com/example/StorageService.java_:

    ```java
    package com.example;

    import io.micronaut.core.annotation.NonNull;

    import jakarta.validation.constraints.Min;
    import jakarta.validation.constraints.NotBlank;
    import java.util.Collection;
    import java.util.Optional;

    public interface StorageService { // <1>
        Collection<StoreItem> getItems();
        Optional<StoreItem> findItem(@NonNull @NotBlank String name);
        void orderItem(@NonNull @NotBlank String name, @Min(1) int amount);

        class StorageException extends RuntimeException { // <2>
            StorageException(String message) {
                super(message);
            }
        }
    }
    ```

    **1** The storage service provides information about all the items, finds an items by its name, and can place an order for an item.

    **2** The class includes a custom exception that thrown in case of invalid requests to storage.

2. Create an implementation of the service interface in _lib/src/main/java/com/example/DefaultStorageService.java_:

    ```java
    package com.example;

    import io.micronaut.context.annotation.Requires;
    import io.micronaut.core.annotation.NonNull;
    import jakarta.inject.Singleton;

    import java.util.ArrayList;
    import java.util.Collection;
    import java.util.List;
    import java.util.Optional;

    @Singleton // <1>
    @Requires(missingBeans = StorageService.class) // <2>
    class DefaultStorageService implements StorageService {

        protected List<StoreItem> items = List.of( // <3>
            new StoreItem("chair", "A black chair with 4 legs", 10),
            new StoreItem("table", "A quality dining table", 6),
            new StoreItem("sofa", "A gray sofa", 2),
            new StoreItem("bookshelf", "A futuristic-looking bookshelf", 0)
        );

        @Override
        public Collection<StoreItem> getItems() {
            return items;
        }

        @Override
        public Optional<StoreItem> findItem(@NonNull String name) {
            return items.stream().filter(item -> item.getName().equals(name)).findFirst();
        }

        @Override
        public void orderItem(@NonNull String name, int amount) {
            findItem(name).ifPresentOrElse(item -> {
                if (item.getNumberInStorage() >= amount) {
                    item.setNumberInStorage(item.getNumberInStorage() - amount);
                } else {
                    throw new StorageException("Insufficient amount in storage");
                }
            }, () -> { throw new StorageException("Item not found in storage"); });
        }
    }
    ```

    **1** Use `jakarta.inject.Singleton` to designate a class as a singleton.

    **2** The [`@Requires(missingBeans = StorageService.class)`](https://docs.micronaut.io/4.2.1/api/io/micronaut/context/annotation/Requires.html) annotation specifies that this implementation should only be used if no other implementations could be found.

    **3** The implementation stores the items in a `List` and populates some sample items in the list.

