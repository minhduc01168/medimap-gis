import React from 'react';
import { X, CheckCircle2, BookOpen } from 'lucide-react';

export default function ReportModal({ isOpen, onClose, t, language }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(6px)',
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
          maxWidth: '760px',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '24px 28px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: '#ffffff',
          borderRadius: '14px',
          boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.25)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', background: 'rgba(13, 148, 136, 0.1)', borderRadius: '8px' }}>
              <BookOpen size={20} color="#0d9488" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#0f172a' }}>
                {t.modalTitle}
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                {t.modalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '7px',
              color: '#64748b',
              cursor: 'pointer',
              padding: '5px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={17} />
          </button>
        </div>

        {/* 5 Acceptance Criteria Cards */}
        <div>
          <h4 style={{ fontSize: '0.82rem', color: '#334155', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800 }}>
            {t.modalAcTitle}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid rgba(13, 148, 136, 0.25)', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <CheckCircle2 size={18} color="#0d9488" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#0f172a', fontSize: '0.82rem' }}>{t.modalAc1Title}</strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                  {t.modalAc1Desc}
                </p>
              </div>
            </div>

            <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid rgba(13, 148, 136, 0.25)', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <CheckCircle2 size={18} color="#0d9488" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#0f172a', fontSize: '0.82rem' }}>{t.modalAc2Title}</strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                  {t.modalAc2Desc}
                </p>
              </div>
            </div>

            <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid rgba(13, 148, 136, 0.25)', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <CheckCircle2 size={18} color="#0d9488" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#0f172a', fontSize: '0.82rem' }}>{t.modalAc3Title}</strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                  {t.modalAc3Desc}
                </p>
              </div>
            </div>

            <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid rgba(13, 148, 136, 0.25)', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <CheckCircle2 size={18} color="#0d9488" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#0f172a', fontSize: '0.82rem' }}>{t.modalAc4Title}</strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                  {t.modalAc4Desc}
                </p>
              </div>
            </div>

            <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid rgba(13, 148, 136, 0.25)', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <CheckCircle2 size={18} color="#0d9488" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#0f172a', fontSize: '0.82rem' }}>{t.modalAc5Title}</strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                  {t.modalAc5Desc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mathematical Formulas */}
        <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '0.8rem', color: '#0284c7', fontWeight: 800 }}>
            {t.modalMathTitle}
          </h4>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#334155', lineHeight: 1.6 }}>
            <div>{t.modalMathTobler}</div>
            <div>{t.modalMathE2sfca}</div>
            <div>{t.modalMathMoran}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: '7px',
              background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)'
            }}
          >
            {t.modalCloseBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
