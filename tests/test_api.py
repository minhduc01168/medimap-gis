"""
Test Suite for MediMap GIS FastAPI Backend
Master Test Architect: Murat
Uses httpx.AsyncClient with ASGITransport for testing ASGI endpoints
"""

import pytest
import httpx
from backend.app.main import app
from backend.app.core.spatial_engine import spatial_engine

@pytest.fixture(scope="session", autouse=True)
def setup_engine():
    spatial_engine.initialize()

@pytest.fixture
def anyio_backend():
    return 'asyncio'

@pytest.fixture
async def client():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as ac:
        yield ac

@pytest.mark.anyio
async def test_root_and_health(client):
    res_root = await client.get("/")
    assert res_root.status_code == 200
    data_root = res_root.json()
    assert data_root["status"] == "ONLINE"
    assert "Sa Pa" in data_root["study_area"]

    res_health = await client.get("/health")
    assert res_health.status_code == 200
    data_health = res_health.json()
    assert data_health["status"] == "HEALTHY"
    assert data_health["cached_facilities"] == 67

@pytest.mark.anyio
async def test_get_facilities_geojson(client):
    res = await client.get("/api/v1/facilities?format=geojson")
    assert res.status_code == 200
    data = res.json()
    assert data["type"] == "FeatureCollection"
    assert len(data["features"]) == 67
    first_feat = data["features"][0]
    assert "facility_id" in first_feat["properties"]
    assert "geometry" in first_feat

@pytest.mark.anyio
async def test_get_facilities_filtered_by_district(client):
    res = await client.get("/api/v1/facilities?district=Thị xã Sa Pa&format=json")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] == 19
    for fac in data["facilities"]:
        assert fac["district"] == "Thị xã Sa Pa"

@pytest.mark.anyio
async def test_get_facility_by_id(client):
    res = await client.get("/api/v1/facilities/LC_SP_H01")
    assert res.status_code == 200
    fac = res.json()
    assert fac["name"] == "Bệnh viện Đa khoa thị xã Sa Pa"
    assert fac["tier"] == 2

    # Test 404
    res_404 = await client.get("/api/v1/facilities/NON_EXISTENT_ID")
    assert res_404.status_code == 404

@pytest.mark.anyio
async def test_simulate_isochrone_default(client):
    payload = {
        "vehicle_type": "motorcycle",
        "base_speed_kmh": 32.0,
        "winding_factor": 1.75,
        "slope_friction_weight": 3.5,
        "include_proposed_clinics": False
    }
    res = await client.post("/api/v1/isochrone/simulate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "population_distribution" in data
    distrib = data["population_distribution"]
    assert "<15m" in distrib
    assert ">60m (Healthcare Desert)" in distrib
    # Verify deserts summary
    desert_summary = data["healthcare_deserts_summary"]
    assert desert_summary["percentage_in_deserts"] > 0

@pytest.mark.anyio
async def test_simulate_isochrone_with_proposed_clinics(client):
    # Scenario: turning on the 5 proposed clinics should drastically reduce deserts
    payload_base = {
        "vehicle_type": "motorcycle",
        "base_speed_kmh": 32.0,
        "include_proposed_clinics": False
    }
    res_base = await client.post("/api/v1/isochrone/simulate", json=payload_base)
    pop_base = res_base.json()["healthcare_deserts_summary"]["population_in_deserts"]

    payload_opt = {
        "vehicle_type": "motorcycle",
        "base_speed_kmh": 32.0,
        "include_proposed_clinics": True
    }
    res_opt = await client.post("/api/v1/isochrone/simulate", json=payload_opt)
    assert res_opt.status_code == 200
    pop_opt = res_opt.json()["healthcare_deserts_summary"]["population_in_deserts"]

    # Must decrease population in deserts!
    assert pop_opt < pop_base

@pytest.mark.anyio
async def test_deserts_endpoints(client):
    res_sum = await client.get("/api/v1/deserts/summary")
    assert res_sum.status_code == 200
    data_sum = res_sum.json()
    assert "healthcare_deserts_total_pop" in data_sum

    res_clusters = await client.get("/api/v1/deserts/clusters?limit=10")
    assert res_clusters.status_code == 200
    clusters = res_clusters.json()
    assert len(clusters) == 10
    assert "travel_time_min" in clusters[0]

@pytest.mark.anyio
async def test_optimization_endpoints(client):
    res_rec = await client.get("/api/v1/optimization/recommendations")
    assert res_rec.status_code == 200
    rec_data = res_rec.json()
    assert rec_data["type"] == "FeatureCollection"
    assert len(rec_data["features"]) == 5

    res_impact = await client.get("/api/v1/optimization/impact")
    assert res_impact.status_code == 200
    impact = res_impact.json()
    assert impact["number_of_new_facilities_p"] == 5
    assert impact["impact_metric"]["relative_reduction_in_deserts_pct"] > 70.0

@pytest.mark.anyio
async def test_e2sfca_and_spatial_stats(client):
    res_e2sfca = await client.get("/api/v1/e2sfca/district-summary")
    assert res_e2sfca.status_code == 200
    e2sfca_rows = res_e2sfca.json()
    assert len(e2sfca_rows) == 3 # 3 districts

    res_moran = await client.get("/api/v1/e2sfca/spatial-autocorrelation")
    assert res_moran.status_code == 200
    moran = res_moran.json()
    assert moran["global_morans_i"] > 0.8
    assert moran["z_score"] > 200.0
