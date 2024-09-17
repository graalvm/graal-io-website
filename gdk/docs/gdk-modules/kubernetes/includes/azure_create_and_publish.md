1. To create a container image of the native _{{ include.app }}_ microservice named "{{ include.app }}", run the following command from the _{{ include.app }}_ directory:
    <div id="tabs-doc{{ include.tab }}">
        <ul>
            <li class="tabs-gradle"><a href="#gradle">Gradle</a></li>
            <li class="tabs-maven"><a href="#maven">Maven</a></li>
        </ul>
        <div id="gradle">
            <pre><code class="language-bash">./gradlew :azure:dockerBuildNative</code></pre>

            <blockquote>
              <p>Note: If you encounter problems creating a container image, run the following command
              from the <em>{{ include.app }}/build/docker/native-main/</em> directory:</p>
              <pre><code class="language-bash">docker build . -t {{ include.app }}-azure -f DockerfileNative</code></pre>
            </blockquote>
        </div>
        <div id="maven">
            <pre><code class="language-bash">./mvnw package -Dpackaging=docker-native -Pgraalvm</code></pre>
            <blockquote>
              <p>Note: If you encounter problems creating a container image, run the following command
              from the <em>{{ include.app }}/target/</em> directory:</p>
              <pre><code class="language-bash">docker build . -t {{ include.app }}-azure -f Dockerfile</code></pre>
            </blockquote>
        </div>
    </div>

2. Tag the image with the login server of your container registry:
    ```bash
    docker tag {{ include.app }}-azure gdkrepo.azurecr.io/{{ include.app }}-azure:latest
    ```

3. Push the image to the container registry:
    ```bash
    docker push gdkrepo.azurecr.io/{{ include.app }}-azure:latest
    ```
