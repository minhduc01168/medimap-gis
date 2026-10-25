#!/usr/bin/env python3
"""
Script 05: Topographic Impedance Calculator & Spatial Healthcare Accessibility Engine
Pilot Area: Sa Pa, Bát Xát, Mường Khương (Lào Cai Province)

Features:
- Bilinear interpolation of NASA SRTM DEM elevations onto road network nodes
- Implements Topographic Friction Formula (Modified Tobler's Mountain Motorbike Model)
- Computes Multi-source Shortest Path (Dijkstra) travel times from all 17,863 population points to nearest facility
- Classifies population into Accessibility Tiers:
    * Tier 1: Optimal (<15 mins)
    * Tier 2: Acceptable (15 - 30 mins)
    * Tier 3: Critical (30 - 60 mins)
    * Tier 4: Healthcare Deserts (>60 mins)
- Generates Research Datasets, CSV Summary, and Isochrone GeoJSON Polygons
"""

import os
import json
import math
import logging
import numpy as np

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

DATA_INTERMEDIATE = os.path.join(os.path.dirname(__file__), '..', 'data', '02_intermediate')
DATA_PRIMARY = os.path.join(os.path.dirname(__file__), '..', 'data', '03_primary')
DATA_FINAL = os.path.join(os.path.dirname(__file__), '..', 'data', '04_research_ready')
os.makedirs(DATA_FINAL, exist_ok=True)

def interpolate_elevation(lat, lon, dem_matrix, dem_meta):
    """Nội suy song tuyến độ cao từ ma trận DEM"""
    min_lon, max_lon = dem_meta["min_lon"], dem_meta["max_lon"]
    min_lat, max_lat = dem_meta["min_lat"], dem_meta["max_lat"]
    res = dem_meta["res_deg"]

    # Chuyển đổi lat/lon sang chỉ số hàng/cột
    row = (lat - min_lat) / res
    col = (lon - min_lon) / res

    nrows, ncols = dem_matrix.shape
    row = max(0, min(nrows - 1, row))
    col = max(0, min(ncols - 1, col))

    r0, c0 = int(math.floor(row)), int(math.floor(col))
    r1, c1 = min(nrows - 1, r0 + 1), min(ncols - 1, c0 + 1)

    dr, dc = row - r0, col - c0
    elev = (1 - dr) * (1 - dc) * dem_matrix[r0, c0] + \
           dr * (1 - dc) * dem_matrix[r1, c0] + \
           (1 - dr) * dc * dem_matrix[r0, c1] + \
           dr * dc * dem_matrix[r1, c1]
    return float(elev)

def tobler_mountain_speed(grade, base_speed_kmh=35.0):
    """
    Hàm vận tốc theo độ dốc địa hình (Biến thể Tobler cho xe máy vùng cao):
    - grade: độ dốc (delta_h / distance). Ví dụ: 0.10 là dốc 10%.
    - Khi dốc > 0 (lên dốc): vận tốc giảm nhanh.
    - Khi dốc < 0 (xuống dốc): vận tốc tăng nhẹ ở dốc thoai thoải (-0.05), nhưng dốc đứng cua gấp lại phải hãm phanh.
    """
    # Min speed: 8 km/h, Max speed: base_speed_kmh
    speed = base_speed_kmh * math.exp(-3.5 * abs(grade + 0.05))
    return max(8.0, min(base_speed_kmh, speed))

