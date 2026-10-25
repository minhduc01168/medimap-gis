import React from 'react';
import { X, CheckCircle2, Award, BookOpen, Layers, ShieldCheck, MapPin } from 'lucide-react';

export default function ReportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div 
        className="glass-panel-elevated"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '24px 28px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px' }}>
              <BookOpen size={20} color="#10b981" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#f8fafc' }}>
                Hồ Sơ Nghiên Cứu Khoa Học & Nghiệm Thu Pilot
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Dự án MediMap GIS — Cụm Sa Pa, Bát Xát, Mường Khương (Lào Cai)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 5 Acceptance Criteria Cards */}
        <div>
          <h4 style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            5 Tiêu Chí Nghiệm Thu Học Thuật (Pass 100%)
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ padding: '10px 14px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#f8fafc', fontSize: '0.82rem' }}>AC-1: Cơ sở Y tế Tuyến Cơ Sở</strong>
                <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  67 cơ sở y tế (19 Sa Pa, 28 Bát Xát, 20 Mường Khương). 100% tọa độ cổng trạm qua vệ tinh, loại bỏ sai số trụ sở UBND xã.
                </p>
              </div>
            </div>

            <div style={{ padding: '10px 14px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#f8fafc', fontSize: '0.82rem' }}>AC-2: Mạng Lưới Giao Thông Đường Bộ OSM</strong>
                <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  708,852 nodes, 1,419,463 cạnh (11,617.94 km đường). Bao phủ quốc lộ, tỉnh lộ, liên thôn và đường mòn sườn núi.
                </p>
              </div>
            </div>

            <div style={{ padding: '10px 14px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#f8fafc', fontSize: '0.82rem' }}>AC-3: Mô Hình Địa Hình NASA SRTM DEM 30m</strong>
                <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Độ cao biến thiên từ 80.0m đến 3,116.7m (sườn Hoàng Liên Sơn). Độ dốc trung bình 14.8%.
                </p>
              </div>
            </div>

            <div style={{ padding: '10px 14px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#f8fafc', fontSize: '0.82rem' }}>AC-4: Ma Sát Địa Hình & Hàm Tobler Vùng Cao</strong>
                <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  v(s) = v₀ · exp(-3.5 · |s + 0.05|). Tích hợp độ quanh co 1.75x phản ánh chính xác thực tế di chuyển đèo dốc.
                </p>
              </div>
            </div>

            <div style={{ padding: '10px 14px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#f8fafc', fontSize: '0.82rem' }}>AC-5: Xác Định Vùng Lõm & Tối Ưu Hóa P-Median</strong>
                <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Phát hiện 34,498 người (15.75%) nằm ngoài 60 phút. Thuật toán P-Median tìm ra 5 trạm mới, giải cứu 29,574 người (giảm 85.7% vùng lõm).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mathematical Formulas */}
        <div style={{ padding: '14px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '0.82rem', color: '#38bdf8', fontWeight: 700 }}>
            Hàm Toán Học Mô Hình Hóa Không Gian:
          </h4>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            <div>• Hàm ma sát độ dốc Tobler: <strong>v(s) = 32 · exp(-3.5 · |s + 0.05|)</strong> (km/h)</div>
            <div>• Mô hình E2SFCA: <strong>A_i = ∑ R_j · W(d_ij)</strong> (với Gaussian decay)</div>
            <div>• Tự tương quan không gian: <strong>Global Moran's I = 0.9306</strong> (Z = 298.29, p &lt; 0.001)</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Đã Hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
