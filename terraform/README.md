These Terraform scripts are used in the following OCI guides:
  * Kubernetes
  * MySQL
  * Serverless

>Note: DO NOT USE built-in macOS **Compress** menu option.

Instead, use command-line `zip`, then move the ZIP files to the _archives_ directory corresponding to the guide.

```bash
zip -r gdk-oke.zip gdk-oke
mv gdk-oke.zip ../docs/gdk-modules/kubernetes/archives/
```

```bash
zip -r gdk-mysql.zip gdk-mysql
mv gdk-mysql.zip ../docs/gdk-modules/database/archives/
```

```bash
zip -r gdk-serverless.zip gdk-serverless
mv gdk-serverless.zip ../docs/gdk-modules/serverless/archives/
```
