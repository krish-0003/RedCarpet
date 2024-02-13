#####################
#  ssm/outputs.tf  #
#####################


output "ssm_parameter_keys" {
  value = [for k, v in var.parameters : "${var.prefix}/${var.module_name}/${k}"]
}