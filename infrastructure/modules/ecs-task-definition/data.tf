#################################
#  ecs-task-defination/data.tf  #
#################################

data "aws_region" "current" {}

locals {
  region = data.aws_region.current.name
}