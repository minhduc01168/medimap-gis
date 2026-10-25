"""
Pydantic Schemas for Optimization & Deserts
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class RecommendedSiteProperties(BaseModel):
    recommendation_id: str
    priority_rank: int
    name: str
    district: str
    commune: str
    elevation_m: float
    proposed_tier: int
    proposed_staff: str
    proposed_beds: int
    status: str

class OptimizationMetrics(BaseModel):
    baseline: Dict[str, Any]
    optimized: Dict[str, Any]
    impact_metric: Dict[str, Any]
    recommended_sites: List[Dict[str, Any]]
