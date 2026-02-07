# TEE Utilities

This directory contains utilities for secure operation within Trusted Execution Environments (TEE), including model loading, attestation validation, and secure workload initialization.

## Components

### 1. Secure Model Loader (`secure_model_loader.py`)

Securely loads and decrypts AI models within TEE environments.

**Features:**
- Automatic TEE attestation validation
- Encrypted model decryption using Key Vault
- Support for PyTorch, TensorFlow, and ONNX models
- Secure memory management and cleanup
- Model caching for performance

**Usage:**
```bash
# Load single model
python3 secure_model_loader.py \
  --model-path /models/model.pt.encrypted \
  --model-type pytorch \
  --keyvault-url https://your-kv.vault.azure.net/

# Skip attestation (for testing)
python3 secure_model_loader.py \
  --model-path /models/model.pt.encrypted \
  --skip-attestation
```

**Python API:**
```python
from secure_model_loader import SecureModelLoader

# Initialize loader
loader = SecureModelLoader(
    keyvault_url="https://your-kv.vault.azure.net/",
    validate_attestation=True
)

# Load encrypted model
model = loader.load_encrypted_model(
    model_path="/models/model.pt.encrypted",
    model_type="pytorch"
)

# Use model for inference
output = model(input_tensor)

# Cleanup
loader.cleanup()
```

### 2. Key Loader (`key_loader.py`)

Handles secure key and secret retrieval from Azure Key Vault.

**Features:**
- Key Vault key and secret retrieval
- Cryptographic operations (encrypt/decrypt)
- Model file decryption
- Key caching
- Attestation token support

**Usage:**
```bash
# Retrieve key
python3 key_loader.py \
  --keyvault-url https://your-kv.vault.azure.net/ \
  --key-name model-encryption-key

# Retrieve secret
python3 key_loader.py \
  --keyvault-url https://your-kv.vault.azure.net/ \
  --secret-name database-connection

# List all keys
python3 key_loader.py \
  --keyvault-url https://your-kv.vault.azure.net/ \
  --list-keys
```

**Python API:**
```python
from key_loader import KeyLoader

# Initialize loader
loader = KeyLoader(keyvault_url="https://your-kv.vault.azure.net/")

# Get encryption key
key = loader.get_key("model-encryption-key")

# Get secret
secret = loader.get_secret("api-key")

# Decrypt model
loader.decrypt_model(
    encrypted_path="/models/model.encrypted",
    output_path="/cache/model.pt",
    metadata=metadata_dict
)
```

### 3. Attestation Validator (`attestation_validator.py`)

Validates TEE attestation for SGX, SEV-SNP, and TDX environments.

**Features:**
- Automatic TEE type detection
- Local attestation validation
- Remote attestation verification
- Policy compliance checking
- Support for SGX, SEV-SNP, and TDX

**Usage:**
```bash
# Detect TEE type
python3 attestation_validator.py --detect

# Validate local attestation
python3 attestation_validator.py --validate-local

# Validate remote attestation token
python3 attestation_validator.py \
  --attestation-endpoint https://attestation.azure.net \
  --token $ATTESTATION_TOKEN
```

**Python API:**
```python
from attestation_validator import AttestationValidator

# Initialize validator
validator = AttestationValidator()

# Detect TEE type
tee_type, details = validator.detect_tee_type()
print(f"Running in {tee_type} TEE")

# Validate local attestation
result = validator.validate_local_attestation()
if result["valid"]:
    print(f"Attestation valid - TCB Level: {result['tcb_level']}")

# Verify policy compliance
compliant = validator.verify_policy_compliance(result)
```

### 4. Secure Inference Entrypoint (`secure_inference_entrypoint.sh`)

Bootstrap script for secure inference workloads in TEE.

**Features:**
- TEE attestation validation
- Encrypted model loading
- Key Vault integration
- Health checks
- Secure cleanup on exit

**Usage:**
```bash
# Set environment variables
export KEYVAULT_URL="https://your-kv.vault.azure.net/"
export MODEL_STORAGE="/models"
export ATTESTATION_REQUIRED="true"

# Run entrypoint
./secure_inference_entrypoint.sh
```

**Docker Integration:**
```dockerfile
FROM python:3.9

COPY infrastructure/tee-utilities /tee-utilities
COPY app/ /app

ENTRYPOINT ["/tee-utilities/secure_inference_entrypoint.sh"]
```

### 5. Secure RL Training Entrypoint (`secure_rl_training_entrypoint.sh`)

