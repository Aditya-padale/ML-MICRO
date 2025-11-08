# 🛰️ Euro Clean ML - Satellite Land Use Classification

An advanced satellite image analysis platform that combines computer vision, deep learning, and AI-powered environmental reporting to detect land use changes and predict environmental impacts.

> 📚 **[View Complete Documentation](docs/README.md)** | **[API Documentation](docs/API.md)** | **[Deployment Guide](docs/DEPLOYMENT.md)**

## 🌟 Key Features

### 🔍 Advanced Change Detection
- **Before/After Analysis**: Upload satellite images from different time periods
- **Deep Learning Classification**: ResNet18 trained on EuroSAT dataset
- **Confidence-Based Detection**: Intelligent change detection with adjustable sensitivity
- **Grad-CAM Visualization**: See exactly what the AI is focusing on

### 🤖 AI-Powered Environmental Reports (NEW!)
- **LangChain Integration**: Advanced natural language processing
- **Gemini AI**: Google's powerful language model for expert-level analysis
- **Comprehensive Reports**: Past analysis, future predictions, and actionable plans
- **Multiple Formats**: Detailed reports and quick summaries

### 📊 Advanced Analytics
- **Environmental Impact Scoring**: Quantitative assessment of changes
- **Future Trend Prediction**: AI-powered forecasting for next 5+ years  
- **Temporal Analysis**: Change velocity and trend calculations
- **Interactive Visualizations**: Dynamic charts and graphs

### 💡 Actionable Insights
- **Prioritized Recommendations**: Urgent vs. preventive measures
- **Stakeholder-Specific Actions**: For governments, communities, and businesses
- **Conservation Strategies**: Science-backed environmental interventions

## 🧠 Model & Technology Stack

### Core Technologies
- **Computer Vision**: PyTorch, ResNet18, Grad-CAM
- **AI Integration**: LangChain, Google Generative AI (Gemini)
- **Data Analysis**: Pandas, NumPy, SciPy, Scikit-learn
- **Visualization**: Plotly, Matplotlib, Seaborn
- **Web Interface**: Streamlit

### Model Details
- **Architecture**: ResNet18 with transfer learning
- **Dataset**: EuroSAT RGB satellite imagery
- **Input Size**: 224x224 pixels
- **Output**: 10 land cover classes with confidence scores

## 🖼️ Land Cover Classes

The system recognizes 10 distinct land cover types:
- 🌾 **AnnualCrop** - Seasonal agricultural areas
- 🌲 **Forest** - Dense tree coverage areas  
- 🌿 **HerbaceousVegetation** - Grasslands and meadows
- 🛣️ **Highway** - Major transportation infrastructure
- 🏭 **Industrial** - Manufacturing and industrial zones
- 🐄 **Pasture** - Livestock grazing areas
- 🍇 **PermanentCrop** - Orchards and vineyards
- 🏘️ **Residential** - Urban housing areas
- 🏞️ **River** - Freshwater bodies and streams
- 🌊 **SeaLake** - Large water bodies

## ⚙️ Setup & Installation

### � Quick Setup

1. **Clone or download the project**
2. **Run the automated setup**:
   ```bash
   python setup.py
   ```

### 📋 Manual Setup

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment variables**:
   Create a `.env` file with your Google API key:
   ```env
   GOOGLE_API_KEY=your_api_key_here
   ```

3. **Run the application**:
   ```bash
   streamlit run enhanced_app.py
   ```

## � Environment Configuration

The `.env` file contains important configuration settings:

```env
# ===========================================
# GEMINI API CONFIGURATION (LangChain)  
# ===========================================
GOOGLE_API_KEY=your_api_key_here

# ===========================================
# APPLICATION SETTINGS
# ===========================================
MODEL_PATH=model_epoch_30.pth
FUTURE_PREDICTION_YEARS=5
CHANGE_DETECTION_SENSITIVITY=0.3

# ===========================================  
# LANGCHAIN CONFIGURATION
# ===========================================
LANGCHAIN_TEMPERATURE=0.7
LANGCHAIN_MAX_TOKENS=2000
GEMINI_MODEL_NAME=gemini-pro
```

## 🚀 Usage Guide

