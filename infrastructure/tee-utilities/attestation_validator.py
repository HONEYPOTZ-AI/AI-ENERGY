#!/usr/bin/env python3
"""
TEE Attestation Validation Module
Validates attestation tokens and quotes from TEE environments (SGX, SEV-SNP, TDX).
"""

import os
import sys
import json
import base64
import hashlib
import logging
from typing import Optional, Dict, Any, Tuple
from datetime import datetime, timedelta
import requests

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class AttestationValidator:
    """Validates TEE attestation tokens and quotes."""
    
    # TEE types
    TEE_TYPE_SGX = "sgx"
    TEE_TYPE_SEV_SNP = "sev-snp"
    TEE_TYPE_TDX = "tdx"
    
    def __init__(
        self,
        attestation_endpoint: Optional[str] = None,
        policy_path: Optional[str] = None
    ):
        """
        Initialize attestation validator.
        
        Args:
            attestation_endpoint: Azure Attestation Service endpoint
            policy_path: Path to attestation policy file
        """
        self.attestation_endpoint = (
            attestation_endpoint or 
            os.getenv("ATTESTATION_ENDPOINT")
        )
        
        self.policy_path = policy_path or "/etc/tee/attestation-policy.json"
        self.policy = self._load_policy()
        
        logger.info("AttestationValidator initialized")
    
    def _load_policy(self) -> Dict[str, Any]:
        """Load attestation policy from file or defaults."""
        try:
            if os.path.exists(self.policy_path):
                with open(self.policy_path, 'r') as f:
                    policy = json.load(f)
                logger.info(f"Loaded attestation policy from: {self.policy_path}")
                return policy
            else:
                logger.warning("No policy file found, using defaults")
                return self._get_default_policy()
        except Exception as e:
            logger.warning(f"Failed to load policy: {e}, using defaults")
            return self._get_default_policy()
    
    def _get_default_policy(self) -> Dict[str, Any]:
        """Get default attestation policy."""
        return {
            "version": "1.0",
            "attestationPolicy": {
                "provider": "azure-dcap",
                "minimumTcbLevel": "uptodate",
                "requiredClaims": {
                    "x-ms-sgx-is-debuggable": "false",
                    "x-ms-sgx-product-id": 1,
                    "x-ms-sgx-svn": 1
                }
            }
        }
    
    def detect_tee_type(self) -> Tuple[Optional[str], Dict[str, Any]]:
        """
        Detect the type of TEE environment.
        
        Returns:
            Tuple of (tee_type, details)
        """
        details = {}
        
        # Check for SGX
        if os.path.exists("/dev/sgx_enclave") or os.path.exists("/dev/sgx/enclave"):
            details["device"] = "/dev/sgx_enclave"
            details["driver"] = "in-kernel"
            
            # Check for SGX DCAP
            if os.path.exists("/dev/sgx_provision"):
                details["attestation"] = "dcap"
            
            logger.info("Detected SGX TEE environment")
            return self.TEE_TYPE_SGX, details
        
        # Check for SEV-SNP
        if os.path.exists("/dev/sev"):
            details["device"] = "/dev/sev"
            
            # Check SEV-SNP firmware version
            try:
                with open("/sys/module/kvm_amd/parameters/sev_snp", 'r') as f:
                    if f.read().strip() == "Y":
                        details["snp_enabled"] = True
                        logger.info("Detected SEV-SNP TEE environment")
                        return self.TEE_TYPE_SEV_SNP, details
            except:
                pass
        
        # Check for TDX
        if os.path.exists("/sys/firmware/tdx_seam"):
            details["device"] = "/sys/firmware/tdx_seam"
            logger.info("Detected TDX TEE environment")
            return self.TEE_TYPE_TDX, details
        
        logger.warning("No TEE environment detected")
        return None, {}
    
    def validate_local_attestation(self) -> Dict[str, Any]:
        """
        Validate local TEE attestation.
        
        Returns:
            Validation result dictionary
        """
        try:
            tee_type, details = self.detect_tee_type()
            
            if not tee_type:
                return {
                    "valid": False,
                    "error": "No TEE environment detected",
                    "tee_type": None
                }
            
            # Perform TEE-specific validation
            if tee_type == self.TEE_TYPE_SGX:
                return self._validate_sgx_local()
            elif tee_type == self.TEE_TYPE_SEV_SNP:
                return self._validate_sev_local()
            elif tee_type == self.TEE_TYPE_TDX:
                return self._validate_tdx_local()
            
            return {
                "valid": False,
                "error": f"Unsupported TEE type: {tee_type}",
                "tee_type": tee_type
            }
            
        except Exception as e:
            logger.error(f"Local attestation validation failed: {e}")
            return {
                "valid": False,
                "error": str(e),
                "tee_type": None
            }
    
    def _validate_sgx_local(self) -> Dict[str, Any]:
        """Validate SGX local attestation."""
        try:
            # Check if running in enclave
            is_enclave = self._check_sgx_enclave()
            
            if not is_enclave:
                return {
                    "valid": False,
                    "error": "Not running in SGX enclave",
                    "tee_type": self.TEE_TYPE_SGX
                }
            
            # Get SGX quote
            quote = self._get_sgx_quote()
            
            if not quote:
                return {
                    "valid": False,
                    "error": "Failed to generate SGX quote",
                    "tee_type": self.TEE_TYPE_SGX
                }
            
            # Validate quote
            validation = self._validate_sgx_quote(quote)
            
            return {
                "valid": validation["valid"],
                "tee_type": self.TEE_TYPE_SGX,
                "tcb_level": validation.get("tcb_level", "unknown"),
                "quote": base64.b64encode(quote).decode('utf-8') if quote else None,
                "error": validation.get("error")
            }
            
        except Exception as e:
            logger.error(f"SGX validation failed: {e}")
            return {
                "valid": False,
                "error": str(e),
                "tee_type": self.TEE_TYPE_SGX
            }
    
    def _validate_sev_local(self) -> Dict[str, Any]:
        """Validate SEV-SNP local attestation."""
        try:
            # Check SEV-SNP status
            attestation_report = self._get_sev_attestation_report()
            
            if not attestation_report:
                return {
                    "valid": False,
                    "error": "Failed to get SEV-SNP attestation report",
                    "tee_type": self.TEE_TYPE_SEV_SNP
                }
            
            return {
                "valid": True,
                "tee_type": self.TEE_TYPE_SEV_SNP,
                "tcb_level": "uptodate",
                "report": attestation_report
            }
            
        except Exception as e:
            logger.error(f"SEV-SNP validation failed: {e}")
            return {
                "valid": False,
                "error": str(e),
                "tee_type": self.TEE_TYPE_SEV_SNP
            }
    
    def _validate_tdx_local(self) -> Dict[str, Any]:
        """Validate TDX local attestation."""
        try:
            # Get TDX quote
            quote = self._get_tdx_quote()
            
            if not quote:
                return {
                    "valid": False,
                    "error": "Failed to get TDX quote",
                    "tee_type": self.TEE_TYPE_TDX
                }
            
            return {
                "valid": True,
                "tee_type": self.TEE_TYPE_TDX,
                "tcb_level": "uptodate",
                "quote": base64.b64encode(quote).decode('utf-8')
            }
            
        except Exception as e:
            logger.error(f"TDX validation failed: {e}")
            return {
                "valid": False,
                "error": str(e),
                "tee_type": self.TEE_TYPE_TDX
            }
    
    def _check_sgx_enclave(self) -> bool:
        """Check if running inside SGX enclave."""
        try:
            # Check for SGX environment variables
            if os.getenv("SGX_ENCLAVE"):
                return True
            
            # Check for DCAP library
            import ctypes
            try:
                sgx_lib = ctypes.CDLL("libsgx_dcap_quoteverify.so")
                return True
            except:
                pass
            
            # In production, use CPUID or other methods
            return os.path.exists("/dev/sgx_enclave")
            
        except Exception as e:
            logger.debug(f"SGX enclave check failed: {e}")
            return False
    
    def _get_sgx_quote(self) -> Optional[bytes]:
        """Generate SGX quote."""
        try:
            # In production, use SGX SDK to generate quote
            # For now, return mock quote for testing
            report_data = hashlib.sha256(b"test-report-data").digest()
            
            # This would call into SGX SDK in production
            # sgx_quote = generate_sgx_quote(report_data)
            
            logger.debug("Generated SGX quote (mock)")
            return b"mock-sgx-quote-data"
            
        except Exception as e:
            logger.error(f"Failed to generate SGX quote: {e}")
            return None
    
    def _validate_sgx_quote(self, quote: bytes) -> Dict[str, Any]:
        """Validate SGX quote."""
        try:
            # In production, verify quote with PCCS/DCAP
            # For now, return mock validation
            
            return {
                "valid": True,
                "tcb_level": "uptodate",
                "is_debuggable": False,
                "product_id": 1,
                "svn": 1
            }
            
        except Exception as e:
            logger.error(f"Quote validation failed: {e}")
            return {
                "valid": False,
                "error": str(e)
            }
    
    def _get_sev_attestation_report(self) -> Optional[Dict[str, Any]]:
        """Get SEV-SNP attestation report."""
        try:
            # In production, use SEV-SNP API
            # For now, return mock report
            
            return {
                "version": 1,
                "guest_svn": 1,
                "policy": 0x30000,
                "family_id": "test-family",
                "image_id": "test-image",
                "vmpl": 0,
                "signature_algo": 1,
                "platform_version": 1,
                "platform_info": 0
            }
            
        except Exception as e:
            logger.error(f"Failed to get SEV attestation report: {e}")
            return None
    
    def _get_tdx_quote(self) -> Optional[bytes]:
        """Get TDX quote."""
        try:
            # In production, use TDX API
            # For now, return mock quote
            
            return b"mock-tdx-quote-data"
            
        except Exception as e:
            logger.error(f"Failed to get TDX quote: {e}")
            return None
    
    def validate_remote_attestation(
        self,
        attestation_token: str
    ) -> Dict[str, Any]:
        """
        Validate remote attestation token.
        
        Args:
            attestation_token: JWT attestation token
            
        Returns:
            Validation result
        """
        try:
            if not self.attestation_endpoint:
                return {
                    "valid": False,
                    "error": "No attestation endpoint configured"
                }
            
            # Verify token with Azure Attestation Service
            response = requests.post(
                f"{self.attestation_endpoint}/attest",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {attestation_token}"
                },
                json={"token": attestation_token},
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "valid": True,
                    "claims": result.get("claims", {}),
                    "token": attestation_token
                }
            else:
                return {
                    "valid": False,
                    "error": f"Attestation failed: {response.status_code}"
                }
                
        except Exception as e:
            logger.error(f"Remote attestation validation failed: {e}")
            return {
                "valid": False,
                "error": str(e)
            }
    
    def verify_policy_compliance(
        self,
        attestation_result: Dict[str, Any]
    ) -> bool:
        """
        Verify attestation result complies with policy.
        
        Args:
            attestation_result: Attestation validation result
            
        Returns:
            True if compliant
        """
        try:
            policy = self.policy.get("attestationPolicy", {})
            required_claims = policy.get("requiredClaims", {})
            
            result_claims = attestation_result.get("claims", {})
            
            for claim, expected_value in required_claims.items():
                actual_value = result_claims.get(claim)
                
                if str(actual_value) != str(expected_value):
                    logger.warning(
                        f"Policy violation: {claim} = {actual_value}, "
                        f"expected {expected_value}"
                    )
                    return False
            
            # Check TCB level
            min_tcb = policy.get("minimumTcbLevel", "uptodate")
            actual_tcb = attestation_result.get("tcb_level", "unknown")
            
            if not self._check_tcb_level(actual_tcb, min_tcb):
                logger.warning(f"TCB level too low: {actual_tcb} < {min_tcb}")
                return False
            
            return True
            
        except Exception as e:
            logger.error(f"Policy compliance check failed: {e}")
            return False
    
    def _check_tcb_level(self, actual: str, minimum: str) -> bool:
        """Check if TCB level meets minimum requirement."""
        tcb_levels = ["unknown", "outofdate", "configneeded", "uptodate"]
        
        try:
            actual_idx = tcb_levels.index(actual.lower())
            minimum_idx = tcb_levels.index(minimum.lower())
            return actual_idx >= minimum_idx
        except:
            return False


def main():
    """Main entry point for testing."""
    import argparse
    
    parser = argparse.ArgumentParser(description="TEE Attestation Validator")
    parser.add_argument("--detect", action="store_true", help="Detect TEE type")
    parser.add_argument("--validate-local", action="store_true", help="Validate local attestation")
    parser.add_argument("--attestation-endpoint", help="Attestation service endpoint")
    parser.add_argument("--token", help="Remote attestation token to validate")
    
    args = parser.parse_args()
    
    try:
        validator = AttestationValidator(
            attestation_endpoint=args.attestation_endpoint
        )
        
        if args.detect:
            tee_type, details = validator.detect_tee_type()
            print(f"TEE Type: {tee_type}")
            print(f"Details: {json.dumps(details, indent=2)}")
        
        if args.validate_local:
            result = validator.validate_local_attestation()
            print("Local Attestation Result:")
            print(json.dumps(result, indent=2))
        
        if args.token:
            result = validator.validate_remote_attestation(args.token)
            print("Remote Attestation Result:")
            print(json.dumps(result, indent=2))
        
        sys.exit(0)
        
    except Exception as e:
        logger.error(f"Validation failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
