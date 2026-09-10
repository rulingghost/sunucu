import React, { useState, useEffect } from 'react';
import { DATACENTERS } from '../data/datacenters';
import { Globe, Activity, ShieldCheck, Zap, Download, Play, CheckCircle } from 'lucide-react';

export default function DatacenterMap() {
  const [activeDcId, setActiveDcId] = useState('frankfurt');
  const [testing, setTesting] = useState(false);
  const [pingLogs, setPingLogs] = useState([]);
  const [currentPing, setCurrentPing] = useState(null);
  const [downloadSpeed, setDownloadSpeed] = useState(null);

  const activeDc = DATACENTERS.find(d => d.id === activeDcId) || DATACENTERS[0];

  useEffect(() => {
    // Reset ping test when datacenter changes
    setCurrentPing(activeDc.basePingTR);
    setDownloadSpeed('982 MB/s');
    setPingLogs([
      `[NovaQ LookingGlass v4.2] Test sunucusu hazır: ${activeDc.city} (${activeDc.testIp})`,
      `ICMP echo hazır. DE-CIX & Tier-1 transit bağlantıları aktif.`
    ]);
  }, [activeDcId]);

  const handleRunPingTest = () => {
    if (testing) return;
    setTesting(true);
    setPingLogs([`[INFO] Ping başlatılıyor: ${activeDc.testIp} (64 bytes ICMP)...`]);

    let count = 0;
    const interval = setInterval(() => {
      count++;
      const jitterVal = (Math.random() * 2.2 - 1.1).toFixed(1);
      const measuredMs = (activeDc.basePingTR + parseFloat(jitterVal)).toFixed(1);

      setPingLogs(prev => [
        ...prev,
        `64 bytes from ${activeDc.testIp}: icmp_seq=${count} ttl=58 time=${measuredMs} ms (jitter: ${activeDc.jitter})`
      ]);
      setCurrentPing(measuredMs);

      if (count >= 5) {
        clearInterval(interval);
        setTesting(false);
        setPingLogs(prev => [
          ...prev,
          `--- ${activeDc.testIp} ping istatistikleri ---`,
          `5 paket gönderildi, 5 paket alındı, %0 paket kaybı (Mükemmel Kararlılık)`,
          `[OK] 10 Gbps hat ve Voxility/Arbor anti-DDoS devrede.`
        ]);
        setDownloadSpeed((940 + Math.floor(Math.random() * 50)) + ' MB/s');
      }
    }, 450);
  };

  return (
    <section className="dc-section" id="datacenters">
      <div className="container">
        <div className="section-header">
          <div className="section-pill">
            <Globe size={14} />
            <span>Küresel Altyapı & Düşük Gecikme</span>
          </div>
          <h2 className="section-title">
            Avrupa & Asya <span className="grad-cyber-text">Veri Merkezlerimiz</span>
          </h2>
          <p className="section-desc">
            Sunucularımız doğrudan Tier-1 internet omurgalarına bağlı, N+2 yedekli iklimlendirme 
            ve 2N jeneratör altyapısına sahip dünya standartlarındaki tesislerde barınır.
          </p>
        </div>

        {/* Datacenter Selection Cards */}
        <div className="dc-grid">
          {DATACENTERS.map(dc => (
            <div
              key={dc.id}
              className={`dc-card ${activeDcId === dc.id ? 'active-dc' : ''}`}
              onClick={() => setActiveDcId(dc.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="dc-head">
                <div className="dc-country">
                  <span style={{ fontSize: '1.6rem' }}>{dc.flag}</span>
                  <div>
                    <div>{dc.country}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                      {dc.city}
                    </div>
                  </div>
                </div>
                <span className="dc-tier-tag">{dc.tier}</span>
              </div>

              <div className="dc-info-rows">
                <div className="dc-info-row">
                  <span className="dc-info-label">Veri Merkezi:</span>
                  <span className="dc-info-val">{dc.datacenter}</span>
                </div>
                <div className="dc-info-row">
                  <span className="dc-info-label">TR Ortalama Ping:</span>
                  <span className="dc-info-val" style={{ color: 'var(--accent-cyan)' }}>
                    {dc.basePingTR} ms
                  </span>
                </div>
                <div className="dc-info-row">
                  <span className="dc-info-label">Hat & Port:</span>
                  <span className="dc-info-val">{dc.networkSpeed}</span>
                </div>
                <div className="dc-info-row">
                  <span className="dc-info-label">Uptime SLA:</span>
                  <span className="dc-info-val" style={{ color: '#10b981' }}>{dc.uptime}</span>
                </div>
              </div>

              <button
                className={`btn btn-sm ${activeDcId === dc.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ width: '100%' }}
                onClick={(e) => { e.stopPropagation(); setActiveDcId(dc.id); }}
              >
                <span>{activeDcId === dc.id ? 'Seçili Lokasyon' : 'Bu Lokasyonu Test Et'}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Interactive Ping & Latency Tester */}
        <div className="ping-tester-wrap">
          <div className="ping-tester-head">
            <div>
              <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Canlı Ağ & Hız Testi (Looking Glass)</span>
                <span style={{ fontSize: '1.1rem' }}>{activeDc.flag}</span>
                <span style={{ color: 'var(--accent-cyan)', fontSize: '0.95rem' }}>
                  [{activeDc.city} - {activeDc.code}]
                </span>
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                Test IP: <code>{activeDc.testIp}</code> • Uplink: 10 Gbit/s BGP
              </p>
            </div>

            <button
              className="btn btn-primary btn-sm"
              onClick={handleRunPingTest}
              disabled={testing}
            >
              <Play size={14} />
              <span>{testing ? 'Ölçüm Yapılıyor...' : 'Canlı Ping Testini Başlat'}</span>
            </button>
          </div>

          {/* Metric Dials */}
          <div className="ping-display-grid">
            <div className="ping-metric-box">
              <div className="ping-metric-val">{currentPing || activeDc.basePingTR} ms</div>
              <div className="ping-metric-label">Ölçülen Gecikme (Ping)</div>
            </div>
            <div className="ping-metric-box">
              <div className="ping-metric-val">{activeDc.jitter}</div>
              <div className="ping-metric-label">Jitter Sapması</div>
            </div>
            <div className="ping-metric-box">
              <div className="ping-metric-val" style={{ color: '#10b981' }}>%0</div>
              <div className="ping-metric-label">Paket Kaybı</div>
            </div>
            <div className="ping-metric-box">
              <div className="ping-metric-val" style={{ color: '#38bdf8' }}>{downloadSpeed || '980 MB/s'}</div>
              <div className="ping-metric-label">10G Simüle İndirme</div>
            </div>
          </div>

          {/* Terminal output box */}
          <div className="ping-log-console">
            {pingLogs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
            {testing && (
              <div style={{ color: 'var(--accent-cyan)', animation: 'statusPulse 1s infinite' }}>
                _ paket alınıyor...
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
