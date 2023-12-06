terraform {
  required_version = ">= 0.12.31"
}

resource "oci_core_vcn" this {
  dns_label      = var.vcn_dns_label
  cidr_block     = var.vcn_cidr
  compartment_id = var.compartment_ocid
  display_name   = var.vcn_display_name
}

resource oci_core_internet_gateway this {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.this.id
}

resource "oci_core_default_route_table" "this" {
  manage_default_resource_id = oci_core_vcn.this.default_route_table_id

  route_rules {
    destination       = "0.0.0.0/0"
    network_entity_id = oci_core_internet_gateway.this.id
  }
}

data "oci_identity_availability_domain" "ad1" {
  compartment_id = var.compartment_ocid
  ad_number = 1
}

resource "oci_core_subnet" "private_subnet" {
  cidr_block = var.private_subnet_cidr
  compartment_id = var.compartment_ocid
  vcn_id = oci_core_vcn.this.id
  prohibit_internet_ingress = true
  prohibit_public_ip_on_vnic = true
  security_list_ids = [oci_core_security_list.private_security_list.id]
  display_name = "Private Subnet"
}

resource "oci_core_subnet" "public_subnet" {
  cidr_block = var.public_subnet_cidr
  compartment_id = var.compartment_ocid
  vcn_id = oci_core_vcn.this.id
  security_list_ids = [
    oci_core_security_list.public_security_list.id,
    oci_core_vcn.this.default_security_list_id
  ]
  display_name = "Public Subnet"
}

resource "oci_core_security_list" "public_security_list" {
  compartment_id = var.compartment_ocid
  vcn_id = oci_core_vcn.this.id
  display_name = "Public Security List"
  ingress_security_rules {
    description = "Web App HTTP 8080"
    stateless = false
    source = "0.0.0.0/0" #var.public_subnet_cidr
    source_type = "CIDR_BLOCK"
    # Get protocol numbers from https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml TCP is 6
    protocol = "6"
    tcp_options {
      min = 8080
      max = 8080
    }
  }
}

resource "oci_core_security_list" "private_security_list" {
  compartment_id = var.compartment_ocid
  vcn_id = oci_core_vcn.this.id
  display_name = "Private Security List"
  ingress_security_rules {
    description = "MySQL Classic"
    stateless = false
    source = var.public_subnet_cidr
    source_type = "CIDR_BLOCK"
    # Get protocol numbers from https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml TCP is 6
    protocol = "6"
    tcp_options {
      min = 3306
      max = 3306
    }
  }
  ingress_security_rules {
    description = "MySQL X"
    stateless = false
    source = var.public_subnet_cidr
    source_type = "CIDR_BLOCK"
    # Get protocol numbers from https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml TCP is 6
    protocol = "6"
    tcp_options {
      min = 33060
      max = 33060
    }
  }
}
