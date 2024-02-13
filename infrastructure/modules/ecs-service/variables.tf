##############################
#  ecs-service/variables.tf  #
##############################

variable "autoscaling" {
  description = "Autoscaling enabled"
  default     = false
}

variable "autoscaling_target_cpu" {
  description = "Autoscaling target cpu"
  default     = null
}

variable "command" {
  description = "Task command"
}

variable "container_port" {
  description = "ECS container port"
  type        = number
}

variable "desired_task_count" {
  description = "ECS desired task count to be running"
  default     = 1
}

variable "ecs_cluster_id" {
  description = "ECS cluster id"
}

variable "health_check_grace_period_seconds" {
  description = "Task warm up time before health checks"
  default     = "30"
}

variable "image" {
  description = "ECR image"
}

variable "max_autoscaling_task_count" {
  description = "Maximum task count in autoscaling"
  default     = ""
}

variable "security_group_egress_rules" {
  description = "Security group egress rule"
  default = [
    {
      protocol    = -1
      from_port   = 0
      to_port     = 0
      cidr_blocks = ["0.0.0.0/0"]
    }
  ]
}

variable "security_group_ingress_rules" {
  description = "Security group ingress rule"
  default     = []
}

variable "ssm_kms_key_arn" {
  description = "SSM KMS key arn"
}

variable "subnets" {
  description = "VPC subnets id"
}

variable "environment_variables" {
  description = "ECS secrets environment variables"
}

variable "secret_environment_variables" {
  description = "ECS secrets environment variables"
}

variable "task_definition_name" {
  description = "ECS task definition name"
}

variable "task_cpu" {
  description = "ECS fargate task cpu"
}

variable "task_memory" {
  description = "ECS fargate task memory"
}

variable "target_groups_arn" {
  description = "Target groups arn"
  type        = list(any)
  default     = []
}

variable "vpc_id" {
  description = "VPC id"
}

variable "default_capacity_provider_strategy" {
  description = "proper weights to associate to Fargate & Fargate spot"
  type        = map(number)
}

