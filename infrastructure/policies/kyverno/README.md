# Kyverno Policy Pack

Comprehensive Kyverno policies for securing Kubernetes workloads with focus on confidential computing, GPU workloads, and security best practices.

## Overview

This policy pack enforces security controls across the platform infrastructure:
- **Image Security**: Require signed images
- **Container Security**: Block privileged containers, validate non-root users
- **TEE/Confidential Computing**: Enforce Kata runtime on TEE workloads
- **GPU Workloads**: Enforce proper GPU node usage
- **Filesystem Security**: Restrict hostPath volumes
- **Network Security**: Enforce minimum TLS version

## Policies

### 1. require-signed-images
**File**: `policies/require-signed-images.yaml`

Validates that container images are signed using Sigstore/Cosign signatures.

**Enforcement**: All production workloads must use signed images
**Exemptions**: system namespaces (kube-system, kube-public, kube-node-lease)

### 2. block-privileged-containers
**File**: `policies/block-privileged-containers.yaml`

Blocks containers running with privileged: true or dangerous capabilities.

**Enforcement**: Audit mode in development, Enforce in production
**Exemptions**: System workloads with special annotation

### 3. enforce-kata-runtime-on-tee
**File**: `policies/enforce-kata-runtime-on-tee.yaml`

Ensures confidential workloads use Kata-CC runtime class.

**Enforcement**: Workloads with label `confidential=true` must specify `runtimeClassName: kata-cc`

### 4. enforce-gpu-node-usage
**File**: `policies/enforce-gpu-node-usage.yaml`

Ensures GPU-requesting pods are scheduled on GPU nodes.

**Enforcement**: Pods requesting nvidia.com/gpu must have nodeSelector for GPU nodes

### 5. restrict-hostpath
**File**: `policies/restrict-hostpath.yaml`

Restricts or blocks hostPath volume mounts.

**Enforcement**: Block hostPath in production, allow only specific paths in system namespaces

### 6. enforce-min-tls-version
**File**: `policies/enforce-min-tls-version.yaml`

Enforces minimum TLS 1.2 for Ingress resources.

**Enforcement**: All Ingress resources must specify TLS 1.2 or higher

### 7. validate-non-root-user
**File**: `policies/validate-non-root-user.yaml`

Validates containers run as non-root user.

**Enforcement**: All containers must specify runAsNonRoot: true

## Installation

### Install Kyverno
```bash
# Install Kyverno using Helm
helm repo add kyverno https://kyverno.github.io/kyverno/
helm repo update
helm install kyverno kyverno/kyverno -n kyverno --create-namespace
```

### Apply Policies
```bash
# Apply all policies
kubectl apply -f policies/

# Apply specific policy
kubectl apply -f policies/require-signed-images.yaml
```

### Verify Installation
```bash
# Check Kyverno is running
kubectl get pods -n kyverno

# List all policies
kubectl get clusterpolicies

# Check policy status
kubectl get clusterpolicies require-signed-images -o yaml
```

## Testing

Test resources are provided in the `tests/` directory.

### Run Tests
```bash
# Test valid deployment (should pass)
kubectl apply -f tests/test-require-signed-images.yaml --dry-run=server

# Test invalid deployment (should fail)
kubectl apply -f tests/test-block-privileged-containers.yaml --dry-run=server
```

### Policy Reports
```bash
# View policy violations
kubectl get policyreport -A

# View cluster-wide violations
kubectl get clusterpolicyreport

# Detailed report
kubectl describe policyreport -n <namespace>
```

## Policy Modes

### Audit Mode
Policies in audit mode report violations but don't block resources:
```yaml
spec:
  validationFailureAction: Audit
```

### Enforce Mode
Policies in enforce mode block non-compliant resources:
```yaml
spec:
  validationFailureAction: Enforce
```

## Exemptions

### Namespace Exemptions
Exclude specific namespaces:
```yaml
spec:
  match:
    any:
    - resources:
        namespaces:
        - "!kube-system"
        - "!kube-public"
```

### Annotation-based Exemptions
Skip policy for specific resources:
```yaml
metadata:
  annotations:
    policies.kyverno.io/exclude: "true"
```

## Best Practices

1. **Start with Audit Mode**: Deploy policies in audit mode first to identify violations
2. **Review Reports**: Analyze policy reports before switching to enforce mode
3. **Gradual Rollout**: Enable enforcement per namespace or workload type
4. **Document Exemptions**: All exemptions should have justification
5. **Regular Review**: Periodically review and update policies

## Monitoring

### Prometheus Metrics
Kyverno exposes metrics for monitoring:
- `kyverno_policy_rule_results_total`: Policy rule execution results
- `kyverno_admission_requests_total`: Total admission requests
- `kyverno_policy_execution_duration_seconds`: Policy execution time

### Alerts
Set up alerts for:
- High policy violation rates
- Policy execution failures
- Configuration errors

## Troubleshooting

### Policy Not Applied
```bash
# Check policy status
kubectl get clusterpolicy <policy-name> -o yaml

# Check Kyverno logs
kubectl logs -n kyverno -l app.kubernetes.io/name=kyverno
```

### Resource Blocked Unexpectedly
```bash
# Check which policy blocked it
kubectl get events --sort-by='.lastTimestamp'

# Review policy report
kubectl get policyreport -A
```

### Performance Issues
```bash
# Check resource usage
kubectl top pods -n kyverno

# Review policy execution times in metrics
```

## Contributing

When adding new policies:
1. Create policy YAML in `policies/`
2. Add test cases in `tests/`
3. Update this README
4. Test in audit mode first
5. Document exemptions and rationale

## References

- [Kyverno Documentation](https://kyverno.io/docs/)
- [Policy Library](https://kyverno.io/policies/)
- [Best Practices](https://kyverno.io/docs/writing-policies/best-practices/)
- [CLI Tool](https://kyverno.io/docs/kyverno-cli/)

## License

Copyright © 2024
