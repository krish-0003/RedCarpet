####################
#  stack/data.tf  #
####################

#----------------------------------------------------------------------------
# AWS Account Identity
#----------------------------------------------------------------------------
data "aws_caller_identity" "current" {}

#----------------------------------------------------------------------------
#  Parameter store
#----------------------------------------------------------------------------
## API Gateway
data "aws_ssm_parameter" "apigw_id" {
  name = "${var.global_parameter_path_prefix}/apigw/${var.prefix}/id"
}

data "aws_ssm_parameter" "apigw_root_resource_id" {
  name = "${var.global_parameter_path_prefix}/apigw/${var.prefix}/root_resource_id"
}

data "aws_ssm_parameter" "apigw_v1_resource_id" {
  name = "${var.global_parameter_path_prefix}/apigw/${var.prefix}/v1_resource_id"
}

data "aws_ssm_parameter" "apigw_v1_resource_path" {
  name = "${var.global_parameter_path_prefix}/apigw/${var.prefix}/v1_resource_path"
}

data "aws_ssm_parameter" "apigw_vpc_link_id" {
  name = "${var.global_parameter_path_prefix}/apigw/${var.prefix}/vpc_link_id"
}

data "aws_ssm_parameter" "apigw_domain_name" {
  name = "${var.global_parameter_path_prefix}/apigw/${var.prefix}/domain_name"
}

## VPC
data "aws_ssm_parameter" "vpc_id" {
  name = "${var.global_parameter_path_prefix}/vpc/${var.prefix}/vpc_id"
}

data "aws_ssm_parameter" "ecs_private_subnet_ids" {
  name = "${var.global_parameter_path_prefix}/vpc/${var.prefix}/ecs_subnet_id"
}

## ECS
data "aws_ssm_parameter" "ecs_cluster_name" {
  name = "${var.global_parameter_path_prefix}/ecs/${var.prefix}/name"
}

## NLB
data "aws_ssm_parameter" "nlb_arn" {
  name = "${var.global_parameter_path_prefix}/nlb/${var.prefix}/arn"
}

data "aws_ssm_parameter" "nlb_dns" {
  name = "${var.global_parameter_path_prefix}/nlb/${var.prefix}/dns_name"
}

data "aws_ssm_parameter" "nlb_ips" {
  name = "${var.global_parameter_path_prefix}/nlb/${var.prefix}/nlb_ips"
}

## RDS
data "aws_ssm_parameter" "rds_security_group_id" {
  name = "${var.global_parameter_path_prefix}/rds/${var.prefix}/security_group_id"
}

data "aws_ssm_parameter" "rds_port" {
  name = "${var.global_parameter_path_prefix}/rds/${var.prefix}/port"
}

## Web
data "aws_ssm_parameter" "web_domain_name" {
  name = "${var.global_parameter_path_prefix}/repo/th-redcarpet-web/domain_name"
}

## Domain Name
data "aws_ssm_parameter" "domain_name" {
  name = "${var.global_parameter_path_prefix}/domain"
}

## SES
data "aws_ssm_parameter" "ses_domain_name" {
  name = "${var.global_parameter_path_prefix}/ses/${var.prefix}/domain"
}



#----------------------------------------------------------------------------
#  Other data sources
#----------------------------------------------------------------------------
## KMS
data "aws_kms_alias" "ssm" {
  name = "alias/aws/ssm"
}

#----------------------------------------------------------------------------
#  Locals
#----------------------------------------------------------------------------
locals {
  account_id     = data.aws_caller_identity.current.account_id
  apigw_id       = data.aws_ssm_parameter.apigw_id.value
  subnet_ids     = jsondecode(data.aws_ssm_parameter.ecs_private_subnet_ids.value)
  ecs_cluster_id = nonsensitive(data.aws_ssm_parameter.ecs_cluster_name.value)
  web_url        = "https://${data.aws_ssm_parameter.web_domain_name.value}"
  domain_name    = data.aws_ssm_parameter.domain_name.value
  backend_url    = "https://${data.aws_ssm_parameter.apigw_domain_name.value}"

  ## SES
  ses_domain   = nonsensitive(data.aws_ssm_parameter.ses_domain_name.value)
  ses_arn      = "arn:aws:ses:${var.aws_region}:${local.account_id}:identity/${local.ses_domain}"
  ses_email_id = "noreply@${local.ses_domain}"
}
