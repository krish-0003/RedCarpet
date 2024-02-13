################
#  ecr/ecr.tf  #
################

resource "aws_ecr_repository" "repository" {
  name = var.name
}

resource "aws_ecr_lifecycle_policy" "lifecycle" {
  repository = aws_ecr_repository.repository.name

  policy = <<EOF
{
    "rules": [
        {
            "rulePriority": 1,
            "description": "Keep last 10 images",
            "selection": {
                "tagStatus": "any",
                "countType": "imageCountMoreThan",
                "countNumber": ${var.available_image_count}
            },
            "action": {
                "type": "expire"
            }
        }
    ]
}
EOF
}