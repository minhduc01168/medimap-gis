"""
E2SFCA & Spatial Autocorrelation Endpoints
"""

from typing import List, Dict, Any
from fastapi import APIRouter
from backend.app.core.spatial_engine import spatial_engine

router = APIRouter()

@router.get("/district-summary", summary="Lấy chỉ số E2SFCA bác sĩ & giường bệnh trên 1.000 dân theo huyện")
def get_e2sfca_district_summary() -> List[Dict[str, Any]]:
    """
    Trả về chỉ số tiếp cận nâng cao (E2SFCA):
    - Tỷ lệ bác sĩ / 1.000 dân
    - Tỷ lệ giường bệnh / 1.000 dân
    - Điểm tiếp cận tổng hợp thang 100
    """
    return spatial_engine.get_e2sfca_summary()

@router.get("/spatial-autocorrelation", summary="Lấy kết quả kiểm định tự tương quan không gian Moran's I")
def get_spatial_autocorrelation_report() -> Dict[str, Any]:
    """
    Trả về các chỉ số thống kê không gian:
    - Global Moran's I = 0.9306
    - Z-score = 298.29
    - p-value < 0.001
    - Kết luận khoa học chứng minh sự tập trung vùng lõm y tế.
    """
    return spatial_engine.get_autocorrelation_report()
