resource "oci_identity_policy" "gcn_oke_policy" {
  compartment_id = var.compartment_ocid
  description    = "instance_principal policy for OKE"
  name           = "gcn_guide_oke_ip"
  statements     = ["Allow any-user to manage cluster-family in compartment id ${var.compartment_ocid} where ALL { request.principal.type='instance', request.principal.compartment.id='${var.compartment_ocid}' }"]
}
