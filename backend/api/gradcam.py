from fastapi import APIRouter, UploadFile, File
from typing import Dict
import base64
import io
from PIL import Image

# Handle both relative and absolute imports
try:
    from ..services.model_service import get_service
except ImportError:
    from services.model_service import get_service

router = APIRouter()

@router.post("/gradcam")
async def gradcam(before: UploadFile = File(...), after: UploadFile = File(...)) -> Dict:
    svc = get_service()
    before_bytes = await before.read()
    after_bytes = await after.read()

    bt, bi = svc.preprocess(before_bytes)
    at, ai = svc.preprocess(after_bytes)

    before_overlay = svc.gradcam_overlay(bt, bi)
    after_overlay = svc.gradcam_overlay(at, ai)

    # Encode to base64 PNG
    def to_b64(img_arr):
        image = Image.fromarray(img_arr.astype('uint8'))
        buf = io.BytesIO()
        image.save(buf, format='PNG')
        return base64.b64encode(buf.getvalue()).decode('utf-8')

    return {
        'status': 'success',
        'before_overlay_png_b64': to_b64(before_overlay),
        'after_overlay_png_b64': to_b64(after_overlay),
    }
