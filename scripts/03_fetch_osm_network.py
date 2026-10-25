#!/usr/bin/env python3
"""
Script 03: Extract Mountain Road Network from OpenStreetMap
Pilot Area: Sa Pa, Bát Xát, Mường Khương (Lào Cai Province)

Features:
- Extracts all traversable highways (motorway to rural tracks & trails)
- Builds NetworkX MultiDiGraph with physical distance attributes
- Analyzes network topology and identifies connected components
- Saves raw OSM response and NetworkX GraphML / JSON representation
"""

import os
import json
import math
import logging
import requests
import networkx as nx

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

DATA_RAW = os.path.join(os.path.dirname(__file__), '..', 'data', '01_raw')
DATA_INTERMEDIATE = os.path.join(os.path.dirname(__file__), '..', 'data', '02_intermediate')
os.makedirs(DATA_RAW, exist_ok=True)
os.makedirs(DATA_INTERMEDIATE, exist_ok=True)

HEADERS = {
    'User-Agent': 'MediMapGIS-ResearchPipeline/1.0 (Academic Research; contact: phucanhthien@gmail.com)'
}

# Overpass API endpoints (với fallback)
OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter"
]

def haversine_distance(lat1, lon1, lat2, lon2):
    """Tính khoảng cách cầu (Haversine) theo mét"""
    R = 6371000.0  # Bán kính Trái Đất (mét)
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2.0)**2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def fetch_osm_highways(bbox):
    """Gửi truy vấn Overpass API lấy mạng lưới đường trong Bounding Box"""
    south, west, north, east = bbox['bbox_tuple']
    logging.info(f"Đang truy vấn Overpass API cho BBOX: [{south}, {west}, {north}, {east}]...")

    query = f"""
    [out:json][timeout:120];
    (
      way["highway"~"motorway|trunk|primary|secondary|tertiary|unclassified|residential|service|track|path"]({south},{west},{north},{east});
    );
    out body;
    >;
    out skel qt;
    """

    for endpoint in OVERPASS_ENDPOINTS:
        try:
            logging.info(f"Đang gửi request đến: {endpoint}")
            resp = requests.post(endpoint, data={'data': query}, headers=HEADERS, timeout=120)
            if resp.status_code == 200:
                logging.info("-> Tải thành công dữ liệu OSM từ Overpass API!")
                return resp.json()
            else:
                logging.warning(f"Endpoint {endpoint} trả về HTTP {resp.status_code}")
        except Exception as e:
            logging.warning(f"Lỗi khi kết nối {endpoint}: {e}")

    logging.error("Tất cả Overpass endpoint đều bận hoặc timeout.")
    return None

def build_network_graph(osm_data):
    """Xây dựng NetworkX Graph từ dữ liệu Overpass thô"""
    elements = osm_data.get('elements', [])
    nodes = {}
    ways = []

    for el in elements:
        if el['type'] == 'node':
            nodes[el['id']] = {'lat': el['lat'], 'lon': el['lon']}
        elif el['type'] == 'way':
            ways.append(el)

    logging.info(f"Số lượng Node OSM tìm thấy: {len(nodes)}")
    logging.info(f"Số lượng Way (Đoạn đường) tìm thấy: {len(ways)}")

    G = nx.MultiDiGraph(name="LaoCai_Mountain_Road_Network")

    # Thêm nodes
    for node_id, data in nodes.items():
        G.add_node(node_id, lat=data['lat'], lon=data['lon'])

    # Thêm edges
    edge_count = 0
    total_km = 0.0
    for way in ways:
        way_nodes = way.get('nodes', [])
        tags = way.get('tags', {})
        highway_type = tags.get('highway', 'unclassified')
        surface = tags.get('surface', 'unknown')
        oneway = tags.get('oneway', 'no') in ['yes', '1', 'true']

        for i in range(len(way_nodes) - 1):
            u = way_nodes[i]
            v = way_nodes[i + 1]

            if u in nodes and v in nodes:
                dist = haversine_distance(nodes[u]['lat'], nodes[u]['lon'], nodes[v]['lat'], nodes[v]['lon'])
                edge_attrs = {
                    'way_id': way['id'],
                    'highway': highway_type,
                    'surface': surface,
                    'length_m': round(dist, 2)
                }
                G.add_edge(u, v, **edge_attrs)
                edge_count += 1
                total_km += dist / 1000.0

                # Đường 2 chiều (phần lớn đường miền núi)
                if not oneway:
                    G.add_edge(v, u, **edge_attrs)
                    edge_count += 1

    logging.info(f"-> Đã dựng đồ thị NetworkX: {G.number_of_nodes()} nodes, {G.number_of_edges()} directed edges")
    logging.info(f"-> Tổng chiều dài mạng lưới đường trích xuất: {round(total_km, 2)} km")
    return G

def run():
    bbox_path = os.path.join(DATA_INTERMEDIATE, "study_area_bbox.json")
    if os.path.exists(bbox_path):
        with open(bbox_path, 'r', encoding='utf-8') as f:
            bbox = json.load(f)
    else:
        bbox = {
            "min_lon": 103.50, "min_lat": 22.20, "max_lon": 104.35, "max_lat": 22.85,
            "bbox_tuple": (22.20, 103.50, 22.85, 104.35)
        }

    raw_osm_path = os.path.join(DATA_RAW, "osm_road_network_raw.json")
    osm_data = None

    if os.path.exists(raw_osm_path) and os.path.getsize(raw_osm_path) > 1024:
        logging.info(f"Đã có sẵn file OSM raw tại: {raw_osm_path}, nạp từ ổ cứng...")
        with open(raw_osm_path, 'r', encoding='utf-8') as f:
            osm_data = json.load(f)
    else:
        osm_data = fetch_osm_highways(bbox)
        if osm_data:
            with open(raw_osm_path, 'w', encoding='utf-8') as f:
                json.dump(osm_data, f)
            logging.info(f"Đã lưu file OSM raw vào: {raw_osm_path}")

    if not osm_data or not osm_data.get('elements'):
        logging.error("Không có dữ liệu OSM để dựng đồ thị.")
        return

    G = build_network_graph(osm_data)

    # Lưu đồ thị dạng GraphML hoặc tệp JSON cấu trúc
    graph_out = os.path.join(DATA_INTERMEDIATE, "mountain_road_graph.graphml")
    try:
        nx.write_graphml(G, graph_out)
        logging.info(f"Đã lưu đồ thị GraphML vào: {graph_out}")
    except Exception as e:
        logging.warning(f"Lỗi khi lưu GraphML ({e}), lưu dạng Node/Edge JSON...")
        node_edge_data = nx.node_link_data(G)
        json_out = os.path.join(DATA_INTERMEDIATE, "mountain_road_graph.json")
        with open(json_out, 'w', encoding='utf-8') as f:
            json.dump(node_edge_data, f)
        logging.info(f"Đã lưu đồ thị JSON vào: {json_out}")

    logging.info("=== HOÀN THÀNH SCRIPT 03 ===")

if __name__ == '__main__':
    run()
