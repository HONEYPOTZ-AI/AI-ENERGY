
# General Variables
variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "aks-production-rg"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "East US"
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Environment = "Production"
    ManagedBy   = "Terraform"
    Project     = "AKS-Infrastructure"
  }
}

# Networking Variables
variable "vnet_name" {
  description = "Name of the virtual network"
  type        = string
  default     = "aks-vnet"
}

variable "vnet_address_space" {
  description = "Address space for the virtual network"
  type        = list(string)
  default     = ["10.0.0.0/16"]
}

variable "aks_subnet_address_prefix" {
  description = "Address prefix for AKS subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "aks_service_subnet_address_prefix" {
  description = "Address prefix for AKS service subnet"
  type        = string
  default     = "10.0.2.0/24"
}

variable "private_endpoint_subnet_address_prefix" {
  description = "Address prefix for private endpoint subnet"
  type        = string
  default     = "10.0.3.0/24"
}

variable "gateway_subnet_address_prefix" {
  description = "Address prefix for application gateway subnet"
  type        = string
  default     = "10.0.4.0/24"
}

# AKS Variables
variable "aks_cluster_name" {
  description = "Name of the AKS cluster"
  type        = string
  default     = "aks-private-cluster"
}

variable "kubernetes_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.28.5"
}

variable "aks_dns_prefix" {
  description = "DNS prefix for AKS cluster"
  type        = string
  default     = "aksprivate"
}

variable "network_plugin" {
  description = "Network plugin (azure or kubenet)"
  type        = string
  default     = "azure"
}

variable "network_policy" {
  description = "Network policy (azure or calico)"
  type        = string
  default     = "azure"
}

variable "service_cidr" {
  description = "CIDR for Kubernetes services"
  type        = string
  default     = "10.1.0.0/16"
}

variable "dns_service_ip" {
  description = "IP address for Kubernetes DNS service"
  type        = string
  default     = "10.1.0.10"
}

variable "docker_bridge_cidr" {
  description = "CIDR for Docker bridge network"
  type        = string
  default     = "172.17.0.1/16"
}

# System Node Pool Variables
variable "system_node_pool_name" {
  description = "Name of the system node pool"
  type        = string
  default     = "system"
}

variable "system_node_pool_vm_size" {
  description = "VM size for system node pool"
  type        = string
  default     = "Standard_D4s_v5"
}

variable "system_node_pool_node_count" {
  description = "Number of nodes in system node pool"
  type        = number
  default     = 3
}

variable "system_node_pool_min_count" {
  description = "Minimum number of nodes for system pool autoscaling"
  type        = number
  default     = 3
}

variable "system_node_pool_max_count" {
  description = "Maximum number of nodes for system pool autoscaling"
  type        = number
  default     = 6
}

# GPU Node Pool Variables
variable "enable_gpu_node_pool" {
  description = "Enable GPU node pool"
  type        = bool
  default     = true
}

variable "gpu_node_pool_name" {
  description = "Name of the GPU node pool"
  type        = string
  default     = "gpupool"
}

variable "gpu_vm_size" {
  description = "VM size for GPU nodes (Standard_NC4as_T4_v3 for T4, Standard_NC24ads_A100_v4 for A100)"
  type        = string
  default     = "Standard_NC4as_T4_v3"
}

variable "gpu_node_count" {
  description = "Number of GPU nodes"
  type        = number
  default     = 1
}

variable "gpu_min_count" {
  description = "Minimum number of GPU nodes for autoscaling"
  type        = number
  default     = 0
}

variable "gpu_max_count" {
  description = "Maximum number of GPU nodes for autoscaling"
  type        = number
  default     = 3
}

# Confidential Compute Node Pool Variables
variable "enable_confidential_node_pool" {
  description = "Enable confidential compute node pool"
  type        = bool
  default     = true
}

variable "confidential_node_pool_name" {
  description = "Name of the confidential compute node pool"
  type        = string
  default     = "confpool"
}

variable "confidential_vm_size" {
  description = "VM size for confidential compute nodes (DCasv5/ECasv5 series)"
  type        = string
  default     = "Standard_DC4as_v5"
}

variable "confidential_node_count" {
  description = "Number of confidential compute nodes"
  type        = number
  default     = 1
}

variable "confidential_min_count" {
  description = "Minimum number of confidential nodes for autoscaling"
  type        = number
  default     = 0
}

variable "confidential_max_count" {
  description = "Maximum number of confidential nodes for autoscaling"
  type        = number
  default     = 3
}

# Security Variables
variable "key_vault_name" {
  description = "Name of the Azure Key Vault (will append random suffix)"
  type        = string
  default     = "aks-kv"
}

variable "enable_managed_hsm" {
  description = "Enable Azure Managed HSM"
  type        = bool
  default     = false
}

variable "managed_hsm_name" {
  description = "Name of the Managed HSM (will append random suffix)"
  type        = string
  default     = "aks-hsm"
}

variable "enable_workload_identity" {
  description = "Enable workload identity"
  type        = bool
  default     = true
}

variable "enable_oidc_issuer" {
  description = "Enable OIDC issuer"
  type        = bool
  default     = true
}

variable "admin_group_object_ids" {
  description = "Azure AD group object IDs for AKS administrators"
  type        = list(string)
  default     = []
}

# Monitoring Variables
variable "log_analytics_workspace_name" {
  description = "Name of the Log Analytics workspace"
  type        = string
  default     = "aks-logs"
}

variable "log_analytics_retention_days" {
  description = "Retention period for Log Analytics in days"
  type        = number
  default     = 30
}

variable "enable_container_insights" {
  description = "Enable Container Insights monitoring"
  type        = bool
  default     = true
}

# Private DNS Variables
variable "private_dns_zone_name" {
  description = "Name of the private DNS zone for AKS"
  type        = string
  default     = "privatelink.eastus.azmk8s.io"
}
