import { 
  Activity, 
  MapPin, 
  Layers, 
  Database, 
  FileText, 
  RefreshCw 
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
    <header className="od-glass-elevated" style={{
      margin: '12px 16px 0 16px',
      padding: '8px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 1000,
      position: 'relative',
      background: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Brand & Project Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(13, 148, 136, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          flexShrink: 0
        }}>
          <Activity size={20} color="#ffffff" strokeWidth={2.4} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.18rem',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: 'var(--text-main)',
              margin: 0,
              lineHeight: 1.2
            }}>
              {t.appTitle}
            </h1>
            <span style={{
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary-50)',
              color: 'var(--primary)',
              border: '1px solid var(--primary-100)',
              whiteSpace: 'nowrap'
            }}>
              {t.pilotBadge}
            </span>
          </div>
          <p style={{
            fontSize: '0.74rem',
            color: 'var(--text-muted)',
            margin: '2px 0 0 0',
            fontWeight: 500
          }}>
            {t.appSubtitle}
          </p>
        </div>
      </div>

      {/* Main Tabs Navigation (Open-Design Segmented Pill) */}
      <nav 
        role="tablist"
        aria-label="Chế độ làm việc"
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-surface-secondary)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <button
          role="tab"
          aria-selected={activeTab === 'map'}
          onClick={() => setActiveTab('map')}
          className="od-btn"
          style={{
            padding: '7px 18px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            fontSize: '0.82rem',
            fontWeight: activeTab === 'map' ? 700 : 500,
            background: activeTab === 'map' ? '#ffffff' : 'transparent',
            color: activeTab === 'map' ? 'var(--primary)' : 'var(--text-muted)',
            boxShadow: activeTab === 'map' ? 'var(--shadow-xs)' : 'none',
            transition: 'all var(--duration-fast) var(--ease-spring)'
          }}
        >
          <Layers size={15} strokeWidth={activeTab === 'map' ? 2.3 : 1.8} />
          <span>{t.tabMap}</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'data'}
          onClick={() => setActiveTab('data')}
          className="od-btn"
          style={{
            padding: '7px 18px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            fontSize: '0.82rem',
            fontWeight: activeTab === 'data' ? 700 : 500,
            background: activeTab === 'data' ? '#ffffff' : 'transparent',
            color: activeTab === 'data' ? 'var(--primary)' : 'var(--text-muted)',
            boxShadow: activeTab === 'data' ? 'var(--shadow-xs)' : 'none',
            transition: 'all var(--duration-fast) var(--ease-spring)'
          }}
        >
          <Database size={15} strokeWidth={activeTab === 'data' ? 2.3 : 1.8} />
          <span>{t.tabData}</span>
        </button>
      </nav>

      {/* Control Actions & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Backend Connection Indicator with Live Breathing Ring */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '5px 12px',
          borderRadius: 'var(--radius-full)',
          background: backendStatus.online ? 'var(--primary-50)' : 'var(--tier-2-bg)',
          border: `1px solid ${backendStatus.online ? 'var(--primary-100)' : '#bae6fd'}`,
          fontSize: '0.72rem',
          fontFamily: 'var(--font-mono)',
          whiteSpace: 'nowrap'
        }}>
          <span 
            className={backendStatus.online ? 'animate-pulse-green' : ''}
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: backendStatus.online ? 'var(--primary)' : 'var(--tier-2-sky)',
              display: 'inline-block'
            }} 
          />
          <span style={{ 
            color: backendStatus.online ? 'var(--primary-dark)' : '#0369a1', 
            fontWeight: 700 
          }}>
            {backendStatus.online ? t.statusBackendLive : t.statusCacheLocal}
          </span>
        </div>

        {/* Quick Add Custom Clinic Mode */}
        {activeTab === 'map' && (
          <button
            onClick={() => setIsAddingClinic(!isAddingClinic)}
            className="od-btn"
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              border: isAddingClinic ? '1px solid var(--ai-purple)' : '1px solid var(--border-strong)',
              background: isAddingClinic ? 'var(--ai-purple-bg)' : '#ffffff',
              color: isAddingClinic ? 'var(--ai-purple)' : 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 600,
              boxShadow: isAddingClinic ? '0 0 12px rgba(124, 58, 237, 0.2)' : 'var(--shadow-xs)'
            }}
            title={t.clickToAddHint}
          >
            <MapPin size={14} color={isAddingClinic ? 'var(--ai-purple)' : 'var(--text-muted)'} />
            <span>{isAddingClinic ? t.btnAddClinicActive : t.btnAddClinic}</span>
          </button>
        )}

        {/* Scientific Paper / Brief Modal */}
        <button
          onClick={onOpenReportModal}
          className="od-btn od-btn-secondary"
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.78rem',
            fontWeight: 600
          }}
        >
          <FileText size={14} color="var(--primary)" />
          <span>{t.btnDocReport}</span>
        </button>

        {/* Unified Language Switcher (Segmented Pill) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-surface-secondary)',
          padding: '2px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setLanguage('vi')}
            style={{
              padding: '4px 9px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.72rem',
              fontWeight: language === 'vi' ? 700 : 500,
              background: language === 'vi' ? '#ffffff' : 'transparent',
              color: language === 'vi' ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              boxShadow: language === 'vi' ? 'var(--shadow-xs)' : 'none',
              transition: 'all var(--duration-fast) var(--ease-spring)'
            }}
            title="Giao diện tiếng Việt chuẩn hóa"
          >
            Tiếng Việt
          </button>
          <button
            onClick={() => setLanguage('en')}
            style={{
              padding: '4px 9px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.72rem',
              fontWeight: language === 'en' ? 700 : 500,
              background: language === 'en' ? '#ffffff' : 'transparent',
              color: language === 'en' ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              boxShadow: language === 'en' ? 'var(--shadow-xs)' : 'none',
              transition: 'all var(--duration-fast) var(--ease-spring)'
            }}
            title="English Interface"
          >
            English
          </button>
        </div>

        {/* Refresh Sync */}
        <button
          onClick={onRefresh}
          className="od-btn od-btn-secondary"
          style={{
            width: '32px',
            height: '32px',
            padding: 0,
            borderRadius: 'var(--radius-sm)'
          }}
          title={t.btnSync}
        >
          <RefreshCw size={14} color="var(--text-muted)" />
        </button>
      </div>
    </header>
  );
}

