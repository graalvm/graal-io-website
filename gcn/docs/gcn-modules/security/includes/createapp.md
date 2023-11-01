## 1. Create the Application

Create an application using the GCN Launcher.

1. Open the [GCN Launcher in advanced mode](/gcn/launcher/?advanced=true).

2. Create a new project using the following selections.
    * **Project Type**: _Application_ (default)
    * **Project Name**: _{{ include.cloud }}-security-demo_
    * **Base Package**: _com.example_ (Default)
    * **Clouds**: _{{ include.cloud_upper }}_
    * **Language**: _Java_ (default)
    * **Build Tool**: _Gradle (Groovy)_ or _Maven_
    * **Test Framework**: _JUnit_ (default)
    * **Java Version**: _17_ (default)
    * **Micronaut Version**: (default)
    * **Cloud Services**: _Security_
    * **Features**: _GraalVM Native Image_ (Default)
    * **Sample Code**: _Yes_ (Default)

3. Click **Generate Project**. The GCN Launcher creates an application with the default package `com.example` in a directory named _{{ include.cloud }}-security-demo_. The application ZIP file will be downloaded in your default downloads directory. Unzip it, open in your code editor, and proceed to the next steps.

Alternatively, use the GCN CLI as follows:

<div id="tabs-doc2">
    <ul>
        <li class="tabs-gradle"><a name ="gradle" href="#gradle">Gradle</a></li>
        <li class="tabs-maven"><a name ="maven" href="#maven">Maven</a></li>
    </ul>
    <div id="gradle">
        <pre><code class="language-bash">gcn create-app com.example.{{ include.cloud }}-security-demo \
    --clouds={{ include.cloud }} \
    --services=security \
    --features=graalvm \
    --build=gradle \
    --lang=java</code></pre>
    </div>
    <div id="maven">
        <pre><code class="language-bash">gcn create-app com.example.{{ include.cloud }}-security-demo \
    --clouds={{ include.cloud }} \
    --services=security \
    --features=graalvm \
    --build=maven \
    --lang=java</code></pre>
    </div>
</div>

For more information, see [Using the GCN CLI](/gcn/get-started/using-gcn-cli/).
