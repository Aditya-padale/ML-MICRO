#!/usr/bin/env python3
"""
Test Google Gemini API directly
"""

import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

def test_gemini_api():
    """Test Gemini API connection and basic functionality"""
    
    api_key = os.getenv('GOOGLE_API_KEY')
    print(f"API Key found: {api_key is not None}")
    print(f"API Key starts with: {api_key[:10] if api_key else 'None'}...")
    
    if not api_key:
        print("Error: GOOGLE_API_KEY not found")
        return
    
    try:
        # Configure Gemini API
        genai.configure(api_key=api_key)
        
        # Initialize model
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Test prompt
        test_prompt = """Generate 3 environmental recommendations for a land use change from Forest to Agricultural land:

1. 🚨 Urgent action needed
2. 🛡️ Preventive measure
3. 💡 General recommendation

Keep each recommendation to 1-2 sentences."""
        
        print("Testing Gemini API...")
        response = model.generate_content(test_prompt)
        
        print("✅ API Response received:")
        print(response.text)
        
        # Test the actual recommendation generation
        print("\n" + "="*50)
        print("Testing Environmental Report Generator...")
        
        from environmental_report_generator import create_report_generator
        
        generator = create_report_generator()
        
        test_analysis = {
            'before_class': 'Forest',
            'after_class': 'AnnualCrop',
            'impact_type': 'moderate_degradation',
            'change_magnitude': 0.7,
            'future_predictions': {
                'predictions': [
                    {'land_type': 'AnnualCrop', 'probability': 0.8},
                    {'land_type': 'Residential', 'probability': 0.15}
                ]
            }
        }
        
        recommendations = generator.generate_ai_recommendations(test_analysis)
        
        print(f"Generated recommendations: {len(recommendations)}")
        for i, rec in enumerate(recommendations, 1):
            print(f"{i}. {rec}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_gemini_api()
