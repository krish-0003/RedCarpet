####################################
#  ecs-capacity-provider/variable.tf  #
####################################


variable "cluster_name" {
  description = "ecs cluster name"
  type        = string
}

variable "capacity_providers" {
  description = "list of capacity providers"
  type        = list(string)
}

variable "default_capacity_provider_strategy" {
  description = "proper weights to associate to Fargate & Fargate spot"
  type        = map(number)
}
