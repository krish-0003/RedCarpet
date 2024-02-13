####################################
#  ecs-task-defination/outputs.tf  #
####################################

output "name" {
  value = aws_ecs_task_definition.task.family
}

output "arn" {
  value = aws_ecs_task_definition.task.arn
}