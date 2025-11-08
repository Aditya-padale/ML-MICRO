import streamlit as st
import torch
import torchvision.transforms as transforms
from torchvision import models
import torch.nn as nn
from PIL import Image
import numpy as np
import cv2
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
from gradcam_utils import GradCAM
from advanced_change_detection import AdvancedChangeDetector, TimeSeriesAnalyzer
from environmental_report_generator import create_report_generator
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Enhanced Config for Advanced Change Detection
MODEL_PATH = os.getenv("MODEL_PATH", "model_epoch_30.pth")
CLASS_NAMES = [
    'AnnualCrop', 'Forest', 'HerbaceousVegetation', 'Highway', 'Industrial',
    'Pasture', 'PermanentCrop', 'Residential', 'River', 'SeaLake'
]

CLASS_COLORS = {
    'AnnualCrop': '#32CD32', 'Forest': '#006400', 'HerbaceousVegetation': '#90EE90',
    'Highway': '#FF8C00', 'Industrial': '#FF0000', 'Pasture': '#FFD700',
    'PermanentCrop': '#8B4513', 'Residential': '#0000FF', 'River': '#87CEEB', 'SeaLake': '#000080'
}

IMG_SIZE = 224

# Initialize advanced components
change_detector = AdvancedChangeDetector(CLASS_NAMES)
time_analyzer = TimeSeriesAnalyzer()

# Initialize LangChain report generator
@st.cache_resource
def load_report_generator():
    """Load the environmental report generator"""
    try:
        return create_report_generator()
    except Exception as e:
        st.error(f"Failed to initialize AI report generator: {str(e)}")
        return None

report_generator = load_report_generator()

# Load Model
@st.cache_resource
def load_model():
    model = models.resnet18(weights=None)
    model.fc = nn.Linear(model.fc.in_features, len(CLASS_NAMES))
    model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
    model.eval()
    return model

model = load_model()

# Image Preprocessing
def preprocess_image(uploaded_file):
    image = Image.open(uploaded_file).convert("RGB")
    transform = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    return transform(image).unsqueeze(0), image

# Prediction
def predict_image(image_tensor):
    with torch.no_grad():
        outputs = model(image_tensor)
        probabilities = torch.softmax(outputs, dim=1)
        predicted_class_idx = torch.argmax(probabilities, dim=1).item()
        confidence = probabilities[0][predicted_class_idx].item()
        predicted_class = CLASS_NAMES[predicted_class_idx]
    return predicted_class, confidence, probabilities[0].numpy()

def create_comparison_chart(before_probs, after_probs):
    """Create comparison chart for before/after predictions"""
    
    df = pd.DataFrame({
        'Land Type': CLASS_NAMES,
        'Before': before_probs,
        'After': after_probs,
        'Change': after_probs - before_probs
    })
    
    fig = px.bar(
        df, 
        x='Land Type', 
        y=['Before', 'After'],
        title='Land Cover Comparison: Before vs After',
        labels={'value': 'Probability', 'variable': 'Time Period'},
        color_discrete_map={'Before': '#FF6B6B', 'After': '#4ECDC4'},
        barmode='group',
        height=500
    )
    
    return fig, df

def create_change_magnitude_chart(df):
    """Create change magnitude visualization"""
    
    # Filter significant changes
    significant_changes = df[abs(df['Change']) > 0.1]
    
    if len(significant_changes) == 0:
        return None
    
    fig = px.bar(
        significant_changes,
        x='Land Type',
        y='Change',
        color='Change',
        color_continuous_scale=['red', 'white', 'green'],
        color_continuous_midpoint=0,
        title='Significant Land Cover Changes'
    )
    
    fig.update_layout(height=400)
    return fig

