resource "oci_functions_application" "gcn-serverless-application" {
  compartment_id = var.compartment_ocid
  display_name = "gcn-serverless-application"
  subnet_ids = [oci_core_subnet.public_subnet.id]
}
