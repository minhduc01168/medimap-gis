import { useState } from 'react';
import { 
  Search, 
  Download, 
  CheckCircle
} from 'lucide-react';

export default function DataManagementView({ facilities = [], t, language }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');

  // Filtering facilities
  const filteredFacilities = facilities.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.commune.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = !districtFilter || f.district === districtFilter;
    const matchesTier = !tierFilter || f.tier === Number(tierFilter);
    return matchesSearch && matchesDistrict && matchesTier;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      t.dmColId,
      t.dmColName,
      t.colDistrict,
      language === 'vi' ? 'Xã' : 'Commune',
      t.dmColTier,
      t.popupType,
      t.dmColBeds,
      t.dmColDoctors,
      language === 'vi' ? 'Vĩ độ' : 'Latitude',
      language === 'vi' ? 'Kinh độ' : 'Longitude'
    ];
    
    const rows = filteredFacilities.map(f => [
      f.id,
      `"${f.name}"`,
      `"${f.district}"`,
      `"${f.commune}"`,
      f.tier,
      f.type,
      f.beds,
      f.doctors,
      f.lat,
      f.lon
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `medimap_facilities_${language}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      padding: '24px 28px',
      maxWidth: '1440px',
      margin: '0 auto',
      height: 'calc(100vh - 75px)',
      overflowY: 'auto'
    }}>
      {/* Top Banner / Summary */}
      <div className="od-card" style={{ padding: '24px', marginBottom: '20px', background: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
              {t.dmTitle}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '4px 0 0 0', fontWeight: 500 }}>
              {t.dmSubtitle}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleExportCSV}
              className="od-btn od-btn-primary"
              style={{
                padding: '9px 18px',
                fontSize: '0.82rem'
              }}
            >
              <Download size={15} strokeWidth={2.2} />
              <span>{t.dmExportBtn}</span>
            </button>
          </div>
        </div>

        {/* 3 Overview Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '20px' }}>
          <div className="od-card" style={{ padding: '16px 20px', background: 'var(--bg-surface-secondary)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {t.dmStatFacilities}
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)', margin: '4px 0', fontVariantNumeric: 'tabular-nums' }}>
              67 {t.dmTotalSites}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              19 Sa Pa • 28 Bát Xát • 20 Mường Khương
            </div>
          </div>

          <div className="od-card" style={{ padding: '16px 20px', background: 'var(--bg-surface-secondary)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {t.dmStatDoctors}
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--tier-2-sky)', fontFamily: 'var(--font-display)', margin: '4px 0', fontVariantNumeric: 'tabular-nums' }}>
              209 {language === 'vi' ? 'Bác sĩ' : 'Physicians'}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              {language === 'vi' ? 'Tỷ lệ bình quân 0.954 BS / 1.000 dân' : 'Avg 0.954 Doctors / 1,000 Pop'}
            </div>
          </div>

          <div className="od-card" style={{ padding: '16px 20px', background: 'var(--bg-surface-secondary)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {t.dmStatBeds}
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--tier-1-amber)', fontFamily: 'var(--font-display)', margin: '4px 0', fontVariantNumeric: 'tabular-nums' }}>
              945 {language === 'vi' ? 'Giường' : 'Beds'}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              {language === 'vi' ? 'Đáp ứng 4.31 giường / 1.000 dân' : 'Capacity 4.31 Beds / 1,000 Pop'}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="od-card" style={{ padding: '14px 20px', marginBottom: '20px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', background: '#ffffff' }}>
        {/* Search */}
        <div style={{ flex: '1 1 280px', position: 'relative' }}>
          <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder={t.dmSearchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 38px',
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-main)',
              fontSize: '0.82rem',
              outline: 'none',
              transition: 'border-color 0.15s ease'
            }}
          />
        </div>

        {/* District Filter */}
        <div style={{ minWidth: '190px' }}>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px',
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-main)',
              fontSize: '0.8rem',
              outline: 'none',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            <option value="">{t.dmFilterAllDistricts}</option>
            <option value="Thị xã Sa Pa">{t.districtSapa}</option>
            <option value="Huyện Bát Xát">{t.districtBatxat}</option>
            <option value="Huyện Mường Khương">{t.districtMuongkhuong}</option>
          </select>
        </div>

        {/* Tier Filter */}
        <div style={{ minWidth: '160px' }}>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px',
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-main)',
              fontSize: '0.8rem',
              outline: 'none',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            <option value="">{t.dmFilterAllTiers}</option>
            <option value="1">{t.dmFilterTier1}</option>
            <option value="2">{t.dmFilterTier2}</option>
            <option value="3">{t.dmFilterTier3}</option>
          </select>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {t.dmShowing}: <strong style={{ color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums' }}>{filteredFacilities.length}</strong> / {facilities.length} {t.dmTotalSites}
        </div>
      </div>

      {/* Main Table */}
      <div className="od-card" style={{ overflow: 'hidden', background: '#ffffff' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-secondary)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700 }}>
                <th style={{ padding: '12px 16px' }}>{t.dmColId}</th>
                <th style={{ padding: '12px 16px' }}>{t.dmColName}</th>
                <th style={{ padding: '12px 16px' }}>{t.dmColLocation}</th>
                <th style={{ padding: '12px 16px' }}>{t.dmColTier}</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>{t.dmColDoctors}</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>{t.dmColBeds}</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>{t.dmColCoords}</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>{t.dmColVerified}</th>
              </tr>
            </thead>
            <tbody>
              {filteredFacilities.map((f, idx) => {
                let badgeColor = 'var(--primary)';
                let badgeBg = 'var(--primary-50)';
                let tierText = language === 'vi' ? 'Tuyến 3 (Xã)' : 'Tier 3 (Commune)';
                if (f.tier === 1) {
                  badgeColor = 'var(--tier-1-amber)';
                  badgeBg = 'var(--tier-1-bg)';
                  tierText = language === 'vi' ? 'Tuyến 1 (Tỉnh)' : 'Tier 1 (Provincial)';
                } else if (f.tier === 2) {
                  badgeColor = 'var(--tier-2-sky)';
                  badgeBg = 'var(--tier-2-bg)';
                  tierText = language === 'vi' ? 'Tuyến 2 (Huyện)' : 'Tier 2 (District)';
                }

                return (
                  <tr 
                    key={f.id} 
                    style={{ 
                      borderBottom: '1px solid var(--border-subtle)',
                      background: idx % 2 === 0 ? '#ffffff' : 'var(--bg-surface-secondary)',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.76rem' }}>
                      {f.id}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-main)', fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '0.84rem' }}>
                      {f.name}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                      📍 {f.commune}, <span style={{ color: 'var(--tier-2-sky)', fontWeight: 600 }}>{f.district}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-xs)',
                        background: badgeBg,
                        color: badgeColor,
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        border: `1px solid ${badgeColor}35`
                      }}>
                        {tierText}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--tier-2-sky)', fontVariantNumeric: 'tabular-nums' }}>
                      {f.doctors}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
                      {f.beds}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.72rem', fontVariantNumeric: 'tabular-nums' }}>
                      {f.lat.toFixed(4)}, {f.lon.toFixed(4)}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{ color: 'var(--primary)', fontSize: '0.74rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontWeight: 700 }}>
                        <CheckCircle size={14} /> 100%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
