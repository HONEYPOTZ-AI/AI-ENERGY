# Kubernetes Policy Packs

Comprehensive policy enforcement for Kubernetes using both Kyverno and OPA Gatekeeper.

## Overview

This directory contains two complete policy packs that enforce the same security controls using different policy engines:

- **Kyverno**: YAML-based policies with pattern matching and mutations
- **Gatekeeper**: OPA Rego-based policies with flexible logic

Both policy packs enforce:
1. **Image Security**: Signed images, approved registries, no latest tags
2. **Container Security**: No privileged containers, restricted capabilities
3. **TEE/Confidential Computing**: Kata-CC runtime enforcement
4. **GPU Workloads**: Proper node selection and resource configuration
5. **Filesystem Security**: HostPath restrictions, read-only root filesystem
6. **Network Security**: Minimum TLS 1.2 for Ingress
7. **User Security**: Non-root user enforcement

## Directory Structure

```
infrastructure/policies/
├── README.md                    # This file
├── kyverno/                     # Kyverno policy pack
│   ├── README.md
│   ├── policies/                # ClusterPolicy definitions
│   │   ├── require-signed-images.yaml
│   │   ├── block-privileged-containers.yaml
│   │   ├── enforce-kata-runtime-on-tee.yaml
│   │   ├── enforce-gpu-node-usage.yaml
│   │   ├── restrict-hostpath.yaml
│   │   ├── enforce-min-tls-version.yaml
│   │   └── validate-non-root-user.yaml
│   └── tests/                   # Test resources
│       ├── test-require-signed-images.yaml
│       ├── test-block-privileged-containers.yaml
│       ├── test-enforce-kata-runtime-on-tee.yaml
│       ├── test-enforce-gpu-node-usage.yaml
│       ├── test-restrict-hostpath.yaml
│       ├── test-enforce-min-tls-version.yaml
│       └── test-validate-non-root-user.yaml
└── gatekeeper/                  # Gatekeeper policy pack
    ├── README.md
    ├── templates/               # ConstraintTemplates (Rego)
    │   ├── imagesignatureverification.yaml
    │   ├── runtimeclassconstraints.yaml
    │   ├── teeattestationpreconditions.yaml
    │   ├── gpunodelabeling.yaml
    │   ├── capabilitiesrestrictions.yaml
    │   └── filesystemisolation.yaml
    ├── constraints/             # Constraint instances
    │   ├── require-signed-images.yaml
    │   ├── block-privileged-containers.yaml
    │   ├── enforce-kata-runtime-on-tee.yaml
    │   ├── enforce-gpu-node-usage.yaml
    │   ├── restrict-capabilities.yaml
    │   ├── restrict-hostpath.yaml
    │   └── enforce-min-tls-version.yaml
    └── tests/                   # Test resources
        ├── test-signed-images.yaml
        ├── test-privileged-containers.yaml
        ├── test-kata-runtime.yaml
        ├── test-gpu-nodes.yaml
        ├── test-capabilities.yaml
        ├── test-hostpath.yaml
        └── test-tls-version.yaml
```

## Quick Start

### Choose Your Policy Engine

**Kyverno** is recommended if you:
- Prefer YAML-based policy definitions
- Want built-in mutation capabilities
- Need simpler policy logic with pattern matching
- Want faster policy evaluation

**Gatekeeper** is recommended if you:
- Need complex policy logic
- Are familiar with Rego language
- Want to use the OPA ecosystem
- Need fine-grained control over constraint matching

### Install Kyverno

```bash
# Install Kyverno
helm repo add kyverno https://kyverno.github.io/kyverno/
helm install kyverno kyverno/kyverno -n kyverno --create-namespace

# Apply policies
kubectl apply -f kyverno/policies/

# View policy reports
kubectl get policyreport -A
```

See [kyverno/README.md](kyverno/README.md) for detailed instructions.

### Install Gatekeeper

