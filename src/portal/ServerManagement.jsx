import React, { useState } from 'react';
import { 
  Server, 
  Power, 
  RotateCw, 
  Terminal, 
  RefreshCw, 
  ShieldCheck, 
  Database, 
  Cpu, 
  HardDrive, 
  Network, 
  Activity, 
  Camera, 
  FileText, 
  Check, 
  Trash2, 
  AlertTriangle 
} from 'lucide-react';
import { OPERATING_SYSTEMS } from '../data/serverPlans';

export default function ServerManagement({ 
  servers, 
  selectedServerId, 
  setSelectedServerId, 
  onPowerAction, 
  onOpenTerminal,
  onUpdateRdns,
  onCreateSnapshot,
  onRestoreSnapshot,
  onReinstallOS
}) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, network, snapshots, reinstall
  const [rdnsInput, setRdnsInput] = useState('');
  const [newSnapshotName, setNewSnapshotName] = useState('');
  const [selectedNewOS, setSelectedNewOS] = useState('ubuntu-24');
  const [newRootPass, setNewRootPass] = useState('NovaQ@2026!');
  const [showReinstallConfirm, setShowReinstallConfirm] = useState(false);

  const currentServer = servers.find(s => s.id === selectedServerId) || servers[0];

  // Set initial rDNS input when server switches
  React.useEffect(() => {
    if (currentServer) {
      setRdnsInput(currentServer.rdns || '');
    }
  }, [currentServer?.id]);

  if (!currentServer) {
    return <div className="portal-content">Henüz kayıtlı sunucunuz bulunmuyor.</div>;
  }

  // Draw SVG sparkline
  const renderSparkline = (data, color) => {
    const min = 0;
    const max = 100;
    const width = 280;
    const height = 45;
    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / (max - min)) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="metric-sparkline" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon 
          points={`0,${height} ${points} ${width},${height}`} 
          fill={`url(#grad-${color})`} 
        />
        <polyline 
          points={points} 
          fill="none" 
          stroke={color} 
          strokeWidth="2.5" 
          strokeLinecap="round" 
        />
      </svg>
    );
  };

  return (
    <div className="portal-content">
      {/* Server Selector Ribbon */}
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        {servers.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedServerId(s.id)}
            style={{
              background: s.id === currentServer.id ? 'rgba(0, 210, 255, 0.15)' : 'rgba(14, 20, 36, 0.7)',
              border: `1px solid ${s.id === currentServer.id ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
              borderRadius: '12px',
              padding: '0.75rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: s.id === currentServer.id ? 'var(--shadow-glow)' : 'none'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{s.flag}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>{s.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{s.ip}</div>
            </div>
            <span className={`server-badge-status ${s.status}`} style={{ marginLeft: '0.5rem', padding: '0.15rem 0.45rem', fontSize: '0.7rem' }}>
              {s.status === 'running' ? 'Aktif' : s.status === 'rebooting' ? 'Reboot' : 'Kapalı'}
            </span>
          </button>
        ))}
      </div>

      {/* Main Server Controller Card */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        backdropFilter: 'blur(16px)'
      }}>
        {/* Top bar with power controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.8rem' }}>{currentServer.flag}</span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{currentServer.name}</h2>
              <span className={`server-badge-status ${currentServer.status}`} style={{ fontSize: '0.85rem' }}>
                <span className={currentServer.status === 'running' ? 'pulse-online' : 'pulse-warning'}></span>
                {currentServer.status === 'running' ? 'Çevrimiçi (Online)' : currentServer.status === 'rebooting' ? 'Yeniden Başlatılıyor' : 'Çevrimdışı'}
              </span>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
              {currentServer.hostname} • {currentServer.location} • Uptime: <strong style={{ color: '#10b981' }}>{currentServer.uptime}</strong>
            </div>
          </div>

          {/* Power Controls */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-portal btn-sm"
              onClick={() => onOpenTerminal(currentServer)}
              title="Canlı Web SSH ve Terminal Konsolu"
            >
              <Terminal size={15} />
              <span>Web SSH Konsol</span>
            </button>

            {currentServer.status === 'stopped' ? (
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => onPowerAction(currentServer.id, 'start')}
              >
                <Power size={15} />
                <span>Sunucuyu Başlat</span>
              </button>
            ) : (
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => onPowerAction(currentServer.id, 'reboot')}
                disabled={currentServer.status === 'rebooting'}
              >
                <RotateCw size={15} />
                <span>Yeniden Başlat</span>
              </button>
            )}

            {currentServer.status === 'running' && (
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => onPowerAction(currentServer.id, 'shutdown')}
              >
                <Power size={15} />
                <span>Kapat</span>
              </button>
            )}

            <button 
              className="btn btn-danger btn-sm"
              onClick={() => {
                if (confirm('DİKKAT: Zorla güç kesme (Hard Power Off) veri kaybına yol açabilir. Devam etmek istiyor musunuz?')) {
                  onPowerAction(currentServer.id, 'stop');
                }
              }}
            >
              <span>Güç Kes</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs within Server */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', padding: '1rem 0' }}>
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Activity size={16} />
            <span>Canlı Metrikler & Donanım</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'network' ? 'active' : ''}`}
            onClick={() => setActiveTab('network')}
          >
            <Network size={16} />
            <span>Ağ & rDNS Yönetimi</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'snapshots' ? 'active' : ''}`}
            onClick={() => setActiveTab('snapshots')}
          >
            <Camera size={16} />
            <span>Snapshot & Yedekler ({currentServer.snapshots.length})</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reinstall' ? 'active' : ''}`}
            onClick={() => setActiveTab('reinstall')}
          >
            <RefreshCw size={16} />
            <span>Yeniden Kurulum (Format)</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & PERFORMANCE METRICS */}
        {activeTab === 'overview' && (
          <div style={{ marginTop: '1.75rem' }}>
            {/* Live Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
              {/* CPU Metric */}
              <div style={{ background: 'rgba(10, 15, 26, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>İşlemci (CPU)</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                    %{currentServer.metrics.cpuHistory[currentServer.metrics.cpuHistory.length - 1]}
                  </span>
                </div>
                {renderSparkline(currentServer.metrics.cpuHistory, '#00d2ff')}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{currentServer.cores}</div>
              </div>

              {/* RAM Metric */}
              <div style={{ background: 'rgba(10, 15, 26, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bellek (RAM)</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 700 }}>
                    %{currentServer.metrics.ramHistory[currentServer.metrics.ramHistory.length - 1]}
                  </span>
                </div>
                {renderSparkline(currentServer.metrics.ramHistory, '#38bdf8')}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{currentServer.ram}</div>
              </div>

              {/* Disk I/O Metric */}
              <div style={{ background: 'rgba(10, 15, 26, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Disk Yazma I/O</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#10b981', fontWeight: 700 }}>
                    {currentServer.metrics.diskIOHistory[currentServer.metrics.diskIOHistory.length - 1]} MB/s
                  </span>
                </div>
                {renderSparkline(currentServer.metrics.diskIOHistory, '#10b981')}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{currentServer.diskUsed} / {currentServer.disk}</div>
              </div>

              {/* Network Bandwidth */}
              <div style={{ background: 'rgba(10, 15, 26, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ağ Trafik Hızı</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#a855f7', fontWeight: 700 }}>
                    {currentServer.metrics.netMbps[currentServer.metrics.netMbps.length - 1]} Mbit/s
                  </span>
                </div>
                {renderSparkline(currentServer.metrics.netMbps.map(v => (v / 800) * 100), '#a855f7')}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Bu Ay: {currentServer.bandwidthUsedMonth}</div>
              </div>
            </div>

            {/* Hardware & Subscription Specifications Detail */}
            <div style={{ background: 'rgba(12, 18, 32, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Sunucu Donanım & Abonelik Bilgileri</span>
                <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 600 }}>
                  ✓ {currentServer.daysRemaining || 30} Gün Kaldı
                </span>
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Satın Alma Tarihi:</div>
                  <div style={{ fontWeight: 700, color: '#ffffff', marginTop: '0.2rem' }}>
                    {currentServer.purchasedAt || '10.09.2026'}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Sonraki Yenileme:</div>
                  <div style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
                    {currentServer.renewalDate}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Fatura Döngüsü:</div>
                  <div style={{ fontWeight: 600, color: '#ffffff', marginTop: '0.2rem' }}>
                    {currentServer.billingCycle || 'Aylık'} (${currentServer.priceMonthly?.toLocaleString('tr-TR')} / ay)
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>DDoS Koruması:</div>
                  <div style={{ fontWeight: 600, color: '#10b981', marginTop: '0.2rem' }}>Voxility 3.2 Tbps BGP</div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-muted)' }}>İşletim Sistemi:</div>
                  <div style={{ fontWeight: 600, color: '#ffffff', marginTop: '0.2rem' }}>{currentServer.os}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Statik IPv4 Adresi:</div>
                  <div style={{ fontWeight: 600, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                    {currentServer.ip}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Ağ Geçidi (Gateway):</div>
                  <div style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                    {currentServer.gateway}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Donanım Paketi:</div>
                  <div style={{ fontWeight: 600, color: '#ffffff', marginTop: '0.2rem' }}>{currentServer.planName}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NETWORK & RDNS MANAGEMENT */}
        {activeTab === 'network' && (
          <div style={{ marginTop: '1.75rem' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Ters DNS (rDNS / PTR Kaydı) Yönetimi</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              E-posta gönderim güvenliği ve sunucu doğrulaması için sunucunuzun IP adresine ait Ters DNS (PTR) kaydını güncelleyin.
            </p>

            <div style={{ background: 'rgba(10, 15, 26, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '1.5rem', maxWidth: '600px' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Statik IPv4
                </label>
                <input 
                  type="text" 
                  value={currentServer.ip} 
                  disabled 
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', padding: '0.65rem 1rem', borderRadius: '8px', color: '#94a3b8', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} 
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Hedef Alan Adı (Örn: mail.sirketiniz.com)
                </label>
                <input 
                  type="text" 
                  value={rdnsInput} 
                  onChange={(e) => setRdnsInput(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', padding: '0.65rem 1rem', borderRadius: '8px', color: '#ffffff', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} 
                />
              </div>

              <button 
                className="btn btn-primary btn-sm"
                onClick={() => onUpdateRdns(currentServer.id, rdnsInput)}
              >
                <Check size={14} />
                <span>rDNS Kaydını BGP Tablosunda Güncelle</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SNAPSHOT & BACKUP */}
        {activeTab === 'snapshots' && (
          <div style={{ marginTop: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Anlık Snapshot Görüntüleri</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Canlı sunucunuzun tam imajını dondurup kaydedin ve gerektiğinde 1 tıkla geri dönün.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  placeholder="Snapshot Etiketi (örn: Pre-Deploy)"
                  value={newSnapshotName}
                  onChange={(e) => setNewSnapshotName(e.target.value)}
                  style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', padding: '0.5rem 0.85rem', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem' }}
                />
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    if (!newSnapshotName.trim()) return alert('Lütfen snapshot için bir isim girin.');
                    onCreateSnapshot(currentServer.id, newSnapshotName);
                    setNewSnapshotName('');
                  }}
                >
                  <Camera size={14} />
                  <span>Snapshot Al</span>
                </button>
              </div>
            </div>

            {currentServer.snapshots.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(10,15,26,0.5)', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Bu sunucu için henüz oluşturulmuş snapshot bulunmuyor.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {currentServer.snapshots.map(snp => (
                  <div 
                    key={snp.id} 
                    style={{
                      background: 'rgba(10, 15, 26, 0.8)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#ffffff' }}>{snp.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Oluşturulma: {snp.date} • Boyut: {snp.size}
                      </div>
                    </div>

                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => onRestoreSnapshot(currentServer.id, snp.id)}
                    >
                      <RotateCw size={13} />
                      <span>Bu Snapshot'a Geri Dön</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: REINSTALL OS */}
        {activeTab === 'reinstall' && (
          <div style={{ marginTop: '1.75rem' }}>
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '14px',
              padding: '1.25rem',
              marginBottom: '1.75rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center'
            }}>
              <AlertTriangle size={28} color="#ef4444" />
              <div>
                <strong style={{ color: '#ef4444', display: 'block', fontSize: '0.95rem' }}>
                  DİKKAT: İşletim Sistemi Formatlama & Yeniden Kurulum
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#fca5a5' }}>
                  Bu işlem sunucudaki tüm disk bölümlerini sıfırlar ve yeni seçtiğiniz işletim sistemini 60 saniyede baştan kurar.
                </span>
              </div>
            </div>

            <div style={{ maxWidth: '650px' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  Kurulacak İşletim Sistemini Seçin
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  {OPERATING_SYSTEMS.map(os => (
                    <div 
                      key={os.id}
                      onClick={() => setSelectedNewOS(os.id)}
                      style={{
                        background: selectedNewOS === os.id ? 'rgba(0, 210, 255, 0.12)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${selectedNewOS === os.id ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                        borderRadius: '8px',
                        padding: '0.6rem 0.85rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: selectedNewOS === os.id ? '#ffffff' : '#94a3b8'
                      }}
                    >
                      {os.name}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  Yeni Root / Administrator Şifresi
                </label>
                <input 
                  type="text" 
                  value={newRootPass} 
                  onChange={(e) => setNewRootPass(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', padding: '0.65rem 1rem', borderRadius: '8px', color: '#ffffff', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} 
                />
              </div>

              <button 
                className="btn btn-danger"
                onClick={() => {
                  if (confirm('Tüm disk verileri silinecek ve ' + selectedNewOS + ' kurulacak. Onaylıyor musunuz?')) {
                    onReinstallOS(currentServer.id, selectedNewOS, newRootPass);
                  }
                }}
              >
                <RefreshCw size={15} />
                <span>Yeniden Kurulumu Başlat (Format At)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
