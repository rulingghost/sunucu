import React, { useState } from 'react';
import { 
  Zap, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  HardDrive, 
  Activity, 
  Gamepad2, 
  Flame, 
  Gauge, 
  Sparkles, 
  Globe2, 
  Server,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import SubpageHeader from '../components/SubpageHeader';
import EnterpriseCtaBanner from '../components/EnterpriseCtaBanner';
import { SERVER_CATEGORIES, BILLING_CYCLES, calculatePlanPrice } from '../data/serverPlans';

export default function ExtremePage({ onSelectPlan, onNavigate, onOpenConfigurator }) {
  const [selectedCycle, setSelectedCycle] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);

  const ryzenCategory = SERVER_CATEGORIES.find(c => c.id === 'ryzen-vds');

  const extremeFaqs = [
    {
      q: 'AMD Ryzen 9 9950X işlemcilerin tek çekirdek avantajı nedir?',
      a: 'Ryzen 9 9950X mimarisi 5.7 GHz saat hızına ulaşarak sektördeki en yüksek tek çekirdek IPC (Instruction Per Cycle) performansını sunar. Minecraft, FiveM, Rust, CS2 gibi tek çekirdek frekansına bağımlı oyun sunucuları ve kod derleme işlemlerinde standart sunucu işlemcilerine göre %40-%60 daha yüksek FPS ve işlem gücü sağlar.'
    },
    {
      q: 'Oyun sunucularına yönelik özel DDoS koruması var mı?',
      a: 'Evet! Extreme serimizde Game Anti-DDoS filtrelerimiz aktiftir. UDP/TCP spoofing, RakNet, Source Engine Query, Minecraft handshake flood gibi oyun protokollerine özel Layer 7 filtreleme kuralları sayesinde oyuncularınız en ufak bir ping dalgalanması yaşamadan kesintisiz oynar.'
    },
    {
      q: 'Depolamada kullanılan Samsung PM9A3 disklerin hızı ne kadardır?',
      a: 'Samsung Enterprise PM9A3 Gen4 NVMe disklerimiz 7.400 MB/s sıralı okuma ve 1.000.000+ rastgele IOPS değerlerine sahiptir. Disk darboğazı sıfıra indirgenmiştir.'
    },
    {
      q: 'Hangi veri merkezlerinde barınıyor ve Türkiye ping değerleri nasıl?',
      a: 'Almanya (Frankfurt) Equinix FR2 tesisimizde barınır. Türk Telekom, Turkcell Superonline ve Vodafone doğrudan peering noktaları sayesinde Türkiye ortalama ping süresi 28ms - 35ms aralığındadır.'
    },
    {
      q: 'Windows Server veya özel oyun panelleri kurulabilir mi?',
      a: 'Evet. Panelimizden Windows Server 2022/2025, Ubuntu, Debian veya Pterodactyl, AMP, PufferPanel gibi oyun kontrol panelleri hızlıca kurulabilir.'
    }
  ];

  return (
    <div className="subpage-view extreme-subpage-view">
      {/* Subpage Header */}
      <SubpageHeader 
        badge={{
          icon: <Flame size={14} color="#f59e0b" />,
          text: '5.7 GHz AMD RYZEN 9 9950X & DDR5 6000MHz'
        }}
        title={<>Extreme Ryzen 9 <span className="grad-cyber-text" style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ef4444 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Oyun & Yüksek Saat Hızlı VDS</span></>}
        subtitle="Maksimum tek çekirdek frekansı gerektiren oyun sunucuları, yüksek frekanslı veritabanları ve ağır iş yükleri için özel tasarlanan 5.7 GHz canavarı. Samsung Enterprise NVMe Gen4 ve Game Anti-DDoS ile gecikmesiz saf performans."
        breadcrumbs={[
          { label: 'Sunucu Çözümleri', pageId: 'vds' },
          { label: 'Extreme Ryzen 9 VDS', active: true }
        ]}
        onNavigate={onNavigate}
        trustPills={[
          { icon: <Gauge size={15} color="#f59e0b" />, text: '5.7 GHz Boost Frekansı' },
          { icon: <Gamepad2 size={15} color="#ef4444" />, text: 'L7 Game Anti-DDoS Koruma' },
          { icon: <Zap size={15} color="#10b981" />, text: 'Samsung PM9A3 (7400 MB/s)' }
        ]}
      />

      {/* Main Content */}
      <section className="section-padding" style={{ paddingTop: '2.5rem' }}>
        <div className="container">
          
          {/* Crosslink to Enterprise NVMe */}
          <div className="server-crosslink-card extreme-theme">
            <div className="crosslink-content">
              <div className="crosslink-icon-box">
                <Server size={26} color="var(--accent-cyan)" />
              </div>
              <div className="crosslink-text">
                <h4>Kurumsal Web, Bulut ve Veri Tabanı Barındırma mı Yapıyorsunuz?</h4>
                <p>Intel Xeon Platinum ve AMD EPYC mimarili ekonomik <strong>NVMe Bulut VDS</strong> paketlerimizi inceleyin.</p>
              </div>
            </div>
            <a 
              href="/sanal-sunucu.html"
              className="btn btn-secondary"
              onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('vds', e); }}
            >
              <span>NVMe Bulut VDS İncele</span>
              <ArrowRight size={15} />
            </a>
          </div>

          {/* Single Core Benchmark Highlight Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(239, 68, 68, 0.05) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '16px',
            padding: '1.5rem 2rem',
            margin: '2rem 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Sparkles size={24} color="#f59e0b" />
              <div>
                <strong style={{ color: '#ffffff', fontSize: '1.05rem', display: 'block' }}>Geekbench 6 Tek Çekirdek Skoru: 3,420+ Puan</strong>
                <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Standart sanal sunucu işlemcilerine göre %62 daha hızlı tek çekirdek tepki süresi.</span>
              </div>
            </div>
            <span style={{ 
              background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
              color: '#ffffff',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              fontWeight: 800,
              fontSize: '0.8rem',
              letterSpacing: '0.05em'
            }}>
              BENCHMARK ŞAMPİYONU
            </span>
          </div>

          {/* Billing Cycle Discount Selector */}
          <div className="cycle-selector-wrap">
            <span className="cycle-label">Faturalandırma Dönemi:</span>
            <div className="cycle-pills">
              {BILLING_CYCLES.map((cycle) => (
                <button
                  key={cycle.id}
                  type="button"
                  className={`cycle-pill ${selectedCycle === cycle.id ? 'extreme-active' : ''}`}
                  onClick={() => setSelectedCycle(cycle.id)}
                >
                  <span>{cycle.label}</span>
                  {cycle.tag && <span className="discount-tag">{cycle.tag}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Extreme Plan Cards Grid */}
          <div className="plan-grid" style={{ marginTop: '3rem' }}>
            {ryzenCategory?.plans.map((plan) => {
              const pricing = calculatePlanPrice(plan.basePriceMonthly, selectedCycle);

              return (
                <div key={plan.id} className={`plan-card extreme-card ${plan.popular ? 'popular' : ''}`}>
                  {plan.popular && (
                    <div className="card-ribbon extreme-ribbon">
                      <span>OYUNCULARIN 1 NUMARALI TERCİHİ</span>
                    </div>
                  )}

                  <div className="card-header">
                    <div className="plan-category-tag extreme-tag">5.7 GHZ RYZEN 9 9950X</div>
                    <h3 className="plan-name">{plan.name}</h3>
                    <div className="plan-processor-pill extreme-pill">
                      <Cpu size={14} />
                      <span>{plan.processor}</span>
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div className="card-pricing">
                    <div className="price-row">
                      <span className="currency">$</span>
                      <span className="amount">
                        {pricing.cycle.months > 1
                          ? pricing.planTotal.toLocaleString('tr-TR')
                          : pricing.discountedMonthly.toLocaleString('tr-TR')}
                      </span>
                      <span className="period">
                        /{pricing.cycle.months === 12 ? 'yıl' : pricing.cycle.months > 1 ? `${pricing.cycle.months} ay` : 'ay'}
                      </span>
                    </div>

                    {pricing.cycle.discount > 0 ? (
                      <div className="pricing-saving-badge">
                        <span>%{pricing.cycle.discount} İndirim Uygulandı</span>
                        <span className="total-term">
                          Aylık <strong>${pricing.discountedMonthly.toLocaleString('tr-TR')}</strong> eşdeğeri (+ KDV)
                        </span>
                      </div>
                    ) : (
                      <div className="pricing-monthly-note">
                        Aylık taahhütsüz faturalandırma (+ KDV)
                      </div>
                    )}
                  </div>

                  {/* Specs List */}
                  <ul className="card-specs">
                    <li>
                      <Cpu size={16} className="spec-icon extreme-spec-icon" />
                      <div>
                        <strong>İşlemci Gücü:</strong>
                        <span style={{ color: '#fbbf24' }}>{plan.cores}</span>
                      </div>
                    </li>
                    <li>
                      <Layers size={16} className="spec-icon extreme-spec-icon" />
                      <div>
                        <strong>DDR5 6000MHz RAM:</strong>
                        <span>{plan.ram}</span>
                      </div>
                    </li>
                    <li>
                      <HardDrive size={16} className="spec-icon extreme-spec-icon" />
                      <div>
                        <strong>PM9A3 Gen4 NVMe:</strong>
                        <span>{plan.storage}</span>
                      </div>
                    </li>
                    <li>
                      <Activity size={16} className="spec-icon extreme-spec-icon" />
                      <div>
                        <strong>Port & Trafik:</strong>
                        <span>{plan.bandwidth}</span>
                      </div>
                    </li>
                    <li>
                      <Gamepad2 size={16} className="spec-icon extreme-spec-icon" />
                      <div>
                        <strong>Game Anti-DDoS:</strong>
                        <span style={{ color: '#10b981' }}>{plan.ddos}</span>
                      </div>
                    </li>
                    <li>
                      <Globe2 size={16} className="spec-icon extreme-spec-icon" />
                      <div>
                        <strong>Statik IP:</strong>
                        <span>{plan.ip}</span>
                      </div>
                    </li>
                  </ul>

                  {/* Action CTA */}
                  <div className="card-action">
                    <button 
                      type="button"
                      className="btn btn-primary btn-block"
                      style={plan.popular ? { background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', borderColor: '#f59e0b' } : {}}
                      onClick={() => onSelectPlan(plan, selectedCycle)}
                    >
                      <span>Yapılandır & Kirala</span>
                      <ArrowRight size={16} />
                    </button>
                    <div className="instant-delivery-tag">
                      <Zap size={13} color="#10b981" />
                      <span>60 Saniyede Otomatik Kurulum</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Included Features Banner */}
          <div className="extreme-features-banner">
            <div className="banner-title-box">
              <h3>Neden NovaQ Extreme Ryzen 9 Altyapısı?</h3>
              <p>Masaüstü hızını veri merkezi güvenliğiyle birleştiren eşsiz mimarimiz ile rakiplerinizin önüne geçin.</p>
            </div>
            <div className="banner-features-grid">
              <div className="banner-feature-item extreme-feat">
                <div className="bf-icon amber"><Gauge size={22} color="#f59e0b" /></div>
                <h4>5.7 GHz Boost Clock</h4>
                <p>En yüksek tek çekirdek saat frekansı ile oyun sunucularında maksimum TPS ve akıcılık garantisi.</p>
              </div>
              <div className="banner-feature-item extreme-feat">
                <div className="bf-icon amber"><Gamepad2 size={22} color="#f59e0b" /></div>
                <h4>Game Anti-DDoS L7 Kalkan</h4>
                <p>FiveM, Minecraft, Rust ve Source motorlarına özel donanımsal filtreleme ile kesintisiz ping deneyimi.</p>
              </div>
              <div className="banner-feature-item extreme-feat">
                <div className="bf-icon amber"><Zap size={22} color="#f59e0b" /></div>
                <h4>Samsung PM9A3 NVMe (7400 MB/s)</h4>
                <p>Enterprise Gen4 sınıfı katı hal sürücüleri ile saniyede 1 milyon IOPS ve anlık harita/chunk yüklemeleri.</p>
              </div>
              <div className="banner-feature-item extreme-feat">
                <div className="bf-icon amber"><Flame size={22} color="#f59e0b" /></div>
                <h4>DDR5 6000MHz ECC Bellek</h4>
                <p>En yeni nesil DDR5 yüksek hızlı RAM teknolojisi ile bellek gecikmelerine veda edin.</p>
              </div>
            </div>
          </div>

          {/* Extreme Specific FAQ Section */}
          <div className="subpage-faq-section">
            <div className="section-header text-center" style={{ maxWidth: '750px', margin: '0 auto 2.5rem' }}>
              <div className="section-pill" style={{ borderColor: 'rgba(245, 158, 11, 0.3)', color: '#f59e0b' }}>
                <HelpCircle size={13} />
                <span>SIKÇA SORULAN SORULAR</span>
              </div>
              <h2 className="section-title">
                Extreme Ryzen 9 Hakkında <span className="text-gradient">Merak Edilenler</span>
              </h2>
            </div>

            <div className="faq-accordion" style={{ maxWidth: '850px', margin: '0 auto' }}>
              {extremeFaqs.map((faq, idx) => (
                <div key={idx} className={`faq-card ${openFaq === idx ? 'open' : ''}`}>
                  <button 
                    type="button"
                    className="faq-question"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? <ChevronUp size={18} color="#f59e0b" /> : <ChevronDown size={18} />}
                  </button>
                  {openFaq === idx && (
                    <div className="faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
