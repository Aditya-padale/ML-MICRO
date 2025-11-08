from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import numpy as np

# Handle both relative and absolute imports
try:
    from ..services.model_service import get_service
except ImportError:
    from services.model_service import get_service

router = APIRouter()

class AnalyzeRequest(BaseModel):
    before_probs: List[float] = Field(..., description="Probabilities for before image across classes")
    after_probs: List[float] = Field(..., description="Probabilities for after image across classes")
    before_year: int
    after_year: int
    future_years: int = 5


@router.post("/analyze")
def analyze(payload: AnalyzeRequest) -> Dict[str, Any]:
    svc = get_service()
    result = svc.analyze_pair(
        np.array(payload.before_probs),
        np.array(payload.after_probs),
        payload.before_year,
        payload.after_year,
        payload.future_years,
    )
    # Ensure serializable
    if isinstance(result.get('change_info', {}).get('probability_difference'), np.ndarray):
        result['change_info']['probability_difference'] = result['change_info']['probability_difference'].tolist()
    return {"status": "success", "analysis": result}
