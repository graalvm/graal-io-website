provider "oci" {}

resource "oci_apigateway_deployment" "gcdk_serverless_deployment" {
	compartment_id = var.compartment_ocid
	display_name = "gcdk_serverless_deployment"
	gateway_id = oci_apigateway_gateway.gcdk_serverless_gateway.id
	path_prefix = "/store"
	specification {
		logging_policies {
			execution_log {
				log_level = "INFO"
			}
		}
		request_policies {
			mutual_tls {
				is_verified_certificate_required = "false"
			}
		}
		/*
		routes {
			backend {
				function_id = "ocid1.fnfunc.oc1.phx.aaaaaaaah2co7dtv2oa7d5ztgezikrg3upp522l5ixpk4yj2zf7zlxzn2rzq"
				type = "ORACLE_FUNCTIONS_BACKEND"
			}
			logging_policies {
			}
			methods = ["ANY"]
			path = "/{path}"
		}
		*/
		routes {
			backend {
				body = "{ \"test_result\": \"OK\"}"
				status = "200"
				type = "STOCK_RESPONSE_BACKEND"
			}
			logging_policies {
			}
			methods = ["ANY"]
			path = "/test"
		}
	}
}