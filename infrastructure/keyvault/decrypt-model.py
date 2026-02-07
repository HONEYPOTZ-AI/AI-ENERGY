#!/usr/bin/env python3
"""
Model Decryption Workflow
Decrypts encrypted model files using Azure Key Vault keys.
Supports both standard and TEE-attested workloads.
"""

import os
import sys
import json
import base64
import hashlib
from pathlib import Path
from typing import Optional, Dict, Any
from azure.identity import DefaultAzureCredential, ManagedIdentityCredential
from azure.keyvault.keys import KeyClient
from azure.keyvault.keys.crypto import CryptographyClient, EncryptionAlgorithm
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class ModelDecryptor:
    """Handles secure model decryption using Azure Key Vault."""
    
    def __init__(
        self,
        keyvault_url: str,
        key_name: str = "model-encryption-key",
        use_tee: bool = False,
        attestation_token: Optional[str] = None
    ):
        """
        Initialize the model decryptor.
        
        Args:
            keyvault_url: Azure Key Vault URL
            key_name: Name of the encryption key in Key Vault
            use_tee: Whether to use TEE-attested access
            attestation_token: TEE attestation token (required if use_tee=True)
        """
        self.keyvault_url = keyvault_url
        self.key_name = key_name
        self.use_tee = use_tee
        self.attestation_token = attestation_token
        
        # Initialize Azure credentials
        if use_tee and attestation_token:
            # Use attestation token for TEE workloads
            self.credential = self._create_tee_credential()
        else:
            # Use default credential (workload identity)
            self.credential = DefaultAzureCredential()
        
        # Initialize Key Vault clients
        self.key_client = KeyClient(vault_url=keyvault_url, credential=self.credential)
        self.crypto_client = None
        
    def _create_tee_credential(self):
        """Create credential with TEE attestation token."""
        # In production, this would use the attestation token
        # For now, use managed identity
        logger.info("Using TEE-attested credential")
        return ManagedIdentityCredential()
    
    def _get_crypto_client(self) -> CryptographyClient:
        """Get or create cryptography client for key operations."""
        if self.crypto_client is None:
            key = self.key_client.get_key(self.key_name)
            self.crypto_client = CryptographyClient(key, credential=self.credential)
        return self.crypto_client
    
    def decrypt_data_key(self, encrypted_dek: bytes) -> bytes:
        """
        Decrypt data encryption key using Key Vault key.
        
        Args:
            encrypted_dek: Encrypted data encryption key
            
        Returns:
            Decrypted data encryption key
        """
        try:
            crypto_client = self._get_crypto_client()
            result = crypto_client.decrypt(
                EncryptionAlgorithm.rsa_oaep_256,
                encrypted_dek
            )
            logger.info("Successfully decrypted data encryption key")
            return result.plaintext
        except Exception as e:
            logger.error(f"Failed to decrypt data encryption key: {e}")
            raise
    
    def decrypt_model_file(
        self,
        encrypted_model_path: str,
        output_path: str,
        metadata_path: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Decrypt an encrypted model file.
        
        Args:
            encrypted_model_path: Path to encrypted model file
            output_path: Path to save decrypted model
            metadata_path: Optional path to encryption metadata file
            
        Returns:
            Dictionary with decryption metadata
        """
        try:
            # Read encryption metadata
            if metadata_path is None:
                metadata_path = f"{encrypted_model_path}.metadata.json"
            
            with open(metadata_path, 'r') as f:
                metadata = json.load(f)
            
            logger.info(f"Decrypting model: {encrypted_model_path}")
            logger.info(f"Encryption algorithm: {metadata['algorithm']}")
            
            # Decrypt the data encryption key
            encrypted_dek = base64.b64decode(metadata['encrypted_dek'])
            dek = self.decrypt_data_key(encrypted_dek)
            
            # Read encrypted model data
            with open(encrypted_model_path, 'rb') as f:
                encrypted_data = f.read()
            
            # Decrypt model data using DEK
            iv = base64.b64decode(metadata['iv'])
            cipher = Cipher(
                algorithms.AES(dek),
                modes.CBC(iv),
                backend=default_backend()
            )
            decryptor = cipher.decryptor()
            
            decrypted_data = decryptor.update(encrypted_data) + decryptor.finalize()
            
            # Remove PKCS7 padding
            padding_length = decrypted_data[-1]
            decrypted_data = decrypted_data[:-padding_length]
            
            # Verify checksum
            calculated_hash = hashlib.sha256(decrypted_data).hexdigest()
            if calculated_hash != metadata['original_hash']:
                raise ValueError("Model checksum verification failed")
            
            # Write decrypted model
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            with open(output_path, 'wb') as f:
                f.write(decrypted_data)
            
            logger.info(f"Successfully decrypted model to: {output_path}")
            
            return {
                "status": "success",
                "original_size": metadata['original_size'],
                "encrypted_size": len(encrypted_data),
                "algorithm": metadata['algorithm'],
                "checksum_verified": True,
                "output_path": output_path
            }
            
        except Exception as e:
            logger.error(f"Failed to decrypt model: {e}")
            raise
    
    def batch_decrypt_models(
        self,
        encrypted_dir: str,
        output_dir: str,
        pattern: str = "*.encrypted"
    ) -> Dict[str, Any]:
        """
        Decrypt multiple model files in a directory.
        
        Args:
            encrypted_dir: Directory containing encrypted models
            output_dir: Directory to save decrypted models
            pattern: File pattern to match
            
        Returns:
            Dictionary with batch decryption results
        """
        encrypted_files = list(Path(encrypted_dir).glob(pattern))
        results = {
            "total": len(encrypted_files),
            "successful": 0,
            "failed": 0,
            "details": []
        }
        
        for encrypted_file in encrypted_files:
            try:
                output_name = encrypted_file.stem  # Remove .encrypted extension
                output_path = os.path.join(output_dir, output_name)
                
                result = self.decrypt_model_file(
                    str(encrypted_file),
                    output_path
                )
                
                results["successful"] += 1
                results["details"].append({
                    "file": str(encrypted_file),
                    "status": "success",
                    "output": output_path
                })
                
            except Exception as e:
                results["failed"] += 1
                results["details"].append({
                    "file": str(encrypted_file),
                    "status": "failed",
                    "error": str(e)
                })
                logger.error(f"Failed to decrypt {encrypted_file}: {e}")
        
        return results


def main():
    """Main entry point for model decryption."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Decrypt model files using Azure Key Vault")
    parser.add_argument("--keyvault-url", required=True, help="Azure Key Vault URL")
    parser.add_argument("--key-name", default="model-encryption-key", help="Key Vault key name")
    parser.add_argument("--encrypted-model", required=True, help="Path to encrypted model file")
    parser.add_argument("--output", required=True, help="Path to save decrypted model")
    parser.add_argument("--metadata", help="Path to encryption metadata file")
    parser.add_argument("--use-tee", action="store_true", help="Use TEE-attested access")
    parser.add_argument("--attestation-token", help="TEE attestation token")
    parser.add_argument("--batch", action="store_true", help="Batch decrypt directory")
    
    args = parser.parse_args()
    
    try:
        decryptor = ModelDecryptor(
            keyvault_url=args.keyvault_url,
            key_name=args.key_name,
            use_tee=args.use_tee,
            attestation_token=args.attestation_token
        )
        
        if args.batch:
            results = decryptor.batch_decrypt_models(
                encrypted_dir=args.encrypted_model,
                output_dir=args.output
            )
            print(json.dumps(results, indent=2))
        else:
            result = decryptor.decrypt_model_file(
                encrypted_model_path=args.encrypted_model,
                output_path=args.output,
                metadata_path=args.metadata
            )
            print(json.dumps(result, indent=2))
        
        sys.exit(0)
        
    except Exception as e:
        logger.error(f"Decryption failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