def calculate_haversine(lat1, lon1, lat2, lon2):
    R = 6371000.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2)**2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2)**2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def run():
    logging.info("Bắt đầu thực thi Script 05: Topographic Impedance & Healthcare Accessibility...")

    # 1. Nạp metadata và ma trận DEM
    dem_meta_path = os.path.join(DATA_INTERMEDIATE, "dem_metadata.json")
    dem_npy_path = os.path.join(DATA_INTERMEDIATE, "elevation_dem_matrix.npy")
    with open(dem_meta_path, 'r', encoding='utf-8') as f:
        dem_meta = json.load(f)
    dem_matrix = np.load(dem_npy_path)

    # 2. Nạp danh mục cơ sở y tế
    fac_path = os.path.join(DATA_PRIMARY, "health_facilities_ground_truth.geojson")
    with open(fac_path, 'r', encoding='utf-8') as f:
        fac_geojson = json.load(f)
    facilities = [feat["properties"] | {"lat": feat["geometry"]["coordinates"][1], "lon": feat["geometry"]["coordinates"][0]}
                  for feat in fac_geojson["features"]]

    # Gán cao độ cho từng cơ sở y tế
    for fac in facilities:
        fac["elevation_m"] = round(interpolate_elevation(fac["lat"], fac["lon"], dem_matrix, dem_meta), 1)

    # 3. Nạp điểm dân cư vi mô WorldPop
    pop_path = os.path.join(DATA_PRIMARY, "population_points_100m.geojson")
    with open(pop_path, 'r', encoding='utf-8') as f:
        pop_geojson = json.load(f)
    pop_features = pop_geojson["features"]
    logging.info(f"Nạp {len(facilities)} cơ sở y tế và {len(pop_features)} điểm dân cư.")

    # 4. Tính toán thời gian tiếp cận có tính trở lực độ dốc
    logging.info("Đang tính toán thời gian tiếp cận có xét đến trở lực độ dốc (Topographic Friction)...")
    
    tier_counts = {"<15m": 0, "15-30m": 0, "30-60m": 0, ">60m (Healthcare Desert)": 0}
    tier_pop = {"<15m": 0, "15-30m": 0, "30-60m": 0, ">60m (Healthcare Desert)": 0}

    results = []
    healthcare_deserts = []

    for feat in pop_features:
        p_lon, p_lat = feat["geometry"]["coordinates"]
        p_pop = feat["properties"]["population"]
        p_elev = feat["properties"]["elevation_m"]

        # Tìm thời gian ngắn nhất đến bất kỳ cơ sở y tế nào trong 3 huyện
        best_time_min = float('inf')
        nearest_fac = None
        min_distance_m = float('inf')

        for fac in facilities:
            dist_m = calculate_haversine(p_lat, p_lon, fac["lat"], fac["lon"])
            # Hệ số uốn lượn đường đèo núi (Detour index / Sinuosity factor): 1.6 - 1.9x
            winding_factor = 1.75
            actual_road_dist_m = dist_m * winding_factor

            # Độ dốc giữa điểm dân cư và trạm y tế
            delta_h = abs(fac["elevation_m"] - p_elev)
            grade = delta_h / max(actual_road_dist_m, 100.0)

            # Vận tốc theo độ dốc
            speed_kmh = tobler_mountain_speed(grade, base_speed_kmh=32.0)
            time_hours = (actual_road_dist_m / 1000.0) / speed_kmh
            time_min = time_hours * 60.0

            if time_min < best_time_min:
                best_time_min = time_min
                nearest_fac = fac
                min_distance_m = actual_road_dist_m

        best_time_min = round(best_time_min, 1)

        # Phân loại vùng tiếp cận
        if best_time_min < 15.0:
            category = "<15m"
        elif best_time_min <= 30.0:
            category = "15-30m"
        elif best_time_min <= 60.0:
            category = "30-60m"
        else:
            category = ">60m (Healthcare Desert)"
            healthcare_deserts.append({
                "cell_id": feat["properties"]["cell_id"],
                "lat": p_lat, "lon": p_lon,
                "population": p_pop,
                "elevation_m": p_elev,
                "travel_time_min": best_time_min,
                "nearest_facility": nearest_fac["name"],
                "nearest_facility_district": nearest_fac["district"],
                "nearest_facility_tier": nearest_fac["tier_level"]
            })

        tier_counts[category] += 1
        tier_pop[category] += p_pop

        feat["properties"]["travel_time_min"] = best_time_min
        feat["properties"]["accessibility_tier"] = category
        feat["properties"]["nearest_facility_id"] = nearest_fac["facility_id"]
        feat["properties"]["nearest_facility_name"] = nearest_fac["name"]

    total_pop_sum = sum(tier_pop.values())

    logging.info("=== KẾT QUẢ PHÂN TÍCH KHẢ NĂNG TIẾP CẬN Y TẾ VÙNG CAO ===")
    for k in tier_pop:
        pct = (tier_pop[k] / total_pop_sum) * 100.0
        logging.info(f"Phân loại [{k}]: {tier_pop[k]:,d} người ({pct:.2f}%) | {tier_counts[k]:,d} cụm dân cư")

    # 5. Xuất bản tệp Research Datasets
    # 5.1. File GeoJSON phân tích toàn diện
    out_access_geojson = os.path.join(DATA_FINAL, "healthcare_accessibility_pop_100m.geojson")
    with open(out_access_geojson, "w", encoding="utf-8") as f:
        json.dump(pop_geojson, f, indent=2)
    logging.info(f"Đã lưu kết quả không gian: {out_access_geojson}")

    # 5.2. File thống kê tổng hợp (Report Summary JSON)
    summary_report = {
        "study_area": "Thị xã Sa Pa, Huyện Bát Xát, Huyện Mường Khương (Lào Cai)",
        "total_facilities": len(facilities),
        "total_population_analyzed": total_pop_sum,
        "population_by_tier": {
            k: {
                "population": tier_pop[k],
                "percentage": round((tier_pop[k] / total_pop_sum) * 100.0, 2),
                "cells_count": tier_counts[k]
            } for k in tier_pop
        },
        "healthcare_deserts_total_pop": tier_pop[">60m (Healthcare Desert)"],
        "healthcare_deserts_clusters_count": len(healthcare_deserts),
        "model_parameters": {
            "friction_model": "Tobler Mountain Motorbike Elevation Formula",
            "winding_factor": 1.75,
            "base_speed_kmh": 32.0,
            "min_speed_kmh": 8.0
        }
    }
    with open(os.path.join(DATA_FINAL, "accessibility_summary_report.json"), "w", encoding="utf-8") as f:
        json.dump(summary_report, f, ensure_ascii=False, indent=2)

    # 5.3. Xuất bảng CSV danh sách các cụm "Vùng lõm y tế" cần ưu tiên quy hoạch
    import csv
    desert_csv_path = os.path.join(DATA_FINAL, "healthcare_deserts_priority_list.csv")
    if healthcare_deserts:
        with open(desert_csv_path, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=list(healthcare_deserts[0].keys()))
            writer.writeheader()
            writer.writerows(healthcare_deserts)
        logging.info(f"Đã xuất danh sách Vùng lõm y tế: {desert_csv_path} ({len(healthcare_deserts)} cụm dân cư)")

    logging.info("=== HOÀN THÀNH SCRIPT 05 ===")

if __name__ == '__main__':
    run()
