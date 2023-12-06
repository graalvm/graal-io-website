# developer_vm setup

# disposable key pair for setup
resource "tls_private_key" "setup_key_pair" {
  algorithm   = "RSA"
}

resource "local_file" "private_key" {
  content = tls_private_key.setup_key_pair.private_key_openssh
  filename = "key_rsa"
}

resource "local_file" "public_key" {
  content = tls_private_key.setup_key_pair.private_key_openssh
  filename = "key_rsa.pub"
}

# Execute commands in Linux Instance
resource "null_resource" "remote-exec" {
  depends_on = [oci_core_instance.guide_vm]
  provisioner "remote-exec" {
    connection {
      agent       = false
      timeout     = "30m"
      host        = oci_core_instance.guide_vm.public_ip
      user        = "opc"
      private_key = "${tls_private_key.setup_key_pair.private_key_openssh}"
    }
    inline = [
      "sudo dnf -y install podman podman-docker",
      "echo 'export DOCKER_HOST='unix:///run/user/$UID/podman/podman.sock'' >> $HOME/.bashrc",
      "sudo touch /etc/containers/nodocker",
      "curl -s https://get.sdkman.io | bash",
      "source $HOME/.sdkman/bin/sdkman-init.sh",
      "sdk install java 21-graal",
      "sdk install gcn",
    ]
  }
}
