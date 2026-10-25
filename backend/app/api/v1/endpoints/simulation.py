"""
Real-time Topographic Isochrone Simulation Endpoint
"""

from fastapi import APIRouter
from backend.app.schemas.simulation import SimulationRequest, SimulationResponse
from backend.app.core.spatial_engine import spatial_engine

router = APIRouter()

@router.post("/simulate", response_model=SimulationResponse, summary="Mô phỏng thời gian thực vùng phủ sóng và Vùng lõm y tế")
def simulate_isochrone(request: SimulationRequest):
    """
    Nhận các tham số mô phỏng từ Frontend Slider:
    - `vehicle_type`: 'motorcycle', 'ambulance', 'walking'
    - `base_speed_kmh`: 5.0 - 80.0 km/h
    - `winding_factor`: Hệ số đèo núi 1.0 - 3.0
    - `slope_friction_weight`: Hệ số ma sát sườn dốc Tobler 1.0 - 6.0
    - `include_proposed_clinics`: Bật/Tắt kịch bản quy hoạch thêm 5 trạm y tế mới
    """
    result = spatial_engine.simulate_isochrone(
        base_speed_kmh=request.base_speed_kmh,
        winding_factor=request.winding_factor,
        slope_friction_weight=request.slope_friction_weight,
        vehicle_type=request.vehicle_type,
        include_proposed_clinics=request.include_proposed_clinics
    )
    return result
