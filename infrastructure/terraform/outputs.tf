
# Resource Group Outputs
output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "resource_group_location" {
  description = "Location of the resource group"
  value       = azurerm_resource_group.main.location
}

# Networking Outputs
output "vnet_id" {
  description = "ID of the virtual network"
  value       = azurerm_virtual_network.main.id
}

output "vnet_name" {
  description = "Name of the virtual network"
  value       = azurerm_virtual_network.main.name
}

output "aks_subnet_id" {
  description = "ID of the AKS subnet"
  value       = azurerm_subnet.aks.id
}

output "private_endpoint_subnet_id" {
  description = "ID of the private endpoint subnet"
  value       = azurerm_subnet.private_endpoint.id
}

output "aks_nsg_id" {
  description = "ID of the AKS network security group"
  value       = azurerm_network_security_group.aks.id
}

output "aks_route_table_id" {
  description = "ID of the AKS route table"
  value       = azurerm_route_table.aks.id
}

# AKS Outputs
output "aks_cluster_id" {
  description = "ID of the AKS cluster"
  value       = azurerm_kubernetes_cluster.main.id
}

output "aks_cluster_name" {
  description = "Name of the AKS cluster"
  value       = azurerm_kubernetes_cluster.main.name
}

output "aks_cluster_fqdn" {
  description = "FQDN of the AKS cluster"
  value       = azurerm_kubernetes_cluster.main.fqdn
}

output "aks_cluster_private_fqdn" {
  description = "Private FQDN of the AKS cluster"
  value       = azurerm_kubernetes_cluster.main.private_fqdn
}

output "aks_kube_config" {
  description = "Kubeconfig for the AKS cluster"
  value       = azurerm_kubernetes_cluster.main.kube_config_raw
  sensitive   = true
}

output "aks_kube_admin_config" {
  description = "Admin kubeconfig for the AKS cluster"
  value       = azurerm_kubernetes_cluster.main.kube_admin_config_raw
  sensitive   = true
}

output "aks_cluster_identity_principal_id" {
  description = "Principal ID of the AKS cluster identity"
  value       = azurerm_kubernetes_cluster.main.identity[0].principal_id
}

output "aks_kubelet_identity_object_id" {
  description = "Object ID of the AKS kubelet identity"
  value       = azurerm_kubernetes_cluster.main.kubelet_identity[0].object_id
}

output "aks_oidc_issuer_url" {
  description = "OIDC issuer URL for workload identity"
  value       = azurerm_kubernetes_cluster.main.oidc_issuer_url
}

output "aks_node_resource_group" {
  description = "Name of the AKS node resource group"
  value       = azurerm_kubernetes_cluster.main.node_resource_group
}

# Node Pool Outputs
output "gpu_node_pool_id" {
  description = "ID of the GPU node pool"
  value       = var.enable_gpu_node_pool ? azurerm_kubernetes_cluster_node_pool.gpu[0].id : null
}

output "confidential_node_pool_id" {
  description = "ID of the confidential compute node pool"
  value       = var.enable_confidential_node_pool ? azurerm_kubernetes_cluster_node_pool.confidential[0].id : null
}

# Security Outputs
output "key_vault_id" {
  description = "ID of the Key Vault"
  value       = azurerm_key_vault.main.id
}

output "key_vault_name" {
  description = "Name of the Key Vault"
  value       = azurerm_key_vault.main.name
}

output "key_vault_uri" {
  description = "URI of the Key Vault"
  value       = azurerm_key_vault.main.vault_uri
}

output "managed_hsm_id" {
  description = "ID of the Managed HSM"
  value       = var.enable_managed_hsm ? azurerm_key_vault_managed_hardware_security_module.main[0].id : null
}

output "managed_hsm_uri" {
  description = "URI of the Managed HSM"
  value       = var.enable_managed_hsm ? azurerm_key_vault_managed_hardware_security_module.main[0].hsm_uri : null
}

output "workload_identity_client_id" {
  description = "Client ID of the workload identity"
  value       = var.enable_workload_identity ? azurerm_user_assigned_identity.workload[0].client_id : null
}

output "workload_identity_principal_id" {
  description = "Principal ID of the workload identity"
  value       = var.enable_workload_identity ? azurerm_user_assigned_identity.workload[0].principal_id : null
}

output "container_registry_id" {
  description = "ID of the Azure Container Registry"
  value       = azurerm_container_registry.main.id
}

output "container_registry_name" {
  description = "Name of the Azure Container Registry"
  value       = azurerm_container_registry.main.name
}

output "container_registry_login_server" {
  description = "Login server of the Azure Container Registry"
  value       = azurerm_container_registry.main.login_server
}

# Monitoring Outputs
output "log_analytics_workspace_id" {
  description = "ID of the Log Analytics workspace"
  value       = azurerm_log_analytics_workspace.main.id
}

output "log_analytics_workspace_name" {
  description = "Name of the Log Analytics workspace"
  value       = azurerm_log_analytics_workspace.main.name
}

output "log_analytics_workspace_workspace_id" {
  description = "Workspace ID of the Log Analytics workspace"
  value       = azurerm_log_analytics_workspace.main.workspace_id
}

output "log_analytics_workspace_primary_shared_key" {
  description = "Primary shared key of the Log Analytics workspace"
  value       = azurerm_log_analytics_workspace.main.primary_shared_key
  sensitive   = true
}

output "application_insights_id" {
  description = "ID of the Application Insights instance"
  value       = azurerm_application_insights.main.id
}

output "application_insights_instrumentation_key" {
  description = "Instrumentation key of the Application Insights instance"
  value       = azurerm_application_insights.main.instrumentation_key
  sensitive   = true
}

output "application_insights_connection_string" {
  description = "Connection string of the Application Insights instance"
  value       = azurerm_application_insights.main.connection_string
  sensitive   = true
}

# Private DNS Outputs
output "aks_private_dns_zone_id" {
  description = "ID of the AKS private DNS zone"
  value       = azurerm_private_dns_zone.aks.id
}

output "keyvault_private_dns_zone_id" {
  description = "ID of the Key Vault private DNS zone"
  value       = azurerm_private_dns_zone.keyvault.id
}

output "acr_private_dns_zone_id" {
  description = "ID of the ACR private DNS zone"
  value       = azurerm_private_dns_zone.acr.id
}
