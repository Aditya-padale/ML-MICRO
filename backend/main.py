from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Satellite Change Detection API is running."}

# Placeholder endpoint for image upload
@app.post("/upload")
def upload_images(before: UploadFile = File(...), after: UploadFile = File(...), before_year: int = Form(...), after_year: int = Form(...)):
    # TODO: Integrate with model and analysis code
    return {"status": "success", "before_filename": before.filename, "after_filename": after.filename, "before_year": before_year, "after_year": after_year}

# Add more endpoints for analysis, GradCAM, predictions, recommendations, and AI reports
