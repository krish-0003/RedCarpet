resource "aws_iam_role_policy" "ecs_task" {
  name   = module.ecs_app.ecs_role_name
  role   = module.ecs_app.ecs_role_name
  policy = data.aws_iam_policy_document.ecs_task.json
}

data "aws_iam_policy_document" "ecs_task" {
  statement {

    effect = "Allow"

    actions = [
      "ses:SendEmail"
    ]

    resources = [
      local.ses_arn
    ]

    condition {
      test     = "StringEquals"
      variable = "ses:FromAddress"
      values = [
        local.ses_email_id
      ]
    }
  }
}