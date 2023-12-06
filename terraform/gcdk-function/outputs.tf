output "compute_instance_public_ip" {
  description = "public IP of developer VM"
  value = oci_core_instance.guide_vm.public_ip
}

output "gcdk_guide_repo_namespace" {
  value = oci_artifacts_container_repository.gcdk_guide_repo.namespace
}
