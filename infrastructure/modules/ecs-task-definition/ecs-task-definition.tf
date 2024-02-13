################################################
#  ecs-task-defination/ecs-task-defination.tf  #
################################################

locals {
  portMappings = [
    {
      hostPort      = var.port
      protocol      = "tcp"
      containerPort = var.port
    }
  ]
}

resource "aws_cloudwatch_log_group" "ecs_task" {
  name              = "/aws/ecs/${var.name}"
  retention_in_days = length(regexall("-prod-", var.name)) > 0 ? 180 : 60
}

resource "aws_ecs_task_definition" "task" {
  family                   = var.name
  execution_role_arn       = var.task_execution_role_arn
  task_role_arn            = var.task_role_arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  container_definitions = jsonencode(
    [
      {
        logConfiguration = {
          logDriver = "awslogs"
          options = {
            awslogs-group         = aws_cloudwatch_log_group.ecs_task.name
            awslogs-region        = local.region
            awslogs-stream-prefix = "ecs"
          }
        },
        name  = var.name
        image = var.image
        portMappings = var.port > 0 ? [
          {
            hostPort      = var.port
            protocol      = "tcp"
            containerPort = var.port
          }
        ] : []
        environment = var.environment_variables
        secrets     = var.secret_environment_variables
        command     = ["sh", "-c", var.command]
      }
    ]
  )
}
