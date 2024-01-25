resource "oci_identity_policy" "gcn-serverless-policy" {
  compartment_id = var.compartment_ocid
  description = "compartment level policy for functions"
  name = "gcn-serverless-policy"
  statements = ["Allow any-user to use functions-family in compartment id ${var.compartment_ocid} where ALL {request.principal.type= 'ApiGateway', request.resource.compartment.id = '${var.compartment_ocid}' }"]
}
