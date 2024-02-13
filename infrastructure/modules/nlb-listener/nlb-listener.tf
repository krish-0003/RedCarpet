################################
#  nlb-listner/nlb-listner.tf  #
################################

resource "aws_lb_listener" "listener" {
  load_balancer_arn = var.nlb_arn
  port              = var.port
  protocol          = "TCP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_group.arn
  }
}

resource "aws_lb_target_group" "target_group" {
  name                 = var.target_group_name
  port                 = var.port
  protocol             = "TCP"
  target_type          = "ip"
  deregistration_delay = 60
  vpc_id               = var.vpc_id

  health_check {
    path                = var.health_check
    interval            = 60
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}