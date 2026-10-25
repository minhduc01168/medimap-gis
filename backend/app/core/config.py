"""
Core Configuration for MediMap GIS FastAPI Backend
"""

import os
from typing import List
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "MediMap GIS - Spatial Analytics API"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    DESCRIPTION: str = (
        "Microservice cung cấp API phân tích không gian, mô phỏng vùng đẳng thời (Isochrone), "
        "đánh giá Vùng lõm y tế và khuyến nghị tối ưu hóa mạng lưới y tế miền núi Lào Cai."
    )
    
    # CORS Origins (Hỗ trợ Next.js frontend dev và production)
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*"
    ]

    # Data file paths
    BASE_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
    DATA_PRIMARY_DIR: str = os.path.join(BASE_DIR, "data", "03_primary")
    DATA_FINAL_DIR: str = os.path.join(BASE_DIR, "data", "04_research_ready")
    DATA_INTERMEDIATE_DIR: str = os.path.join(BASE_DIR, "data", "02_intermediate")

    FACILITIES_GEOJSON: str = os.path.join(DATA_PRIMARY_DIR, "health_facilities_ground_truth.geojson")
    FACILITIES_CSV: str = os.path.join(DATA_PRIMARY_DIR, "health_facilities_catalog.csv")
    ACCESSIBILITY_GEOJSON: str = os.path.join(DATA_FINAL_DIR, "healthcare_accessibility_pop_100m.geojson")
    DESERTS_CSV: str = os.path.join(DATA_FINAL_DIR, "healthcare_deserts_priority_list.csv")
    DESERTS_SUMMARY_JSON: str = os.path.join(DATA_FINAL_DIR, "accessibility_summary_report.json")
    RECOMMENDATIONS_GEOJSON: str = os.path.join(DATA_FINAL_DIR, "optimal_facility_recommendations.geojson")
    OPTIMIZATION_IMPACT_JSON: str = os.path.join(DATA_FINAL_DIR, "optimization_impact_comparison.json")
    E2SFCA_SUMMARY_CSV: str = os.path.join(DATA_FINAL_DIR, "e2sfca_district_summary.csv")
    SPATIAL_AUTOCORRELATION_JSON: str = os.path.join(DATA_FINAL_DIR, "spatial_autocorrelation_report.json")

settings = Settings()
