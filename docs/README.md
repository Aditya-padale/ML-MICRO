# Euro Clean ML - Satellite Land Use Classification

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-green.svg)
![License](https://img.shields.io/badge/license-MIT-yellow.svg)

A comprehensive machine learning application for satellite image analysis, land use classification, and environmental change detection using the EuroSAT dataset.

## 🚀 Features

- **Land Use Classification**: 10-class classification using ResNet-18 architecture
- **Change Detection**: Advanced temporal analysis of land use changes
- **Environmental Impact Analysis**: Automated assessment of environmental changes
- **GradCAM Visualization**: Visual explanations of model predictions
- **Area Calculation**: Precise area measurements for different land use types
- **Real-time API**: FastAPI backend with WebSocket support
- **Interactive Frontend**: React-based user interface
- **Report Generation**: Automated environmental impact reports

## 📁 Project Structure

```
Euro_Clean/
├── src/                          # Source code
│   ├── ml_modules/              # Machine learning modules
│   │   ├── advanced_change_detection.py
│   │   ├── enhanced_area_detection.py
│   │   ├── environmental_report_generator.py
│   │   └── environmental_report_wrapper.py
│   └── utils/                   # Utility functions
│       └── gradcam_utils.py
├── backend/                     # FastAPI backend
│   ├── api/                    # API endpoints
│   ├── services/               # Business logic
│   └── config.py              # Configuration
├── frontend/                   # React frontend
│   ├── src/                   # React source
│   └── public/                # Static assets
├── models/                     # Trained models
│   └── model_epoch_30.pth     # Main classification model
├── data/                      # Datasets
│   └── EuroSAT_RGB/          # EuroSAT dataset
├── config/                    # Configuration files
│   ├── .env.development      # Development settings
│   ├── .env.production       # Production settings
│   └── requirements.txt      # Python dependencies
├── docs/                     # Documentation
├── scripts/                  # Utility scripts
└── tests/                   # Test files
```

## 🏷️ Land Use Classes

The model classifies satellite images into 10 categories:

1. **AnnualCrop** - Annual cropland
2. **Forest** - Forest areas
3. **HerbaceousVegetation** - Herbaceous vegetation
4. **Highway** - Highway infrastructure
5. **Industrial** - Industrial areas
6. **Pasture** - Pasture land
7. **PermanentCrop** - Permanent crops
8. **Residential** - Residential areas
9. **River** - Rivers and waterways
10. **SeaLake** - Seas and lakes

## 🛠️ Installation

### Prerequisites

- Python 3.8+
- Node.js 16+
- Git

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/Aditya-padale/ML-MICRO.git
cd ML-MICRO

# Set up Python environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r config/requirements.txt

# Set up environment
cp config/.env.development .env

# Run the backend
cd backend
python run.py
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## 🚀 Usage

### API Endpoints

- **POST /api/predict** - Single image classification
- **POST /api/analyze** - Temporal change analysis
- **POST /api/gradcam** - Generate GradCAM visualizations
- **POST /api/report** - Generate environmental reports
- **GET /api/recommend** - Get environmental recommendations

### Web Interface

1. Open `http://localhost:3000` in your browser
2. Upload satellite images for classification
3. Compare images for change detection
4. View GradCAM visualizations
5. Generate environmental reports

## 🧠 Model Architecture

- **Base Model**: ResNet-18
- **Input Size**: 224×224×3 RGB images
- **Output**: 10-class classification
- **Training**: 30 epochs on EuroSAT dataset
- **Accuracy**: ~95% on test set

## 📊 API Documentation

Detailed API documentation is available at:
- Development: `http://localhost:8000/docs`
- Interactive docs: `http://localhost:8000/redoc`

## 🔧 Configuration

Environment variables can be configured in `.env` file:

```bash
DEBUG=True
MODEL_PATH=../models/model_epoch_30.pth
DATA_PATH=../data/EuroSAT_RGB/
HOST=localhost
PORT=8000
```

## 🧪 Testing

```bash
# Run backend tests
cd backend
python -m pytest tests/

# Run frontend tests
cd frontend
npm test
```

## 📈 Performance

- **Inference Speed**: ~50ms per image
- **Memory Usage**: ~2GB RAM
- **Supported Formats**: JPEG, PNG, TIFF
- **Max Image Size**: 50MB

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Aditya Padale**
- GitHub: [@Aditya-padale](https://github.com/Aditya-padale)
- Project: [ML-MICRO](https://github.com/Aditya-padale/ML-MICRO)

## 🙏 Acknowledgments

- EuroSAT dataset by Helber et al.
- PyTorch and FastAPI communities
- React and the frontend ecosystem

## 📞 Support

For support, please open an issue on GitHub or contact the maintainers.

---

⭐ **Star this repository if you find it helpful!**
