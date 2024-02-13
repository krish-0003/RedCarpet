#################################
#  ecs-service/autoscalling.tf  #
#################################

resource "aws_appautoscaling_target" "autoscaling" {
  count              = var.autoscaling ? 1 : 0
  max_capacity       = var.max_autoscaling_task_count
  min_capacity       = var.desired_task_count
  resource_id        = "service/${aws_ecs_service.service.cluster}/${aws_ecs_service.service.name}"
  role_arn           = "arn:${local.aws_partition}:iam::${local.account_id}:role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "autoscaling" {
  count              = var.autoscaling ? 1 : 0
  name               = aws_ecs_service.service.name
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.autoscaling[0].resource_id
  scalable_dimension = aws_appautoscaling_target.autoscaling[0].scalable_dimension
  service_namespace  = aws_appautoscaling_target.autoscaling[0].service_namespace

  target_tracking_scaling_policy_configuration {
    scale_in_cooldown  = 90
    scale_out_cooldown = 90
    target_value       = var.autoscaling_target_cpu

    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
  }
}
