####################################
#  ecs-task-defination/variables.tf  #
####################################

variable "command" {
  description = "Task command"
}

variable "image" {
  description = "ECR image"
}

variable "name" {
  description = "ECS task definition name"
}

variable "environment_variables" {
  description = "ECS secrets environment variables"
}

variable "port" {
  description = "ECS container port"
  type        = number
  default     = 0
}

variable "secret_environment_variables" {
  description = "ECS secrets environment variables"
}

variable "task_cpu" {
  description = "ECS fargate task cpu"
}

variable "task_memory" {
  description = "ECS fargate task memory"
}

variable "task_execution_role_arn" {
  description = "ECS task execution role arn"
}

variable "task_role_arn" {
  description = "ECS task role arn"
  default     = null
}

