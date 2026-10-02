from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes import api_router
from backend.prediction_service import PhishingPredictionService

@asynccontextmanager
async def application_lifespan(app_instance: FastAPI):
    PhishingPredictionService.get_instance()
    yield

app = FastAPI(
    title="PhishGuard API",
    description="Machine Learning-Powered Phishing URL Detection & Risk Analysis API",
    version="1.0.0",
    lifespan=application_lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get(
    "/",
    summary="Root Endpoint",
    description="Returns basic application status information"
)

def read_root_endpoint():
    return {
        "name": "PhishGuard API",
        "status": "online",
        "version": "1.0.0"
    }

@app.get(
    "/health",
    summary="Health Check",
    description="Returns health status for load balancers and container probes"
)

def check_service_health():
    return {
        "status": "healthy"
    }