```bash
# Install Gatekeeper
helm repo add gatekeeper https://open-policy-agent.github.io/gatekeeper/charts
helm install gatekeeper/gatekeeper --name-template=gatekeeper --namespace gatekeeper-system --create-namespace

# Apply templates and constraints
kubectl apply -f gatekeeper/templates/
kubectl apply -f gatekeeper/constraints/

# View violations
kubectl get constraints
```

See [gatekeeper/README.md](gatekeeper/README.md) for detailed instructions.

## Policy Summary

### 1. require-signed-images
**Purpose**: Ensure supply chain security

**Enforcement**:
- Images must be from approved registries (*.azurecr.io, ghcr.io, docker.io)
- No `latest`, `dev`, or `test` tags
- Optional signature verification with Cosign

**Exemptions**: System namespaces (kube-system, kube-public)

### 2. block-privileged-containers
**Purpose**: Prevent privilege escalation

**Enforcement**:
- No `privileged: true`
- No `allowPrivilegeEscalation: true`
- Must drop ALL capabilities
- Can only add NET_BIND_SERVICE
- No host namespace access

**Exemptions**: System namespaces, pods with annotation

### 3. enforce-kata-runtime-on-tee
**Purpose**: Ensure hardware isolation for confidential workloads

**Enforcement**:
- Pods with label `confidential: true` must use `runtimeClassName: kata-cc`
- Must schedule on nodes with `confidential: true` label
- Must have attestation annotations
- Cannot use hostPath volumes
- Cannot have debug mode enabled

**Exemptions**: None

### 4. enforce-gpu-node-usage
**Purpose**: Proper GPU resource management

**Enforcement**:
- Pods requesting `nvidia.com/gpu` must have node selector `node-type: gpu`
- Must have toleration for `nvidia.com/gpu=present:NoSchedule`
- GPU limits must equal GPU requests

**Exemptions**: None

### 5. restrict-hostpath
**Purpose**: Prevent host filesystem access

**Enforcement**:
- No hostPath volumes in production namespaces
- Only specific paths allowed in system namespaces (/var/lib/kubelet, /var/log, etc.)
- Must use read-only root filesystem

**Exemptions**: System namespaces with allowed paths

### 6. enforce-min-tls-version
**Purpose**: Prevent use of deprecated TLS versions

**Enforcement**:
- Ingress with TLS must specify minimum TLS 1.2
- Annotation: `nginx.ingress.kubernetes.io/ssl-protocols: "TLSv1.2 TLSv1.3"`

**Exemptions**: Ingress without TLS

### 7. validate-non-root-user
**Purpose**: Prevent containers running as root

**Enforcement**:
- Must set `runAsNonRoot: true`
- If `runAsUser` specified, must be > 0
- Recommended UID >= 1000

**Exemptions**: System namespaces, pods with annotation

## Testing

### Test Individual Policies

```bash
# Kyverno
kubectl apply -f kyverno/tests/test-require-signed-images.yaml --dry-run=server

# Gatekeeper
kubectl apply -f gatekeeper/tests/test-signed-images.yaml --dry-run=server
```

### View Violations

```bash
# Kyverno
kubectl get policyreport -A
kubectl describe policyreport -n <namespace>

# Gatekeeper
kubectl get constraints
kubectl describe k8simagesignatureverification require-signed-images
```

## Enforcement Modes

### Audit Mode (Report Only)
Policies report violations but don't block resources.

**Kyverno**:
```yaml
spec:
  validationFailureAction: Audit
```

**Gatekeeper**:
```yaml
spec:
  enforcementAction: dryrun
```

### Enforce Mode (Block)
Policies block non-compliant resources.

**Kyverno**:
```yaml
spec:
  validationFailureAction: Enforce
```

**Gatekeeper**:
```yaml
spec:
  enforcementAction: deny
```

## Exemptions

### Namespace Exemptions

