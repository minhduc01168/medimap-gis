"""
Main FastAPI Application Entrypoint
MediMap GIS - Spatial Analytics Backend
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.spatial_engine import spatial_engine
from backend.app.api.v1.router import api_router

logging.basicConfig(level=logging.INFO, format='%(asctime)s - [%(levelname)s] - %(message)s')
logger = logging.getLogger("medimap.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Khởi động và nạp cache không gian
    logger.info("Đang khởi động MediMap GIS Backend...")
    spatial_engine.initialize()
    yield
    logger.info("Đang tắt MediMap GIS Backend...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

@app.get("/", tags=["General"])
def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "ONLINE",
        "study_area": "Thị xã Sa Pa, Huyện Bát Xát, Huyện Mường Khương (Lào Cai)",
        "docs_url": "/docs",
        "api_v1_prefix": settings.API_V1_PREFIX
    }

@app.get("/health", tags=["General"])
@app.get(f"{settings.API_V1_PREFIX}/health", tags=["General"])
def health_check():
    return {
        "status": "HEALTHY",
        "database_cache": "READY",
        "cached_facilities": len(spatial_engine.get_facilities_list()),
        "cached_desert_clusters": len(spatial_engine.get_deserts_list(limit=5000))
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
