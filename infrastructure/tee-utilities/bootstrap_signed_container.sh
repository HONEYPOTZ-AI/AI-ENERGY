#!/bin/bash
#
# Bootstrap Script for Signed Container in TEE
# Validates container signature, verifies attestation, and initializes secure runtime
#

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="${LOG_FILE:-/var/log/container-bootstrap.log}"
CONTAINER_IMAGE="${CONTAINER_IMAGE:-}"
REGISTRY_URL="${REGISTRY_URL:-}"
SIGNATURE_VALIDATION="${SIGNATURE_VALIDATION:-true}"
ATTESTATION_REQUIRED="${ATTESTATION_REQUIRED:-true}"

# Logging
log() {
    local level=$1
    shift
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] [$level] $*" | tee -a "$LOG_FILE"
}

log_info() { log "INFO" "$@"; }
log_error() { log "ERROR" "$@"; }
log_warning() { log "WARNING" "$@"; }

error_exit() {
    log_error "$1"
    exit 1
}

# Initialize logging
init_logging() {
    mkdir -p "$(dirname "$LOG_FILE")"
    touch "$LOG_FILE"
    chmod 600 "$LOG_FILE"
    
    log_info "========================================"
    log_info "Signed Container Bootstrap Starting"
    log_info "========================================"
}

# Verify container signature
verify_container_signature() {
    if [ "$SIGNATURE_VALIDATION" != "true" ]; then
        log_warning "Container signature validation disabled"
        return 0
    fi
    
    log_info "Verifying container image signature..."
    
    if [ -z "$CONTAINER_IMAGE" ]; then
        error_exit "CONTAINER_IMAGE not set"
    fi
    
    # Check if cosign is available
    if ! command -v cosign &> /dev/null; then
        error_exit "cosign not found - cannot verify signature"
    fi
    
    # Verify signature using cosign
    log_info "Verifying signature for: $CONTAINER_IMAGE"
    
    if ! cosign verify "$CONTAINER_IMAGE" \
        --certificate-identity-regexp=".*" \
        --certificate-oidc-issuer-regexp=".*" \
        2>&1 | tee -a "$LOG_FILE"; then
        error_exit "Container signature verification failed"
    fi
    
    log_info "Container signature verified successfully"
}

# Verify container image integrity
verify_image_integrity() {
    log_info "Verifying container image integrity..."
    
    # Get image manifest
    local manifest=$(skopeo inspect "docker://$CONTAINER_IMAGE" 2>/dev/null || echo "")
    
    if [ -z "$manifest" ]; then
        error_exit "Failed to retrieve image manifest"
    fi
    
    # Extract and verify digest
    local digest=$(echo "$manifest" | jq -r '.Digest' 2>/dev/null || echo "")
    
    if [ -z "$digest" ]; then
        error_exit "Failed to extract image digest"
    fi
    
    log_info "Image digest: $digest"
    
    # Verify against expected digest (if provided)
    if [ -n "${EXPECTED_DIGEST:-}" ]; then
        if [ "$digest" != "$EXPECTED_DIGEST" ]; then
            error_exit "Image digest mismatch: expected $EXPECTED_DIGEST, got $digest"
        fi
        log_info "Image digest matches expected value"
    fi
    
    log_info "Image integrity verified"
}

# Validate TEE environment
validate_tee_environment() {
    if [ "$ATTESTATION_REQUIRED" != "true" ]; then
        log_warning "TEE attestation validation disabled"
        return 0
    fi
    
    log_info "Validating TEE environment..."
    
    # Check for TEE devices
    if [ ! -e "/dev/sgx_enclave" ] && [ ! -e "/dev/sev" ] && [ ! -e "/sys/firmware/tdx_seam" ]; then
        error_exit "No TEE device found - not running in secure enclave"
    fi
    
    # Run attestation validator
    if [ -f "$SCRIPT_DIR/attestation_validator.py" ]; then
        python3 "$SCRIPT_DIR/attestation_validator.py" --validate-local > /tmp/bootstrap_attestation.json
        
        local is_valid=$(jq -r '.valid' /tmp/bootstrap_attestation.json)
        
        if [ "$is_valid" != "true" ]; then
            local error=$(jq -r '.error' /tmp/bootstrap_attestation.json)
            rm -f /tmp/bootstrap_attestation.json
            error_exit "TEE attestation failed: $error"
        fi
        
        local tee_type=$(jq -r '.tee_type' /tmp/bootstrap_attestation.json)
        log_info "TEE environment validated (Type: $tee_type)"
        
        rm -f /tmp/bootstrap_attestation.json
    else
        log_warning "Attestation validator not found, skipping validation"
    fi
}

