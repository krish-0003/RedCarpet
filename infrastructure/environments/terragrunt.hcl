remote_state {
  backend = "s3"

  config = {
    bucket         = "${local.tf_bucket}"
    key            = "${local.repo_name}/${local.aws_region}/${local.env}/terraform.tfstate"
    profile        = local.aws_profile
    region         = "${local.aws_region}"
    encrypt        = true
    dynamodb_table = "${local.prefix}-tfstate-lock"
  }
}

locals {
  tf_bucket   = get_env("TF_VAR_tf_bucket")
  repo_name   = get_env("TF_VAR_repo_name")
  env         = get_env("TF_VAR_env")
  aws_profile = get_env("TF_VAR_aws_profile")
  aws_region  = get_env("TF_VAR_aws_region")
  prefix      = get_env("TF_VAR_prefix")
}