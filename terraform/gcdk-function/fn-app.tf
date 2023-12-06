resource "oci_functions_application" "gcdk_guide_application" {
  compartment_id = var.compartment_ocid
  display_name = "gcdk_guide_application"
  subnet_ids = [oci_core_subnet.public_subnet.id]
}