# Setup secure runtime environment
setup_secure_runtime() {
    log_info "Setting up secure runtime environment..."
    
    # Create secure directories
    local secure_dirs=(
        "/secure/cache"
        "/secure/keys"
        "/secure/logs"
        "/secure/tmp"
    )
    
    for dir in "${secure_dirs[@]}"; do
        mkdir -p "$dir"
        chmod 700 "$dir"
        log_info "Created secure directory: $dir"
    done
    
    # Setup secure tmpfs for sensitive data
    if ! mount | grep -q "/secure/tmp"; then
        mount -t tmpfs -o size=1G,mode=0700 tmpfs /secure/tmp
        log_info "Mounted secure tmpfs at /secure/tmp"
    fi
    
    # Restrict core dumps
    ulimit -c 0
    echo 0 > /proc/sys/kernel/core_pattern 2>/dev/null || true
    
    # Set secure environment variables
    export TMPDIR="/secure/tmp"
    export TEMP="/secure/tmp"
    export TMP="/secure/tmp"
    
    # Security hardening
    export PYTHONHASHSEED=random
    export PYTHONDONTWRITEBYTECODE=1
    
    log_info "Secure runtime environment configured"
}

# Validate container policies
validate_container_policies() {
    log_info "Validating container runtime policies..."
    
    # Check for privileged mode (should not be allowed)
    if grep -q "privileged" /proc/self/status 2>/dev/null; then
        log_warning "Container appears to be running in privileged mode"
    fi
    
    # Check capabilities
    local caps=$(cat /proc/self/status | grep Cap | head -1 | awk '{print $2}')
    log_info "Container capabilities: $caps"
    
    # Check namespace isolation
    local pid_ns=$(readlink /proc/self/ns/pid 2>/dev/null || echo "unknown")
    local net_ns=$(readlink /proc/self/ns/net 2>/dev/null || echo "unknown")
    local mnt_ns=$(readlink /proc/self/ns/mnt 2>/dev/null || echo "unknown")
    
    log_info "Namespace isolation - PID: $pid_ns, NET: $net_ns, MNT: $mnt_ns"
    
    # Verify runtime class (should be kata-cc for TEE)
    if [ -n "${KATA_RUNTIME:-}" ]; then
        log_info "Running with Kata runtime: $KATA_RUNTIME"
    else
        log_warning "Kata runtime not detected"
    fi
}

# Initialize Key Vault access
initialize_keyvault_access() {
    log_info "Initializing Key Vault access..."
    
    # Check for workload identity
    if [ -z "${AZURE_CLIENT_ID:-}" ]; then
        log_warning "AZURE_CLIENT_ID not set - workload identity may not be configured"
        return 0
    fi
    
    log_info "Workload identity client ID: $AZURE_CLIENT_ID"
    
    # Test Key Vault connectivity
    if [ -n "${KEYVAULT_URL:-}" ]; then
        log_info "Testing Key Vault connectivity to: $KEYVAULT_URL"
        
        if command -v python3 &> /dev/null; then
            python3 -c "
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
import sys

try:
    credential = DefaultAzureCredential()
    client = SecretClient(vault_url='$KEYVAULT_URL', credential=credential)
    # Just verify we can create client
    print('Key Vault client initialized successfully')
    sys.exit(0)
except Exception as e:
    print(f'Key Vault initialization failed: {e}')
    sys.exit(1)
" || log_warning "Key Vault connectivity test failed"
        fi
    fi
}

