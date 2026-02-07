#!/usr/bin/env python3
"""
Key Loading Utilities for TEE Workloads
Handles secure key retrieval from Azure Key Vault with attestation support.
"""

import os
import sys
import json
import base64
import logging
from typing import Optional, Dict, Any
from azure.identity import DefaultAzureCredential, ManagedIdentityCredential
from azure.keyvault.keys import KeyClient
from azure.keyvault.secrets import SecretClient
from azure.keyvault.keys.crypto import CryptographyClient, EncryptionAlgorithm
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class KeyLoader:
    """Handles secure key loading from Azure Key Vault."""
    
    def __init__(
        self,
        keyvault_url: Optional[str] = None,
        use_managed_identity: bool = True,
        attestation_token: Optional[str] = None
    ):
        """
        Initialize key loader.
        
        Args:
            keyvault_url: Azure Key Vault URL
            use_managed_identity: Use managed identity credential
            attestation_token: TEE attestation token
        """
        self.keyvault_url = keyvault_url or os.getenv("KEYVAULT_URL")
        if not self.keyvault_url:
            raise ValueError("Key Vault URL not provided")
        
        self.attestation_token = attestation_token
        
        # Initialize credential
        if use_managed_identity:
            self.credential = ManagedIdentityCredential()
        else:
            self.credential = DefaultAzureCredential()
        
        # Initialize Key Vault clients
        self.key_client = KeyClient(
            vault_url=self.keyvault_url,
            credential=self.credential
        )
        
        self.secret_client = SecretClient(
            vault_url=self.keyvault_url,
            credential=self.credential
        )
        
        # Cache for loaded keys
        self._key_cache: Dict[str, Any] = {}
        
        logger.info(f"KeyLoader initialized with vault: {self.keyvault_url}")
    
    def get_key(self, key_name: str, use_cache: bool = True) -> Any:
        """
        Retrieve a key from Key Vault.
        
        Args:
            key_name: Name of the key
            use_cache: Use cached key if available
            
        Returns:
            Key object
        """
        try:
            if use_cache and key_name in self._key_cache:
                logger.debug(f"Returning cached key: {key_name}")
                return self._key_cache[key_name]
            
            logger.info(f"Retrieving key: {key_name}")
            key = self.key_client.get_key(key_name)
            
            if use_cache:
                self._key_cache[key_name] = key
            
            return key
            
        except Exception as e:
            logger.error(f"Failed to retrieve key {key_name}: {e}")
            raise
    
    def get_secret(self, secret_name: str, use_cache: bool = True) -> str:
        """
        Retrieve a secret from Key Vault.
        
        Args:
            secret_name: Name of the secret
            use_cache: Use cached secret if available
            
        Returns:
            Secret value
        """
        try:
            cache_key = f"secret:{secret_name}"
            
            if use_cache and cache_key in self._key_cache:
                logger.debug(f"Returning cached secret: {secret_name}")
                return self._key_cache[cache_key]
            
            logger.info(f"Retrieving secret: {secret_name}")
            secret = self.secret_client.get_secret(secret_name)
            
            if use_cache:
                self._key_cache[cache_key] = secret.value
            
            return secret.value
            
        except Exception as e:
            logger.error(f"Failed to retrieve secret {secret_name}: {e}")
            raise
    
    def get_crypto_client(self, key_name: str) -> CryptographyClient:
        """
        Get cryptography client for a key.
        
        Args:
            key_name: Name of the key
            
        Returns:
            CryptographyClient instance
        """
        try:
            key = self.get_key(key_name)
            return CryptographyClient(key, credential=self.credential)
        except Exception as e:
            logger.error(f"Failed to create crypto client for {key_name}: {e}")
            raise
    
    def decrypt_data(
        self,
        key_name: str,
        encrypted_data: bytes,
        algorithm: EncryptionAlgorithm = EncryptionAlgorithm.rsa_oaep_256
    ) -> bytes:
        """
        Decrypt data using Key Vault key.
        
        Args:
            key_name: Name of the encryption key
            encrypted_data: Data to decrypt
            algorithm: Encryption algorithm
            
        Returns:
            Decrypted data
        """
        try:
            crypto_client = self.get_crypto_client(key_name)
            result = crypto_client.decrypt(algorithm, encrypted_data)
            logger.info(f"Successfully decrypted data with key: {key_name}")
            return result.plaintext
            
        except Exception as e:
            logger.error(f"Failed to decrypt data: {e}")
            raise
    
    def decrypt_model(
        self,
        encrypted_path: str,
        output_path: str,
        metadata: Dict[str, Any]
    ) -> bool:
        """
        Decrypt a model file.
        
        Args:
            encrypted_path: Path to encrypted model
            output_path: Path to save decrypted model
            metadata: Encryption metadata
            
        Returns:
            True if successful
        """
        try:
            # Decrypt data encryption key
            key_name = metadata.get("key_name", "tee-model-decryption-key")
            encrypted_dek = base64.b64decode(metadata["encrypted_dek"])
            dek = self.decrypt_data(key_name, encrypted_dek)
            
            # Read encrypted model
            with open(encrypted_path, 'rb') as f:
                encrypted_data = f.read()
            
            # Decrypt model data
            iv = base64.b64decode(metadata["iv"])
            cipher = Cipher(
                algorithms.AES(dek),
                modes.CBC(iv),
                backend=default_backend()
            )
            decryptor = cipher.decryptor()
            
            decrypted_data = decryptor.update(encrypted_data) + decryptor.finalize()
            
            # Remove padding
            padding_length = decrypted_data[-1]
            decrypted_data = decrypted_data[:-padding_length]
            
            # Write decrypted model
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            with open(output_path, 'wb') as f:
                f.write(decrypted_data)
            
            logger.info(f"Successfully decrypted model to: {output_path}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to decrypt model: {e}")
            raise
    
    def load_environment_secrets(self, secret_names: list) -> Dict[str, str]:
        """
        Load multiple secrets and return as dictionary.
        
        Args:
            secret_names: List of secret names
            
        Returns:
            Dictionary mapping secret names to values
        """
        secrets = {}
        for secret_name in secret_names:
            try:
                secrets[secret_name] = self.get_secret(secret_name)
            except Exception as e:
                logger.warning(f"Failed to load secret {secret_name}: {e}")
        
        return secrets
    
    def validate_attestation_token(self) -> bool:
        """
        Validate TEE attestation token.
        
        Returns:
            True if token is valid
        """
        if not self.attestation_token:
            logger.warning("No attestation token provided")
            return False
        
        try:
            # In production, validate the attestation token
            # For now, just check if it exists
            return len(self.attestation_token) > 0
            
        except Exception as e:
            logger.error(f"Failed to validate attestation token: {e}")
            return False
    
    def clear_cache(self):
        """Clear the key cache."""
        self._key_cache.clear()
        logger.info("Key cache cleared")


def main():
    """Main entry point for testing."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Key Loader Utility")
    parser.add_argument("--keyvault-url", required=True, help="Key Vault URL")
    parser.add_argument("--key-name", help="Key name to retrieve")
    parser.add_argument("--secret-name", help="Secret name to retrieve")
    parser.add_argument("--list-keys", action="store_true", help="List all keys")
    
    args = parser.parse_args()
    
    try:
        loader = KeyLoader(keyvault_url=args.keyvault_url)
        
        if args.key_name:
            key = loader.get_key(args.key_name)
            print(f"Key retrieved: {key.name}")
            print(f"Key type: {key.key_type}")
        
        if args.secret_name:
            secret = loader.get_secret(args.secret_name)
            print(f"Secret retrieved: {args.secret_name}")
            print(f"Secret length: {len(secret)}")
        
        if args.list_keys:
            print("Listing keys...")
            for key in loader.key_client.list_properties_of_keys():
                print(f"  - {key.name}")
        
        sys.exit(0)
        
    except Exception as e:
        logger.error(f"Operation failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
