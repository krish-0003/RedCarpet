#########################
#  stack/variables.tf  #
########################

variable "aws_profile" {
  description = "AWS profile to use"
}

variable "apigw_cors_allowed_origin" {
  description = "APIGW allowed origins for CORS"
  default     = ""
}

variable "aws_region" {
  description = "AWS region to use"
}

variable "env" {
  description = "Name of project environment"
}

variable "prefix" {
  description = "Resource name prefix"
}

variable "project" {
  description = "project-name"
  type        = string
}

variable "repo_name" {
  description = "Repository Name"
}

variable "global_parameter_path_prefix" {
  description = "Global parameter path prefix"
}

variable "port" {
  type        = string
  description = "port number"
}

variable "image_tag" {
  type        = string
  description = "image tag"
}
