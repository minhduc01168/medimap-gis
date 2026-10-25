import React from 'react';
import { 
  Activity, 
  MapPin, 
  Layers, 
  Database, 
  FileText, 
  RefreshCw, 
  Languages
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  backendStatus, 
  onRefresh, 
  isAddingClinic, 
  setIsAddingClinic,
  onOpenReportModal,
  language,
  setLanguage,
  t
}) {
  return (
    <header className="glass-panel-elevated" style={{
      margin: '10px 14px 0 14px',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 1000,
      position: 'relative',
      background: 'rgba(255, 255, 255, 0.97)',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)'
    }}>
      {/* Brand & Project Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #0284c7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 3px 10px rgba(13, 148, 136, 0.3)',
          flexShrink: 0
        }}>
          <Activity size={22} color="#ffffff" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#0f172a',
              margin: 0
            }}>
              {t.appTitle}
            </h1>
            <span style={{
              fontSize: '0.66rem',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '9999px',
              background: 'rgba(13, 148, 136, 0.1)',
              color: '#0d9488',
              border: '1px solid rgba(13, 148, 136, 0.25)',
              whiteSpace: 'nowrap'
            }}>
              {t.pilotBadge}
            </span>
          </div>
          <p style={{
            fontSize: '0.74rem',
            color: '#64748b',
            margin: '1px 0 0 0',
            fontWeight: 500
          }}>
            {t.appSubtitle}
          </p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: '#f1f5f9',
        padding: '3px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0'
      }}>
        <button
          onClick={() => setActiveTab('map')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '7px 16px',
            borderRadius: '7px',
            border: 'none',
            fontSize: '0.82rem',
            fontWeight: activeTab === 'map' ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            background: activeTab === 'map' ? 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' : 'transparent',
            color: activeTab === 'map' ? '#ffffff' : '#64748b',
            boxShadow: activeTab === 'map' ? '0 2px 6px rgba(13, 148, 136, 0.25)' : 'none'
          }}
        >
          <Layers size={15} />
          {t.tabMap}
        </button>

        <button
          onClick={() => setActiveTab('data')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '7px 16px',
            borderRadius: '7px',
            border: 'none',
            fontSize: '0.82rem',
            fontWeight: activeTab === 'data' ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            background: activeTab === 'data' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
            color: activeTab === 'data' ? '#ffffff' : '#64748b',
            boxShadow: activeTab === 'data' ? '0 2px 6px rgba(2, 132, 199, 0.25)' : 'none'
          }}
        >
          <Database size={15} />
          {t.tabData}
        </button>
      </div>

      {/* Control Actions & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Backend Connection Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '5px 10px',
          borderRadius: '9999px',
          background: backendStatus.online ? 'rgba(13, 148, 136, 0.08)' : 'rgba(2, 132, 199, 0.08)',
          border: `1px solid ${backendStatus.online ? 'rgba(13, 148, 136, 0.2)' : 'rgba(2, 132, 199, 0.2)'}`,
          fontSize: '0.72rem',
          fontFamily: 'var(--font-body)',
          whiteSpace: 'nowrap'
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: backendStatus.online ? '#0d9488' : '#0284c7',
            boxShadow: `0 0 6px ${backendStatus.online ? '#0d9488' : '#0284c7'}`
          }} />
          <span style={{ color: backendStatus.online ? '#0f766e' : '#0369a1', fontWeight: 700 }}>
            {backendStatus.online ? t.statusBackendLive : t.statusCacheLocal}
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
              padding: '6px 12px',
              borderRadius: '7px',
              border: isAddingClinic ? '1px solid #7c3aed' : '1px solid #e2e8f0',
              background: isAddingClinic ? 'rgba(124, 58, 237, 0.12)' : '#ffffff',
              color: isAddingClinic ? '#7c3aed' : '#475569',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title={t.clickToAddHint}
          >
            <MapPin size={14} color={isAddingClinic ? '#7c3aed' : '#64748b'} />
            {isAddingClinic ? t.btnAddClinicActive : t.btnAddClinic}
          </button>
        )}

        {/* Scientific Paper / Brief Modal */}
        <button
          onClick={onOpenReportModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '7px',
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            color: '#475569',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <FileText size={14} color="#0d9488" />
          {t.btnDocReport}
        </button>

        {/* Unified Language Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#f1f5f9',
          padding: '2px',
          borderRadius: '7px',
          border: '1px solid #e2e8f0'
        }}>
          <button
            onClick={() => setLanguage('vi')}
            style={{
              padding: '4px 8px',
              borderRadius: '5px',
              border: 'none',
              fontSize: '0.72rem',
              fontWeight: language === 'vi' ? 700 : 500,
              background: language === 'vi' ? '#ffffff' : 'transparent',
              color: language === 'vi' ? '#0d9488' : '#64748b',
              cursor: 'pointer',
              boxShadow: language === 'vi' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
            title="Giao diện tiếng Việt chuẩn hóa"
          >
            Tiếng Việt
          </button>
          <button
            onClick={() => setLanguage('en')}
            style={{
              padding: '4px 8px',
              borderRadius: '5px',
              border: 'none',
              fontSize: '0.72rem',
              fontWeight: language === 'en' ? 700 : 500,
              background: language === 'en' ? '#ffffff' : 'transparent',
              color: language === 'en' ? '#0d9488' : '#64748b',
              cursor: 'pointer',
              boxShadow: language === 'en' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
            title="English Interface"
          >
            English
          </button>
        </div>

        {/* Refresh Sync */}
        <button
          onClick={onRefresh}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '7px',
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          title={t.btnSync}
        >
          <RefreshCw size={14} />
        </button>
      </div>
    </header>
  );
}
