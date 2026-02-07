# Azure Key Vault Integration

This directory contains Azure Key Vault integration components for secure secret management and model encryption/decryption.

## Components

### 1. Secret Provider Class (`secret-provider-class.yaml`)

CSI Secret Store Driver configuration for mounting Key Vault secrets into pods.

**Features:**
- Standard workload secret access
- TEE-attested workload secret access
- Automatic secret rotation
- Multiple secret types (keys, secrets, certificates)

**Usage:**
```bash
# Apply secret provider class
kubectl apply -f secret-provider-class.yaml

# Reference in pod spec
volumes:
  - name: secrets-store
    csi:
      driver: secrets-store.csi.k8s.io
      readOnly: true
      volumeAttributes:
        secretProviderClass: "azure-kv-provider"
```

### 2. Workload Identity Binding (`workload-identity-binding.yaml`)

Configures Azure AD Workload Identity for passwordless Key Vault access.

**Setup:**
```bash
# Set environment variables
export TENANT_ID="your-tenant-id"
export WORKLOAD_IDENTITY_CLIENT_ID="your-client-id"
export TEE_WORKLOAD_IDENTITY_CLIENT_ID="your-tee-client-id"
export AKS_OIDC_ISSUER="your-aks-oidc-issuer"
export RESOURCE_GROUP="your-resource-group"

# Apply workload identity configuration
envsubst < workload-identity-binding.yaml | kubectl apply -f -

# Create federated identity credential in Azure
az identity federated-credential create \
  --name keyvault-federated-identity \
  --identity-name ${WORKLOAD_IDENTITY_NAME} \
  --resource-group ${RESOURCE_GROUP} \
  --issuer ${AKS_OIDC_ISSUER} \
  --subject system:serviceaccount:default:keyvault-workload-identity \
  --audience api://AzureADTokenExchange
```

### 3. Attestation-Gated Access (`attestation-gated-access.yaml`)

Enforces TEE attestation for accessing sensitive secrets.

**Configuration:**
```bash
# Set attestation provider details
export ATTESTATION_PROVIDER_NAME="your-attestation-provider"
export REGION="eastus"
export EXPECTED_MRSIGNER="expected-measurement"

# Apply attestation configuration
envsubst < attestation-gated-access.yaml | kubectl apply -f -
```

**Key Features:**
- SGX/SEV-SNP attestation validation
- Conditional access policies
- Admission controller for pod validation

### 4. Model Encryption (`encrypt-model.py`)

Encrypts model files using envelope encryption with Azure Key Vault.

**Dependencies:**
```bash
pip install azure-identity azure-keyvault-keys cryptography
```

**Usage:**
```bash
# Encrypt single model
python encrypt-model.py \
  --keyvault-url https://your-keyvault.vault.azure.net/ \
  --key-name model-encryption-key \
  --model /path/to/model.pt \
  --output /path/to/encrypted/model.pt.encrypted

# Batch encrypt models
python encrypt-model.py \
  --keyvault-url https://your-keyvault.vault.azure.net/ \
  --key-name model-encryption-key \
  --model /models/directory \
  --output /encrypted/directory \
  --batch
```

**Encryption Process:**
1. Generate random data encryption key (DEK)
2. Encrypt DEK with Key Vault key (KEK)
3. Encrypt model data with DEK using AES-256-CBC
4. Store encrypted DEK and IV in metadata file

### 5. Model Decryption (`decrypt-model.py`)

Decrypts encrypted model files using Azure Key Vault.

**Usage:**
```bash
# Decrypt single model
python decrypt-model.py \
  --keyvault-url https://your-keyvault.vault.azure.net/ \
  --key-name model-encryption-key \
  --encrypted-model /path/to/model.pt.encrypted \
  --output /path/to/decrypted/model.pt

# Decrypt with TEE attestation
python decrypt-model.py \
  --keyvault-url https://your-keyvault.vault.azure.net/ \
  --key-name tee-model-decryption-key \
  --encrypted-model /path/to/model.pt.encrypted \
  --output /path/to/decrypted/model.pt \
  --use-tee \
  --attestation-token $ATTESTATION_TOKEN

# Batch decrypt models
python decrypt-model.py \
  --keyvault-url https://your-keyvault.vault.azure.net/ \
  --key-name model-encryption-key \
  --encrypted-model /encrypted/directory \
  --output /decrypted/directory \
  --batch
```

## Azure Key Vault Setup

### Prerequisites

```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login to Azure
az login

# Set subscription
az account set --subscription "your-subscription-id"
```

### Create Key Vault

