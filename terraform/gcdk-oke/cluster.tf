resource "oci_containerengine_cluster" "generated_oci_containerengine_cluster" {
  cluster_pod_network_options {
    cni_type = "OCI_VCN_IP_NATIVE"
  }
  compartment_id = var.compartment_ocid
  endpoint_config {
    is_public_ip_enabled = "true"
    subnet_id            = oci_core_subnet.kubernetes_api_endpoint_subnet.id
  }
  freeform_tags = {
    "OKEclusterName" = "gcn_guide"
  }
  kubernetes_version = "v1.27.2"
  name               = "gcn_guide"
  options {
    admission_controller_options {
      is_pod_security_policy_enabled = "false"
    }
    persistent_volume_config {
      freeform_tags = {
        "OKEclusterName" = "gcn_guide"
      }
    }
    service_lb_config {
      freeform_tags = {
        "OKEclusterName" = "gcn_guide"
      }
    }
    service_lb_subnet_ids = ["${oci_core_subnet.service_lb_subnet.id}"]
  }
  type   = "ENHANCED_CLUSTER"
  vcn_id = oci_core_vcn.generated_oci_core_vcn.id
}

resource "oci_containerengine_node_pool" "create_node_pool_details0" {
  cluster_id     = oci_containerengine_cluster.generated_oci_containerengine_cluster.id
  compartment_id = var.compartment_ocid
  freeform_tags = {
    "OKEnodePoolName" = "pool1"
  }
  initial_node_labels {
    key   = "name"
    value = "gcn_guide"
  }
  kubernetes_version = "v1.27.2"
  name               = "pool1"
  node_config_details {
    freeform_tags = {
      "OKEnodePoolName" = "pool1"
    }
    node_pool_pod_network_option_details {
      cni_type       = "OCI_VCN_IP_NATIVE"
      pod_subnet_ids = [oci_core_subnet.node_subnet.id]
    }
    placement_configs {
      availability_domain = local.ad1_name
      subnet_id           = oci_core_subnet.node_subnet.id
    }
    placement_configs {
      availability_domain = local.ad1_name
      subnet_id           = oci_core_subnet.node_subnet.id
    }
    placement_configs {
      availability_domain = local.ad1_name
      subnet_id           = oci_core_subnet.node_subnet.id
    }
    size = "3"
  }
  node_eviction_node_pool_settings {
    eviction_grace_duration = "PT60M"
  }
  node_shape = "VM.Standard.E3.Flex"
  node_shape_config {
    memory_in_gbs = "16"
    ocpus         = "1"
  }
  node_source_details {
    image_id    = "ocid1.image.oc1.phx.aaaaaaaa6gy7u34i6b7hcj5sg47vttecbh4fbbshibxqedqcjvxnungyqvhq"
    source_type = "IMAGE"
  }
}

data "oci_containerengine_cluster_kube_config" "cluster_kube_config" {
  cluster_id = oci_containerengine_cluster.generated_oci_containerengine_cluster.id
}

resource "local_file" "kube_config" {
  content  = local.kube_config_content
  filename = local.kube_config_filename
}
