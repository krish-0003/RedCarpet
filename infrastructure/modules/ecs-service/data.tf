#########################
#  ecs-service/data.tf  #
#########################

data "aws_partition" "current" {}
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

locals {
  aws_partition = data.aws_partition.current.partition
  account_id    = data.aws_caller_identity.current.account_id
  region        = data.aws_region.current.name
}