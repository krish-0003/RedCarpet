############################
#  ecs-service/outputs.tf  #
############################

output "cluster_name" {
  value = aws_ecs_service.service.cluster
}

output "execution_role_arn" {
  value = aws_iam_role.ecs_task_execution.arn
}

output "execution_role_name" {
  value = aws_iam_role.ecs_task_execution.name
}

output "role_name" {
  value = aws_iam_role.task.name
}

output "role_arn" {
  value = aws_iam_role.task.arn
}

output "security_group_id" {
  value = module.security_group_ecs.id
}

output "service_name" {
  value = aws_ecs_service.service.name
}
