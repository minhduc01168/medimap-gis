import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  Compass, 
  PlusCircle, 
  Mountain,
  Map as MapIcon,
  ChevronDown,
  ChevronUp,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Info,
  Check
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
  selectedDistrict = '',
  flyToTarget = null,
  t,
  language
}) {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const facilityMarkersRef = useRef({});
  const layersGroupRef = useRef({
    facilities: null,
    isochrones: null,
    deserts: null,
    proposed: null,
    custom: null,
    boundary: null
  });

  // Base Map: Default to high-res topographic terrain
  const [baseMap, setBaseMap] = useState('topo'); // 'topo' | 'street' | 'satellite'
  const [isBaseMapMenuOpen, setIsBaseMapMenuOpen] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [coordsHud, setCoordsHud] = useState({ lat: 22.3364, lon: 103.8441 });
  const tileLayerRef = useRef(null);

  // Precise pilot study bounding box
  const pilotBoundsRef = useRef(L.latLngBounds(
    [22.18, 103.48], // South-West
    [22.88, 104.38]  // North-East
  ));

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) return;
    if (leafletMapRef.current) return;

    const pilotBounds = pilotBoundsRef.current;
    const maxPanningBounds = L.latLngBounds(
      [22.08, 103.35],
      [22.98, 104.48]
    );

    const map = L.map(mapRef.current, {
      center: [22.50, 103.92],
      zoom: 10,
      minZoom: 9.6,
      maxZoom: 18,
      maxBounds: maxPanningBounds,
      maxBoundsViscosity: 0.95,
      zoomControl: false, // Custom Open-Design Dock zoom buttons instead
      attributionControl: false
    });

    // Fit tightly to 3 pilot districts
    map.fitBounds(pilotBounds, { padding: [30, 30] });

    // Initial Tile Layer: ESRI World Topo Map (Clean, high relief, zero watermarks)
    const topoTiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    }).addTo(map);
    tileLayerRef.current = topoTiles;

    // Track mouse coordinates
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
          name: language === 'vi' 
            ? `Trạm Y tế Đề xuất #${window._customClinicsCount + 1}`
            : `Proposed Clinic #${window._customClinicsCount + 1}`,
          lat: Number(e.latlng.lat.toFixed(4)),
          lon: Number(e.latlng.lng.toFixed(4)),
          elevation_m: 850.0,
          doctors: 2,
          beds: 5
        });
      }
    });

    // Initialize Layer Groups
    layersGroupRef.current.boundary = L.layerGroup().addTo(map);
    layersGroupRef.current.isochrones = L.layerGroup().addTo(map);
    layersGroupRef.current.deserts = L.layerGroup().addTo(map);
    layersGroupRef.current.facilities = L.layerGroup().addTo(map);
    layersGroupRef.current.proposed = L.layerGroup().addTo(map);
    layersGroupRef.current.custom = L.layerGroup().addTo(map);

    // Draw Study Area Boundary Outline
    const boundaryRect = L.rectangle(pilotBounds, {
      color: '#0d9488',
      weight: 2,
      dashArray: '6, 6',
      fillColor: '#0d9488',
      fillOpacity: 0.02,
      interactive: false
    });
    layersGroupRef.current.boundary.addLayer(boundaryRect);

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

  // Recenter map function
  const handleRecenter = useCallback(() => {
    if (!leafletMapRef.current) return;
    leafletMapRef.current.fitBounds(pilotBoundsRef.current, { 
      padding: [40, 40],
      duration: 1.0,
      easeLinearity: 0.25
    });
  }, []);

  // Zoom handlers
  const handleZoomIn = () => {
    if (leafletMapRef.current) leafletMapRef.current.zoomIn();
  };
  const handleZoomOut = () => {
    if (leafletMapRef.current) leafletMapRef.current.zoomOut();
  };

  // FlyTo Handler for when user selects a facility in Sidebar
  useEffect(() => {
    if (!flyToTarget || !leafletMapRef.current) return;
    const { lat, lon, id } = flyToTarget;
    leafletMapRef.current.flyTo([lat, lon], 14, {
      duration: 1.2,
      easeLinearity: 0.25
    });

    const marker = facilityMarkersRef.current[id];
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 700);
    }
  }, [flyToTarget]);

  // Render 67 Health Facilities
  useEffect(() => {
    if (!layersGroupRef.current.facilities) return;
    const group = layersGroupRef.current.facilities;
    group.clearLayers();
    facilityMarkersRef.current = {};

    if (!showFacilities) return;

    let filtered = facilities;
    if (selectedDistrict) {
      filtered = filtered.filter(f => f.district === selectedDistrict);
    }

    filtered.forEach(f => {
      let color = '#0d9488'; // Vibrant Teal
      let tierLabel = language === 'vi' ? 'Tuyến 3: Trạm Y tế Xã' : 'Tier 3: Commune Health Station';
      let radius = 7;

      if (f.tier === 1) {
        color = '#d97706'; // Bold Amber
        tierLabel = language === 'vi' ? 'Tuyến 1: Bệnh viện Đa khoa Tỉnh' : 'Tier 1: Provincial General Hospital';
        radius = 11;
      } else if (f.tier === 2) {
        color = '#0284c7'; // Electric Sky Blue
        tierLabel = language === 'vi' ? 'Tuyến 2: BVĐK / TTYT Huyện' : 'Tier 2: District Hospital / Health Center';
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
              <span style="color: #64748b;">${t.popupDoctors}:</span> 
              <strong style="color: #0284c7; font-size: 13px; margin-left: 4px;">${f.doctors}</strong>
            </div>
            <div>
              <span style="color: #64748b;">${t.popupBeds}:</span> 
              <strong style="color: #0d9488; font-size: 13px; margin-left: 4px;">${f.beds}</strong>
            </div>
            <div>
              <span style="color: #64748b;">${t.popupType}:</span> 
              <strong style="color: #334155; margin-left: 4px;">${f.type}</strong>
            </div>
            <div>
              <span style="color: #64748b;">${t.popupCoords}:</span> 
              <span style="color: #334155; font-family: monospace; margin-left: 2px;">${f.lat.toFixed(2)}, ${f.lon.toFixed(2)}</span>
            </div>
          </div>
        </div>
      `);

      facilityMarkersRef.current[f.id] = marker;
      group.addLayer(marker);
    });
  }, [facilities, showFacilities, selectedDistrict, language, t]);

  // Render Isochrone Rings
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

  // Render Healthcare Deserts Clusters
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
            <span style="font-size: 13px;">⚠️</span> ${t.popupDesertTitle}
          </div>
          <p style="margin: 0 0 6px 0; color: #475569; font-size: 11px;">
            ${t.popupCellId}: <strong style="color: #0f172a; font-family: monospace;">${d.id}</strong>
          </p>
          <div style="padding: 8px; background: rgba(225, 29, 72, 0.06); border: 1px solid rgba(225, 29, 72, 0.2); border-radius: 6px; margin-bottom: 6px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="color: #64748b;">${t.popupTravelTime}:</span>
              <strong style="color: #e11d48; font-weight: 700;">${d.time_min.toFixed(1)} ${language === 'vi' ? 'phút' : 'min'}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="color: #64748b;">${t.popupMicroPop}:</span>
              <strong style="color: #0f172a;">${d.pop} ${t.peopleUnit}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">${t.popupElevation}:</span>
              <span style="color: #334155; font-weight: 600;">${d.elev.toFixed(0)}m</span>
            </div>
          </div>
          <div style="font-size: 11px; color: #475569;">
            ${t.popupNearestFacility}: <br/>
            <span style="color: #0284c7; font-weight: 600;">${d.nearest}</span> (${d.district})
          </div>
        </div>
      `);

      group.addLayer(circle);
    });
  }, [deserts, showDeserts, language, t]);

  // Render 5 Proposed Clinics from P-Median Optimization
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
              ${t.popupProposedTitle} #${p.priority_rank}
            </span>
          </div>
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #0f172a; font-family: 'Outfit', sans-serif;">
            ${p.name}
          </h4>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #475569;">
            📍 ${p.commune}, <strong>${p.district}</strong> (${t.popupElevation}: ${p.elevation_m.toFixed(0)}m)
          </p>
          <div style="padding: 8px; background: rgba(124, 58, 237, 0.06); border: 1px solid rgba(124, 58, 237, 0.2); border-radius: 6px; font-size: 11px; margin-bottom: 6px;">
            <div style="margin-bottom: 4px;">
              <span style="color: #64748b;">${t.popupProposedStaff}:</span> <br/>
              <strong style="color: #5b21b6;">${p.proposed_staff}</strong>
            </div>
            <div>
              <span style="color: #64748b;">${t.popupProposedBeds}:</span> <strong style="color: #5b21b6;">${p.proposed_beds} ${language === 'vi' ? 'giường' : 'beds'}</strong>
            </div>
          </div>
          <div style="color: #059669; font-size: 11px; font-weight: 700;">
            ${t.popupProposedGain}
          </div>
        </div>
      `);

      group.addLayer(marker);
    });
  }, [proposedClinics, showProposed, language, t]);

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
          <span style="font-size: 10px; font-weight: 700; color: #0284c7;">${t.popupCustomTitle}</span>
          <h4 style="margin: 4px 0; font-size: 13px; font-weight: 700; color: #0f172a;">${c.name}</h4>
          <p style="margin: 0 0 6px 0; color: #64748b; font-size: 11px;">
            ${t.popupCoords}: ${c.lat}, ${c.lon}
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
            ${t.popupRemoveBtn}
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
  }, [customClinics, onRemoveCustomClinic, t]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Map Root DOM (100% Full Bleed) */}
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          cursor: isAddingClinic ? 'crosshair' : 'grab' 
        }} 
      />

      {/* ============================================================== */}
      {/* OPEN-DESIGN FLOATING MAP CONTROL DOCK (TOP RIGHT)              */}
      {/* ============================================================== */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 880,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'flex-end'
      }}>
        {/* Vertical Action Dock */}
        <div 
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.98)',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.1)',
            overflow: 'hidden'
          }}
        >
          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            style={{
              width: '38px',
              height: '38px',
              border: 'none',
              background: 'transparent',
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
            title="Zoom in"
          >
            <ZoomIn size={18} />
          </button>

          <div style={{ height: '1px', background: '#e2e8f0' }} />

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            style={{
              width: '38px',
              height: '38px',
              border: 'none',
              background: 'transparent',
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
            title="Zoom out"
          >
            <ZoomOut size={18} />
          </button>

          <div style={{ height: '1px', background: '#e2e8f0' }} />

          {/* Re-center bounds */}
          <button
            onClick={handleRecenter}
            style={{
              width: '38px',
              height: '38px',
              border: 'none',
              background: 'transparent',
              color: '#0d9488',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
            title={t.mapRecenter}
          >
            <Maximize2 size={17} />
          </button>

          <div style={{ height: '1px', background: '#e2e8f0' }} />

          {/* Base Layer Switcher Button */}
          <button
            onClick={() => setIsBaseMapMenuOpen(!isBaseMapMenuOpen)}
            style={{
              width: '38px',
              height: '38px',
              border: 'none',
              background: isBaseMapMenuOpen ? '#f0fdfa' : 'transparent',
              color: isBaseMapMenuOpen ? '#0d9488' : '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Base Map Layer"
          >
            <Layers size={18} />
          </button>

          <div style={{ height: '1px', background: '#e2e8f0' }} />

          {/* Legend Toggle Button */}
          <button
            onClick={() => setIsLegendOpen(!isLegendOpen)}
            style={{
              width: '38px',
              height: '38px',
              border: 'none',
              background: isLegendOpen ? '#f0fdfa' : 'transparent',
              color: isLegendOpen ? '#0d9488' : '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title={t.mapLegendToggle}
          >
            <Compass size={18} />
          </button>
        </div>

        {/* Base Layer Selector Popover Menu */}
        {isBaseMapMenuOpen && (
          <div
            className="glass-panel"
            style={{
              width: '180px',
              padding: '6px',
              background: 'rgba(255, 255, 255, 0.98)',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              boxShadow: '0 12px 28px rgba(15, 23, 42, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: '#64748b',
              padding: '4px 8px'
            }}>
              {language === 'vi' ? 'Bản Đồ Nền' : 'Base Map'}
            </div>

            <button
              onClick={() => { setBaseMap('topo'); setIsBaseMapMenuOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                borderRadius: '8px',
                border: 'none',
                background: baseMap === 'topo' ? '#f0fdfa' : 'transparent',
                color: baseMap === 'topo' ? '#0f766e' : '#334155',
                fontWeight: baseMap === 'topo' ? 700 : 500,
                fontSize: '0.76rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mountain size={14} color={baseMap === 'topo' ? '#0d9488' : '#64748b'} />
                <span>{t.mapBaseTopo}</span>
              </div>
              {baseMap === 'topo' && <Check size={14} color="#0d9488" />}
            </button>

            <button
              onClick={() => { setBaseMap('street'); setIsBaseMapMenuOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                borderRadius: '8px',
                border: 'none',
                background: baseMap === 'street' ? '#f0fdfa' : 'transparent',
                color: baseMap === 'street' ? '#0f766e' : '#334155',
                fontWeight: baseMap === 'street' ? 700 : 500,
                fontSize: '0.76rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapIcon size={14} color={baseMap === 'street' ? '#0d9488' : '#64748b'} />
                <span>{t.mapBaseStreet}</span>
              </div>
              {baseMap === 'street' && <Check size={14} color="#0d9488" />}
            </button>

            <button
              onClick={() => { setBaseMap('satellite'); setIsBaseMapMenuOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                borderRadius: '8px',
                border: 'none',
                background: baseMap === 'satellite' ? '#f0fdfa' : 'transparent',
                color: baseMap === 'satellite' ? '#0f766e' : '#334155',
                fontWeight: baseMap === 'satellite' ? 700 : 500,
                fontSize: '0.76rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Compass size={14} color={baseMap === 'satellite' ? '#0d9488' : '#64748b'} />
                <span>{t.mapBaseSatellite}</span>
              </div>
              {baseMap === 'satellite' && <Check size={14} color="#0d9488" />}
            </button>
          </div>
        )}

        {/* Legend Drawer Card */}
        {isLegendOpen && (
          <div
            className="glass-panel"
            style={{
              width: '260px',
              padding: '12px 14px',
              background: 'rgba(255, 255, 255, 0.98)',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              boxShadow: '0 12px 32px rgba(15, 23, 42, 0.16)',
              fontSize: '0.76rem'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: '#0f172a'
            }}>
              <span>{t.legendTitle}</span>
              <button
                onClick={() => setIsLegendOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#d97706', border: '1.5px solid #fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
                <span style={{ color: '#334155' }}>{t.legendTier1}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#0284c7', border: '1.5px solid #fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
                <span style={{ color: '#334155' }}>{t.legendTier2}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0d9488', border: '1.5px solid #fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
                <span style={{ color: '#334155' }}>{t.legendTier3}</span>
              </div>

              <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#e11d48', border: '1.5px solid #fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
                <span style={{ color: '#e11d48', fontWeight: 700 }}>{t.legendDesert}</span>
              </div>

              {showProposed && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    width: '9px', 
                    height: '9px', 
                    backgroundColor: '#7c3aed', 
                    transform: 'rotate(45deg)', 
                    border: '1.5px solid #fff',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                  }} />
                  <span style={{ color: '#6d28d9', fontWeight: 700 }}>{t.legendProposed}</span>
                </div>
              )}

              {customClinics.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#0284c7', border: '1.5px solid #fff' }} />
                  <span style={{ color: '#0369a1', fontWeight: 700 }}>{t.legendCustom} ({customClinics.length})</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Coordinate & Focus Area HUD Pill (Bottom Right) */}
      <div
        className="glass-panel"
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          zIndex: 800,
          padding: '6px 12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: '#475569',
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #cbd5e1',
          borderRadius: '9999px',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0d9488' }} />
        <span>{t.coordsLabel}: <strong style={{ color: '#0f172a' }}>{coordsHud.lat.toFixed(4)}°N, {coordsHud.lon.toFixed(4)}°E</strong></span>
        <span style={{ color: '#cbd5e1' }}>|</span>
        <span style={{ color: '#0d9488', fontWeight: 600 }}>Lào Cai</span>
      </div>

      {/* Banner indicator when in Add Clinic Mode */}
      {isAddingClinic && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 900,
            padding: '8px 20px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            fontWeight: 700
          }}
        >
          <PlusCircle size={16} />
          {t.clickToAddHint}
        </div>
      )}
    </div>
  );
}
