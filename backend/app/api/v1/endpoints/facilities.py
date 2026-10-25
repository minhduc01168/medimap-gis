"""
Health Facilities API Endpoints
"""

from typing import Optional, Dict, Any, List
from fastapi import APIRouter, Query, HTTPException
from backend.app.core.spatial_engine import spatial_engine

router = APIRouter()

@router.get("", response_model=Dict[str, Any], summary="Lấy danh mục cơ sở y tế (GeoJSON hoặc JSON)")
def get_facilities(
    district: Optional[str] = Query(None, description="Lọc theo huyện: 'Thị xã Sa Pa', 'Huyện Bát Xát', 'Huyện Mường Khương'"),
    tier: Optional[int] = Query(None, description="Lọc theo tuyến: 1 (Tỉnh), 2 (Huyện), 3 (Xã)"),
    format: str = Query("geojson", description="Định dạng trả về: 'geojson' hoặc 'json'")
):
    if format == "geojson":
        geojson = spatial_engine.get_facilities_geojson()
        if not district and not tier:
            return geojson
        
        filtered_features = []
        for feat in geojson.get("features", []):
            props = feat.get("properties", {})
            if district and props.get("district") != district:
                continue
            if tier and props.get("tier_level") != tier:
                continue
            filtered_features.append(feat)
        return {
            "type": "FeatureCollection",
            "features": filtered_features,
            "total": len(filtered_features)
        }
    else:
        facilities = spatial_engine.get_facilities_list()
        filtered = facilities
        if district:
            filtered = [f for f in filtered if f.get("district") == district]
        if tier:
            filtered = [f for f in filtered if f.get("tier") == tier]
        return {
            "total": len(filtered),
            "facilities": filtered
        }

@router.get("/{facility_id}", summary="Lấy thông tin chi tiết một cơ sở y tế theo ID")
def get_facility_by_id(facility_id: str):
    facilities = spatial_engine.get_facilities_list()
    for f in facilities:
        fid = f.get("facility_id") or f.get("id")
        if fid == facility_id:
            res = dict(f)
            res["id"] = fid
            res["tier"] = res.get("tier_level", res.get("tier", 3))
            return res
    raise HTTPException(status_code=404, detail=f"Không tìm thấy cơ sở y tế với mã {facility_id}")
