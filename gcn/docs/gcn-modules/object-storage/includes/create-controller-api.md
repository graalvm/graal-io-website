The launcher created an interface with the endpoints of the "profile pictures" microservice in a file named _lib/src/main/java/com/example/ProfilePicturesApi.java_:

```java
package com.example;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Delete;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Status;
import io.micronaut.http.multipart.CompletedFileUpload;
import io.micronaut.http.server.types.files.StreamedFile;

import java.util.Optional;

import static io.micronaut.http.HttpStatus.NO_CONTENT;
import static io.micronaut.http.MediaType.MULTIPART_FORM_DATA;

public interface ProfilePicturesApi {

    @Post(uri = "/{userId}", consumes = MULTIPART_FORM_DATA) // <1>
    HttpResponse<?> upload(CompletedFileUpload fileUpload, String userId, HttpRequest<?> request);

    @Get("/{userId}") // <2>
    Optional<HttpResponse<StreamedFile>> download(String userId);

    @Status(NO_CONTENT) // <3>
    @Delete("/{userId}") // <4>
    void delete(String userId);
}
```
**1** The [`@Post`](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Post.html) annotation maps the method to an HTTP POST request.

**2** The [`@Get`](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Get.html) annotation maps the method to an HTTP GET request.

**3** You can return `void` in your controller’s method and specify the HTTP status code via the [`@Status`](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Status.html) annotation.

**4** The [`@Delete`](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Delete.html) annotation maps the `delete` method to an HTTP Delete request on `/{userId}`.

The launcher also created the `ProfilePicturesController` class that implements the `ProfilePicturesApi` interface in a file named _lib/src/main/java/com/example/ProfilePicturesController.java_. It contains the class definition and constructor:

```java
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

@Controller(ProfilePicturesController.PREFIX) // <1>
@ExecuteOn(TaskExecutors.IO) // <2>
class ProfilePicturesController implements ProfilePicturesApi {

    static final String PREFIX = "/pictures";

    private final ObjectStorageOperations<?, ?, ?> objectStorage; // <3>
    private final HttpHostResolver httpHostResolver; // <4>

    ProfilePicturesController(ObjectStorageOperations<?, ?, ?> objectStorage,
                              HttpHostResolver httpHostResolver) {
        this.objectStorage = objectStorage;
        this.httpHostResolver = httpHostResolver;
    }
}
```
**1** The class is defined as a controller with the [`@Controller`](https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Controller.html) annotation mapped to the path `/pictures`.

**2** It is critical that any blocking I/O operations (such as fetching the data from the database) are offloaded to a separate thread pool that does not block the Event loop.

**3** [`ObjectStorageOperations`](https://micronaut-projects.github.io/micronaut-object-storage/latest/guide/) provides a uniform API to create, read and delete objects in the major cloud providers.

**4** [`HttpHostResolver`](https://docs.micronaut.io/latest/api/io/micronaut/http/server/util/HttpHostResolver.html) enables you to resolve the host for an HTTP request.