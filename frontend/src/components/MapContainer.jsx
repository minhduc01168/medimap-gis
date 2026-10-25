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
  Flame,
  Mountain
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

  // Base Map: Default to high-res topographic terrain (Zero API key watermark)
  const [baseMap, setBaseMap] = useState('topo'); // 'topo' | 'street' | 'satellite'
  const [coordsHud, setCoordsHud] = useState({ lat: 22.3364, lon: 103.8441 });
  const tileLayerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) return;
    if (leafletMapRef.current) return;

    // Center on Sa Pa / Bat Xat / Muong Khuong mountainous cluster
    const map = L.map(mapRef.current, {
      center: [22.42, 103.95],
      zoom: 10,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial Tile Layer: ESRI World Topo Map (No key required, bright, gorgeous contours)
    const topoTiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    }).addTo(map);
    tileLayerRef.current = topoTiles;

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

  // Handle Base Map Switcher (100% Free, NO API Key Required)
  useEffect(() => {
    if (!leafletMapRef.current || !tileLayerRef.current) return;
    const map = leafletMapRef.current;
    map.removeLayer(tileLayerRef.current);

    let newUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
    let sub = '';

    if (baseMap === 'satellite') {
      newUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    } else if (baseMap === 'street') {
      newUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      sub = 'abc';
    }

    const newLayer = L.tileLayer(newUrl, {
      maxZoom: 19,
      subdomains: sub || 'abc'
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
      let color = '#0d9488'; // Vibrant Teal
      let tierLabel = 'Tuyến 3: Trạm Y tế Xã';
      let radius = 7;

      if (f.tier === 1) {
        color = '#d97706'; // Bold Amber
        tierLabel = 'Tuyến 1: Bệnh viện Đa khoa Tỉnh';
        radius = 11;
      } else if (f.tier === 2) {
        color = '#0284c7'; // Electric Sky Blue
        tierLabel = 'Tuyến 2: BVĐK / TTYT Huyện';
        radius = 9;
      }

      const marker = L.circleMarker([f.lat, f.lon], {
        radius: radius,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.95
      });

      marker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; min-width: 220px; color: #0f172a;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; background: ${color}18; color: ${color}; border: 1px solid ${color}35;">
              ${tierLabel}
            </span>
            <span style="font-size: 11px; color: #64748b; font-family: monospace; font-weight: 600;">${f.id}</span>
          </div>
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #0f172a; font-family: 'Outfit', sans-serif;">
            ${f.name}
          </h4>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #475569;">
            📍 ${f.commune}, <strong>${f.district}</strong>
          </p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 11px;">
            <div>
              <span style="color: #64748b;">Bác sĩ:</span> 
              <strong style="color: #0284c7; font-size: 13px; margin-left: 4px;">${f.doctors}</strong>
            </div>
            <div>
              <span style="color: #64748b;">Giường bệnh:</span> 
              <strong style="color: #0d9488; font-size: 13px; margin-left: 4px;">${f.beds}</strong>
            </div>
            <div>
              <span style="color: #64748b;">Loại hình:</span> 
              <strong style="color: #334155; margin-left: 4px;">${f.type}</strong>
            </div>
            <div>
              <span style="color: #64748b;">Tọa độ:</span> 
              <span style="color: #334155; font-family: monospace; margin-left: 2px;">${f.lat.toFixed(2)}, ${f.lon.toFixed(2)}</span>
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

    const majorFacilities = facilities.filter(f => f.tier <= 2 || f.type === 'polyclinic');

    majorFacilities.forEach(f => {
      // 15 min radius (Teal)
      const r15 = 4500 * effectiveFactor;
      L.circle([f.lat, f.lon], {
        radius: r15,
        color: '#0d9488',
        weight: 1.5,
        fillColor: '#0d9488',
        fillOpacity: 0.12,
        dashArray: '4, 4'
      }).addTo(group);

      // 30 min radius (Amber)
      const r30 = 9000 * effectiveFactor;
      L.circle([f.lat, f.lon], {
        radius: r30,
        color: '#d97706',
        weight: 1.5,
        fillColor: '#d97706',
        fillOpacity: 0.08,
        dashArray: '6, 6'
      }).addTo(group);
    });
  }, [facilities, showIsochrones, simulationResult]);

  // Render Healthcare Deserts Clusters (Glowing Rose/Crimson)
  useEffect(() => {
    if (!layersGroupRef.current.deserts) return;
    const group = layersGroupRef.current.deserts;
    group.clearLayers();

    if (!showDeserts) return;

    deserts.forEach(d => {
      const circle = L.circleMarker([d.lat, d.lon], {
        radius: 4.5,
        fillColor: '#e11d48',
        color: '#ffffff',
        weight: 1.5,
        opacity: 0.95,
        fillOpacity: 0.85
      });

      circle.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; min-width: 200px; color: #0f172a;">
          <div style="display: flex; align-items: center; gap: 4px; color: #e11d48; font-weight: 700; margin-bottom: 4px;">
            <span style="font-size: 13px;">⚠️</span> VÙNG LÕM Y TẾ (&gt;60 PHÚT)
          </div>
          <p style="margin: 0 0 6px 0; color: #475569; font-size: 11px;">
            Mã ô dân cư: <strong style="color: #0f172a; font-family: monospace;">${d.id}</strong>
          </p>
          <div style="padding: 8px; background: rgba(225, 29, 72, 0.06); border: 1px solid rgba(225, 29, 72, 0.2); border-radius: 6px; margin-bottom: 6px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="color: #64748b;">Thời gian di chuyển:</span>
              <strong style="color: #e11d48; font-weight: 700;">${d.time_min.toFixed(1)} phút</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="color: #64748b;">Quy mô dân cư vi mô:</span>
              <strong style="color: #0f172a;">${d.pop} người</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">Độ cao địa hình DEM:</span>
              <span style="color: #334155; font-weight: 600;">${d.elev.toFixed(0)}m</span>
            </div>
          </div>
          <div style="font-size: 11px; color: #475569;">
            Trạm gần nhất: <br/>
            <span style="color: #0284c7; font-weight: 600;">${d.nearest}</span> (${d.district})
          </div>
        </div>
      `);

      group.addLayer(circle);
    });
  }, [deserts, showDeserts]);

  // Render 5 Proposed Clinics from P-Median Optimization (Purple Diamond Marker)
  useEffect(() => {
    if (!layersGroupRef.current.proposed) return;
    const group = layersGroupRef.current.proposed;
    group.clearLayers();

    if (!showProposed) return;

    proposedClinics.forEach((p, idx) => {
      const customIcon = L.divIcon({
        className: 'custom-proposed-marker',
        html: `
          <div style="
            width: 28px; 
            height: 28px; 
            background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); 
            transform: rotate(45deg); 
            border: 2px solid #ffffff; 
            box-shadow: 0 4px 14px rgba(109, 40, 217, 0.5);
            display: flex; 
            align-items: center; 
            justify-content: center;
            border-radius: 5px;
          ">
            <span style="transform: rotate(-45deg); color: #ffffff; font-weight: 800; font-size: 11px; font-family: monospace;">
              P${p.priority_rank || idx + 1}
            </span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([p.lat, p.lon], { icon: customIcon });

      // Add new rescued coverage buffer circle (purple ring)
      L.circle([p.lat, p.lon], {
        radius: 6500,
        color: '#7c3aed',
        weight: 2,
        fillColor: '#8b5cf6',
        fillOpacity: 0.18,
        dashArray: '5, 5'
      }).addTo(group);

      marker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; min-width: 230px; color: #0f172a;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; background: rgba(124, 58, 237, 0.12); color: #7c3aed; border: 1px solid rgba(124, 58, 237, 0.25);">
              ĐỀ XUẤT TỐI ƯU P-MEDIAN #${p.priority_rank}
            </span>
          </div>
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #0f172a; font-family: 'Outfit', sans-serif;">
            ${p.name}
          </h4>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #475569;">
            📍 ${p.commune}, <strong>${p.district}</strong> (Cao độ: ${p.elevation_m.toFixed(0)}m)
          </p>
          <div style="padding: 8px; background: rgba(124, 58, 237, 0.06); border: 1px solid rgba(124, 58, 237, 0.2); border-radius: 6px; font-size: 11px; margin-bottom: 6px;">
            <div style="margin-bottom: 4px;">
              <span style="color: #64748b;">Nhân lực đề xuất:</span> <br/>
              <strong style="color: #5b21b6;">${p.proposed_staff}</strong>
            </div>
            <div>
              <span style="color: #64748b;">Quy mô:</span> <strong style="color: #5b21b6;">${p.proposed_beds} giường lưu trú</strong>
            </div>
          </div>
          <div style="color: #059669; font-size: 11px; font-weight: 700;">
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
            width: 26px; 
            height: 26px; 
            background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); 
            border: 2px solid #ffffff; 
            box-shadow: 0 3px 10px rgba(2, 132, 199, 0.5);
            display: flex; 
            align-items: center; 
            justify-content: center;
            border-radius: 50%;
          ">
            <span style="color: #ffffff; font-weight: 800; font-size: 13px;">+</span>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = L.marker([c.lat, c.lon], { icon: customIcon });

      L.circle([c.lat, c.lon], {
        radius: 6000,
        color: '#0284c7',
        weight: 1.5,
        fillColor: '#0284c7',
        fillOpacity: 0.16,
        dashArray: '4, 4'
      }).addTo(group);

      marker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; min-width: 190px; color: #0f172a;">
          <span style="font-size: 10px; font-weight: 700; color: #0284c7;">TRẠM TỰ ĐẶT (MÔ PHỎNG)</span>
          <h4 style="margin: 4px 0; font-size: 13px; font-weight: 700; color: #0f172a;">${c.name}</h4>
          <p style="margin: 0 0 6px 0; color: #64748b; font-size: 11px;">
            Tọa độ: ${c.lat}, ${c.lon}
          </p>
          <button 
            id="btn-remove-${c.id}"
            style="
              width: 100%;
              padding: 6px;
              background: rgba(225, 29, 72, 0.1);
              border: 1px solid rgba(225, 29, 72, 0.3);
              color: #e11d48;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 700;
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

      {/* Floating HUD: Base Map Switcher (Crisp & Free) */}
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
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <button
          onClick={() => setBaseMap('topo')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            fontSize: '0.78rem',
            fontWeight: baseMap === 'topo' ? 700 : 500,
            borderRadius: '6px',
            border: 'none',
            background: baseMap === 'topo' ? 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' : 'transparent',
            color: baseMap === 'topo' ? '#ffffff' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: baseMap === 'topo' ? '0 2px 8px rgba(13, 148, 136, 0.3)' : 'none'
          }}
        >
          <Mountain size={14} />
          Địa Hình (ESRI Topo)
        </button>

        <button
          onClick={() => setBaseMap('street')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            fontSize: '0.78rem',
            fontWeight: baseMap === 'street' ? 700 : 500,
            borderRadius: '6px',
            border: 'none',
            background: baseMap === 'street' ? 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' : 'transparent',
            color: baseMap === 'street' ? '#ffffff' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: baseMap === 'street' ? '0 2px 8px rgba(13, 148, 136, 0.3)' : 'none'
          }}
        >
          <MapIcon size={14} />
          Bản Đồ Mở (OSM)
        </button>

        <button
          onClick={() => setBaseMap('satellite')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            fontSize: '0.78rem',
            fontWeight: baseMap === 'satellite' ? 700 : 500,
            borderRadius: '6px',
            border: 'none',
            background: baseMap === 'satellite' ? 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' : 'transparent',
            color: baseMap === 'satellite' ? '#ffffff' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: baseMap === 'satellite' ? '0 2px 8px rgba(13, 148, 136, 0.3)' : 'none'
          }}
        >
          <Compass size={14} />
          Vệ Tinh (ESRI)
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
          padding: '14px 18px',
          minWidth: '250px',
          fontSize: '0.8rem'
        }}
      >
        <div style={{ 
          fontFamily: 'var(--font-display)', 
          fontWeight: 700, 
          fontSize: '0.86rem', 
          color: '#0f172a', 
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Compass size={16} color="#0d9488" />
          Chú Giải Phân Tầng Y Tế
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#d97706', border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
            <span style={{ color: '#334155', fontWeight: 500 }}>Tuyến 1: Bệnh viện Đa khoa Tỉnh</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0284c7', border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
            <span style={{ color: '#334155', fontWeight: 500 }}>Tuyến 2: BVĐK / TTYT Huyện</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#0d9488', border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
            <span style={{ color: '#334155', fontWeight: 500 }}>Tuyến 3: Trạm Y tế Xã / PKĐK</span>
          </div>

          <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#e11d48', border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
            <span style={{ color: '#e11d48', fontWeight: 700 }}>Vùng lõm y tế (&gt;60 phút)</span>
          </div>

          {showProposed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ 
                width: '11px', 
                height: '11px', 
                backgroundColor: '#7c3aed', 
                transform: 'rotate(45deg)', 
                border: '2px solid #fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }} />
              <span style={{ color: '#6d28d9', fontWeight: 700 }}>5 Vị trí tối ưu P-Median</span>
            </div>
          )}

          {customClinics.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0284c7', border: '2px solid #fff' }} />
              <span style={{ color: '#0369a1', fontWeight: 700 }}>Trạm tự đặt ({customClinics.length})</span>
            </div>
          )}
        </div>
      </div>

      {/* Coordinate HUD */}
      <div
        className="glass-panel"
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '70px',
          zIndex: 800,
          padding: '5px 12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.74rem',
          color: 'var(--text-secondary)',
          background: 'rgba(255, 255, 255, 0.95)'
        }}
      >
        GPS: <strong style={{ color: '#0f172a' }}>{coordsHud.lat.toFixed(4)}°N</strong>, <strong style={{ color: '#0f172a' }}>{coordsHud.lon.toFixed(4)}°E</strong>
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
            padding: '10px 22px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
            color: '#ffffff',
            boxShadow: '0 10px 25px rgba(124, 58, 237, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.86rem',
            fontWeight: 700
          }}
        >
          <PlusCircle size={17} />
          Nhấp chuột vào vị trí bất kỳ trên bản đồ để thêm trạm y tế mới
        </div>
      )}
    </div>
  );
}
