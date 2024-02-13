## RDS
resource "aws_security_group_rule" "rds_api" {
  security_group_id        = data.aws_ssm_parameter.rds_security_group_id.value
  type                     = "ingress"
  protocol                 = "tcp"
  from_port                = data.aws_ssm_parameter.rds_port.value
  to_port                  = data.aws_ssm_parameter.rds_port.value
  source_security_group_id = module.ecs_app.security_group_id
  description              = "ECS API"
}