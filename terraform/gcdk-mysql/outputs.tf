output "mysql_db_private_ip" {
  description = "ip address of MySQL DB (on private subnet)"
  value       = oci_mysql_mysql_db_system.GCN-MySQL-guide-DB.ip_address
}

output "compute_instance_public_ip" {
  description = "public IP of developer VM"
  value       = oci_core_instance.guide_vm.public_ip
}

output "compute_instance_private_ip" {
  description = "private IP of developer VM"
  value       = oci_core_instance.guide_vm.private_ip
}