def create_environmental_impact_gauge(impact_score):
    """Create environmental impact gauge"""
    
    # Normalize score to 0-100 scale
    normalized_score = (impact_score + 1) * 50  # Convert from [-1,1] to [0,100]
    
    fig = go.Figure(go.Indicator(
        mode = "gauge+number+delta",
        value = normalized_score,
        domain = {'x': [0, 1], 'y': [0, 1]},
        title = {'text': "Environmental Health Score"},
        delta = {'reference': 50},
        gauge = {
            'axis': {'range': [None, 100]},
            'bar': {'color': "darkblue"},
            'steps': [
                {'range': [0, 25], 'color': "red"},
                {'range': [25, 50], 'color': "orange"},
                {'range': [50, 75], 'color': "yellow"},
                {'range': [75, 100], 'color': "green"}
            ],
            'threshold': {
                'line': {'color': "black", 'width': 4},
                'value': 70, 'thickness': 0.75
            }
        }))
    
    fig.update_layout(height=400)
    return fig

def display_future_predictions(future_trends, prediction_years=5):
    """Display future trend predictions"""
    st.subheader(f"🔮 Future Predictions (Next {prediction_years} Years)")
    
    # Extract predictions from the future_trends dictionary
    predictions = future_trends.get('predictions', [])
    confidence = future_trends.get('confidence', 0)
    
    if not predictions:
        st.info("No significant future trends predicted based on current data.")
        return
    
    st.markdown(f"**Prediction Confidence:** {confidence:.1%}")
    st.markdown(f"**Prediction Horizon:** {prediction_years} years")
    
    for i, pred in enumerate(predictions[:5], 1):
        impact_icon = {
            'significant_improvement': '🌟',
            'minor_improvement': '✅',
            'stable': '➖',
            'minor_degradation': '⚠️',
            'significant_degradation': '🚨'
        }.get(pred['environmental_impact'], '❓')
        
        st.markdown(f"{i}. **{pred['land_type']}** {impact_icon} - {pred['probability']:.1%} probability")

# ---------- STREAMLIT UI ----------
st.set_page_config(page_title="🌍 Advanced Satellite Change Detection", layout="wide")

st.title("🛰️ Advanced Temporal Satellite Image Analysis")
st.markdown("## 🎯 Environmental Change Detection & Future Trend Prediction")

st.markdown("""
**Upload before/after satellite images to:**
- 🔍 Detect land use changes with AI precision
- 📊 Analyze environmental impacts
- 🔮 Predict future trends using advanced modeling
- 💡 Get actionable conservation recommendations
- 🤖 Generate AI-powered environmental reports
""")

# Sidebar for configuration
with st.sidebar:
    st.header("⚙️ Analysis Configuration")
    
    show_gradcam = st.checkbox("Show Grad-CAM Heatmaps", value=True)
    show_detailed_charts = st.checkbox("Show Detailed Visualizations", value=True)
    confidence_threshold = st.slider("Change Detection Sensitivity", 0.1, 0.9, 0.3)
    
    st.markdown("---")
    st.header("🔮 Future Prediction Settings")
    
    future_years = st.slider(
        "Prediction Horizon (Years)", 
        min_value=1, 
        max_value=20, 
        value=5, 
        help="Number of years into the future for trend predictions"
    )
    
    st.markdown("**💡 Prediction Horizon Guide:**")
    st.markdown("• **1-3 years**: Short-term trends")
    st.markdown("• **4-7 years**: Medium-term planning") 
    st.markdown("• **8-15 years**: Long-term forecasting")
    st.markdown("• **15+ years**: Strategic planning")
    
    st.info(f"🎯 Currently predicting trends for the next **{future_years} years**")
    
    st.markdown("---")
    st.header("🤖 AI Report Settings")
    
    # Check if API key is available
    api_key_status = "✅ Connected" if os.getenv('GOOGLE_API_KEY') else "❌ Not Configured"
    st.markdown(f"**Gemini API Status:** {api_key_status}")
    
    if not os.getenv('GOOGLE_API_KEY'):
        st.warning("⚠️ Add your Google API key to `.env` file to enable AI reports")
        st.code("GOOGLE_API_KEY=your_api_key_here")
    
    generate_ai_report = st.checkbox("Generate AI Environmental Report", value=True if os.getenv('GOOGLE_API_KEY') else False)
    report_detail_level = st.selectbox("Report Detail Level", ["Summary", "Detailed", "Both"], index=2)
    
    st.markdown("---")
    st.markdown("**💡 Quick Tips:**")
    st.markdown("• Upload clear satellite images")
    st.markdown("• Use images from same location")  
    st.markdown("• Higher sensitivity = more changes detected")
    st.markdown("• AI reports provide expert analysis")

