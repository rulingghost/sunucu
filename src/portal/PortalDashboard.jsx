import React from 'react';
import { 
  Server, 
  Cpu, 
  Database, 
  CreditCard, 
  ArrowRight, 
  Terminal, 
  RotateCw, 
  CheckCircle, 
  Clock, 
  PlusCircle, 
  ShieldCheck 
} from 'lucide-react';
import { AUDIT_LOGS } from '../data/mockPortalData';

export default function PortalDashboard({ 
  servers, 
  user, 
  onSelectServerManage, 
  onOpenTerminal, 
  onPowerAction,
  onOpenNewServer,
  onNavigateTab
}) {
  // Aggregate stats
  const activeCount = servers.filter(s => s.status === 'running').length;
  let totalCores = 0;
  let totalRamGb = 0;
  let monthlySpend = 0;

  servers.forEach(s => {
    monthlySpend += (s.priceMonthly || 0);
    // Parse cores and ram if possible
    if (s.cores.includes('Core') || s.cores.includes('vCPU')) {
      const match = s.cores.match(/(\d+)/);
      if (match) totalCores += parseInt(match[1], 10);
    }
    if (s.ram.includes('GB')) {
      const match = s.ram.match(/(\d+)/);
      if (match) totalRamGb += parseInt(match[1], 10);
    }
  });

  return (
    <div className="portal-content">
      {/* Top Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14, 25, 48, 0.9) 0%, rgba(10, 16, 30, 0.95) 100%)',
        border: '1px solid rgba(0, 210, 255, 0.25)',
        borderRadius: '16px',
        padding: '1.75rem 2rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--shadow-glow)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>
            Hoş Geldiniz, <span className="grad-cyber-text">{user.name}</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {user.company} • Müşteri Hesabı: <strong>#{user.customerId}</strong> • DDoS Koruması: <strong style={{ color: '#10b981' }}>Aktif</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn btn-primary btn-sm"
            onClick={onOpenNewServer}
          >
            <PlusCircle size={15} />
            <span>Yeni Sunucu Kirala</span>
          </button>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigateTab('tickets')}
          >
            <span>7/24 Destek Al</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="portal-stats-row">
        <div className="portal-stat-box">
          <div>
            <div className="portal-stat-label">Aktif Sunucular</div>
            <div className="portal-stat-val">{activeCount} / {servers.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.2rem' }}>
              ● Tüm servisler çalışıyor
            </div>
          </div>
          <div className="spec-icon-wrap" style={{ width: '44px', height: '44px' }}>
            <Server size={22} />
          </div>
        </div>

        <div className="portal-stat-box">
          <div>
            <div className="portal-stat-label">Toplam Hesap Gücü</div>
            <div className="portal-stat-val">{totalCores} vCPU</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              AMD EPYC & Ryzen 9
            </div>
          </div>
          <div className="spec-icon-wrap" style={{ width: '44px', height: '44px' }}>
            <Cpu size={22} />
          </div>
        </div>

        <div className="portal-stat-box">
          <div>
            <div className="portal-stat-label">Tahsis Edilen RAM</div>
            <div className="portal-stat-val">{totalRamGb} GB</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              DDR5 & DDR4 ECC
            </div>
          </div>
          <div className="spec-icon-wrap" style={{ width: '44px', height: '44px' }}>
            <Database size={22} />
          </div>
        </div>

        <div className="portal-stat-box">
          <div>
            <div className="portal-stat-label">Aylık Sunucu Gideri</div>
            <div className="portal-stat-val" style={{ color: 'var(--accent-cyan)' }}>
              ${monthlySpend.toLocaleString('tr-TR')}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.2rem' }}>
              Kredi Bakiyesi: ${user.balance?.toLocaleString('tr-TR')}
            </div>
          </div>
          <div className="spec-icon-wrap" style={{ width: '44px', height: '44px' }}>
            <CreditCard size={22} />
          </div>
        </div>
      </div>

      {/* Main Grid: Active Servers List & Audit Logs */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left: Server List */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Aktif Sunucu Altyapınız</h3>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigateTab('servers')}
            >
              <span>Tümünü Yönet ({servers.length})</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {servers.map(server => (
              <div key={server.id} className="server-card-item">
                <div className="server-header-row">
                  <div className="server-name-wrap">
                    <span style={{ fontSize: '1.4rem' }}>{server.flag}</span>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                        {server.name}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {server.hostname} • {server.planName}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className={`server-badge-status ${server.status}`}>
                      <span className={server.status === 'running' ? 'pulse-online' : 'pulse-warning'}></span>
                      {server.status === 'running' ? 'Çalışıyor' : server.status === 'rebooting' ? 'Yeniden Başlatılıyor' : 'Durduruldu'}
                    </span>
                  </div>
                </div>

                <div className="server-meta-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                  <div>
                    <div className="meta-sub">IP Adresi</div>
                    <div className="meta-val" style={{ color: 'var(--accent-cyan)' }}>{server.ip}</div>
                  </div>
                  <div>
                    <div className="meta-sub">Lokasyon</div>
                    <div className="meta-val">{server.location}</div>
                  </div>
                  <div>
                    <div className="meta-sub">Satın Alma Tarihi</div>
                    <div className="meta-val">{server.purchasedAt || '10.09.2026'}</div>
                  </div>
                  <div>
                    <div className="meta-sub">Sonraki Yenileme</div>
                    <div className="meta-val" style={{ color: '#38bdf8' }}>{server.renewalDate}</div>
                  </div>
                  <div>
                    <div className="meta-sub">Çalışma Süresi (Uptime)</div>
                    <div className="meta-val" style={{ color: '#10b981' }}>{server.uptime}</div>
                  </div>
                </div>

                <div className="power-actions-bar">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => onSelectServerManage(server.id)}
                  >
                    <Server size={14} />
                    <span>Sunucuyu Yönet</span>
                  </button>

                  <button 
                    className="btn btn-portal btn-sm"
                    onClick={() => onOpenTerminal(server)}
                  >
                    <Terminal size={14} />
                    <span>Web SSH Konsol</span>
                  </button>

                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => onPowerAction(server.id, 'reboot')}
                    disabled={server.status === 'rebooting'}
                  >
                    <RotateCw size={13} className={server.status === 'rebooting' ? 'spin' : ''} />
                    <span>Reboot</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Security & Recent Audit Trail */}
        <div>
          {/* Quick Security Status */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="var(--accent-cyan)" />
              <span>Güvenlik & Kalkan Durumu</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>DDoS Filtreleme:</span>
                <strong style={{ color: '#10b981' }}>3.2 Tbps L3/L4/L7 Devrede</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>İki Adımlı Doğrulama (2FA):</span>
                <strong style={{ color: '#10b981' }}>Aktif (Google Auth)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Son Giriş IP:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>88.241.12.9 (TR)</span>
              </div>
            </div>
          </div>

          {/* Audit Logs */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '1.5rem'
          }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="var(--text-secondary)" />
              <span>Son Hesap Hareketleri</span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {AUDIT_LOGS.map(log => (
                <div 
                  key={log.id} 
                  style={{ 
                    paddingBottom: '0.75rem', 
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    fontSize: '0.825rem'
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>{log.action}</div>
                  <div style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginTop: '0.15rem' }}>
                    {log.target}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                    <span>{log.time}</span>
                    <span>{log.ip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
