from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
import numpy as np
import os

# Handle both relative and absolute imports
try:
    from ..services.model_service import get_service
except ImportError:
    from services.model_service import get_service

router = APIRouter()

class ReportRequest(BaseModel):
    before_probs: List[float]
    after_probs: List[float]
    before_year: int
    after_year: int
    future_years: int = 5
    detail: str = "Both"  # Summary | Detailed | Both


@router.post("/report")
def report(payload: ReportRequest) -> Dict[str, Any]:
    svc = get_service()
    analysis = svc.analyze_pair(
        np.array(payload.before_probs),
        np.array(payload.after_probs),
        payload.before_year,
        payload.after_year,
        payload.future_years,
    )
    reports = svc.generate_reports(analysis, payload.detail, payload.future_years)
    return {"status": "success", **reports}


@router.get("/report/status")
def report_status() -> Dict[str, Any]:
    """Health/status for report generation capability (no secrets exposed)."""
    svc = get_service()
    return {
        "status": "success",
        "ai_report_available": bool(getattr(svc, "report_generator", None)),
        "gemini_model": os.getenv("GEMINI_MODEL_NAME", "gemini-1.5-flash"),
        "has_api_key": bool(os.getenv("GOOGLE_API_KEY")),
    }
