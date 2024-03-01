resource "oci_artifacts_container_repository" "gcn-function-demo" {
  compartment_id = var.compartment_ocid
  display_name   = "gcn-function-demo"
}
