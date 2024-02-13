#################
#  ecs/main.tf  #
#################

module "ecr" {
  count                 = var.create_ecr ? 1 : 0
  source                = "../ecr"
  name                  = var.name
  available_image_count = "10"
  providers = {
    aws = aws
  }
}

locals {
  ecs_task_container_port = var.port
  environment_variables = flatten([
    for name, value in var.environment_variables : {
      name  = name
      value = value
    }
  ])
  secret_environment_variables = flatten([
    for name, valueFrom in var.secret_environment_variables : {
      name      = name
      valueFrom = valueFrom
    }
  ])
}

module "ecs_service" {
  source                             = "../ecs-service"
  ecs_cluster_id                     = var.cluster_name
  container_port                     = local.ecs_task_container_port
  task_definition_name               = var.name
  image                              = var.create_ecr ? "${module.ecr[0].repository_url}:${var.image_tag}" : "${var.ecr_repository_url}:${var.image_tag}"
  command                            = var.command
  environment_variables              = local.environment_variables
  secret_environment_variables       = local.secret_environment_variables
  default_capacity_provider_strategy = var.default_capacity_provider_strategy
  task_cpu                           = var.task_cpu
  task_memory                        = var.task_memory
  target_groups_arn                  = var.target_groups_arn
  desired_task_count                 = var.desired_task_count
  autoscaling                        = var.autoscaling
  max_autoscaling_task_count         = var.max_autoscaling_task_count
  autoscaling_target_cpu             = var.autoscaling_target_cpu
  subnets                            = var.subnets
  vpc_id                             = var.vpc_id
  ssm_kms_key_arn                    = var.ssm_kms_key_arn
  security_group_ingress_rules       = var.security_group_ingress_rules
  health_check_grace_period_seconds  = var.health_check_grace_period_seconds
  providers = {
    aws = aws
  }
}

module "aws_ecs_cluster_capacity_providers" {
  source                             = "../ecs-capacity-provider"
  cluster_name                       = var.cluster_name
  capacity_providers                 = var.capacity_providers
  default_capacity_provider_strategy = var.default_capacity_provider_strategy
}


