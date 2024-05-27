These Terraform scripts are used in the following OCI guides:
  * MySQL
  * Serverless

**The OKE TF scripts are not working**

>Note: DO NOT USE built-in macOS **Compress** menu option.

Instead, use command-line `zip`, then move the ZIP files to the _archives_ directory corresponding to the guide.

```bash
zip -r gcdk-mysql.zip gcdk-mysql
mv gcdk-mysql.zip ../docs/gdk-modules/database/archives/
```

```bash
zip -r gcdk-function.zip gcdk-function
mv gcdk-function.zip ../docs/gdk-modules/serverless/archives
```
