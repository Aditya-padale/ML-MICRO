# Configuration Directory

This directory contains environment-specific configuration files for the Euro Clean ML project.

## Files

- `.env` - Main environment configuration (moved from root)
- `.env.development` - Development environment settings
- `.env.production` - Production environment settings  
- `requirements.txt` - Python dependencies (moved from root)

## Usage

Copy the appropriate environment file to `.env` in the project root:

```bash
# For development
cp config/.env.development .env

# For production  
cp config/.env.production .env
```

## Environment Variables

- `DEBUG`: Enable/disable debug mode
- `MODEL_PATH`: Path to the trained model file
- `DATA_PATH`: Path to the dataset directory
- `HOST`: Server host address
- `PORT`: Server port number
