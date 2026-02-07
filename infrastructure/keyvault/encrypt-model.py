#!/usr/bin/env python3
"""
KMS-Integrated Model Encryption
Encrypts model files using Azure Key Vault keys.
Implements envelope encryption pattern for large files.
"""

import os
import sys
import json
import base64
import hashlib
from pathlib import Path
from typing import Optional, Dict, Any
from azure.identity import DefaultAzureCredential
from azure.keyvault.keys import KeyClient
from azure.keyvault.keys.crypto import CryptographyClient, EncryptionAlgorithm
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
import secrets
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class ModelEncryptor:
    """Handles secure model encryption using Azure Key Vault."""
    
    def __init__(
        self,
        keyvault_url: str,
        key_name: str = "model-encryption-key"
    ):
        """
        Initialize the model encryptor.
        
        Args:
            keyvault_url: Azure Key Vault URL
            key_name: Name of the encryption key in Key Vault
        """
        self.keyvault_url = keyvault_url
        self.key_name = key_name
        
        # Initialize Azure credentials
        self.credential = DefaultAzureCredential()
        
        # Initialize Key Vault clients
        self.key_client = KeyClient(vault_url=keyvault_url, credential=self.credential)
        self.crypto_client = None
        
    def _get_crypto_client(self) -> CryptographyClient:
        """Get or create cryptography client for key operations."""
        if self.crypto_client is None:
            key = self.key_client.get_key(self.key_name)
            self.crypto_client = CryptographyClient(key, credential=self.credential)
        return self.crypto_client
    
    def generate_data_key(self, key_length: int = 32) -> bytes:
        """
        Generate a random data encryption key.
        
        Args:
            key_length: Length of the key in bytes (default: 32 for AES-256)
            
        Returns:
            Random data encryption key
        """
        return secrets.token_bytes(key_length)
    
    def encrypt_data_key(self, dek: bytes) -> bytes:
        """
        Encrypt data encryption key using Key Vault key.
        
        Args:
            dek: Data encryption key to encrypt
            
        Returns:
            Encrypted data encryption key
        """
        try:
            crypto_client = self._get_crypto_client()
            result = crypto_client.encrypt(
                EncryptionAlgorithm.rsa_oaep_256,
                dek
            )
            logger.info("Successfully encrypted data encryption key")
            return result.ciphertext
        except Exception as e:
            logger.error(f"Failed to encrypt data encryption key: {e}")
            raise
    
    def encrypt_model_file(
        self,
        model_path: str,
        output_path: str,
        metadata_path: Optional[str] = None,
        algorithm: str = "AES-256-CBC"
    ) -> Dict[str, Any]:
        """
        Encrypt a model file using envelope encryption.
        
        Args:
            model_path: Path to model file to encrypt
            output_path: Path to save encrypted model
            metadata_path: Optional path to save encryption metadata
            algorithm: Encryption algorithm (default: AES-256-CBC)
            
        Returns:
            Dictionary with encryption metadata
        """
        try:
            # Read model file
            with open(model_path, 'rb') as f:
                model_data = f.read()
            
            original_size = len(model_data)
            original_hash = hashlib.sha256(model_data).hexdigest()
            
            logger.info(f"Encrypting model: {model_path}")
            logger.info(f"Original size: {original_size} bytes")
            logger.info(f"Original hash: {original_hash}")
            
            # Generate data encryption key
            dek = self.generate_data_key()
            
            # Encrypt DEK with Key Vault key
            encrypted_dek = self.encrypt_data_key(dek)
            
            # Generate random IV
            iv = secrets.token_bytes(16)
            
            # Add PKCS7 padding
            padder = padding.PKCS7(128).padder()
            padded_data = padder.update(model_data) + padder.finalize()
            
            # Encrypt model data with DEK
            cipher = Cipher(
                algorithms.AES(dek),
                modes.CBC(iv),
                backend=default_backend()
            )
            encryptor = cipher.encryptor()
            encrypted_data = encryptor.update(padded_data) + encryptor.finalize()
            
            # Prepare metadata
            metadata = {
                "version": "1.0",
                "algorithm": algorithm,
                "key_vault_url": self.keyvault_url,
                "key_name": self.key_name,
                "encrypted_dek": base64.b64encode(encrypted_dek).decode('utf-8'),
                "iv": base64.b64encode(iv).decode('utf-8'),
                "original_size": original_size,
                "encrypted_size": len(encrypted_data),
                "original_hash": original_hash,
                "model_name": os.path.basename(model_path)
            }
            
            # Write encrypted model
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            with open(output_path, 'wb') as f:
                f.write(encrypted_data)
            
            # Write metadata
            if metadata_path is None:
                metadata_path = f"{output_path}.metadata.json"
            
            with open(metadata_path, 'w') as f:
                json.dump(metadata, f, indent=2)
            
            logger.info(f"Successfully encrypted model to: {output_path}")
            logger.info(f"Metadata saved to: {metadata_path}")
            
            return metadata
            
        except Exception as e:
            logger.error(f"Failed to encrypt model: {e}")
            raise
    
    def batch_encrypt_models(
        self,
        model_dir: str,
        output_dir: str,
        pattern: str = "*.pt"
    ) -> Dict[str, Any]:
        """
        Encrypt multiple model files in a directory.
        
        Args:
            model_dir: Directory containing models to encrypt
            output_dir: Directory to save encrypted models
            pattern: File pattern to match
            
        Returns:
            Dictionary with batch encryption results
        """
        model_files = list(Path(model_dir).glob(pattern))
        results = {
            "total": len(model_files),
            "successful": 0,
            "failed": 0,
            "details": []
        }
        
        for model_file in model_files:
            try:
                output_name = f"{model_file.name}.encrypted"
                output_path = os.path.join(output_dir, output_name)
                
                metadata = self.encrypt_model_file(
                    str(model_file),
                    output_path
                )
                
                results["successful"] += 1
                results["details"].append({
                    "file": str(model_file),
                    "status": "success",
                    "output": output_path,
                    "metadata": metadata
                })
                
            except Exception as e:
                results["failed"] += 1
                results["details"].append({
                    "file": str(model_file),
                    "status": "failed",
                    "error": str(e)
                })
                logger.error(f"Failed to encrypt {model_file}: {e}")
        
        return results


def main():
    """Main entry point for model encryption."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Encrypt model files using Azure Key Vault")
    parser.add_argument("--keyvault-url", required=True, help="Azure Key Vault URL")
    parser.add_argument("--key-name", default="model-encryption-key", help="Key Vault key name")
    parser.add_argument("--model", required=True, help="Path to model file to encrypt")
    parser.add_argument("--output", required=True, help="Path to save encrypted model")
    parser.add_argument("--metadata", help="Path to save encryption metadata")
    parser.add_argument("--algorithm", default="AES-256-CBC", help="Encryption algorithm")
    parser.add_argument("--batch", action="store_true", help="Batch encrypt directory")
    
    args = parser.parse_args()
    
    try:
        encryptor = ModelEncryptor(
            keyvault_url=args.keyvault_url,
            key_name=args.key_name
        )
        
        if args.batch:
            results = encryptor.batch_encrypt_models(
                model_dir=args.model,
                output_dir=args.output
            )
            print(json.dumps(results, indent=2))
        else:
            metadata = encryptor.encrypt_model_file(
                model_path=args.model,
                output_path=args.output,
                metadata_path=args.metadata,
                algorithm=args.algorithm
            )
            print(json.dumps(metadata, indent=2))
        
        sys.exit(0)
        
    except Exception as e:
        logger.error(f"Encryption failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