### 📷 Basic Analysis
1. **Upload Images**: Add before and after satellite images
2. **Set Time Period**: Specify the years for each image
3. **Configure Analysis**: Adjust sensitivity and visualization options
4. **Review Results**: Examine change detection, impact scores, and predictions

### 🤖 AI Environmental Reports
1. **Enable AI Reports**: Check the option in the sidebar
2. **Choose Report Type**: Select Summary, Detailed, or Both
3. **Generate Report**: AI will create comprehensive environmental analysis
4. **Export Results**: Download complete analysis including AI reports

### 📊 Advanced Features
- **Grad-CAM Heatmaps**: Visualize model attention areas
- **Future Predictions**: See 5-year trend forecasts
- **Interactive Charts**: Explore data with dynamic visualizations
- **Export Options**: JSON and CSV formats available

## 📁 Project Structure

```
SatelliteSight/
├── enhanced_app.py                    # Main Streamlit application
├── environmental_report_generator.py  # LangChain AI report generator
├── advanced_change_detection.py       # Change detection algorithms
├── gradcam_utils.py                  # Grad-CAM visualization
├── train.py                          # Model training script
├── model_epoch_30.pth               # Trained ResNet18 model
├── requirements.txt                 # Python dependencies
├── setup.py                        # Automated setup script
├── .env                           # Environment configuration
└── README.md                      # This file
```

## 🔬 How It Works

### 1. 🧠 Computer Vision Pipeline
```
Satellite Images → Preprocessing → ResNet18 → Land Cover Classification
                                           ↓
                              Confidence Scores & Feature Maps
```

### 2. 🔍 Change Detection
```
Before Image + After Image → Confidence Comparison → Change Detection
                                                  ↓
                                        Impact Assessment
```

### 3. 🤖 AI Report Generation
```
Change Data → LangChain → Gemini AI → Environmental Report
                      ↓
              Past Analysis + Future Predictions + Action Plans
```

## 🎯 Use Cases

### 🌍 Environmental Monitoring
- **Deforestation Tracking**: Monitor forest loss over time
- **Urban Expansion**: Track city growth and its environmental impact  
- **Agricultural Changes**: Analyze farming pattern shifts
- **Water Body Monitoring**: Detect changes in lakes and rivers

### 🏛️ Policy & Planning
- **Government Agencies**: Evidence-based environmental policy
- **Urban Planners**: Sustainable development guidance
- **Conservation Groups**: Target areas for protection
- **Researchers**: Academic environmental studies

### 🏢 Business Applications
- **Real Estate**: Development impact assessment
- **Insurance**: Risk evaluation for properties
- **Agriculture**: Crop monitoring and planning
- **Environmental Consulting**: Client impact reports

## 🛠️ Customization

### 🎨 Modify Land Cover Classes
Edit the `CLASS_NAMES` list in `enhanced_app.py`:
```python
CLASS_NAMES = [
    'YourClass1', 'YourClass2', 'YourClass3'
    # Add your custom classes
]
```

### 🎯 Adjust AI Report Prompts
Modify the prompt template in `environmental_report_generator.py`:
```python
prompt_text = """Your custom environmental analysis prompt..."""
```

### ⚙️ Configure Analysis Parameters
Update settings in `.env` file:
```env
FUTURE_PREDICTION_YEARS=10
CHANGE_DETECTION_SENSITIVITY=0.2
LANGCHAIN_TEMPERATURE=0.8
```

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- 🎯 **Model Enhancement**: Better architectures, more training data
- 🌍 **Additional Land Cover Classes**: Expand classification categories  
- 🤖 **AI Report Improvements**: Enhanced prompts and analysis
- 📊 **Visualization Features**: New chart types and interactions
- 🔬 **Analysis Algorithms**: Advanced change detection methods

## 📄 License

This project is open source. Please respect the terms of use for:
- EuroSAT dataset
- Google Gemini API
- All included libraries and dependencies

## 🙏 Acknowledgments

- **EuroSAT Dataset**: For providing high-quality satellite imagery
- **Google Gemini**: For advanced AI capabilities via LangChain
- **PyTorch Community**: For deep learning framework
- **Streamlit**: For the amazing web framework

---

🌍 **SatelliteSight** - Empowering environmental monitoring through AI

*For a sustainable future, one satellite image at a time* 🛰️
# ML-MICRO
