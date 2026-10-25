#!/usr/bin/env python3
"""
MediMap GIS - Automated Research Dataset Pipeline Runner
Executes Phase 1 to Phase 5 sequentially:
1. scripts/01_download_boundaries.py
2. scripts/02_ingest_health_facilities.py
3. scripts/03_fetch_osm_network.py
4. scripts/04_process_raster_elevation_pop.py
5. scripts/05_topographic_impedance_builder.py
6. scripts/06_qa_ground_truth_validation.py
"""

import sys
import time
import subprocess
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - [%(levelname)s] - %(message)s')

SCRIPTS = [
    ("Phase 1: Administrative Boundaries", "scripts/01_download_boundaries.py"),
    ("Phase 2: Health Facilities Ground-Truth", "scripts/02_ingest_health_facilities.py"),
    ("Phase 2: OpenStreetMap Mountain Road Network", "scripts/03_fetch_osm_network.py"),
    ("Phase 3: Elevation DEM & Population Calibration", "scripts/04_process_raster_elevation_pop.py"),
    ("Phase 4: Topographic Friction & Accessibility Analysis", "scripts/05_topographic_impedance_builder.py"),
    ("Phase 5: Quality Assurance & Package GeoPackage", "scripts/06_qa_ground_truth_validation.py"),
]

def main():
    logging.info("=================================================================")
    logging.info("   MEDIMAP GIS — AUTOMATED SPATIAL RESEARCH DATASET PIPELINE     ")
    logging.info("   Study Area: Sa Pa, Bát Xát, Mường Khương (Lào Cai Province)   ")
    logging.info("=================================================================")

    start_total = time.time()

    for idx, (desc, script_path) in enumerate(SCRIPTS, 1):
        logging.info(f"\n[STEP {idx}/{len(SCRIPTS)}] Đang thực thi: {desc} ({script_path})...")
        t0 = time.time()
        res = subprocess.run([sys.executable, script_path])
        elapsed = time.time() - t0

        if res.returncode != 0:
            logging.error(f"Xảy ra lỗi tại {script_path} (Exit code: {res.returncode})!")
            sys.exit(res.returncode)
        logging.info(f"-> Hoàn thành {desc} trong {elapsed:.1f} giây.")

    total_time = time.time() - start_total
    logging.info("\n=================================================================")
    logging.info(f"   TOÀN BỘ PIPELINE ĐÃ HOÀN TẤT THÀNH CÔNG TRONG {total_time:.1f} GIÂY!")
    logging.info("   Output Dataset: data/04_research_ready/medimap_laocai_pilot_v1.gpkg")
    logging.info("   QA Report: docs/quality_assessment_report.md")
    logging.info("=================================================================")

if __name__ == '__main__':
    main()
