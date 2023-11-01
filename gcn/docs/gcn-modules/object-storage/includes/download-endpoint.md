The generated `/download` endpoint simply retrieves the entry from the expected key, and transforms it into a `StreamedFile`:

```java
@Override
public Optional<HttpResponse<StreamedFile>> download(String userId) {
    String key = buildKey(userId);
    return objectStorage.retrieve(key) // <1>
            .map(ProfilePicturesController::buildStreamedFile); // <2>
}

private static HttpResponse<StreamedFile> buildStreamedFile(ObjectStorageEntry<?> entry) {
    StreamedFile file = new StreamedFile(entry.getInputStream(), IMAGE_JPEG_TYPE).attach(entry.getKey());
    MutableHttpResponse<Object> httpResponse = HttpResponse.ok();
    file.process(httpResponse);
    return httpResponse.body(file);
}
```
**1** The retrieve operation returns a cloud-independent [`ObjectStorageEntry`](https://micronaut-projects.github.io/micronaut-object-storage/latest/guide/).

**2** Transform the cloud-specific storage entry into an `HttpResponse<StreamedFile>`.

The HTTP client could have used the `ETag` from the upload operation and sent it in a `If-None-Match` header in the download request [to implement caching](https://developer.mozilla.org/docs/Web/HTTP/Headers/ETag#caching_of_unchanged_resources), which then would have been to be implemented in the download endpoint. But this is beyond the scope of this guide.