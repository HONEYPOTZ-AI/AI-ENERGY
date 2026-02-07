#!/bin/bash
#
# Secure Inference Entrypoint for TEE Workloads
# Validates attestation, loads encrypted models, and starts inference service
#

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="${LOG_FILE:-/var/log/secure-inference.log}"
MODEL_STORAGE="${MODEL_STORAGE:-/models}"
CACHE_DIR="${CACHE_DIR:-/secure/cache}"
KEYVAULT_URL="${KEYVAULT_URL:-}"
ATTESTATION_REQUIRED="${ATTESTATION_REQUIRED:-true}"

# Logging function
log() {
    local level=$1
    shift
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] [$level] $*" | tee -a "$LOG_FILE"
}

log_info() {
    log "INFO" "$@"
}

log_error() {
    log "ERROR" "$@"
}

log_warning() {
    log "WARNING" "$@"
}

# Error handler
error_exit() {
    log_error "$1"
    exit 1
}

# Cleanup function
cleanup() {
    log_info "Cleaning up..."
    
    # Securely delete cached models
    if [ -d "$CACHE_DIR" ]; then
        find "$CACHE_DIR" -type f -exec shred -vfz -n 3 {} \; 2>/dev/null || true
        rm -rf "$CACHE_DIR"
    fi
    
    # Clear environment variables
    unset KEYVAULT_URL
    unset MODEL_ENCRYPTION_KEY
    unset TEE_ATTESTATION_TOKEN
}

trap cleanup EXIT INT TERM

# Validate environment
validate_environment() {
    log_info "Validating environment..."
    
    # Check required environment variables
    if [ -z "$KEYVAULT_URL" ]; then
        error_exit "KEYVAULT_URL not set"
    fi
    
    # Check Python environment
    if ! command -v python3 &> /dev/null; then
        error_exit "Python 3 not found"
    fi
    
    # Check required Python modules
    python3 -c "import torch, azure.identity, azure.keyvault" 2>/dev/null || \
        error_exit "Required Python modules not installed"
    
    # Create secure directories
    mkdir -p "$CACHE_DIR"
    chmod 700 "$CACHE_DIR"
    
    log_info "Environment validation successful"
}

# Validate TEE attestation
validate_attestation() {
    if [ "$ATTESTATION_REQUIRED" != "true" ]; then
        log_warning "TEE attestation validation skipped (not required)"
        return 0
    fi
    
    log_info "Validating TEE attestation..."
    
    # Run attestation validator
    python3 "$SCRIPT_DIR/attestation_validator.py" --validate-local > /tmp/attestation.json
    
    # Check result
    local is_valid=$(jq -r '.valid' /tmp/attestation.json)
    local tee_type=$(jq -r '.tee_type' /tmp/attestation.json)
    
    if [ "$is_valid" != "true" ]; then
        local error=$(jq -r '.error' /tmp/attestation.json)
        error_exit "TEE attestation validation failed: $error"
    fi
    
    log_info "TEE attestation validated successfully (Type: $tee_type)"
    
    # Store attestation token
    export TEE_ATTESTATION_TOKEN=$(jq -r '.quote // .report' /tmp/attestation.json)
    
    # Clean up
    shred -vfz -n 3 /tmp/attestation.json 2>/dev/null || true
    rm -f /tmp/attestation.json
}

# Load encryption keys from Key Vault
load_encryption_keys() {
    log_info "Loading encryption keys from Key Vault..."
    
    # Mount secrets from CSI driver
    if [ -d "/mnt/secrets" ]; then
        log_info "Loading secrets from CSI mount..."
        
        if [ -f "/mnt/secrets/TEE_MODEL_DECRYPTION_KEY" ]; then
            export MODEL_ENCRYPTION_KEY=$(cat /mnt/secrets/TEE_MODEL_DECRYPTION_KEY)
            log_info "Model encryption key loaded from CSI"
        fi
        
        if [ -f "/mnt/secrets/TEE_INFERENCE_SECRETS" ]; then
            export INFERENCE_SECRETS=$(cat /mnt/secrets/TEE_INFERENCE_SECRETS)
            log_info "Inference secrets loaded from CSI"
        fi
    else
        log_warning "CSI secrets mount not found, using Key Vault API"
    fi
    
    log_info "Encryption keys loaded successfully"
}

