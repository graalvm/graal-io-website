The GCN Launcher also generated the `/upload` endpoint which receives the file from the HTTP client via `CompletedFileUpload`, and the `userId` path parameter. It uploads the file to {{ include.storage }} using [ObjectStorageOperations](https://micronaut-projects.github.io/micronaut-object-storage/latest/guide/), and then returns its `ETag` in an HTTP response header to the client:

```java
@Override
public HttpResponse<?> upload(CompletedFileUpload fileUpload,
                              String userId,
                              HttpRequest<?> request) {
    String key = buildKey(userId); // <1>
    UploadRequest objectStorageUpload = UploadRequest.fromCompletedFileUpload(fileUpload, key); // <2>
    UploadResponse<?> response = objectStorage.upload(objectStorageUpload); // <3>

    return HttpResponse
            .created(location(request, userId)) // <4>
            .header(ETAG, response.getETag()); // <5>
}

private static String buildKey(String userId) {
    return userId + ".jpg";
}

private URI location(HttpRequest<?> request, String userId) {
    return UriBuilder.of(httpHostResolver.resolve(request))
            .path(PREFIX)
            .path(userId)
            .build();
}
```

**1** The key represents the path under which the file will be stored.

**2** You can use any of the [`UploadRequest`](https://micronaut-projects.github.io/micronaut-object-storage/latest/api/io/micronaut/objectstorage/request/UploadRequest.html) static methods to build an upload request.

**3** The upload operation returns an [`UploadResponse`](https://micronaut-projects.github.io/micronaut-object-storage/latest/api/io/micronaut/objectstorage/response/UploadResponse.html), which wraps the cloud-specific SDK response.

**4** Return the absolute URL of the resource in the `location` header.

**5** The response object contains some common properties for all cloud vendors, such as the `ETag`, that is sent in a header to the client.