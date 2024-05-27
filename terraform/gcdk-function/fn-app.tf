resource "oci_functions_application" "gdk-serverless-application" {
  compartment_id = var.compartment_ocid
  display_name = "gdk-serverless-application"
  subnet_ids = [oci_core_subnet.public_subnet.id]
}
