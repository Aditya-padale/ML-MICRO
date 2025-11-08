"""
Test script to verify LangChain + Gemini API integration
"""

import os
from dotenv import load_dotenv

def test_api_connection():
    """Test the Gemini API connection"""
    
    # Load environment variables
    load_dotenv()
    
    api_key = os.getenv('GOOGLE_API_KEY')
    
    if not api_key:
        print("❌ GOOGLE_API_KEY not found in environment variables")
        return False
    
    if len(api_key) < 30:
        print("⚠️  API key seems too short, please verify")
        return False
    
    try:
        from environmental_report_generator import create_report_generator
        
        print("🔍 Creating report generator...")
        report_generator = create_report_generator()
        
        print("🧪 Testing with sample data...")
        
        # Test data
        test_data = {
            'before_class': 'Forest',
            'before_confidence': 0.95,
            'after_class': 'Industrial',
            'after_confidence': 0.88,
            'impact_type': 'significant_degradation',
            'change_magnitude': 'major',
            'future_predictions': [
                {'land_type': 'Industrial', 'probability': 0.8, 'environmental_impact': 'negative'},
                {'land_type': 'Residential', 'probability': 0.15, 'environmental_impact': 'negative'}
            ],
            'recommendations': [
                'Implement strict environmental regulations',
                'Consider reforestation initiatives',
                'Monitor air quality closely'
            ]
        }
        
        # Test summary report
        summary = report_generator.generate_summary_report(test_data)
        
        if summary and "Error" not in summary:
            print("✅ API connection successful!")
            print(f"📋 Sample summary: {summary[:100]}...")
            return True
        else:
            print(f"❌ API test failed: {summary}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing API: {str(e)}")
        return False

def main():
    """Main test function"""
    print("🤖 Testing LangChain + Gemini API Integration")
    print("=" * 50)
    
    # Test API connection
    if test_api_connection():
        print("\n🎉 All tests passed!")
        print("🚀 Your SatelliteSight application is ready to use!")
        print("\n💡 To run the app:")
        print("   streamlit run app.py")
    else:
        print("\n⚠️  Setup incomplete. Please check:")
        print("   1. Your .env file exists")
        print("   2. GOOGLE_API_KEY is correctly set")
        print("   3. Your API key has Gemini access enabled")

if __name__ == "__main__":
    main()
