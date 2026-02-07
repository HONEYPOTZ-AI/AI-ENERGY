# Security & Compliance Guide

## Overview

This guide defines the security architecture, policy enforcement mechanisms, compliance controls, and audit procedures for the infrastructure. It covers data protection, network security, identity management, and regulatory compliance.

## Security Architecture

```mermaid
graph TB
    subgraph "External Layer"
        Users["End Users"]
        API["API Gateway"]
    end
    
    subgraph "Network Security"
        NSG["Network Security<br/>Groups"]
        WAF["Web Application<br/>Firewall"]
        DDoS["DDoS Protection"]
    end
    
    subgraph "Identity & Access"
        AAD["Azure AD<br/>Authentication"]
        RBAC["Kubernetes RBAC<br/>Authorization"]
        ManagedID["Managed Identities<br/>Service Auth"]
    end
    
    subgraph "Data Protection"
        KeyVault["Azure Key Vault<br/>Encryption Keys"]
        TLS["TLS 1.3+<br/>Encryption"]
        Secrets["CSI Secrets<br/>Provider"]
    end
    
    subgraph "Workload Security"
        Kyverno["Kyverno Policies<br/>Image Signing"]
        PodSec["Pod Security<br/>Standards"]
        Gatekeeper["OPA Gatekeeper<br/>Policy Enforcement"]
    end
    
    subgraph "Runtime Security"
        TEE["Trusted Execution<br/>Environment"]
        Audit["Audit Logging<br/>Trail"]
        Monitoring["Security<br/>Monitoring"]
    end
    
    Users --> API
    API --> WAF
    WAF --> NSG
    NSG --> AAD
    NSG --> DDoS
    AAD --> RBAC
    RBAC --> ManagedID
    ManagedID --> KeyVault
    KeyVault --> TLS
    TLS --> Secrets
    Secrets --> Kyverno
    Kyverno --> PodSec
    PodSec --> Gatekeeper
    Gatekeeper --> TEE
    TEE --> Audit
    Audit --> Monitoring
```

## Security Layers

### 1. Network Security

#### Network Policies

```yaml
# Allow traffic only from ingress to core services
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: core-services-ingress
  namespace: core-services
spec:
  podSelector:
    matchLabels:
      app: core-services
  policyTypes:
    - Ingress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
      ports:
        - protocol: TCP
          port: 8080
---
# Deny all egress by default
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-egress
  namespace: core-services
spec:
  podSelector: {}
  policyTypes:
    - Egress
  egress:
    - to:
        - podSelector: {}
      ports:
        - protocol: TCP
          port: 5432  # PostgreSQL
---
# Allow DNS
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns
  namespace: core-services
spec:
  podSelector: {}
  policyTypes:
    - Egress
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              name: kube-system
      ports:
        - protocol: UDP
          port: 53
```

#### TLS Configuration

```yaml
# Enforce TLS 1.3 minimum
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-tls-config
  namespace: ingress-nginx
data:
  ssl-protocols: "TLSv1.3"
  ssl-ciphers: "TLS13-AES-256-GCM-SHA384:TLS13-CHACHA20-POLY1305-SHA256"
  ssl-prefer-server-ciphers: "on"
```

### 2. Identity & Access Management

#### Kubernetes RBAC

```yaml
# Create cluster role for developers
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: developer
rules:
  - apiGroups: [""]
    resources: ["pods", "pods/logs", "services"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["configmaps"]
    verbs: ["get", "list"]
---
# Bind role to Azure AD group
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: developer-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: developer
subjects:
  - kind: Group
    name: "dev-team@example.com"
    apiGroup: rbac.authorization.k8s.io
---
# ServiceAccount for workload identity
apiVersion: v1
kind: ServiceAccount
metadata:
  name: app-identity
  namespace: core-services
  annotations:
    azure.workload.identity/client-id: "<CLIENT_ID>"
---
# Binding for pod identity
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: app-secrets-reader
  namespace: core-services
rules:
  - apiGroups: [""]
    resources: ["secrets"]
    verbs: ["get"]
    resourceNames: ["app-secrets"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: app-secrets-reader-binding
  namespace: core-services
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: app-secrets-reader
subjects:
  - kind: ServiceAccount
    name: app-identity
    namespace: core-services
```

#### Azure AD Integration

