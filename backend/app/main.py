import os
import time
import logging
from collections import defaultdict
from typing import Dict, List
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

from app.schemas import AnalyzeRequest, AnalyzeResponse, HealthResponse, SampleMessage
from app.ai_service import ai_service
from app.sample_data import SAMPLE_MESSAGES

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("scamshield.main")

app = FastAPI(
    title="ScamShield AI API",
    description="Cybersecurity assistant API for AI-powered scam and fraud detection in messages.",
    version="1.0.0"
)

# CORS configuration
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# In-Memory Rate Limiting: 30 requests / 60 seconds per IP
RATE_LIMIT_MAX_REQUESTS = int(os.getenv("RATE_LIMIT_MAX_REQUESTS", "30"))
RATE_LIMIT_WINDOW_SECONDS = int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "60"))
ip_request_history: Dict[str, List[float]] = defaultdict(list)

def check_rate_limit(client_ip: str) -> bool:
    current_time = time.time()
    history = ip_request_history[client_ip]
    # Prune timestamps outside current window
    ip_request_history[client_ip] = [ts for ts in history if current_time - ts < RATE_LIMIT_WINDOW_SECONDS]
    if len(ip_request_history[client_ip]) >= RATE_LIMIT_MAX_REQUESTS:
        return False
    ip_request_history[client_ip].append(current_time)
    return True

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    if request.url.path == "/api/analyze":
        client_ip = request.client.host if request.client else "unknown"
        if not check_rate_limit(client_ip):
            logger.warning("Rate limit exceeded for IP: %s", client_ip)
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "detail": "Rate limit exceeded. ScamShield AI allows up to 30 analysis requests per minute per user."
                }
            )
    response = await call_next(request)
    return response

@app.get("/")
def root():
    return {
        "app": "ScamShield AI",
        "tagline": "Think Before You Click.",
        "status": "online",
        "docs_url": "/docs"
    }

@app.get("/api/health", response_model=HealthResponse)
def get_health():
    """Returns backend service health, configured analysis method, and active model without exposing secrets."""
    mode, is_configured, provider, model = ai_service.get_status()
    return HealthResponse(
        status="healthy",
        analysis_mode=mode,
        provider_configured=is_configured,
        configured_provider=provider,
        model_name=model,
        version="1.0.0"
    )

@app.get("/api/samples", response_model=List[SampleMessage])
def get_samples():
    """Provides realistic sample messages across multiple fraud categories for demo purposes."""
    return SAMPLE_MESSAGES

@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_message(payload: AnalyzeRequest):
    """
    Analyzes untrusted user message for social engineering patterns, fraud indicators,
    and coercion tactics. Uses configurable AI with an intelligent rule-based fallback.
    """
    has_img = bool(payload.image_base64)
    logger.info("Analyzing message: length=%d characters, has_image=%s, type=%s", 
                len(payload.message or ""), has_img, payload.message_type.value)

    try:
        result = await ai_service.analyze(payload.message or "", payload.message_type, payload.image_base64)
        logger.info("Analysis complete: method=%s, risk_level=%s, score=%d", 
                    result.analysis_method, result.risk_level, result.risk_score)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        logger.error("Analysis execution error: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while evaluating this message. Please try again."
        )

