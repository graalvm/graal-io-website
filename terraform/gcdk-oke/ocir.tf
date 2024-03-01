resource "oci_artifacts_container_repository" "repos" {
  for_each       = toset(local.repo_names)
  compartment_id = var.compartment_ocid
  display_name   = each.value
}
