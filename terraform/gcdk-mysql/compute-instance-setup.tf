# developer_vm setup

# disposable key pair for setup
resource "tls_private_key" "setup_key_pair" {
  algorithm = "RSA"
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
      "sudo firewall-cmd --zone=public --add-port=8080/tcp --permanent",
      "sudo firewall-cmd --reload",
      "sudo dnf -y update",
      "sudo dnf -y install mysql-shell",
      "sudo dnf -y install git",
      "sudo dnf -y install podman podman-docker",
      "systemctl --user enable --now podman.socket",
      "sudo touch /etc/containers/nodocker",
      "echo 'export DOCKER_HOST='unix:///run/user/$UID/podman/podman.sock'' >> $HOME/.bashrc",
      "curl -s https://get.sdkman.io | bash",
      "source $HOME/.sdkman/bin/sdkman-init.sh",
      "sdk install java 17.0.9-graal",
      "sdk install gcn",
    ]
  }
}