# Main interface
col1, col2 = st.columns(2)

with col1:
    st.subheader("📅 Before Image")
    before_file = st.file_uploader("Upload BEFORE image", type=["jpg", "jpeg", "png"], key="before")
    before_year = st.number_input("Year of BEFORE image", min_value=1990, max_value=2025, value=2010)
    
    if before_file:
        st.image(before_file, caption=f'Before ({before_year})', use_container_width=True)

with col2:
    st.subheader("📅 After Image")
    after_file = st.file_uploader("Upload AFTER image", type=["jpg", "jpeg", "png"], key="after")
    after_year = st.number_input("Year of AFTER image", min_value=1990, max_value=2025, value=2020)
    
    if after_file:
        st.image(after_file, caption=f'After ({after_year})', use_container_width=True)

# Analysis Section
if before_file and after_file:
    st.markdown("---")
    
    # Add analyze button
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        analyze_button = st.button(
            "🔬 Start Analysis", 
            type="primary", 
            use_container_width=True,
            help="Click to begin the advanced change detection analysis"
        )
    
    if analyze_button:
        # Process images
        before_tensor, before_image = preprocess_image(before_file)
        after_tensor, after_image = preprocess_image(after_file)
        
        # Get predictions
        before_class, before_confidence, before_probs = predict_image(before_tensor)
        after_class, after_confidence, after_probs = predict_image(after_tensor)
        
        # Advanced Analysis
        with st.spinner("🔬 Performing advanced change detection analysis..."):
            years_passed = after_year - before_year
            # Use user-configured prediction horizon from sidebar
            
            # Create probability tensors from model predictions
            before_probs_tensor = torch.tensor(before_probs)
            after_probs_tensor = torch.tensor(after_probs)
            
            # Change detection analysis using pixel-level detection
            change_info = change_detector.detect_pixel_changes(before_probs_tensor, after_probs_tensor)
            
            # Initialize default temporal analysis
            temporal_analysis = {'velocity': 0, 'acceleration': 0, 'trend': 'stable'}
            trend_report = {'status': 'insufficient_data', 'message': 'Need more data for trend analysis'}
            
            if years_passed > 0:
                # Environmental impact analysis
                environmental_impact = change_detector.analyze_environmental_impact(change_info)
                future_trends = change_detector.predict_future_trends(change_info, years_passed, future_years)
                
                # Add to time series
                time_analyzer.add_observation(before_year, change_info['before_class'], change_info['before_confidence'])
                time_analyzer.add_observation(after_year, change_info['after_class'], change_info['after_confidence'])
                
                # Get temporal analysis
                temporal_analysis = time_analyzer.calculate_change_velocity(years_passed, change_info['change_magnitude'])
                trend_report = time_analyzer.generate_trend_report()
            else:
                # Handle case where years_passed is 0 or negative
                environmental_impact = change_detector.analyze_environmental_impact(change_info)
                future_trends = {'predictions': [], 'confidence': 0}
            
            # Display Results
            st.markdown("---")
            st.header("📊 Analysis Results")
        
        # Key metrics
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric(
                "🏞️ Before Classification",
                change_info['before_class'],
                f"{change_info['before_confidence']:.1%} confidence"
            )
        
        with col2:
            st.metric(
                "🏞️ After Classification", 
                change_info['after_class'],
                f"{change_info['after_confidence']:.1%} confidence"
            )
        
        with col3:
            st.metric(
                "📅 Time Period",
                f"{years_passed} years",
                f"Velocity: {temporal_analysis['velocity']:.3f}/year"
            )
        
        with col4:
            impact_score = environmental_impact['impact_score']
            impact_emoji = "🌟" if impact_score > 0.1 else "🚨" if impact_score < -0.1 else "➖"
            st.metric(
                "🌍 Environmental Impact",
                f"{impact_score:+.2f}",
                environmental_impact['impact_type']
            )
        
        # Change Detection Results
        if change_info['is_significant_change']:
            st.success(f"✅ **Significant Change Detected**: {change_info['before_class']} → {change_info['after_class']}")
        else:
            st.info(f"ℹ️ **Minor/No Change**: Classification remains similar between time periods")
        
        # Detailed visualizations
        if show_detailed_charts:
            st.markdown("---")
            st.subheader("📈 Detailed Analysis")
            
            # Create comparison chart
            comparison_fig, comparison_df = create_comparison_chart(before_probs, after_probs)
            st.plotly_chart(comparison_fig, use_container_width=True)
            
            # Show change magnitude chart if there are significant changes
            change_fig = create_change_magnitude_chart(comparison_df)
            if change_fig:
                st.plotly_chart(change_fig, use_container_width=True)
            
            # Environmental impact gauge
            if environmental_impact:
                impact_fig = create_environmental_impact_gauge(environmental_impact['impact_score'])
                st.plotly_chart(impact_fig, use_container_width=True)
        
        # Future Predictions
        if future_trends:
            st.markdown("---")
            display_future_predictions(future_trends, future_years)
        
        # Grad-CAM visualization
        if show_gradcam:
            st.markdown("---")
            st.subheader("🔍 Model Attention Analysis (Grad-CAM)")
            
            col1, col2 = st.columns(2)
            
            # Get the last convolutional layer
            last_conv_layer = None
            for name, module in model.named_modules():
                if isinstance(module, nn.Conv2d):
                    last_conv_layer = module
            
            with col1:
                st.markdown("**Before Image Attention**")
                cam_before = GradCAM(model, last_conv_layer)
                heatmap_before = cam_before.generate(before_tensor)
                
                # Create overlay
                heatmap_before = cv2.resize(heatmap_before, (before_image.width, before_image.height))
                heatmap_before = np.uint8(255 * heatmap_before)
                heatmap_before = cv2.applyColorMap(heatmap_before, cv2.COLORMAP_JET)
                before_np = np.array(before_image)
                overlay_before = cv2.addWeighted(before_np, 0.6, heatmap_before, 0.4, 0)
                
                st.image(overlay_before, caption='Model attention - Before')
                cam_before.remove_hooks()
            
            with col2:
                st.markdown("**After Image Attention**")
                cam_after = GradCAM(model, last_conv_layer)
                heatmap_after = cam_after.generate(after_tensor)
                
                # Create overlay
                heatmap_after = cv2.resize(heatmap_after, (after_image.width, after_image.height))
                heatmap_after = np.uint8(255 * heatmap_after)
                heatmap_after = cv2.applyColorMap(heatmap_after, cv2.COLORMAP_JET)
                after_np = np.array(after_image)
                overlay_after = cv2.addWeighted(after_np, 0.6, heatmap_after, 0.4, 0)
                
                st.image(overlay_after, caption='Model attention - After')
                cam_after.remove_hooks()
        
        # Recommendations
        recommendations = ["No specific recommendations - changes appear to be neutral or within normal variation"]  # Default for neutral changes
        if environmental_impact['impact_type'] != 'neutral':
            st.markdown("---")
            st.subheader("💡 Actionable Recommendations")
            
            recommendations = change_detector.generate_recommendations(environmental_impact, future_trends)
            
            # Categorize recommendations
            urgent_recs = [r for r in recommendations if '🚨' in r or 'URGENT' in r]
            preventive_recs = [r for r in recommendations if '🔮' in r or 'proactive' in r.lower()]
            general_recs = [r for r in recommendations if r not in urgent_recs and r not in preventive_recs]
            
            if urgent_recs:
                st.markdown("#### 🚨 Urgent Actions")
                for rec in urgent_recs:
                    st.markdown(f"- {rec}")
            
            if preventive_recs:
                st.markdown("#### 🔮 Preventive Measures")
                for rec in preventive_recs:
                    st.markdown(f"- {rec}")
            
            if general_recs:
                st.markdown("#### 📋 General Recommendations")
                for rec in general_recs[:5]:  # Limit to top 5
                    st.markdown(f"- {rec}")
        
        # ==========================================
        # NEW: AI-GENERATED ENVIRONMENTAL REPORT
        # ==========================================
        if generate_ai_report and report_generator:
            st.markdown("---")
            st.header("🤖 AI-Generated Environmental Report")
            
            # Create tabs based on user preference
            if report_detail_level == "Both":
                report_tab1, report_tab2 = st.tabs(["📋 Full Report", "⚡ Quick Summary"])
                
                with report_tab1:
                    st.markdown("### 📋 Comprehensive Environmental Analysis")
                    
                    with st.spinner("🧠 Generating detailed environmental report using AI..."):
                        # Prepare data for report generation
                        analysis_data = {
                            'before_class': change_info['before_class'],
                            'before_confidence': change_info['before_confidence'],
                            'after_class': change_info['after_class'], 
                            'after_confidence': change_info['after_confidence'],
                            'impact_type': environmental_impact['impact_type'],
                            'change_magnitude': change_info['change_magnitude'],
                            'future_predictions': future_trends,
                            'recommendations': recommendations
                        }
                        
                        # Generate full report using user-configured prediction horizon
                        full_report = report_generator.generate_report(analysis_data, future_years)
                        
                        # Display the generated report
                        st.markdown(full_report)
                
                with report_tab2:
                    st.markdown("### ⚡ Quick Environmental Summary")
                    
                    with st.spinner("🧠 Generating summary using AI..."):
                        # Generate summary report
                        summary_analysis_data = {
                            'before_class': change_info['before_class'],
                            'after_class': change_info['after_class'],
                            'impact_type': environmental_impact['impact_type'],
                            'change_magnitude': change_info['change_magnitude']
                        }
                        
                        summary_report = report_generator.generate_summary_report(summary_analysis_data)
                        
                        # Display summary in a nice format
                        st.info(summary_report)
                        
                        # Add some quick metrics
                        col1, col2, col3 = st.columns(3)
                        with col1:
                            urgency_level = "🚨 HIGH" if environmental_impact['impact_score'] < -0.5 else "⚠️ MEDIUM" if environmental_impact['impact_score'] < 0 else "✅ LOW"
                            st.metric("🎯 Urgency Level", urgency_level)
                        
                        with col2:
                            confidence_level = "High" if min(change_info['before_confidence'], change_info['after_confidence']) > 0.8 else "Medium" if min(change_info['before_confidence'], change_info['after_confidence']) > 0.6 else "Low"
                            st.metric("🎯 AI Confidence", confidence_level)
                        
                        with col3:
                            change_significance = "Major" if change_info['is_significant_change'] and years_passed > 5 else "Moderate" if change_info['is_significant_change'] else "Minor"
                            st.metric("📊 Change Scale", change_significance)
            
            elif report_detail_level == "Detailed":
                st.markdown("### 📋 Comprehensive Environmental Analysis")
                
                with st.spinner("🧠 Generating detailed environmental report using AI..."):
                    # Prepare data for report generation
                    analysis_data = {
                        'before_class': change_info['before_class'],
                        'before_confidence': change_info['before_confidence'],
                        'after_class': change_info['after_class'], 
                        'after_confidence': change_info['after_confidence'],
                        'impact_type': environmental_impact['impact_type'],
                        'change_magnitude': change_info['change_magnitude'],
                        'future_predictions': future_trends,
                        'recommendations': recommendations
                    }
                    
                    # Generate full report using user-configured prediction horizon
                    full_report = report_generator.generate_report(analysis_data, future_years)
                    
                    # Display the generated report
                    st.markdown(full_report)
            
            elif report_detail_level == "Summary":
                st.markdown("### ⚡ Quick Environmental Summary")
                
                with st.spinner("🧠 Generating summary using AI..."):
                    # Generate summary report
                    summary_analysis_data = {
                        'before_class': change_info['before_class'],
                        'after_class': change_info['after_class'],
                        'impact_type': environmental_impact['impact_type'],
                        'change_magnitude': change_info['change_magnitude']
                    }
                    
                    summary_report = report_generator.generate_summary_report(summary_analysis_data)
                    
                    # Display summary in a nice format
                    st.info(summary_report)
                    
                    # Add some quick metrics
                    col1, col2, col3 = st.columns(3)
                    with col1:
                        urgency_level = "🚨 HIGH" if environmental_impact['impact_score'] < -0.5 else "⚠️ MEDIUM" if environmental_impact['impact_score'] < 0 else "✅ LOW"
                        st.metric("🎯 Urgency Level", urgency_level)
                    
                    with col2:
                        confidence_level = "High" if min(change_info['before_confidence'], change_info['after_confidence']) > 0.8 else "Medium" if min(change_info['before_confidence'], change_info['after_confidence']) > 0.6 else "Low"
                        st.metric("🎯 AI Confidence", confidence_level)
                    
                    with col3:
                        change_significance = "Major" if change_info['is_significant_change'] and years_passed > 5 else "Moderate" if change_info['is_significant_change'] else "Minor"
                        st.metric("📊 Change Scale", change_significance)
        
        elif not generate_ai_report:
            pass  # User chose not to generate AI report
        else:
            st.error("❌ AI Report Generator not available. Please check your API configuration.")
            st.info("💡 **Tip**: Make sure your `.env` file contains a valid `GOOGLE_API_KEY`")
        
        # ==========================================
        # END: AI-GENERATED ENVIRONMENTAL REPORT
        # ==========================================
        
        # Export Data
        st.markdown("---")
        with st.expander("📊 Export Analysis Data"):
            # Prepare basic export data
            export_data = {
                'analysis_date': datetime.now().isoformat(),
                'before_year': before_year,
                'after_year': after_year,
                'change_detected': change_info,
                'environmental_impact': environmental_impact,
                'future_predictions': future_trends,
                'recommendations': recommendations,
                'temporal_analysis': temporal_analysis,
                'trend_report': trend_report
            }
            
            # Add AI-generated reports if available
            if generate_ai_report and report_generator:
                st.info("🤖 Including AI-generated environmental reports in export...")
                
                try:
                    # Prepare data for AI report generation
                    ai_analysis_data = {
                        'before_class': change_info['before_class'],
                        'before_confidence': change_info['before_confidence'],
                        'after_class': change_info['after_class'], 
                        'after_confidence': change_info['after_confidence'],
                        'impact_type': environmental_impact['impact_type'],
                        'change_magnitude': change_info['change_magnitude'],
                        'future_predictions': future_trends,
                        'recommendations': recommendations
                    }
                    
                    # Generate reports for export using user-configured prediction horizon
                    
                    if report_detail_level in ["Detailed", "Both"]:
                        ai_full_report = report_generator.generate_report(ai_analysis_data, future_years)
                        export_data['ai_detailed_report'] = ai_full_report
                    
                    if report_detail_level in ["Summary", "Both"]:
                        summary_data = {
                            'before_class': change_info['before_class'],
                            'after_class': change_info['after_class'],
                            'impact_type': environmental_impact['impact_type'],
                            'change_magnitude': change_info['change_magnitude']
                        }
                        ai_summary_report = report_generator.generate_summary_report(summary_data)
                        export_data['ai_summary_report'] = ai_summary_report
                    
                    export_data['ai_report_generated'] = True
                    
                except Exception as e:
                    st.warning(f"⚠️ Could not include AI reports in export: {str(e)}")
                    export_data['ai_report_generated'] = False
                    export_data['ai_report_error'] = str(e)
            else:
                export_data['ai_report_generated'] = False
            
            # Create downloadable content
            import json
            json_data = json.dumps(export_data, indent=2, default=str)
            
            col1, col2 = st.columns(2)
            
            with col1:
                st.download_button(
                    label="📥 Download Complete Analysis (JSON)",
                    data=json_data,
                    file_name=f"satellite_analysis_{before_year}_{after_year}.json",
                    mime="application/json"
                )
            
            with col2:
                # Create a simplified CSV for basic data
                basic_data = {
                    'Analysis Date': [datetime.now().strftime('%Y-%m-%d %H:%M:%S')],
                    'Before Year': [before_year],
                    'After Year': [after_year],
                    'Before Class': [change_info['before_class']],
                    'After Class': [change_info['after_class']],
                    'Change Detected': [change_info['is_significant_change']],
                    'Environmental Impact': [environmental_impact['impact_type']],
                    'Impact Score': [environmental_impact['impact_score']],
                    'Change Magnitude': [change_info['change_magnitude']],
                    'Years Analyzed': [years_passed],
                    'Change Velocity': [temporal_analysis['velocity']]
                }
                
                df_export = pd.DataFrame(basic_data)
                csv_data = df_export.to_csv(index=False)
                
                st.download_button(
                    label="📥 Download Summary (CSV)",
                    data=csv_data,
                    file_name=f"satellite_summary_{before_year}_{after_year}.csv",
                    mime="text/csv"
                )
    else:
        st.info("📋 Upload both images and click 'Start Analysis' to begin the change detection process.")

