import json
import csv
import os

facilities = []
with open('data/03_primary/health_facilities_catalog.csv', 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    for r in reader:
        facilities.append({
            'id': r['id'],
            'name': r['name'],
            'district': r['district'],
            'commune': r['commune'],
            'tier': int(r['tier']),
            'type': r['type'],
            'beds': int(r['beds']),
            'doctors': int(r['doctors']),
            'lat': float(r['lat']),
            'lon': float(r['lon'])
        })

with open('data/04_research_ready/optimization_impact_comparison.json', 'r', encoding='utf-8') as f:
    opt_data = json.load(f)

with open('data/04_research_ready/optimal_facility_recommendations.geojson', 'r', encoding='utf-8') as f:
    opt_geojson = json.load(f)

for feat in opt_geojson['features']:
    props = feat['properties']
    rec_id = props['recommendation_id']
    coords = feat['geometry']['coordinates']
    for item in opt_data['recommended_sites']:
        if item['recommendation_id'] == rec_id:
            item['lon'] = coords[0]
            item['lat'] = coords[1]

with open('data/04_research_ready/accessibility_summary_report.json', 'r', encoding='utf-8') as f:
    access_summary = json.load(f)

with open('data/04_research_ready/spatial_autocorrelation_report.json', 'r', encoding='utf-8') as f:
    moran_summary = json.load(f)

districts_stats = []
with open('data/04_research_ready/e2sfca_district_summary.csv', 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    for r in reader:
        districts_stats.append({
            'district': r['district'],
            'population': int(r['population']),
            'mean_doctors_per_1k': float(r['mean_doctors_per_1k']),
            'mean_beds_per_1k': float(r['mean_beds_per_1k']),
            'mean_composite_score_100': float(r['mean_composite_score_100'])
        })

desert_points = []
with open('data/04_research_ready/healthcare_deserts_priority_list.csv', 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    step = 12
    for idx, r in enumerate(reader):
        if idx % step == 0 and len(desert_points) < 350:
            desert_points.append({
                'id': r['cell_id'],
                'lat': float(r['lat']),
                'lon': float(r['lon']),
                'pop': int(r['population']),
                'elev': float(r['elevation_m']),
                'time_min': float(r['travel_time_min']),
                'nearest': r['nearest_facility'],
                'district': r['nearest_facility_district']
            })

os.makedirs('frontend/src/data', exist_ok=True)
bundle = {
    'facilities': facilities,
    'proposed_clinics': opt_data['recommended_sites'],
    'accessibility_summary': access_summary,
    'moran_summary': moran_summary,
    'districts_stats': districts_stats,
    'optimization_impact': {
        'baseline': opt_data['baseline'],
        'optimized': opt_data['optimized'],
        'impact_metric': opt_data['impact_metric']
    },
    'desert_sample': desert_points
}

output_path = 'frontend/src/data/initialData.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(bundle, f, ensure_ascii=False, indent=2)

print(f"Exported successfully to {output_path}: {len(facilities)} facilities, {len(desert_points)} desert sample points.")
