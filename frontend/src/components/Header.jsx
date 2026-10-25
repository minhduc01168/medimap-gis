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
      position: 'relative',
      background: 'rgba(255, 255, 255, 0.96)',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
    }}>
      {/* Brand & Project Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #0284c7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)'
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
              color: '#0f172a',
              margin: 0
            }}>
              MediMap GIS
            </h1>
            <span style={{
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '9999px',
              background: 'rgba(13, 148, 136, 0.1)',
              color: '#0d9488',
              border: '1px solid rgba(13, 148, 136, 0.25)'
            }}>
              Pilot Lào Cai v1.0
            </span>
          </div>
          <p style={{
            fontSize: '0.78rem',
            color: '#64748b',
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
        background: '#f1f5f9',
        padding: '4px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
      }}>
        <button
          onClick={() => setActiveTab('map')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.84rem',
            fontWeight: activeTab === 'map' ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: activeTab === 'map' ? 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' : 'transparent',
            color: activeTab === 'map' ? '#ffffff' : '#64748b',
            boxShadow: activeTab === 'map' ? '0 2px 8px rgba(13, 148, 136, 0.3)' : 'none'
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
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.84rem',
            fontWeight: activeTab === 'data' ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: activeTab === 'data' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
            color: activeTab === 'data' ? '#ffffff' : '#64748b',
            boxShadow: activeTab === 'data' ? '0 2px 8px rgba(2, 132, 199, 0.3)' : 'none'
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
          background: backendStatus.online ? 'rgba(13, 148, 136, 0.1)' : 'rgba(2, 132, 199, 0.1)',
          border: `1px solid ${backendStatus.online ? 'rgba(13, 148, 136, 0.25)' : 'rgba(2, 132, 199, 0.25)'}`,
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: backendStatus.online ? '#0d9488' : '#0284c7',
            boxShadow: `0 0 6px ${backendStatus.online ? '#0d9488' : '#0284c7'}`
          }} />
          <span style={{ color: backendStatus.online ? '#0f766e' : '#0369a1', fontWeight: 700 }}>
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
              padding: '7px 14px',
              borderRadius: '8px',
              border: isAddingClinic ? '1px solid #7c3aed' : '1px solid #e2e8f0',
              background: isAddingClinic ? 'rgba(124, 58, 237, 0.15)' : '#ffffff',
              color: isAddingClinic ? '#7c3aed' : '#475569',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: 'var(--shadow-sm)'
            }}
            title="Nhấp vào bản đồ để thử nghiệm đặt thêm trạm y tế mới"
          >
            <MapPin size={15} color={isAddingClinic ? '#7c3aed' : '#64748b'} />
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
            padding: '7px 14px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            color: '#475569',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <FileText size={15} color="#0d9488" />
          Tài Liệu Kỹ Thuật
        </button>

        {/* Refresh Sync */}
        <button
          onClick={onRefresh}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: 'var(--shadow-sm)'
          }}
          title="Đồng bộ dữ liệu từ server"
        >
          <RefreshCw size={15} />
        </button>
      </div>
    </header>
  );
}
