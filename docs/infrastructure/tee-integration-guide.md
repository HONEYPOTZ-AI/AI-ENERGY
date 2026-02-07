# Trusted Execution Environment (TEE) Integration Guide

## Overview

This guide provides comprehensive instructions for setting up and integrating Trusted Execution Environment (TEE) into your Kubernetes cluster. TEE ensures sensitive workloads run in a protected execution environment with hardware-backed isolation.

## Architecture Overview

```mermaid
graph TB
    subgraph "Host System"
        Hypervisor["Hypervisor<br/>QEMU/KVM"]
        VM["Kata Containers<br/>Lightweight VM"]
    end
    
    subgraph "TEE Runtime"
        TEEAgent["TEE Agent<br/>DaemonSet"]
        Enclave["Enclave<br/>Secure Area"]
        Attestation["Attestation<br/>Service"]
    end
    
    subgraph "Workload"
        App["ML Model<br/>Inference"]
        Secrets["Encrypted<br/>Secrets"]
        Keys["Encryption<br/>Keys"]
    end
    
    subgraph "Trust Anchors"
        PCRS["Platform Config<br/>Registers"]
        HW["Hardware<br/>Security"]
        SignedMeas["Signed<br/>Measurements"]
    end
    
    Hypervisor --> VM
    VM --> TEEAgent
    TEEAgent --> Enclave
    Enclave --> Attestation
    Attestation --> SignedMeas
    SignedMeas --> PCRS
    PCRS --> HW
    App --> Enclave
    Secrets --> Enclave
    Keys --> Enclave
```

## Prerequisites

### Hardware Requirements

1. **Processor Support**
   - Intel SGX (Software Guard Extensions) OR
   - AMD SEV (Secure Encrypted Virtualization) OR
   - ARM TrustZone

2. **Virtualization Support**
   - Intel VT-x or AMD-V enabled
   - Nested virtualization for TEE in VMs
   - TPM 2.0 (optional but recommended)

3. **Memory Requirements**
   - Minimum 32GB RAM per TEE node
   - SGX: 128MB - 256MB enclave memory
   - SEV: Overhead ~300MB per VM

### Software Requirements

```bash
# Check for TEE support
grep -o 'sgx\|sev' /proc/cpuinfo

# Verify virtualization
kvm-ok  # For KVM/Intel
grep -c '^processor' /proc/cpuinfo  # Core count

# Install dependencies
sudo apt-get update
sudo apt-get install -y \
  qemu-kvm \
  libvirt-daemon \
  libvirt-clients \
  bridge-utils \
  kata-runtime \
  containerd
```

### Azure Resources

```bash
# Check available VM sizes with TEE support
az vm list-sizes --location eastus | \
  jq '.[] | select(.name | contains("DCsv")) | .name'

# Supported SKUs:
# - Standard_DC2s_v2 (2 vCPU, 8GB RAM)
# - Standard_DC4s_v2 (4 vCPU, 16GB RAM)
# - Standard_DC8s_v2 (8 vCPU, 32GB RAM)
```

## Step 1: Enable Kata Containers Runtime

### 1.1 Install Kata Runtime

```bash
#!/bin/bash
# Install Kata Containers

# Add Kata repository
distribution=$(. /etc/os-release; echo $ID$VERSION_ID)
curl -sL https://download.opensuse.org/repositories/home:/katacontainers:/releases:/${arch}:/master/$distribution/home:katacontainers:releases:${arch}:master.repo | \
  sudo tee /etc/apt/sources.list.d/kata-containers.list

# Install Kata
sudo apt-get update
sudo apt-get install -y kata-runtime

# Verify installation
kata-runtime --version
kata-runtime kata-check
```

### 1.2 Configure Containerd for Kata

```bash
# Edit containerd configuration
sudo mkdir -p /etc/containerd
sudo containerd config default | sudo tee /etc/containerd/config.toml > /dev/null

# Add Kata runtime configuration
sudo cat >> /etc/containerd/config.toml <<EOF
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.kata]
  runtime_engine = "io.containerd.kata.v2"
  runtime_root = ""
  runtime_type = "io.containerd.kata.v2"
  privileged_without_host_devices = false
  base_runtime_spec = "runc"

[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.kata.options]
  BinaryName = "/opt/kata/bin/kata-runtime"
EOF

# Restart containerd
sudo systemctl daemon-reload
sudo systemctl restart containerd
```

### 1.3 Create Kata RuntimeClass

