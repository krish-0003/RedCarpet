# Red Carpet Backend

## Introduction

Red Carpet is a semi automated support web application for management of Resources of Organization.  
Main purpose is to manage onboarding-offboarding of employees, allocations of hardware devices and software accesses.

Project is developed using React Js for Frontend, Node js for backend and Postgres for database.

## Backend Development

### List of Libraries:

- Express JS: To create APIs with ease.
- Body-Parser: For parsing different formats of data.
- Sequelize: ORM tool, To handle database operations.
- axios : To send http requests.
- google-auth-library : for Google SSO integration.
- @aws-sdk/client-ses : for integrating with AWS SES service.
- @aws-sdk/credential-providers : provider for AWS default credential.
- swagger : for swagger api documentation.
- jest: for writing test-cases.
- Nodemon: Automatically restarts when it detects any changes.

## To get the database up and running on your local machine, please follow these steps:

1. Open your terminal.
2. Run the command 'npx sequelize db:create' to create the database.
3. Once the database has been created, run 'npx sequelize db:migrate' to create all the tables in the database.
4. You should now have access to the database on your local machine.
5. To insert seeders run the command 'npx sequelize-cli db:seed:all'.
6. You should now have access to the seeders on your local machine.

## To Bulk insert users

1. Generate one CSV file with headers employee_id ,first_name, last_name, company_email, branch_id, country_code, phone_number, capacity, personal_email, address, city, state, zipcode, job_title, join_date, status, employment_type, note, role_id
2. Open bulkUsersImport.js file located in src/utils in local.
3. In that file, add values for variable csvFilePath, apiRootPath, authToken.
4. Open terminal for path src/utils.
5. Hit command "node bulkUsersImport.js"
6. If terminal prompts message "data successfully added", means bulk insert was successful.

# Red Carpet Infra

## Prerequisite CLI tools that need to be installed in machine

