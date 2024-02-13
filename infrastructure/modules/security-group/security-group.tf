######################################
#  security-group/security-group.tf  #
######################################

resource "aws_security_group" "sg" {
  name        = var.name
  description = length(var.description) > 0 ? var.description : "${replace((var.name), "-", " ")} security group"
  vpc_id      = var.vpc_id

  tags = merge(
    {
      Name = var.name
    },
    var.tags
  )
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group_rule" "egress" {
  for_each                 = { for index, rule in var.egress : index => rule }
  security_group_id        = aws_security_group.sg.id
  type                     = "egress"
  protocol                 = lookup(each.value, "protocol", "TCP")
  from_port                = try(lookup(each.value, "from_port"), lookup(each.value, "port"))
  to_port                  = try(lookup(each.value, "to_port"), lookup(each.value, "port"))
  source_security_group_id = lookup(each.value, "source_security_group_id", null) == null ? null : lookup(each.value, "source_security_group_id")
  cidr_blocks              = lookup(each.value, "cidr_blocks", null) == null ? null : lookup(each.value, "cidr_blocks")
  ipv6_cidr_blocks         = try(lookup(each.value, "ipv6_cidr_blocks", null) == null ? null : lookup(each.value, "ipv6_cidr_blocks"))
  self                     = try(lookup(each.value, "self"), null)
  description              = lookup(each.value, "description", "no description added")
}

resource "aws_security_group_rule" "ingress" {
  for_each                 = { for index, rule in var.ingress : index => rule }
  security_group_id        = aws_security_group.sg.id
  type                     = "ingress"
  protocol                 = lookup(each.value, "protocol", "TCP")
  from_port                = try(lookup(each.value, "from_port"), lookup(each.value, "port"))
  to_port                  = try(lookup(each.value, "to_port"), lookup(each.value, "port"))
  source_security_group_id = lookup(each.value, "source_security_group_id", null) == null ? null : lookup(each.value, "source_security_group_id")
  cidr_blocks              = lookup(each.value, "cidr_blocks", null) == null ? null : lookup(each.value, "cidr_blocks")
  ipv6_cidr_blocks         = try(lookup(each.value, "ipv6_cidr_blocks", null) == null ? null : lookup(each.value, "ipv6_cidr_blocks"))
  self                     = try(lookup(each.value, "self"), null)
  description              = lookup(each.value, "description", "no description added")
}
