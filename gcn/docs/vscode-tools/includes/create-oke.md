You will package your server application in OCI and deploy it to [Oracle Container Engine for Kubernetes (OKE)](https://www.oracle.com/cloud/cloud-native/container-engine-kubernetes/).
For that you need to create a Kubernetes cluster (if you do not already have one).

1. Create a Kubernetes cluster in the Oracle Cloud console, with default settings, using the **Quick Create** workflow:
    - Open the navigation menu and click **Developer Services**.
    - Under **Containers**, click **Kubernetes Clusters (OKE)**.
    - Then click **Create Cluster** and choose **Quick Create** option.
    It takes a few minutes to create a cluster.

2. Set local access to your cluster so you can manage it using `kubectl`. To set local access, review the information that is displayed after OKE Quick Create completes in the Oracle Cloud Console. Otherwise, from the Oracle Cloud Console perform the following steps:
    - Open your newly created OKE cluster (**Developer Services** > **Kubernetes Clusters (OKE)**).
    - Click **Access Cluster**.
    - In the **Access Your Cluster** window, select **Local Access**, and run the commands tied to your user ID from your VS Code terminal window (**View** > **Terminal**). Make sure you access your cluster via the **VCN-Native public endpoint**.

    Alternatively, see the [Setting Up Local Access to Clusters](https://docs.oracle.com/iaas/Content/ContEng/Tasks/contengdownloadkubeconfigfile.htm#localdownload) OCI guide for more information.

> Note: On Windows, `kubectl` is typically installed within the Kubernetes extension and is not added to the system path. Windows users should configure a proxy in the _.kube/config_ file to successfully deploy a project to OCI: add a `proxy-url` property under `cluster`:

```yml
clusters:
- name: "dev"
 cluster:
 proxy-url: http://user:password@proxy:port
 ...
```

> Note: If VS Code fails to locate a Kubernetes cluster (OKE), or you have not created it yet, the extension will suggest you create one directly in VS Code. However, you are required to [setup OKE](https://docs.oracle.com/iaas/Content/ContEng/Tasks/contengdownloadkubeconfigfile.htm).
