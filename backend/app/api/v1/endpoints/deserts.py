"""
Healthcare Deserts API Endpoints
"""

from typing import Optional, Dict, Any, List
from fastapi import APIRouter, Query
from backend.app.core.spatial_engine import spatial_engine

router = APIRouter()

@router.get("/summary", summary="Lấy báo cáo tổng hợp hiện trạng Vùng lõm y tế")
def get_deserts_summary() -> Dict[str, Any]:
    """
    Trả về số lượng dân số, tỷ lệ phần trăm dân cư ngoài khung giờ vàng 60 phút
    và phân bổ theo từng dải thời gian (<15m, 15-30m, 30-60m, >60m)
    """
    return spatial_engine.get_deserts_summary()

@router.get("/clusters", summary="Lấy danh sách các cụm dân cư bị cô lập cần ưu tiên can thiệp")
def get_desert_clusters(
    district: Optional[str] = Query(None, description="Lọc theo huyện"),
    limit: int = Query(50, ge=1, le=500, description="Giới hạn số bản ghi trả về (1 - 500)")
) -> List[Dict[str, Any]]:
    """
    Trả về danh sách các cụm dân cư vùng lõm (>60 phút), gồm tọa độ, dân số, độ cao
    và tên trạm y tế gần nhất kèm khoảng cách thời gian.
    """
    return spatial_engine.get_deserts_list(district=district, limit=limit)
