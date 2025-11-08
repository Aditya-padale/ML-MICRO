# Scripts Directory

This directory contains utility scripts for the Euro Clean ML project.

## Scripts

### Development Scripts
- `setup_dev.sh` - Development environment setup
- `run_tests.sh` - Test execution script
- `lint_code.sh` - Code quality checks

### Deployment Scripts  
- `deploy_prod.sh` - Production deployment
- `backup_models.sh` - Model backup utility
- `health_check.sh` - System health monitoring

### Data Processing Scripts
- `prepare_dataset.py` - Dataset preprocessing
- `validate_images.py` - Image validation utility
- `export_results.py` - Result export utility

## Usage

Scripts should be run from the project root directory:

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Run development setup
./scripts/setup_dev.sh

# Run tests
./scripts/run_tests.sh
```
