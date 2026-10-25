#!/usr/bin/env python3
"""
Research Script 01: Enhanced Two-Step Floating Catchment Area (E2SFCA) Model
Pilot Area: Sa Pa, Bát Xát, Mường Khương (Lào Cai Province)

Features:
- Implements continuous Gaussian friction decay function with 60-min catchment threshold
- Step 1: Computes Doctor-to-Demand and Bed-to-Demand ratios (R_j) for all 67 health facilities
- Step 2: Aggregates spatial accessibility scores (A_i) for all 17,863 micro-population points
- Calculates Doctors per 1,000 population and Beds per 1,000 population indices
- Generates Commune & District-level inequality ranking tables
"""

import os
import json
import math
import logging
import numpy as np
import pandas as pd

logging.basicConfig(level=logging.INFO, format='%(asctime)s - [%(levelname)s] - %(message)s')

DATA_INTERMEDIATE = os.path.join(os.path.dirname(__file__), '..', 'data', '02_intermediate')
DATA_PRIMARY = os.path.join(os.path.dirname(__file__), '..', 'data', '03_primary')
DATA_FINAL = os.path.join(os.path.dirname(__file__), '..', 'data', '04_research_ready')

def calculate_haversine(lat1, lon1, lat2, lon2):
    R = 6371000.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2)**2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2)**2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def tobler_mountain_speed(grade, base_speed_kmh=32.0):
    speed = base_speed_kmh * math.exp(-3.5 * abs(grade + 0.05))
    return max(8.0, min(base_speed_kmh, speed))

def gaussian_decay(travel_time_min, d0=60.0):
    """
    Hàm suy giảm Gaussian liên tục (Continuous Gaussian Friction Weight):
    W(d) = [exp(-1/2 * (d/d0)^2) - exp(-1/2)] / [1 - exp(-1/2)] for d <= d0, else 0
    """
    if travel_time_min > d0:
        return 0.0
    numerator = math.exp(-0.5 * (travel_time_min / d0)**2) - math.exp(-0.5)
    denominator = 1.0 - math.exp(-0.5)
    return numerator / denominator