Bootstrap script for secure RL training workloads in TEE.

**Features:**
- Training data decryption
- Base model loading
- Checkpoint encryption
- GPU configuration
- Distributed training support

**Usage:**
```bash
# Set environment variables
export KEYVAULT_URL="https://your-kv.vault.azure.net/"
export MODEL_STORAGE="/models"
export DATA_STORAGE="/data"
export CHECKPOINT_DIR="/checkpoints"
export TRAINING_MODE="distributed"
export NUM_WORKERS="4"

# Run entrypoint
./secure_rl_training_entrypoint.sh
```

**Environment Variables:**
- `TRAINING_MODE`: `distributed` or `single` (default: distributed)
- `NUM_WORKERS`: Number of training workers (default: 4)
- `BATCH_SIZE`: Training batch size (default: 32)
- `LEARNING_RATE`: Learning rate (default: 0.001)
- `MAX_EPISODES`: Maximum training episodes (default: 1000)

### 6. Bootstrap Signed Container (`bootstrap_signed_container.sh`)

Validates container signatures and initializes secure runtime environment.

**Features:**
- Container signature verification (cosign)
- Image integrity validation
- TEE environment setup
- Security monitoring
- Network security checks

**Usage:**
```bash
# Set environment variables
export CONTAINER_IMAGE="registry.azurecr.io/rl-inference:v1"
export REGISTRY_URL="registry.azurecr.io"
export SIGNATURE_VALIDATION="true"
export ATTESTATION_REQUIRED="true"

# Run bootstrap
./bootstrap_signed_container.sh /app/entrypoint.sh
```

**Container Integration:**
```dockerfile
FROM mcr.microsoft.com/cbl-mariner/base/core:2.0

COPY infrastructure/tee-utilities/bootstrap_signed_container.sh /bootstrap.sh
COPY app/entrypoint.sh /app/entrypoint.sh

ENTRYPOINT ["/bootstrap.sh", "/app/entrypoint.sh"]
```

### 7. Readiness Probe (`readiness_probe.py`)

Kubernetes-compatible readiness probe for TEE workloads.

**Features:**
- TEE attestation check
- Key Vault connectivity check
- Model availability check
- Service port check
- Health endpoint check
- System resource monitoring

**Usage:**
```bash
# Run readiness check
python3 readiness_probe.py

# Output as JSON
python3 readiness_probe.py --json

# Wait before checking
python3 readiness_probe.py --wait 10
```

**Kubernetes Integration:**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: tee-inference
spec:
  containers:
    - name: inference
      image: inference:latest
      readinessProbe:
        exec:
          command:
            - python3
            - /tee-utilities/readiness_probe.py
        initialDelaySeconds: 30
        periodSeconds: 10
        timeoutSeconds: 5
        successThreshold: 1
        failureThreshold: 3
```

**Configuration File** (`/etc/tee/readiness-config.json`):
```json
{
  "attestation_required": true,
  "keyvault_check": true,
  "model_check": true,
  "port_check": true,
  "timeout": 30,
  "keyvault_url": "https://your-kv.vault.azure.net/",
  "model_path": "/models",
  "service_port": 8000
}
```

## Installation

### Prerequisites

```bash
# Python dependencies
pip install azure-identity azure-keyvault-keys azure-keyvault-secrets \
    cryptography torch numpy requests

# System dependencies
apt-get update && apt-get install -y \
    jq curl skopeo cosign

# For TEE support
# SGX: Install SGX SDK and DCAP libraries
# SEV-SNP: Install AMD SEV tools
# TDX: Install Intel TDX components
```

### Setup

```bash
# Clone utilities
cp -r infrastructure/tee-utilities /opt/tee-utilities

