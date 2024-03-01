data "oci_core_services" "oci_services" {}

data "oci_identity_availability_domain" "ad1" {
  compartment_id = var.compartment_ocid
  ad_number      = 1
}

data "oci_identity_compartment" "guide_compartment" {
  id = var.compartment_ocid
}
