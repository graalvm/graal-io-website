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

    @Post(uri = "/{userId}", consumes = MULTIPART_FORM_DATA) // The @Post annotation maps the method to an HTTP POST request.
    HttpResponse<?> upload(CompletedFileUpload fileUpload, String userId, HttpRequest<?> request);

    @Get("/{userId}") // The @Get annotation maps the method to an HTTP GET request.
    Optional<HttpResponse<StreamedFile>> download(String userId);

    @Status(NO_CONTENT) // You can return `void` in your controller’s method and specify the HTTP status code via the `@Status` annotation.
    @Delete("/{userId}") // The @Delete annotation maps the `delete` method to an HTTP Delete request on `/{userId}`.
    void delete(String userId);
}