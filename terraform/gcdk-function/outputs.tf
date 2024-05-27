
output "gdk-function-demo_namespace" {
  value = oci_artifacts_container_repository.gdk-function-demo.namespace
}

output "gdk-serverless-gateway_hostname" {
  value = data.oci_apigateway_gateway.gdk-serverless-gateway.hostname
}

output "region" {
  value = var.region
}
