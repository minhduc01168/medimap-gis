import { X, CheckCircle2, BookOpen, Sigma, Sparkles } from 'lucide-react';

export default function ReportModal({ isOpen, onClose, t }) {
  if (!isOpen) return null;

  const acItems = [
    { title: t.modalAc1Title, desc: t.modalAc1Desc, tag: 'AC-1' },
    { title: t.modalAc2Title, desc: t.modalAc2Desc, tag: 'AC-2' },
    { title: t.modalAc3Title, desc: t.modalAc3Desc, tag: 'AC-3' },
    { title: t.modalAc4Title, desc: t.modalAc4Desc, tag: 'AC-4' },
    { title: t.modalAc5Title, desc: t.modalAc5Desc, tag: 'AC-5' },
  ];

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px',
        animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
        style={{
          width: '100%',
          maxWidth: '740px',
          maxHeight: '88vh',
          overflowY: 'auto',
          padding: '24px 28px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          background: 'var(--bg-surface, #ffffff)',
          borderRadius: 'var(--radius-lg, 16px)',
          border: '1px solid var(--border-subtle, #e2e8f0)',
          boxShadow: 'var(--shadow-xl, 0 20px 45px -12px rgba(15, 23, 42, 0.22))'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle, #f1f5f9)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.12) 0%, rgba(13, 148, 136, 0.04) 100%)',
              border: '1px solid rgba(13, 148, 136, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <BookOpen size={20} color="var(--primary, #0d9488)" strokeWidth={2} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 id="report-modal-title" style={{ margin: 0, fontSize: '1.15rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-main, #0f172a)', letterSpacing: '-0.02em' }}>
                  {t.modalTitle}
                </h3>
                <span style={{ fontSize: '0.66rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', background: 'rgba(13, 148, 136, 0.1)', color: 'var(--primary, #0d9488)', border: '1px solid rgba(13, 148, 136, 0.2)' }}>
                  ISO/IEEE Spec
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary, #64748b)' }}>
                {t.modalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng cửa sổ"
            className="od-btn od-btn-secondary"
            style={{
              padding: '6px',
              borderRadius: '8px',
              color: 'var(--text-muted, #94a3b8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 5 Acceptance Criteria Cards */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary, #475569)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>
              {t.modalAcTitle}
            </h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--primary, #0d9488)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={13} /> 5/5 Đạt kiểm định
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {acItems.map((ac, idx) => (
              <div 
                key={idx} 
                style={{ 
                  padding: '12px 14px', 
                  background: 'var(--bg-app, #f8fafc)', 
                  borderRadius: 'var(--radius-md, 10px)', 
                  border: '1px solid var(--border-subtle, #e2e8f0)', 
                  display: 'flex', 
                  gap: '12px', 
                  alignItems: 'flex-start',
                  transition: 'border-color 0.15s ease, background 0.15s ease'
                }}
              >
                <CheckCircle2 size={18} color="var(--primary, #0d9488)" strokeWidth={2.2} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <strong style={{ color: 'var(--text-main, #0f172a)', fontSize: '0.82rem', fontWeight: 700 }}>
                      {ac.title}
                    </strong>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted, #94a3b8)', padding: '1px 6px', background: '#ffffff', borderRadius: '4px', border: '1px solid var(--border-subtle, #e2e8f0)' }}>
                      {ac.tag}
                    </span>
                  </div>
                  <p style={{ margin: '3px 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary, #64748b)', lineHeight: 1.5 }}>
                    {ac.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mathematical Formulas */}
        <div style={{ padding: '14px 16px', background: 'var(--bg-app, #f8fafc)', borderRadius: 'var(--radius-md, 12px)', border: '1px solid var(--border-subtle, #e2e8f0)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sigma size={16} color="var(--primary, #0d9488)" strokeWidth={2.2} />
            <h4 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-main, #0f172a)', fontWeight: 800 }}>
              {t.modalMathTitle}
            </h4>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-secondary, #334155)', lineHeight: 1.7, background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle, #e2e8f0)' }}>
            <div style={{ borderBottom: '1px dashed var(--border-subtle, #e2e8f0)', paddingBottom: '4px', marginBottom: '4px' }}>
              <span style={{ color: 'var(--primary, #0d9488)', fontWeight: 700 }}>1. Tobler:</span> {t.modalMathTobler}
            </div>
            <div style={{ borderBottom: '1px dashed var(--border-subtle, #e2e8f0)', paddingBottom: '4px', marginBottom: '4px' }}>
              <span style={{ color: '#0284c7', fontWeight: 700 }}>2. E2SFCA:</span> {t.modalMathE2sfca}
            </div>
            <div>
              <span style={{ color: '#8b5cf6', fontWeight: 700 }}>3. Moran&apos;s I:</span> {t.modalMathMoran}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '4px' }}>
          <button
            onClick={onClose}
            className="od-btn od-btn-primary"
            style={{
              padding: '9px 24px',
              fontSize: '0.82rem',
              fontWeight: 700
            }}
          >
            {t.modalCloseBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

