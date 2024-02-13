variable "apigw_id" {
  description = "API gateway id"
}

variable "fallback_origin" {
  description = "Fallback origin domain when request origin is not in list of allowed origin"
}

variable "resource_id" {
  description = "API gateway resource id"
}

variable "allowed_headers" {
  description = "API gateway cors allowed headers"
}

variable "allowed_methods" {
  description = "API gateway cors allowed methods"
}

variable "allowed_origins" {
  description = "API gateway cors allowed origin"
}