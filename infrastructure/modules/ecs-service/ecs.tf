#################################
#  ecs-service/ecs.tf  #
#################################

module "ecs_task_definition" {
  source                       = "../ecs-task-definition"
  name                         = var.task_definition_name
  task_execution_role_arn      = aws_iam_role.ecs_task_execution.arn
  task_role_arn                = aws_iam_role.task.arn
  image                        = var.image
  task_cpu                     = var.task_cpu
  task_memory                  = var.task_memory
  command                      = var.command
  environment_variables        = var.environment_variables
  secret_environment_variables = var.secret_environment_variables
  port                         = var.container_port
  providers = {
    aws = aws
  }
}

resource "aws_ecs_service" "service" {
  name                              = module.ecs_task_definition.name
  cluster                           = var.ecs_cluster_id
  task_definition                   = module.ecs_task_definition.arn
  desired_count                     = var.desired_task_count
  health_check_grace_period_seconds = var.health_check_grace_period_seconds

  dynamic "capacity_provider_strategy" {
    for_each = var.default_capacity_provider_strategy
    content {
      weight            = capacity_provider_strategy.value
      capacity_provider = capacity_provider_strategy.key
    }

  }

  network_configuration {
    security_groups = [module.security_group_ecs.id]
    subnets         = var.subnets
  }

  dynamic "load_balancer" {
    for_each = toset(var.target_groups_arn)
    content {
      target_group_arn = load_balancer.key
      container_name   = module.ecs_task_definition.name
      container_port   = var.container_port
    }
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  lifecycle {
    ignore_changes  = [desired_count]
    prevent_destroy = true
  }
}


  