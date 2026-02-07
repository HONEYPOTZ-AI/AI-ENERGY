# Gatekeeper Policy Pack

Comprehensive OPA Gatekeeper policies for Kubernetes security enforcement using Rego language.

## Overview

This policy pack uses OPA (Open Policy Agent) Gatekeeper to enforce security controls:
- **ConstraintTemplates**: Define reusable policy logic in Rego
- **Constraints**: Instantiate templates with specific parameters
- **Audit**: Report violations without blocking
- **Enforcement**: Block non-compliant resources

## Architecture

```
gatekeeper/
├── templates/           # ConstraintTemplates (Rego logic)
├── constraints/         # Constraint instances (configuration)
└── tests/              # Test cases
```

## Constraint Templates

### 1. ImageSignatureVerification
**File**: `templates/imagesignatureverification.yaml`

Validates container image signatures and registries.

**Parameters:**
- `allowedRegistries`: List of approved registries
- `requireSignature`: Enforce signature verification
- `bannedTags`: Tags that are not allowed (e.g., latest)

### 2. RuntimeClassConstraints
**File**: `templates/runtimeclassconstraints.yaml`

Enforces RuntimeClass usage based on labels.

**Parameters:**
- `requiredRuntimeClass`: RuntimeClass name to enforce
- `labelSelector`: Label that triggers the requirement

### 3. TEEAttestationPreconditions
**File**: `templates/teeattestationpreconditions.yaml`

Validates TEE/confidential computing configuration.

**Parameters:**
- `requiredAnnotations`: Required attestation annotations
- `allowedRuntimeClasses`: Permitted runtime classes for TEE
- `requiredNodeSelectors`: Required node selector labels

### 4. GPUNodeLabeling
**File**: `templates/gpunodelabeling.yaml`

Enforces GPU resource management policies.

**Parameters:**
- `gpuResourceName`: GPU resource name (e.g., nvidia.com/gpu)
- `requiredNodeLabels`: Required node selector labels
- `requiredTolerations`: Required tolerations

### 5. CapabilitiesRestrictions
**File**: `templates/capabilitiesrestrictions.yaml`

Restricts Linux capabilities.

**Parameters:**
- `allowedCapabilities`: Capabilities that can be added
- `requiredDropCapabilities`: Capabilities that must be dropped
- `allowPrivileged`: Whether privileged is allowed

### 6. FilesystemIsolation
**File**: `templates/filesystemisolation.yaml`

Controls filesystem access and volume types.

**Parameters:**
- `allowedVolumeTypes`: Permitted volume types
- `allowedHostPaths`: Allowed hostPath patterns (for system)
- `requireReadOnlyRoot`: Enforce read-only root filesystem

### 7. TLSVersion (Ingress TLS validation)
**Template included in constraints**

Validates TLS configuration for Ingress resources.

## Installation

### Install Gatekeeper
```bash
# Install Gatekeeper using Helm
helm repo add gatekeeper https://open-policy-agent.github.io/gatekeeper/charts
helm install gatekeeper/gatekeeper --name-template=gatekeeper --namespace gatekeeper-system --create-namespace
```

### Verify Installation
```bash
kubectl get pods -n gatekeeper-system
kubectl get crd | grep gatekeeper
```

### Apply Templates
```bash
# Apply all constraint templates
kubectl apply -f templates/

# Verify templates
kubectl get constrainttemplates
```

### Apply Constraints
```bash
# Apply all constraints
kubectl apply -f constraints/

# Verify constraints
kubectl get constraints
```

## Constraint Instances

### require-signed-images
Enforces signed images from approved registries.

```bash
kubectl apply -f constraints/require-signed-images.yaml
```

### block-privileged-containers
Blocks privileged containers and dangerous capabilities.

```bash
kubectl apply -f constraints/block-privileged-containers.yaml
```

### enforce-kata-runtime-on-tee
Enforces Kata-CC runtime for confidential workloads.

```bash
kubectl apply -f constraints/enforce-kata-runtime-on-tee.yaml
```

### enforce-gpu-node-usage
Ensures GPU pods are properly configured.

```bash
kubectl apply -f constraints/enforce-gpu-node-usage.yaml
```

### restrict-capabilities
Restricts Linux capabilities.

```bash
kubectl apply -f constraints/restrict-capabilities.yaml
```

### restrict-hostpath
Controls hostPath volume usage.

```bash
kubectl apply -f constraints/restrict-hostpath.yaml
```

### enforce-min-tls-version
Enforces minimum TLS version.

```bash
kubectl apply -f constraints/enforce-min-tls-version.yaml
```

## Testing

### Dry Run Tests
```bash
# Test against policy
kubectl apply -f tests/test-signed-images.yaml --dry-run=server

# Should show admission webhook denial for invalid configs
```

