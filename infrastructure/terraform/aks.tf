
# User Assigned Identity for AKS
resource "azurerm_user_assigned_identity" "aks" {
  name                = "${var.aks_cluster_name}-identity"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  tags                = var.tags
}

# Role Assignment for AKS Identity on VNet
resource "azurerm_role_assignment" "aks_network" {
  scope                = azurerm_virtual_network.main.id
  role_definition_name = "Network Contributor"
  principal_id         = azurerm_user_assigned_identity.aks.principal_id
}

# Role Assignment for AKS Identity on Route Table
resource "azurerm_role_assignment" "aks_route_table" {
  scope                = azurerm_route_table.aks.id
  role_definition_name = "Network Contributor"
  principal_id         = azurerm_user_assigned_identity.aks.principal_id
}

# Role Assignment for AKS Identity on Private DNS Zone
resource "azurerm_role_assignment" "aks_dns" {
  scope                = azurerm_private_dns_zone.aks.id
  role_definition_name = "Private DNS Zone Contributor"
  principal_id         = azurerm_user_assigned_identity.aks.principal_id
}

# AKS Cluster
resource "azurerm_kubernetes_cluster" "main" {
  name                      = var.aks_cluster_name
  location                  = azurerm_resource_group.main.location
  resource_group_name       = azurerm_resource_group.main.name
  dns_prefix                = var.aks_dns_prefix
  kubernetes_version        = var.kubernetes_version
  private_cluster_enabled   = true
  private_dns_zone_id       = azurerm_private_dns_zone.aks.id
  sku_tier                  = "Standard"
  oidc_issuer_enabled       = var.enable_oidc_issuer
  workload_identity_enabled = var.enable_workload_identity
  
  tags = var.tags

  # System Node Pool
  default_node_pool {
    name                = var.system_node_pool_name
    vm_size             = var.system_node_pool_vm_size
    vnet_subnet_id      = azurerm_subnet.aks.id
    enable_auto_scaling = true
    min_count           = var.system_node_pool_min_count
    max_count           = var.system_node_pool_max_count
    node_count          = var.system_node_pool_node_count
    os_disk_size_gb     = 128
    os_disk_type        = "Managed"
    type                = "VirtualMachineScaleSets"
    
    # Only system workloads
    only_critical_addons_enabled = true
    
    node_labels = {
      "node-type" = "system"
    }

    upgrade_settings {
      max_surge = "33%"
    }
  }

  # Identity
  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.aks.id]
  }

  # Network Profile
  network_profile {
    network_plugin     = var.network_plugin
    network_policy     = var.network_policy
    service_cidr       = var.service_cidr
    dns_service_ip     = var.dns_service_ip
    docker_bridge_cidr = var.docker_bridge_cidr
    outbound_type      = "loadBalancer"
    load_balancer_sku  = "standard"
  }

  # Azure AD Integration
  azure_active_directory_role_based_access_control {
    managed                = true
    azure_rbac_enabled     = true
    admin_group_object_ids = var.admin_group_object_ids
  }

  # Monitoring
  oms_agent {
    log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id
  }

  # Auto-scaler Profile
  auto_scaler_profile {
    balance_similar_node_groups      = true
    expander                         = "random"
    max_graceful_termination_sec     = 600
    max_node_provisioning_time       = "15m"
    max_unready_nodes                = 3
    max_unready_percentage           = 45
    new_pod_scale_up_delay           = "10s"
    scale_down_delay_after_add       = "10m"
    scale_down_delay_after_delete    = "10s"
    scale_down_delay_after_failure   = "3m"
    scale_down_unneeded              = "10m"
    scale_down_unready               = "20m"
    scale_down_utilization_threshold = "0.5"
    scan_interval                    = "10s"
    skip_nodes_with_local_storage    = false
    skip_nodes_with_system_pods      = true
  }

  # Key Vault Secrets Provider
  key_vault_secrets_provider {
    secret_rotation_enabled  = true
    secret_rotation_interval = "2m"
  }

  # Maintenance Window
  maintenance_window {
    allowed {
      day   = "Sunday"
      hours = [22, 23]
    }
  }

  depends_on = [
    azurerm_role_assignment.aks_network,
    azurerm_role_assignment.aks_route_table,
    azurerm_role_assignment.aks_dns
  ]
}

# GPU Node Pool
resource "azurerm_kubernetes_cluster_node_pool" "gpu" {
  count = var.enable_gpu_node_pool ? 1 : 0

  name                  = var.gpu_node_pool_name
  kubernetes_cluster_id = azurerm_kubernetes_cluster.main.id
  vm_size               = var.gpu_vm_size
  vnet_subnet_id        = azurerm_subnet.aks.id
  enable_auto_scaling   = true
  min_count             = var.gpu_min_count
  max_count             = var.gpu_max_count
  node_count            = var.gpu_node_count
  os_disk_size_gb       = 256
  os_disk_type          = "Managed"
  os_type               = "Linux"
  
  node_labels = {
    "node-type"        = "gpu"
    "workload"         = "gpu-compute"
    "gpu-type"         = "nvidia"
  }

  node_taints = [
    "nvidia.com/gpu=present:NoSchedule"
  ]

  tags = merge(var.tags, {
    NodePool = "GPU"
  })

  upgrade_settings {
    max_surge = "33%"
  }
}

# Confidential Compute Node Pool
resource "azurerm_kubernetes_cluster_node_pool" "confidential" {
  count = var.enable_confidential_node_pool ? 1 : 0

  name                  = var.confidential_node_pool_name
  kubernetes_cluster_id = azurerm_kubernetes_cluster.main.id
  vm_size               = var.confidential_vm_size
  vnet_subnet_id        = azurerm_subnet.aks.id
  enable_auto_scaling   = true
  min_count             = var.confidential_min_count
  max_count             = var.confidential_max_count
  node_count            = var.confidential_node_count
  os_disk_size_gb       = 256
  os_disk_type          = "Managed"
  os_type               = "Linux"
  
  node_labels = {
    "node-type"    = "confidential"
    "workload"     = "confidential-compute"
    "confidential" = "true"
  }

  node_taints = [
    "confidential=true:NoSchedule"
  ]

  tags = merge(var.tags, {
    NodePool = "Confidential"
  })

  upgrade_settings {
    max_surge = "33%"
  }
}

# Diagnostic Settings for AKS
resource "azurerm_monitor_diagnostic_setting" "aks" {
  name                       = "${var.aks_cluster_name}-diagnostics"
  target_resource_id         = azurerm_kubernetes_cluster.main.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id

  enabled_log {
    category = "kube-apiserver"
  }

  enabled_log {
    category = "kube-audit"
  }

  enabled_log {
    category = "kube-audit-admin"
  }

  enabled_log {
    category = "kube-controller-manager"
  }

  enabled_log {
    category = "kube-scheduler"
  }

  enabled_log {
    category = "cluster-autoscaler"
  }

  enabled_log {
    category = "cloud-controller-manager"
  }

  enabled_log {
    category = "guard"
  }

  metric {
    category = "AllMetrics"
    enabled  = true
  }
}
