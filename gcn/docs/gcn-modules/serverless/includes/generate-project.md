This section describes how to create a Micronaut gateway function for a simple online store. The store provides information about available items and enables the user to order items. An HTTP controller is responsible for the API implementation and a service stores the availability of items.

Create a Micronaut gateway function using the GCN Launcher.

1. Open the [GCN Launcher in advanced mode](/gcn/launcher/?advanced=true).

2. Create a new project using the following selections.
    * **Project Type**: _Gateway Function_
    * **Project Name**: _{{ include.cloud }}-serverless-demo_
    * **Base Package**: _com.example_ (Default)
    * **Clouds**: _{{ include.cloud_upper }}_
    * **Language**: _Java_ (Default)
    * **Build Tool**: _Gradle (Groovy)_ or _Maven_
    * **Test Framework**: _JUnit_ (Default)
    * **Java Version**: _17_ (Default)
    * **Micronaut Version**: (Default)
    * **Cloud Services**: _None_
    * **Features**: _GraalVM Native Image_ and _Micronaut Validation_
    * **Sample Code**: _No_

3. Click **Generate Project**, then click **Download Zip**. The GCN Launcher creates a Micronaut gateway function with the default package `com.example` in a directory named _{{ include.cloud }}-serverless-demo_. The application ZIP file will be downloaded in your default downloads directory. Unzip it, open in your code editor, and proceed to the next steps.

Alternatively, use the [GCN CLI](/gcn/get-started/using-gcn-cli/) as follows:

<div id="tabs-doc2">
  <ul>
    <li class="tabs-gradle"><a href="#gradle">Gradle</a></li>
    <li class="tabs-maven"><a href="#maven">Maven</a></li>
  </ul>
  <div id="gradle">
    <pre><code class="language-bash">gcn create-gateway-function com.example.{{ include.cloud }}-serverless-demo \
    --clouds={{ include.cloud }} \
    --features=graalvm,validation \
    --example-code=false \
    --jdk=17 \
    --build=gradle \
    --lang=java</code></pre>
  </div>
  <div id="maven">
    <pre><code class="language-bash">gcn create-gateway-function com.example.{{ include.cloud }}-serverless-demo \
    --clouds={{ include.cloud }} \
    --features=graalvm,validation \
    --example-code=false \
    --jdk=17 \
    --build=maven \
    --lang=java</code></pre>
  </div>
</div>

For more information, see [Using the GCN CLI](/gcn/get-started/using-gcn-cli/).

The GCN Launcher creates a multimodule project with two subprojects: **{{ include.cloud }}** for {{ include.cloud_full }}, and **lib**.
You develop the gateway function logic in the **{{ include.cloud }}** subproject. If your gateway function is to be deployed to multiple cloud providers, use the **lib** subproject to create classes that can be shared between the providers. This enables you to separate the code that is different between cloud providers, while keeping most of the implementation in the common **lib** subproject.
