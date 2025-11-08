from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
import numpy as np

# Handle both relative and absolute imports
try:
    from ..services.model_service import get_service
except ImportError:
    from services.model_service import get_service


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

router = APIRouter()

class ExportRequest(BaseModel):
    before_probs: List[float]
    after_probs: List[float]
    before_year: int
    after_year: int
    future_years: int = 5
    include_reports: bool = False
    report_detail: str = "Both"


@router.post("/export")
def export(payload: ExportRequest) -> Dict[str, Any]:
    svc = get_service()
    analysis = svc.analyze_pair(
        np.array(payload.before_probs),
        np.array(payload.after_probs),
        payload.before_year,
        payload.after_year,
        payload.future_years,
    )
    export_data = {
        'before_year': payload.before_year,
        'after_year': payload.after_year,
        **analysis,
    }
    if isinstance(export_data.get('change_info', {}).get('probability_difference'), np.ndarray):
        export_data['change_info']['probability_difference'] = export_data['change_info']['probability_difference'].tolist()
    if payload.include_reports:
        export_data['reports'] = svc.generate_reports(analysis, payload.report_detail, payload.future_years)
    return {"status": "success", "data": _json_safe(export_data)}
