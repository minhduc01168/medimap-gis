import React from 'react';
import { 
  Sliders, 
  Bike, 
  Ambulance, 
  Layers, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Filter, 
  RotateCcw,
  PlusCircle,
  HelpCircle
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
  onClearCustomClinics
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
        top: '20px',
        left: '20px',
        width: '320px',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        zIndex: 850,
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        background: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid #e2e8f0',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={18} color="#0d9488" />
          <h2 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '0.96rem', 
            fontWeight: 800, 
            color: '#0f172a',
            margin: 0
          }}>
            Bảng Điều Khiển Mô Phỏng
          </h2>
        </div>
        <button
          onClick={onResetSimulation}
          style={{
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            color: '#64748b',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Đặt lại thông số mặc định"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Layer Visibility Toggles */}
      <div style={{
        background: '#f8fafc',
        padding: '12px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ 
          fontSize: '0.74rem', 
          fontWeight: 700, 
          color: '#475569', 
          textTransform: 'uppercase', 
          marginBottom: '8px',
          letterSpacing: '0.05em'
        }}>
          Lớp Bản Đồ Không Gian
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.82rem' }}>
            <span style={{ color: '#334155', fontWeight: 500 }}>67 Cơ sở Y tế</span>
            <input 
              type="checkbox" 
              checked={layers.facilities} 
              onChange={(e) => setLayers({ ...layers, facilities: e.target.checked })}
              style={{ accentColor: '#0d9488', cursor: 'pointer', width: '16px', height: '16px' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.82rem' }}>
            <span style={{ color: '#334155', fontWeight: 500 }}>Vùng đẳng thời (15m, 30m)</span>
            <input 
              type="checkbox" 
              checked={layers.isochrones} 
              onChange={(e) => setLayers({ ...layers, isochrones: e.target.checked })}
              style={{ accentColor: '#0d9488', cursor: 'pointer', width: '16px', height: '16px' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.82rem' }}>
            <span style={{ color: '#e11d48', fontWeight: 700 }}>Vùng lõm y tế (&gt;60 phút)</span>
            <input 
              type="checkbox" 
              checked={layers.deserts} 
              onChange={(e) => setLayers({ ...layers, deserts: e.target.checked })}
              style={{ accentColor: '#e11d48', cursor: 'pointer', width: '16px', height: '16px' }}
            />
          </label>
        </div>
      </div>

      {/* Key Feature: P-Median Optimization Toggle */}
      <div style={{
        background: layers.proposed 
          ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)' 
          : '#f8fafc',
        padding: '12px',
        borderRadius: '12px',
        border: layers.proposed ? '1px solid rgba(124, 58, 237, 0.35)' : '1px solid #e2e8f0',
        transition: 'all 0.25s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color={layers.proposed ? '#7c3aed' : '#64748b'} />
            <span style={{ 
              fontSize: '0.84rem', 
              fontWeight: 800, 
              color: layers.proposed ? '#6d28d9' : '#334155' 
            }}>
              5 Trạm Tối Ưu P-Median
            </span>
          </div>
          <input 
            type="checkbox" 
            checked={layers.proposed} 
            onChange={(e) => setLayers({ ...layers, proposed: e.target.checked })}
            style={{ accentColor: '#7c3aed', width: '17px', height: '17px', cursor: 'pointer' }}
          />
        </div>
        <p style={{ fontSize: '0.74rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
          {layers.proposed 
            ? '✓ Đang kích hoạt 5 trạm mới: Cứu 29,574 người khỏi vùng lõm (giảm 85.7%!).' 
            : 'Bật để xem thuật toán P-Median & MCLP mở rộng vùng an toàn cho 29,574 người.'}
        </p>
      </div>

      {/* Vehicle Type Switcher */}
      <div>
        <div style={{ 
          fontSize: '0.74rem', 
          fontWeight: 700, 
          color: '#475569', 
          textTransform: 'uppercase', 
          marginBottom: '6px',
          letterSpacing: '0.05em'
        }}>
          Phương Tiện Di Chuyển
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            onClick={() => handleVehicleChange('motorbike')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              borderRadius: '8px',
              border: params.vehicle_type === 'motorbike' ? '1px solid #0d9488' : '1px solid #e2e8f0',
              background: params.vehicle_type === 'motorbike' ? 'rgba(13, 148, 136, 0.12)' : '#ffffff',
              color: params.vehicle_type === 'motorbike' ? '#0f766e' : '#64748b',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Bike size={15} />
            Xe Máy (Vùng cao)
          </button>

          <button
            onClick={() => handleVehicleChange('ambulance')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              borderRadius: '8px',
              border: params.vehicle_type === 'ambulance' ? '1px solid #0284c7' : '1px solid #e2e8f0',
              background: params.vehicle_type === 'ambulance' ? 'rgba(2, 132, 199, 0.12)' : '#ffffff',
              color: params.vehicle_type === 'ambulance' ? '#0369a1' : '#64748b',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Ambulance size={15} />
            Xe Cấp Cứu
          </button>
        </div>
      </div>

      {/* Speed Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.78rem' }}>
          <span style={{ color: '#334155', fontWeight: 600 }}>Tốc độ cơ sở ($v_0$)</span>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94a3b8', marginTop: '3px' }}>
          <span>15 km/h (Mùa mưa đèo)</span>
          <span>55 km/h (Quốc lộ)</span>
        </div>
      </div>

      {/* Slope Friction Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.78rem' }}>
          <span style={{ color: '#334155', fontWeight: 600 }}>Hệ số phạt dốc Tobler (α)</span>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94a3b8', marginTop: '3px' }}>
          <span>1.0 (Đồng bằng)</span>
          <span>5.0 (Vách đá dốc)</span>
        </div>
      </div>

      {/* District Filter Dropdown */}
      <div>
        <div style={{ 
          fontSize: '0.74rem', 
          fontWeight: 700, 
          color: '#475569', 
          textTransform: 'uppercase', 
          marginBottom: '6px',
          letterSpacing: '0.05em',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Filter size={13} />
          Lọc Theo Huyện Pilot
        </div>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 10px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            color: '#0f172a',
            fontSize: '0.8rem',
            outline: 'none',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          <option value="">Toàn bộ 3 huyện (Sa Pa, Bát Xát, Mường Khương)</option>
          <option value="Thị xã Sa Pa">Thị xã Sa Pa (19 trạm)</option>
          <option value="Huyện Bát Xát">Huyện Bát Xát (28 trạm)</option>
          <option value="Huyện Mường Khương">Huyện Mường Khương (20 trạm)</option>
        </select>
      </div>

      {/* Custom Clinics Summary & Reset */}
      {customClinicsCount > 0 && (
        <div style={{
          padding: '10px 12px',
          background: 'rgba(2, 132, 199, 0.08)',
          border: '1px solid rgba(2, 132, 199, 0.25)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem'
        }}>
          <span style={{ color: '#0369a1', fontWeight: 700 }}>
            {customClinicsCount} trạm tự đặt đang mô phỏng
          </span>
          <button
            onClick={onClearCustomClinics}
            style={{
              background: 'none',
              border: 'none',
              color: '#e11d48',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Xóa hết
          </button>
        </div>
      )}
    </div>
  );
}