```bash
kubectl apply -f - <<EOF
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: kata
handler: kata
overhead:
  podFixed:
    memory: "160Mi"
    cpu: "250m"
scheduling:
  nodeSelector:
    workload-type: tee-gpu
tolerations:
  - key: tee
    operator: Equal
    value: enabled
    effect: NoSchedule
EOF

# Verify RuntimeClass
kubectl get runtimeclass
```

## Step 2: Deploy TEE Runtime DaemonSet

### 2.1 Deploy TEE Agent DaemonSet

```bash
# Using Helm chart
helm install tee-runtime ./infrastructure/helm/tee-runtime \
  --namespace tee-runtime \
  --create-namespace \
  --values infrastructure/helm/tee-runtime/values-prod.yaml \
  --set nodeSelector.workload-type=tee-gpu \
  --set image.repository=myacr.azurecr.io/tee-runtime \
  --set image.tag=v1.0.0

# Or apply manifest directly
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: tee-runtime-agent
  namespace: tee-runtime
spec:
  selector:
    matchLabels:
      app: tee-runtime-agent
  template:
    metadata:
      labels:
        app: tee-runtime-agent
    spec:
      nodeSelector:
        workload-type: tee-gpu
      serviceAccountName: tee-runtime
      hostNetwork: true
      hostPID: true
      containers:
      - name: tee-agent
        image: myacr.azurecr.io/tee-runtime:v1.0.0
        securityContext:
          privileged: true
        volumeMounts:
        - name: host
          mountPath: /host
        - name: run
          mountPath: /run
        env:
        - name: INTEL_SGX_DRIVER_PATH
          value: "/host/dev/isgx"
        - name: TEE_MODE
          value: "sgx"  # or "sev", "trustzone"
      volumes:
      - name: host
        hostPath:
          path: /
      - name: run
        hostPath:
          path: /run
EOF

# Verify DaemonSet deployment
kubectl rollout status daemonset/tee-runtime-agent -n tee-runtime
```

### 2.2 Configure TEE Parameters

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: tee-config
  namespace: tee-runtime
data:
  tee-type: "sgx"  # sgx, sev, or trustzone
  enclave-size: "268435456"  # 256MB
  heap-size: "134217728"  # 128MB
  stack-size: "8388608"  # 8MB
  attestation-type: "ecdsa"
  pcr-values: |
    PCR-0: "mrenclave"
    PCR-1: "mrsigner"
    PCR-2: "attributes"
  key-provisioning: "remote"
  measurement-algorithm: "sha256"
---
apiVersion: v1
kind: Secret
metadata:
  name: tee-keys
  namespace: tee-runtime
type: Opaque
stringData:
  signing-key: |
    -----BEGIN PRIVATE KEY-----
    MIIEvQIBADANBgkqhkiG9w0BAQE...
    -----END PRIVATE KEY-----
  attestation-key: |
    -----BEGIN PRIVATE KEY-----
    MIIEvQIBADANBgkqhkiG9w0BAQE...
    -----END PRIVATE KEY-----
```

## Step 3: Attestation Configuration

### 3.1 Setup Attestation Service

```bash
# Deploy attestation service
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: attestation-service
  namespace: tee-runtime
spec:
  replicas: 3
  selector:
    matchLabels:
      app: attestation-service
  template:
    metadata:
      labels:
        app: attestation-service
    spec:
      serviceAccountName: attestation-service
      containers:
      - name: attestation
        image: myacr.azurecr.io/attestation-service:v1.0.0
        ports:
        - containerPort: 8080
        env:
        - name: ATTESTATION_TYPE
          value: "ecdsa"
        - name: QUOTE_TYPE
          value: "unlinkable"
        volumeMounts:
        - name: config
          mountPath: /etc/attestation
      volumes:
      - name: config
        configMap:
          name: attestation-config
---
apiVersion: v1
kind: Service
metadata:
  name: attestation-service
  namespace: tee-runtime
spec:
  selector:
    app: attestation-service
  ports:
  - port: 8080
    targetPort: 8080
  type: ClusterIP
