resource "aws_api_gateway_method" "method" {
  rest_api_id   = var.apigw_id
  resource_id   = var.resource_id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "integration" {
  rest_api_id          = aws_api_gateway_method.method.rest_api_id
  resource_id          = aws_api_gateway_method.method.resource_id
  http_method          = aws_api_gateway_method.method.http_method
  type                 = "MOCK"
  passthrough_behavior = "WHEN_NO_TEMPLATES"

  request_templates = {
    "application/json" = <<EOF
{
    "statusCode": 200
}
EOF
  }
}

resource "aws_api_gateway_method_response" "method_response_200" {
  rest_api_id = aws_api_gateway_integration.integration.rest_api_id
  resource_id = aws_api_gateway_integration.integration.resource_id
  http_method = aws_api_gateway_method.method.http_method
  status_code = "200"
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers"     = true,
    "method.response.header.Access-Control-Allow-Methods"     = true,
    "method.response.header.Access-Control-Allow-Origin"      = true,
    "method.response.header.Access-Control-Allow-Credentials" = true
  }
}

resource "aws_api_gateway_integration_response" "integration_response" {
  rest_api_id = aws_api_gateway_method_response.method_response_200.rest_api_id
  resource_id = aws_api_gateway_method_response.method_response_200.resource_id
  http_method = aws_api_gateway_method_response.method_response_200.http_method
  status_code = aws_api_gateway_method_response.method_response_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers"     = "'${var.allowed_headers}'",
    "method.response.header.Access-Control-Allow-Methods"     = "'${var.allowed_methods}'",
    "method.response.header.Access-Control-Allow-Origin"      = "'${var.allowed_origin}'",
    "method.response.header.Access-Control-Allow-Credentials" = true
  }
}