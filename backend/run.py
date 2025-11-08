import sys
import pathlib
from uvicorn import run

if __name__ == "__main__":
    # Ensure repo root on sys.path so `backend.app` resolves regardless of CWD
    ROOT = pathlib.Path(__file__).resolve().parents[1]
    if str(ROOT) not in sys.path:
        sys.path.insert(0, str(ROOT))
    run("backend.app:app", host="0.0.0.0", port=8001, reload=True)
