############################
#  nlb-listner/outputs.tf  #
############################

output "port" {
  value = aws_lb_listener.listener.port
}

output "target_group_arn" {
  value = aws_lb_target_group.target_group.arn
}

output "target_group_arn_suffix" {
  value = aws_lb_target_group.target_group.arn_suffix
}