**Kyverno**:
```yaml
spec:
  match:
    any:
    - resources:
        namespaces:
        - "!kube-system"
```

**Gatekeeper**:
```yaml
spec:
  match:
    excludedNamespaces:
    - kube-system
```

### Annotation-based Exemptions

**Kyverno**:
```yaml
metadata:
  annotations:
    policies.kyverno.io/exclude: "true"
```

**Gatekeeper**:
```yaml
spec:
  match:
    namespaceSelector:
      matchExpressions:
      - key: policy-exempt
        operator: Exists
```

## Deployment Strategy

### Phase 1: Audit (Week 1-2)
1. Install policy engine
2. Deploy all policies in audit mode
3. Review violation reports
4. Document exemptions needed

### Phase 2: Gradual Enforcement (Week 3-4)
1. Fix violations in existing workloads
2. Enable enforcement for non-critical policies
3. Monitor admission webhook performance
4. Update exemptions as needed

### Phase 3: Full Enforcement (Week 5+)
1. Enable enforcement for all policies
2. Integrate into CI/CD pipelines
3. Set up alerts for violations
4. Regular policy review and updates

## Monitoring

### Prometheus Metrics

**Kyverno**:
- `kyverno_policy_rule_results_total`
- `kyverno_admission_requests_total`
- `kyverno_policy_execution_duration_seconds`

**Gatekeeper**:
- `gatekeeper_constraints`
- `gatekeeper_violations`
- `gatekeeper_constraint_template_ingestion_duration_seconds`

### Alerts

Set up alerts for:
- High violation rates
- Policy execution failures
- Admission webhook timeouts
- Configuration errors

## Troubleshooting

### Policy Not Working

```bash
# Kyverno
kubectl get clusterpolicy
kubectl describe clusterpolicy <policy-name>
kubectl logs -n kyverno -l app.kubernetes.io/name=kyverno

# Gatekeeper
kubectl get constrainttemplates
kubectl describe constrainttemplate <template-name>
kubectl logs -n gatekeeper-system -l control-plane=controller-manager
```

### Resource Blocked Unexpectedly

```bash
# Check events
kubectl get events --sort-by='.lastTimestamp'

# View detailed error
kubectl apply -f resource.yaml --dry-run=server -v=8
```

### Performance Issues

```bash
# Check resource usage
kubectl top pods -n kyverno
kubectl top pods -n gatekeeper-system

# Review policy execution time in metrics
```

## Best Practices

1. **Start with Audit Mode**: Always deploy new policies in audit mode first
2. **Review Violations**: Analyze reports before enforcing
3. **Gradual Rollout**: Enable enforcement per namespace or workload type
4. **Document Exemptions**: All exemptions should have justification
5. **Regular Updates**: Review and update policies quarterly
6. **CI/CD Integration**: Test policies in pre-production
7. **Monitor Performance**: Watch for policy evaluation latency
8. **Version Control**: Store all policies in Git

## Comparison: Kyverno vs Gatekeeper

| Feature | Kyverno | Gatekeeper |
|---------|---------|------------|
| **Language** | YAML | Rego |
| **Learning Curve** | Low | Medium |
| **Mutation** | Built-in | External |
| **Validation** | Pattern matching | Logic-based |
| **Performance** | Fast | Moderate |
| **Flexibility** | Medium | High |
| **Ecosystem** | Growing | Mature (OPA) |
| **Debugging** | kubectl describe | Rego playground |

## Contributing

When adding new policies:

1. Implement in both Kyverno and Gatekeeper
2. Add test cases with PASS and FAIL scenarios
3. Update README with policy description
4. Test in audit mode before enforcement
5. Document exemptions and rationale

## Support

For issues or questions:
- Kyverno: https://kyverno.io/docs/
- Gatekeeper: https://open-policy-agent.github.io/gatekeeper/
- Policy discussions: Create an issue in the repository

## License

Copyright © 2024
