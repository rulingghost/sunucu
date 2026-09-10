import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Server, 
  Globe2, 
  Cpu, 
  Award, 
  Users, 
  Lock, 
  Zap,
  CheckCircle2,
  ArrowRight,
  Activity,
  Layers,
  Terminal
} from 'lucide-react';
import SubpageHeader from '../components/SubpageHeader';
import EnterpriseCtaBanner from '../components/EnterpriseCtaBanner';

export default function AboutPage({ onNavigate, onOpenConfigurator }) {
  return (
    <div className="subpage-view about-subpage-view">
      {/* Subpage Header */}
      <SubpageHeader 
        badge={{
          icon: <Building2 size={14} />,
          text: 'KURUMSAL PROFİL & MÜHENDİSLİK VİZYONU'
        }}
        title={<>Hakkımızda: <span className="text-gradient">NovaQ Servers</span></>}
        subtitle="Geleceğin yüksek hesaplama gücü ve sunucu altyapılarını kurumsal ölçekte işletmelerle buluşturuyoruz. Sadece en hızlı, en dayanıklı ve en güvenli sunucu barındırma ve kiralama hizmetine odaklanıyoruz."
        breadcrumbs={[
          { label: 'Kurumsal', pageId: 'about' },
          { label: 'Hakkımızda', active: true }
        ]}
        onNavigate={onNavigate}
        trustPills={[
          { icon: <ShieldCheck size={15} color="#10b981" />, text: '%99.99 SLA Uptime' },
          { icon: <Zap size={15} color="var(--accent-cyan)" />, text: '3.2 Tbps Voxility DDoS' },
          { icon: <Globe2 size={15} color="#a855f7" />, text: 'Frankfurt • Hong Kong • Paris' }
        ]}
      />

      {/* Main Story & Metrics Section */}
      <section className="section-padding">
        <div className="container">
          <div className="about-main-grid">
            {/* Left Story Column */}
            <div className="about-text-col">
              <div className="section-badge mini">
                <Server size={13} />
                <span>BİZ KİMİZ?</span>
              </div>
              <h2 className="about-heading">
                Kurumsal Sunucu Kiralama Standartlarını <span className="text-gradient">Yeniden Tanımlıyoruz</span>
              </h2>
              
              <p className="lead-p">
                <strong>NovaQ Servers</strong>, kurumsal şirketler, e-ticaret platformları, oyun stüdyoları ve 
                büyük yapay zeka projeleri için yüksek performanslı sunucu kiralama ve barındırma çözümleri 
                sunan yeni nesil bir bulut altyapı sağlayıcısıdır.
              </p>

              <p>
                Geleneksel web hosting firmalarının aksine, platformumuzda alan adı (domain) satışı gibi yan ürünlerle 
                odağımızı dağıtmıyoruz. Tüm yatırımımızı ve mühendislik gücümüzü; <strong>Sanal Bulut Sunucular (VDS)</strong>, 
                <strong>Bare-Metal Fiziksel Sunucular</strong> ve <strong>NVIDIA GPU Yapay Zeka İş İstasyonları</strong> üzerine 
                kurduk.
              </p>

              {/* Glowing Quote */}
              <div className="about-quote-box">
                <div className="quote-mark">“</div>
                <p>
                  NovaQ Servers olarak misyonumuz; sıfır gecikmeli NVMe mimarisi, küresel BGP omurgası ve 
                  3.2 Tbps donanımsal DDoS kalkanı ile her ölçekteki projeye tavizsiz güç sağlamaktır.
                </p>
                <div className="quote-author">
                  <strong>NovaQ Mühendislik ve Operasyon Kurulu</strong>
                  <span>Tier-IV Frankfurt, Hong Kong ve Paris Altyapı Yönetimi</span>
                </div>
              </div>

              <h3>Neden NovaQ Servers?</h3>
              <ul className="about-check-list">
                <li>
                  <CheckCircle2 size={20} color="var(--accent-cyan)" className="check-icon" />
                  <div>
                    <strong>Fiziksel Ayrılmış Güç:</strong> Sanal sunucularımızda dahi overcommit (kaynak aşımı) yapılmaz, 
                    çekirdek ve RAM tahsisi %100 adil ve garantilidir.
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={20} color="var(--accent-cyan)" className="check-icon" />
                  <div>
                    <strong>Frankfurt, Hong Kong ve Paris Stratejik Lokasyonları:</strong> Avrupa ve Asya-Pasifik'teki 
                    Tier-IV Equinix ve OVH tesisleri ile küresel düşük gecikme.
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={20} color="var(--accent-cyan)" className="check-icon" />
                  <div>
                    <strong>3.2 Tbps Voxility Koruma:</strong> En karmaşık Layer 3/4 flood ve Layer 7 HTTP flood saldırılarını 
                    milisaniler içinde süzen akıllı filtreleme.
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={20} color="var(--accent-cyan)" className="check-icon" />
                  <div>
                    <strong>7/24 Kesintisiz NOC Ekibi:</strong> Otomatik botlar yerine doğrudan Linux ve Ağ mühendislerinden 
                    dakikalar içinde teknik destek.
                  </div>
                </li>
              </ul>
            </div>

            {/* Right Metrics Column */}
            <div className="about-stats-col">
              <div className="about-stats-card">
                <div className="stats-card-header">
                  <Activity size={20} color="var(--accent-cyan)" />
                  <h3>Rakamlarla NovaQ Servers</h3>
                </div>

                <div className="stats-metrics-list">
                  <div className="stat-metric-item">
                    <div className="metric-val text-gradient">%99.99</div>
                    <div className="metric-label">SLA Kesintisiz Çalışma Süresi</div>
                    <span className="metric-desc">Yedekli 2N+1 jeneratör ve çift UPS omurgası</span>
                  </div>

                  <div className="stat-metric-item">
                    <div className="metric-val" style={{ color: 'var(--accent-cyan)' }}>3.2 Tbps</div>
                    <div className="metric-label">Küresel DDoS Süzme Kapasitesi</div>
                    <span className="metric-desc">Voxility & Arbor Networks Layer 3/4/7 filtreleme</span>
                  </div>

                  <div className="stat-metric-item">
                    <div className="metric-val" style={{ color: '#10b981' }}>3 Lokasyon</div>
                    <div className="metric-label">Almanya, Hong Kong, Fransa Datacenter</div>
                    <span className="metric-desc">DE-CIX, HKIX ve France-IX direkt peering</span>
                  </div>

                  <div className="stat-metric-item">
                    <div className="metric-val" style={{ color: '#f59e0b' }}>&lt; 0.4 ms</div>
                    <div className="metric-label">Kabin İçi Anahtar Gecikmesi</div>
                    <span className="metric-desc">40/100 Gbps omurga anahtarlama altyapısı</span>
                  </div>

                  <div className="stat-metric-item">
                    <div className="metric-val" style={{ color: '#a855f7' }}>60 Saniye</div>
                    <div className="metric-label">Otomatik VDS Kurulum ve Teslimat</div>
                    <span className="metric-desc">Ödeme sonrası panelinizde anında aktifleşir</span>
                  </div>
                </div>

                <div className="stats-card-footer">
                  <button 
                    type="button" 
                    className="btn btn-primary btn-block"
                    onClick={() => onNavigate('vds')}
                  >
                    <span>Sunucu Paketlerini İncele</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Grid */}
      <section className="section-padding" style={{ background: 'linear-gradient(180deg, rgba(11,15,25,0.7) 0%, rgba(7,9,14,0.9) 100%)' }}>
        <div className="container">
          <div className="section-header text-center" style={{ maxWidth: '750px', margin: '0 auto 3.5rem' }}>
            <div className="section-badge mini">
              <ShieldCheck size={13} />
              <span>TEMEL İLKELERİMİZ</span>
            </div>
            <h2 className="section-title">
              Mühendislik ve Hizmet <span className="text-gradient">Standartlarımız</span>
            </h2>
            <p className="section-subtitle">
              Sadece barındırma değil, kritik iş yükleriniz için 365 gün kesintisiz yüksek teknoloji güvencesi sunuyoruz.
            </p>
          </div>

          <div className="about-pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon"><Cpu size={26} color="var(--accent-cyan)" /></div>
              <h4>%100 Tahsisli Güç</h4>
              <p>Kaynak paylaşımı veya aşırı çekirdek yükleme (overcommit) yapılmaz. Aldığınız her vCPU ve RAM tamamen size ayrılır.</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon"><Zap size={26} color="#f59e0b" /></div>
              <h4>Samsung Enterprise NVMe</h4>
              <p>Mekanik disk veya standart SATA SSD değil, 7400 MB/s okuma hızına sahip kurumsal Samsung PM9A3 Gen4 NVMe diskler.</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon"><Globe2 size={26} color="#10b981" /></div>
              <h4>Tier-IV Sertifikalı Tesisler</h4>
              <p>Frankfurt Equinix FR2, Paris OVH Campus ve Hong Kong Equinix HK1 veri merkezlerinde 2N+1 yedekli enerji ve iklimlendirme.</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon"><Terminal size={26} color="#a855f7" /></div>
              <h4>Tam Kök (Root) & Panel Kontrolü</h4>
              <p>Kendi yönetim panelinizden canlı Web SSH konsolu, tek tıkla işletim sistemi kurulumu, anlık snapshot ve güç yönetimi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Global CTA Banner */}
      <EnterpriseCtaBanner 
        onNavigate={onNavigate} 
        onOpenConfigurator={onOpenConfigurator}
      />
    </div>
  );
}