```bash
# Get Azure AD tenant ID
TENANT_ID=$(az account show --query tenantId -o tsv)

# Create Azure AD application
APP_ID=$(az ad app create \
  --display-name "aks-auth" \
  --query appId -o tsv)

# Create service principal
SP_ID=$(az ad sp create --id "$APP_ID" \
  --query id -o tsv)

# Configure AKS authentication
az aks update \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --enable-aad \
  --aad-admin-group-object-ids <ADMIN_GROUP_ID> \
  --aad-tenant-id "$TENANT_ID"

# Create kubeconfig using Azure AD
az aks get-credentials \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --overwrite-existing
```

### 3. Data Protection

#### Encryption at Rest

```yaml
# Azure Key Vault Secret Provider
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: app-secrets
  namespace: core-services
spec:
  provider: azure
  parameters:
    usePodIdentity: "true"
    useVMManagedIdentity: "false"
    keyvaultName: "myKeyVault"
    objects: |
      array:
        - |
          objectName: DatabasePassword
          objectType: secret
          objectVersion: ""
        - |
          objectName: APIKey
          objectType: secret
    tenantId: "<TENANT_ID>"
```

#### Encryption in Transit

```yaml
# Certificate with TLS termination
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: app-tls
  namespace: core-services
spec:
  secretName: app-tls-cert
  duration: 2160h
  renewBefore: 720h
  commonName: api.example.com
  dnsNames:
    - api.example.com
    - "*.api.example.com"
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
---
# HTTPS Ingress
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: secure-ingress
  namespace: core-services
spec:
  tls:
    - hosts:
        - api.example.com
      secretName: app-tls-cert
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: core-services
                port:
                  number: 8080
```

### 4. Container & Image Security

#### Image Signature Verification

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: verify-images
spec:
  validationFailureAction: enforce
  rules:
    - name: check-image-signature
      match:
        resources:
          kinds:
            - Pod
      verifyImages:
        - imageReferences:
            - "myacr.azurecr.io/*"
          attestations:
            - name: sbom
              attestationFormat: "cyclonedx"
              conditions:
                - all:
                    - key: "{{ scan_result }}"
                      operator: Equals
                      value: "pass"
          keySecret:
            name: kyverno-signing-key
            namespace: kyverno
```

#### Pod Security Standards

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  hostNetwork: false
  hostIPC: false
  hostPID: false
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'MustRunAs'
    seLinuxOptions:
      level: "s0:c123,c456"
  supplementalGroups:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'RunAsAny'
  readOnlyRootFilesystem: false
```

### 5. Policy Enforcement

#### Kyverno Policies

```yaml
# Require resource limits
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-resources
spec:
  validationFailureAction: enforce
  rules:
    - name: validate-resources
      match:
        resources:
          kinds:
            - Pod
      validate:
        message: "CPU and memory limits are required"
        pattern:
          spec:
            containers:
              - resources:
                  limits:
                    memory: "?*"
                    cpu: "?*"
                  requests:
                    memory: "?*"
                    cpu: "?*"
---
# Block privileged containers
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: deny-privileged
spec:
  validationFailureAction: enforce
  rules:
    - name: deny-privileged-containers
      match:
        resources:
          kinds:
            - Pod
      validate:
        message: "Privileged containers are not allowed"
        pattern:
          spec:
            containers:
              - securityContext:
                  privileged: false
                  allowPrivilegeEscalation: false
---
# Require non-root user
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-non-root
spec:
  validationFailureAction: enforce
  rules:
    - name: check-runAsNonRoot
      match:
        resources:
          kinds:
            - Pod
      validate:
        message: "Running as root is not allowed"
        pattern:
          spec:
            containers:
              - securityContext:
                  runAsNonRoot: true
```

#### Gatekeeper Constraints

```yaml
# Image Registry Constraint
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sAllowedRepos
metadata:
  name: allowed-registries
spec:
  match:
    excludedNamespaces:
      - "kube-system"
      - "kube-node-lease"
      - "kube-public"
  parameters:
    repos:
      - "myacr.azurecr.io/"
      - "gcr.io/"
---
# Block capabilities constraint
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sBlockCapabilities
metadata:
  name: block-capabilities
spec:
  parameters:
    blockedCapabilities:
      - NET_ADMIN
      - SYS_ADMIN
      - SYS_MODULE
```

## Compliance Controls

### HIPAA Compliance

