Run the tests using the following command:

<div id="tabs-doc3">
    <ul>
        <li class="tabs-gradle"><a name ="gradle" href="#gradle">Gradle</a></li>
        <li class="tabs-maven"><a name ="maven" href="#maven">Maven</a></li>
    </ul>
    <div id="gradle">
        <pre><code class="language-bash">./gradlew test</code></pre>
        <p>Then open the file <em>{{ include.cloud }}/build/reports/tests/test/index.html</em> in a browser to view the results.</p>
    </div>
    <div id="maven">
        <pre><code class="language-bash">./mvnw test</code></pre>
    </div>
</div>