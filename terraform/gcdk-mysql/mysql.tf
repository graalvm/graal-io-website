resource "oci_mysql_mysql_db_system" "GCDK-MySQL-guide-DB" {
    admin_password = "Welcome_1"
    admin_username = "admin"
    availability_domain = data.oci_identity_availability_domain.ad1.name
    backup_policy {
    	is_enabled = "false"
    }
    compartment_id = var.compartment_ocid
    crash_recovery = "ENABLED"
    data_storage_size_in_gb = "1024"
    database_management = "ENABLED"
    deletion_policy {
    	automatic_backup_retention = "DELETE"
    	final_backup = "SKIP_FINAL_BACKUP"
    	is_delete_protected = "false"
    }
    description = "DB for use with GCDK guide"
    display_name = "GCDK-MySQL-guide-DB"
    freeform_tags = {
    	"Template" = "Production"
    }
    port = "3306"
    port_x = "33060"
    shape_name = "MySQL.VM.Standard.E4.4.64GB"
    subnet_id = oci_core_subnet.private_subnet.id
}