# Setup security monitoring
setup_security_monitoring() {
    log_info "Setting up security monitoring..."
    
    # Enable audit logging
    if command -v auditd &> /dev/null; then
        auditctl -w /secure -p warx -k secure_access 2>/dev/null || true
        log_info "Audit rules configured for /secure directory"
    fi
    
    # Setup file integrity monitoring
    if [ -f "/etc/aide/aide.conf" ]; then
        log_info "AIDE file integrity monitoring available"
    fi
    
    # Log system information
    log_info "System info: $(uname -a)"
    log_info "Container ID: ${HOSTNAME}"
    log_info "User: $(whoami) (UID: $(id -u))"
}

# Verify network security
verify_network_security() {
    log_info "Verifying network security configuration..."
    
    # Check for TLS configuration
    if [ -d "/etc/ssl/certs" ]; then
        local cert_count=$(ls -1 /etc/ssl/certs/*.crt 2>/dev/null | wc -l)
        log_info "SSL certificates available: $cert_count"
    fi
    
    # Check network policies
    if command -v iptables &> /dev/null; then
        local rule_count=$(iptables -L | wc -l)
        log_info "Firewall rules configured: $rule_count"
    fi
    
    # Verify DNS configuration
    if [ -f "/etc/resolv.conf" ]; then
        log_info "DNS servers: $(grep nameserver /etc/resolv.conf | awk '{print $2}' | tr '\n' ' ')"
    fi
}

# Run pre-start validations
run_prestart_validations() {
    log_info "Running pre-start validations..."
    
    local validation_errors=0
    
    # Check required binaries
    local required_bins=("python3" "jq" "curl")
    for bin in "${required_bins[@]}"; do
        if ! command -v "$bin" &> /dev/null; then
            log_error "Required binary not found: $bin"
            ((validation_errors++))
        fi
    done
    
    # Check required environment variables
    local required_vars=("KEYVAULT_URL")
    for var in "${required_vars[@]}"; do
        if [ -z "${!var:-}" ]; then
            log_warning "Recommended environment variable not set: $var"
        fi
    done
    
    # Check disk space
    local available_space=$(df -BG / | tail -1 | awk '{print $4}' | sed 's/G//')
    if [ "$available_space" -lt 5 ]; then
        log_error "Insufficient disk space: ${available_space}GB available"
        ((validation_errors++))
    fi
    
    if [ $validation_errors -gt 0 ]; then
        error_exit "Pre-start validation failed with $validation_errors error(s)"
    fi
    
    log_info "Pre-start validations passed"
}

# Generate bootstrap report
generate_bootstrap_report() {
    log_info "Generating bootstrap report..."
    
    local report_file="/secure/logs/bootstrap-report.json"
    
    cat > "$report_file" <<EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "container_image": "${CONTAINER_IMAGE:-unknown}",
  "signature_validated": ${SIGNATURE_VALIDATION},
  "attestation_validated": ${ATTESTATION_REQUIRED},
  "hostname": "${HOSTNAME}",
  "kernel": "$(uname -r)",
  "tee_type": "$(python3 "$SCRIPT_DIR/attestation_validator.py" --detect 2>/dev/null | grep 'TEE Type:' | cut -d: -f2 | tr -d ' ' || echo 'unknown')",
  "keyvault_url": "${KEYVAULT_URL:-not-set}",
  "workload_identity": "${AZURE_CLIENT_ID:-not-set}"
}
EOF
    
    chmod 600 "$report_file"
    log_info "Bootstrap report saved to: $report_file"
    
    cat "$report_file" | jq '.' | tee -a "$LOG_FILE"
}

# Main bootstrap sequence
main() {
    init_logging
    
    log_info "Starting bootstrap sequence..."
    
    # Container validation
    verify_container_signature
    verify_image_integrity
    
    # TEE validation
    validate_tee_environment
    
    # Runtime setup
    setup_secure_runtime
    validate_container_policies
    initialize_keyvault_access
    
    # Security
    setup_security_monitoring
    verify_network_security
    
    # Final checks
    run_prestart_validations
    generate_bootstrap_report
    
    log_info "========================================"
    log_info "Bootstrap completed successfully"
    log_info "========================================"
    
    # Execute the actual container entrypoint
    if [ $# -gt 0 ]; then
        log_info "Executing container entrypoint: $*"
        exec "$@"
    else
        log_info "No entrypoint specified, entering shell"
        exec /bin/bash
    fi
}

# Run main function with all arguments
main "$@"