EOF
```

### 3.2 Configure Attestation Policy

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: attestation-policy
  namespace: tee-runtime
data:
  policy.yaml: |
    attestation_policy:
      quote_validation:
        - verify_signature: true
        - check_pcr_values: true
        - validate_timestamp: true
        - check_enclave_identity: true
      trusted_enclaves:
        - enclave_id: "ml-inference"
          expected_measurements:
            mr_enclave: "0x123456789abcdef"
            mr_signer: "0xfedcba987654321"
          allowed_versions:
            - "1.0.0"
            - "1.0.1"
        - enclave_id: "rl-training"
          expected_measurements:
            mr_enclave: "0xabcdef0123456789"
            mr_signer: "0x987654321fedcba"
          allowed_versions:
            - "1.0.0"
      revocation_check:
        enabled: true
        crl_distribution_point: "https://revocation.example.com/crl"
        check_interval: "86400"  # 24 hours
      time_verification:
        enabled: true
        drift_tolerance: "300"  # 5 minutes
```

## Step 4: Secure Workload Deployment

### 4.1 Deploy TEE-enabled Workload

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-inference
  namespace: inference
  labels:
    app: secure-inference
    tee-enabled: "true"
spec:
  runtimeClassName: kata
  serviceAccountName: secure-workload
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 2000
  nodeSelector:
    workload-type: tee-gpu
  tolerations:
  - key: tee
    operator: Equal
    value: enabled
    effect: NoSchedule
  containers:
  - name: inference-engine
    image: myacr.azurecr.io/inference:v1.0.0
    imagePullPolicy: Always
    ports:
    - containerPort: 8080
    env:
    - name: TEE_MODE
      value: "enabled"
    - name: ATTESTATION_REQUIRED
      value: "true"
    - name: ATTESTATION_SERVICE_URL
      value: "http://attestation-service.tee-runtime:8080"
    securityContext:
      privileged: false
      allowPrivilegeEscalation: false
      capabilities:
        drop:
          - ALL
      readOnlyRootFilesystem: true
    resources:
      requests:
        memory: "2Gi"
        cpu: "500m"
        nvidia.com/gpu: "1"
      limits:
        memory: "4Gi"
        cpu: "1000m"
        nvidia.com/gpu: "1"
    volumeMounts:
    - name: model-storage
      mountPath: /var/lib/models
      readOnly: true
    - name: tmp
      mountPath: /tmp
    - name: secrets
      mountPath: /var/secrets
      readOnly: true
    livenessProbe:
      httpGet:
        path: /health
        port: 8080
      initialDelaySeconds: 30
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /ready
        port: 8080
      initialDelaySeconds: 10
      periodSeconds: 5
  volumes:
  - name: model-storage
    persistentVolumeClaim:
      claimName: model-pvc
  - name: tmp
    emptyDir:
      sizeLimit: 1Gi
  - name: secrets
    projected:
      sources:
      - secret:
          name: tee-secrets
          items:
          - key: api-key
            path: api-key
      - secret:
          name: model-key
          items:
          - key: encryption-key
            path: model-key
```

### 4.2 Attestation Validation

```bash
#!/bin/bash
# attestation-validator.sh - Validate enclave attestation

POD_NAME="secure-inference"
NAMESPACE="inference"

# Get attestation quote from pod
QUOTE=$(kubectl exec -it "$POD_NAME" -n "$NAMESPACE" -- \
  /usr/bin/get-quote)

echo "Attestation Quote:"
echo "$QUOTE"

# Verify quote with attestation service
ATTESTATION_URL="http://attestation-service.tee-runtime:8080"

curl -X POST "$ATTESTATION_URL/verify" \
  -H "Content-Type: application/json" \
  -d "{\"quote\": \"$QUOTE\"}" | jq .

# Check PCR values
echo "PCR Values:"
kubectl exec "$POD_NAME" -n "$NAMESPACE" -- \
  /usr/bin/get-pcr-values | jq .

# Validate policy compliance
echo "Policy Compliance Check:"
kubectl exec "$POD_NAME" -n "$NAMESPACE" -- \
  /usr/bin/verify-policy
```

## Step 5: Model Encryption & Loading

### 5.1 Model Encryption

```bash
#!/usr/bin/env python3
# encrypt_model.py - Encrypt ML models for TEE

import os
import json
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2
from pathlib import Path

