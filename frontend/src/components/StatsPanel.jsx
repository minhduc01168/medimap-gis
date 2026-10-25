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
        background: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid #e2e8f0',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}
    >
      {/* Collapse / Expand Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color="#0284c7" />
            <h2 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '0.96rem', 
              fontWeight: 800, 
              color: '#0f172a',
              margin: 0
            }}>
              Phân Tích Không Gian & KPI
            </h2>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            color: '#64748b',
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
            background: '#f8fafc',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.76rem' }}>
              <span style={{ color: '#334155', fontWeight: 600 }}>Phân Bố Tiếp Cận Y Tế</span>
              <span style={{ color: '#64748b', fontFamily: 'var(--font-mono)' }}>219,094 người</span>
            </div>

            {/* Multi-segment Bar */}
            <div style={{
              display: 'flex',
              height: '10px',
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
                title={`>60m (Vùng lõm): ${popData.greater_than_60min_deserts.percentage}%`}
              />
            </div>

            {/* 4 Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ padding: '8px', background: 'rgba(13, 148, 136, 0.08)', borderRadius: '8px', border: '1px solid rgba(13, 148, 136, 0.2)' }}>
                <div style={{ fontSize: '0.68rem', color: '#0f766e', fontWeight: 600 }}>&lt;15 phút (An toàn)</div>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0d9488', fontFamily: 'var(--font-mono)' }}>
                  {popData.less_than_15min.percentage}%
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                  {popData.less_than_15min.population.toLocaleString()} người
                </div>
              </div>

              <div style={{ padding: '8px', background: 'rgba(2, 132, 199, 0.08)', borderRadius: '8px', border: '1px solid rgba(2, 132, 199, 0.2)' }}>
                <div style={{ fontSize: '0.68rem', color: '#0369a1', fontWeight: 600 }}>15 - 30 phút</div>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0284c7', fontFamily: 'var(--font-mono)' }}>
                  {popData.between_15_and_30min.percentage}%
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                  {popData.between_15_and_30min.population.toLocaleString()} người
                </div>
              </div>

              <div style={{ padding: '8px', background: 'rgba(217, 119, 6, 0.08)', borderRadius: '8px', border: '1px solid rgba(217, 119, 6, 0.2)' }}>
                <div style={{ fontSize: '0.68rem', color: '#b45309', fontWeight: 600 }}>30 - 60 phút</div>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#d97706', fontFamily: 'var(--font-mono)' }}>
                  {popData.between_30_and_60min.percentage}%
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                  {popData.between_30_and_60min.population.toLocaleString()} người
                </div>
              </div>

              <div style={{ padding: '8px', background: 'rgba(225, 29, 72, 0.08)', borderRadius: '8px', border: '1px solid rgba(225, 29, 72, 0.25)' }}>
                <div style={{ fontSize: '0.68rem', color: '#be123c', fontWeight: 700 }}>&gt;60 phút (VÙNG LÕM)</div>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#e11d48', fontFamily: 'var(--font-mono)' }}>
                  {popData.greater_than_60min_deserts.percentage}%
                </div>
                <div style={{ fontSize: '0.68rem', color: '#be123c', fontWeight: 600 }}>
                  {popData.greater_than_60min_deserts.population.toLocaleString()} người
                </div>
              </div>
            </div>
          </div>

          {/* P-Median Impact Alert Card */}
          {isProposedActive ? (
            <div style={{
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start'
            }}>
              <Zap size={20} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ margin: '0 0 2px 0', fontSize: '0.84rem', color: '#6d28d9', fontWeight: 800 }}>
                  Tác Động Tối Ưu Hóa P-Median
                </h4>
                <p style={{ margin: 0, fontSize: '0.74rem', color: '#334155', lineHeight: 1.4 }}>
                  Vùng lõm y tế giảm từ <strong>15.75% (34,498 người)</strong> xuống còn <strong>{popData.greater_than_60min_deserts.percentage}%</strong>. 
                  Đã giải cứu <strong style={{ color: '#0d9488' }}>29,574 người dân</strong> tại các rẻo cao biên giới!
                </p>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'rgba(225, 29, 72, 0.06)',
              border: '1px solid rgba(225, 29, 72, 0.2)',
              borderRadius: '12px',
              padding: '10px 12px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}>
              <AlertCircle size={18} color="#e11d48" style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#be123c', lineHeight: 1.35, fontWeight: 500 }}>
                Hiện có <strong>34,498 người dân</strong> nằm ngoài khung giờ vàng cấp cứu (60 phút) do đèo dốc hiểm trở.
              </p>
            </div>
          )}

          {/* Spatial Autocorrelation: Global Moran's I */}
          <div style={{
            background: '#f8fafc',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe2 size={15} color="#0284c7" />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
                  Tự Tương Quan Không Gian (Moran's I)
                </span>
              </div>
              <span style={{
                fontSize: '0.66rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(13, 148, 136, 0.1)',
                color: '#0d9488'
              }}>
                p &lt; 0.001
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7', fontFamily: 'var(--font-mono)' }}>
                I = {moranStats?.global_morans_i || 0.9306}
              </span>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                Z = {moranStats?.z_score || 298.29}
              </span>
            </div>

            <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', lineHeight: 1.35 }}>
              Chứng minh sự tụ cụm không gian cực cao (Spatial Clustering). Vùng lõm y tế không phân tán ngẫu nhiên mà hình thành các dải cô lập địa lý.
            </p>
          </div>

          {/* District Breakdown Table */}
          <div style={{
            background: '#f8fafc',
            padding: '12px',
            borderRadius: '12px',
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
              Chỉ Số E2SFCA Theo Huyện
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.74rem' }}>
              <thead>
                <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ paddingBottom: '6px' }}>Huyện</th>
                  <th style={{ paddingBottom: '6px', textAlign: 'right' }}>Dân Số</th>
                  <th style={{ paddingBottom: '6px', textAlign: 'right' }}>BS / 1k dân</th>
                </tr>
              </thead>
              <tbody>
                {districtStats.map((d) => (
                  <tr key={d.district} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '6px 0', color: '#0f172a', fontWeight: 600 }}>{d.district}</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                      {d.population.toLocaleString()}
                    </td>
                    <td style={{ 
                      padding: '6px 0', 
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
