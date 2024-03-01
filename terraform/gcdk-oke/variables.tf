variable "compartment_ocid" {}
variable "tenancy_ocid" {}
variable "ssh_public_key" {}

variable "api_repo" {
  default = "api-oci"
}

variable "orders_repo" {
  default = "orders-oci"
}

variable "users_repo" {
  default = "users-oci"
}

locals {
  all_svc_idx = index(
    [for v in data.oci_core_services.oci_services.services : substr(v.name, 0, 4)], "All "
  )
  all_services            = data.oci_core_services.oci_services.services[local.all_svc_idx]
  all_services_cidr_block = local.all_services.cidr_block
  all_services_ocid       = local.all_services.id
  kube_config_content     = data.oci_containerengine_cluster_kube_config.cluster_kube_config.content
  kube_config_filename    = "kube_config"
  repo_names              = [var.api_repo, var.orders_repo, var.users_repo]
  ad1_name                = data.oci_identity_availability_domain.ad1.name
  compartment_name        = data.oci_identity_compartment.guide_compartment.name
}
