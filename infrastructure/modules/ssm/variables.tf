######################
#  ssm/variables.tf  #
######################

variable "parameters" {
  description = "map of parameter key and values for creating ssm params"
}

variable "prefix" {
  type        = string
  description = "prefix that will be used for storing ssm"
}

variable "module_name" {
  type        = string
  description = "name of module or component for which ssm parameters will be stored"
}