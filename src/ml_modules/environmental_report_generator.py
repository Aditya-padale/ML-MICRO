"""
Environmental Report Generator using LangChain and Gemini API
"""

import os
from typing import Dict, List, Any
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

class EnvironmentalReportGenerator:
    """Generate detailed environmental reports using Google Generative AI"""
    
    def __init__(self):
        """Initialize the report generator with Gemini API"""
        self.api_key = os.getenv('GOOGLE_API_KEY')
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        
        # Configure Gemini API
        genai.configure(api_key=self.api_key)
        
        # Initialize Gemini model
        self.model_name = os.getenv('GEMINI_MODEL_NAME', 'gemini-2.5-flash')
        self.model = genai.GenerativeModel(self.model_name)
        
        # Configuration
        self.generation_config = genai.types.GenerationConfig(
            temperature=float(os.getenv('LANGCHAIN_TEMPERATURE', 0.7)),
            max_output_tokens=int(os.getenv('LANGCHAIN_MAX_TOKENS', 2000))
        )
    
    def _create_detailed_prompt(self, before_class: str, before_confidence: float, 
                               after_class: str, after_confidence: float,
                               impact_type: str, change_magnitude: str,
                               future_predictions: str, recommendations: str,
                               future_years: int) -> str:
        """Create the prompt template for environmental analysis"""
        
        prompt_text = """You are an expert environmental analyst specializing in satellite-based land use monitoring.  
I will give you AI-detected satellite land change data with PRECISE AREA MEASUREMENTS.  

Your task is to write a **detailed environmental report** that covers:

1. **Past Analysis** – Explain what happened between the BEFORE and AFTER images, based on detected land use changes with exact area measurements. Include ecological and human activity explanations.
2. **Future Prediction** – Based on the probabilities of future land cover, describe what is most likely to happen in the next {future_years} years. Explain risks and opportunities.
3. **Action Plan** – Give a step-by-step plan on how to stop or reduce negative impacts (deforestation, urbanization, etc.) and how to strengthen positive trends. Provide solutions that governments, communities, and industries can apply.

Here is the structured data from AI detection with PRECISE MEASUREMENTS:

**WATER BODY CHANGES:**
{water_changes}

**LAND USE AREA CHANGES:**
{area_changes}

**CLASSIFICATION RESULTS:**
- Before Class: {before_class} ({before_confidence:.1%} confidence)
- After Class: {after_class} ({after_confidence:.1%} confidence)
- Detected Change: {before_class} → {after_class}
- Environmental Impact: {impact_type}
- Change Magnitude: {change_magnitude}

**PREDICTIONS & RECOMMENDATIONS:**
- Future Predictions: {future_predictions}
- Recommendations: {recommendations}

⚠️ Be clear, scientific, and specific, but explain in simple language so even non-experts can understand.  
Use bullet points, sections, and emphasize critical points with urgency where needed.

Format your response in the following structure:

## 🔍 PAST ANALYSIS: What Happened?

[Detailed analysis of the detected changes]

## 🔮 FUTURE PREDICTION: Next {future_years} Years

[Predictions based on current trends and data]

## 📋 ACTION PLAN: Steps to Take

### 🚨 Immediate Actions (0-6 months)
[Urgent steps needed]

### 📅 Short-term Actions (6 months - 2 years)
[Important medium-term steps]

### 🎯 Long-term Strategy (2+ years)
[Sustainable long-term solutions]

## 💡 IMPLEMENTATION RECOMMENDATIONS

### For Government Bodies:
[Government-specific actions]

### For Local Communities:
[Community-based solutions]

### For Industries/Businesses:
[Private sector recommendations]

## ⚠️ RISK ASSESSMENT & MONITORING

[Key risks to monitor and early warning indicators]
"""
        
        return f"""You are an expert environmental analyst.  
I will give you AI-detected satellite land change data.  

Your task is to write a **detailed environmental report** that covers:

1. **Past Analysis** – Explain what happened between the BEFORE and AFTER images, based on detected land use changes. Include ecological and human activity explanations.
2. **Future Prediction** – Based on the probabilities of future land cover, describe what is most likely to happen in the next {future_years} years. Explain risks and opportunities.
3. **Action Plan** – Give a step-by-step plan on how to stop or reduce negative impacts (deforestation, urbanization, etc.) and how to strengthen positive trends. Provide solutions that governments, communities, and industries can apply.

Here is the structured data from AI detection:
- Before Class: {before_class} ({before_confidence:.1%} confidence)
- After Class: {after_class} ({after_confidence:.1%} confidence)
- Detected Change: {before_class} → {after_class}
- Environmental Impact: {impact_type}
- Change Magnitude: {change_magnitude}
- Future Predictions: {future_predictions}
- Recommendations: {recommendations}

⚠️ Be clear, scientific, and specific, but explain in simple language so even non-experts can understand.  
Use bullet points, sections, and emphasize critical points with urgency where needed.

Format your response in the following structure:

## 🔍 PAST ANALYSIS: What Happened?

[Detailed analysis of the detected changes]

## 🔮 FUTURE PREDICTION: Next {future_years} Years

[Predictions based on current trends and data]

## 📋 ACTION PLAN: Steps to Take

### 🚨 Immediate Actions (0-6 months)
[Urgent steps needed]

### 📅 Short-term Actions (6 months - 2 years)
[Important medium-term steps]

### 🎯 Long-term Strategy (2+ years)
[Sustainable long-term solutions]

## 💡 IMPLEMENTATION RECOMMENDATIONS

### For Government Bodies:
[Government-specific actions]

### For Local Communities:
[Community-based solutions]

### For Industries/Businesses:
[Private sector recommendations]

## ⚠️ RISK ASSESSMENT & MONITORING

[Key risks to monitor and early warning indicators]
"""
    
    def generate_report(self, analysis_data: Dict[str, Any], future_years: int = 5) -> str:
        """
        Generate a comprehensive environmental report
        
        Args:
            analysis_data: Dictionary containing analysis results
            future_years: Number of years for future predictions
            
        Returns:
            Generated environmental report
        """
        try:
            # Extract data from analysis
            before_class = analysis_data.get('before_class', 'Unknown')
            before_confidence = analysis_data.get('before_confidence', 0.0)
            after_class = analysis_data.get('after_class', 'Unknown')
            after_confidence = analysis_data.get('after_confidence', 0.0)
            impact_type = analysis_data.get('impact_type', 'neutral')
            change_magnitude = analysis_data.get('change_magnitude', 'moderate')
            
            # Format future predictions
            future_predictions_data = analysis_data.get('future_predictions', {})
            if isinstance(future_predictions_data, dict):
                future_predictions = self._format_future_predictions(
                    future_predictions_data.get('predictions', [])
                )
            else:
                future_predictions = self._format_future_predictions(future_predictions_data)
            
            # Format recommendations
            recommendations = self._format_recommendations(
                analysis_data.get('recommendations', [])
            )
            
            # Create the detailed prompt
            prompt = self._create_detailed_prompt(
                before_class, before_confidence, after_class, after_confidence,
                impact_type, change_magnitude, future_predictions, 
                recommendations, future_years
            )
            
            # Generate the report using Gemini API
            response = self.model.generate_content(
                prompt,
                generation_config=self.generation_config
            )
            
            return response.text
            
        except Exception as e:
            return f"Error generating report: {str(e)}"
    
    def _format_future_predictions(self, predictions: List[Dict]) -> str:
        """Format future predictions for the prompt"""
        if not predictions:
            return "No specific predictions available"
        
        formatted = []
        for pred in predictions[:5]:  # Top 5 predictions
            land_type = pred.get('land_type', 'Unknown')
            probability = pred.get('probability', 0.0)
            impact = pred.get('environmental_impact', 'neutral')
            formatted.append(f"• {land_type}: {probability:.1%} probability ({impact} impact)")
        
        return "\n".join(formatted)
    
    def _format_water_changes(self, water_data: Dict) -> str:
        """Format water change data for the prompt"""
        if not water_data:
            return "No water body changes detected"
        
        if water_data.get('change_type') == 'stable':
            return f"Water bodies remain stable at {water_data.get('before_area_km2', 0):.2f} km²"
        
        before_area = water_data.get('before_area_km2', 0)
        after_area = water_data.get('after_area_km2', 0)
        change_km2 = water_data.get('change_km2', 0)
        change_percent = water_data.get('percentage_change', 0)
        change_type = water_data.get('change_type', 'changed')
        
        return f"Water area {change_type} by {abs(change_percent):.1f}% (from {before_area:.2f} km² → {after_area:.2f} km², change of {change_km2:+.2f} km²)"

    def _format_area_changes(self, area_data: Dict) -> str:
        """Format land use area changes for the prompt"""
        if not area_data:
            return "No significant land use area changes detected"
        
        significant_changes = []
        for class_name, change_info in area_data.items():
            significance = change_info.get('significance', 'minimal')
            if significance != 'minimal':
                before_area = change_info.get('before_area_km2', 0)
                after_area = change_info.get('after_area_km2', 0)
                change_km2 = change_info.get('change_km2', 0)
                change_percent = change_info.get('percentage_change', 0)
                change_type = change_info.get('change_type', 'changed')
                
                change_desc = f"{class_name}: {change_type} by {abs(change_percent):.1f}% (from {before_area:.2f} km² → {after_area:.2f} km², {significance} change of {change_km2:+.2f} km²)"
                significant_changes.append(change_desc)
        
        return "\n".join(significant_changes) if significant_changes else "No significant land use area changes detected"

    def _format_recommendations(self, recommendations: List[str]) -> str:
        """Format recommendations for the prompt"""
        if not recommendations:
            return "No specific recommendations available"
        
        return "\n".join([f"• {rec}" for rec in recommendations[:10]])  # Top 10 recommendations
    
    def generate_ai_recommendations(self, analysis_data: Dict[str, Any]) -> List[str]:
        """
        Generate AI-powered actionable recommendations using Gemini API
        
        Args:
            analysis_data: Dictionary containing analysis results
            
        Returns:
            List of AI-generated actionable recommendations
        """
        try:
            before_class = analysis_data.get('before_class', 'Unknown')
            after_class = analysis_data.get('after_class', 'Unknown')
            impact_type = analysis_data.get('impact_type', 'neutral')
            change_magnitude = analysis_data.get('change_magnitude', 'moderate')
            future_predictions = analysis_data.get('future_predictions', {})
            
            # Format future predictions for context
            future_context = ""
            if isinstance(future_predictions, dict) and future_predictions.get('predictions'):
                pred_list = []
                for pred in future_predictions['predictions'][:3]:
                    land_type = pred.get('land_type', 'Unknown')
                    probability = pred.get('probability', 0.0)
                    pred_list.append(f"{land_type} ({probability:.1%})")
                future_context = f"Future predictions: {', '.join(pred_list)}"
            
            prompt = f"""You are an expert environmental consultant providing actionable recommendations for satellite-detected land use changes.

DETECTED CHANGE:
- Before: {before_class}
- After: {after_class}
- Environmental Impact: {impact_type}
- Change Magnitude: {change_magnitude}
- {future_context}

Generate EXACTLY 8-12 specific, actionable recommendations in the following categories:

URGENT ACTIONS (2-3 items - use 🚨 emoji):
- Immediate steps needed within 0-6 months
- Critical interventions to prevent further damage

PREVENTIVE MEASURES (2-3 items - use 🛡️ emoji):
- Proactive steps for 6 months to 2 years
- Strategies to prevent future problems

GENERAL RECOMMENDATIONS (3-6 items - use 💡 emoji):
- Long-term sustainable solutions
- Monitoring and policy recommendations

REQUIREMENTS:
- Each recommendation must be specific and actionable
- Include responsible parties (government, communities, industries)
- Use appropriate severity emojis (🚨 for urgent, 🛡️ for preventive, 💡 for general)
- Keep each recommendation to 1-2 sentences maximum
- Focus on practical, implementable solutions

Format as a simple list, one recommendation per line."""

            response = self.model.generate_content(
                prompt,
                generation_config=self.generation_config
            )
            
            # Parse the response into a list
            ai_recommendations = []
            if response.text:
                lines = response.text.strip().split('\n')
                for line in lines:
                    line = line.strip()
                    # Skip empty lines, headers, and category titles
                    if (line and 
                        not line.startswith('#') and 
                        not line.startswith('**') and
                        not line.upper().startswith('URGENT') and
                        not line.upper().startswith('PREVENTIVE') and
                        not line.upper().startswith('GENERAL') and
                        not line.upper().startswith('REQUIREMENTS') and
                        ('🚨' in line or '🛡️' in line or '💡' in line or 
                         line.startswith('-') or line.startswith('•'))):
                        
                        # Clean up the line
                        clean_line = line.lstrip('- •').strip()
                        if clean_line:
                            ai_recommendations.append(clean_line)
            
            # Fallback to basic recommendations if AI generation fails
            if not ai_recommendations:
                ai_recommendations = self._generate_fallback_recommendations(
                    before_class, after_class, impact_type
                )
            
            return ai_recommendations[:12]  # Limit to 12 recommendations
            
        except Exception as e:
            print(f"Error generating AI recommendations: {str(e)}")
            # Return fallback recommendations
            return self._generate_fallback_recommendations(
                analysis_data.get('before_class', 'Unknown'),
                analysis_data.get('after_class', 'Unknown'),
                analysis_data.get('impact_type', 'neutral')
            )
    
    def _generate_fallback_recommendations(self, before_class: str, after_class: str, impact_type: str) -> List[str]:
        """Generate fallback recommendations if AI generation fails"""
        
        recommendations = []
        
        # Base recommendations by impact type
        if impact_type in ['severe_degradation', 'significant_degradation']:
            recommendations.extend([
                "🚨 Implement immediate conservation measures to halt further degradation",
                "🚨 Establish emergency protection zones in affected areas",
                "🛡️ Set up continuous monitoring systems for early detection"
            ])
        elif impact_type in ['moderate_degradation', 'minor_degradation']:
            recommendations.extend([
                "🛡️ Implement sustainable land management practices",
                "🛡️ Conduct regular environmental impact assessments",
                "💡 Develop long-term conservation strategies"
            ])
        else:
            recommendations.extend([
                "💡 Monitor area to maintain current environmental status",
                "💡 Share successful conservation practices with similar regions"
            ])
        
        # Specific transition recommendations
        if 'Forest' in before_class and 'Forest' not in after_class:
            recommendations.extend([
                "🚨 Halt deforestation activities immediately",
                "🛡️ Implement reforestation programs in suitable areas"
            ])
        
        if 'Industrial' in after_class or 'Highway' in after_class:
            recommendations.extend([
                "🛡️ Enforce strict environmental compliance standards",
                "💡 Promote green infrastructure development"
            ])
        
        return recommendations
    
    def generate_summary_report(self, analysis_data: Dict[str, Any]) -> str:
        """Generate a shorter summary report for quick insights"""
        
        before_class = analysis_data.get('before_class', 'Unknown')
        after_class = analysis_data.get('after_class', 'Unknown')
        impact_type = analysis_data.get('impact_type', 'neutral')
        change_magnitude = analysis_data.get('change_magnitude', 'moderate')
        
        prompt = f"""Generate a brief 3-sentence environmental summary:

Land change detected: {before_class} → {after_class}
Environmental impact: {impact_type}
Change magnitude: {change_magnitude}

Provide:
1. What changed and why it matters
2. The main environmental concern or benefit
3. One key action to take

Keep it under 100 words and use simple language."""
        
        try:
            response = self.model.generate_content(
                prompt,
                generation_config=self.generation_config
            )
            return response.text
        except Exception as e:
            return f"Error generating summary: {str(e)}"


# Utility function for easy import
def create_report_generator() -> EnvironmentalReportGenerator:
    """Factory function to create a report generator instance"""
    return EnvironmentalReportGenerator()
