#!/usr/bin/env python3
"""
Script 01: Download and Prepare Administrative Boundaries for Pilot Study Area
Pilot Districts: Sa Pa (Thị xã Sa Pa), Bát Xát, Mường Khương - Lào Cai Province, Vietnam.

Sources:
- OpenStreetMap Nominatim & Overpass API
- Generates unified bounding box & clipping mask GeoJSON
"""

import os
import json
import logging
import requests

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

DATA_RAW = os.path.join(os.path.dirname(__file__), '..', 'data', '01_raw')
DATA_INTERMEDIATE = os.path.join(os.path.dirname(__file__), '..', 'data', '02_intermediate')
os.makedirs(DATA_RAW, exist_ok=True)
os.makedirs(DATA_INTERMEDIATE, exist_ok=True)

# Pilot Districts in Lao Cai
PILOT_DISTRICTS = [
    {"name": "Thị xã Sa Pa", "osm_query": "Thị xã Sa Pa, Lào Cai, Vietnam", "id": "sapa"},
    {"name": "Huyện Bát Xát", "osm_query": "Huyện Bát Xát, Lào Cai, Vietnam", "id": "batxat"},
    {"name": "Huyện Mường Khương", "osm_query": "Huyện Mường Khương, Lào Cai, Vietnam", "id": "muongkhuong"}
]

HEADERS = {
    'User-Agent': 'MediMapGIS-ResearchPipeline/1.0 (Academic Research; contact: phucanhthien@gmail.com)'
}

def fetch_district_boundary(district_info):
    """Fetch district polygon from OSM Nominatim API"""
    logging.info(f"Đang tìm kiếm ranh giới: {district_info['name']}...")
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        'q': district_info['osm_query'],
        'format': 'geojson',
        'polygon_geojson': 1,
        'limit': 1
    }
    try:
        resp = requests.get(url, params=params, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        if data.get('features'):
            feature = data['features'][0]
            feature['properties']['district_id'] = district_info['id']
            feature['properties']['district_name'] = district_info['name']
            logging.info(f"-> Đã tải thành công ranh giới: {district_info['name']}")
            return feature
        else:
            logging.warning(f"Không tìm thấy ranh giới chính xác cho {district_info['name']} trên Nominatim")
    except Exception as e:
        logging.error(f"Lỗi khi tải ranh giới {district_info['name']}: {e}")
    return None

def compute_bounding_box(features):
    """Tính toán Bounding Box bao phủ toàn bộ 3 huyện"""
    min_lon, min_lat = float('inf'), float('inf')
    max_lon, max_lat = float('-inf'), float('-inf')

    def scan_coords(coords):
        nonlocal min_lon, min_lat, max_lon, max_lat
        if isinstance(coords[0], (int, float)):
            lon, lat = coords[0], coords[1]
            min_lon = min(min_lon, lon)
            max_lon = max(max_lon, lon)
            min_lat = min(min_lat, lat)
            max_lat = max(max_lat, lat)
        else:
            for sub in coords:
                scan_coords(sub)

    for f in features:
        scan_coords(f['geometry']['coordinates'])

    # Bổ sung padding an toàn 0.05 độ (~5.5km) cho vùng đệm phân tích
    padding = 0.05
    return {
        "min_lon": round(min_lon - padding, 4),
        "min_lat": round(min_lat - padding, 4),
        "max_lon": round(max_lon + padding, 4),
        "max_lat": round(max_lat + padding, 4),
        "bbox_tuple": (round(min_lat - padding, 4), round(min_lon - padding, 4), round(max_lat + padding, 4), round(max_lon + padding, 4)) # (south, west, north, east)
    }

def run():
    features = []
    for dist in PILOT_DISTRICTS:
        feat = fetch_district_boundary(dist)
        if feat:
            features.append(feat)

    if not features:
        # Fallback Bounding Box cho cụm Sa Pa - Bát Xát - Mường Khương (Lào Cai)
        logging.info("Sử dụng Bounding Box chuẩn địa lý Lào Cai làm fallback...")
        bbox = {
            "min_lon": 103.50,
            "min_lat": 22.20,
            "max_lon": 104.35,
            "max_lat": 22.85,
            "bbox_tuple": (22.20, 103.50, 22.85, 104.35)
        }
    else:
        bbox = compute_bounding_box(features)
        feature_collection = {
            "type": "FeatureCollection",
            "features": features
        }
        out_districts = os.path.join(DATA_RAW, "pilot_districts_boundaries.geojson")
        with open(out_districts, "w", encoding="utf-8") as f:
            json.dump(feature_collection, f, ensure_ascii=False, indent=2)
        logging.info(f"Đã lưu ranh giới chi tiết vào: {out_districts}")

    # Lưu metadata Bounding Box phục vụ các script sau (OSM, SRTM, WorldPop)
    bbox_path = os.path.join(DATA_INTERMEDIATE, "study_area_bbox.json")
    with open(bbox_path, "w", encoding="utf-8") as f:
        json.dump(bbox, f, indent=2)
    logging.info(f"Đã lưu Bounding Box nghiên cứu: {bbox}")
    logging.info("=== HOÀN THÀNH SCRIPT 01 ===")

if __name__ == '__main__':
    run()
