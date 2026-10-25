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
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)'
      }}
    >
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={18} color="#10b981" />
          <h2 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '0.95rem', 
            fontWeight: 700, 
            color: '#f8fafc',
            margin: 0
          }}>
            Bảng Điều Khiển Mô Phỏng
          </h2>
        </div>
        <button
          onClick={onResetSimulation}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
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
        background: 'rgba(15, 23, 42, 0.6)',
        padding: '10px 12px',
        borderRadius: '10px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ 
          fontSize: '0.74rem', 
          fontWeight: 700, 
          color: 'var(--text-dim)', 
          textTransform: 'uppercase', 
          marginBottom: '8px',
          letterSpacing: '0.05em'
        }}>
          Lớp Bản Đồ Không Gian
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>67 Cơ sở Y tế</span>
            <input 
              type="checkbox" 
              checked={layers.facilities} 
              onChange={(e) => setLayers({ ...layers, facilities: e.target.checked })}
              style={{ accentColor: '#10b981', cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Bán kính phủ sóng (Isochrones)</span>
            <input 
              type="checkbox" 
              checked={layers.isochrones} 
              onChange={(e) => setLayers({ ...layers, isochrones: e.target.checked })}
              style={{ accentColor: '#10b981', cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.8rem' }}>
            <span style={{ color: '#fda4af', fontWeight: 600 }}>Vùng lõm y tế (&gt;60 phút)</span>
            <input 
              type="checkbox" 
              checked={layers.deserts} 
              onChange={(e) => setLayers({ ...layers, deserts: e.target.checked })}
              style={{ accentColor: '#f43f5e', cursor: 'pointer' }}
            />
          </label>
        </div>
      </div>

      {/* Key Feature: P-Median Optimization Toggle */}
      <div style={{
        background: layers.proposed 
          ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(124, 58, 237, 0.15) 100%)' 
          : 'rgba(15, 23, 42, 0.6)',
        padding: '12px',
        borderRadius: '12px',
        border: layers.proposed ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid var(--border-subtle)',
        transition: 'all 0.25s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color={layers.proposed ? '#c084fc' : '#94a3b8'} />
            <span style={{ 
              fontSize: '0.82rem', 
              fontWeight: 700, 
              color: layers.proposed ? '#f8fafc' : 'var(--text-secondary)' 
            }}>
              5 Trạm Tối Ưu P-Median
            </span>
          </div>
          <input 
            type="checkbox" 
            checked={layers.proposed} 
            onChange={(e) => setLayers({ ...layers, proposed: e.target.checked })}
            style={{ accentColor: '#8b5cf6', width: '16px', height: '16px', cursor: 'pointer' }}
          />
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
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
          color: 'var(--text-dim)', 
          textTransform: 'uppercase', 
          marginBottom: '6px',
          letterSpacing: '0.05em'
        }}>
          Phương Tiện Di Chuyển
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <button
            onClick={() => handleVehicleChange('motorbike')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '7px',
              borderRadius: '8px',
              border: params.vehicle_type === 'motorbike' ? '1px solid #10b981' : '1px solid var(--border-subtle)',
              background: params.vehicle_type === 'motorbike' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: params.vehicle_type === 'motorbike' ? '#34d399' : 'var(--text-muted)',
              fontSize: '0.76rem',
              fontWeight: 600,
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
              padding: '7px',
              borderRadius: '8px',
              border: params.vehicle_type === 'ambulance' ? '1px solid #06b6d4' : '1px solid var(--border-subtle)',
              background: params.vehicle_type === 'ambulance' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: params.vehicle_type === 'ambulance' ? '#38bdf8' : 'var(--text-muted)',
              fontSize: '0.76rem',
              fontWeight: 600,
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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.76rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Tốc độ cơ sở ($v_0$)</span>
          <strong style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}>{params.base_speed_kmh} km/h</strong>
        </div>
        <input 
          type="range" 
          min="15" 
          max="55" 
          step="1"
          value={params.base_speed_kmh}
          onChange={handleSpeedChange}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: 'var(--text-dim)', marginTop: '2px' }}>
          <span>15 km/h (Mùa mưa đèo)</span>
          <span>55 km/h (Quốc lộ)</span>
        </div>
      </div>

      {/* Slope Friction Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.76rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Hệ số phạt dốc Tobler (α)</span>
          <strong style={{ color: '#06b6d4', fontFamily: 'var(--font-mono)' }}>{params.slope_friction_weight.toFixed(1)}</strong>
        </div>
        <input 
          type="range" 
          min="1.0" 
          max="5.0" 
          step="0.1"
          value={params.slope_friction_weight}
          onChange={handleSlopeWeightChange}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: 'var(--text-dim)', marginTop: '2px' }}>
          <span>1.0 (Đồng bằng)</span>
          <span>5.0 (Vách đá dốc)</span>
        </div>
      </div>

      {/* District Filter Dropdown */}
      <div>
        <div style={{ 
          fontSize: '0.74rem', 
          fontWeight: 700, 
          color: 'var(--text-dim)', 
          textTransform: 'uppercase', 
          marginBottom: '6px',
          letterSpacing: '0.05em',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Filter size={12} />
          Lọc Theo Huyện Pilot
        </div>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          style={{
            width: '100%',
            padding: '7px 10px',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            color: '#f8fafc',
            fontSize: '0.78rem',
            outline: 'none',
            cursor: 'pointer'
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
          padding: '8px 10px',
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem'
        }}>
          <span style={{ color: '#7dd3fc', fontWeight: 600 }}>
            {customClinicsCount} trạm tự đặt đang mô phỏng
          </span>
          <button
            onClick={onClearCustomClinics}
            style={{
              background: 'none',
              border: 'none',
              color: '#fda4af',
              fontSize: '0.72rem',
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
