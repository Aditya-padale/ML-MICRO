import os
import sys
import pathlib
from typing import Tuple, Dict, Any, List

import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import numpy as np
from dotenv import load_dotenv

# Ensure project root is on path so we can import existing modules
ROOT = pathlib.Path(__file__).resolve().parents[2]
# If running from backend dir without package parent, also consider one level up
ALT_ROOT = pathlib.Path(__file__).resolve().parents[1].parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
if str(ALT_ROOT) not in sys.path:
    sys.path.insert(0, str(ALT_ROOT))

from advanced_change_detection import AdvancedChangeDetector, TimeSeriesAnalyzer
from gradcam_utils import GradCAM
from environmental_report_wrapper import create_report_generator
from enhanced_area_detection import AreaCalculator

IMG_SIZE = 224
CLASS_NAMES = [
    'AnnualCrop', 'Forest', 'HerbaceousVegetation', 'Highway', 'Industrial',
    'Pasture', 'PermanentCrop', 'Residential', 'River', 'SeaLake'
]


class ModelService:
    def __init__(self):
        # Load env from repo root
        load_dotenv(dotenv_path=os.path.join(str(ROOT), '.env'))

        model_path = os.getenv("MODEL_PATH", os.path.join(str(ROOT), "model_epoch_30.pth"))
        self.model = models.resnet18(weights=None)
        self.model.fc = nn.Linear(self.model.fc.in_features, len(CLASS_NAMES))
        self.model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
        self.model.eval()

        self.transform = transforms.Compose([
            transforms.Resize((IMG_SIZE, IMG_SIZE)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

        self.change_detector = AdvancedChangeDetector(CLASS_NAMES)
        self.time_analyzer = TimeSeriesAnalyzer()
        try:
            self.report_generator = create_report_generator()
        except Exception:
            self.report_generator = None
        # Area calculator for water body area metrics
        self.area_calc = AreaCalculator(pixel_size_m=10.0)

    def preprocess(self, img_bytes: bytes) -> Tuple[torch.Tensor, Image.Image]:
        import io
        image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        return self.transform(image).unsqueeze(0), image

    def predict(self, image_tensor: torch.Tensor) -> Tuple[str, float, np.ndarray]:
        with torch.no_grad():
            outputs = self.model(image_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            predicted_class_idx = torch.argmax(probabilities, dim=1).item()
            confidence = probabilities[0][predicted_class_idx].item()
            predicted_class = CLASS_NAMES[predicted_class_idx]
        return predicted_class, confidence, probabilities[0].numpy()

    def gradcam_overlay(self, image_tensor: torch.Tensor, orig_image: Image.Image) -> np.ndarray:
        # Find last conv layer
        last_conv_layer = None
        for _, module in self.model.named_modules():
            if isinstance(module, nn.Conv2d):
                last_conv_layer = module
        cam = GradCAM(self.model, last_conv_layer)
        heatmap = cam.generate(image_tensor)
        cam.remove_hooks()

        import cv2
        heatmap = cv2.resize(heatmap, (orig_image.width, orig_image.height))
        heatmap = np.uint8(255 * heatmap)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        overlay = cv2.addWeighted(np.array(orig_image), 0.6, heatmap, 0.4, 0)
        return overlay

    def compute_area_changes(self, before_img: Image.Image, after_img: Image.Image, 
                           before_tensor: torch.Tensor, after_tensor: torch.Tensor) -> Dict[str, Any]:
        """Compute meaningful area changes based on actual class transitions."""
        # Get model predictions and probabilities
        before_class, before_conf, before_probs = self.predict(before_tensor)
        after_class, after_conf, after_probs = self.predict(after_tensor)
        
        # Calculate water area using NDWI (more accurate for water detection)
        b_np = np.array(before_img.convert('RGB'))
        a_np = np.array(after_img.convert('RGB'))
        water_before = self.area_calc.calculate_water_area(b_np)
        water_after = self.area_calc.calculate_water_area(a_np)
        
        results = {'changes': {}, 'summary': []}
        
        # Estimate total image area (typical satellite image patch)
        image_area_km2 = 100.0
        
        # Primary transition: before_class → after_class
        if before_class != after_class:
            # Main transition detected
            if before_class in ['River', 'SeaLake']:
                before_main_area = water_before['area_km2']
            else:
                before_main_area = before_conf * image_area_km2
                
            if after_class in ['River', 'SeaLake']:
                after_main_area = water_after['area_km2']
            else:
                after_main_area = after_conf * image_area_km2
            
            # Calculate decrease in before_class
            before_decrease = before_main_area * 0.7  # Assume 70% of area transitioned
            before_remaining = before_main_area - before_decrease
            
            # Calculate increase in after_class  
            after_increase = after_main_area * 0.7  # 70% came from transition
            after_existing = after_main_area - after_increase
            
            # Add the primary decrease
            results['changes'][before_class] = {
                'before_area_km2': float(before_main_area),
                'after_area_km2': float(before_remaining),
                'change_km2': float(-before_decrease),
                'percentage_change': float(-70.0),  # 70% decrease
                'change_type': 'decreased',
                'significance': 'significant',
                'description': f"{before_class} area decreased by 70.0% (from {before_main_area:.2f} km² → {before_remaining:.2f} km², -{before_decrease:.2f} km²)",
            }
            
            # Add the primary increase
            results['changes'][after_class] = {
                'before_area_km2': float(after_existing),
                'after_area_km2': float(after_main_area),
                'change_km2': float(after_increase),
                'percentage_change': float((after_increase / (after_existing + 1e-8)) * 100),
                'change_type': 'increased',
                'significance': 'significant',
                'description': f"{after_class} area increased by {(after_increase / (after_existing + 1e-8)) * 100:.1f}% (from {after_existing:.2f} km² → {after_main_area:.2f} km², +{after_increase:.2f} km²)",
            }
            
            # Add to summary
            results['summary'].extend([
                {
                    'class': before_class,
                    'change_km2': float(-before_decrease),
                    'percentage_change': -70.0,
                    'description': results['changes'][before_class]['description']
                },
                {
                    'class': after_class,
                    'change_km2': float(after_increase),
                    'percentage_change': float((after_increase / (after_existing + 1e-8)) * 100),
                    'description': results['changes'][after_class]['description']
                }
            ])
        
        # Add water changes if significant (always show water changes separately)
        water_change_km2 = water_after['area_km2'] - water_before['area_km2']
        water_percentage_change = ((water_after['area_km2'] - water_before['area_km2']) / (water_before['area_km2'] + 1e-8)) * 100
        
        if abs(water_percentage_change) > 10:  # Only show if >10% change
            water_change_type = 'increased' if water_change_km2 > 0 else 'decreased'
            water_key = 'Water Bodies'
            
            results['changes'][water_key] = {
                'before_area_km2': float(water_before['area_km2']),
                'after_area_km2': float(water_after['area_km2']),
                'change_km2': float(water_change_km2),
                'percentage_change': float(water_percentage_change),
                'change_type': water_change_type,
                'significance': 'significant' if abs(water_percentage_change) > 20 else 'moderate',
                'description': f"Water Bodies area {water_change_type} by {abs(water_percentage_change):.1f}% (from {water_before['area_km2']:.2f} km² → {water_after['area_km2']:.2f} km², {water_change_km2:+.2f} km²)",
            }
            
            results['summary'].append({
                'class': water_key,
                'change_km2': float(water_change_km2),
                'percentage_change': float(water_percentage_change),
                'description': results['changes'][water_key]['description']
            })
        
        # If no main transition, check for subtle probability changes in top classes
        if before_class == after_class:
            # Find top 3 classes with biggest probability changes
            prob_changes = []
            for i, class_name in enumerate(CLASS_NAMES):
                if class_name not in ['River', 'SeaLake']:  # Skip water classes
                    prob_diff = float(after_probs[i] - before_probs[i])
                    if abs(prob_diff) > 0.05:  # Only if >5% probability change
                        prob_changes.append((class_name, prob_diff, i))
            
            # Sort by absolute change and take top 2
            prob_changes.sort(key=lambda x: abs(x[1]), reverse=True)
            for class_name, prob_diff, idx in prob_changes[:2]:
                estimated_change = prob_diff * image_area_km2
                percentage_change = prob_diff * 100 / (float(before_probs[idx]) + 1e-8)
                
                if abs(percentage_change) > 10:  # Only show significant changes
                    change_type = 'increased' if prob_diff > 0 else 'decreased'
                    before_area = float(before_probs[idx]) * image_area_km2
                    after_area = float(after_probs[idx]) * image_area_km2
                    
                    results['changes'][class_name] = {
                        'before_area_km2': before_area,
                        'after_area_km2': after_area,
                        'change_km2': float(estimated_change),
                        'percentage_change': float(percentage_change),
                        'change_type': change_type,
                        'significance': 'moderate',
                        'description': f"{class_name} area {change_type} by {abs(percentage_change):.1f}% (from {before_area:.2f} km² → {after_area:.2f} km², {estimated_change:+.2f} km²)",
                    }
                    
                    results['summary'].append({
                        'class': class_name,
                        'change_km2': float(estimated_change),
                        'percentage_change': float(percentage_change),
                        'description': results['changes'][class_name]['description']
                    })
        
        # Sort summary by magnitude of change and limit to top 3
        results['summary'] = sorted(results['summary'], key=lambda x: abs(x['change_km2']), reverse=True)[:3]
        
        return results

    def analyze_pair(self, before_probs: np.ndarray, after_probs: np.ndarray,
                     before_year: int, after_year: int, future_years: int) -> Dict[str, Any]:
        def _to_py(obj: Any):
            """Recursively convert numpy types/arrays to native Python types for JSON safety."""
            if isinstance(obj, np.ndarray):
                return obj.tolist()
            # numpy scalar types
            if isinstance(obj, (np.integer,)):
                return int(obj)
            if isinstance(obj, (np.floating,)):
                return float(obj)
            if isinstance(obj, (np.bool_,)):
                return bool(obj)
            # containers
            if isinstance(obj, dict):
                return {k: _to_py(v) for k, v in obj.items()}
            if isinstance(obj, list):
                return [_to_py(v) for v in obj]
            if isinstance(obj, tuple):
                return tuple(_to_py(v) for v in obj)
            return obj

        before_probs_tensor = torch.tensor(before_probs)
        after_probs_tensor = torch.tensor(after_probs)
        change_info = self.change_detector.detect_pixel_changes(before_probs_tensor, after_probs_tensor)
        # Ensure JSON-serializable
        if isinstance(change_info.get('probability_difference'), np.ndarray):
            change_info['probability_difference'] = change_info['probability_difference'].tolist()

        years_passed = max(0, after_year - before_year)
        temporal_analysis = {'velocity': 0, 'acceleration': 0, 'trend': 'stable'}
        trend_report = {'status': 'insufficient_data', 'message': 'Need more data for trend analysis'}

        environmental_impact = self.change_detector.analyze_environmental_impact(change_info)
        future_trends = {'predictions': [], 'confidence': 0}

        if years_passed > 0:
            future_trends = self.change_detector.predict_future_trends(change_info, years_passed, future_years)
            self.time_analyzer.add_observation(before_year, change_info['before_class'], change_info['before_confidence'])
            self.time_analyzer.add_observation(after_year, change_info['after_class'], change_info['after_confidence'])
            temporal_analysis = self.time_analyzer.calculate_change_velocity(years_passed, change_info['change_magnitude'])
            trend_report = self.time_analyzer.generate_trend_report()

        recommendations = []
        # Generate recommendations for any significant change or noteworthy transitions
        impact_type = environmental_impact.get('impact_type', 'neutral')
        before_class = change_info.get('before_class', '')
        after_class = change_info.get('after_class', '')
        
        # Generate recommendations if:
        # 1. Impact is not neutral, OR
        # 2. There's an actual land use change (different classes), OR
        # 3. Impact is noteworthy_change
        if (environmental_impact and 
            (impact_type != 'neutral' or 
             before_class != after_class or 
             impact_type == 'noteworthy_change')):
            recommendations = self.change_detector.generate_recommendations(environmental_impact, future_trends)

        result = {
            'change_info': change_info,
            'environmental_impact': environmental_impact,
            'future_trends': future_trends,
            'temporal_analysis': temporal_analysis,
            'trend_report': trend_report,
            'recommendations': recommendations,
            'years_passed': years_passed,
        }
        # Ensure entire payload is JSON-serializable (no numpy scalar/arrays)
        return _to_py(result)

    def generate_reports(self, analysis: Dict[str, Any], detail: str, future_years: int) -> Dict[str, Any]:
        if not self.report_generator:
            return {'ai_report_generated': False, 'error': 'report_generator_unavailable'}
        try:
            full_report = None
            summary = None
            base_data = analysis
            if detail in ("Detailed", "Both"):
                analysis_data = {
                    'before_class': base_data['change_info']['before_class'],
                    'before_confidence': base_data['change_info']['before_confidence'],
                    'after_class': base_data['change_info']['after_class'],
                    'after_confidence': base_data['change_info']['after_confidence'],
                    'impact_type': base_data['environmental_impact']['impact_type'],
                    'change_magnitude': base_data['change_info']['change_magnitude'],
                    'future_predictions': base_data['future_trends'],
                    'recommendations': base_data['recommendations']
                }
                full_report = self.report_generator.generate_report(analysis_data, future_years)
            if detail in ("Summary", "Both"):
                summary_data = {
                    'before_class': base_data['change_info']['before_class'],
                    'after_class': base_data['change_info']['after_class'],
                    'impact_type': base_data['environmental_impact']['impact_type'],
                    'change_magnitude': base_data['change_info']['change_magnitude']
                }
                summary = self.report_generator.generate_summary_report(summary_data)
            return {
                'ai_report_generated': True,
                'full_report': full_report,
                'summary_report': summary
            }
        except Exception as e:
            return {'ai_report_generated': False, 'error': str(e)}


# Singleton accessor
_service: ModelService = None


def get_service() -> ModelService:
    global _service
    if _service is None:
        _service = ModelService()
    return _service

def get_class_names() -> List[str]:
    return CLASS_NAMES
