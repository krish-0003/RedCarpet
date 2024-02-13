####################
#  stack/ouptuts.tf  #
####################

output "apigw_id" {
  value     = local.apigw_id
  sensitive = true
}

output "ecr_repository_url" {
  value = module.ecs_app.ecr_repository_url
}

output "ecs_migration_task_sg_id" {
  value = module.ecs_app.security_group_id
}

output "ecs_cluster_id" {
  value = local.ecs_cluster_id
}

output "ecs_migration_task_definition_name" {
  value = module.ecs_task_definition_db_migration.name
}

output "subnet_ids" {
  value     = local.subnet_ids
  sensitive = true
}