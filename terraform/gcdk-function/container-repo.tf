resource "oci_artifacts_container_repository" "gcdk_guide_repo" {
  compartment_id = var.compartment_ocid
  display_name = "gcdk_guide_repo"
}