```yaml
# Audit logging
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
  # Log all requests at metadata level
  - level: Metadata
    verbs: ["create", "update", "patch", "delete"]
    resources: ["pods", "services", "persistentvolumeclaims"]
  # Log sensitive access
  - level: RequestResponse
    verbs: ["get", "list"]
    resources: ["secrets"]
    namespaces: ["core-services"]
  # Log all other requests
  - level: Metadata
    omitStages:
      - RequestReceived
---
# Data retention policy
apiVersion: v1
kind: ConfigMap
metadata:
  name: audit-retention
  namespace: kube-system
data:
  retention-days: "90"
  log-directory: "/var/log/kubernetes/audit"
  max-backup: "10"
  max-age: "30"
```

### GDPR Compliance

```bash
# Data privacy controls
kubectl create secret generic gdpr-config \
  --from-literal=data-retention-days=90 \
  --from-literal=consent-required=true \
  --from-literal=right-to-be-forgotten=enabled

# Encryption of personal data
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: encryption-key
  namespace: core-services
type: Opaque
stringData:
  tls.crt: |
    -----BEGIN CERTIFICATE-----
    MIIDXTCCAkWgAwIBAgI...
    -----END CERTIFICATE-----
  tls.key: |
    -----BEGIN PRIVATE KEY-----
    MIIEvQIBADANBgkqhki...
    -----END PRIVATE KEY-----
EOF
```

### SOC 2 Compliance

```yaml
# Activity logging
apiVersion: v1
kind: ConfigMap
metadata:
  name: soc2-logging
  namespace: monitoring
data:
  log-level: "debug"
  log-retention: "365"
  log-format: "json"
  security-events:
    - authentication_failure
    - authorization_failure
    - resource_modification
    - policy_violation
---
# Access controls
apiVersion: v1
kind: ConfigMap
metadata:
  name: soc2-access-controls
  namespace: kube-system
data:
  mfa-required: "true"
  session-timeout: "3600"
  password-policy: "minimum-12-chars-with-symbols"
  audit-retention: "730"  # 2 years
```

## Audit Procedures

### Audit Logging Configuration

```bash
# Enable audit logging
# Add to API server configuration:
# --audit-log-path=/var/log/kubernetes/audit.log
# --audit-max-age=30
# --audit-max-backup=10
# --audit-log-maxsize=100
# --audit-policy-file=/etc/kubernetes/audit-policy.yaml

# Check audit logs
kubectl logs -n kube-system -l component=kube-apiserver | grep audit

# Query audit events
cat /var/log/kubernetes/audit.log | jq 'select(.verb=="delete")'

# Real-time monitoring
tail -f /var/log/kubernetes/audit.log | jq '.user.username'
```

### Compliance Scanning

```bash
# Scan for policy violations
kubectl get constraints -o json | \
  jq '.items[] | {name, violations: .status.totalViolations}'

# Audit images for vulnerabilities
az acr scan \
  --registry myacr \
  --image myimage:tag

# Check pod security compliance
kubebench run --targets policies

# Network policy audit
kubectl get networkpolicies --all-namespaces -o yaml
```

### Access Review

```bash
# Audit RBAC bindings
kubectl get rolebindings,clusterrolebindings --all-namespaces -o json | \
  jq '.items[] | {kind, name: .metadata.name, subjects: .subjects}'

# Check service accounts
kubectl get serviceaccounts --all-namespaces

# Audit access logs
kubectl logs -n kube-system -l component=kube-apiserver | \
  jq 'select(.user.username | contains("external"))'

# List privileged pods
kubectl get pods --all-namespaces -o json | \
  jq '.items[] | select(.spec.containers[].securityContext.privileged==true)'
```

## Incident Response

### Security Incident Procedures

```yaml
# Alert for security incidents
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: security-alerts
  namespace: monitoring
spec:
  groups:
    - name: security.rules
      interval: 30s
      rules:
        - alert: UnauthorizedAccessAttempt
          expr: increase(apiserver_audit_event_total{verb="create",user_agent=~".*curl.*"}[5m]) > 0
          for: 1m
          annotations:
            summary: "Unauthorized access attempt detected"

        - alert: PolicyViolationDetected
          expr: increase(kyverno_policy_results_total{result="fail"}[5m]) > 0
          for: 1m
          annotations:
            summary: "Policy violation detected"

        - alert: PrivilegedContainerDetected
          expr: increase(pod_security_violations_total{type="privileged"}[5m]) > 0
          for: 1m
          annotations:
            summary: "Privileged container detected"
```

