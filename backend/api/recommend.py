from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
import numpy as np

# Handle both relative and absolute imports
try:
    from ..services.model_service import get_service
except ImportError:
    from services.model_service import get_service

router = APIRouter()

class RecommendRequest(BaseModel):
    before_probs: List[float]
    after_probs: List[float]
    before_year: int
    after_year: int
    future_years: int = 5


@router.post("/recommend")
def recommend(payload: RecommendRequest) -> Dict[str, Any]:
    svc = get_service()
    analysis = svc.analyze_pair(
        np.array(payload.before_probs),
        np.array(payload.after_probs),
        payload.before_year,
        payload.after_year,
        payload.future_years,
    )
    # Defensive conversion
    def _json_safe(obj):
        import numpy as np
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        if isinstance(obj, (np.integer,)):
            return int(obj)
        if isinstance(obj, (np.floating,)):
            return float(obj)
        if isinstance(obj, (np.bool_,)):
            return bool(obj)
        if isinstance(obj, dict):
            return {k: _json_safe(v) for k, v in obj.items()}
        if isinstance(obj, list):
            return [_json_safe(v) for v in obj]
        if isinstance(obj, tuple):
            return tuple(_json_safe(v) for v in obj)
        return obj
    return {"status": "success", "recommendations": _json_safe(analysis['recommendations'])}
