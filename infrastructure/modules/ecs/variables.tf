#####################
#  ecs/variable.tf  #
#####################

variable "autoscaling" {
  description = "Autoscaling enabled"
  default     = false
}

variable "autoscaling_target_cpu" {
  description = "Autoscaling target cpu"
  default     = null
}

variable "desired_task_count" {
  description = "ECS desired task count to be running"
  default     = 1
}

variable "cluster_name" {
  description = "ECS cluster id"
}

variable "command" {
  description = "Container command or Entrypoint"
}

variable "ecr_repository_url" {
  description = "ECR repository url"
  default     = ""
}

variable "create_ecr" {
  description = "Create ECR repo"
  type        = bool
  default     = true
}

variable "health_check_grace_period_seconds" {
  description = "Task warm up time before health checks"
  default     = 0
}

variable "image_tag" {
  description = "ECR image tag"
}

variable "max_autoscaling_task_count" {
  description = "Maximum task count in autoscaling"
  default     = ""
}

variable "name" {
  description = "ECS name"
}

variable "port" {
  description = "ECS task container port"
  type        = number
  default     = 0
}

variable "security_group_ingress_rules" {
  description = "Security group ingress rule"
  default     = []
}

variable "environment_variables" {
  description = "ECS task secrets"
  default     = {}
}

variable "ssm_kms_key_arn" {
  description = "SSM KMS key arn"
}

variable "secret_environment_variables" {
  description = "ECS secret vars from ssm"
  default     = {}
}

variable "subnets" {
  description = "VPC subnets id"
  type        = any
}

variable "task_cpu" {
  description = "ECS fargate task cpu"
}

variable "task_memory" {
  description = "ECS fargate task memory"
}

variable "target_groups_arn" {
  description = "Target group arn"
  type        = list(any)
  default     = []
}

variable "vpc_id" {
  description = "VPC id"
}

variable "capacity_providers" {
  description = "list of capacity providers"
  type        = list(string)
}

variable "default_capacity_provider_strategy" {
  description = "proper weights to associate to Fargate & Fargate spot"
  type        = map(number)
}