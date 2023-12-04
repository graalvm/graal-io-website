package com.example;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.multipart.CompletedFileUpload;
import io.micronaut.http.server.types.files.StreamedFile;
import io.micronaut.http.server.util.HttpHostResolver;
import io.micronaut.http.uri.UriBuilder;
import io.micronaut.objectstorage.ObjectStorageEntry;
import io.micronaut.objectstorage.ObjectStorageOperations;
import io.micronaut.objectstorage.request.UploadRequest;
import io.micronaut.objectstorage.response.UploadResponse;
import io.micronaut.scheduling.TaskExecutors;
import io.micronaut.scheduling.annotation.ExecuteOn;

import java.net.URI;
import java.util.Optional;

import static io.micronaut.http.HttpHeaders.ETAG;
import static io.micronaut.http.MediaType.IMAGE_JPEG_TYPE;

@Controller(ProfilePicturesController.PREFIX) // The class is defined as a controller with the @Controller annotation mapped to the path `/pictures`.
@ExecuteOn(TaskExecutors.IO) // Any blocking I/O operations are offloaded to a separate thread pool that does not block the event loop.
class ProfilePicturesController implements ProfilePicturesApi {

    static final String PREFIX = "/pictures";

    private final ObjectStorageOperations<?, ?, ?> objectStorage; // `ObjectStorageOperations provides a uniform API to create, read, and delete objects in the major cloud providers.
    private final HttpHostResolver httpHostResolver;

    ProfilePicturesController(ObjectStorageOperations<?, ?, ?> objectStorage, HttpHostResolver httpHostResolver) {
        this.objectStorage = objectStorage;
        this.httpHostResolver = httpHostResolver; // `HttpHostResolver` allows you to resolve the host for an HTTP request.
    }

    @Override
    public HttpResponse<?> upload(CompletedFileUpload fileUpload, String userId, HttpRequest<?> request) {
        String key = buildKey(userId); // The key represents the path under which the file will be stored.
        UploadRequest objectStorageUpload = UploadRequest.fromCompletedFileUpload(fileUpload, key); // You can use any of the `UploadRequest` static methods to build an upload request.
        UploadResponse<?> response = objectStorage.upload(objectStorageUpload); // The upload operation returns an `UploadResponse`, which wraps the cloud-specific SDK response.

        return HttpResponse
                .created(location(request, userId)) // Return the absolute URL of the resource in the `location` header.
                .header(ETAG, response.getETag()); // The response object contains some common properties for all cloud vendors, such as the `ETag`, that is sent in a header to the client.
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

    @Override
    public Optional<HttpResponse<StreamedFile>> download(String userId) {
        String key = buildKey(userId);
        return objectStorage.retrieve(key) // The retrieve operation returns a cloud-independent ObjectStorageEntry.
                .map(ProfilePicturesController::buildStreamedFile); // Transform the cloud-specific storage entry into an `HttpResponse<StreamedFile>`.
    }

    private static HttpResponse<StreamedFile> buildStreamedFile(ObjectStorageEntry<?> entry) {
        StreamedFile file = new StreamedFile(entry.getInputStream(), IMAGE_JPEG_TYPE).attach(entry.getKey());
        MutableHttpResponse<Object> httpResponse = HttpResponse.ok();
        file.process(httpResponse);
        return httpResponse.body(file);
    }

    @Override
    public void delete(String userId) {
        String key = buildKey(userId);
        objectStorage.delete(key);
    }
}
