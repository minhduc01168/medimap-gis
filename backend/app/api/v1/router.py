"""
API v1 Router Aggregator
"""

from fastapi import APIRouter
from backend.app.api.v1.endpoints import (
    facilities,
    simulation,
    deserts,
    optimization,
    e2sfca
)

api_router = APIRouter()

api_router.include_router(facilities.router, prefix="/facilities", tags=["Health Facilities"])
api_router.include_router(simulation.router, prefix="/isochrone", tags=["Topographic Simulation"])
api_router.include_router(deserts.router, prefix="/deserts", tags=["Healthcare Deserts"])
api_router.include_router(optimization.router, prefix="/optimization", tags=["Location Optimization"])
api_router.include_router(e2sfca.router, prefix="/e2sfca", tags=["E2SFCA Accessibility & Spatial Stats"])