# Footer with methodology
st.markdown("---")
with st.expander("🔬 How Our Advanced Analysis Works"):
    st.markdown("""
    ### 🧠 AI-Powered Change Detection
    1. **Deep Learning Classification**: ResNet18 trained on EuroSAT dataset
    2. **Pixel-Level Analysis**: Confidence-based change detection
    3. **Environmental Scoring**: Weighted impact assessment system
    
    ### 🔮 Predictive Modeling
    1. **Markov Chain Analysis**: Statistical modeling of land use transitions
    2. **Temporal Velocity**: Rate of change calculations with decay factors
    3. **Trend Extrapolation**: Multi-year predictions with confidence intervals
    
    ### 💡 Recommendation Engine
    1. **Impact-Based Prioritization**: Urgent vs. preventive measures
    2. **Context-Aware Suggestions**: Tailored to specific change types
    3. **Actionable Interventions**: Science-backed conservation strategies
    
    ### 🤖 AI Environmental Reports (NEW!)
    1. **LangChain Integration**: Advanced natural language processing for environmental analysis
    2. **Gemini AI**: Google's powerful language model for detailed report generation
    3. **Expert-Level Analysis**: Comprehensive past analysis, future predictions, and action plans
    4. **Multi-Format Output**: Both detailed reports and quick summaries available
    
    ### 🔧 Technical Stack
    - **Computer Vision**: PyTorch, ResNet18, Grad-CAM
    - **Data Analysis**: Pandas, NumPy, SciPy, Scikit-learn
    - **Visualization**: Plotly, Matplotlib, Seaborn
    - **AI Integration**: LangChain, Google Generative AI (Gemini)
    - **Web Interface**: Streamlit
    """)

st.markdown("---")
st.markdown("*Powered by advanced AI and satellite image analysis | Environmental monitoring for a sustainable future* 🌍")

# Display configuration info
if st.checkbox("🔧 Show System Configuration", value=False):
    st.markdown("### 🔧 Current Configuration")
    config_info = {
        "Model Path": os.getenv("MODEL_PATH", "model_epoch_30.pth"),
        "Confidence Threshold": confidence_threshold,
        "Future Prediction Years": os.getenv('FUTURE_PREDICTION_YEARS', 5),
        "Gemini API Configured": "✅ Yes" if os.getenv('GOOGLE_API_KEY') else "❌ No",
        "LangChain Temperature": os.getenv('LANGCHAIN_TEMPERATURE', 0.7),
        "Max Tokens": os.getenv('LANGCHAIN_MAX_TOKENS', 2000),
        "Debug Mode": os.getenv('DEBUG_MODE', 'False')
    }
    
    for key, value in config_info.items():
        st.text(f"{key}: {value}")
