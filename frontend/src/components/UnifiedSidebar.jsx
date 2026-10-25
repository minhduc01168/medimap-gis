import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  BarChart3, 
  Building2, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Sparkles, 
  Bike, 
  Ambulance, 
  Layers, 
  Filter, 
  Globe2, 
  Zap, 
  AlertCircle, 
  Search, 
  Navigation, 
  MapPin, 
  Users, 
  Bed,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';

export default function UnifiedSidebar({
  // Simulation Props
  params,
  setParams,
  layers,
  setLayers,
  selectedDistrict,
  setSelectedDistrict,
  onResetSimulation,
  customClinicsCount,
  onClearCustomClinics,
  
  // Stats Props
  simulationResult,
  moranStats,
  districtStats = [],
  
  // Facilities Props
  facilities = [],
  onFlyToFacility,
  
  // Shared
  t,
  language
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('simulation'); // 'simulation' | 'analytics' | 'facilities'
  const [facilitySearch, setFacilitySearch] = useState('');
  const [facilityFilterTier, setFacilityFilterTier] = useState('all');

  // Simulation change handlers
  const handleSpeedChange = (e) => {
    setParams({ ...params, base_speed_kmh: Number(e.target.value) });
  };

  const handleSlopeWeightChange = (e) => {
    setParams({ ...params, slope_friction_weight: Number(e.target.value) });
  };

  const handleVehicleChange = (vehicle) => {
    const speed = vehicle === 'ambulance' ? 42.0 : 32.0;
    setParams({
      ...params,
      vehicle_type: vehicle,
      base_speed_kmh: speed
    });
  };

  // Stats calculation
  const popData = simulationResult?.population_accessibility || {
    less_than_15min: { population: 78723, percentage: 35.93 },
    between_15_and_30min: { population: 57754, percentage: 26.36 },
    between_30_and_60min: { population: 48119, percentage: 21.96 },
    greater_than_60min_deserts: { population: 34498, percentage: 15.75 }
  };
  const totalPop = 219094;

  // Filter facilities
  const filteredFacilities = useMemo(() => {
    return facilities.filter(f => {
      const matchDistrict = !selectedDistrict || f.district === selectedDistrict;
      const matchTier = facilityFilterTier === 'all' || f.tier === Number(facilityFilterTier);
      const query = facilitySearch.toLowerCase().trim();
      const matchQuery = !query || 
        f.name.toLowerCase().includes(query) || 
        f.commune.toLowerCase().includes(query) || 
        f.district.toLowerCase().includes(query) ||
        f.id.toLowerCase().includes(query);
      return matchDistrict && matchTier && matchQuery;
    });
  }, [facilities, selectedDistrict, facilityFilterTier, facilitySearch]);

  return (
    <>
      {/* Floating Expand Trigger when Sidebar is Collapsed */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="glass-panel"
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            zIndex: 890,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            background: 'rgba(255, 255, 255, 0.98)',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
            cursor: 'pointer',
            color: '#0f172a',
            fontWeight: 700,
            fontSize: '0.82rem',
            fontFamily: 'var(--font-display)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          title={t.sidebarExpand}
        >
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Sliders size={14} />
          </div>
          <span>{t.sidebarTabSimulation} / {t.sidebarTabAnalytics}</span>
          <ChevronRight size={16} color="#0d9488" />
        </button>
      )}

      {/* Main Unified Open-Design Sidebar Container */}
      <aside
        className="glass-panel"
        style={{
          position: 'absolute',
          top: '16px',
          bottom: '16px',
          left: '16px',
          width: '380px',
          zIndex: 890,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(255, 255, 255, 0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid #cbd5e1',
          borderRadius: '16px',
          boxShadow: '0 16px 40px -10px rgba(15, 23, 42, 0.14), 0 0 0 1px rgba(0,0,0,0.03)',
          transform: isCollapsed ? 'translateX(calc(-100% - 24px))' : 'translateX(0)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden'
        }}
      >
        {/* Sidebar Header Bar */}
        <div style={{
          padding: '12px 16px 10px 16px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#ffffff'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#0d9488',
                boxShadow: '0 0 0 3px rgba(13, 148, 136, 0.2)'
              }} />
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.01em',
                margin: 0
              }}>
                MediMap Studio
              </h2>
            </div>
            <p style={{
              margin: '2px 0 0 16px',
              fontSize: '0.72rem',
              color: '#64748b',
              fontWeight: 500
            }}>
              {language === 'vi' ? 'Sa Pa • Bát Xát • Mường Khương' : 'Sa Pa • Bat Xat • Muong Khuong'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={onResetSimulation}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                color: '#64748b',
                cursor: 'pointer',
                padding: '5px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.72rem',
                fontWeight: 600,
                transition: 'all 0.15s ease'
              }}
              title={t.simReset}
            >
              <RotateCcw size={12} />
              <span>{t.simReset}</span>
            </button>

            <button
              onClick={() => setIsCollapsed(true)}
              style={{
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                color: '#475569',
                cursor: 'pointer',
                padding: '5px 7px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
              title={t.sidebarCollapse}
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>

        {/* Segmented Tab Bar Switcher */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '4px',
          padding: '8px 12px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <button
            onClick={() => setActiveTab('simulation')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '7px 4px',
              borderRadius: '8px',
              border: activeTab === 'simulation' ? '1px solid rgba(13, 148, 136, 0.3)' : '1px solid transparent',
              background: activeTab === 'simulation' ? '#ffffff' : 'transparent',
              color: activeTab === 'simulation' ? '#0d9488' : '#64748b',
              fontWeight: activeTab === 'simulation' ? 700 : 600,
              fontSize: '0.76rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'simulation' ? '0 2px 6px rgba(0,0,0,0.04)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Sliders size={14} />
            <span>{t.sidebarTabSimulation}</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '7px 4px',
              borderRadius: '8px',
              border: activeTab === 'analytics' ? '1px solid rgba(2, 132, 199, 0.3)' : '1px solid transparent',
              background: activeTab === 'analytics' ? '#ffffff' : 'transparent',
              color: activeTab === 'analytics' ? '#0284c7' : '#64748b',
              fontWeight: activeTab === 'analytics' ? 700 : 600,
              fontSize: '0.76rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'analytics' ? '0 2px 6px rgba(0,0,0,0.04)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <BarChart3 size={14} />
            <span>{t.sidebarTabAnalytics}</span>
          </button>

          <button
            onClick={() => setActiveTab('facilities')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '7px 4px',
              borderRadius: '8px',
              border: activeTab === 'facilities' ? '1px solid rgba(124, 58, 237, 0.3)' : '1px solid transparent',
              background: activeTab === 'facilities' ? '#ffffff' : 'transparent',
              color: activeTab === 'facilities' ? '#7c3aed' : '#64748b',
              fontWeight: activeTab === 'facilities' ? 700 : 600,
              fontSize: '0.76rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'facilities' ? '0 2px 6px rgba(0,0,0,0.04)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Building2 size={14} />
            <span>{t.sidebarTabFacilities}</span>
          </button>
        </div>

        {/* Tab Body (Scrollable Container) */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {/* ============================================================== */}
          {/* TAB 1: SIMULATION / MÔ PHỎNG                                    */}
          {/* ============================================================== */}
          {activeTab === 'simulation' && (
            <>
              {/* Layer Visibility Section */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '10px'
                }}>
                  <Layers size={14} color="#0d9488" />
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#475569'
                  }}>
                    {t.simLayerSection}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    borderRadius: '8px',
                    background: layers.facilities ? '#f0fdfa' : '#f8fafc',
                    border: `1px solid ${layers.facilities ? '#ccfbf1' : '#e2e8f0'}`,
                    cursor: 'pointer',
                    fontSize: '0.78rem'
                  }}>
                    <span style={{ color: '#0f172a', fontWeight: 600 }}>{t.layerFacilities}</span>
                    <input
                      type="checkbox"
                      checked={layers.facilities}
                      onChange={(e) => setLayers({ ...layers, facilities: e.target.checked })}
                      style={{ accentColor: '#0d9488', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    borderRadius: '8px',
                    background: layers.isochrones ? '#f0f9ff' : '#f8fafc',
                    border: `1px solid ${layers.isochrones ? '#e0f2fe' : '#e2e8f0'}`,
                    cursor: 'pointer',
                    fontSize: '0.78rem'
                  }}>
                    <span style={{ color: '#0f172a', fontWeight: 600 }}>{t.layerIsochrones}</span>
                    <input
                      type="checkbox"
                      checked={layers.isochrones}
                      onChange={(e) => setLayers({ ...layers, isochrones: e.target.checked })}
                      style={{ accentColor: '#0284c7', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    borderRadius: '8px',
                    background: layers.deserts ? '#fff1f2' : '#f8fafc',
                    border: `1px solid ${layers.deserts ? '#ffe4e6' : '#e2e8f0'}`,
                    cursor: 'pointer',
                    fontSize: '0.78rem'
                  }}>
                    <span style={{ color: '#be123c', fontWeight: 700 }}>{t.layerDeserts}</span>
                    <input
                      type="checkbox"
                      checked={layers.deserts}
                      onChange={(e) => setLayers({ ...layers, deserts: e.target.checked })}
                      style={{ accentColor: '#e11d48', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                  </label>
                </div>
              </div>

              {/* 5 P-Median Optimal Stations Feature Card */}
              <div style={{
                background: layers.proposed 
                  ? 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)' 
                  : '#ffffff',
                border: `1px solid ${layers.proposed ? '#e879f9' : '#e2e8f0'}`,
                borderRadius: '12px',
                padding: '12px',
                boxShadow: layers.proposed ? '0 4px 16px rgba(168, 85, 247, 0.15)' : '0 1px 3px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: layers.proposed ? '#7c3aed' : '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: layers.proposed ? '#ffffff' : '#64748b'
                    }}>
                      <Sparkles size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                        {t.simProposedTitle}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#7c3aed', fontWeight: 700 }}>
                        {language === 'vi' ? 'Thuật toán P-Median / MCLP' : 'P-Median & MCLP Algorithm'}
                      </div>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={layers.proposed}
                    onChange={(e) => setLayers({ ...layers, proposed: e.target.checked })}
                    style={{
                      width: '20px',
                      height: '20px',
                      accentColor: '#7c3aed',
                      cursor: 'pointer'
                    }}
                  />
                </div>

                <p style={{
                  margin: 0,
                  fontSize: '0.74rem',
                  lineHeight: 1.45,
                  color: layers.proposed ? '#581c87' : '#64748b',
                  fontWeight: layers.proposed ? 600 : 400
                }}>
                  {layers.proposed ? t.simProposedActiveDesc : t.simProposedInactiveDesc}
                </p>

                {layers.proposed && (
                  <div style={{
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: 'rgba(124, 58, 237, 0.1)',
                    color: '#6d28d9',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}>
                    <TrendingDown size={14} />
                    <span>{language === 'vi' ? 'Vùng lõm: 15.75% ➔ 2.25% (-85.7%)' : 'Medical Desert: 15.75% ➔ 2.25% (-85.7%)'}</span>
                  </div>
                )}
              </div>

              {/* Vehicle Travel Mode Section */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: '#475569',
                  marginBottom: '8px'
                }}>
                  {t.simVehicleSection}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={() => handleVehicleChange('motorbike')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '10px 8px',
                      borderRadius: '10px',
                      border: params.vehicle_type === 'motorbike' ? '1.5px solid #0d9488' : '1px solid #e2e8f0',
                      background: params.vehicle_type === 'motorbike' ? '#f0fdfa' : '#f8fafc',
                      color: params.vehicle_type === 'motorbike' ? '#0f766e' : '#64748b',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Bike size={20} color={params.vehicle_type === 'motorbike' ? '#0d9488' : '#94a3b8'} />
                    <span style={{ fontSize: '0.76rem', fontWeight: 700 }}>{t.vehicleMotorbike}</span>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#64748b' }}>32 km/h</span>
                  </button>

                  <button
                    onClick={() => handleVehicleChange('ambulance')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '10px 8px',
                      borderRadius: '10px',
                      border: params.vehicle_type === 'ambulance' ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                      background: params.vehicle_type === 'ambulance' ? '#f0f9ff' : '#f8fafc',
                      color: params.vehicle_type === 'ambulance' ? '#0369a1' : '#64748b',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Ambulance size={20} color={params.vehicle_type === 'ambulance' ? '#0284c7' : '#94a3b8'} />
                    <span style={{ fontSize: '0.76rem', fontWeight: 700 }}>{t.vehicleAmbulance}</span>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#64748b' }}>42 km/h</span>
                  </button>
                </div>
              </div>

              {/* Sliders: Base Speed & Tobler Friction Weight */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {/* Speed Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 600, color: '#334155' }}>
                      {t.simSpeedLabel}
                    </span>
                    <span style={{
                      fontSize: '0.74rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: '#0d9488',
                      background: '#f0fdfa',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      border: '1px solid #ccfbf1'
                    }}>
                      {params.base_speed_kmh.toFixed(1)} km/h
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="55"
                    step="1"
                    value={params.base_speed_kmh}
                    onChange={handleSpeedChange}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.66rem', color: '#94a3b8' }}>
                    <span>{t.simSpeedMin}</span>
                    <span>{t.simSpeedMax}</span>
                  </div>
                </div>

                <div style={{ height: '1px', background: '#f1f5f9' }} />

                {/* Tobler Slope Weight Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 600, color: '#334155' }}>
                      {t.simSlopeLabel}
                    </span>
                    <span style={{
                      fontSize: '0.74rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: '#d97706',
                      background: '#fffbeb',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      border: '1px solid #fef3c7'
                    }}>
                      α = {params.slope_friction_weight.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={params.slope_friction_weight}
                    onChange={handleSlopeWeightChange}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.66rem', color: '#94a3b8' }}>
                    <span>{t.simSlopeMin}</span>
                    <span>{t.simSlopeMax}</span>
                  </div>
                </div>
              </div>

              {/* District Spatial Filter */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '8px'
                }}>
                  <Filter size={14} color="#0284c7" />
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#475569'
                  }}>
                    {t.simDistrictFilter}
                  </span>
                </div>

                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">{t.districtAll}</option>
                  <option value="Thị xã Sa Pa">{t.districtSapa}</option>
                  <option value="Huyện Bát Xát">{t.districtBatxat}</option>
                  <option value="Huyện Mường Khương">{t.districtMuongkhuong}</option>
                </select>
              </div>

              {/* Custom Added Clinics Notice */}
              {customClinicsCount > 0 && (
                <div style={{
                  background: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '10px',
                  padding: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ fontSize: '0.76rem', color: '#0369a1', fontWeight: 600 }}>
                    📍 <strong>{customClinicsCount}</strong> {t.customClinicsActive}
                  </div>
                  <button
                    onClick={onClearCustomClinics}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #0284c7',
                      color: '#0284c7',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {t.btnClearCustom}
                  </button>
                </div>
              )}
            </>
          )}

          {/* ============================================================== */}
          {/* TAB 2: ANALYTICS & KPI / PHÂN TÍCH                             */}
          {/* ============================================================== */}
          {activeTab === 'analytics' && (
            <>
              {/* Accessibility Distribution Multi-Segment Bar */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155' }}>
                    {t.statsAccessTitle}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                    {totalPop.toLocaleString()} {t.peopleUnit}
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{
                  display: 'flex',
                  height: '10px',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  background: '#e2e8f0',
                  marginBottom: '12px'
                }}>
                  <div 
                    style={{ 
                      width: `${popData.less_than_15min.percentage}%`, 
                      background: 'linear-gradient(90deg, #0f766e, #0d9488)',
                      transition: 'width 0.3s ease'
                    }} 
                    title={`<15m: ${popData.less_than_15min.percentage}%`}
                  />
                  <div 
                    style={{ 
                      width: `${popData.between_15_and_30min.percentage}%`, 
                      background: 'linear-gradient(90deg, #0369a1, #0284c7)',
                      transition: 'width 0.3s ease'
                    }} 
                    title={`15-30m: ${popData.between_15_and_30min.percentage}%`}
                  />
                  <div 
                    style={{ 
                      width: `${popData.between_30_and_60min.percentage}%`, 
                      background: 'linear-gradient(90deg, #b45309, #d97706)',
                      transition: 'width 0.3s ease'
                    }} 
                    title={`30-60m: ${popData.between_30_and_60min.percentage}%`}
                  />
                  <div 
                    style={{ 
                      width: `${popData.greater_than_60min_deserts.percentage}%`, 
                      background: 'linear-gradient(90deg, #be123c, #e11d48)',
                      transition: 'width 0.3s ease'
                    }} 
                    title={`>60m: ${popData.greater_than_60min_deserts.percentage}%`}
                  />
                </div>

                {/* Detailed Band List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0d9488' }} />
                      <span style={{ color: '#334155' }}>{t.bandUnder15}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0d9488' }}>
                      {popData.less_than_15min.population.toLocaleString()} ({popData.less_than_15min.percentage}%)
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }} />
                      <span style={{ color: '#334155' }}>{t.band15to30}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0284c7' }}>
                      {popData.between_15_and_30min.population.toLocaleString()} ({popData.between_15_and_30min.percentage}%)
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d97706' }} />
                      <span style={{ color: '#334155' }}>{t.band30to60}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#d97706' }}>
                      {popData.between_30_and_60min.population.toLocaleString()} ({popData.between_30_and_60min.percentage}%)
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', background: '#fff1f2', padding: '4px 6px', borderRadius: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e11d48' }} />
                      <span style={{ color: '#be123c', fontWeight: 700 }}>{t.bandOver60}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#e11d48' }}>
                      {popData.greater_than_60min_deserts.population.toLocaleString()} ({popData.greater_than_60min_deserts.percentage}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Metric Quick Cards (2x2 Grid) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
                    {language === 'vi' ? 'Tiếp cận <30 phút' : 'Access <30 min'}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0d9488', fontFamily: 'var(--font-display)', marginTop: '2px' }}>
                    {(popData.less_than_15min.percentage + popData.between_15_and_30min.percentage).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>
                    {(popData.less_than_15min.population + popData.between_15_and_30min.population).toLocaleString()} {t.peopleUnit}
                  </div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px' }}>
                  <div style={{ fontSize: '0.68rem', color: '#be123c', fontWeight: 600 }}>
                    {language === 'vi' ? 'Dân số vùng lõm' : 'Desert Population'}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#e11d48', fontFamily: 'var(--font-display)', marginTop: '2px' }}>
                    {popData.greater_than_60min_deserts.percentage}%
                  </div>
                  <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>
                    {popData.greater_than_60min_deserts.population.toLocaleString()} {t.peopleUnit}
                  </div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
                    {language === 'vi' ? 'Tổng mạng lưới CSYT' : 'Total Facilities'}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284c7', fontFamily: 'var(--font-display)', marginTop: '2px' }}>
                    67
                  </div>
                  <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>
                    100% {language === 'vi' ? 'đối soát vệ tinh' : 'verified'}
                  </div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
                    {language === 'vi' ? 'Mật độ BS trung bình' : 'Avg Doctor Density'}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#7c3aed', fontFamily: 'var(--font-display)', marginTop: '2px' }}>
                    0.68
                  </div>
                  <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>
                    {language === 'vi' ? 'BS / 1.000 dân' : 'MD / 1k pop'}
                  </div>
                </div>
              </div>

              {/* Spatial Autocorrelation: Moran's I Card */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Globe2 size={15} color="#0284c7" />
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#0f172a' }}>
                    {t.moranTitle}
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '8px',
                  marginBottom: '8px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.66rem', color: '#64748b' }}>Moran's I</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284c7', fontFamily: 'var(--font-mono)' }}>
                      0.9306
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.66rem', color: '#64748b' }}>Z-Score (p &lt; 0.001)</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0d9488', fontFamily: 'var(--font-mono)' }}>
                      +298.29
                    </div>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '0.72rem', color: '#475569', lineHeight: 1.45 }}>
                  {t.moranDesc}
                </p>
              </div>

              {/* District E2SFCA Table */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  {t.districtTableTitle}
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                      <th style={{ padding: '4px 6px' }}>{t.colDistrict}</th>
                      <th style={{ padding: '4px 6px', textAlign: 'right' }}>{t.colPop}</th>
                      <th style={{ padding: '4px 6px', textAlign: 'right' }}>{t.colDocPer1k}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {districtStats.map((d, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '6px', fontWeight: 600, color: '#0f172a' }}>{d.district}</td>
                        <td style={{ padding: '6px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#475569' }}>
                          {d.population?.toLocaleString()}
                        </td>
                        <td style={{ padding: '6px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0d9488' }}>
                          {d.e2sfca_mean ? d.e2sfca_mean.toFixed(2) : '0.65'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ============================================================== */}
          {/* TAB 3: FACILITY DIRECTORY / DANH BẠ CSYT                       */}
          {/* ============================================================== */}
          {activeTab === 'facilities' && (
            <>
              {/* Search & Tier Filter Bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                  <input
                    type="text"
                    placeholder={t.searchFacilitiesHint}
                    value={facilitySearch}
                    onChange={(e) => setFacilitySearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px 8px 32px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      fontSize: '0.78rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Tier Filter Pills */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  {['all', '1', '2', '3'].map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setFacilityFilterTier(tier)}
                      style={{
                        flex: 1,
                        padding: '4px 0',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        borderRadius: '6px',
                        border: facilityFilterTier === tier ? '1px solid #0d9488' : '1px solid #e2e8f0',
                        background: facilityFilterTier === tier ? '#f0fdfa' : '#ffffff',
                        color: facilityFilterTier === tier ? '#0f766e' : '#64748b',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {tier === 'all' ? (language === 'vi' ? 'Tất cả' : 'All') : `${language === 'vi' ? 'Tuyến' : 'Tier'} ${tier}`}
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  {language === 'vi' ? `Hiển thị ${filteredFacilities.length} / ${facilities.length} trạm y tế` : `Showing ${filteredFacilities.length} / ${facilities.length} facilities`}
                </div>
              </div>

              {/* Facility Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredFacilities.map((f) => {
                  let badgeColor = '#0d9488';
                  let tierText = language === 'vi' ? 'Tuyến 3 (Xã)' : 'Tier 3 (Commune)';
                  if (f.tier === 1) {
                    badgeColor = '#d97706';
                    tierText = language === 'vi' ? 'Tuyến 1 (Tỉnh)' : 'Tier 1 (Provincial)';
                  } else if (f.tier === 2) {
                    badgeColor = '#0284c7';
                    tierText = language === 'vi' ? 'Tuyến 2 (Huyện)' : 'Tier 2 (District)';
                  }

                  return (
                    <div
                      key={f.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{
                            fontSize: '0.64rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: `${badgeColor}15`,
                            color: badgeColor,
                            border: `1px solid ${badgeColor}35`
                          }}>
                            {tierText}
                          </span>
                          <h4 style={{
                            margin: '4px 0 2px 0',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: '#0f172a',
                            fontFamily: 'var(--font-display)'
                          }}>
                            {f.name}
                          </h4>
                          <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b' }}>
                            📍 {f.commune}, <strong>{f.district}</strong>
                          </p>
                        </div>

                        <button
                          onClick={() => onFlyToFacility && onFlyToFacility(f)}
                          style={{
                            background: '#f0fdfa',
                            border: '1px solid #ccfbf1',
                            color: '#0d9488',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            flexShrink: 0
                          }}
                          title={t.flyToFacility}
                        >
                          <Navigation size={11} />
                          <span>{t.flyToFacility}</span>
                        </button>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '0.68rem',
                        color: '#64748b',
                        paddingTop: '4px',
                        borderTop: '1px solid #f1f5f9'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Users size={12} color="#0284c7" />
                          <span>{f.doctors} {t.popupDoctors}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Bed size={12} color="#0d9488" />
                          <span>{f.beds} {t.popupBeds}</span>
                        </div>
                        <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                          {f.lat.toFixed(2)}, {f.lon.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
