####################
#  stack/ecs.tf  #
####################

#-------------------------------------------------------------------------------
# ECS App
#-------------------------------------------------------------------------------
module "ecs_app" {
  source = "../modules/ecs"

  ## ECS
  name         = "${var.prefix}-api"
  cluster_name = data.aws_ssm_parameter.ecs_cluster_name.value

  ## ECS Cluster Capacity providers
  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  ## task definition
  image_tag   = var.image_tag
  port        = var.port
  task_cpu    = 256
  task_memory = 512

  ## ecs service
  desired_task_count                = 1
  autoscaling                       = false
  autoscaling_target_cpu            = 70
  max_autoscaling_task_count        = 5
  command                           = "npm start"
  health_check_grace_period_seconds = 5
  default_capacity_provider_strategy = {
    "FARGATE"      = 1,
    "FARGATE_SPOT" = 1
  }
  target_groups_arn = [
    module.nlb_listener_api.target_group_arn
  ]
  ssm_kms_key_arn = data.aws_kms_alias.ssm.target_key_arn

  # Environment variables
  environment_variables = {
    DB_DIALECT                          = "postgres"
    JWT_ACCESS_TOKEN_EXPIRY             = "1h"
    JWT_ACCESS_TOKEN_BUFFER_EXPIRY_TIME = "5m"
    EXPRESS_SESSION_EXPIRY_TIME         = "30"
    GMAIL_SERVICE                       = "Gmail"
    TIME_BETWEEN_MAILS                  = "24"
    PORT                                = var.port
    GOOGLE_AUTH_URL                     = "https://www.googleapis.com/oauth2/v3/userinfo"
    FRONTEND_ORIGIN_URL                 = local.web_url
    SES_EMAIL_ID                        = local.ses_email_id
    BACKEND_ORIGIN_URL                  = local.backend_url
  }

  secret_environment_variables = {
    ## DB
    DB_DATABASE_NAME = "${var.global_parameter_path_prefix}/rds/${var.prefix}/db_name"
    DB_USERNAME      = "${var.global_parameter_path_prefix}/rds/${var.prefix}/db_username"
    DB_HOST          = "${var.global_parameter_path_prefix}/rds/${var.prefix}/endpoint"
    DB_PASSWORD      = "${var.global_parameter_path_prefix}/rds/${var.prefix}/db_password"
    DB_PORT          = "${var.global_parameter_path_prefix}/rds/${var.prefix}/port"
    ## Google
    GOOGLE_OAUTH_CLIENT_ID     = "${var.global_parameter_path_prefix}/google/auth_client_id"
    GOOGLE_OAUTH_CLIENT_SECRET = "${var.global_parameter_path_prefix}/google/auth-client-secret"
    ## JWT
    JWT_ACCESS_TOKEN_KEY = "${var.global_parameter_path_prefix}/repo/${var.repo_name}/jwt-access-token-key"
    ## Gmail
    GMAIL_USER     = "${var.global_parameter_path_prefix}/repo/${var.repo_name}/gmail-user"
    GMAIL_PASSWORD = "${var.global_parameter_path_prefix}/repo/${var.repo_name}/gmail-password"
    ## APPROVAL EMAIL ID
    APPROVAL_EMAIL_US    = "${var.global_parameter_path_prefix}/repo/${var.repo_name}/approval-email-us"
    APPROVAL_EMAIL_INDIA = "${var.global_parameter_path_prefix}/repo/${var.repo_name}/approval-email-india"
  }

  ## VPC
  vpc_id  = data.aws_ssm_parameter.vpc_id.value
  subnets = jsondecode(data.aws_ssm_parameter.ecs_private_subnet_ids.value)
  security_group_ingress_rules = [
    {
      from_port   = var.port
      to_port     = var.port
      cidr_blocks = jsondecode(data.aws_ssm_parameter.nlb_ips.value)
      description = "API NLB"
    }
  ]
  providers = {
    aws = aws
  }
}

#----------------------------------------------------------------------
# ECS task for DB migration
#----------------------------------------------------------------------
module "ecs_task_definition_db_migration" {
  source                       = "../modules/ecs-task-definition"
  name                         = "${var.prefix}-api-db-migration"
  task_execution_role_arn      = module.ecs_app.ecs_task_execution_role_arn
  image                        = "${module.ecs_app.ecr_repository_url}:${var.image_tag}"
  task_cpu                     = 256
  task_memory                  = 512
  command                      = "npx sequelize-cli db:migrate"
  environment_variables        = module.ecs_app.environment_variables
  secret_environment_variables = module.ecs_app.secret_environment_variables
  providers = {
    aws = aws
  }
}

