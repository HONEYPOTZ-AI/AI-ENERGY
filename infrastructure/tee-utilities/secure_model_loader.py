#!/usr/bin/env python3
"""
Secure Model Loader for TEE Environments
Loads and decrypts AI models within a trusted execution environment.
Validates attestation and ensures secure model handling.
"""

import os
import sys
import json
import logging
from pathlib import Path
from typing import Optional, Dict, Any, Union
import torch
import numpy as np
from key_loader import KeyLoader
from attestation_validator import AttestationValidator

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class SecureModelLoader:
    """Securely loads and manages AI models in TEE environment."""
    
    def __init__(
        self,
        keyvault_url: Optional[str] = None,
        validate_attestation: bool = True,
        cache_dir: str = "/secure/models"
    ):
        """
        Initialize secure model loader.
        
        Args:
            keyvault_url: Azure Key Vault URL (default: from environment)
            validate_attestation: Whether to validate TEE attestation
            cache_dir: Directory for decrypted model cache
        """
        self.keyvault_url = keyvault_url or os.getenv("KEYVAULT_URL")
        self.validate_attestation = validate_attestation
        self.cache_dir = cache_dir
        
        # Initialize components
        self.key_loader = KeyLoader(keyvault_url=self.keyvault_url)
        self.attestation_validator = None
        
        if validate_attestation:
            self.attestation_validator = AttestationValidator()
            self._validate_environment()
        
        # Create secure cache directory
        os.makedirs(cache_dir, exist_ok=True)
        os.chmod(cache_dir, 0o700)  # Owner read/write/execute only
        
        # Loaded models cache
        self._loaded_models: Dict[str, Any] = {}
        
        logger.info("SecureModelLoader initialized")
    
    def _validate_environment(self):
        """Validate that we're running in a secure TEE environment."""
        try:
            if self.attestation_validator:
                validation_result = self.attestation_validator.validate_local_attestation()
                
                if not validation_result["valid"]:
                    raise RuntimeError(
                        f"TEE attestation validation failed: {validation_result['error']}"
                    )
                
                logger.info("TEE environment validated successfully")
                logger.info(f"TEE Type: {validation_result['tee_type']}")
                logger.info(f"TCB Level: {validation_result['tcb_level']}")
                
        except Exception as e:
            logger.error(f"Failed to validate TEE environment: {e}")
            if self.validate_attestation:
                raise
    
    def load_encrypted_model(
        self,
        model_path: str,
        model_type: str = "pytorch",
        key_name: Optional[str] = None
    ) -> Any:
        """
        Load and decrypt an encrypted model file.
        
        Args:
            model_path: Path to encrypted model file
            model_type: Type of model ('pytorch', 'tensorflow', 'onnx')
            key_name: Key Vault key name (default: from metadata)
            
        Returns:
            Loaded model object
        """
        try:
            logger.info(f"Loading encrypted model: {model_path}")
            
            # Check if already loaded
            cache_key = f"{model_path}:{model_type}"
            if cache_key in self._loaded_models:
                logger.info("Returning cached model")
                return self._loaded_models[cache_key]
            
            # Read encryption metadata
            metadata_path = f"{model_path}.metadata.json"
            with open(metadata_path, 'r') as f:
                metadata = json.load(f)
            
            # Get decryption key
            if key_name is None:
                key_name = metadata.get("key_name", "tee-model-decryption-key")
            
            # Decrypt model
            decrypted_path = os.path.join(
                self.cache_dir,
                f"{os.path.basename(model_path)}.decrypted"
            )
            
            self.key_loader.decrypt_model(
                encrypted_path=model_path,
                output_path=decrypted_path,
                metadata=metadata
            )
            
            # Load model based on type
            if model_type == "pytorch":
                model = self._load_pytorch_model(decrypted_path)
            elif model_type == "tensorflow":
                model = self._load_tensorflow_model(decrypted_path)
            elif model_type == "onnx":
                model = self._load_onnx_model(decrypted_path)
            else:
                raise ValueError(f"Unsupported model type: {model_type}")
            
            # Cache loaded model
            self._loaded_models[cache_key] = model
            
            # Securely delete decrypted file
            self._secure_delete(decrypted_path)
            
            logger.info(f"Successfully loaded model: {model_path}")
            return model
            
        except Exception as e:
            logger.error(f"Failed to load encrypted model: {e}")
            raise
    
    def _load_pytorch_model(self, model_path: str) -> torch.nn.Module:
        """Load PyTorch model."""
        try:
            model = torch.load(model_path, map_location='cpu')
            logger.info("PyTorch model loaded successfully")
            return model
        except Exception as e:
            logger.error(f"Failed to load PyTorch model: {e}")
            raise
    
    def _load_tensorflow_model(self, model_path: str):
        """Load TensorFlow model."""
        try:
            import tensorflow as tf
            model = tf.keras.models.load_model(model_path)
            logger.info("TensorFlow model loaded successfully")
            return model
        except Exception as e:
            logger.error(f"Failed to load TensorFlow model: {e}")
            raise
    
    def _load_onnx_model(self, model_path: str):
        """Load ONNX model."""
        try:
            import onnxruntime as ort
            session = ort.InferenceSession(model_path)
            logger.info("ONNX model loaded successfully")
            return session
        except Exception as e:
            logger.error(f"Failed to load ONNX model: {e}")
            raise
    
    def load_model_from_storage(
        self,
        model_id: str,
        storage_path: str = "/models",
        model_type: str = "pytorch"
    ) -> Any:
        """
        Load model from encrypted storage.
        
        Args:
            model_id: Unique model identifier
            storage_path: Path to model storage
            model_type: Type of model
            
        Returns:
            Loaded model object
        """
        model_path = os.path.join(storage_path, f"{model_id}.encrypted")
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found: {model_path}")
        
        return self.load_encrypted_model(
            model_path=model_path,
            model_type=model_type
        )
    
    def preload_models(self, model_configs: list):
        """
        Preload multiple models for faster inference.
        
        Args:
            model_configs: List of model configuration dicts
        """
        for config in model_configs:
            try:
                model_id = config["model_id"]
                model_path = config["model_path"]
                model_type = config.get("model_type", "pytorch")
                
                logger.info(f"Preloading model: {model_id}")
                self.load_encrypted_model(model_path, model_type)
                
            except Exception as e:
                logger.error(f"Failed to preload model {config.get('model_id')}: {e}")
    
    def _secure_delete(self, file_path: str):
        """Securely delete a file by overwriting with random data."""
        try:
            if os.path.exists(file_path):
                # Overwrite with random data
                file_size = os.path.getsize(file_path)
                with open(file_path, 'wb') as f:
                    f.write(os.urandom(file_size))
                
                # Delete file
                os.remove(file_path)
                logger.debug(f"Securely deleted: {file_path}")
                
        except Exception as e:
            logger.warning(f"Failed to securely delete {file_path}: {e}")
    
    def unload_model(self, model_path: str, model_type: str = "pytorch"):
        """
        Unload a model from cache.
        
        Args:
            model_path: Path to model file
            model_type: Type of model
        """
        cache_key = f"{model_path}:{model_type}"
        if cache_key in self._loaded_models:
            del self._loaded_models[cache_key]
            logger.info(f"Unloaded model: {model_path}")
    
    def get_model_info(self, model_path: str) -> Dict[str, Any]:
        """
        Get information about an encrypted model without loading it.
        
        Args:
            model_path: Path to encrypted model file
            
        Returns:
            Dictionary with model metadata
        """
        try:
            metadata_path = f"{model_path}.metadata.json"
            with open(metadata_path, 'r') as f:
                metadata = json.load(f)
            
            return {
                "model_name": metadata.get("model_name"),
                "original_size": metadata.get("original_size"),
                "encrypted_size": metadata.get("encrypted_size"),
                "algorithm": metadata.get("algorithm"),
                "key_name": metadata.get("key_name")
            }
            
        except Exception as e:
            logger.error(f"Failed to get model info: {e}")
            raise
    
    def cleanup(self):
        """Cleanup loaded models and temporary files."""
        logger.info("Cleaning up SecureModelLoader")
        
        # Clear model cache
        self._loaded_models.clear()
        
        # Delete temporary files
        for file in Path(self.cache_dir).glob("*"):
            if file.is_file():
                self._secure_delete(str(file))


def main():
    """Main entry point for testing."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Secure Model Loader for TEE")
    parser.add_argument("--model-path", required=True, help="Path to encrypted model")
    parser.add_argument("--model-type", default="pytorch", help="Model type")
    parser.add_argument("--keyvault-url", help="Azure Key Vault URL")
    parser.add_argument("--skip-attestation", action="store_true", help="Skip attestation validation")
    
    args = parser.parse_args()
    
    try:
        loader = SecureModelLoader(
            keyvault_url=args.keyvault_url,
            validate_attestation=not args.skip_attestation
        )
        
        model = loader.load_encrypted_model(
            model_path=args.model_path,
            model_type=args.model_type
        )
        
        print(f"Model loaded successfully: {type(model)}")
        
        loader.cleanup()
        sys.exit(0)
        
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