# Make scripts executable
chmod +x /opt/tee-utilities/*.sh

# Set PATH
export PATH="/opt/tee-utilities:$PATH"
```

## TEE Environment Setup

### Intel SGX

```bash
# Install SGX driver (in-kernel driver for kernel 5.11+)
# Or install DCAP driver for older kernels

# Install DCAP libraries
wget https://download.01.org/intel-sgx/sgx-linux/2.19/distro/ubuntu22.04-server/sgx_linux_x64_sdk_2.19.100.3.bin
chmod +x sgx_linux_x64_sdk_2.19.100.3.bin
./sgx_linux_x64_sdk_2.19.100.3.bin

# Verify SGX support
ls -l /dev/sgx*
```

### AMD SEV-SNP

```bash
# Check SEV-SNP support
dmesg | grep -i sev

# Verify SEV device
ls -l /dev/sev

# Check SNP enabled
cat /sys/module/kvm_amd/parameters/sev_snp
```

### Intel TDX

```bash
# Check TDX support
ls -l /sys/firmware/tdx_seam

# Verify TDX kernel support
dmesg | grep -i tdx
```

## Integration Examples

### Inference Service with TEE

```python
# app/inference_service.py
from fastapi import FastAPI
from secure_model_loader import SecureModelLoader
import torch

app = FastAPI()
loader = SecureModelLoader()

# Load model at startup
model = loader.load_encrypted_model(
    model_path="/models/model.pt.encrypted",
    model_type="pytorch"
)

@app.post("/predict")
async def predict(data: dict):
    input_tensor = torch.tensor(data["input"])
    with torch.no_grad():
        output = model(input_tensor)
    return {"output": output.tolist()}

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

### Training Job with TEE

```python
# app/training.py
from secure_model_loader import SecureModelLoader
from key_loader import KeyLoader
import torch
import torch.nn as nn

# Load base model
loader = SecureModelLoader()
model = loader.load_encrypted_model("/models/base_model.pt.encrypted")

# Training loop
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
criterion = nn.MSELoss()

for episode in range(1000):
    # Training logic here
    loss = train_step(model, optimizer, criterion)
    
    if episode % 100 == 0:
        # Save encrypted checkpoint
        checkpoint_path = f"/checkpoints/checkpoint_{episode}.pt"
        torch.save(model.state_dict(), checkpoint_path)
        
        # Encrypt checkpoint
        os.system(f"python3 /keyvault/encrypt-model.py "
                 f"--keyvault-url $KEYVAULT_URL "
                 f"--model {checkpoint_path} "
                 f"--output {checkpoint_path}.encrypted")

loader.cleanup()
```

## Security Best Practices

1. **Always validate attestation** in production environments
2. **Use encrypted models** for sensitive intellectual property
3. **Enable secure cleanup** on process termination
4. **Monitor TEE health** with readiness probes
5. **Rotate encryption keys** regularly
6. **Audit access logs** for Key Vault operations
7. **Use signed containers** with verified signatures
8. **Implement least privilege** for Key Vault access

## Troubleshooting

### TEE Not Detected

```bash
# Check for TEE devices
ls -l /dev/sgx* /dev/sev /sys/firmware/tdx_seam

# Verify kernel support
dmesg | grep -E "sgx|sev|tdx"

# Check BIOS settings
# Ensure SGX/SEV/TDX is enabled in BIOS
```

### Key Vault Access Denied

```bash
# Check workload identity
echo $AZURE_CLIENT_ID

# Verify token acquisition
az account get-access-token --resource https://vault.azure.net

# Check RBAC assignments
az role assignment list \
  --assignee $AZURE_CLIENT_ID \
  --scope /subscriptions/$SUB_ID/resourceGroups/$RG/providers/Microsoft.KeyVault/vaults/$KV_NAME
```

### Model Loading Fails

```bash
# Check model files
ls -lh /models/

# Verify metadata
cat /models/model.pt.encrypted.metadata.json | jq

# Test decryption
python3 key_loader.py \
  --keyvault-url $KEYVAULT_URL \
  --key-name model-encryption-key
```

### Attestation Validation Fails

```bash
# Check TEE type
python3 attestation_validator.py --detect

# Validate locally
python3 attestation_validator.py --validate-local --debug

# Check policy
cat /etc/tee/attestation-policy.json | jq
```

## Performance Optimization

1. **Cache decrypted models** to avoid repeated Key Vault calls
2. **Preload models** at startup for faster inference
3. **Use GPU acceleration** when available
4. **Batch requests** to improve throughput
5. **Enable model quantization** for faster inference

## Monitoring and Logging

All utilities log to `/var/log/` by default:
- Inference: `/var/log/secure-inference.log`
- Training: `/var/log/secure-rl-training.log`
- Bootstrap: `/var/log/container-bootstrap.log`

View logs:
```bash
tail -f /var/log/secure-inference.log
journalctl -u inference-service -f
```

## References

- [Intel SGX Developer Guide](https://software.intel.com/content/www/us/en/develop/topics/software-guard-extensions.html)
- [AMD SEV-SNP Documentation](https://developer.amd.com/sev/)
- [Azure Confidential Computing](https://docs.microsoft.com/azure/confidential-computing/)
- [Kata Containers](https://katacontainers.io/)