def encrypt_model(model_path: str, output_path: str, key: bytes = None):
    """Encrypt ML model file for TEE storage."""
    
    # Generate or use provided key
    if key is None:
        key = Fernet.generate_key()
    
    cipher = Fernet(key)
    
    # Read model file
    with open(model_path, 'rb') as f:
        model_data = f.read()
    
    # Encrypt model
    encrypted_data = cipher.encrypt(model_data)
    
    # Create manifest
    manifest = {
        "model_name": Path(model_path).name,
        "original_size": len(model_data),
        "encrypted_size": len(encrypted_data),
        "algorithm": "Fernet",
        "key_id": key[:8].hex(),  # First 8 bytes as key ID
    }
    
    # Write encrypted model
    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_file, 'wb') as f:
        f.write(encrypted_data)
    
    # Write manifest
    manifest_file = output_file.with_suffix('.json')
    with open(manifest_file, 'w') as f:
        json.dump(manifest, f, indent=2)
    
    print(f"Model encrypted: {output_file}")
    print(f"Manifest written: {manifest_file}")
    print(f"Encryption key (store securely): {key.decode()}")
    
    return key

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 3:
        print("Usage: python encrypt_model.py <model_path> <output_path>")
        sys.exit(1)
    
    model_path = sys.argv[1]
    output_path = sys.argv[2]
    
    key = encrypt_model(model_path, output_path)
    
    # Store key in Azure Key Vault
    print("\nTo store key in Azure Key Vault:")
    print(f"az keyvault secret set --vault-name myKeyVault \")
    print(f"  --name 'model-encryption-key' \")
    print(f"  --value '{key.decode()}'")
```

### 5.2 Secure Model Loading

```python
#!/usr/bin/env python3
# secure_model_loader.py - Load encrypted models in TEE

import json
import os
from pathlib import Path
from cryptography.fernet import Fernet
from kubernetes import client, config

class SecureModelLoader:
    def __init__(self):
        # Load Kubernetes config for accessing Key Vault secrets
        config.load_incluster_config()
        self.v1 = client.CoreV1Api()
        
    def get_encryption_key(self, secret_name: str, namespace: str) -> bytes:
        """Retrieve encryption key from Kubernetes secret."""
        try:
            secret = self.v1.read_namespaced_secret(secret_name, namespace)
            key = secret.data.get('encryption-key')
            if key:
                return key.encode() if isinstance(key, str) else key
            raise ValueError(f"Key not found in secret {secret_name}")
        except client.exceptions.ApiException as e:
            raise RuntimeError(f"Failed to retrieve secret: {e}")
    
    def load_encrypted_model(self, model_path: str, encryption_key: bytes):
        """Load and decrypt model from encrypted file."""
        
        model_file = Path(model_path)
        manifest_file = model_file.with_suffix('.json')
        
        # Verify manifest
        if not manifest_file.exists():
            raise FileNotFoundError(f"Manifest not found: {manifest_file}")
        
        with open(manifest_file) as f:
            manifest = json.load(f)
        
        print(f"Loading model: {manifest['model_name']}")
        print(f"Original size: {manifest['original_size']} bytes")
        
        # Decrypt model
        cipher = Fernet(encryption_key)
        
        with open(model_file, 'rb') as f:
            encrypted_data = f.read()
        
        try:
            decrypted_data = cipher.decrypt(encrypted_data)
            print(f"✓ Model decrypted successfully")
            return decrypted_data
        except Exception as e:
            raise RuntimeError(f"Decryption failed: {e}")
    
    def verify_attestation(self, attestation_url: str) -> bool:
        """Verify pod attestation before loading model."""
        import requests
        
        try:
            response = requests.get(f"{attestation_url}/status", timeout=5)
            result = response.json()
            
            if result.get('status') == 'verified':
                print("✓ Attestation verified")
                return True
            else:
                print("✗ Attestation verification failed")
                return False
        except Exception as e:
            print(f"⚠ Attestation check failed: {e}")
            return False

if __name__ == "__main__":
    import sys
    
    loader = SecureModelLoader()
    
    # Get encryption key from Kubernetes secret
    try:
        key = loader.get_encryption_key('model-encryption-key', 'default')
        
        # Verify attestation
        attestation_url = os.environ.get('ATTESTATION_SERVICE_URL', 
                                        'http://attestation-service:8080')
        if not loader.verify_attestation(attestation_url):
            print("Attestation failed - refusing to load model")
            sys.exit(1)
        
        # Load encrypted model
        model_data = loader.load_encrypted_model('model.bin.enc', key)
        print(f"Model size: {len(model_data)} bytes")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
```

## Step 6: Measurement & Verification

### 6.1 Collect Enclave Measurements

```bash
#!/bin/bash
# collect-measurements.sh - Collect SGX/SEV measurements

POD_NAME="secure-inference"
NAMESPACE="inference"

echo "=== Enclave Measurements ==="

# Get MRENCLAVE (code measurement)
MRENCLAVE=$(kubectl exec "$POD_NAME" -n "$NAMESPACE" -- \
  sgx-get-mrenclave 2>/dev/null || echo "N/A")
echo "MRENCLAVE: $MRENCLAVE"

# Get MRSIGNER (signer measurement)
MRSIGNER=$(kubectl exec "$POD_NAME" -n "$NAMESPACE" -- \
  sgx-get-mrsigner 2>/dev/null || echo "N/A")
echo "MRSIGNER: $MRSIGNER"

# Get attributes
ATTRIBUTES=$(kubectl exec "$POD_NAME" -n "$NAMESPACE" -- \
  sgx-get-attributes 2>/dev/null || echo "N/A")
echo "Attributes: $ATTRIBUTES"

# Get SEV measurements (if available)
echo -e "\n=== SEV Measurements ==="
SEV_REPORT=$(kubectl exec "$POD_NAME" -n "$NAMESPACE" -- \
  sev-get-report 2>/dev/null || echo "N/A")
echo "$SEV_REPORT"

# Store measurements
cat > measurements.json <<EOF
{
  "pod_name": "$POD_NAME",
  "namespace": "$NAMESPACE",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "measurements": {
    "mrenclave": "$MRENCLAVE",
    "mrsigner": "$MRSIGNER",
    "attributes": "$ATTRIBUTES"
  }
}
EOF

echo -e "\nMeasurements saved to measurements.json"
```

### 6.2 Verify Measurements Against Baseline

```python
#!/usr/bin/env python3
# verify_measurements.py - Verify enclave measurements

import json
from pathlib import Path

class MeasurementVerifier:
    def __init__(self, baseline_file: str):
        with open(baseline_file) as f:
            self.baseline = json.load(f)
    
    def verify(self, current_measurements: dict) -> bool:
        """Verify current measurements match baseline."""
        
        current = current_measurements.get('measurements', {})
        baseline = self.baseline.get('measurements', {})
        
        mismatches = []
        
        for key in ['mrenclave', 'mrsigner', 'attributes']:
            if current.get(key) != baseline.get(key):
                mismatches.append(f"{key}: {current.get(key)} != {baseline.get(key)}")
        
        if mismatches:
            print("❌ Measurement verification FAILED:")
            for mismatch in mismatches:
                print(f"  - {mismatch}")
            return False
        else:
            print("✅ All measurements verified successfully")
            return True

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 3:
        print("Usage: python verify_measurements.py <baseline.json> <current.json>")
        sys.exit(1)
    
    verifier = MeasurementVerifier(sys.argv[1])
    
    with open(sys.argv[2]) as f:
        current = json.load(f)
    
    if verifier.verify(current):
        sys.exit(0)
    else:
        sys.exit(1)
```

## Troubleshooting

### Issue: TEE Not Detected

```bash
# Check CPU features
grep -o 'sgx\|sev' /proc/cpuinfo

# Check kernel support
dmesg | grep -i sgx
dmesg | grep -i sev

# Verify driver installation
ls -la /dev/isgx  # SGX
ls -la /dev/sev   # SEV
```

### Issue: Attestation Failure

```bash
# Check attestation service logs
kubectl logs -n tee-runtime -l app=attestation-service -f

# Verify quote generation
kubectl exec -it <pod-name> -n <namespace> -- \
  /usr/bin/debug-quote

# Check attestation configuration
kubectl describe configmap attestation-policy -n tee-runtime
```

### Issue: Enclave Measurement Mismatch

```bash
# Rebuild enclave with reproducible build
docker build --reproducible-build -t myenclave:v1 .

# Collect new baseline measurements
./collect-measurements.sh > new-baseline.json

# Compare with previous baseline
diff baseline.json new-baseline.json
```

## Best Practices

1. **Attestation Frequency**: Attest on pod startup and periodically
2. **Key Rotation**: Rotate encryption keys every 90 days
3. **Measurement Pinning**: Pin expected measurements in policy
4. **Secure Enclaves**: Minimize enclave size for faster attestation
5. **Logging**: Audit all attestation results
6. **Update Policy**: Update allowed measurements when upgrading
7. **Fallback Handling**: Graceful degradation if TEE unavailable

## References

- [Intel SGX Documentation](https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions.html)
- [AMD SEV Documentation](https://developer.amd.com/sev/)
- [Kata Containers](https://katacontainers.io/)
- [Cloud Confidential Computing Consortium](https://confidentialcomputing.io/)
