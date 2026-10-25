import React from 'react';
import { 
  Sliders, 
  Bike, 
  Ambulance, 
  Layers, 
  Sparkles, 
  Filter, 
  RotateCcw
} from 'lucide-react';

export default function SimulationPanel({
  params,
  setParams,
  layers,
  setLayers,
  selectedDistrict,
  setSelectedDistrict,
  onResetSimulation,
  customClinicsCount,
  onClearCustomClinics,
  t
}) {
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

  return (
    <div 
      className="glass-panel"
      style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        width: '295px',
        maxHeight: 'calc(100vh - 95px)',
        overflowY: 'auto',
        zIndex: 850,
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: 'rgba(255, 255, 255, 0.96)',
        border: '1px solid #e2e8f0',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <Sliders size={16} color="#0d9488" />
          <h2 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '0.9rem', 
            fontWeight: 800, 
            color: '#0f172a',
            margin: 0
          }}>
            {t.simTitle}
          </h2>
        </div>
        <button
          onClick={onResetSimulation}
          style={{
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: '5px',
            color: '#64748b',
            cursor: 'pointer',
            padding: '3px 6px',
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.7rem'
          }}
          title={t.simReset}
        >
          <RotateCcw size={12} style={{ marginRight: '4px' }} />
          {t.simReset}
        </button>
      </div>

      {/* Layer Visibility Toggles */}
      <div style={{
        background: '#f8fafc',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ 
          fontSize: '0.7rem', 
          fontWeight: 700, 
          color: '#475569', 
          textTransform: 'uppercase', 
          marginBottom: '6px',
          letterSpacing: '0.04em'
        }}>
          {t.simLayerSection}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.78rem' }}>
            <span style={{ color: '#334155', fontWeight: 500 }}>{t.layerFacilities}</span>
            <input 
              type="checkbox" 
              checked={layers.facilities} 
              onChange={(e) => setLayers({ ...layers, facilities: e.target.checked })}
              style={{ accentColor: '#0d9488', cursor: 'pointer', width: '15px', height: '15px' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.78rem' }}>
            <span style={{ color: '#334155', fontWeight: 500 }}>{t.layerIsochrones}</span>
            <input 
              type="checkbox" 
              checked={layers.isochrones} 
              onChange={(e) => setLayers({ ...layers, isochrones: e.target.checked })}
              style={{ accentColor: '#0d9488', cursor: 'pointer', width: '15px', height: '15px' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.78rem' }}>
            <span style={{ color: '#e11d48', fontWeight: 700 }}>{t.layerDeserts}</span>
            <input 
              type="checkbox" 
              checked={layers.deserts} 
              onChange={(e) => setLayers({ ...layers, deserts: e.target.checked })}
              style={{ accentColor: '#e11d48', cursor: 'pointer', width: '15px', height: '15px' }}
            />
          </label>
        </div>
      </div>

      {/* Key Feature: P-Median Optimization Toggle */}
      <div style={{
        background: layers.proposed 
          ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)' 
          : '#f8fafc',
        padding: '10px 12px',
        borderRadius: '10px',
        border: layers.proposed ? '1.5px solid rgba(124, 58, 237, 0.35)' : '1px solid #e2e8f0',
        transition: 'all 0.2s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={15} color={layers.proposed ? '#7c3aed' : '#64748b'} />
            <span style={{ 
              fontSize: '0.8rem', 
              fontWeight: 800, 
              color: layers.proposed ? '#6d28d9' : '#334155' 
            }}>
              {t.simProposedTitle}
            </span>
          </div>
          <input 
            type="checkbox" 
            checked={layers.proposed} 
            onChange={(e) => setLayers({ ...layers, proposed: e.target.checked })}
            style={{ accentColor: '#7c3aed', width: '16px', height: '16px', cursor: 'pointer' }}
          />
        </div>
        <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0, lineHeight: 1.35 }}>
          {layers.proposed ? t.simProposedActiveDesc : t.simProposedInactiveDesc}
        </p>
      </div>

      {/* Vehicle Type Switcher */}
      <div>
        <div style={{ 
          fontSize: '0.7rem', 
          fontWeight: 700, 
          color: '#475569', 
          textTransform: 'uppercase', 
          marginBottom: '5px',
          letterSpacing: '0.04em'
        }}>
          {t.simVehicleSection}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <button
            onClick={() => handleVehicleChange('motorbike')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              padding: '7px 4px',
              borderRadius: '7px',
              border: params.vehicle_type === 'motorbike' ? '1.5px solid #0d9488' : '1px solid #e2e8f0',
              background: params.vehicle_type === 'motorbike' ? 'rgba(13, 148, 136, 0.12)' : '#ffffff',
              color: params.vehicle_type === 'motorbike' ? '#0f766e' : '#64748b',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Bike size={14} />
            {t.vehicleMotorbike}
          </button>

          <button
            onClick={() => handleVehicleChange('ambulance')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              padding: '7px 4px',
              borderRadius: '7px',
              border: params.vehicle_type === 'ambulance' ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
              background: params.vehicle_type === 'ambulance' ? 'rgba(2, 132, 199, 0.12)' : '#ffffff',
              color: params.vehicle_type === 'ambulance' ? '#0369a1' : '#64748b',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Ambulance size={14} />
            {t.vehicleAmbulance}
          </button>
        </div>
      </div>

      {/* Speed Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', fontSize: '0.75rem' }}>
          <span style={{ color: '#334155', fontWeight: 600 }}>{t.simSpeedLabel}</span>
          <strong style={{ color: '#0d9488', fontFamily: 'var(--font-mono)' }}>{params.base_speed_kmh} km/h</strong>
        </div>
        <input 
          type="range" 
          min="15" 
          max="55" 
          step="1"
          value={params.base_speed_kmh}
          onChange={handleSpeedChange}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px' }}>
          <span>{t.simSpeedMin}</span>
          <span>{t.simSpeedMax}</span>
        </div>
      </div>

      {/* Slope Friction Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', fontSize: '0.75rem' }}>
          <span style={{ color: '#334155', fontWeight: 600 }}>{t.simSlopeLabel}</span>
          <strong style={{ color: '#0284c7', fontFamily: 'var(--font-mono)' }}>{params.slope_friction_weight.toFixed(1)}</strong>
        </div>
        <input 
          type="range" 
          min="1.0" 
          max="5.0" 
          step="0.1"
          value={params.slope_friction_weight}
          onChange={handleSlopeWeightChange}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px' }}>
          <span>{t.simSlopeMin}</span>
          <span>{t.simSlopeMax}</span>
        </div>
      </div>

      {/* District Filter Dropdown */}
      <div>
        <div style={{ 
          fontSize: '0.7rem', 
          fontWeight: 700, 
          color: '#475569', 
          textTransform: 'uppercase', 
          marginBottom: '5px',
          letterSpacing: '0.04em',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Filter size={12} />
          {t.simDistrictFilter}
        </div>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          style={{
            width: '100%',
            padding: '7px 8px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '7px',
            color: '#0f172a',
            fontSize: '0.76rem',
            outline: 'none',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          <option value="">{t.districtAll}</option>
          <option value="Thị xã Sa Pa">{t.districtSapa}</option>
          <option value="Huyện Bát Xát">{t.districtBatxat}</option>
          <option value="Huyện Mường Khương">{t.districtMuongkhuong}</option>
        </select>
      </div>

      {/* Custom Clinics Summary & Reset */}
      {customClinicsCount > 0 && (
        <div style={{
          padding: '8px 10px',
          background: 'rgba(2, 132, 199, 0.08)',
          border: '1px solid rgba(2, 132, 199, 0.25)',
          borderRadius: '7px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.74rem'
        }}>
          <span style={{ color: '#0369a1', fontWeight: 700 }}>
            {customClinicsCount} {t.customClinicsActive}
          </span>
          <button
            onClick={onClearCustomClinics}
            style={{
              background: 'none',
              border: 'none',
              color: '#e11d48',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {t.btnClearCustom}
          </button>
        </div>
      )}
    </div>
  );
}
