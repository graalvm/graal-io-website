### 1.1. Tracing Annotations

The Micronaut framework uses the [`io.micronaut.tracing.annotation`](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/annotation/package-summary.html) package and [OpenTelemetry](https://opentelemetry.io/) to generate and export tracing data.

The `io.micronaut.tracing.annotation` package provides the following three annotations:

* [`@NewSpan`](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/annotation/NewSpan.html): Used on methods to create a new span; defaults to the _method_ name, but you can assign a unique name instead.

* [`@ContinueSpan`](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/annotation/ContinueSpan.html): Used on methods to continue an existing span; primarily used in conjunction with `@SpanTag` (below).

* [`@SpanTag`](https://micronaut-projects.github.io/micronaut-tracing/latest/api/io/micronaut/tracing/annotation/SpanTag.html): Used on method parameters to assign a value to a span; defaults to the _parameter_ name, but you can assign a unique name instead. To use the `@SpanTag` on a method parameter, the method must be annotated with either `@NewSpan` or `@ContinueSpan`.

Your build configuration file contains the `io.micronaut.tracing` dependency which means all HTTP server methods (those annotated with `@Get`, `@Post`, and so on) create spans automatically.
