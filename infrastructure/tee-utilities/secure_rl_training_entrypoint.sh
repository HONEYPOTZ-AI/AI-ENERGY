#!/bin/bash
#
# Secure RL Training Entrypoint for TEE Workloads
# Validates attestation, loads encrypted models/data, and starts RL training
#

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="${LOG_FILE:-/var/log/secure-rl-training.log}"
MODEL_STORAGE="${MODEL_STORAGE:-/models}"
DATA_STORAGE="${DATA_STORAGE:-/data}"
CHECKPOINT_DIR="${CHECKPOINT_DIR:-/checkpoints}"
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
    log_info "Cleaning up training environment..."
    
    # Encrypt and backup checkpoints
    if [ -d "$CHECKPOINT_DIR" ] && [ -n "$(ls -A $CHECKPOINT_DIR 2>/dev/null)" ]; then
        log_info "Encrypting checkpoints..."
        for checkpoint in "$CHECKPOINT_DIR"/*.pt; do
            if [ -f "$checkpoint" ]; then
                python3 "$SCRIPT_DIR/../keyvault/encrypt-model.py" \
                    --keyvault-url "$KEYVAULT_URL" \
                    --model "$checkpoint" \
                    --output "$checkpoint.encrypted" \
                    2>/dev/null || log_warning "Failed to encrypt $checkpoint"
            fi
        done
    fi
    
    # Securely delete cached data
    if [ -d "$CACHE_DIR" ]; then
        find "$CACHE_DIR" -type f -exec shred -vfz -n 3 {} \; 2>/dev/null || true
        rm -rf "$CACHE_DIR"
    fi
    
    # Clear sensitive environment variables
    unset KEYVAULT_URL
    unset MODEL_ENCRYPTION_KEY
    unset TEE_ATTESTATION_TOKEN
    unset DATABASE_CONNECTION_STRING
    
    log_info "Cleanup complete"
}

trap cleanup EXIT INT TERM

# Validate environment
validate_environment() {
    log_info "Validating training environment..."
    
    # Check required environment variables
    if [ -z "$KEYVAULT_URL" ]; then
        error_exit "KEYVAULT_URL not set"
    fi
    
    # Check Python environment
    if ! command -v python3 &> /dev/null; then
        error_exit "Python 3 not found"
    fi
    
    # Check required Python modules for RL training
    python3 -c "import torch, numpy, gym" 2>/dev/null || \
        error_exit "Required RL training modules not installed"
    
    # Create secure directories
    for dir in "$CACHE_DIR" "$CHECKPOINT_DIR"; do
        mkdir -p "$dir"
        chmod 700 "$dir"
    done
    
    # Check GPU availability
    if command -v nvidia-smi &> /dev/null; then
        log_info "GPU detected: $(nvidia-smi --query-gpu=name --format=csv,noheader | head -n1)"
        nvidia-smi --query-gpu=memory.total --format=csv,noheader
    else
        log_warning "No GPU detected, training will use CPU"
    fi
    
    log_info "Environment validation successful"
}

# Validate TEE attestation
validate_attestation() {
    if [ "$ATTESTATION_REQUIRED" != "true" ]; then
        log_warning "TEE attestation validation skipped (not required)"
        return 0
    fi
    
    log_info "Validating TEE attestation for training workload..."
    
    # Run attestation validator
    python3 "$SCRIPT_DIR/attestation_validator.py" --validate-local > /tmp/attestation.json
    
    # Check result
    local is_valid=$(jq -r '.valid' /tmp/attestation.json)
    local tee_type=$(jq -r '.tee_type' /tmp/attestation.json)
    local tcb_level=$(jq -r '.tcb_level' /tmp/attestation.json)
    
    if [ "$is_valid" != "true" ]; then
        local error=$(jq -r '.error' /tmp/attestation.json)
        error_exit "TEE attestation validation failed: $error"
    fi
    
    log_info "TEE attestation validated (Type: $tee_type, TCB: $tcb_level)"
    
    # Store attestation token
    export TEE_ATTESTATION_TOKEN=$(jq -r '.quote // .report' /tmp/attestation.json)
    
    # Clean up
    shred -vfz -n 3 /tmp/attestation.json 2>/dev/null || true
    rm -f /tmp/attestation.json
}

# Load training secrets
load_training_secrets() {
    log_info "Loading training secrets from Key Vault..."
    
    # Mount secrets from CSI driver
    if [ -d "/mnt/secrets" ]; then
        log_info "Loading secrets from CSI mount..."
        
        if [ -f "/mnt/secrets/TEE_TRAINING_SECRETS" ]; then
            export TRAINING_SECRETS=$(cat /mnt/secrets/TEE_TRAINING_SECRETS)
            log_info "Training secrets loaded"
        fi
        
        if [ -f "/mnt/secrets/DATABASE_CONNECTION_STRING" ]; then
            export DATABASE_CONNECTION_STRING=$(cat /mnt/secrets/DATABASE_CONNECTION_STRING)
            log_info "Database connection string loaded"
        fi
        
        if [ -f "/mnt/secrets/TEE_MODEL_DECRYPTION_KEY" ]; then
            export MODEL_ENCRYPTION_KEY=$(cat /mnt/secrets/TEE_MODEL_DECRYPTION_KEY)
            log_info "Model encryption key loaded"
        fi
    else
        log_warning "CSI secrets mount not found"
    fi
}

# Load base models
load_base_models() {
    log_info "Loading base models for training..."
    
    # Check for encrypted models
    local model_files=($(find "$MODEL_STORAGE" -name "*.encrypted" -type f 2>/dev/null || true))
    
    if [ ${#model_files[@]} -eq 0 ]; then
        log_warning "No encrypted base models found, starting from scratch"
        return 0
    fi
    
    log_info "Found ${#model_files[@]} encrypted model(s)"
    
    # Decrypt models
    for model_file in "${model_files[@]}"; do
        local model_name=$(basename "$model_file" .encrypted)
        log_info "Decrypting model: $model_name"
        
        python3 "$SCRIPT_DIR/secure_model_loader.py" \
            --model-path "$model_file" \
            --keyvault-url "$KEYVAULT_URL" \
            ${ATTESTATION_REQUIRED:+--skip-attestation} \
            || log_warning "Failed to decrypt model: $model_name"
    done
    
    log_info "Base models loaded"
}

# Load and decrypt training data
load_training_data() {
    log_info "Loading training data..."
    
    if [ ! -d "$DATA_STORAGE" ]; then
        log_warning "Training data directory not found: $DATA_STORAGE"
        return 0
    fi
    
    # Check for encrypted data
    local data_files=($(find "$DATA_STORAGE" -name "*.encrypted" -type f 2>/dev/null || true))
    
    if [ ${#data_files[@]} -eq 0 ]; then
        log_info "No encrypted data files found"
        return 0
    fi
    
    log_info "Found ${#data_files[@]} encrypted data file(s)"
    
    # Decrypt data files
    for data_file in "${data_files[@]}"; do
        local data_name=$(basename "$data_file" .encrypted)
        log_info "Decrypting data: $data_name"
        
        python3 "$SCRIPT_DIR/../keyvault/decrypt-model.py" \
            --keyvault-url "$KEYVAULT_URL" \
            --encrypted-model "$data_file" \
            --output "$CACHE_DIR/$data_name" \
            ${ATTESTATION_REQUIRED:+--use-tee} \
            || log_warning "Failed to decrypt data: $data_name"
    done
    
    log_info "Training data loaded"
}

# Configure training environment
configure_training() {
    log_info "Configuring RL training environment..."
    
    # Training configuration
    export TRAINING_MODE="${TRAINING_MODE:-distributed}"
    export NUM_WORKERS="${NUM_WORKERS:-4}"
    export BATCH_SIZE="${BATCH_SIZE:-32}"
    export LEARNING_RATE="${LEARNING_RATE:-0.001}"
    export MAX_EPISODES="${MAX_EPISODES:-1000}"
    export CHECKPOINT_INTERVAL="${CHECKPOINT_INTERVAL:-100}"
    
    # Paths
    export BASE_MODEL_PATH="$CACHE_DIR"
    export TRAINING_DATA_PATH="$CACHE_DIR"
    export CHECKPOINT_PATH="$CHECKPOINT_DIR"
    
    # GPU configuration
    if command -v nvidia-smi &> /dev/null; then
        export CUDA_VISIBLE_DEVICES="${CUDA_VISIBLE_DEVICES:-0}"
        export PYTORCH_CUDA_ALLOC_CONF="max_split_size_mb:512"
        log_info "GPU configuration: CUDA_VISIBLE_DEVICES=$CUDA_VISIBLE_DEVICES"
    fi
    
    # Security settings
    export PYTHONHASHSEED=random
    export PYTHONDONTWRITEBYTECODE=1
    export OMP_NUM_THREADS="${NUM_WORKERS}"
    
    # Logging
    export WANDB_MODE="${WANDB_MODE:-disabled}"  # Disable external logging in TEE
    
    log_info "Training configuration complete"
}

# Verify data integrity
verify_data_integrity() {
    log_info "Verifying training data integrity..."
    
    local cache_files=($(find "$CACHE_DIR" -type f 2>/dev/null || true))
    local verified=0
    
    for cache_file in "${cache_files[@]}"; do
        local metadata_file="${cache_file}.metadata.json"
        
        if [ -f "$metadata_file" ]; then
            local expected_hash=$(jq -r '.original_hash' "$metadata_file" 2>/dev/null || echo "")
            
            if [ -n "$expected_hash" ]; then
                local actual_hash=$(sha256sum "$cache_file" | cut -d' ' -f1)
                
                if [ "$expected_hash" != "$actual_hash" ]; then
                    error_exit "Data integrity check failed: $(basename $cache_file)"
                fi
                
                ((verified++))
            fi
        fi
    done
    
    log_info "Data integrity verified ($verified files)"
}

# Health check
health_check() {
    log_info "Performing pre-training health check..."
    
    # Check attestation validity
    if [ "$ATTESTATION_REQUIRED" = "true" ] && [ -z "$TEE_ATTESTATION_TOKEN" ]; then
        log_error "Attestation token not found"
        return 1
    fi
    
    # Check Key Vault connectivity
    if ! python3 -c "from key_loader import KeyLoader; KeyLoader('$KEYVAULT_URL')" 2>/dev/null; then
        log_error "Key Vault connectivity check failed"
        return 1
    fi
    
    # Check GPU status (if available)
    if command -v nvidia-smi &> /dev/null; then
        if ! nvidia-smi &>/dev/null; then
            log_error "GPU health check failed"
            return 1
        fi
    fi
    
    # Check disk space
    local available_space=$(df -BG "$CHECKPOINT_DIR" | tail -1 | awk '{print $4}' | sed 's/G//')
    if [ "$available_space" -lt 10 ]; then
        log_error "Insufficient disk space: ${available_space}GB available"
        return 1
    fi
    
    log_info "Health check passed"
    return 0
}

# Start training
start_training() {
    log_info "Starting RL training..."
    
    # Run health check
    health_check || error_exit "Pre-training health check failed"
    
    # Start training based on mode
    if [ "$TRAINING_MODE" = "distributed" ]; then
        log_info "Starting distributed RL training..."
        
        if [ -f "/app/distributed_training.py" ]; then
            exec python3 -m torch.distributed.launch \
                --nproc_per_node="$NUM_WORKERS" \
                /app/distributed_training.py \
                --checkpoint-dir "$CHECKPOINT_DIR" \
                --data-dir "$CACHE_DIR"
        else
            error_exit "Distributed training script not found"
        fi
    else
        log_info "Starting single-node RL training..."
        
        if [ -f "/app/training.py" ]; then
            exec python3 /app/training.py \
                --checkpoint-dir "$CHECKPOINT_DIR" \
                --data-dir "$CACHE_DIR" \
                --max-episodes "$MAX_EPISODES"
        else
            error_exit "Training script not found"
        fi
    fi
}

# Main execution
main() {
    log_info "========================================"
    log_info "Secure RL Training Entrypoint Starting"
    log_info "========================================"
    
    # Validation and setup
    validate_environment
    validate_attestation
    load_training_secrets
    load_base_models
    load_training_data
    verify_data_integrity
    configure_training
    
    # Start training
    start_training
}

# Run main function
main "$@"
