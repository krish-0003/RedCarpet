#####################
#  stack/config.tf  #
#####################

## terraform backend
terraform {
  backend "s3" {}
}

## Provider
# AWS
provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
  default_tags {
    tags = {
      Environment = var.env
      Owner       = "Terraform"
      RepoName    = var.repo_name
    }
  }
}

provider "aws" {
  region  = "us-east-1"
  profile = var.aws_profile
  alias   = "us-east-1"
  default_tags {
    tags = {
      Environment = var.env
      Owner       = "Terraform"
      RepoName    = var.repo_name
    }
  }
}

terraform {
  required_version = "= 1.4.2"

  required_providers {
    aws  = "= 4.55.0"
    null = ">= 2.1"
  }
}