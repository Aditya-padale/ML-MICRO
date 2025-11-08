# Backend (FastAPI)

## Setup

1. Create a virtual environment and install deps:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt -r requirements.txt
```

2. Set environment variables in `.env` at repo root (optional):

```
MODEL_PATH=model_epoch_30.pth
GOOGLE_API_KEY=your_key
```

3. Run the API:

```bash
uvicorn backend.app:app --reload --port 8000
```

## Endpoints
- POST /upload (multipart: before, after, before_year, after_year)
- POST /gradcam (multipart: before, after)
- POST /analyze (json: before_probs, after_probs, before_year, after_year, future_years)
- POST /predict (json)
- POST /recommend (json)
- POST /report (json: + detail)
- POST /export (json)