### Audit Results
```bash
# View audit results for a constraint
kubectl get <constraint-name> <instance-name> -o yaml

# Example
kubectl get k8simagesignatureverification require-signed-images -o yaml
```

### Constraint Status
```bash
# Check constraint status
kubectl get constraints

# Detailed view
kubectl describe k8simagesignatureverification require-signed-images
```

## Enforcement Modes

### Audit Mode (dryrun)
Reports violations but doesn't block:
```yaml
spec:
  enforcementAction: dryrun
```

### Enforce Mode (deny)
Blocks non-compliant resources:
```yaml
spec:
  enforcementAction: deny
```

### Warn Mode
Shows warning but allows:
```yaml
spec:
  enforcementAction: warn
```

## Exemptions

### Namespace Exemptions
```yaml
spec:
  match:
    excludedNamespaces:
    - kube-system
    - kube-public
```

### Label-based Exemptions
```yaml
spec:
  match:
    namespaceSelector:
      matchExpressions:
      - key: policy-exempt
        operator: DoesNotExist
```

## Monitoring

### Prometheus Metrics
Gatekeeper exposes metrics:
- `gatekeeper_constraints`: Number of constraints
- `gatekeeper_constraint_templates`: Number of templates
- `gatekeeper_violations`: Current violations

### View Violations
```bash
# Get violations from constraint status
kubectl get constraints -A -o yaml | grep -A 10 violations

# Detailed constraint status
kubectl get k8simagesignatureverification require-signed-images -o jsonpath='{.status.violations}'
```

## Debugging

### Test Rego Policy
```bash
# Use gator CLI to test policies
gator test -f templates/ -f tests/

# Dry run with specific resource
gator verify -f constraints/ -f tests/test-signed-images.yaml
```

### View Policy Logic
```bash
# Get ConstraintTemplate with Rego code
kubectl get constrainttemplate k8simagesignatureverification -o yaml
```

### Logs
```bash
# Gatekeeper controller logs
kubectl logs -n gatekeeper-system -l control-plane=controller-manager

# Audit logs
kubectl logs -n gatekeeper-system -l control-plane=audit-controller
```

## Best Practices

1. **Start with Audit**: Deploy constraints in `dryrun` mode first
2. **Review Violations**: Check audit results before enforcing
3. **Gradual Rollout**: Enable enforcement per namespace
4. **Test Policies**: Use `gator` CLI to test before applying
5. **Monitor Performance**: Watch for policy evaluation latency
6. **Document Exemptions**: Clear justification for each exemption
7. **Version Control**: Store policies in Git
8. **Regular Updates**: Review and update policies quarterly

## Performance Tuning

### Limit Policy Scope
```yaml
spec:
  match:
    kinds:
    - apiGroups: [""]
      kinds: ["Pod"]
    namespaceSelector:
      matchLabels:
        enforce-policies: "true"
```

### Optimize Rego
- Use `input.review.object` instead of iterating
- Minimize loop iterations
- Cache intermediate results

### Audit Interval
```bash
# Adjust audit interval (default 60s)
helm upgrade gatekeeper gatekeeper/gatekeeper \
  --set auditInterval=120 \
  -n gatekeeper-system
```

## Migration from Kyverno

Both policy packs enforce the same controls. Key differences:

| Feature | Kyverno | Gatekeeper |
|---------|---------|------------|
| Language | YAML | Rego |
| Mutation | Built-in | External Mutator |
| Validation | Pattern matching | Rego logic |
| Performance | Fast | Moderate |
| Flexibility | Medium | High |

## Troubleshooting

### Constraint Not Working
```bash
# Check constraint status
kubectl get constraint <name> -o yaml

# Check if template exists
kubectl get constrainttemplate

# View Gatekeeper logs
kubectl logs -n gatekeeper-system deployment/gatekeeper-controller-manager
```

### Admission Webhook Errors
```bash
# Check webhook configuration
kubectl get validatingwebhookconfigurations | grep gatekeeper

# Verify Gatekeeper service
kubectl get svc -n gatekeeper-system
```

### Performance Issues
```bash
# Check resource usage
kubectl top pods -n gatekeeper-system

# Review audit frequency
kubectl get deployment -n gatekeeper-system gatekeeper-audit -o yaml
```

## References

- [OPA Gatekeeper Documentation](https://open-policy-agent.github.io/gatekeeper/)
- [Rego Language](https://www.openpolicyagent.org/docs/latest/policy-language/)
- [Gatekeeper Library](https://github.com/open-policy-agent/gatekeeper-library)
- [Constraint Framework](https://github.com/open-policy-agent/frameworks/tree/master/constraint)

## Contributing

When adding new policies:
1. Create ConstraintTemplate in `templates/`
2. Write Rego test cases
3. Create Constraint instance in `constraints/`
4. Add test resources in `tests/`
5. Update this README
6. Test with `gator` CLI

## License

Copyright © 2024
