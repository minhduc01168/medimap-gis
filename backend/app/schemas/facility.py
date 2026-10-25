"""
Pydantic Schemas for Health Facilities
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class FacilityProperties(BaseModel):
    facility_id: str
    name: str
    district: str
    commune: str
    tier_level: int
    facility_type: str
    beds_capacity: int
    doctors_count: int
    verification_status: str

class FacilityItem(BaseModel):
    id: str
    name: str
    district: str
    commune: str
    tier: int
    beds: int
    doctors: int
    lat: float
    lon: float
    elevation_m: Optional[float] = None
    type: str

class FacilitiesListResponse(BaseModel):
    total: int
    facilities: List[FacilityItem]
