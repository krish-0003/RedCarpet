#############################
#  nlb-listner/variables.tf  #
#############################

variable "health_check" {
  description = "NLB target group helath check path"
}

variable "nlb_arn" {
  description = "NLB arn"
}

variable "port" {
  description = "Listener port"
  default     = 80
}

variable "target_group_name" {
  description = "Target group name"
}

variable "vpc_id" {
  description = "VPC id"
}