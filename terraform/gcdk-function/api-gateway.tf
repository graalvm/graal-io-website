resource "oci_apigateway_gateway" "gdk-serverless-gateway" {
  compartment_id = var.compartment_ocid
  endpoint_type = "PUBLIC"
  subnet_id = oci_core_subnet.public_subnet.id
  display_name = "gdk-serverless-gateway"
}

data "oci_apigateway_gateway" "gdk-serverless-gateway" {
  gateway_id = oci_apigateway_gateway.gdk-serverless-gateway.id
}

