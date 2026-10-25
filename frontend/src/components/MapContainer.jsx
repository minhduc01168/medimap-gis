import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Navigation, 
  Map as MapIcon, 
  Compass, 
  PlusCircle, 
  Trash2,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Flame
} from 'lucide-react';

export default function MapContainer({
  facilities = [],
  deserts = [],
  proposedClinics = [],
  showIsochrones = true,
  showDeserts = true,
  showProposed = false,
  showFacilities = true,
  simulationResult = null,
  isAddingClinic = false,
  customClinics = [],
  onAddCustomClinic,
  onRemoveCustomClinic,
  selectedDistrict = ''
}) {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const layersGroupRef = useRef({
    facilities: null,
    isochrones: null,
    deserts: null,
    proposed: null,
    custom: null
  });

  const [baseMap, setBaseMap] = useState('dark'); // 'dark' | 'satellite' | 'street'
  const [coordsHud, setCoordsHud] = useState({ lat: 22.3364, lon: 103.8441 });
  const tileLayerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) return;
    if (leafletMapRef.current) return;

    // Center on Sa Pa / Bat Xat / Muong Khuong region
    const map = L.map(mapRef.current, {
      center: [22.42, 103.95],
      zoom: 10,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial Tile Layer: CartoDB Dark Matter
    const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);
    tileLayerRef.current = darkTiles;

    // Track mouse coords
    map.on('mousemove', (e) => {
      setCoordsHud({
        lat: Number(e.latlng.lat.toFixed(4)),
        lon: Number(e.latlng.lng.toFixed(4))
      });
    });

    // Map click handler for adding custom clinic
    map.on('click', (e) => {
      if (window._isAddingClinicActive) {
        window._onAddCustomClinicCallback({
          id: `CUSTOM_${Date.now()}`,
          name: `Trạm Y tế Đề xuất #${window._customClinicsCount + 1}`,
          lat: Number(e.latlng.lat.toFixed(4)),
          lon: Number(e.latlng.lng.toFixed(4)),
          elevation_m: 850.0,
          doctors: 2,
          beds: 5
        });
      }
    });

    // Initialize Layer Groups
    layersGroupRef.current.isochrones = L.layerGroup().addTo(map);
    layersGroupRef.current.deserts = L.layerGroup().addTo(map);
    layersGroupRef.current.facilities = L.layerGroup().addTo(map);
    layersGroupRef.current.proposed = L.layerGroup().addTo(map);
    layersGroupRef.current.custom = L.layerGroup().addTo(map);

    leafletMapRef.current = map;

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // Update window references for click callback
  useEffect(() => {
    window._isAddingClinicActive = isAddingClinic;
    window._customClinicsCount = customClinics.length;
    window._onAddCustomClinicCallback = onAddCustomClinic;
  }, [isAddingClinic, customClinics.length, onAddCustomClinic]);

  // Handle Base Map Switcher
  useEffect(() => {
    if (!leafletMapRef.current || !tileLayerRef.current) return;
    const map = leafletMapRef.current;
    map.removeLayer(tileLayerRef.current);

    let newUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    let sub = 'abcd';

    if (baseMap === 'satellite') {
      newUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      sub = '';
    } else if (baseMap === 'street') {
      newUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      sub = 'abc';
    }

    const newLayer = L.tileLayer(newUrl, {
      maxZoom: 19,
      subdomains: sub
    }).addTo(map);
    tileLayerRef.current = newLayer;
  }, [baseMap]);

  // Render 67 Health Facilities
  useEffect(() => {
    if (!layersGroupRef.current.facilities) return;
    const group = layersGroupRef.current.facilities;
    group.clearLayers();

    if (!showFacilities) return;

    let filtered = facilities;
    if (selectedDistrict) {
      filtered = filtered.filter(f => f.district === selectedDistrict);
    }

    filtered.forEach(f => {
      // Color by tier: Tier 1: Gold, Tier 2: Cyan, Tier 3: Emerald
      let color = '#10b981';
      let tierLabel = 'Tuyến 3: Trạm Y tế Xã';
      let radius = 7;

      if (f.tier === 1) {
        color = '#f59e0b';
        tierLabel = 'Tuyến 1: Bệnh viện Đa khoa Tỉnh';
        radius = 11;
      } else if (f.tier === 2) {
        color = '#06b6d4';
        tierLabel = 'Tuyến 2: BVĐK / TTYT Huyện';
        radius = 9;
      }

      const marker = L.circleMarker([f.lat, f.lon], {
        radius: radius,
        fillColor: color,
        color: '#ffffff',
        weight: 1.5,
        opacity: 0.9,
        fillOpacity: 0.85
      });

      marker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; min-width: 210px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; background: ${color}25; color: ${color};">
              ${tierLabel}
            </span>
            <span style="font-size: 11px; color: #94a3b8; font-family: monospace;">${f.id}</span>
          </div>
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #f8fafc; font-family: 'Outfit', sans-serif;">
            ${f.name}
          </h4>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #cbd5e1;">
            📍 ${f.commune}, ${f.district}
          </p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 6px; background: rgba(255,255,255,0.05); border-radius: 6px; font-size: 11px;">
            <div>
              <span style="color: #94a3b8;">Bác sĩ:</span> 
              <strong style="color: #38bdf8; font-size: 12px; margin-left: 4px;">${f.doctors}</strong>
            </div>
            <div>
              <span style="color: #94a3b8;">Giường bệnh:</span> 
              <strong style="color: #34d399; font-size: 12px; margin-left: 4px;">${f.beds}</strong>
            </div>
            <div>
              <span style="color: #94a3b8;">Loại hình:</span> 
              <strong style="color: #f1f5f9; margin-left: 4px;">${f.type}</strong>
            </div>
            <div>
              <span style="color: #94a3b8;">Tọa độ:</span> 
              <span style="color: #cbd5e1; font-family: monospace; margin-left: 2px;">${f.lat.toFixed(2)}, ${f.lon.toFixed(2)}</span>
            </div>
          </div>
        </div>
      `);

      group.addLayer(marker);
    });
  }, [facilities, showFacilities, selectedDistrict]);

  // Render Isochrone Rings / Coverage Polygons
  useEffect(() => {
    if (!layersGroupRef.current.isochrones) return;
    const group = layersGroupRef.current.isochrones;
    group.clearLayers();

    if (!showIsochrones) return;

    const effectiveFactor = simulationResult?.isochrone_bands_km 
      ? (simulationResult.isochrone_bands_km.band_15min_radius_approx_km / 7.5) 
      : 1.0;

    // Draw service coverage circles around district hospitals & key clinics
    const majorFacilities = facilities.filter(f => f.tier <= 2 || f.type === 'polyclinic');

    majorFacilities.forEach(f => {
      // 15 min radius (Emerald)
      const r15 = 4500 * effectiveFactor;
      L.circle([f.lat, f.lon], {
        radius: r15,
        color: '#10b981',
        weight: 1,
        fillColor: '#10b981',
        fillOpacity: 0.08,
        dashArray: '4, 4'
      }).addTo(group);

      // 30 min radius (Amber)
      const r30 = 9000 * effectiveFactor;
      L.circle([f.lat, f.lon], {
        radius: r30,
        color: '#f59e0b',
        weight: 1,
        fillColor: '#f59e0b',
        fillOpacity: 0.04,
        dashArray: '6, 6'
      }).addTo(group);
    });
  }, [facilities, showIsochrones, simulationResult]);

  // Render Healthcare Deserts Clusters
  useEffect(() => {
    if (!layersGroupRef.current.deserts) return;
    const group = layersGroupRef.current.deserts;
    group.clearLayers();

    if (!showDeserts) return;

    deserts.forEach(d => {
      const circle = L.circleMarker([d.lat, d.lon], {
        radius: 4.5,
        fillColor: '#f43f5e',
        color: '#ffffff',
        weight: 1,
        opacity: 0.9,
        fillOpacity: 0.75
      });

      circle.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; min-width: 190px;">
          <div style="display: flex; align-items: center; gap: 4px; color: #f43f5e; font-weight: 700; margin-bottom: 4px;">
            <span style="font-size: 13px;">⚠️</span> VÙNG LÕM Y TẾ (>60 PHÚT)
          </div>
          <p style="margin: 0 0 6px 0; color: #cbd5e1; font-size: 11px;">
            Mã ô dân cư: <strong style="color: #f8fafc; font-family: monospace;">${d.id}</strong>
          </p>
          <div style="padding: 6px; background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.2); border-radius: 6px; margin-bottom: 6px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span style="color: #94a3b8;">Thời gian di chuyển:</span>
              <strong style="color: #fda4af;">${d.time_min.toFixed(1)} phút</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span style="color: #94a3b8;">Quy mô dân cư vi mô:</span>
              <strong style="color: #f8fafc;">${d.pop} người</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Độ cao địa hình DEM:</span>
              <span style="color: #94a3b8;">${d.elev.toFixed(0)}m</span>
            </div>
          </div>
          <div style="font-size: 11px; color: #cbd5e1;">
            Trạm gần nhất: <br/>
            <span style="color: #38bdf8; font-weight: 600;">${d.nearest}</span> (${d.district})
          </div>
        </div>
      `);

      group.addLayer(circle);
    });
  }, [deserts, showDeserts]);

  // Render 5 Proposed Clinics from P-Median Optimization
  useEffect(() => {
    if (!layersGroupRef.current.proposed) return;
    const group = layersGroupRef.current.proposed;
    group.clearLayers();

    if (!showProposed) return;

    proposedClinics.forEach((p, idx) => {
      // Purple Diamond Pulse Marker
      const customIcon = L.divIcon({
        className: 'custom-proposed-marker',
        html: `
          <div style="
            width: 26px; 
            height: 26px; 
            background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%); 
            transform: rotate(45deg); 
            border: 2px solid #ffffff; 
            box-shadow: 0 0 16px rgba(168, 85, 247, 0.9);
            display: flex; 
            align-items: center; 
            justify-content: center;
            border-radius: 4px;
          ">
            <span style="transform: rotate(-45deg); color: #ffffff; font-weight: 800; font-size: 11px; font-family: monospace;">
              P${p.priority_rank || idx + 1}
            </span>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = L.marker([p.lat, p.lon], { icon: customIcon });

      // Add new rescued coverage buffer circle (15m: 5km, 30m: 10km)
      L.circle([p.lat, p.lon], {
        radius: 6500,
        color: '#a855f7',
        weight: 1.5,
        fillColor: '#8b5cf6',
        fillOpacity: 0.15,
        dashArray: '5, 5'
      }).addTo(group);

      marker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; min-width: 220px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; background: rgba(168, 85, 247, 0.2); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3);">
              ĐỀ XUẤT TỐI ƯU P-MEDIAN #${p.priority_rank}
            </span>
          </div>
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #f8fafc; font-family: 'Outfit', sans-serif;">
            ${p.name}
          </h4>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #cbd5e1;">
            📍 ${p.commune}, ${p.district} (Cao độ: ${p.elevation_m.toFixed(0)}m)
          </p>
          <div style="padding: 8px; background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.25); border-radius: 6px; font-size: 11px; margin-bottom: 6px;">
            <div style="margin-bottom: 4px;">
              <span style="color: #94a3b8;">Nhân lực đề xuất:</span> <br/>
              <strong style="color: #e9d5ff;">${p.proposed_staff}</strong>
            </div>
            <div>
              <span style="color: #94a3b8;">Quy mô:</span> <strong style="color: #e9d5ff;">${p.proposed_beds} giường lưu trú</strong>
            </div>
          </div>
          <div style="color: #34d399; font-size: 11px; font-weight: 600;">
            ✓ Giảm 85.7% dân số vùng lõm lân cận
          </div>
        </div>
      `);

      group.addLayer(marker);
    });
  }, [proposedClinics, showProposed]);

  // Render Custom Added Clinics
  useEffect(() => {
    if (!layersGroupRef.current.custom) return;
    const group = layersGroupRef.current.custom;
    group.clearLayers();

    customClinics.forEach((c) => {
      const customIcon = L.divIcon({
        className: 'user-custom-marker',
        html: `
          <div style="
            width: 24px; 
            height: 24px; 
            background: linear-gradient(135deg, #06b6d4 0%, #0284c7 100%); 
            border: 2px solid #ffffff; 
            box-shadow: 0 0 14px rgba(6, 182, 212, 0.8);
            display: flex; 
            align-items: center; 
            justify-content: center;
            border-radius: 50%;
          ">
            <span style="color: #ffffff; font-weight: 800; font-size: 12px;">+</span>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([c.lat, c.lon], { icon: customIcon });

      // Simulated coverage circle
      L.circle([c.lat, c.lon], {
        radius: 6000,
        color: '#06b6d4',
        weight: 1.5,
        fillColor: '#06b6d4',
        fillOpacity: 0.15,
        dashArray: '4, 4'
      }).addTo(group);

      marker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; min-width: 190px;">
          <span style="font-size: 10px; font-weight: 700; color: #38bdf8;">TRẠM TỰ ĐẶT (MÔ PHỎNG)</span>
          <h4 style="margin: 4px 0; font-size: 13px; font-weight: 700; color: #f8fafc;">${c.name}</h4>
          <p style="margin: 0 0 6px 0; color: #94a3b8; font-size: 11px;">
            Tọa độ: ${c.lat}, ${c.lon}
          </p>
          <button 
            id="btn-remove-${c.id}"
            style="
              width: 100%;
              padding: 5px;
              background: rgba(244, 63, 94, 0.2);
              border: 1px solid rgba(244, 63, 94, 0.4);
              color: #fda4af;
              border-radius: 4px;
              cursor: pointer;
              font-weight: 600;
              font-size: 11px;
            "
          >
            Xóa trạm này
          </button>
        </div>
      `);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-remove-${c.id}`);
        if (btn) {
          btn.onclick = () => onRemoveCustomClinic(c.id);
        }
      });

      group.addLayer(marker);
    });
  }, [customClinics, onRemoveCustomClinic]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Map Root DOM */}
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          cursor: isAddingClinic ? 'crosshair' : 'grab' 
        }} 
      />

      {/* Floating HUD: Base Map Selector */}
      <div 
        className="glass-panel"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 800,
          padding: '6px',
          display: 'flex',
          gap: '4px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)'
        }}
      >
        <button
          onClick={() => setBaseMap('dark')}
          style={{
            padding: '6px 12px',
            fontSize: '0.74rem',
            fontWeight: baseMap === 'dark' ? 700 : 500,
            borderRadius: '6px',
            border: 'none',
            background: baseMap === 'dark' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
            color: baseMap === 'dark' ? '#34d399' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Tối (CartoDB)
        </button>
        <button
          onClick={() => setBaseMap('satellite')}
          style={{
            padding: '6px 12px',
            fontSize: '0.74rem',
            fontWeight: baseMap === 'satellite' ? 700 : 500,
            borderRadius: '6px',
            border: 'none',
            background: baseMap === 'satellite' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
            color: baseMap === 'satellite' ? '#34d399' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Vệ Tinh (ESRI)
        </button>
        <button
          onClick={() => setBaseMap('street')}
          style={{
            padding: '6px 12px',
            fontSize: '0.74rem',
            fontWeight: baseMap === 'street' ? 700 : 500,
            borderRadius: '6px',
            border: 'none',
            background: baseMap === 'street' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
            color: baseMap === 'street' ? '#34d399' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Địa Hình (OSM)
        </button>
      </div>

      {/* Floating HUD: Legend Bar */}
      <div
        className="glass-panel"
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '20px',
          zIndex: 800,
          padding: '12px 16px',
          minWidth: '240px',
          fontSize: '0.78rem'
        }}
      >
        <div style={{ 
          fontFamily: 'var(--font-display)', 
          fontWeight: 700, 
          fontSize: '0.82rem', 
          color: '#f8fafc', 
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Compass size={15} color="#10b981" />
          Chú Giải Phân Tầng Y Tế
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b', border: '1px solid #fff' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Tuyến 1: Bệnh viện Đa khoa Tỉnh</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#06b6d4', border: '1px solid #fff' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Tuyến 2: BVĐK / TTYT Huyện</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', border: '1px solid #fff' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Tuyến 3: Trạm Y tế Xã / PKĐK</span>
          </div>

          <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f43f5e', border: '1px solid #fff' }} />
            <span style={{ color: '#fda4af', fontWeight: 600 }}>Vùng lõm y tế (&gt;60 phút)</span>
          </div>

          {showProposed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                width: '10px', 
                height: '10px', 
                backgroundColor: '#8b5cf6', 
                transform: 'rotate(45deg)', 
                border: '1px solid #fff' 
              }} />
              <span style={{ color: '#c084fc', fontWeight: 600 }}>5 Vị trí tối ưu P-Median</span>
            </div>
          )}

          {customClinics.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0284c7', border: '1px solid #fff' }} />
              <span style={{ color: '#7dd3fc', fontWeight: 600 }}>Trạm tự đặt ({customClinics.length})</span>
            </div>
          )}
        </div>
      </div>

      {/* Coordinate & Crosshair HUD */}
      <div
        className="glass-panel"
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '70px',
          zIndex: 800,
          padding: '4px 10px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: 'var(--text-muted)'
        }}
      >
        GPS: <span style={{ color: '#f8fafc' }}>{coordsHud.lat.toFixed(4)}°N</span>, <span style={{ color: '#f8fafc' }}>{coordsHud.lon.toFixed(4)}°E</span>
      </div>

      {/* Banner indicator when in Add Clinic Mode */}
      {isAddingClinic && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 900,
            padding: '8px 18px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(124, 58, 237, 0.9) 100%)',
            backdropFilter: 'blur(12px)',
            color: '#ffffff',
            boxShadow: '0 8px 30px rgba(139, 92, 246, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.84rem',
            fontWeight: 600
          }}
        >
          <PlusCircle size={16} />
          Nhấp chuột vào vị trí bất kỳ trên bản đồ để thêm trạm y tế mới
        </div>
      )}
    </div>
  );
}