### Incident Response Workflow

```bash
#!/bin/bash
# incident-response.sh

INCIDENT_ID=$(date +%Y%m%d%H%M%S)
LOG_DIR="/var/log/incidents/$INCIDENT_ID"
mkdir -p "$LOG_DIR"

# Collect evidence
echo "Collecting incident evidence..."

# API server logs
kubectl logs -n kube-system -l component=kube-apiserver \
  --all-containers=true > "$LOG_DIR/apiserver.log"

# Audit logs
sudo cp /var/log/kubernetes/audit.log "$LOG_DIR/"

# Pod events
kubectl get events --all-namespaces -o yaml > "$LOG_DIR/events.yaml"

# Network policies
kubectl get networkpolicies --all-namespaces -o yaml \
  > "$LOG_DIR/networkpolicies.yaml"

# RBAC configuration
kubectl get rolebindings,clusterrolebindings --all-namespaces -o yaml \
  > "$LOG_DIR/rbac.yaml"

# Isolate affected resources
echo "Isolating affected resources..."
kubectl label pod "$AFFECTED_POD" incident="$INCIDENT_ID" -n "$NAMESPACE"

# Create network policy to isolate pod
cat > "$LOG_DIR/isolation-policy.yaml" <<EOF
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: isolate-incident-$INCIDENT_ID
  namespace: $NAMESPACE
spec:
  podSelector:
    matchLabels:
      incident: $INCIDENT_ID
  policyTypes:
    - Ingress
    - Egress
  ingress: []
  egress: []
EOF

kubectl apply -f "$LOG_DIR/isolation-policy.yaml"

# Notify security team
echo "Incident $INCIDENT_ID: Potential security breach detected" | \
  mail -s "SECURITY ALERT" security@example.com

# Document incident
cat > "$LOG_DIR/incident-report.md" <<EOF
# Security Incident Report: $INCIDENT_ID

## Timeline
- Detection: $(date)
- Isolation: $(date)
- Investigation: In progress

## Affected Resources
- Pod: $AFFECTED_POD
- Namespace: $NAMESPACE
- Image: $(kubectl get pod $AFFECTED_POD -n $NAMESPACE -o jsonpath='{.spec.containers[0].image}')

## Initial Assessment
[To be filled by security team]
EOF

echo "Incident $INCIDENT_ID logged to $LOG_DIR"
```

## Best Practices

### Security Best Practices

1. **Principle of Least Privilege**: Grant minimal required permissions
2. **Defense in Depth**: Implement multiple security layers
3. **Regular Updates**: Keep components and policies current
4. **Encryption Everywhere**: Use TLS for all communications
5. **Secret Management**: Never commit secrets to version control
6. **Regular Audits**: Perform security audits quarterly
7. **Training**: Educate team on security practices

### Compliance Best Practices

1. **Documentation**: Maintain compliance documentation
2. **Regular Testing**: Test controls regularly
3. **Evidence Collection**: Keep audit trails and logs
4. **Policy Review**: Review policies annually
5. **Change Management**: Track all infrastructure changes
6. **Incident Response**: Have documented procedures
7. **Third-party Audits**: Schedule regular external audits

### Monitoring Best Practices

1. **Continuous Monitoring**: Monitor 24/7 for anomalies
2. **Alert Thresholds**: Set appropriate alert levels
3. **Response Time**: Define SLAs for incident response
4. **Log Retention**: Retain logs per compliance requirements
5. **Centralized Logging**: Aggregate logs from all sources
6. **Performance Monitoring**: Watch for unusual patterns
7. **Regular Review**: Review logs and alerts regularly

## References

- [Kubernetes Security Documentation](https://kubernetes.io/docs/concepts/security/)
- [Kyverno Best Practices](https://kyverno.io/docs/writing-policies/best-practices/)
- [OPA Gatekeeper](https://open-policy-agent.github.io/gatekeeper/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CIS Kubernetes Benchmarks](https://www.cisecurity.org/benchmark/kubernetes)
- [HIPAA Compliance Guide](https://www.hhs.gov/hipaa/)
- [GDPR Compliance Resources](https://gdpr.eu/)
