resource "oci_artifacts_container_repository" "gdk-function-demo" {
  compartment_id = var.compartment_ocid
  display_name = "gdk-function-demo"
}
