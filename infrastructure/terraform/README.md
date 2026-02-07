
# Azure Kubernetes Service (AKS) Terraform Infrastructure

This Terraform configuration creates a production-ready, secure Azure Kubernetes Service (AKS) cluster with advanced features including GPU node pools, confidential computing, and comprehensive monitoring.

## Architecture Overview

This infrastructure includes:

- **Private AKS Cluster** with Azure CNI networking
- **GPU Node Pool** with Tesla T4 or A100 GPUs
- **Confidential Compute Node Pool** (DCasv5/ECasv5 series)
- **Network Security** with NSGs and custom route tables
- **Workload Identity** with OIDC integration
- **Private DNS Zones** for private endpoints
- **Azure Key Vault** with managed HSM support
- **Azure Container Registry** with private endpoints
- **Log Analytics** workspace with Container Insights
- **Diagnostic Settings** and monitoring alerts
- **Azure AD Integration** with RBAC

## Prerequisites

1. **Azure CLI** installed and configured
2. **Terraform** >= 1.5.0
3. **Azure Subscription** with appropriate permissions
4. **Azure AD** admin access for RBAC configuration

## Quick Start

### 1. Initialize Terraform

```bash
cd infrastructure/terraform
terraform init
```

### 2. Configure Variables

Create a `terraform.tfvars` file:

```hcl
resource_group_name = "my-aks-production-rg"
location            = "East US"
aks_cluster_name    = "my-aks-cluster"

# Network Configuration
vnet_address_space            = ["10.0.0.0/16"]
aks_subnet_address_prefix     = "10.0.1.0/24"
service_cidr                  = "10.1.0.0/16"
dns_service_ip                = "10.1.0.10"

# Node Pool Configuration
system_node_pool_node_count   = 3
system_node_pool_min_count    = 3
system_node_pool_max_count    = 6

# GPU Configuration (Tesla T4)
enable_gpu_node_pool = true
gpu_vm_size          = "Standard_NC4as_T4_v3"
gpu_node_count       = 1
gpu_min_count        = 0
gpu_max_count        = 3

# Confidential Computing
enable_confidential_node_pool = true
confidential_vm_size          = "Standard_DC4as_v5"
confidential_node_count       = 1

# Azure AD Integration
admin_group_object_ids = ["your-azure-ad-group-id"]

# Tags
tags = {
  Environment = "Production"
  Project     = "MyProject"
  ManagedBy   = "Terraform"
}
```

### 3. Plan Deployment

```bash
terraform plan -out=tfplan
```

### 4. Apply Configuration

```bash
terraform apply tfplan
```

## GPU Node Pool Configuration

### Tesla T4 GPU (Recommended for ML inference)
```hcl
gpu_vm_size = "Standard_NC4as_T4_v3"  # 4 vCPUs, 28 GB RAM, 1x Tesla T4
```

### A100 GPU (For large-scale training)
```hcl
gpu_vm_size = "Standard_NC24ads_A100_v4"  # 24 vCPUs, 220 GB RAM, 1x A100
```

### Available GPU VM Sizes
- `Standard_NC4as_T4_v3`: 1x Tesla T4 (16GB)
- `Standard_NC8as_T4_v3`: 1x Tesla T4 (16GB)
- `Standard_NC16as_T4_v3`: 1x Tesla T4 (16GB)
- `Standard_NC24ads_A100_v4`: 1x A100 (80GB)
- `Standard_NC48ads_A100_v4`: 2x A100 (80GB)
- `Standard_NC96ads_A100_v4`: 4x A100 (80GB)

## Confidential Computing Node Pool

### Available VM Sizes
- `Standard_DC2as_v5`: 2 vCPUs, 8 GB RAM
- `Standard_DC4as_v5`: 4 vCPUs, 16 GB RAM (default)
- `Standard_DC8as_v5`: 8 vCPUs, 32 GB RAM
- `Standard_DC16as_v5`: 16 vCPUs, 64 GB RAM
- `Standard_EC4as_v5`: 4 vCPUs, 32 GB RAM
- `Standard_EC8as_v5`: 8 vCPUs, 64 GB RAM

## Accessing the Cluster

### Get Credentials

```bash
# Get cluster credentials
az aks get-credentials \
  --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw aks_cluster_name)

# Verify connection
kubectl get nodes
```

### Access Private Cluster

Since this is a private cluster, you need to access it from within the VNet or through a VPN/ExpressRoute connection.

Option 1: Use Azure Bastion or VM in the VNet
Option 2: Set up VPN Gateway (not included in this configuration)
Option 3: Use `az aks command invoke`:

```bash
az aks command invoke \
  --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw aks_cluster_name) \
  --command "kubectl get nodes"
```

## Workload Identity Setup