```bash
# Create resource group
az group create --name rl-ai-platform-rg --location eastus

# Create Key Vault
az keyvault create \
  --name rl-ai-platform-kv \
  --resource-group rl-ai-platform-rg \
  --location eastus \
  --enable-rbac-authorization true

# Create encryption key
az keyvault key create \
  --vault-name rl-ai-platform-kv \
  --name model-encryption-key \
  --kty RSA \
  --size 4096 \
  --ops encrypt decrypt wrapKey unwrapKey
```

### Configure Access Policies

```bash
# Assign Key Vault Crypto User role to workload identity
az role assignment create \
  --role "Key Vault Crypto User" \
  --assignee ${WORKLOAD_IDENTITY_OBJECT_ID} \
  --scope /subscriptions/${SUBSCRIPTION_ID}/resourceGroups/rl-ai-platform-rg/providers/Microsoft.KeyVault/vaults/rl-ai-platform-kv

# Assign Key Vault Secrets User role
az role assignment create \
  --role "Key Vault Secrets User" \
  --assignee ${WORKLOAD_IDENTITY_OBJECT_ID} \
  --scope /subscriptions/${SUBSCRIPTION_ID}/resourceGroups/rl-ai-platform-rg/providers/Microsoft.KeyVault/vaults/rl-ai-platform-kv
```

## Integration with Workloads

### Inference Service Integration

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: inference-service
spec:
  template:
    spec:
      serviceAccountName: keyvault-workload-identity
      containers:
        - name: inference
          image: inference:latest
          volumeMounts:
            - name: secrets-store
              mountPath: "/mnt/secrets"
              readOnly: true
          env:
            - name: MODEL_ENCRYPTION_KEY
              valueFrom:
                secretKeyRef:
                  name: kv-model-secrets
                  key: MODEL_ENCRYPTION_KEY
      volumes:
        - name: secrets-store
          csi:
            driver: secrets-store.csi.x-k8s.io
            readOnly: true
            volumeAttributes:
              secretProviderClass: "azure-kv-provider"
```

### TEE Workload Integration

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tee-inference
  namespace: tee-workloads
spec:
  template:
    spec:
      serviceAccountName: keyvault-tee-workload-identity
      runtimeClassName: kata-cc
      containers:
        - name: tee-inference
          image: tee-inference:latest
          volumeMounts:
            - name: tee-secrets-store
              mountPath: "/mnt/secrets"
              readOnly: true
      volumes:
        - name: tee-secrets-store
          csi:
            driver: secrets-store.csi.x-k8s.io
            readOnly: true
            volumeAttributes:
              secretProviderClass: "azure-kv-tee-provider"
```

## Security Best Practices

1. **Key Rotation**: Rotate encryption keys regularly
2. **RBAC**: Use least privilege access for workload identities
3. **Attestation**: Always use TEE attestation for sensitive workloads
4. **Audit Logging**: Enable Key Vault diagnostic logs
5. **Backup**: Regular backup of Key Vault keys and secrets

## Troubleshooting

### CSI Driver Issues
```bash
# Check CSI driver pods
kubectl get pods -n kube-system -l app=secrets-store-csi-driver

# Check secret provider class
kubectl describe secretproviderclass azure-kv-provider

# Check pod events
kubectl describe pod <pod-name>
```

### Workload Identity Issues
```bash
# Verify service account annotations
kubectl get serviceaccount keyvault-workload-identity -o yaml

# Check federated credential
az identity federated-credential list \
  --identity-name ${WORKLOAD_IDENTITY_NAME} \
  --resource-group ${RESOURCE_GROUP}

# Test token acquisition
kubectl run -it --rm test-workload-identity \
  --image=mcr.microsoft.com/azure-cli \
  --serviceaccount=keyvault-workload-identity \
  --restart=Never \
  -- bash
```

### Encryption/Decryption Issues
```bash
# Verify Key Vault access
az keyvault key show \
  --vault-name rl-ai-platform-kv \
  --name model-encryption-key

# Test encryption
python encrypt-model.py \
  --keyvault-url https://rl-ai-platform-kv.vault.azure.net/ \
  --model test-model.pt \
  --output test-model.encrypted

# Verify metadata
cat test-model.encrypted.metadata.json | jq
```

## References

- [Azure Key Vault Documentation](https://docs.microsoft.com/azure/key-vault/)
- [Secrets Store CSI Driver](https://secrets-store-csi-driver.sigs.k8s.io/)
- [Azure AD Workload Identity](https://azure.github.io/azure-workload-identity/)
- [Azure Attestation Service](https://docs.microsoft.com/azure/attestation/)
