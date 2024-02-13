SHELL=/bin/bash
_ENV?=dev
_PROJECT=redcarpet
_PREFIX=$(_PROJECT)-$(_ENV)
_AWS_PROFILE=$(_PREFIX)
_AWS_REGION=us-west-2
TERRAGRUNT_PATH=infrastructure/environments/$(_ENV)/
REPO_NAME=th-redcarpet-api
GITHUB_SHA?=$(shell git rev-parse HEAD)
SCRIPTS=infrastructure/scripts
_AWS_SSO_URL=https://techholding.awsapps.com/start#/

.PHONY: build

.EXPORT_ALL_VARIABLES:
TF_VAR_env=$(_ENV)
TF_VAR_prefix=$(_PREFIX)
TF_VAR_project=$(_PROJECT)
TF_VAR_aws_profile=$(_AWS_PROFILE)
TF_VAR_aws_region=$(_AWS_REGION)
TF_VAR_image_tag=$(GITHUB_SHA)
TF_VAR_repo_name=$(REPO_NAME)
TF_VAR_tf_bucket=$(TF_VAR_prefix)-terraform
TF_VAR_global_parameter_path_prefix=/$(_PROJECT)/$(_ENV)

## login into AWS SSO for AWS CLI
awscli-sso-login:
	@aws sso login --profile $(TF_VAR_aws_profile)

## setup aws access for CICD
awscli-ci:
	@./$(SCRIPTS)/awscli

# To set aws sso login local
# Use: _ENV=dev/qa/prod make awscli-local role=xyz account_id=123456789
awscli-local:
	@./$(SCRIPTS)/awscli_local $(role) $(account_id)

init-upgrade: 
	@cd $(TERRAGRUNT_PATH) && terragrunt init --upgrade

#commnand to change the backend in which tfstate file is stored
migrate-state:
	@cd $(TERRAGRUNT_PATH) && terragrunt init --migrate-state

apply console destroy graph plan output providers init state show:
	@cd $(TERRAGRUNT_PATH) && terragrunt $@

apply-ci:
	@cd $(TERRAGRUNT_PATH) && terragrunt apply -auto-approve

rmtflock:
	@cd $(TERRAGRUNT_PATH) && terragrunt force-unlock $(lock_id)

tftarget:
	@cd $(TERRAGRUNT_PATH) && terragrunt apply -target $(resource_id)

tfoutput:
	@cd $(TERRAGRUNT_PATH) && terragrunt output --json 2> /dev/null

tfvalidate:
	@cd $(shell make init 2>&1 |grep "working directory to" |awk '{print $$8}') && terraform validate

tfstate:
	@cd $(TERRAGRUNT_PATH) && terragrunt state list

# Command to remove state for specified resource
# Use make rmstate resource=aws_iam_role_policy.ecs_task
rmstate:
	@cd $(TERRAGRUNT_PATH) && terragrunt state rm $(resource)

fmt:
	@terraform fmt --recursive
	@terragrunt hclfmt

tf:
	@tfswitch
	@tgswitch

clean:
	@rm -rf build node_modules
	@yarn --silent
#--prod=true

lint: clean
	@echo "----- Linting -----"
	@yarn lint

# tests: clean
# 	@echo $(shell make getvars) | tr ' ' '\n' > .env
# 	@yarn test
# 	@rm -rf .env

## docker image Building
build-push: build tag push
# build docker image
build:
	@$(eval ECR_REPO_URI=$(shell make tfoutput | jq -r '.ecr_repository_url.value'))
	@echo "---- Building docker image $(ECR_REPO_URI):$(TF_VAR_image_tag) ----"
	@docker build -t $(TF_VAR_repo_name) . --platform=linux/amd64
# get ecr uri
ecr-uri:
	@make tfoutput | jq -r '.ecr_repository_url.value'
# docker image tagging
tag:
	@$(eval ECR_REPO_URI=$(shell make tfoutput | jq -r '.ecr_repository_url.value'))
	@echo "---- Tagging docker image ----"
	@echo $(ECR_REPO_URI):$(TF_VAR_image_tag)
	@docker tag $(TF_VAR_repo_name) $(ECR_REPO_URI):latest
	@docker tag $(TF_VAR_repo_name) $(ECR_REPO_URI):$(TF_VAR_image_tag)
# ecr login
ecr-login:
	@echo "---- Login into ECR ----"
	@$(eval ECR_REPO_URI=$(shell make tfoutput | jq -r '.ecr_repository_url.value'))
	@aws ecr get-login-password  --region $(_AWS_REGION) --profile $(_AWS_PROFILE) | docker login --username AWS --password-stdin $(ECR_REPO_URI)
# push docker image to ecr
push: ecr-login
	@echo "---- Pushing image into ECR ----"
	@$(eval ECR_REPO_URI=$(shell make tfoutput | jq -r '.ecr_repository_url.value'))
	@docker push $(ECR_REPO_URI):$(TF_VAR_image_tag)
	@docker push $(ECR_REPO_URI):latest

# docker image scanning with trivy
image-scan:
	@$(eval ECR_REPO_URI=$(shell make tfoutput | jq -r '.ecr_repository_url.value'))
	@echo "--- scaning docker image $(ECR_REPO_URI) ---"
	@docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v $PWD:/tmp/.cache aquasec/trivy image $(TF_VAR_repo_name)

## Run Migration
plan-db-migration-task-definition:
	@cd $(TERRAGRUNT_PATH) && terragrunt plan -target module.ecs_task_definition_db_migration

apply-db-migration-task-definition:
	@cd $(TERRAGRUNT_PATH) && terragrunt apply -target module.ecs_task_definition_db_migration -auto-approve

run-db-migration:
	@$(eval SECURITY_GROUP=$(shell make tfoutput | jq -r '.ecs_migration_task_sg_id.value'))
	@$(eval ECS_CLUSTER=$(shell make tfoutput | jq -r '.ecs_cluster_id.value'))
	@$(eval TASK_DEFINITION=$(shell make tfoutput | jq -r '.ecs_migration_task_definition_name.value'))
	@$(eval SUBNETS=$(shell make tfoutput | jq -r '.subnet_ids.value'))
	AWS_PROFILE=$(_AWS_PROFILE) AWS_REGION=$(_AWS_REGION) PREFIX=$(TF_VAR_prefix) SUBNETS=$(shell echo $(SUBNETS) | sed 's/\ //g') ./$(SCRIPTS)/run_migration

## Deploy API Gateway
deploy-apigw:
	@$(eval APIGW_ID=$(shell make tfoutput | jq -r '.apigw_id.value'))
	@aws --profile $(_AWS_PROFILE) --region $(_AWS_REGION) apigateway create-deployment --rest-api-id $(APIGW_ID) --stage-name $(_ENV)

## For secrets envs AWS ssm
## Use: _ENV=dev/qa/prod make putvar path=google var=foo=bar
# add terraform vars in aws ssm parameter store
putvar:
	@./$(SCRIPTS)/putvar $(TF_VAR_global_parameter_path_prefix)/$(path) '$(var)'

# show all vars from aws ssm parameter store
getvars:
	@./$(SCRIPTS)/getvars $(TF_VAR_global_parameter_path_prefix)/$(path)

# Terraform code scan using Docker image of aquasec/tfsec-alpine
terraform-scan:
	@docker run -v $(PWD):/infrastructure aquasec/tfsec-alpine /infrastructure