- [make](https://formulae.brew.sh/formula/make)
- [aws](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-version.html)
- [jq](https://stedolan.github.io/jq/download/)
- [tfswitch](https://tfswitch.warrensbox.com/Install/)
- [tgswitch](https://warrensbox.github.io/tgswitch/index)

## File and Folder Structure

```
.
├── .github/
│   └── workflows/
│       ├── pull_request.yml
│       └── push.yml
│
├── infrastructure/
│   ├── environments/
│   │   ├── dev/
│   │   │   └── terragrunt.hcl
│   │   ├── prod/
│   │   │   └── terragrunt.hcl
│   │   └── terragrunt.hcl
│   │   └── tfsecrets
│   │
│   ├── modules/
│   │   └── terraform modules
│   │
│   ├── scripts/
│   │   └── scripts
│   │
│   └── stack/
│       └── terraform code
│
├── .gitignore
├── .terraform-version
├── .terragrunt-version
├── Makefile
└── README.md
```

- .github/workflows

This folder has Github Actions CI/CD configuration files. `push.yml` and `pull_request.yml` file has workflow configuration and steps that should be executed on commits push on branches which is specified under `on:push:branches` and pull request opened for branches which is specified under `on:pull_request:branches`.

- infrastructure

This folder has all infrastructure code and configuration which has been written with help of terraform and terragrunt.
`environments` folder has environment specific configuration(dev/terragrunt.hcl) and common terragrunt.hcl configuration file.
`modules` folder has terraform modules.
`stack` has collection of terraform resources and referenced modules call that will be manage as single unit for all environments.
`scripts` folder has scripts for configuration of AWS CLI and to put and get variables from AWS SSM parameters.

- .gitignore

A gitignore file specifies intentionally untracked files that Git should ignore.

- .pre-comit-config.yaml

This file contains pre-commit hook to format the terraform code before commiting.

- .terraform-version and .terragrunt-version

These files contains desired terraform and terragrunt version that need to install and set.

- Makefile

It helps here to run terragrunt/terraform and other infra related commands and scripts for different environments without switching directories and running multiple commands for tasks.

## To setup AWSCLI locally and login

Set `_PREFIX` variable value and configure AWS cli profile in your machine with name of `_AWS_PROFILE` variable in Makefile.

After everything setup, run below commands

To Setup AWSCLI with make

```console
_ENV=dev/qa/prod make awscli-local role=xyz account_id=123456789
```

To login into AWS SSO for AWS CLI

```console
_ENV=dev/qa/prod make awscli-sso-login
```

## To Deploy Docker image in ECR Service

If you/Application using ECR Service, Set `_PREFIX` variable value and configure AWS cli profile in your machine with name of `_AWS_PROFILE` variable in Makefile.

After everything setup, run below commands in sequence

To build a Docker Image from a dockerfile, tag and push it to ECR repositiry

```console
make build-push
```

To scan the image

```console
make image-scan
```

After succesfully executing this steps to deploy changes in AWS execute "Deploy Infrastructure" steps mentioned below.

## To Deploy API Gateway

If you/Application using API gateway, Set `_PREFIX` variable value and configure AWS cli profile in your machine with name of `_AWS_PROFILE` variable in Makefile.

After everything setup, run below command

To deploy API Gateway

```console
make deploy-apigw
```

After succesfully executing this steps to deploy changes in AWS execute "Deploy Infrastructure" steps mentioned below.

## To run DB-migration task

If you/Application running DB-migration task, Set `_PREFIX` variable value and configure AWS cli profile in your machine with name of `_AWS_PROFILE` variable in Makefile.

After everything setup, run below command

To run DB migration task

```console
make run-db-migration
```

After succesfully executing this steps to deploy changes in AWS execute "Deploy Infrastructure" steps mentioned below.

## To Deploy Lambda

If you/Application using Lambda Service, Set `_PREFIX` variable value and configure AWS cli profile in your machine with name of `_AWS_PROFILE` variable in Makefile.

For this step, Set `lambda_security_group_id` and `subnets` value in `infra/envs/dev/terragrunt.hcl` file.

After everything setup, run below commands in sequence

Create Lambda code and node_modules zip artifacts,

```console
make package
```

Publish those artifacts in bucket,

```console
make publish
```

After succesfully executing this steps to deploy changes in AWS execute "Deploy Infrastructure" steps mentioned below.

After end of the successfully run previous command, you will get API gateway url `api_url`. To make it working we will need to deploy API gateway.

```console
make deploy-apigw
```

Now run the `api_url` in browser to get successful response.

## Deploy Infrastructure

Set `_PREFIX` variable value and configure AWS cli profile in your machine with name of `_AWS_PROFILE` variable in Makefile.

After everything setup, run below commands in sequence

Initialize terraform to download providers and setup working directory

```console
make init
```

Create terraform plan to preview the changes in infrastructure

```console
make plan
```

If plan looks good then apply that plan to create resources

```console
make apply
```

We have run previous commands for default value of `_ENV` variable which is `dev`(development environment) in Makefile. You can apply same terraform code and steps for different environments. For that you will need to configure AWS cli profile for that environment and create environment folder in `infrastructure/environments` same as `infrastructure/environments/dev` and set configuration for that environment.
To run previous `make` commands for other than default environment, you will need to pass environment variable `_ENV=$ENV` with `make` command. For prod environment,
$ \_ENV=prod make plan

## To Put Infra vars in SSM Parameter

Set `_PREFIX` variable value and configure AWS cli profile in your machine with name of `_AWS_PROFILE` variable in Makefile.

After everything setup, run below command
To put infra vars

```console
_ENV=dev/qa/prod make putinfravar path=/apigw var=domain_name=bar.com
```

This example will store a parameter /apigw/domain_name and as a value of it bar.com will be saved.

## To Get Infra vars from SSM Parameter

Set `_PREFIX` variable value and configure AWS cli profile in your machine with name of `_AWS_PROFILE` variable in Makefile.

After everything setup, run below command
To get infra vars

```console
_ENV=dev/qa/prod make getinfravar path=/apigw/domain_name
```

This example will get the value for /apigw/domain_name path.
