####################
#  stack/apigw.tf  #
####################

module "apigw_resource_v1_proxy" {
  source             = "../modules/apigw/apigw-resource-proxy"
  apigw_id           = local.apigw_id
  parent_resource_id = data.aws_ssm_parameter.apigw_v1_resource_id.value
  path_part          = "{proxy+}"
  http_method        = "ANY"
  vpc_link_id        = data.aws_ssm_parameter.apigw_vpc_link_id.value
  integration_uri    = "http://${data.aws_ssm_parameter.nlb_dns.value}:${module.nlb_listener_api.port}${data.aws_ssm_parameter.apigw_v1_resource_path.value}/{proxy}"
  method_request_parameters = {
    "method.request.path.proxy" = true
  }
  integration_request_parameters = {
    "integration.request.path.proxy" = "method.request.path.proxy"
  }
  providers = {
    aws = aws
  }
}

module "apigw_method_v1_proxy_proxy_cors_enabled" {
  source          = "../modules/apigw/apigw-cors-custom"
  apigw_id        = local.apigw_id
  resource_id     = module.apigw_resource_v1_proxy.resource_id
  allowed_headers = "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
  allowed_methods = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT"
  allowed_origins = concat(
    [local.web_url],
    var.apigw_cors_allowed_origin != "" ? split(",", var.apigw_cors_allowed_origin) : []
  )
  fallback_origin = local.web_url
}

#--------------------------------------------------------------------------------
# /api-docs
#--------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "api_docs" {
  parent_id   = data.aws_ssm_parameter.apigw_root_resource_id.value
  path_part   = "api-docs"
  rest_api_id = local.apigw_id
  lifecycle {
    prevent_destroy = true
  }
}

#--------------------------------------------------------------------------------
# /api-docs/ GET
#--------------------------------------------------------------------------------

module "apigw_method_integration_api_docs_GET" {
  source            = "../modules/apigw/apigw-resource-method-integration"
  apigw_id          = local.apigw_id
  apigw_resource_id = aws_api_gateway_resource.api_docs.id
  http_method       = "GET"
  vpc_link_id       = data.aws_ssm_parameter.apigw_vpc_link_id.value
  integration_uri   = "http://${data.aws_ssm_parameter.nlb_dns.value}:${module.nlb_listener_api.port}${aws_api_gateway_resource.api_docs.path}/"
  method_request_parameters = {
    "method.request.path.proxy" = true
  }
  integration_request_parameters = {
    "integration.request.path.proxy" = "method.request.path.proxy"
  }
  providers = {
    aws = aws
  }
}

#--------------------------------------------------------------------------------
# /api-docs/{proxy+} ANY
#--------------------------------------------------------------------------------
module "apigw_resource_api_docs" {
  source             = "../modules/apigw/apigw-resource-proxy"
  apigw_id           = local.apigw_id
  parent_resource_id = aws_api_gateway_resource.api_docs.id
  path_part          = "{proxy+}"
  http_method        = "GET"
  vpc_link_id        = data.aws_ssm_parameter.apigw_vpc_link_id.value
  integration_uri    = "http://${data.aws_ssm_parameter.nlb_dns.value}:${module.nlb_listener_api.port}${aws_api_gateway_resource.api_docs.path}/{proxy}"
  method_request_parameters = {
    "method.request.path.proxy" = true
  }
  integration_request_parameters = {
    "integration.request.path.proxy" = "method.request.path.proxy"
  }
  providers = {
    aws = aws
  }
}