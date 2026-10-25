import { useState } from 'react';
import { 
  BarChart3, 
  ChevronRight, 
  ChevronLeft, 
  Globe2,
  Zap,
  AlertCircle
} from 'lucide-react';

export default function StatsPanel({
  simulationResult,
  moranStats,
  districtStats = [],
  isProposedActive,
  t
}) {
  const [collapsed, setCollapsed] = useState(false);

  const popData = simulationResult?.population_accessibility || {
    less_than_15min: { population: 78723, percentage: 35.93 },
    between_15_and_30min: { population: 57754, percentage: 26.36 },
    between_30_and_60min: { population: 48119, percentage: 21.96 },
    greater_than_60min_deserts: { population: 34498, percentage: 15.75 }
  };

  const totalPop = 219094;

  return (
    <div 
      className="glass-panel"
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        width: collapsed ? '40px' : '315px',
        maxHeight: 'calc(100vh - 95px)',
        overflowY: collapsed ? 'hidden' : 'auto',
        zIndex: 850,
        padding: collapsed ? '8px 6px' : '14px',
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        background: 'rgba(255, 255, 255, 0.96)',
        border: '1px solid #e2e8f0',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      {/* Collapse / Expand Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <BarChart3 size={17} color="#0284c7" />
            <h2 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '0.9rem', 
              fontWeight: 800, 
              color: '#0f172a',
              margin: 0
            }}>
              {t.statsTitle}
            </h2>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: '5px',
            color: '#64748b',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '26px',
            height: '26px'
          }}
          title={collapsed ? t.statsExpand : t.statsCollapse}
        >
          {collapsed ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
        </button>
      </div>

      {collapsed ? null : (
        <>
          {/* Real-time Accessibility Progress Bar */}
          <div style={{
            background: '#f8fafc',
            padding: '10px 12px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.74rem' }}>
              <span style={{ color: '#334155', fontWeight: 600 }}>{t.statsAccessTitle}</span>
              <span style={{ color: '#64748b', fontFamily: 'var(--font-mono)' }}>{totalPop.toLocaleString()} {t.peopleUnit}</span>
            </div>

            {/* Multi-segment Bar */}
            <div style={{
              display: 'flex',
              height: '9px',
              borderRadius: '9999px',
              overflow: 'hidden',
              background: '#e2e8f0',
              marginBottom: '10px'
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

            {/* 4 Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div style={{ padding: '6px 8px', background: 'rgba(13, 148, 136, 0.08)', borderRadius: '6px', border: '1px solid rgba(13, 148, 136, 0.2)' }}>
                <div style={{ fontSize: '0.66rem', color: '#0f766e', fontWeight: 600 }}>{t.bandUnder15}</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0d9488', fontFamily: 'var(--font-mono)' }}>
                  {popData.less_than_15min.percentage}%
                </div>
                <div style={{ fontSize: '0.64rem', color: '#64748b' }}>
                  {popData.less_than_15min.population.toLocaleString()} {t.peopleUnit}
                </div>
              </div>

              <div style={{ padding: '6px 8px', background: 'rgba(2, 132, 199, 0.08)', borderRadius: '6px', border: '1px solid rgba(2, 132, 199, 0.2)' }}>
                <div style={{ fontSize: '0.66rem', color: '#0369a1', fontWeight: 600 }}>{t.band15to30}</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0284c7', fontFamily: 'var(--font-mono)' }}>
                  {popData.between_15_and_30min.percentage}%
                </div>
                <div style={{ fontSize: '0.64rem', color: '#64748b' }}>
                  {popData.between_15_and_30min.population.toLocaleString()} {t.peopleUnit}
                </div>
              </div>

              <div style={{ padding: '6px 8px', background: 'rgba(217, 119, 6, 0.08)', borderRadius: '6px', border: '1px solid rgba(217, 119, 6, 0.2)' }}>
                <div style={{ fontSize: '0.66rem', color: '#b45309', fontWeight: 600 }}>{t.band30to60}</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#d97706', fontFamily: 'var(--font-mono)' }}>
                  {popData.between_30_and_60min.percentage}%
                </div>
                <div style={{ fontSize: '0.64rem', color: '#64748b' }}>
                  {popData.between_30_and_60min.population.toLocaleString()} {t.peopleUnit}
                </div>
              </div>

              <div style={{ padding: '6px 8px', background: 'rgba(225, 29, 72, 0.08)', borderRadius: '6px', border: '1px solid rgba(225, 29, 72, 0.25)' }}>
                <div style={{ fontSize: '0.66rem', color: '#be123c', fontWeight: 700 }}>{t.bandOver60}</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#e11d48', fontFamily: 'var(--font-mono)' }}>
                  {popData.greater_than_60min_deserts.percentage}%
                </div>
                <div style={{ fontSize: '0.64rem', color: '#be123c', fontWeight: 600 }}>
                  {popData.greater_than_60min_deserts.population.toLocaleString()} {t.peopleUnit}
                </div>
              </div>
            </div>
          </div>

          {/* P-Median Impact Alert Card */}
          {isProposedActive ? (
            <div style={{
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(139, 92, 246, 0.04) 100%)',
              border: '1.5px solid rgba(124, 58, 237, 0.3)',
              borderRadius: '10px',
              padding: '10px',
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-start'
            }}>
              <Zap size={18} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ margin: '0 0 2px 0', fontSize: '0.8rem', color: '#6d28d9', fontWeight: 800 }}>
                  {t.optImpactTitle}
                </h4>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#334155', lineHeight: 1.35 }}>
                  {t.optImpactDescActive.replace('{pct}', `${popData.greater_than_60min_deserts.percentage}%`)}
                </p>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'rgba(225, 29, 72, 0.06)',
              border: '1px solid rgba(225, 29, 72, 0.2)',
              borderRadius: '10px',
              padding: '8px 10px',
              display: 'flex',
              gap: '7px',
              alignItems: 'center'
            }}>
              <AlertCircle size={16} color="#e11d48" style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#be123c', lineHeight: 1.3, fontWeight: 500 }}>
                {t.optImpactDescInactive}
              </p>
            </div>
          )}

          {/* Spatial Autocorrelation: Global Moran's I */}
          <div style={{
            background: '#f8fafc',
            padding: '10px 12px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Globe2 size={14} color="#0284c7" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                  {t.moranTitle}
                </span>
              </div>
              <span style={{
                fontSize: '0.64rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                padding: '2px 5px',
                borderRadius: '4px',
                background: 'rgba(13, 148, 136, 0.1)',
                color: '#0d9488'
              }}>
                p &lt; 0.001
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '3px' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0284c7', fontFamily: 'var(--font-mono)' }}>
                I = {moranStats?.global_morans_i || 0.9306}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                Z = {moranStats?.z_score || 298.29}
              </span>
            </div>

            <p style={{ margin: 0, fontSize: '0.68rem', color: '#64748b', lineHeight: 1.3 }}>
              {t.moranDesc}
            </p>
          </div>

          {/* District Breakdown Table */}
          <div style={{
            background: '#f8fafc',
            padding: '10px 12px',
            borderRadius: '10px',
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
              {t.districtTableTitle}
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem' }}>
              <thead>
                <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ paddingBottom: '4px' }}>{t.colDistrict}</th>
                  <th style={{ paddingBottom: '4px', textAlign: 'right' }}>{t.colPop}</th>
                  <th style={{ paddingBottom: '4px', textAlign: 'right' }}>{t.colDocPer1k}</th>
                </tr>
              </thead>
              <tbody>
                {districtStats.map((d) => (
                  <tr key={d.district} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '5px 0', color: '#0f172a', fontWeight: 600 }}>{d.district}</td>
                    <td style={{ padding: '5px 0', textAlign: 'right', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                      {d.population.toLocaleString()}
                    </td>
                    <td style={{ 
                      padding: '5px 0', 
                      textAlign: 'right', 
                      color: d.mean_doctors_per_1k < 0.9 ? '#e11d48' : '#0d9488',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {d.mean_doctors_per_1k.toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
