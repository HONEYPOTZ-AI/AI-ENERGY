
# Log Analytics Workspace
resource "azurerm_log_analytics_workspace" "main" {
  name                = "${var.log_analytics_workspace_name}-${random_string.suffix.result}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = var.log_analytics_retention_days
  tags                = var.tags
}

# Log Analytics Solution for Container Insights
resource "azurerm_log_analytics_solution" "container_insights" {
  count = var.enable_container_insights ? 1 : 0

  solution_name         = "ContainerInsights"
  location              = azurerm_resource_group.main.location
  resource_group_name   = azurerm_resource_group.main.name
  workspace_resource_id = azurerm_log_analytics_workspace.main.id
  workspace_name        = azurerm_log_analytics_workspace.main.name

  plan {
    publisher = "Microsoft"
    product   = "OMSGallery/ContainerInsights"
  }

  tags = var.tags
}

# Action Group for Alerts
resource "azurerm_monitor_action_group" "main" {
  name                = "aks-action-group"
  resource_group_name = azurerm_resource_group.main.name
  short_name          = "aksalerts"
  tags                = var.tags

  email_receiver {
    name                    = "sendtoadmin"
    email_address           = "admin@example.com"
    use_common_alert_schema = true
  }

  # Add webhook for integration with alerting systems
  # webhook_receiver {
  #   name                    = "callwebhook"
  #   service_uri             = "https://example.com/webhook"
  #   use_common_alert_schema = true
  # }
}

# Metric Alert - Node CPU Usage
resource "azurerm_monitor_metric_alert" "node_cpu" {
  name                = "${var.aks_cluster_name}-node-cpu-alert"
  resource_group_name = azurerm_resource_group.main.name
  scopes              = [azurerm_kubernetes_cluster.main.id]
  description         = "Alert when node CPU usage exceeds 80%"
  severity            = 2
  frequency           = "PT5M"
  window_size         = "PT15M"
  tags                = var.tags

  criteria {
    metric_namespace = "Microsoft.ContainerService/managedClusters"
    metric_name      = "node_cpu_usage_percentage"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = 80
  }

  action {
    action_group_id = azurerm_monitor_action_group.main.id
  }
}

# Metric Alert - Node Memory Usage
resource "azurerm_monitor_metric_alert" "node_memory" {
  name                = "${var.aks_cluster_name}-node-memory-alert"
  resource_group_name = azurerm_resource_group.main.name
  scopes              = [azurerm_kubernetes_cluster.main.id]
  description         = "Alert when node memory usage exceeds 80%"
  severity            = 2
  frequency           = "PT5M"
  window_size         = "PT15M"
  tags                = var.tags

  criteria {
    metric_namespace = "Microsoft.ContainerService/managedClusters"
    metric_name      = "node_memory_working_set_percentage"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = 80
  }

  action {
    action_group_id = azurerm_monitor_action_group.main.id
  }
}

# Metric Alert - Unschedulable Pods
resource "azurerm_monitor_metric_alert" "unschedulable_pods" {
  name                = "${var.aks_cluster_name}-unschedulable-pods-alert"
  resource_group_name = azurerm_resource_group.main.name
  scopes              = [azurerm_kubernetes_cluster.main.id]
  description         = "Alert when there are unschedulable pods"
  severity            = 1
  frequency           = "PT5M"
  window_size         = "PT15M"
  tags                = var.tags

  criteria {
    metric_namespace = "Microsoft.ContainerService/managedClusters"
    metric_name      = "kube_pod_status_phase"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = 0

    dimension {
      name     = "phase"
      operator = "Include"
      values   = ["Pending"]
    }
  }

  action {
    action_group_id = azurerm_monitor_action_group.main.id
  }
}

# Diagnostic Settings for NSG
resource "azurerm_monitor_diagnostic_setting" "nsg" {
  name                       = "aks-nsg-diagnostics"
  target_resource_id         = azurerm_network_security_group.aks.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id

  enabled_log {
    category = "NetworkSecurityGroupEvent"
  }

  enabled_log {
    category = "NetworkSecurityGroupRuleCounter"
  }
}

# Diagnostic Settings for VNet
resource "azurerm_monitor_diagnostic_setting" "vnet" {
  name                       = "vnet-diagnostics"
  target_resource_id         = azurerm_virtual_network.main.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id

  enabled_log {
    category = "VMProtectionAlerts"
  }

  metric {
    category = "AllMetrics"
    enabled  = true
  }
}

# Application Insights for Application Monitoring (optional)
resource "azurerm_application_insights" "main" {
  name                = "${var.aks_cluster_name}-appinsights"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  workspace_id        = azurerm_log_analytics_workspace.main.id
  application_type    = "other"
  retention_in_days   = 90
  tags                = var.tags
}
