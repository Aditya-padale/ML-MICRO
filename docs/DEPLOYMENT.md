# Deployment Guide

## Overview

This guide covers deployment options for the Euro Clean ML application across different environments.

## Environment Setup

### Development
```bash
# Copy development config
cp config/.env.development .env

# Install dependencies
pip install -r config/requirements.txt
cd frontend && npm install

# Run development servers
# Backend (Terminal 1)
cd backend && python run.py

# Frontend (Terminal 2)  
cd frontend && npm start
```

### Production

#### Prerequisites
- Docker & Docker Compose
- Python 3.8+
- Node.js 16+
- Nginx (recommended)
- SSL certificate

## Docker Deployment

### 1. Create Dockerfile for Backend

```dockerfile
# Dockerfile.backend
FROM python:3.9-slim

WORKDIR /app

COPY config/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/
COPY backend/ ./backend/
COPY models/ ./models/
COPY config/.env.production .env

EXPOSE 8000

CMD ["python", "backend/run.py"]
```

### 2. Create Dockerfile for Frontend

```dockerfile
# Dockerfile.frontend
FROM node:16-alpine AS build

WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --only=production

COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
    volumes:
      - ./models:/app/models
      - ./data:/app/data
    depends_on:
      - redis
      - db

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

  db:
    image: postgres:13
    environment:
      POSTGRES_DB: euroml
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 4. Deploy with Docker Compose

```bash
# Build and start services
docker-compose up --build -d

# Check logs
docker-compose logs -f

# Scale services
docker-compose up --scale backend=3 -d
```

## Cloud Deployment

### AWS EC2

#### 1. Launch EC2 Instance
- Instance type: t3.medium or larger
- Security groups: Allow ports 22, 80, 443, 8000
- Storage: 20GB+ SSD

#### 2. Setup Script
```bash
#!/bin/bash
# setup.sh

# Update system
sudo yum update -y
sudo yum install -y docker git

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Start Docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Clone repository
git clone https://github.com/Aditya-padale/ML-MICRO.git
cd ML-MICRO

# Setup production environment
cp config/.env.production .env

# Deploy
docker-compose up -d
```

### Google Cloud Platform

#### 1. Cloud Run Deployment
```bash
# Build and push images
gcloud builds submit --tag gcr.io/PROJECT_ID/euroml-backend
gcloud builds submit --tag gcr.io/PROJECT_ID/euroml-frontend

# Deploy backend
gcloud run deploy euroml-backend \
  --image gcr.io/PROJECT_ID/euroml-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 1

# Deploy frontend
gcloud run deploy euroml-frontend \
  --image gcr.io/PROJECT_ID/euroml-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### 2. Kubernetes Deployment
```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: euroml-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: euroml-backend
  template:
    metadata:
      labels:
        app: euroml-backend
    spec:
      containers:
      - name: backend
        image: gcr.io/PROJECT_ID/euroml-backend
        ports:
        - containerPort: 8000
        env:
        - name: ENVIRONMENT
          value: "production"
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
---
apiVersion: v1
kind: Service
metadata:
  name: euroml-backend-service
spec:
  selector:
    app: euroml-backend
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
```

## Nginx Configuration

### Production Nginx Setup
```nginx
# /etc/nginx/sites-available/euroml
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Handle large file uploads
        client_max_body_size 50M;
    }
    
    # WebSocket support
    location /ws {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

### Production Environment
```bash
# .env.production
DEBUG=False
ENVIRONMENT=production
SECRET_KEY=your-production-secret-key
ALLOWED_ORIGINS=["https://your-domain.com"]

# Database
DATABASE_URL=postgresql://user:pass@localhost/euroml

# Redis
REDIS_URL=redis://localhost:6379/0

# ML Model
MODEL_PATH=./models/model_epoch_30.pth
DEVICE=cpu  # or cuda if available

# File Storage
UPLOAD_DIR=/var/uploads
MAX_FILE_SIZE=52428800  # 50MB

# Monitoring
LOG_LEVEL=INFO
ENABLE_METRICS=True

# External APIs
GOOGLE_API_KEY=your-api-key
```

## Performance Optimization

### Backend Optimization
```python
# gunicorn.conf.py
bind = "0.0.0.0:8000"
workers = 4
worker_class = "uvicorn.workers.UvicornWorker"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 100
preload_app = True
timeout = 120
```

### Frontend Optimization
```javascript
// webpack.config.js optimizations
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  output: {
    filename: '[name].[contenthash].js',
  },
};
```

## Monitoring & Logging

### 1. Application Monitoring
```python
# Add to backend/main.py
import logging
from prometheus_client import Counter, Histogram, generate_latest

# Metrics
request_count = Counter('requests_total', 'Total requests')
request_duration = Histogram('request_duration_seconds', 'Request duration')

@app.middleware("http")
async def add_monitoring(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    
    request_count.inc()
    request_duration.observe(duration)
    
    return response
```

### 2. Log Configuration
```yaml
# logging.yaml
version: 1
formatters:
  default:
    format: '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
handlers:
  console:
    class: logging.StreamHandler
    formatter: default
  file:
    class: logging.handlers.RotatingFileHandler
    filename: /var/log/euroml.log
    maxBytes: 10485760  # 10MB
    backupCount: 5
    formatter: default
loggers:
  euroml:
    level: INFO
    handlers: [console, file]
```

## Health Checks

### Backend Health Check
```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "2.0.0",
        "model_loaded": model_service.model is not None
    }
```

### Docker Health Check
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1
```

## Backup & Recovery

### Database Backup
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump euroml > /backups/euroml_$DATE.sql
aws s3 cp /backups/euroml_$DATE.sql s3://your-backup-bucket/
```

### Model Backup
```bash
# Backup trained models
rsync -av models/ s3://your-model-bucket/models/
```

## Security

### 1. Environment Security
```bash
# Secure file permissions
chmod 600 .env
chmod 700 models/
chmod 755 uploads/

# Firewall rules
ufw allow 22/tcp
ufw allow 80/tcp  
ufw allow 443/tcp
ufw deny 8000/tcp  # Only allow internal access
```

### 2. Application Security
```python
# Add security headers
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response
```

## Troubleshooting

### Common Issues

1. **Model Loading Error**
   ```bash
   # Check model file permissions
   ls -la models/model_epoch_30.pth
   
   # Verify model path in config
   grep MODEL_PATH .env
   ```

2. **Memory Issues**
   ```bash
   # Monitor memory usage
   docker stats
   
   # Increase container memory
   docker run --memory=4g ...
   ```

3. **Database Connection**
   ```bash
   # Check database connectivity
   psql -h localhost -U user -d euroml
   
   # Verify connection string
   echo $DATABASE_URL
   ```

## Performance Benchmarks

### Expected Performance
- **Image Classification**: ~50ms per image
- **Change Detection**: ~200ms per pair
- **Memory Usage**: ~2GB RAM
- **Throughput**: ~100 requests/minute
- **Storage**: ~10GB for full deployment

For support during deployment, refer to the troubleshooting section or open an issue on GitHub.