### 1. Create Kubernetes Service Account

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: workload-identity-sa
  namespace: default
  annotations:
    azure.workload.identity/client-id: "<workload_identity_client_id>"
```

### 2. Deploy Workload with Identity

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
  namespace: default
  labels:
    azure.workload.identity/use: "true"
spec:
  serviceAccountName: workload-identity-sa
  containers:
  - name: my-app
    image: myapp:latest
```

## GPU Workload Deployment

### Deploy GPU Workload

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gpu-pod
spec:
  nodeSelector:
    node-type: gpu
  tolerations:
  - key: nvidia.com/gpu
    operator: Equal
    value: present
    effect: NoSchedule
  containers:
  - name: cuda-container
    image: nvidia/cuda:11.8.0-runtime-ubuntu22.04
    resources:
      limits:
        nvidia.com/gpu: 1
    command: ["nvidia-smi"]
```

## Confidential Computing Workload

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: confidential-pod
spec:
  nodeSelector:
    node-type: confidential
  tolerations:
  - key: confidential
    operator: Equal
    value: "true"
    effect: NoSchedule
  containers:
  - name: confidential-app
    image: myapp:latest
```

## Key Vault Integration

### Access Secrets from Pods

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-with-secrets
spec:
  containers:
  - name: app
    image: myapp:latest
    volumeMounts:
    - name: secrets-store
      mountPath: "/mnt/secrets"
      readOnly: true
  volumes:
  - name: secrets-store
    csi:
      driver: secrets-store.csi.k8s.io
      readOnly: true
      volumeAttributes:
        secretProviderClass: "azure-keyvault-secrets"
```

## Monitoring and Alerts

### View Metrics

1. Go to Azure Portal
2. Navigate to your AKS cluster
3. Select "Insights" under Monitoring

### Configure Alerts

Alerts are pre-configured for:
- Node CPU usage > 80%
- Node memory usage > 80%
- Unschedulable pods

Modify `monitoring.tf` to customize alert thresholds and recipients.

## Outputs

After applying, retrieve outputs:

```bash
# Get all outputs
terraform output

# Get specific output
terraform output aks_cluster_name
terraform output key_vault_uri
terraform output container_registry_login_server

# Get sensitive outputs
terraform output -raw aks_kube_config > ~/.kube/config
```

## Security Best Practices

1. **Private Cluster**: API server is only accessible from within the VNet
2. **Network Policies**: Azure CNI with network policy enabled
3. **RBAC**: Azure AD integration with role-based access control
4. **Key Vault**: Secrets stored in Azure Key Vault with private endpoints
5. **Container Registry**: Private ACR with image scanning enabled
6. **NSGs**: Network security groups restrict traffic
7. **Workload Identity**: No need for static credentials
8. **Audit Logging**: All API server requests logged to Log Analytics

## Maintenance

### Upgrade Kubernetes Version

```bash
# List available versions
az aks get-upgrades \
  --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw aks_cluster_name)

# Update variable and apply
# Edit terraform.tfvars: kubernetes_version = "1.29.0"
terraform apply
```

### Scale Node Pools

```bash
# Update variables in terraform.tfvars
system_node_pool_max_count = 10
gpu_max_count = 5

# Apply changes
terraform apply
```

## Cost Optimization

1. **Autoscaling**: Enable autoscaling with min_count = 0 for GPU/confidential pools
2. **Spot Instances**: Consider Azure Spot VMs for non-critical workloads
3. **Right-sizing**: Monitor resource usage and adjust VM sizes
4. **Reserved Instances**: Purchase reservations for predictable workloads

## Troubleshooting

### Cannot access cluster
- Ensure you're connected to the VNet or use `az aks command invoke`
- Check NSG rules allow your source IP

### GPU not available
- Verify GPU drivers are installed: `kubectl get nodes -o json | jq '.items[].status.allocatable'`
- Install NVIDIA device plugin if needed

### Key Vault access denied
- Check RBAC role assignments
- Verify workload identity is configured correctly

## Clean Up

```bash
# Destroy all resources
terraform destroy

# Or delete resource group
az group delete --name $(terraform output -raw resource_group_name) --yes
```

## File Structure

```
infrastructure/terraform/
├── main.tf           # Provider and resource group configuration
├── variables.tf      # Input variables
├── outputs.tf        # Output values
├── aks.tf           # AKS cluster and node pools
├── networking.tf    # VNet, subnets, NSG, routes, DNS
├── security.tf      # Key Vault, HSM, workload identity, ACR
├── monitoring.tf    # Log Analytics, alerts, diagnostics
├── README.md        # This file
└── terraform.tfvars # Your variable values (create this)
```

## Support

For issues or questions:
- Review [Azure AKS Documentation](https://docs.microsoft.com/azure/aks/)
- Check [Terraform AzureRM Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

## License

This infrastructure code is provided as-is for use in your projects.
