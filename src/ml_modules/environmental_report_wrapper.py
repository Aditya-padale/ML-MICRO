"""
Wrapper for environmental report generator to handle import issues gracefully
"""

import os
from typing import Dict, List, Any, Optional

def create_report_generator():
    """Create a report generator, falling back to mock if imports fail"""
    try:
        from .environmental_report_generator import EnvironmentalReportGenerator
        return EnvironmentalReportGenerator()
    except (ImportError, ValueError, Exception) as e:
        print(f"Warning: Could not initialize EnvironmentalReportGenerator due to: {e}")
        print("Using mock report generator instead")
        return MockReportGenerator()

class MockReportGenerator:
    """Mock report generator when langchain imports fail"""
    
    def __init__(self):
        self.api_key = os.getenv('GOOGLE_API_KEY', 'mock_key')
    
    def generate_environmental_report(self, predictions: List[Dict[str, Any]], 
                                    change_analysis: Optional[Dict] = None) -> Dict[str, Any]:
        """Generate a mock environmental report"""
        
        # Basic analysis from predictions
        land_use_summary = {}
        for pred in predictions:
            land_type = pred.get('prediction', 'Unknown')
            confidence = pred.get('confidence', 0.0)
            land_use_summary[land_type] = land_use_summary.get(land_type, 0) + confidence
        
        # Create basic report
        report = {
            'executive_summary': 'Environmental analysis completed. LangChain integration temporarily unavailable.',
            'land_use_distribution': land_use_summary,
            'environmental_impact': {
                'biodiversity_score': 7.5,
                'sustainability_rating': 'Moderate',
                'key_concerns': ['Land use diversity', 'Urban expansion impact']
            },
            'recommendations': [
                'Monitor forest coverage changes over time',
                'Assess impact of residential/industrial development',
                'Consider conservation efforts for natural areas'
            ],
            'detailed_analysis': {
                'forest_health': 'Assessment pending - requires full LangChain integration',
                'urban_expansion': 'Basic analysis shows mixed land use patterns',
                'agricultural_sustainability': 'Requires detailed temporal analysis'
            },
            'metadata': {
                'generated_by': 'Mock Environmental Report Generator',
                'timestamp': None,
                'langchain_status': 'unavailable'
            }
        }
        
        return report
    
    def generate_change_analysis_report(self, change_data: Dict) -> Dict[str, Any]:
        """Generate a mock change analysis report"""
        return {
            'change_summary': 'Change analysis completed with basic metrics',
            'significant_changes': change_data.get('changes', []),
            'trend_analysis': 'Temporal analysis requires full LangChain integration',
            'impact_assessment': 'Basic change detection completed',
            'recommendations': ['Monitor detected changes', 'Investigate significant alterations'],
            'metadata': {
                'generated_by': 'Mock Change Analysis Generator',
                'langchain_status': 'unavailable'
            }
        }
