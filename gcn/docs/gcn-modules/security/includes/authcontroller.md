### 1.1. AuthController

The GCN Launcher created a class named `AuthController` to handle requests to `/`. It displays the email of an authenticated person, if any. The controller endpoint is annotated with  a [`@View`](https://micronaut-projects.github.io/micronaut-views/latest/api/io/micronaut/views/View.html){:target="_blank"} annotation that uses a [JTE template](https://micronaut-projects.github.io/micronaut-views/latest/guide/#jte){:target="_blank"}. The file named _{{ include.cloud }}/src/main/java/com/example/AuthController.java_ has the following contents:

```java
package com.example;

import io.micronaut.core.annotation.Nullable;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.authentication.Authentication;
import io.micronaut.views.View;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static io.micronaut.security.rules.SecurityRule.IS_ANONYMOUS;
import static io.micronaut.security.rules.SecurityRule.IS_AUTHENTICATED;

@Controller // <1>
class AuthController {

    @Secured(IS_ANONYMOUS) // <2>
    @View("auth") // <3>
    @Get // <4>
    Map<String, Object> index(@Nullable Authentication authentication) { // <5>
        Map<String, Object> model = new HashMap<>();
        if (authentication != null) {
            model.put("username", authentication.getAttributes().get("{{ include.attr }}"));
        } else {
            model.put("username", "Anonymous");
        }
        return model;
    }

    @Secured(IS_AUTHENTICATED) // <6>
    @Get("/secure") // <7>
    Map<String, Object> secured() {
        return Collections.singletonMap("secured", true); // <8>
    }
}
```

**1** The class is defined as a controller with the [`@Controller`](https://docs.micronaut.io/4.2.1/api/io/micronaut/http/annotation/Controller.html){:target="_blank"} annotation mapped to the path `/`.

**2** Annotate with [`@Secured`](https://micronaut-projects.github.io/micronaut-security/1.3.1/api/io/micronaut/security/annotation/Secured.html){:target="_blank"} to configure secured access. The `SecurityRule.IS_ANONYMOUS` expression allows access without authentication.

**3** Use the [`@View`](https://micronaut-projects.github.io/micronaut-views/latest/api/io/micronaut/views/View.html){:target="_blank"} annotation to specify which template to use to render the response.

**4** The [`@Get`](https://docs.micronaut.io/4.2.1/api/io/micronaut/http/annotation/Get.html){:target="_blank"} annotation maps the `index` method to an HTTP GET request on `/`.

**5** Micronaut Security will inject the `Authentication` instance as a method parameter; by annotating with [`@Nullable`](https://docs.micronaut.io/latest/api/io/micronaut/core/annotation/Nullable.html){:target="_blank"}, you can determine whether the user is authenticated or not, and populate the model map accordingly.

**6** Annotate with `@Secured` to configure secured access. The `SecurityRule.IS_AUTHENTICATED` expression allows access only to authenticated users.

**7** The [`@Get`](https://docs.micronaut.io/4.2.1/api/io/micronaut/http/annotation/Get.html) annotation maps the `secured` method to an HTTP GET request on `/secure`.

**8** This method simply returns a model map that will be rendered as JSON (because there is no [`@View`](https://micronaut-projects.github.io/micronaut-views/latest/api/io/micronaut/views/View.html){:target="_blank"} annotation).
