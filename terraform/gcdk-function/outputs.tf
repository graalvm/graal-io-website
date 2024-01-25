
output "gcn-function-demo_namespace" {
  value = oci_artifacts_container_repository.gcn-function-demo.namespace
}

output "gcn-serverless-gateway_hostname" {
  value = data.oci_apigateway_gateway.gcn-serverless-gateway.hostname
}

output "region" {
  value = var.region
}
