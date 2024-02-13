#############################################
#  apigw/apigw-resource-proxy/variables.tf  #
#############################################

variable "apigw_id" {
  description = "API gateway id"
}

variable "authorization" {
  description = "API gateway method authorization"
  default     = "NONE"
}

variable "authorizer_id" {
  description = "API gateway method authorizer id"
  default     = null
}

variable "http_method" {
  description = "API gateway http method"
}

variable "method_request_parameters" {
  description = "Method request parameters"
}

variable "integration_request_parameters" {
  description = "Integration request parameters"
}

variable "integration_uri" {
  description = "API gateway integration uri"
}

variable "parent_resource_id" {
  description = "Parent resource id"
}

variable "path_part" {
  description = "API gateway resoruce path part"
}

variable "vpc_link_id" {
  description = "VPC link id"
}