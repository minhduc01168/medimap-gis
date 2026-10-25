import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  CheckCircle
} from 'lucide-react';

export default function DataManagementView({ facilities = [], districtsStats = [], t, language }) {
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
      padding: '20px 24px',
      maxWidth: '1400px',
      margin: '0 auto',
      height: 'calc(100vh - 75px)',
      overflowY: 'auto'
    }}>
      {/* Top Banner / Summary */}
      <div className="glass-panel-elevated" style={{ padding: '20px 24px', marginBottom: '16px', background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {t.dmTitle}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '3px 0 0 0' }}>
              {t.dmSubtitle}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleExportCSV}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)'
              }}
            >
              <Download size={15} />
              {t.dmExportBtn}
            </button>
          </div>
        </div>

        {/* 3 Overview Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginTop: '16px' }}>
          <div style={{ padding: '14px 18px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
              {t.dmStatFacilities}
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0d9488', fontFamily: 'var(--font-mono)', margin: '3px 0' }}>
              67 {t.dmTotalSites}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 500 }}>
              19 Sa Pa • 28 Bát Xát • 20 Mường Khương
            </div>
          </div>

          <div style={{ padding: '14px 18px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
              {t.dmStatDoctors}
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0284c7', fontFamily: 'var(--font-mono)', margin: '3px 0' }}>
              209 {language === 'vi' ? 'Bác sĩ' : 'Physicians'}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 500 }}>
              {language === 'vi' ? 'Tỷ lệ bình quân 0.954 BS / 1.000 dân' : 'Avg 0.954 Doctors / 1,000 Pop'}
            </div>
          </div>

          <div style={{ padding: '14px 18px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
              {t.dmStatBeds}
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#d97706', fontFamily: 'var(--font-mono)', margin: '3px 0' }}>
              945 {language === 'vi' ? 'Giường' : 'Beds'}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 500 }}>
              {language === 'vi' ? 'Đáp ứng 4.31 giường / 1.000 dân' : 'Capacity 4.31 Beds / 1,000 Pop'}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '14px 18px', marginBottom: '16px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', background: '#ffffff' }}>
        {/* Search */}
        <div style={{ flex: '1 1 280px', position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder={t.dmSearchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '7px',
              color: '#0f172a',
              fontSize: '0.82rem',
              outline: 'none'
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
              padding: '8px 10px',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '7px',
              color: '#0f172a',
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
              padding: '8px 10px',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '7px',
              color: '#0f172a',
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

        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          {t.dmShowing}: <strong style={{ color: '#0f172a' }}>{filteredFacilities.length}</strong> / {facilities.length} {t.dmTotalSites}
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel" style={{ overflow: 'hidden', background: '#ffffff' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                <th style={{ padding: '10px 14px' }}>{t.dmColId}</th>
                <th style={{ padding: '10px 14px' }}>{t.dmColName}</th>
                <th style={{ padding: '10px 14px' }}>{t.dmColLocation}</th>
                <th style={{ padding: '10px 14px' }}>{t.dmColTier}</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>{t.dmColDoctors}</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>{t.dmColBeds}</th>
                <th style={{ padding: '10px 14px', textAlign: 'center' }}>{t.dmColCoords}</th>
                <th style={{ padding: '10px 14px', textAlign: 'center' }}>{t.dmColVerified}</th>
              </tr>
            </thead>
            <tbody>
              {filteredFacilities.map((f, idx) => {
                let badgeColor = '#0d9488';
                let tierText = language === 'vi' ? 'Tuyến 3 (Xã)' : 'Tier 3 (Commune)';
                if (f.tier === 1) {
                  badgeColor = '#d97706';
                  tierText = language === 'vi' ? 'Tuyến 1 (Tỉnh)' : 'Tier 1 (Provincial)';
                } else if (f.tier === 2) {
                  badgeColor = '#0284c7';
                  tierText = language === 'vi' ? 'Tuyến 2 (Huyện)' : 'Tier 2 (District)';
                }

                return (
                  <tr 
                    key={f.id} 
                    style={{ 
                      borderBottom: '1px solid #f1f5f9',
                      background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#64748b' }}>
                      {f.id}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#0f172a', fontWeight: 700 }}>
                      {f.name}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#334155' }}>
                      📍 {f.commune}, <span style={{ color: '#0284c7', fontWeight: 600 }}>{f.district}</span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: `${badgeColor}15`,
                        color: badgeColor,
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        border: `1px solid ${badgeColor}30`
                      }}>
                        {tierText}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#0284c7' }}>
                      {f.doctors}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#0d9488' }}>
                      {f.beds}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'center', fontFamily: 'var(--font-mono)', color: '#64748b', fontSize: '0.72rem' }}>
                      {f.lat.toFixed(4)}, {f.lon.toFixed(4)}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                      <span style={{ color: '#059669', fontSize: '0.74rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontWeight: 700 }}>
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
