#!/usr/bin/env python3
"""
Test script to check API recommendations response
"""

import requests
import json
from pathlib import Path

def test_upload_api():
    """Test the upload API endpoint with sample images"""
    
    # Use sample images from the dataset
    base_path = Path("/home/adityalp/Documents/ML/Euro/EuroSAT_RGB")
    
    # Find sample images
    forest_imgs = list((base_path / "Forest").glob("*.jpg"))
    annual_crop_imgs = list((base_path / "AnnualCrop").glob("*.jpg"))
    
    if len(forest_imgs) == 0 or len(annual_crop_imgs) == 0:
        print("Error: Could not find sample images")
        return
    
    before_img = forest_imgs[0]
    after_img = annual_crop_imgs[0]
    
    print(f"Testing with:")
    print(f"Before: {before_img}")
    print(f"After: {after_img}")
    
    # Prepare the request
    url = "http://localhost:8001/upload"
    
    with open(before_img, 'rb') as bf, open(after_img, 'rb') as af:
        files = {
            'before': ('before.jpg', bf, 'image/jpeg'),
            'after': ('after.jpg', af, 'image/jpeg')
        }
        data = {
            'before_year': 2015,
            'after_year': 2020
        }
        
        print("\nMaking API request...")
        response = requests.post(url, files=files, data=data)
        
        if response.status_code == 200:
            result = response.json()
            
            print("\n=== API Response Structure ===")
            print(f"Status: {result.get('status')}")
            print(f"Before class: {result['before']['pred_class']}")
            print(f"After class: {result['after']['pred_class']}")
            
            print("\n=== Analysis Structure ===")
            analysis = result.get('analysis', {})
            print(f"Analysis keys: {list(analysis.keys())}")
            
            print("\n=== Recommendations ===")
            recommendations = analysis.get('recommendations', [])
            print(f"Type: {type(recommendations)}")
            print(f"Length: {len(recommendations)}")
            print("Content:")
            for i, rec in enumerate(recommendations):
                print(f"  {i+1}. {rec}")
            
            print("\n=== Future Trends ===")
            future_trends = analysis.get('future_trends', {})
            print(f"Future trends keys: {list(future_trends.keys())}")
            print(f"Confidence: {future_trends.get('confidence', 'N/A')}")
            predictions = future_trends.get('predictions', [])
            print(f"Predictions count: {len(predictions)}")
            for i, pred in enumerate(predictions[:3]):
                print(f"  {i+1}. {pred.get('land_type')} - {pred.get('probability', 0):.2%}")
            
            print("\n=== Full JSON Response ===")
            print(json.dumps(result, indent=2)[:2000] + "..." if len(json.dumps(result, indent=2)) > 2000 else json.dumps(result, indent=2))
            
        else:
            print(f"Error: HTTP {response.status_code}")
            print(response.text)

if __name__ == "__main__":
    test_upload_api()
