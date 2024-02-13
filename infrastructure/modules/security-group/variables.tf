#################################
#  security-group/variables.tf  #
#################################

variable "description" {
  description = "Security group description"
  type        = string
  default     = ""
}

variable "egress" {
  description = "Egress rules"
  type        = list(any)
  default = [
    {
      protocol    = -1
      from_port   = 0
      to_port     = 0
      cidr_blocks = ["0.0.0.0/0"]
    }
  ]
}

variable "ingress" {
  description = "Ingress rules"
  type        = any
  default     = []
}

variable "name" {
  description = "Security group id"
  type        = string
}

variable "tags" {
  description = "Tags for resources"
  type        = map(any)
  default     = {}
}

variable "vpc_id" {
  description = "VPC id"
  type        = string
}