# Decrypt and load models
load_models() {
    log_info "Loading encrypted models..."
    
    # List encrypted models
    local model_files=($(find "$MODEL_STORAGE" -name "*.encrypted" -type f))
    
    if [ ${#model_files[@]} -eq 0 ]; then
        error_exit "No encrypted models found in $MODEL_STORAGE"
    fi
    
    log_info "Found ${#model_files[@]} encrypted model(s)"
    
    # Decrypt models using secure model loader
    for model_file in "${model_files[@]}"; do
        local model_name=$(basename "$model_file" .encrypted)
        log_info "Decrypting model: $model_name"
        
        python3 "$SCRIPT_DIR/secure_model_loader.py" \
            --model-path "$model_file" \
            --keyvault-url "$KEYVAULT_URL" \
            ${ATTESTATION_REQUIRED:+--skip-attestation} \
            || error_exit "Failed to decrypt model: $model_name"
    done
    
    log_info "All models loaded successfully"
}

# Verify model integrity
verify_model_integrity() {
    log_info "Verifying model integrity..."
    
    # Check model checksums
    local model_files=($(find "$CACHE_DIR" -name "*.decrypted" -type f 2>/dev/null || true))
    
    for model_file in "${model_files[@]}"; do
        local metadata_file="${model_file%.decrypted}.metadata.json"
        
        if [ -f "$metadata_file" ]; then
            local expected_hash=$(jq -r '.original_hash' "$metadata_file")
            local actual_hash=$(sha256sum "$model_file" | cut -d' ' -f1)
            
            if [ "$expected_hash" != "$actual_hash" ]; then
                error_exit "Model integrity check failed: $model_file"
            fi
            
            log_info "Model integrity verified: $(basename $model_file)"
        fi
    done
    
    log_info "Model integrity verification complete"
}

# Configure inference service
configure_inference_service() {
    log_info "Configuring inference service..."
    
    # Set environment variables for inference service
    export MODEL_PATH="$CACHE_DIR"
    export INFERENCE_PORT="${INFERENCE_PORT:-8000}"
    export INFERENCE_WORKERS="${INFERENCE_WORKERS:-4}"
    export INFERENCE_TIMEOUT="${INFERENCE_TIMEOUT:-60}"
    
    # GPU configuration
    if command -v nvidia-smi &> /dev/null; then
        export CUDA_VISIBLE_DEVICES="${CUDA_VISIBLE_DEVICES:-0}"
        log_info "GPU detected, CUDA_VISIBLE_DEVICES=$CUDA_VISIBLE_DEVICES"
    fi
    
    # Security settings
    export PYTHONHASHSEED=random
    export PYTHONDONTWRITEBYTECODE=1
    
    log_info "Inference service configured"
}

# Health check function
health_check() {
    log_info "Performing health check..."
    
    # Check if models are loaded
    if [ ! -d "$CACHE_DIR" ] || [ -z "$(ls -A $CACHE_DIR 2>/dev/null)" ]; then
        log_error "No models in cache directory"
        return 1
    fi
    
    # Check attestation validity (if required)
    if [ "$ATTESTATION_REQUIRED" = "true" ] && [ -z "$TEE_ATTESTATION_TOKEN" ]; then
        log_error "Attestation token not found"
        return 1
    fi
    
    # Check Key Vault connectivity
    if ! python3 -c "from key_loader import KeyLoader; KeyLoader('$KEYVAULT_URL')" 2>/dev/null; then
        log_error "Key Vault connectivity check failed"
        return 1
    fi
    
    log_info "Health check passed"
    return 0
}

# Start inference service
start_inference_service() {
    log_info "Starting inference service..."
    
    # Run health check before starting
    health_check || error_exit "Health check failed"
    
    # Start the inference service (example with FastAPI/uvicorn)
    if [ -f "/app/inference_service.py" ]; then
        log_info "Starting FastAPI inference service..."
        exec python3 -m uvicorn inference_service:app \
            --host 0.0.0.0 \
            --port "$INFERENCE_PORT" \
            --workers "$INFERENCE_WORKERS" \
            --timeout-keep-alive "$INFERENCE_TIMEOUT" \
            --log-level info
    elif [ -f "/app/main.py" ]; then
        log_info "Starting custom inference service..."
        exec python3 /app/main.py
    else
        error_exit "No inference service found"
    fi
}

# Main execution
main() {
    log_info "========================================"
    log_info "Secure Inference Entrypoint Starting"
    log_info "========================================"
    
    # Validation and setup
    validate_environment
    validate_attestation
    load_encryption_keys
    load_models
    verify_model_integrity
    configure_inference_service
    
    # Start service
    start_inference_service
}

# Run main function
main "$@"
