output "gcn_oke_guide_vm_ip_address" {
  description = "public IP of developer VM"
  value       = oci_core_instance.guide_vm.public_ip
}
