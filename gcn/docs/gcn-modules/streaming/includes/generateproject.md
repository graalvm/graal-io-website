1. Open the [GCN Launcher in advanced mode](/gcn/launcher/?advanced=true).

2. Create a new project using the following selections.
    * **Project Type**: _Application_ (Default)
    * **Project name**: _{{ include.project }}_
    * **Base Package**: _com.example.{{ include.package }}_
    * **Clouds**: _{{ include.cloud_upper }}_
    * **Language**: _Java_ (Default)
    * **Build Tool**: _Gradle (Groovy)_ or _Maven_
    * **Test Framework**: _JUnit_ (Default)
    * **Java Version**: _17_ (Default)
    * **Micronaut Version**: (Default)
    * **Cloud Services**: _Streaming_
    {% if include.reactor == "true" %}
    * **Features**: _Awaitility Framework_, _GraalVM Native Image_, _Micronaut Serialization Jackson Core_, and _Reactor_
    {% else %}
    * **Features**: _Awaitility Framework_, _GraalVM Native Image_ and _Micronaut Serialization Jackson Core_
    {% endif %}
    * **Sample Code**: _No_
   
3. Click **Generate Project**, then click **Download Zip**. The GCN Launcher creates an application with the default package `com.example.{{ include.package }}` in a directory named _{{ include.project }}_. The application ZIP file will be downloaded in your default downloads directory. Unzip it, open in your code editor, and proceed to the next steps.

Alternatively, use the [GCN CLI](/gcn/get-started/using-gcn-cli/) as follows:

<div id="tabs-doc2">
  <ul>
    <li class="tabs-gradle"><a href="#gradle">Gradle</a></li>
    <li class="tabs-maven"><a href="#maven">Maven</a></li>
  </ul>
  <div id="gradle">
    <pre><code class="language-bash">gcn create-app com.example.{{ include.package }}.{{ include.project }} \
    --clouds={{ include.cloud }} \
    --services=streaming \
    {% if include.reactor == "true" %}--features=awaitility,graalvm,reactor,serialization-jackson \{% else %}--features=awaitility,graalvm,serialization-jackson \{% endif %}
    --build=gradle \
    --lang=java \
    --example-code=false</code></pre>
  </div>
  <div id="maven">
    <pre><code class="language-bash">gcn create-app com.example.{{ include.package }}.{{ include.project }} \
    --clouds={{ include.cloud }} \
    --services=streaming \
    {% if include.reactor == "true" %}--features=awaitility,graalvm,reactor,serialization-jackson \{% else %}--features=awaitility,graalvm,serialization-jackson \{% endif %}
    --build=maven \
    --lang=java \
    --example-code=false</code></pre>
  </div>
</div>