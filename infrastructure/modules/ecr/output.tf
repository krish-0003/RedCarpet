###################
#  ecr/output.tf  #
###################

output "name" {
  value = aws_ecr_repository.repository.name
}

output "repository_url" {
  value = aws_ecr_repository.repository.repository_url
}