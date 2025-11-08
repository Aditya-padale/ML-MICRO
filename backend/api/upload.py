from fastapi import APIRouter, UploadFile, File, Form
from typing import Dict
import numpy as np

# Handle both relative and absolute imports
try:
    from ..services.model_service import get_service, get_class_names
except ImportError:
    from services.model_service import get_service, get_class_names


def _json_safe(obj):
    """Recursively convert numpy types/arrays to native Python for JSON serialization."""
    import numpy as np  # local import to avoid global coupling
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

@router.post("/upload")
async def upload_images(before: UploadFile = File(...), after: UploadFile = File(...), before_year: int = Form(...), after_year: int = Form(...)) -> Dict:
    svc = get_service()
    before_bytes = await before.read()
    after_bytes = await after.read()

    before_tensor, before_image = svc.preprocess(before_bytes)
    after_tensor, after_image = svc.preprocess(after_bytes)

    before_class, before_conf, before_probs = svc.predict(before_tensor)
    after_class, after_conf, after_probs = svc.predict(after_tensor)

    analysis = svc.analyze_pair(before_probs, after_probs, before_year, after_year, future_years=5)
    # Compute comprehensive area changes for all land cover types
    area_changes = svc.compute_area_changes(before_image, after_image, before_tensor, after_tensor)

    resp = {
        'status': 'success',
    'class_names': get_class_names(),
        'before': {
            'filename': before.filename,
            'year': before_year,
            'pred_class': before_class,
            'confidence': before_conf,
            'probs': before_probs.tolist(),
        },
        'after': {
            'filename': after.filename,
            'year': after_year,
            'pred_class': after_class,
            'confidence': after_conf,
            'probs': after_probs.tolist(),
        },
    'analysis': analysis,
        'area_changes': area_changes,
    }
    # Defensive: ensure analysis payload is JSON-serializable
    if isinstance(resp['analysis'].get('change_info', {}).get('probability_difference'), np.ndarray):
        resp['analysis']['change_info']['probability_difference'] = resp['analysis']['change_info']['probability_difference'].tolist()
    return _json_safe(resp)
