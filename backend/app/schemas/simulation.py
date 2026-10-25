"""
Pydantic Schemas for Real-time Simulation
"""

from typing import Dict, Any, Optional
from pydantic import BaseModel, Field

class SimulationRequest(BaseModel):
    vehicle_type: str = Field(
        default="motorcycle", 
        description="Phương tiện di chuyển: 'motorcycle' (xe máy), 'ambulance' (xe cấp cứu), hoặc 'walking' (đi bộ)"
    )
    base_speed_kmh: float = Field(
        default=32.0, 
        ge=5.0, 
        le=80.0, 
        description="Vận tốc cơ sở trên đường phẳng (km/h)"
    )
    winding_factor: float = Field(
        default=1.75, 
        ge=1.0, 
        le=3.0, 
        description="Hệ số uốn lượn đường đèo núi (Detour Index)"
    )
    slope_friction_weight: float = Field(
        default=3.5, 
        ge=1.0, 
        le=6.0, 
        description="Hệ số cản trở độ dốc sườn núi (Tobler slope coefficient)"
    )
    include_proposed_clinics: bool = Field(
        default=False, 
        description="Bật/Tắt kịch bản quy hoạch bổ sung 5 trạm y tế mới"
    )

class TierDistribution(BaseModel):
    estimated_population: int
    percentage: float
    sample_cells_count: int

class SimulationResponse(BaseModel):
    simulation_parameters: Dict[str, Any]
    population_distribution: Dict[str, TierDistribution]
    healthcare_deserts_summary: Dict[str, Any]
