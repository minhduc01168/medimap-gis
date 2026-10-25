import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft, 
  Award,
  Globe2,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function StatsPanel({
  simulationResult,
  moranStats,
  districtStats = [],
  isProposedActive
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
        top: '20px',
        right: '20px',
        width: collapsed ? '44px' : '340px',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: collapsed ? 'hidden' : 'auto',
        zIndex: 850,
        padding: collapsed ? '10px 8px' : '18px',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}
    >
      {/* Collapse / Expand Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color="#06b6d4" />
            <h2 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '0.95rem', 
              fontWeight: 700, 
              color: '#f8fafc',
              margin: 0
            }}>
              Phân Tích Không Gian & KPI
            </h2>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px'
          }}
          title={collapsed ? 'Mở rộng bảng thống kê' : 'Thu nhỏ'}
        >
          {collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {collapsed ? null : (
        <>
          {/* Real-time Accessibility Progress Bar */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.76rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Phân Bố Tiếp Cận Y Tế</span>
              <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>219,094 người</span>
            </div>

            {/* Multi-segment Bar */}
            <div style={{
              display: 'flex',
              height: '10px',
              borderRadius: '9999px',
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.05)',
              marginBottom: '10px'
            }}>
              <div 
                style={{ 
                  width: `${popData.less_than_15min.percentage}%`, 
                  background: 'linear-gradient(90deg, #059669, #10b981)',
                  transition: 'width 0.3s ease'
                }} 
                title={`<15m: ${popData.less_than_15min.percentage}%`}
              />
              <div 
                style={{ 
                  width: `${popData.between_15_and_30min.percentage}%`, 
                  background: 'linear-gradient(90deg, #0284c7, #06b6d4)',
                  transition: 'width 0.3s ease'
                }} 
                title={`15-30m: ${popData.between_15_and_30min.percentage}%`}
              />
              <div 
                style={{ 
                  width: `${popData.between_30_and_60min.percentage}%`, 
                  background: 'linear-gradient(90deg, #d97706, #f59e0b)',
                  transition: 'width 0.3s ease'
                }} 
                title={`30-60m: ${popData.between_30_and_60min.percentage}%`}
              />
              <div 
                style={{ 
                  width: `${popData.greater_than_60min_deserts.percentage}%`, 
                  background: 'linear-gradient(90deg, #e11d48, #f43f5e)',
                  transition: 'width 0.3s ease'
                }} 
                title={`>60m (Vùng lõm): ${popData.greater_than_60min_deserts.percentage}%`}
              />
            </div>

            {/* 4 Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ fontSize: '0.68rem', color: '#6ee7b7' }}>&lt;15 phút (An toàn)</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                  {popData.less_than_15min.percentage}%
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)' }}>
                  {popData.less_than_15min.population.toLocaleString()} người
                </div>
              </div>

              <div style={{ padding: '8px', background: 'rgba(6, 182, 212, 0.08)', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                <div style={{ fontSize: '0.68rem', color: '#7dd3fc' }}>15 - 30 phút</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  {popData.between_15_and_30min.percentage}%
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)' }}>
                  {popData.between_15_and_30min.population.toLocaleString()} người
                </div>
              </div>

              <div style={{ padding: '8px', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div style={{ fontSize: '0.68rem', color: '#fde68a' }}>30 - 60 phút</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                  {popData.between_30_and_60min.percentage}%
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)' }}>
                  {popData.between_30_and_60min.population.toLocaleString()} người
                </div>
              </div>

              <div style={{ padding: '8px', background: 'rgba(244, 63, 94, 0.12)', borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                <div style={{ fontSize: '0.68rem', color: '#fda4af', fontWeight: 700 }}>&gt;60 phút (VÙNG LÕM)</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f43f5e', fontFamily: 'var(--font-mono)' }}>
                  {popData.greater_than_60min_deserts.percentage}%
                </div>
                <div style={{ fontSize: '0.66rem', color: '#fda4af' }}>
                  {popData.greater_than_60min_deserts.population.toLocaleString()} người
                </div>
              </div>
            </div>
          </div>

          {/* P-Median Impact Alert Card */}
          {isProposedActive ? (
            <div style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(88, 28, 135, 0.3) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.45)',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start'
            }}>
              <Zap size={20} color="#c084fc" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ margin: '0 0 2px 0', fontSize: '0.82rem', color: '#f8fafc', fontWeight: 700 }}>
                  Tác Động Tối Ưu Hóa P-Median
                </h4>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#e9d5ff', lineHeight: 1.4 }}>
                  Vùng lõm y tế giảm từ <strong>15.75% (34,498 người)</strong> xuống còn <strong>{popData.greater_than_60min_deserts.percentage}%</strong>. 
                  Đã giải cứu <strong style={{ color: '#34d399' }}>29,574 người dân</strong> tại các rẻo cao biên giới!
                </p>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'rgba(244, 63, 94, 0.08)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              borderRadius: '12px',
              padding: '10px 12px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}>
              <AlertCircle size={18} color="#f43f5e" style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#fda4af', lineHeight: 1.35 }}>
                Hiện có <strong>34,498 người dân</strong> nằm ngoài khung giờ vàng cấp cứu (60 phút) do đèo dốc hiểm trở.
              </p>
            </div>
          )}

          {/* Spatial Autocorrelation: Global Moran's I */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe2 size={15} color="#38bdf8" />
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Tự Tương Quan Không Gian (Moran's I)
                </span>
              </div>
              <span style={{
                fontSize: '0.64rem',
                fontFamily: 'var(--font-mono)',
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399'
              }}>
                p &lt; 0.001
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                I = {moranStats?.global_morans_i || 0.9306}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Z = {moranStats?.z_score || 298.29}
              </span>
            </div>

            <p style={{ margin: 0, fontSize: '0.68rem', color: 'var(--text-dim)', lineHeight: 1.35 }}>
              Chứng minh sự tụ cụm không gian cực cao (Spatial Clustering). Vùng lõm y tế không phân tán ngẫu nhiên mà hình thành các dải cô lập địa lý.
            </p>
          </div>

          {/* District Breakdown Table */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '12px',
            borderRadius: '12px',
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
              Chỉ Số E2SFCA Theo Huyện
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                  <th style={{ paddingBottom: '6px' }}>Huyện</th>
                  <th style={{ paddingBottom: '6px', textAlign: 'right' }}>Dân Số</th>
                  <th style={{ paddingBottom: '6px', textAlign: 'right' }}>BS / 1k dân</th>
                </tr>
              </thead>
              <tbody>
                {districtStats.map((d) => (
                  <tr key={d.district} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '6px 0', color: '#f8fafc', fontWeight: 600 }}>{d.district}</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {d.population.toLocaleString()}
                    </td>
                    <td style={{ 
                      padding: '6px 0', 
                      textAlign: 'right', 
                      color: d.mean_doctors_per_1k < 0.9 ? '#fda4af' : '#34d399',
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
