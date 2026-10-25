import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  Download, 
  UploadCloud, 
  CheckCircle, 
  AlertCircle, 
  FileSpreadsheet,
  Building2,
  Users,
  Compass,
  Sliders
} from 'lucide-react';

export default function DataManagementView({ facilities = [], districtsStats = [] }) {
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
    const headers = ['id', 'name', 'district', 'commune', 'tier', 'type', 'beds', 'doctors', 'lat', 'lon'];
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
    link.setAttribute('download', `medimap_facilities_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      padding: '24px',
      maxWidth: '1400px',
      margin: '0 auto',
      height: 'calc(100vh - 84px)',
      overflowY: 'auto'
    }}>
      {/* Top Banner / Summary */}
      <div className="glass-panel-elevated" style={{ padding: '24px 28px', marginBottom: '20px', background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Cơ Sở Dữ Liệu Hạ Tầng Y Tế Tuyến Cơ Sở
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
              67 Cơ sở Y tế được đối soát vệ tinh 100% tại cụm 3 huyện Sa Pa, Bát Xát, Mường Khương (Lào Cai).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleExportCSV}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)'
              }}
            >
              <Download size={15} />
              Xuất CSV Catalog
            </button>
          </div>
        </div>

        {/* 3 Overview Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '20px' }}>
          <div style={{ padding: '16px 20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Quy Mô Hạ Tầng Y Tế
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0d9488', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
              67 Trạm
            </div>
            <div style={{ fontSize: '0.76rem', color: '#334155', fontWeight: 500 }}>
              19 Sa Pa • 28 Bát Xát • 20 Mường Khương
            </div>
          </div>

          <div style={{ padding: '16px 20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Tổng Nhân Lực Bác Sĩ
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0284c7', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
              209 Bác sĩ
            </div>
            <div style={{ fontSize: '0.76rem', color: '#334155', fontWeight: 500 }}>
              Tỷ lệ bình quân 0.954 BS / 1,000 dân
            </div>
          </div>

          <div style={{ padding: '16px 20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Công Suất Giường Bệnh
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d97706', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
              945 Giường
            </div>
            <div style={{ fontSize: '0.76rem', color: '#334155', fontWeight: 500 }}>
              Đáp ứng 4.31 giường / 1,000 dân
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', background: '#ffffff' }}>
        {/* Search */}
        <div style={{ flex: '1 1 280px', position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Tìm theo tên bệnh viện, trạm xá, xã, mã trạm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 38px',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              color: '#0f172a',
              fontSize: '0.84rem',
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
              padding: '9px 12px',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              color: '#0f172a',
              fontSize: '0.84rem',
              outline: 'none',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            <option value="">Tất cả các huyện</option>
            <option value="Thị xã Sa Pa">Thị xã Sa Pa</option>
            <option value="Huyện Bát Xát">Huyện Bát Xát</option>
            <option value="Huyện Mường Khương">Huyện Mường Khương</option>
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
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              color: '#0f172a',
              fontSize: '0.84rem',
              outline: 'none',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            <option value="">Tất cả phân tuyến</option>
            <option value="1">Tuyến 1 (Tỉnh)</option>
            <option value="2">Tuyến 2 (Huyện)</option>
            <option value="3">Tuyến 3 (Xã/PKĐK)</option>
          </select>
        </div>

        <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
          Hiển thị: <strong style={{ color: '#0f172a' }}>{filteredFacilities.length}</strong> / {facilities.length} trạm
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel" style={{ overflow: 'hidden', background: '#ffffff' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>
                <th style={{ padding: '12px 16px' }}>Mã CSYT</th>
                <th style={{ padding: '12px 16px' }}>Tên Cơ Sở Y Tế</th>
                <th style={{ padding: '12px 16px' }}>Huyện / Xã</th>
                <th style={{ padding: '12px 16px' }}>Phân Tuyến</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Bác Sĩ</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Giường</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Tọa Độ GPS</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Vệ Tinh</th>
              </tr>
            </thead>
            <tbody>
              {filteredFacilities.map((f, idx) => {
                let badgeColor = '#0d9488';
                let tierText = 'Tuyến 3 (Xã)';
                if (f.tier === 1) {
                  badgeColor = '#d97706';
                  tierText = 'Tuyến 1 (Tỉnh)';
                } else if (f.tier === 2) {
                  badgeColor = '#0284c7';
                  tierText = 'Tuyến 2 (Huyện)';
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
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: '#64748b' }}>
                      {f.id}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#0f172a', fontWeight: 700 }}>
                      {f.name}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#334155' }}>
                      📍 {f.commune}, <span style={{ color: '#0284c7', fontWeight: 600 }}>{f.district}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: `${badgeColor}15`,
                        color: badgeColor,
                        fontWeight: 700,
                        fontSize: '0.74rem',
                        border: `1px solid ${badgeColor}30`
                      }}>
                        {tierText}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#0284c7' }}>
                      {f.doctors}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#0d9488' }}>
                      {f.beds}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontFamily: 'var(--font-mono)', color: '#64748b', fontSize: '0.74rem' }}>
                      {f.lat.toFixed(4)}, {f.lon.toFixed(4)}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{ color: '#059669', fontSize: '0.76rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontWeight: 700 }}>
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