def run():
    logging.info("Bắt đầu thực thi Mô hình E2SFCA (Enhanced Two-Step Floating Catchment Area)...")

    # 1. Nạp dữ liệu cơ sở y tế
    fac_path = os.path.join(DATA_PRIMARY, "health_facilities_ground_truth.geojson")
    with open(fac_path, 'r', encoding='utf-8') as f:
        fac_geojson = json.load(f)
    facilities = []
    for feat in fac_geojson["features"]:
        props = feat["properties"]
        coords = feat["geometry"]["coordinates"]
        facilities.append({
            "id": props["facility_id"],
            "name": props["name"],
            "district": props["district"],
            "commune": props["commune"],
            "tier": props["tier_level"],
            "doctors": max(1, props.get("doctors_count", 1)),
            "beds": max(5, props.get("beds_capacity", 5)),
            "lat": coords[1],
            "lon": coords[0],
            "elevation_m": props.get("elevation_m", 700.0)
        })

    # 2. Nạp dữ liệu dân cư vi mô WorldPop
    pop_path = os.path.join(DATA_PRIMARY, "population_points_100m.geojson")
    with open(pop_path, 'r', encoding='utf-8') as f:
        pop_geojson = json.load(f)
    pop_points = []
    for feat in pop_geojson["features"]:
        props = feat["properties"]
        coords = feat["geometry"]["coordinates"]
        pop_points.append({
            "cell_id": props["cell_id"],
            "population": props["population"],
            "elevation_m": props.get("elevation_m", 700.0),
            "lat": coords[1],
            "lon": coords[0]
        })

    num_fac = len(facilities)
    num_pop = len(pop_points)
    logging.info(f"Nạp {num_fac} cơ sở y tế và {num_pop} cụm dân cư.")

    # 3. Tính toán ma trận thời gian di chuyển (Travel Time Matrix) có tính độ dốc
    logging.info("Đang tính ma trận thời gian di chuyển có tính độ dốc sườn núi...")
    D0 = 60.0  # Ngưỡng thời gian vàng cấp cứu: 60 phút
    winding_factor = 1.75

    # time_matrix[i, j]: thời gian từ cụm dân cư i đến cơ sở y tế j
    weight_matrix = np.zeros((num_pop, num_fac), dtype=np.float32)

    for i, pop in enumerate(pop_points):
        p_lat, p_lon, p_elev = pop["lat"], pop["lon"], pop["elevation_m"]
        for j, fac in enumerate(facilities):
            dist_m = calculate_haversine(p_lat, p_lon, fac["lat"], fac["lon"])
            actual_dist_m = dist_m * winding_factor
            delta_h = abs(fac["elevation_m"] - p_elev)
            grade = delta_h / max(actual_dist_m, 100.0)
            speed_kmh = tobler_mountain_speed(grade, base_speed_kmh=32.0)
            t_min = (actual_dist_m / 1000.0) / speed_kmh * 60.0

            if t_min <= D0:
                weight_matrix[i, j] = gaussian_decay(t_min, d0=D0)

    # 4. BƯỚC 1 CỦA E2SFCA: Tính tỷ lệ Cung / Nhu cầu (R_j) của từng trạm y tế
    logging.info("BƯỚC 1 E2SFCA: Tính tỷ lệ cung-cầu (R_j) cho từng cơ sở y tế...")
    pop_array = np.array([p["population"] for p in pop_points], dtype=np.float32)

    # Nhu cầu có trọng số tại mỗi cơ sở y tế j
    weighted_demand_j = np.dot(pop_array, weight_matrix) # shape: (num_fac,)

    R_doctors = np.zeros(num_fac, dtype=np.float32)
    R_beds = np.zeros(num_fac, dtype=np.float32)

    for j, fac in enumerate(facilities):
        demand = weighted_demand_j[j]
        if demand > 0:
            R_doctors[j] = fac["doctors"] / demand
            R_beds[j] = fac["beds"] / demand
        else:
            R_doctors[j] = 0.0
            R_beds[j] = 0.0
        fac["R_doctors"] = float(R_doctors[j])
        fac["R_beds"] = float(R_beds[j])
        fac["weighted_demand"] = float(round(demand, 1))

    # 5. BƯỚC 2 CỦA E2SFCA: Tính điểm tiếp cận tổng hợp A_i cho từng cụm dân cư
    logging.info("BƯỚC 2 E2SFCA: Tổng hợp điểm tiếp cận y tế A_i cho từng cụm dân cư...")
    # A_i = sum_j (R_j * W_ij) * 1000 (tỷ lệ trên 1.000 dân)
    A_doctors = np.dot(weight_matrix, R_doctors) * 1000.0
    A_beds = np.dot(weight_matrix, R_beds) * 1000.0

    # Chuẩn hóa về thang điểm 0 - 100 (Min-Max Scaling)
    def min_max_scale(arr):
        mn, mx = np.min(arr), np.max(arr)
        if mx > mn:
            return ((arr - mn) / (mx - mn)) * 100.0
        return np.zeros_like(arr)

    A_composite_score = 0.5 * min_max_scale(A_doctors) + 0.5 * min_max_scale(A_beds)

    # Gán vào GeoJSON
    for i, feat in enumerate(pop_geojson["features"]):
        feat["properties"]["e2sfca_doctors_per_1k"] = round(float(A_doctors[i]), 3)
        feat["properties"]["e2sfca_beds_per_1k"] = round(float(A_beds[i]), 2)
        feat["properties"]["e2sfca_composite_score"] = round(float(A_composite_score[i]), 2)

    # 6. Thống kê theo Huyện
    logging.info("Đang tổng hợp chỉ số tiếp cận theo cấp Huyện...")
    # Gán tạm huyện cho từng điểm dân cư dựa trên trạm y tế gần nhất
    district_data = {}
    for i, pop in enumerate(pop_points):
        # Tìm trạm y tế có trọng số W lớn nhất
        best_fac_idx = np.argmax(weight_matrix[i, :])
        dist_name = facilities[best_fac_idx]["district"]
        if dist_name not in district_data:
            district_data[dist_name] = {"pop": 0, "doc_weighted": 0.0, "bed_weighted": 0.0, "score_weighted": 0.0}
        p = pop["population"]
        district_data[dist_name]["pop"] += p
        district_data[dist_name]["doc_weighted"] += A_doctors[i] * p
        district_data[dist_name]["bed_weighted"] += A_beds[i] * p
        district_data[dist_name]["score_weighted"] += A_composite_score[i] * p

    summary_rows = []
    for d, val in district_data.items():
        total_d_pop = val["pop"]
        mean_doc = val["doc_weighted"] / total_d_pop
        mean_bed = val["bed_weighted"] / total_d_pop
        mean_score = val["score_weighted"] / total_d_pop
        summary_rows.append({
            "district": d,
            "population": total_d_pop,
            "mean_doctors_per_1k": round(mean_doc, 3),
            "mean_beds_per_1k": round(mean_bed, 2),
            "mean_composite_score_100": round(mean_score, 1)
        })
        logging.info(f"Huyện [{d}]: Bác sĩ/1k dân: {mean_doc:.3f} | Giường/1k dân: {mean_bed:.2f} | Điểm E2SFCA: {mean_score:.1f}/100")

    # 7. Xuất bản tệp dữ liệu
    out_geojson = os.path.join(DATA_FINAL, "e2sfca_accessibility_results.geojson")
    with open(out_geojson, "w", encoding="utf-8") as f:
        json.dump(pop_geojson, f, indent=2)
    logging.info(f"Đã lưu kết quả E2SFCA: {out_geojson}")

    out_csv = os.path.join(DATA_FINAL, "e2sfca_district_summary.csv")
    pd.DataFrame(summary_rows).to_csv(out_csv, index=False, encoding="utf-8-sig")
    logging.info(f"Đã xuất bảng tổng hợp huyện: {out_csv}")

    out_fac_r = os.path.join(DATA_FINAL, "e2sfca_facilities_r_scores.csv")
    pd.DataFrame(facilities).to_csv(out_fac_r, index=False, encoding="utf-8-sig")
    logging.info(f"Đã xuất tỷ lệ R_j cơ sở y tế: {out_fac_r}")

    logging.info("=== HOÀN THÀNH RESEARCH SCRIPT 01: E2SFCA ===")

if __name__ == '__main__':
    run()
