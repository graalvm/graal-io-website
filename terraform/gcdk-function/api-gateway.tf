resource "oci_apigateway_gateway" "gcdk_serverless_gateway" {
  compartment_id = var.compartment_ocid
  endpoint_type = "PUBLIC"
  subnet_id = oci_core_subnet.public_subnet.id
  display_name = "gcdk_serverless_gateway"
}
