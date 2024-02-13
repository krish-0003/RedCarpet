###########################################
#  apigw/apigw-resource-proxy/outputs.tf  #
###########################################
output "resource_id" {
  value = aws_api_gateway_resource.resource.id
}