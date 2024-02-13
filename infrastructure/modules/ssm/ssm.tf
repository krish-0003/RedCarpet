###############
#  ssm/ssm.tf #
###############

#--------------------------------------------------------------------------------------------
# aws ssm parameter module to create ssm parameters we can differenciate it by component name
#---------------------------------------------------------------------------------------------

resource "aws_ssm_parameter" "secrets" {
  for_each = var.parameters

  name  = "${var.prefix}/${var.module_name}/${each.key}"
  type  = "SecureString"
  value = each.value
}