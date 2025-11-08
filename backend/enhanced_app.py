import asyncio
import logging
from contextlib import asynccontextmanager
from typing import List, Optional

import redis.asyncio as redis
from fastapi import FastAPI, HTTPException, BackgroundTasks, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
import structlog

from .config import settings
from .database import init_db, close_db
from .cache import init_cache, close_cache
from .websocket_manager import WebSocketManager

# Configure structured logging
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.add_log_level,
        structlog.processors.JSONRenderer()
    ],
    wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
    logger_factory=structlog.WriteLoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Rate limiting
limiter = Limiter(key_func=get_remote_address)

# WebSocket manager
websocket_manager = WebSocketManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan events."""
    # Startup
    logger.info("Starting application...")
    await init_db()
    await init_cache()
    logger.info("Application started successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down application...")
    await close_db()
    await close_cache()
    logger.info("Application shutdown complete")

def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    
    app = FastAPI(
        title="Satellite Change Detection API",
        description="Advanced AI-powered satellite imagery analysis platform",
        version="2.0.0",
        docs_url="/api/docs" if settings.ENVIRONMENT != "production" else None,
        redoc_url="/api/redoc" if settings.ENVIRONMENT != "production" else None,
        lifespan=lifespan
    )

    # Add middleware
    app.add_middleware(GZipMiddleware, minimum_size=1000)
    app.add_middleware(SlowAPIMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Add rate limiting
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # Error handlers
    @app.exception_handler(Exception)
    async def global_exception_handler(request, exc):
        logger.error("Unhandled exception", exc_info=exc, path=request.url.path)
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
        )

    # Health check endpoint
    @app.get("/health")
    @limiter.limit("10/minute")
    async def health_check(request):
        """Health check endpoint for load balancers."""
        return {"status": "healthy", "version": "2.0.0"}

    # WebSocket endpoint for real-time updates
    @app.websocket("/ws/{client_id}")
    async def websocket_endpoint(websocket: WebSocket, client_id: str):
        await websocket_manager.connect(websocket, client_id)
        try:
            while True:
                data = await websocket.receive_text()
                # Handle WebSocket messages if needed
                await websocket_manager.send_personal_message(f"Echo: {data}", client_id)
        except WebSocketDisconnect:
            websocket_manager.disconnect(client_id)

    # Include routers
    from .routers import (
        upload_router,
        analyze_router,
        gradcam_router,
        predict_router,
        recommend_router,
        report_router,
        export_router,
        websocket_router,
        admin_router
    )

    app.include_router(upload_router, prefix="/api/v1", tags=["upload"])
    app.include_router(analyze_router, prefix="/api/v1", tags=["analysis"])
    app.include_router(gradcam_router, prefix="/api/v1", tags=["visualization"])
    app.include_router(predict_router, prefix="/api/v1", tags=["prediction"])
    app.include_router(recommend_router, prefix="/api/v1", tags=["recommendations"])
    app.include_router(report_router, prefix="/api/v1", tags=["reports"])
    app.include_router(export_router, prefix="/api/v1", tags=["export"])
    app.include_router(websocket_router, prefix="/api/v1", tags=["websocket"])
    
    if settings.ENVIRONMENT != "production":
        app.include_router(admin_router, prefix="/api/admin", tags=["admin"])

    return app

# Create the app instance
app = create_app()
