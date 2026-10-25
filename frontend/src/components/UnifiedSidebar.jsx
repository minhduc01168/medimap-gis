import { useState, useMemo } from 'react';
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
  Search, 
  Navigation, 
  Users, 
  Bed,
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
          className="od-glass"
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            zIndex: 890,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-float)',
            cursor: 'pointer',
            color: 'var(--text-main)',
            fontWeight: 700,
            fontSize: '0.82rem',
            fontFamily: 'var(--font-display)',
            border: '1px solid var(--border-subtle)',
            transition: 'all var(--duration-fast) var(--ease-spring)'
          }}
          title={t.sidebarExpand}
        >
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 2px 6px rgba(13, 148, 136, 0.3)'
          }}>
            <Sliders size={14} />
          </div>
          <span>{t.sidebarTabSimulation} / {t.sidebarTabAnalytics}</span>
          <ChevronRight size={16} color="var(--primary)" strokeWidth={2.4} />
        </button>
      )}

      {/* Main Unified Open-Design Sidebar Container */}
      <aside
        className="od-glass"
        style={{
          position: 'absolute',
          top: '16px',
          bottom: '16px',
          left: '16px',
          width: '400px',
          zIndex: 890,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-float)',
          transform: isCollapsed ? 'translateX(calc(-100% - 24px))' : 'translateX(0)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden'
        }}
      >
        {/* Sidebar Header Bar */}
        <div style={{
          padding: '12px 18px',
          borderBottom: '1px solid var(--border-subtle)',
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
                background: 'var(--primary)',
                boxShadow: '0 0 0 3px rgba(13, 148, 136, 0.2)'
              }} />
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.98rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                letterSpacing: '-0.015em',
                margin: 0
              }}>
                MediMap Studio
              </h2>
            </div>
            <p style={{
              margin: '2px 0 0 16px',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              fontWeight: 500
            }}>
              {language === 'vi' ? 'Sa Pa • Bát Xát • Mường Khương' : 'Sa Pa • Bat Xat • Muong Khuong'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={onResetSimulation}
              className="od-btn od-btn-secondary"
              style={{
                padding: '5px 10px',
                fontSize: '0.72rem',
                borderRadius: 'var(--radius-sm)'
              }}
              title={t.simReset}
            >
              <RotateCcw size={12} />
              <span>{t.simReset}</span>
            </button>

            <button
              onClick={() => setIsCollapsed(true)}
              className="od-btn od-btn-secondary"
              style={{
                width: '28px',
                height: '28px',
                padding: 0,
                borderRadius: 'var(--radius-sm)'
              }}
              title={t.sidebarCollapse}
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>

        {/* Segmented Tab Bar Switcher (Open-Design Pill) */}
        <nav
          role="tablist"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '4px',
            padding: '8px 14px',
            background: 'var(--bg-surface-secondary)',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <button
            role="tab"
            aria-selected={activeTab === 'simulation'}
            onClick={() => setActiveTab('simulation')}
            className="od-btn"
            style={{
              padding: '7px 4px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'simulation' ? '#ffffff' : 'transparent',
              color: activeTab === 'simulation' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'simulation' ? 700 : 500,
              fontSize: '0.76rem',
              boxShadow: activeTab === 'simulation' ? 'var(--shadow-xs)' : 'none'
            }}
          >
            <Sliders size={14} strokeWidth={activeTab === 'simulation' ? 2.4 : 1.8} />
            <span>{t.sidebarTabSimulation}</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
            className="od-btn"
            style={{
              padding: '7px 4px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'analytics' ? '#ffffff' : 'transparent',
              color: activeTab === 'analytics' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'analytics' ? 700 : 500,
              fontSize: '0.76rem',
              boxShadow: activeTab === 'analytics' ? 'var(--shadow-xs)' : 'none'
            }}
          >
            <BarChart3 size={14} strokeWidth={activeTab === 'analytics' ? 2.4 : 1.8} />
            <span>{t.sidebarTabAnalytics}</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'facilities'}
            onClick={() => setActiveTab('facilities')}
            className="od-btn"
            style={{
              padding: '7px 4px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'facilities' ? '#ffffff' : 'transparent',
              color: activeTab === 'facilities' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'facilities' ? 700 : 500,
              fontSize: '0.76rem',
              boxShadow: activeTab === 'facilities' ? 'var(--shadow-xs)' : 'none'
            }}
          >
            <Building2 size={14} strokeWidth={activeTab === 'facilities' ? 2.4 : 1.8} />
            <span>{t.sidebarTabFacilities}</span>
          </button>
        </nav>

        {/* Tab Body (Scrollable Container) */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
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
              <div className="od-card" style={{ padding: '14px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '12px'
                }}>
                  <Layers size={14} color="var(--primary)" strokeWidth={2.2} />
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)'
                  }}>
                    {t.simLayerSection}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: layers.facilities ? 'var(--primary-50)' : 'var(--bg-surface-secondary)',
                    border: `1px solid ${layers.facilities ? 'var(--primary-100)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    transition: 'all 0.15s ease'
                  }}>
                    <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{t.layerFacilities}</span>
                    <input
                      type="checkbox"
                      checked={layers.facilities}
                      onChange={(e) => setLayers({ ...layers, facilities: e.target.checked })}
                      style={{ accentColor: 'var(--primary)', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: layers.isochrones ? 'var(--tier-2-bg)' : 'var(--bg-surface-secondary)',
                    border: `1px solid ${layers.isochrones ? '#bae6fd' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    transition: 'all 0.15s ease'
                  }}>
                    <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{t.layerIsochrones}</span>
                    <input
                      type="checkbox"
                      checked={layers.isochrones}
                      onChange={(e) => setLayers({ ...layers, isochrones: e.target.checked })}
                      style={{ accentColor: 'var(--tier-2-sky)', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: layers.deserts ? 'var(--desert-bg)' : 'var(--bg-surface-secondary)',
                    border: `1px solid ${layers.deserts ? '#fecdd3' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    transition: 'all 0.15s ease'
                  }}>
                    <span style={{ color: 'var(--desert-rose-dark)', fontWeight: 700 }}>{t.layerDeserts}</span>
                    <input
                      type="checkbox"
                      checked={layers.deserts}
                      onChange={(e) => setLayers({ ...layers, deserts: e.target.checked })}
                      style={{ accentColor: 'var(--desert-rose)', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                  </label>
                </div>
              </div>

              {/* 5 P-Median Optimal Stations Feature Card */}
              <div 
                className="od-card"
                style={{
                  background: layers.proposed ? 'var(--ai-purple-bg)' : '#ffffff',
                  border: `1px solid ${layers.proposed ? 'rgba(124, 58, 237, 0.4)' : 'var(--border-subtle)'}`,
                  padding: '14px',
                  boxShadow: layers.proposed ? 'var(--shadow-md)' : 'var(--shadow-xs)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: 'var(--radius-sm)',
                      background: layers.proposed ? 'var(--ai-purple)' : 'var(--bg-surface-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: layers.proposed ? '#ffffff' : 'var(--text-muted)'
                    }}>
                      <Sparkles size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
                        {t.simProposedTitle}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--ai-purple)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        {language === 'vi' ? 'Mô hình Tối ưu P-Median & MCLP' : 'P-Median & MCLP Algorithm'}
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
                      accentColor: 'var(--ai-purple)',
                      cursor: 'pointer'
                    }}
                  />
                </div>

                <p style={{
                  margin: 0,
                  fontSize: '0.74rem',
                  lineHeight: 1.5,
                  color: layers.proposed ? '#581c87' : 'var(--text-muted)',
                  fontWeight: layers.proposed ? 600 : 400
                }}>
                  {layers.proposed ? t.simProposedActiveDesc : t.simProposedInactiveDesc}
                </p>

                {layers.proposed && (
                  <div style={{
                    marginTop: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(124, 58, 237, 0.12)',
                    color: 'var(--ai-purple)',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}>
                    <TrendingDown size={14} />
                    <span>{language === 'vi' ? 'Vùng lõm: 15.75% ➔ 2.25% (-85.7%)' : 'Medical Desert: 15.75% ➔ 2.25% (-85.7%)'}</span>
                  </div>
                )}
              </div>

              {/* Vehicle Travel Mode Section */}
              <div className="od-card" style={{ padding: '14px' }}>
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  marginBottom: '10px'
                }}>
                  {t.simVehicleSection}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={() => handleVehicleChange('motorbike')}
                    className="od-btn"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '10px 8px',
                      borderRadius: 'var(--radius-md)',
                      border: params.vehicle_type === 'motorbike' ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                      background: params.vehicle_type === 'motorbike' ? 'var(--primary-50)' : 'var(--bg-surface-secondary)',
                      color: params.vehicle_type === 'motorbike' ? 'var(--primary-dark)' : 'var(--text-muted)'
                    }}
                  >
                    <Bike size={20} color={params.vehicle_type === 'motorbike' ? 'var(--primary)' : 'var(--text-muted)'} />
                    <span style={{ fontSize: '0.76rem', fontWeight: 700 }}>{t.vehicleMotorbike}</span>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>32 km/h</span>
                  </button>

                  <button
                    onClick={() => handleVehicleChange('ambulance')}
                    className="od-btn"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '10px 8px',
                      borderRadius: 'var(--radius-md)',
                      border: params.vehicle_type === 'ambulance' ? '1.5px solid var(--tier-2-sky)' : '1px solid var(--border-subtle)',
                      background: params.vehicle_type === 'ambulance' ? 'var(--tier-2-bg)' : 'var(--bg-surface-secondary)',
                      color: params.vehicle_type === 'ambulance' ? '#0369a1' : 'var(--text-muted)'
                    }}
                  >
                    <Ambulance size={20} color={params.vehicle_type === 'ambulance' ? 'var(--tier-2-sky)' : 'var(--text-muted)'} />
                    <span style={{ fontSize: '0.76rem', fontWeight: 700 }}>{t.vehicleAmbulance}</span>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>42 km/h</span>
                  </button>
                </div>
              </div>

              {/* Sliders: Base Speed & Tobler Friction Weight */}
              <div className="od-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Speed Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {t.simSpeedLabel}
                    </span>
                    <span style={{
                      fontSize: '0.74rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      background: 'var(--primary-50)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--primary-100)',
                      fontVariantNumeric: 'tabular-nums'
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.66rem', color: 'var(--text-dim)' }}>
                    <span>{t.simSpeedMin}</span>
                    <span>{t.simSpeedMax}</span>
                  </div>
                </div>

                <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

                {/* Tobler Slope Weight Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {t.simSlopeLabel}
                    </span>
                    <span style={{
                      fontSize: '0.74rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: 'var(--tier-1-amber)',
                      background: 'var(--tier-1-bg)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid #fef3c7',
                      fontVariantNumeric: 'tabular-nums'
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.66rem', color: 'var(--text-dim)' }}>
                    <span>{t.simSlopeMin}</span>
                    <span>{t.simSlopeMax}</span>
                  </div>
                </div>
              </div>

              {/* District Spatial Filter */}
              <div className="od-card" style={{ padding: '14px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '10px'
                }}>
                  <Filter size={14} color="var(--primary)" />
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)'
                  }}>
                    {t.simDistrictFilter}
                  </span>
                </div>

                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-strong)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-main)',
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
                <div 
                  className="od-card"
                  style={{
                    background: 'var(--tier-2-bg)',
                    borderColor: '#bae6fd',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ fontSize: '0.76rem', color: '#0369a1', fontWeight: 600 }}>
                    📍 <strong>{customClinicsCount}</strong> {t.customClinicsActive}
                  </div>
                  <button
                    onClick={onClearCustomClinics}
                    className="od-btn"
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--tier-2-sky)',
                      color: 'var(--tier-2-sky)',
                      padding: '4px 8px',
                      fontSize: '0.7rem',
                      fontWeight: 700
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
              <div className="od-card" style={{ padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
                    {t.statsAccessTitle}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>
                    {totalPop.toLocaleString()} {t.peopleUnit}
                  </span>
                </div>

                {/* Multi-segment Progress bar */}
                <div style={{
                  display: 'flex',
                  height: '10px',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                  background: 'var(--bg-surface-secondary)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '12px'
                }}>
                  <div 
                    style={{ 
                      width: `${popData.less_than_15min.percentage}%`, 
                      background: 'var(--primary)',
                      transition: 'width 0.3s ease'
                    }} 
                    title={`<15m: ${popData.less_than_15min.percentage}%`}
                  />
                  <div 
                    style={{ 
                      width: `${popData.between_15_and_30min.percentage}%`, 
                      background: 'var(--tier-2-sky)',
                      transition: 'width 0.3s ease'
                    }} 
                    title={`15-30m: ${popData.between_15_and_30min.percentage}%`}
                  />
                  <div 
                    style={{ 
                      width: `${popData.between_30_and_60min.percentage}%`, 
                      background: 'var(--tier-1-amber)',
                      transition: 'width 0.3s ease'
                    }} 
                    title={`30-60m: ${popData.between_30_and_60min.percentage}%`}
                  />
                  <div 
                    style={{ 
                      width: `${popData.greater_than_60min_deserts.percentage}%`, 
                      background: 'var(--desert-rose)',
                      transition: 'width 0.3s ease'
                    }} 
                    title={`>60m: ${popData.greater_than_60min_deserts.percentage}%`}
                  />
                </div>

                {/* Detailed Band List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{t.bandUnder15}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
                      {popData.less_than_15min.population.toLocaleString()} ({popData.less_than_15min.percentage}%)
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--tier-2-sky)' }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{t.band15to30}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--tier-2-sky)', fontVariantNumeric: 'tabular-nums' }}>
                      {popData.between_15_and_30min.population.toLocaleString()} ({popData.between_15_and_30min.percentage}%)
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--tier-1-amber)' }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{t.band30to60}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--tier-1-amber)', fontVariantNumeric: 'tabular-nums' }}>
                      {popData.between_30_and_60min.population.toLocaleString()} ({popData.between_30_and_60min.percentage}%)
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', background: 'var(--desert-bg)', padding: '5px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid #fecdd3' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--desert-rose)' }} />
                      <span style={{ color: 'var(--desert-rose-dark)', fontWeight: 700 }}>{t.bandOver60}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--desert-rose)', fontVariantNumeric: 'tabular-nums' }}>
                      {popData.greater_than_60min_deserts.population.toLocaleString()} ({popData.greater_than_60min_deserts.percentage}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Metric Quick Cards (2x2 Grid) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="od-card" style={{ padding: '12px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {language === 'vi' ? 'Tiếp cận an toàn (<30p)' : 'Safe Access (<30m)'}
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)', marginTop: '2px', fontVariantNumeric: 'tabular-nums' }}>
                    {(popData.less_than_15min.percentage + popData.between_15_and_30min.percentage).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)', fontVariantNumeric: 'tabular-nums' }}>
                    {(popData.less_than_15min.population + popData.between_15_and_30min.population).toLocaleString()} {t.peopleUnit}
                  </div>
                </div>

                <div className="od-card" style={{ padding: '12px', background: 'var(--desert-bg)', borderColor: '#fecdd3' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--desert-rose-dark)', fontWeight: 700 }}>
                    {language === 'vi' ? 'Dân số vùng lõm' : 'Desert Population'}
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--desert-rose)', fontFamily: 'var(--font-display)', marginTop: '2px', fontVariantNumeric: 'tabular-nums' }}>
                    {popData.greater_than_60min_deserts.percentage}%
                  </div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--desert-rose-dark)', fontVariantNumeric: 'tabular-nums' }}>
                    {popData.greater_than_60min_deserts.population.toLocaleString()} {t.peopleUnit}
                  </div>
                </div>

                <div className="od-card" style={{ padding: '12px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {language === 'vi' ? 'Tổng mạng lưới CSYT' : 'Total Facilities'}
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--tier-2-sky)', fontFamily: 'var(--font-display)', marginTop: '2px', fontVariantNumeric: 'tabular-nums' }}>
                    67
                  </div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)' }}>
                    100% {language === 'vi' ? 'chuẩn hóa GIS' : 'GIS verified'}
                  </div>
                </div>

                <div className="od-card" style={{ padding: '12px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {language === 'vi' ? 'Mật độ BS trung bình' : 'Avg Doctor Density'}
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ai-purple)', fontFamily: 'var(--font-display)', marginTop: '2px', fontVariantNumeric: 'tabular-nums' }}>
                    0.68
                  </div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)' }}>
                    {language === 'vi' ? 'BS / 1.000 dân' : 'MD / 1k pop'}
                  </div>
                </div>
              </div>

              {/* Spatial Autocorrelation: Moran's I Card */}
              <div className="od-card" style={{ padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <Globe2 size={15} color="var(--primary)" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
                    {t.moranTitle}
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  background: 'var(--bg-surface-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px',
                  marginBottom: '10px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Moran&apos;s I Index</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--tier-2-sky)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>
                      0.9306
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Z-Score (p &lt; 0.001)</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>
                      +298.29
                    </div>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {t.moranDesc}
                </p>
              </div>

              {/* District E2SFCA Table */}
              <div className="od-card" style={{ padding: '14px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-display)', marginBottom: '10px' }}>
                  {t.districtTableTitle}
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.74rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                      <th style={{ padding: '6px 8px', fontWeight: 600 }}>{t.colDistrict}</th>
                      <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600 }}>{t.colPop}</th>
                      <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600 }}>{t.colDocPer1k}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {districtStats.map((d, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--bg-surface-secondary)' }}>
                        <td style={{ padding: '8px', fontWeight: 600, color: 'var(--text-main)' }}>{d.district}</td>
                        <td style={{ padding: '8px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                          {d.population?.toLocaleString()}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
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
                  <Search size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                  <input
                    type="text"
                    placeholder={t.searchFacilitiesHint}
                    value={facilitySearch}
                    onChange={(e) => setFacilitySearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 34px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-strong)',
                      background: 'var(--bg-surface)',
                      fontSize: '0.78rem',
                      color: 'var(--text-main)',
                      outline: 'none',
                      transition: 'border-color 0.15s ease'
                    }}
                  />
                </div>

                {/* Tier Filter Pills */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  {['all', '1', '2', '3'].map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setFacilityFilterTier(tier)}
                      className="od-btn"
                      style={{
                        flex: 1,
                        padding: '5px 0',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        borderRadius: 'var(--radius-xs)',
                        border: facilityFilterTier === tier ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                        background: facilityFilterTier === tier ? 'var(--primary-50)' : '#ffffff',
                        color: facilityFilterTier === tier ? 'var(--primary-dark)' : 'var(--text-muted)'
                      }}
                    >
                      {tier === 'all' ? (language === 'vi' ? 'Tất cả' : 'All') : `${language === 'vi' ? 'Tuyến' : 'Tier'} ${tier}`}
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {language === 'vi' ? `Hiển thị ${filteredFacilities.length} / ${facilities.length} trạm y tế` : `Showing ${filteredFacilities.length} / ${facilities.length} facilities`}
                </div>
              </div>

              {/* Facility Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredFacilities.map((f) => {
                  let badgeColor = 'var(--primary)';
                  let badgeBg = 'var(--primary-50)';
                  let tierText = language === 'vi' ? 'Tuyến 3 (Xã)' : 'Tier 3 (Commune)';
                  if (f.tier === 1) {
                    badgeColor = 'var(--tier-1-amber)';
                    badgeBg = 'var(--tier-1-bg)';
                    tierText = language === 'vi' ? 'Tuyến 1 (Tỉnh)' : 'Tier 1 (Provincial)';
                  } else if (f.tier === 2) {
                    badgeColor = 'var(--tier-2-sky)';
                    badgeBg = 'var(--tier-2-bg)';
                    tierText = language === 'vi' ? 'Tuyến 2 (Huyện)' : 'Tier 2 (District)';
                  }

                  return (
                    <div
                      key={f.id}
                      className="od-card"
                      style={{
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                        <div>
                          <span style={{
                            fontSize: '0.64rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-xs)',
                            background: badgeBg,
                            color: badgeColor,
                            border: `1px solid ${badgeColor}35`
                          }}>
                            {tierText}
                          </span>
                          <h4 style={{
                            margin: '4px 0 2px 0',
                            fontSize: '0.84rem',
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            fontFamily: 'var(--font-display)',
                            letterSpacing: '-0.01em'
                          }}>
                            {f.name}
                          </h4>
                          <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            📍 {f.commune}, <strong>{f.district}</strong>
                          </p>
                        </div>

                        <button
                          onClick={() => onFlyToFacility && onFlyToFacility(f)}
                          className="od-btn od-btn-primary"
                          style={{
                            padding: '5px 9px',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            borderRadius: 'var(--radius-xs)',
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
                        gap: '14px',
                        fontSize: '0.68rem',
                        color: 'var(--text-muted)',
                        paddingTop: '6px',
                        borderTop: '1px solid var(--border-subtle)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Users size={12} color="var(--tier-2-sky)" />
                          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{f.doctors} {t.popupDoctors}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Bed size={12} color="var(--primary)" />
                          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{f.beds} {t.popupBeds}</span>
                        </div>
                        <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', fontVariantNumeric: 'tabular-nums' }}>
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
