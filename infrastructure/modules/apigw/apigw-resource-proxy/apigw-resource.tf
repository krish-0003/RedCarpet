##################################################
#  apigw/apigw-resource-proxy/apigw-resource.tf  #
##################################################

resource "aws_api_gateway_resource" "resource" {
  rest_api_id = var.apigw_id
  path_part   = var.path_part
  parent_id   = var.parent_resource_id
}

resource "aws_api_gateway_method" "method" {
  rest_api_id        = aws_api_gateway_resource.resource.rest_api_id
  resource_id        = aws_api_gateway_resource.resource.id
  http_method        = var.http_method
  authorization      = var.authorization
  authorizer_id      = var.authorizer_id
  request_parameters = var.method_request_parameters
}

resource "aws_api_gateway_integration" "integration" {
  rest_api_id             = aws_api_gateway_method.method.rest_api_id
  resource_id             = aws_api_gateway_method.method.resource_id
  http_method             = aws_api_gateway_method.method.http_method
  type                    = "HTTP_PROXY"
  integration_http_method = aws_api_gateway_method.method.http_method
  uri                     = var.integration_uri
  passthrough_behavior    = "WHEN_NO_MATCH"
  connection_type         = "VPC_LINK"
  connection_id           = var.vpc_link_id
  request_parameters      = var.integration_request_parameters
}