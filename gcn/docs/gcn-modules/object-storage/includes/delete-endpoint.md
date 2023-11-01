For the `/delete` endpoint, all you have to do is invoke the `delete` method with the expected key:

```java
@Override
public void delete(String userId) {
    String key = buildKey(userId);
    objectStorage.delete(key);
}
```