import React, { useState } from 'react';
import { Globe, ShieldCheck, Activity, Server, ArrowRight, CheckCircle2, Copy, Check, Terminal } from 'lucide-react';
import SubpageHeader from '../components/SubpageHeader';
import DatacenterMap from '../components/DatacenterMap';
import EnterpriseCtaBanner from '../components/EnterpriseCtaBanner';
import { DATACENTERS } from '../data/datacenters';

export default function DatacentersPage({ onNavigate, onOpenConfigurator }) {
  const [copiedIp, setCopiedIp] = useState(null);

  const handleCopyIp = (ip) => {
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2500);
  };

  return (
    <div className="subpage-view datacenters-subpage-view">
      {/* Subpage Header */}
      <SubpageHeader 
        badge={{
          icon: <Globe size={14} />,
          text: 'KÜRESEL OMURGA & TIER-IV VERİ MERKEZLERİ'
        }}
        title={<>Küresel <span className="text-gradient">Veri Merkezlerimiz & Looking Glass</span></>}
        subtitle="Almanya (Frankfurt), Hong Kong ve Fransa (Paris) stratejik noktalarında konumlanan Tier-IV veri merkezlerimiz, DE-CIX, HKIX ve France-IX internet değişim noktalarıyla doğrudan bağlıdır. Canlı Looking Glass ile gecikme sürelerini anlık test edin."
        breadcrumbs={[
          { label: 'Altyapı', pageId: 'datacenters' },
          { label: 'Veri Merkezlerimiz', active: true }
        ]}
        onNavigate={onNavigate}
        trustPills={[
          { icon: <ShieldCheck size={15} color="#10b981" />, text: 'Tier-IV Redundant (2N+1)' },
          { icon: <Activity size={15} color="var(--accent-cyan)" />, text: '10 Gbps Uplink Omurgası' },
          { icon: <Server size={15} color="#a855f7" />, text: '3.2 Tbps Voxility DDoS Kalkanı' }
        ]}
      />

      {/* Interactive Datacenter Map and Looking Glass Ping Tester */}
      <DatacenterMap />

      {/* In-depth Datacenter Breakdown */}
      <section className="section-padding" style={{ background: 'linear-gradient(180deg, rgba(7,9,14,0.4) 0%, rgba(11,15,25,0.8) 100%)' }}>
        <div className="container">
          <div className="section-header text-center" style={{ maxWidth: '820px', margin: '0 auto 3.5rem' }}>
            <div className="section-badge mini">
              <Server size={13} />
              <span>LOKASYON DETAYLARI</span>
            </div>
            <h2 className="section-title">
              Lokasyon Donanım ve <span className="text-gradient">Ağ Standartlarımız</span>
            </h2>
            <p className="section-subtitle">
              Tüm veri merkezlerimizde ISO 27001 bilgi güvenliği, 2N+1 yedekli UPS ve dizel jeneratör sistemleri, 
              ve biyometrik geçiş kontrolleri standart olarak uygulanır.
            </p>
          </div>

          <div className="dc-deep-grid">
            {DATACENTERS.map((dc) => (
              <div key={dc.id} className="dc-deep-card">
                <div className="dc-deep-header">
                  <span className="dc-flag-large">{dc.flag}</span>
                  <div className="dc-header-info">
                    <h3>{dc.country} ({dc.city})</h3>
                    <span className="dc-facility">{dc.datacenter}</span>
                  </div>
                  <span className="dc-tier-pill">Tier IV</span>
                </div>

                <div className="dc-specs-box">
                  <div className="dc-spec-row">
                    <span>Ağ & Port Hızı:</span>
                    <strong>{dc.networkSpeed}</strong>
                  </div>
                  <div className="dc-spec-row">
                    <span>DDoS Koruma Katmanı:</span>
                    <strong style={{ color: 'var(--accent-cyan)' }}>3.2 Tbps Voxility L3/L4/L7</strong>
                  </div>
                  <div className="dc-spec-row">
                    <span>Enerji Güvencesi:</span>
                    <strong>{dc.power}</strong>
                  </div>
                  <div className="dc-spec-row">
                    <span>Fiziksel Güvenlik:</span>
                    <strong>{dc.security}</strong>
                  </div>
                  <div className="dc-spec-row">
                    <span>Test IPv4 (Ping/Traceroute):</span>
                    <div className="ip-copy-wrap">
                      <code className="ip-code">{dc.testIp}</code>
                      <button 
                        type="button" 
                        className="ip-copy-btn"
                        onClick={() => handleCopyIp(dc.testIp)}
                        title="IP Adresini Kopyala"
                      >
                        {copiedIp === dc.testIp ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="dc-highlights-list">
                  {dc.features && dc.features.map((f, i) => (
                    <div key={i} className="dc-hl-item">
                      <CheckCircle2 size={15} color="#10b981" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <div className="dc-card-footer">
                  <button 
                    type="button" 
                    className="btn btn-primary btn-sm btn-block" 
                    onClick={() => onNavigate('vds')}
                  >
                    <span>{dc.country} Lokasyonunda Sunucu Kirala</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Enterprise CTA */}
      <EnterpriseCtaBanner 
        onNavigate={onNavigate} 
        onOpenConfigurator={onOpenConfigurator}
      />
    </div>
  );
}
