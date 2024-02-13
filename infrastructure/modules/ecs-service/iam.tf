########################
#  ecs-service/iam.tf  #
########################

### ECS task execution role
resource "aws_iam_role" "ecs_task_execution" {
  name = "${var.task_definition_name}-ecs-task-execution"
  assume_role_policy = jsonencode(
    {
      Version = "2012-10-17"
      Statement = [
        {
          Sid    = ""
          Action = "sts:AssumeRole"
          Effect = "Allow"
          Principal = {
            Service = "ecs-tasks.amazonaws.com"
          }
        }
      ]
      Version = "2012-10-17"
    }
  )
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role       = aws_iam_role.ecs_task_execution.id
  policy_arn = "arn:${local.aws_partition}:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "ecs_task_execution" {
  count = length(var.secret_environment_variables) > 0 ? 1 : 0
  name  = aws_iam_role.ecs_task_execution.name
  role  = aws_iam_role.ecs_task_execution.name
  policy = jsonencode(
    {
      Version = "2012-10-17"
      Statement = [
        {
          Sid      = ""
          Action   = "ssm:GetParameters"
          Effect   = "Allow"
          Resource = [for secret in var.secret_environment_variables : "arn:${local.aws_partition}:ssm:${local.region}:${local.account_id}:parameter${secret["valueFrom"]}"]
        },
        {
          Sid      = ""
          Action   = "kms:Decrypt"
          Effect   = "Allow"
          Resource = var.ssm_kms_key_arn
        }
      ]
    }
  )
}

## ECS task role
resource "aws_iam_role" "task" {
  name = "${var.task_definition_name}-ecs-task"
  assume_role_policy = jsonencode(
    {
      Statement = [
        {
          Action = "sts:AssumeRole"
          Effect = "Allow"
          Principal = {
            Service = "ecs-tasks.amazonaws.com"
          }
        }
      ]
      Version = "2012-10-17"
    }
  )
}
