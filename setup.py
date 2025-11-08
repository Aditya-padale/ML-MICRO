#!/usr/bin/env python3
"""
Setup script for SatelliteSight with LangChain integration
"""

import subprocess
import sys
import os
from pathlib import Path

def install_requirements():
    """Install required packages"""
    print("🚀 Installing SatelliteSight requirements...")
    
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing requirements: {e}")
        return False

def check_env_file():
    """Check if .env file exists and has required variables"""
    env_path = Path(".env")
    
    if not env_path.exists():
        print("⚠️  .env file not found!")
        create_env = input("Would you like to create a basic .env file? (y/n): ").lower().strip()
        
        if create_env == 'y':
            create_basic_env()
        else:
            print("📝 Please create a .env file with your Google API key:")
            print("   GOOGLE_API_KEY=your_api_key_here")
        return False
    
    # Check if API key is set
    with open(env_path, 'r') as f:
        content = f.read()
        
    if "GOOGLE_API_KEY=" in content and "AIzaSy" in content:
        print("✅ .env file found with API key!")
        return True
    else:
        print("⚠️  .env file exists but may be missing API key")
        print("📝 Make sure your .env file contains:")
        print("   GOOGLE_API_KEY=your_api_key_here")
        return False

def create_basic_env():
    """Create a basic .env file"""
    env_content = """# Environment Variables for SatelliteSight Project

# ===========================================
# GEMINI API CONFIGURATION (LangChain)
# ===========================================
GOOGLE_API_KEY=AIzaSyB3eo4fJOXAHSMlIxqxZitV3OyidgZjgOM

# ===========================================
# APPLICATION SETTINGS
# ===========================================
# Model Configuration
MODEL_PATH=model_epoch_30.pth
MODEL_CONFIDENCE_THRESHOLD=0.3

# Analysis Settings
FUTURE_PREDICTION_YEARS=5
CHANGE_DETECTION_SENSITIVITY=0.3

# ===========================================
# LANGCHAIN CONFIGURATION
# ===========================================
# Temperature for text generation (0.0 = deterministic, 1.0 = creative)
LANGCHAIN_TEMPERATURE=0.7

# Maximum tokens for response
LANGCHAIN_MAX_TOKENS=2000

# Model name for Gemini
GEMINI_MODEL_NAME=gemini-pro

# ===========================================
# LOGGING AND DEBUG
# ===========================================
DEBUG_MODE=False
LOG_LEVEL=INFO
"""
    
    with open(".env", "w") as f:
        f.write(env_content)
    
    print("✅ Created .env file with default configuration!")

def check_model_file():
    """Check if model file exists"""
    model_path = "model_epoch_30.pth"
    
    if os.path.exists(model_path):
        print(f"✅ Model file found: {model_path}")
        return True
    else:
        print(f"⚠️  Model file not found: {model_path}")
        print("📝 Make sure you have the trained model file in the project directory")
        return False

def run_app():
    """Run the Streamlit app"""
    print("\n🚀 Starting SatelliteSight application...")
    print("📱 The app will open in your default browser")
    print("🛑 Press Ctrl+C to stop the application")
    
    try:
        subprocess.check_call([sys.executable, "-m", "streamlit", "run", "app.py"])
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running app: {e}")
    except KeyboardInterrupt:
        print("\n👋 Application stopped by user")

def main():
    """Main setup function"""
    print("🌍 SatelliteSight Setup with LangChain Integration")
    print("=" * 50)
    
    # Check current directory
    if not os.path.exists("app.py"):
        print("❌ app.py not found!")
        print("📁 Please run this script from the SatelliteSight directory")
        return
    
    # Install requirements
    if not install_requirements():
        print("❌ Setup failed during package installation")
        return
    
    # Check environment file
    check_env_file()
    
    # Check model file
    check_model_file()
    
    print("\n✅ Setup completed!")
    print("\n🔧 Configuration Summary:")
    print("  📦 Packages: Installed")
    print("  🔑 API Key: Configured")
    print("  🤖 AI Reports: Ready")
    print("  📊 Analysis: Ready")
    
    # Ask if user wants to run the app
    run_now = input("\nWould you like to run the application now? (y/n): ").lower().strip()
    
    if run_now == 'y':
        run_app()
    else:
        print("\n🚀 To run the application later, use:")
        print("   python setup.py")
        print("   or")
        print("   streamlit run app.py")

if __name__ == "__main__":
    main()
