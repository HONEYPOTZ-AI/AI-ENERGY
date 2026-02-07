# Helm Charts

This directory contains Helm charts for deploying the platform infrastructure.

## Charts

### 1. core-services
Core application services with auto-scaling, security contexts, and health probes.

**Installation:**
```bash
# Development
helm install core-services ./core-services -f ./core-services/values-dev.yaml

# Staging
helm install core-services ./core-services -f ./core-services/values-staging.yaml

# Production
helm install core-services ./core-services -f ./core-services/values-prod.yaml
```

### 2. inference
AI/ML inference service with GPU support and specialized node selection.

**Installation:**
```bash
# Production with GPU
helm install inference ./inference -f ./inference/values-prod.yaml
```

**Key Features:**
- NVIDIA GPU support
- GPU node affinity
- Model serving optimizations
- Auto-scaling based on CPU

### 3. rl-training
Reinforcement learning training workloads with multi-GPU support.

**Installation:**
```bash
# Production with 8 GPUs
helm install rl-training ./rl-training -f ./rl-training/values-prod.yaml
```

**Key Features:**
- Multi-GPU support (up to 8 GPUs)
- Persistent storage for training data
- Distributed training support
- GPU node affinity

### 4. postgres
PostgreSQL database with StatefulSet for persistent data.

**Installation:**
```bash
# Production
helm install postgres ./postgres -f ./postgres/values-prod.yaml
```

**Key Features:**
- StatefulSet with persistent volumes
- Configurable resource limits
- Health checks
- Pod anti-affinity

### 5. ingress
Ingress controller configuration with TLS, rate limiting, and CORS.

**Installation:**
```bash
# Production
helm install ingress ./ingress -f ./ingress/values-prod.yaml
```

**Key Features:**
- TLS/SSL support
- Rate limiting
- CORS configuration
- Multiple host/path routing

### 6. tee-runtime (Kata-CC)
Trusted Execution Environment runtime with Kata Containers Confidential Computing.

**Installation:**
```bash
# Production
helm install tee-runtime ./tee-runtime -f ./tee-runtime/values-prod.yaml
```

**Key Features:**
- AMD SEV support
- Confidential Computing
- DaemonSet for node-level runtime
- RuntimeClass for pod scheduling

## Common Commands

### Install all charts
```bash
#!/bin/bash
ENV=${1:-prod}

helm install core-services ./core-services -f ./core-services/values-${ENV}.yaml
helm install inference ./inference -f ./inference/values-${ENV}.yaml
helm install rl-training ./rl-training -f ./rl-training/values-${ENV}.yaml
helm install postgres ./postgres -f ./postgres/values-${ENV}.yaml
helm install ingress ./ingress -f ./ingress/values-${ENV}.yaml
helm install tee-runtime ./tee-runtime -f ./tee-runtime/values-${ENV}.yaml
```

### Upgrade charts
```bash
helm upgrade core-services ./core-services -f ./core-services/values-prod.yaml
helm upgrade inference ./inference -f ./inference/values-prod.yaml
# ... etc
```

### Uninstall charts
```bash
helm uninstall core-services
helm uninstall inference
helm uninstall rl-training
helm uninstall postgres
helm uninstall ingress
helm uninstall tee-runtime
```

### Dry run (test without installing)
```bash
helm install --dry-run --debug core-services ./core-services -f ./core-services/values-prod.yaml
```

### Template rendering
```bash
helm template core-services ./core-services -f ./core-services/values-prod.yaml
```

## Prerequisites

1. Kubernetes cluster (1.24+)
2. Helm 3.x installed
3. kubectl configured
4. For GPU workloads: NVIDIA GPU Operator installed
5. For Confidential Computing: AMD SEV or Intel SGX capable nodes

## Security Best Practices

All charts implement:
- **runAsNonRoot**: Containers run as non-root user
- **Read-only root filesystem**: Where applicable
- **Dropped capabilities**: All unnecessary Linux capabilities dropped
- **Security contexts**: Pod and container level security contexts
- **Resource limits**: CPU and memory limits defined
- **Network policies**: (Can be added as needed)

## Monitoring

All services expose metrics on `/metrics` endpoint (Prometheus compatible).

Add Prometheus annotations:
```yaml
podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "8080"
  prometheus.io/path: "/metrics"
```

## Customization

### Override values
Create your own values file:
```bash
helm install core-services ./core-services -f ./core-services/values-prod.yaml -f my-custom-values.yaml
```

### Set individual values
```bash
helm install core-services ./core-services --set replicaCount=5 --set image.tag=v2.0.0
```

## Troubleshooting

### Check chart status
```bash
helm status core-services
```

### View rendered templates
```bash
helm get manifest core-services
```

### Rollback
```bash
helm rollback core-services 1
```

### Debug
```bash
kubectl logs -l app.kubernetes.io/name=core-services
kubectl describe pod -l app.kubernetes.io/name=core-services
```

## Chart Development

### Lint charts
```bash
helm lint ./core-services
```

### Package charts
```bash
helm package ./core-services
```

### Update dependencies
```bash
helm dependency update ./core-services
```

## License

Copyright © 2024
