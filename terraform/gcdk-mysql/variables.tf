
variable "compartment_ocid" {}
variable "region" {}
variable "ssh_public_key" {}

variable "mysql_admin_password" {
  default = "Welcome_1"
}

variable "mysql_admin_username" {
  default = "admin"
}

variable "vcn_display_name" {
  default = "GCN-MySQL-guide-VCN"
}

variable "vcn_cidr" {
  default = "10.0.0.0/16"
}

variable "private_subnet_cidr" {
  default = "10.0.1.0/24"
}

variable "public_subnet_cidr" {
  default = "10.0.0.0/24"
}
variable "vcn_dns_label" {
  default = "gcnMySQLVCN"
}

variable "subnet_dns_label" {
  default = "subnet"
}
