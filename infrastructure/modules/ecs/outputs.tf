#####################
#  ecs/outputs.tf  #
#####################
output "ecr_name" {
  value = var.create_ecr ? module.ecr[0].name : ""
}

output "ecr_repository_url" {
  value = var.create_ecr ? module.ecr[0].repository_url : ""
}

output "ecs_cluster_name" {
  value = module.ecs_service.cluster_name
}

output "ecs_role_name" {
  value = module.ecs_service.role_name
}

output "ecs_service_name" {
  value = module.ecs_service.service_name
}

output "ecs_task_execution_role_arn" {
  value = module.ecs_service.execution_role_arn
}

output "ecs_task_execution_role_name" {
  value = module.ecs_service.execution_role_name
}

output "environment_variables" {
  value = local.environment_variables
}

output "secret_environment_variables" {
  value = local.secret_environment_variables
}

output "security_group_id" {
  value = module.ecs_service.security_group_id
}
