###################################
#  ecs-service/security-group.tf  #
###################################

module "security_group_ecs" {
  source  = "../security-group"
  name    = "${module.ecs_task_definition.name}-ecs"
  vpc_id  = var.vpc_id
  egress  = var.security_group_egress_rules
  ingress = var.security_group_ingress_rules
  providers = {
    aws = aws
  }
}
