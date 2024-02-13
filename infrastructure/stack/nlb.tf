####################
#  stack/nlb.tf  #
####################

module "nlb_listener_api" {
  source            = "../modules/nlb-listener"
  nlb_arn           = data.aws_ssm_parameter.nlb_arn.value
  target_group_name = "${var.prefix}-api"
  port              = var.port
  vpc_id            = data.aws_ssm_parameter.vpc_id.value
  health_check      = "/health-check"
  providers = {
    aws = aws
  }
}
