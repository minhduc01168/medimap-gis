"""
Location-Allocation Optimization Endpoints
"""

from typing import Dict, Any
from fastapi import APIRouter
from backend.app.core.spatial_engine import spatial_engine

router = APIRouter()

@router.get("/recommendations", summary="Lấy danh sách 5 vị trí trạm y tế mới tối ưu (GeoJSON)")
def get_recommendations() -> Dict[str, Any]:
    """
    Trả về FeatureCollection GeoJSON gồm 5 điểm trạm y tế được thuật toán P-Median / MCLP lựa chọn
    kèm thông tin quy hoạch đề xuất (số y sĩ, số giường bệnh).
    """
    return spatial_engine.get_recommendations_geojson()

@router.get("/impact", summary="Lấy báo cáo so sánh tác động Before vs After khi bổ sung 5 trạm")
def get_optimization_impact() -> Dict[str, Any]:
    """
    Báo cáo đo lường hiệu quả:
    - Số dân được cứu trợ (từ 34,498 xuống 4,924 người, giảm 85.7%)
    - Rút ngắn thời gian di chuyển từ 89.3 phút xuống 34.4 phút
    """
    return spatial_engine.get_optimization_impact()
