from fastapi import FastAPI
import sys
import pathlib

# Add the backend directory to sys.path to handle imports correctly
backend_dir = pathlib.Path(__file__).parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

# Support running as package (backend.app) and as module in backend dir (app)
try:
    from .api.upload import router as upload_router
    from .api.analyze import router as analyze_router
    from .api.gradcam import router as gradcam_router
    from .api.predict import router as predict_router
    from .api.recommend import router as recommend_router
    from .api.report import router as report_router
    from .api.export import router as export_router
except ImportError:  # fallback when executed from backend directory
    from api.upload import router as upload_router
    from api.analyze import router as analyze_router
    from api.gradcam import router as gradcam_router
    from api.predict import router as predict_router
    from api.recommend import router as recommend_router
    from api.report import router as report_router
    from api.export import router as export_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(analyze_router)
app.include_router(gradcam_router)
app.include_router(predict_router)
app.include_router(recommend_router)
app.include_router(report_router)
app.include_router(export_router)

@app.get("/")
def root():
    return {"message": "Satellite Change Detection API is running."}

# If running directly: uvicorn backend.app:app --reload --port 8000
