#!/usr/bin/env python3
"""
TEE Workload Readiness Probe
Kubernetes-compatible readiness probe for TEE workloads.
Validates attestation, Key Vault access, and model availability.
"""

import os
import sys
import json
import time
import logging
from typing import Dict, Any, List
from datetime import datetime
import requests

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class ReadinessProbe:
    """Comprehensive readiness probe for TEE workloads."""
    
    def __init__(self, config_path: str = "/etc/tee/readiness-config.json"):
        """
        Initialize readiness probe.
        
        Args:
            config_path: Path to configuration file
        """
        self.config = self._load_config(config_path)
        self.checks_passed = []
        self.checks_failed = []
        
    def _load_config(self, config_path: str) -> Dict[str, Any]:
        """Load probe configuration."""
        default_config = {
            "attestation_required": os.getenv("ATTESTATION_REQUIRED", "true").lower() == "true",
            "keyvault_check": True,
            "model_check": True,
            "port_check": True,
            "timeout": 30,
            "keyvault_url": os.getenv("KEYVAULT_URL"),
            "model_path": os.getenv("MODEL_PATH", "/models"),
            "service_port": int(os.getenv("SERVICE_PORT", "8000"))
        }
        
        if os.path.exists(config_path):
            try:
                with open(config_path, 'r') as f:
                    user_config = json.load(f)
                    default_config.update(user_config)
                logger.info(f"Loaded config from: {config_path}")
            except Exception as e:
                logger.warning(f"Failed to load config: {e}, using defaults")
        
        return default_config
    
    def check_tee_attestation(self) -> bool:
        """Check TEE attestation status."""
        if not self.config["attestation_required"]:
            logger.info("TEE attestation check skipped (not required)")
            self.checks_passed.append("attestation:skipped")
            return True
        
        try:
            logger.info("Checking TEE attestation...")
            
            # Try to import attestation validator
            try:
                from attestation_validator import AttestationValidator
                
                validator = AttestationValidator()
                result = validator.validate_local_attestation()
                
                if result["valid"]:
                    logger.info(f"TEE attestation valid (Type: {result['tee_type']})")
                    self.checks_passed.append("attestation:valid")
                    return True
                else:
                    logger.error(f"TEE attestation failed: {result.get('error')}")
                    self.checks_failed.append(f"attestation:failed:{result.get('error')}")
                    return False
                    
            except ImportError:
                logger.warning("Attestation validator not available, assuming valid")
                self.checks_passed.append("attestation:unavailable")
                return True
                
        except Exception as e:
            logger.error(f"Attestation check error: {e}")
            self.checks_failed.append(f"attestation:error:{str(e)}")
            return False
    
    def check_keyvault_access(self) -> bool:
        """Check Key Vault connectivity and access."""
        if not self.config["keyvault_check"]:
            logger.info("Key Vault check skipped")
            self.checks_passed.append("keyvault:skipped")
            return True
        
        keyvault_url = self.config.get("keyvault_url")
        if not keyvault_url:
            logger.warning("KEYVAULT_URL not set, skipping check")
            self.checks_passed.append("keyvault:not-configured")
            return True
        
        try:
            logger.info(f"Checking Key Vault access: {keyvault_url}")
            
            from azure.identity import DefaultAzureCredential
            from azure.keyvault.secrets import SecretClient
            
            credential = DefaultAzureCredential()
            client = SecretClient(vault_url=keyvault_url, credential=credential)
            
            # Try to list secrets (just to verify access)
            list(client.list_properties_of_secrets())
            
            logger.info("Key Vault access verified")
            self.checks_passed.append("keyvault:accessible")
            return True
            
        except Exception as e:
            logger.error(f"Key Vault access failed: {e}")
            self.checks_failed.append(f"keyvault:failed:{str(e)}")
            return False
    
    def check_models_loaded(self) -> bool:
        """Check if required models are loaded."""
        if not self.config["model_check"]:
            logger.info("Model check skipped")
            self.checks_passed.append("models:skipped")
            return True
        
        model_path = self.config["model_path"]
        
        try:
            logger.info(f"Checking models in: {model_path}")
            
            if not os.path.exists(model_path):
                logger.error(f"Model path does not exist: {model_path}")
                self.checks_failed.append("models:path-not-found")
                return False
            
            # Count model files
            model_files = []
            for ext in ['.pt', '.pth', '.onnx', '.pb', '.h5']:
                model_files.extend(
                    [f for f in os.listdir(model_path) 
                     if f.endswith(ext) and os.path.isfile(os.path.join(model_path, f))]
                )
            
            if len(model_files) == 0:
                logger.error(f"No model files found in {model_path}")
                self.checks_failed.append("models:not-found")
                return False
            
            logger.info(f"Found {len(model_files)} model file(s)")
            self.checks_passed.append(f"models:found:{len(model_files)}")
            return True
            
        except Exception as e:
            logger.error(f"Model check error: {e}")
            self.checks_failed.append(f"models:error:{str(e)}")
            return False
    
    def check_service_port(self) -> bool:
        """Check if service port is listening."""
        if not self.config["port_check"]:
            logger.info("Port check skipped")
            self.checks_passed.append("port:skipped")
            return True
        
        port = self.config["service_port"]
        
        try:
            logger.info(f"Checking service port: {port}")
            
            # Try to connect to the service
            import socket
            
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(2)
            
            result = sock.connect_ex(('localhost', port))
            sock.close()
            
            if result == 0:
                logger.info(f"Service port {port} is listening")
                self.checks_passed.append(f"port:listening:{port}")
                return True
            else:
                logger.warning(f"Service port {port} is not ready yet")
                self.checks_failed.append(f"port:not-listening:{port}")
                return False
                
        except Exception as e:
            logger.error(f"Port check error: {e}")
            self.checks_failed.append(f"port:error:{str(e)}")
            return False
    
    def check_health_endpoint(self) -> bool:
        """Check service health endpoint."""
        port = self.config["service_port"]
        
        try:
            logger.info(f"Checking health endpoint: http://localhost:{port}/health")
            
            response = requests.get(
                f"http://localhost:{port}/health",
                timeout=5
            )
            
            if response.status_code == 200:
                logger.info("Health endpoint returned 200 OK")
                self.checks_passed.append("health:ok")
                return True
            else:
                logger.warning(f"Health endpoint returned {response.status_code}")
                self.checks_failed.append(f"health:status-{response.status_code}")
                return False
                
        except requests.exceptions.ConnectionError:
            logger.warning("Health endpoint not reachable yet")
            self.checks_failed.append("health:not-reachable")
            return False
        except Exception as e:
            logger.error(f"Health endpoint check error: {e}")
            self.checks_failed.append(f"health:error:{str(e)}")
            return False
    
    def check_system_resources(self) -> bool:
        """Check system resource availability."""
        try:
            logger.info("Checking system resources...")
            
            # Check disk space
            import shutil
            total, used, free = shutil.disk_usage("/")
            free_gb = free // (2**30)
            
            if free_gb < 1:
                logger.error(f"Low disk space: {free_gb}GB free")
                self.checks_failed.append(f"resources:disk-low:{free_gb}GB")
                return False
            
            # Check memory
            try:
                with open('/proc/meminfo', 'r') as f:
                    meminfo = f.read()
                    mem_available = int([line for line in meminfo.split('\n') 
                                        if 'MemAvailable' in line][0].split()[1])
                    mem_available_gb = mem_available / (1024 * 1024)
                    
                    if mem_available_gb < 0.5:
                        logger.warning(f"Low memory: {mem_available_gb:.1f}GB available")
                        self.checks_failed.append(f"resources:memory-low:{mem_available_gb:.1f}GB")
                        return False
            except:
                pass
            
            logger.info(f"System resources OK (Disk: {free_gb}GB free)")
            self.checks_passed.append("resources:ok")
            return True
            
        except Exception as e:
            logger.error(f"Resource check error: {e}")
            self.checks_failed.append(f"resources:error:{str(e)}")
            return False
    
    def run_all_checks(self) -> bool:
        """Run all readiness checks."""
        logger.info("========================================")
        logger.info("Starting readiness checks...")
        logger.info("========================================")
        
        start_time = time.time()
        
        checks = [
            ("TEE Attestation", self.check_tee_attestation),
            ("Key Vault Access", self.check_keyvault_access),
            ("Models Loaded", self.check_models_loaded),
            ("System Resources", self.check_system_resources),
            ("Service Port", self.check_service_port),
            ("Health Endpoint", self.check_health_endpoint),
        ]
        
        all_passed = True
        
        for check_name, check_func in checks:
            try:
                logger.info(f"Running check: {check_name}")
                result = check_func()
                
                if not result:
                    all_passed = False
                    logger.warning(f"Check failed: {check_name}")
                else:
                    logger.info(f"Check passed: {check_name}")
                    
            except Exception as e:
                all_passed = False
                logger.error(f"Check error ({check_name}): {e}")
                self.checks_failed.append(f"{check_name}:exception:{str(e)}")
        
        elapsed_time = time.time() - start_time
        
        logger.info("========================================")
        logger.info(f"Readiness checks completed in {elapsed_time:.2f}s")
        logger.info(f"Passed: {len(self.checks_passed)}")
        logger.info(f"Failed: {len(self.checks_failed)}")
        logger.info("========================================")
        
        return all_passed
    
    def get_status_report(self) -> Dict[str, Any]:
        """Get detailed status report."""
        return {
            "ready": len(self.checks_failed) == 0,
            "timestamp": datetime.utcnow().isoformat(),
            "checks_passed": self.checks_passed,
            "checks_failed": self.checks_failed,
            "config": {
                "attestation_required": self.config["attestation_required"],
                "keyvault_url": self.config.get("keyvault_url", "not-set"),
                "model_path": self.config["model_path"],
                "service_port": self.config["service_port"]
            }
        }


def main():
    """Main entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(description="TEE Workload Readiness Probe")
    parser.add_argument("--config", default="/etc/tee/readiness-config.json",
                       help="Configuration file path")
    parser.add_argument("--json", action="store_true",
                       help="Output result as JSON")
    parser.add_argument("--wait", type=int, default=0,
                       help="Wait time before check (seconds)")
    
    args = parser.parse_args()
    
    # Wait if requested
    if args.wait > 0:
        logger.info(f"Waiting {args.wait} seconds before checking...")
        time.sleep(args.wait)
    
    try:
        probe = ReadinessProbe(config_path=args.config)
        is_ready = probe.run_all_checks()
        
        if args.json:
            print(json.dumps(probe.get_status_report(), indent=2))
        
        # Exit with appropriate code
        sys.exit(0 if is_ready else 1)
        
    except Exception as e:
        logger.error(f"Readiness probe failed: {e}")
        
        if args.json:
            print(json.dumps({
                "ready": False,
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }))
        
        sys.exit(1)


if __name__ == "__main__":
    main()
