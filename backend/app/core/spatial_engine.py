"""
Spatial Analytics & Simulation Engine for MediMap GIS
Handles in-memory caching and real-time topographic isochrone simulation
"""

import os
import json
import math
import logging
from typing import Dict, Any, List, Optional
import numpy as np
import pandas as pd
from backend.app.core.config import settings

logger = logging.getLogger("medimap.spatial_engine")

def calculate_haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371000.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2)**2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2)**2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def tobler_mountain_speed(grade: float, base_speed_kmh: float = 32.0, friction_weight: float = 3.5) -> float:
    speed = base_speed_kmh * math.exp(-friction_weight * abs(grade + 0.05))
    return max(6.0, min(base_speed_kmh, speed))

class SpatialEngine:
    def __init__(self):
        self._facilities_geojson: Optional[Dict[str, Any]] = None
        self._facilities_list: List[Dict[str, Any]] = []
        self._pop_sample: List[Dict[str, Any]] = []
        self._deserts_summary: Optional[Dict[str, Any]] = None
        self._deserts_list: List[Dict[str, Any]] = []
        self._recommendations_geojson: Optional[Dict[str, Any]] = None
        self._optimization_impact: Optional[Dict[str, Any]] = None
        self._e2sfca_summary: List[Dict[str, Any]] = []
        self._autocorrelation_report: Optional[Dict[str, Any]] = None
        self._initialized = False

    def initialize(self):
        if self._initialized:
            return
        logger.info("Đang khởi tạo SpatialEngine và nạp dữ liệu không gian vào bộ nhớ RAM...")

        # 1. Nạp Facilities GeoJSON
        if os.path.exists(settings.FACILITIES_GEOJSON):
            with open(settings.FACILITIES_GEOJSON, 'r', encoding='utf-8') as f:
                self._facilities_geojson = json.load(f)
            self._facilities_list = [
                f["properties"] | {
                    "lat": f["geometry"]["coordinates"][1],
                    "lon": f["geometry"]["coordinates"][0]
                }
                for f in self._facilities_geojson.get("features", [])
            ]
            logger.info(f"Đã nạp {len(self._facilities_list)} cơ sở y tế vào cache.")

        # 2. Nạp mẫu điểm dân cư phục vụ mô phỏng thời gian thực (Lấy mẫu đại diện 3,000 điểm phân bố đều)
        if os.path.exists(settings.ACCESSIBILITY_GEOJSON):
            with open(settings.ACCESSIBILITY_GEOJSON, 'r', encoding='utf-8') as f:
                acc_data = json.load(f)
            features = acc_data.get("features", [])
            step = max(1, len(features) // 3000)
            sample_feats = features[::step][:3000]
            self._pop_sample = [
                {
                    "cell_id": f["properties"].get("cell_id", ""),
                    "lat": f["geometry"]["coordinates"][1],
                    "lon": f["geometry"]["coordinates"][0],
                    "elevation_m": f["properties"].get("elevation_m", 700.0),
                    "population": f["properties"].get("population", 10),
                    "base_travel_time": f["properties"].get("travel_time_min", 45.0)
                }
                for f in sample_feats
            ]
            logger.info(f"Đã nạp {len(self._pop_sample)} điểm dân cư mẫu cho simulator.")

        # 3. Nạp Deserts Summary & List
        if os.path.exists(settings.DESERTS_SUMMARY_JSON):
            with open(settings.DESERTS_SUMMARY_JSON, 'r', encoding='utf-8') as f:
                self._deserts_summary = json.load(f)

        if os.path.exists(settings.DESERTS_CSV):
            df_deserts = pd.read_csv(settings.DESERTS_CSV)
            self._deserts_list = df_deserts.to_dict('records')
            logger.info(f"Đã nạp {len(self._deserts_list)} cụm dân cư vùng lõm y tế.")

        # 4. Nạp Recommendations & Impact
        if os.path.exists(settings.RECOMMENDATIONS_GEOJSON):
            with open(settings.RECOMMENDATIONS_GEOJSON, 'r', encoding='utf-8') as f:
                self._recommendations_geojson = json.load(f)

        if os.path.exists(settings.OPTIMIZATION_IMPACT_JSON):
            with open(settings.OPTIMIZATION_IMPACT_JSON, 'r', encoding='utf-8') as f:
                self._optimization_impact = json.load(f)

        # 5. Nạp E2SFCA & Moran's I
        if os.path.exists(settings.E2SFCA_SUMMARY_CSV):
            df_e2sfca = pd.read_csv(settings.E2SFCA_SUMMARY_CSV)
            self._e2sfca_summary = df_e2sfca.to_dict('records')

        if os.path.exists(settings.SPATIAL_AUTOCORRELATION_JSON):
            with open(settings.SPATIAL_AUTOCORRELATION_JSON, 'r', encoding='utf-8') as f:
                self._autocorrelation_report = json.load(f)

        self._initialized = True
        logger.info("SpatialEngine đã sẵn sàng phục vụ API requests!")

    # Getter methods
    def get_facilities_geojson(self) -> Dict[str, Any]:
        return self._facilities_geojson or {"type": "FeatureCollection", "features": []}

    def get_facilities_list(self) -> List[Dict[str, Any]]:
        return self._facilities_list

    def get_deserts_summary(self) -> Dict[str, Any]:
        return self._deserts_summary or {}

    def get_deserts_list(self, district: Optional[str] = None, limit: int = 100) -> List[Dict[str, Any]]:
        if not district:
            return self._deserts_list[:limit]
        filtered = [d for d in self._deserts_list if d.get("nearest_facility_district") == district]
        return filtered[:limit]

    def get_recommendations_geojson(self) -> Dict[str, Any]:
        return self._recommendations_geojson or {"type": "FeatureCollection", "features": []}

    def get_optimization_impact(self) -> Dict[str, Any]:
        return self._optimization_impact or {}

    def get_e2sfca_summary(self) -> List[Dict[str, Any]]:
        return self._e2sfca_summary

    def get_autocorrelation_report(self) -> Dict[str, Any]:
        return self._autocorrelation_report or {}

    def simulate_isochrone(
        self,
        base_speed_kmh: float = 32.0,
        winding_factor: float = 1.75,
        slope_friction_weight: float = 3.5,
        vehicle_type: str = "motorcycle",
        include_proposed_clinics: bool = False
    ) -> Dict[str, Any]:
        """
        Mô phỏng thời gian thực sự thay đổi của vùng tiếp cận khi thay đổi tốc độ hoặc điều kiện địa hình
        """
        # Điều chỉnh vận tốc theo loại phương tiện
        if vehicle_type == "ambulance":
            base_speed_kmh = max(20.0, min(base_speed_kmh, 45.0))
            # Xe cứu thương 4 bánh chịu ảnh hưởng khúc cua đèo núi nhiều hơn
            winding_factor = max(winding_factor, 1.85)
        elif vehicle_type == "walking":
            base_speed_kmh = 5.0
            winding_factor = 1.5

        # Danh sách cơ sở y tế áp dụng trong mô phỏng
        active_facilities = list(self._facilities_list)
        if include_proposed_clinics and self._recommendations_geojson:
            for rec in self._recommendations_geojson.get("features", []):
                active_facilities.append({
                    "name": rec["properties"].get("name", "Trạm Y tế mới"),
                    "lat": rec["geometry"]["coordinates"][1],
                    "lon": rec["geometry"]["coordinates"][0],
                    "elevation_m": rec["properties"].get("elevation_m", 700.0)
                })

        # Mảng tính toán
        tier_counts = {"<15m": 0, "15-30m": 0, "30-60m": 0, ">60m (Healthcare Desert)": 0}
        tier_pop = {"<15m": 0, "15-30m": 0, "30-60m": 0, ">60m (Healthcare Desert)": 0}
        total_sample_pop = 0

        simulated_points = []
        for p in self._pop_sample:
            p_lat, p_lon, p_elev, p_pop = p["lat"], p["lon"], p["elevation_m"], p["population"]
            total_sample_pop += p_pop

            # Tìm thời gian ngắn nhất đến bất kỳ cơ sở y tế nào
            best_time = float('inf')
            for f in active_facilities:
                dist_m = calculate_haversine(p_lat, p_lon, f["lat"], f["lon"]) * winding_factor
                delta_h = abs(f.get("elevation_m", 700.0) - p_elev)
                grade = delta_h / max(dist_m, 100.0)
                speed = tobler_mountain_speed(grade, base_speed_kmh=base_speed_kmh, friction_weight=slope_friction_weight)
                t_min = (dist_m / 1000.0) / speed * 60.0
                if t_min < best_time:
                    best_time = t_min

            best_time = round(best_time, 1)

            if best_time < 15.0:
                cat = "<15m"
            elif best_time <= 30.0:
                cat = "15-30m"
            elif best_time <= 60.0:
                cat = "30-60m"
            else:
                cat = ">60m (Healthcare Desert)"

            tier_counts[cat] += 1
            tier_pop[cat] += p_pop

        # Tính tỷ lệ phần trăm và phóng đại theo quy mô toàn bộ dân số (219,094 người)
        scale_ratio = 219094.0 / max(1, total_sample_pop)
        scaled_pop = {k: int(round(tier_pop[k] * scale_ratio)) for k in tier_pop}
        total_scaled = sum(scaled_pop.values())

        percentages = {k: round((scaled_pop[k] / total_scaled) * 100.0, 2) for k in scaled_pop}

        return {
            "simulation_parameters": {
                "vehicle_type": vehicle_type,
                "base_speed_kmh": base_speed_kmh,
                "winding_factor": winding_factor,
                "slope_friction_weight": slope_friction_weight,
                "include_proposed_clinics": include_proposed_clinics,
                "active_facilities_count": len(active_facilities)
            },
            "population_distribution": {
                k: {
                    "estimated_population": scaled_pop[k],
                    "percentage": percentages[k],
                    "sample_cells_count": tier_counts[k]
                }
                for k in tier_pop
            },
            "healthcare_deserts_summary": {
                "population_in_deserts": scaled_pop[">60m (Healthcare Desert)"],
                "percentage_in_deserts": percentages[">60m (Healthcare Desert)"],
                "risk_level": "CRITICAL" if percentages[">60m (Healthcare Desert)"] > 10.0 else "CONTROLLED"
            }
        }

spatial_engine = SpatialEngine()
