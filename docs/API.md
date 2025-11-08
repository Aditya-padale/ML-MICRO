# API Documentation

## Overview

The Euro Clean ML API provides endpoints for satellite image analysis, land use classification, and environmental change detection.

## Base URL

- Development: `http://localhost:8000`
- Production: `https://your-domain.com`

## Authentication

Currently, the API does not require authentication. Rate limiting is applied:
- 60 requests per minute
- Burst limit: 10 requests

## Endpoints

### 1. Image Classification

**POST** `/api/predict`

Classify a single satellite image into one of 10 land use categories.

#### Request Body (multipart/form-data)
```
file: Image file (JPEG, PNG, TIFF)
```

#### Response
```json
{
  "predicted_class": "Forest",
  "confidence": 0.95,
  "probabilities": {
    "AnnualCrop": 0.02,
    "Forest": 0.95,
    "HerbaceousVegetation": 0.01,
    ...
  },
  "processing_time": 0.05
}
```

### 2. Change Detection Analysis

**POST** `/api/analyze`

Analyze temporal changes between two satellite images.

#### Request Body (multipart/form-data)
```
before_image: Image file (before state)
after_image: Image file (after state)
before_year: Integer (optional, default: 2020)
after_year: Integer (optional, default: 2024)
future_years: Integer (optional, default: 5)
```

#### Response
```json
{
  "change_info": {
    "before_class": "Forest",
    "after_class": "Industrial",
    "change_magnitude": 0.85,
    "change_detected": true
  },
  "environmental_impact": {
    "impact_type": "negative",
    "severity": "high",
    "description": "Forest conversion to industrial use"
  },
  "area_changes": {
    "Forest": {
      "before_area_km2": 100.0,
      "after_area_km2": 30.0,
      "change_km2": -70.0,
      "percentage_change": -70.0
    }
  },
  "future_trends": {
    "predictions": [...],
    "confidence": 0.8
  },
  "recommendations": [...]
}
```

### 3. GradCAM Visualization

**POST** `/api/gradcam`

Generate visual explanations for model predictions using GradCAM.

#### Request Body (multipart/form-data)
```
file: Image file
```

#### Response
```json
{
  "gradcam_overlay": "base64_encoded_image",
  "predicted_class": "Forest",
  "confidence": 0.95,
  "heatmap_regions": [...]
}
```

### 4. Environmental Report

**POST** `/api/report`

Generate comprehensive environmental impact reports.

#### Request Body (JSON)
```json
{
  "analysis_data": {...},
  "report_type": "detailed", // "summary", "detailed", "both"
  "future_years": 5
}
```

#### Response
```json
{
  "report_generated": true,
  "full_report": "Detailed environmental analysis...",
  "summary_report": "Brief summary...",
  "generated_at": "2024-11-08T12:00:00Z"
}
```

### 5. Recommendations

**GET** `/api/recommend`

Get environmental management recommendations based on analysis.

#### Query Parameters
```
impact_type: string (positive, negative, neutral)
land_use: string (Forest, Industrial, etc.)
```

#### Response
```json
{
  "recommendations": [
    {
      "category": "conservation",
      "priority": "high",
      "action": "Implement forest protection measures",
      "timeline": "immediate"
    }
  ]
}
```

## Error Handling

### Error Response Format
```json
{
  "error": true,
  "message": "Description of the error",
  "error_code": "INVALID_IMAGE_FORMAT",
  "timestamp": "2024-11-08T12:00:00Z"
}
```

### Common Error Codes

- `INVALID_IMAGE_FORMAT` - Unsupported image format
- `FILE_TOO_LARGE` - File exceeds size limit (50MB)
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `MODEL_ERROR` - Internal model processing error
- `VALIDATION_ERROR` - Invalid request parameters

## Rate Limiting

- Standard limit: 60 requests per minute
- Burst limit: 10 requests in quick succession
- Rate limit headers included in responses

## File Upload Specifications

### Supported Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- TIFF (.tiff, .tif)

### Limitations
- Maximum file size: 50MB
- Recommended resolution: 224x224 pixels or higher
- Color mode: RGB

## WebSocket Support

Real-time updates available via WebSocket connection:

```javascript
const ws = new WebSocket('ws://localhost:8000/ws');
ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    // Handle real-time updates
};
```

## SDK Examples

### Python
```python
import requests

# Image classification
with open('satellite_image.jpg', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/api/predict',
        files={'file': f}
    )
result = response.json()
```

### JavaScript
```javascript
// Image classification
const formData = new FormData();
formData.append('file', imageFile);

fetch('/api/predict', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

### cURL
```bash
# Image classification
curl -X POST "http://localhost:8000/api/predict" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@satellite_image.jpg"
```

## Versioning

The API uses semantic versioning. Current version: `v2.0.0`

Version information available at: `GET /api/version`

## Support

For API support, please:
1. Check the interactive documentation at `/docs`
2. Open an issue on GitHub
3. Contact the development team
