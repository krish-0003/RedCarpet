resource "aws_ecs_cluster_capacity_providers" "capacity_providers" {
  cluster_name       = var.cluster_name
  capacity_providers = var.capacity_providers


  dynamic "default_capacity_provider_strategy" {
    for_each = var.default_capacity_provider_strategy
    content {
      weight            = default_capacity_provider_strategy.value
      capacity_provider = default_capacity_provider_strategy.key
    }

  }
}