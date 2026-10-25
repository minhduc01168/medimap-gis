import React from 'react';
import { 
  Activity, 
  MapPin, 
  Layers, 
  Database, 
  FileText, 
  RefreshCw, 
  Sparkles,
  ShieldCheck,
  Radio
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  backendStatus, 
  onRefresh, 
  isAddingClinic, 
  setIsAddingClinic,
  onOpenReportModal
}) {
  return (
    <header className="glass-panel-elevated" style={{
      margin: '12px 16px 0 16px',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 1000,
      position: 'relative'
    }}>
      {/* Brand & Project Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 18px rgba(16, 185, 129, 0.45)'
        }}>
          <Activity size={24} color="#ffffff" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(90deg, #f8fafc 0%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              MediMap GIS
            </h1>
            <span style={{
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              Pilot Lào Cai v1.0
            </span>
          </div>
          <p style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            margin: '2px 0 0 0',
            fontWeight: 500
          }}>
            Hệ thống Bản đồ Số hóa & Phân tích Khả năng Tiếp cận Y tế Vùng núi
          </p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(15, 23, 42, 0.8)',
        padding: '4px',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)'
      }}>
        <button
          onClick={() => setActiveTab('map')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.84rem',
            fontWeight: activeTab === 'map' ? 600 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: activeTab === 'map' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
            color: activeTab === 'map' ? '#ffffff' : 'var(--text-muted)',
            boxShadow: activeTab === 'map' ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
          }}
        >
          <Layers size={16} />
          Bản Đồ Không Gian (WebGIS)
        </button>

        <button
          onClick={() => setActiveTab('data')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.84rem',
            fontWeight: activeTab === 'data' ? 600 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: activeTab === 'data' ? 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)' : 'transparent',
            color: activeTab === 'data' ? '#ffffff' : 'var(--text-muted)',
            boxShadow: activeTab === 'data' ? '0 4px 12px rgba(6, 182, 212, 0.3)' : 'none'
          }}
        >
          <Database size={16} />
          Quản Trị Dữ Liệu CSYT (67 Trạm)
        </button>
      </div>

      {/* Control Actions & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Backend Connection Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: '9999px',
          background: backendStatus.online ? 'rgba(16, 185, 129, 0.1)' : 'rgba(56, 189, 248, 0.1)',
          border: `1px solid ${backendStatus.online ? 'rgba(16, 185, 129, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`,
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: backendStatus.online ? '#10b981' : '#38bdf8',
            boxShadow: `0 0 8px ${backendStatus.online ? '#10b981' : '#38bdf8'}`
          }} />
          <span style={{ color: backendStatus.online ? '#34d399' : '#7dd3fc', fontWeight: 600 }}>
            {backendStatus.online ? 'FastAPI Spatial Backend (Live)' : 'Embedded Spatial Cache'}
          </span>
        </div>

        {/* Quick Add Custom Clinic Mode */}
        {activeTab === 'map' && (
          <button
            onClick={() => setIsAddingClinic(!isAddingClinic)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '8px',
              border: isAddingClinic ? '1px solid #8b5cf6' : '1px solid var(--border-subtle)',
              background: isAddingClinic ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
              color: isAddingClinic ? '#c4b5fd' : 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Nhấp vào bản đồ để thử nghiệm đặt thêm trạm y tế mới"
          >
            <MapPin size={15} color={isAddingClinic ? '#a78bfa' : '#94a3b8'} />
            {isAddingClinic ? 'Đang bật: Nhấp bản đồ' : '+ Đặt Trạm Mới'}
          </button>
        )}

        {/* Scientific Paper / Brief Modal */}
        <button
          onClick={onOpenReportModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            background: 'rgba(255, 255, 255, 0.04)',
            color: 'var(--text-secondary)',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <FileText size={15} color="#94a3b8" />
          Tài Liệu Kỹ Thuật
        </button>

        {/* Refresh Sync */}
        <button
          onClick={onRefresh}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            background: 'rgba(255, 255, 255, 0.04)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Đồng bộ dữ liệu từ server"
        >
          <RefreshCw size={15} />
        </button>
      </div>
    </header>
  );
}
