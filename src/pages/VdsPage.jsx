import React, { useState } from 'react';
import { 
  Server, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Layers, 
  HardDrive, 
  Activity, 
  RefreshCw,
  Globe2,
  Terminal,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Flame
} from 'lucide-react';
import SubpageHeader from '../components/SubpageHeader';
import EnterpriseCtaBanner from '../components/EnterpriseCtaBanner';
import { SERVER_CATEGORIES, BILLING_CYCLES, calculatePlanPrice } from '../data/serverPlans';

export default function VdsPage({ onSelectPlan, onNavigate, onOpenConfigurator }) {
  const [selectedCycle, setSelectedCycle] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);

  const nvmeCategory = SERVER_CATEGORIES.find(c => c.id === 'nvme-vds');

  const vdsFaqs = [
    {
      q: 'NVMe VDS sunucumda kaynaklar (CPU, RAM) tamamen bana mı tahsis edilir?',
      a: 'Evet. NovaQ Servers NVMe VDS altyapısında KVM hipervizör mimarisi kullanılır. Seçtiğiniz sanal çekirdek (vCPU) ve DDR5/DDR4 ECC bellek tamamen size izole edilir; sunucunuz başka bir kullanıcının kaynak tüketiminden veya gürültü komşu (noisy neighbor) etkisinden asla etkilenmez.'
    },
    {
      q: 'Ödeme yaptıktan sonra sunucu ne kadar sürede teslim edilir?',
      a: 'Otomasyon sistemimiz sayesinde siparişiniz onaylandığı anda sunucunuz seçtiğiniz işletim sistemiyle 60 saniye içinde otomatik kurulur ve SSH/RDP root giriş bilgileriniz müşteri panelinizde anında görüntülenir.'
    },
    {
      q: 'Hangi işletim sistemlerini kurabilirim?',
      a: 'Ubuntu 24.04/22.04 LTS, Debian 12, AlmaLinux 9, Rocky Linux ve Windows Server 2022/2025 sürümlerini panelinizden tek tıkla ücretsiz kurabilir ve dilediğiniz zaman formatlayabilirsiniz.'
    },
    {
      q: 'DDoS koruması NVMe VDS paketlerine dahil mi?',
      a: 'Evet. Tüm sanal sunucularımızda 3.2 Tbps Voxility Layer 3/4 ve Layer 7 donanımsal filtreleme varsayılan olarak aktiftir ve hiçbir ek ücret talep edilmez.'
    },
    {
      q: 'İleride disk, RAM veya CPU yükseltmesi yapabilir miyim?',
      a: 'Evet. Müşteri paneliniz üzerinden veri kaybı yaşamadan tek tıkla bir üst NVMe VDS paketine yükseltme talebinde bulunabilirsiniz.'
    }
  ];

  return (
    <div className="subpage-view vds-subpage-view">
      {/* Subpage Header */}
      <SubpageHeader 
        badge={{
          icon: <Server size={14} />,
          text: 'YÜKSEK PERFORMANSLI NVMe BULUT VDS'
        }}
        title={<>Kurumsal <span className="text-gradient">NVMe Sanal Sunucular (VDS)</span></>}
        subtitle="Almanya (Frankfurt), Hong Kong ve Fransa (Paris) lokasyonlarında, %100 KVM izole çekirdek gücü, Samsung Enterprise Gen4 NVMe depolama ve 3.2 Tbps Voxility DDoS korumasıyla 60 saniyede anında aktif."
        breadcrumbs={[
          { label: 'Sunucu Çözümleri', pageId: 'vds' },
          { label: 'NVMe Sanal Sunucu', active: true }
        ]}
        onNavigate={onNavigate}
        trustPills={[
          { icon: <Cpu size={15} color="var(--accent-cyan)" />, text: 'Intel Xeon & AMD EPYC Gücü' },
          { icon: <Zap size={15} color="#10b981" />, text: 'Enterprise Gen4 NVMe (7400 MB/s)' },
          { icon: <ShieldCheck size={15} color="#38bdf8" />, text: '3.2 Tbps Voxility Anti-DDoS' }
        ]}
      />

      {/* Main Content */}
      <section className="section-padding" style={{ paddingTop: '2.5rem' }}>
        <div className="container">
          
          {/* Crosslink to Extreme Ryzen */}
          <div className="server-crosslink-card">
            <div className="crosslink-content">
              <div className="crosslink-icon-box amber">
                <Flame size={26} color="#f59e0b" />
              </div>
              <div className="crosslink-text">
                <h4>5.7 GHz Oyun & Tek Çekirdek Gücü mü Arıyorsunuz?</h4>
                <p>Minecraft, FiveM, Rust veya derleme iş yükleri için özel tasarlanan <strong>Extreme Ryzen 9 VDS</strong> paketlerimizi keşfedin.</p>
              </div>
            </div>
            <a 
              href="/extreme-sunucu.html"
              className="btn btn-secondary"
              onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('extreme', e); }}
            >
              <span>Extreme Ryzen VDS İncele</span>
              <ArrowRight size={15} />
            </a>
          </div>

          {/* Billing Cycle Discount Selector */}
          <div className="cycle-selector-wrap">
            <span className="cycle-label">Faturalandırma Dönemi:</span>
            <div className="cycle-pills">
              {BILLING_CYCLES.map((cycle) => (
                <button
                  key={cycle.id}
                  type="button"
                  className={`cycle-pill ${selectedCycle === cycle.id ? 'active' : ''}`}
                  onClick={() => setSelectedCycle(cycle.id)}
                >
                  <span>{cycle.label}</span>
                  {cycle.tag && <span className="discount-tag">{cycle.tag}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Plan Cards Grid */}
          <div className="plan-grid" style={{ marginTop: '3rem' }}>
            {nvmeCategory?.plans.map((plan) => {
              const pricing = calculatePlanPrice(plan.basePriceMonthly, selectedCycle);

              return (
                <div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
                  {plan.popular && (
                    <div className="card-ribbon">
                      <span>EN ÇOK TERCİH EDİLEN</span>
                    </div>
                  )}

                  <div className="card-header">
                    <div className="plan-category-tag">ENTERPRISE CLOUD VDS</div>
                    <h3 className="plan-name">{plan.name}</h3>
                    <div className="plan-processor-pill">
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
                        <span>%{pricing.cycle.discount} Tasarruf Sağlandı</span>
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
                      <Cpu size={16} className="spec-icon" />
                      <div>
                        <strong>İşlemci Gücü:</strong>
                        <span>{plan.cores}</span>
                      </div>
                    </li>
                    <li>
                      <Layers size={16} className="spec-icon" />
                      <div>
                        <strong>Bellek (RAM):</strong>
                        <span>{plan.ram}</span>
                      </div>
                    </li>
                    <li>
                      <HardDrive size={16} className="spec-icon" />
                      <div>
                        <strong>NVMe Depolama:</strong>
                        <span>{plan.storage}</span>
                      </div>
                    </li>
                    <li>
                      <Activity size={16} className="spec-icon" />
                      <div>
                        <strong>Ağ & Trafik:</strong>
                        <span>{plan.bandwidth}</span>
                      </div>
                    </li>
                    <li>
                      <ShieldCheck size={16} className="spec-icon" />
                      <div>
                        <strong>DDoS Koruması:</strong>
                        <span>{plan.ddos}</span>
                      </div>
                    </li>
                    <li>
                      <Globe2 size={16} className="spec-icon" />
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
                      className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} btn-block`}
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
          <div className="vds-features-banner">
            <div className="banner-title-box">
              <h3>Tüm NVMe VDS Sunucularda Standart Sunulan Kurumsal Ayrıcalıklar</h3>
              <p>Ek lisans veya operasyon ücreti ödemeden NovaQ Servers altyapısının tüm kurumsal yeteneklerinden faydalanın.</p>
            </div>
            <div className="banner-features-grid">
              <div className="banner-feature-item">
                <div className="bf-icon"><Terminal size={22} color="var(--accent-cyan)" /></div>
                <h4>%100 Kök (Root/Admin) Erişimi</h4>
                <p>Linux SSH veya Windows RDP ile işletim sisteminizin mutlak kontrolü ve bağımsız yönetimi sizde.</p>
              </div>
              <div className="banner-feature-item">
                <div className="bf-icon"><RefreshCw size={22} color="var(--accent-cyan)" /></div>
                <h4>Anında Format & Yeniden Kurulum</h4>
                <p>Müşteri panelinizden tek tıkla Ubuntu, Debian, AlmaLinux veya Windows kurun ve dilediğiniz an sıfırlayın.</p>
              </div>
              <div className="banner-feature-item">
                <div className="bf-icon"><ShieldCheck size={22} color="var(--accent-cyan)" /></div>
                <h4>Voxility 3.2 Tbps L3/L4/L7 Kalkanı</h4>
                <p>Tüm TCP/UDP flood, SYN, DNS Amplification ve botnet saldırılarına karşı donanımsal koruma devrede.</p>
              </div>
              <div className="banner-feature-item">
                <div className="bf-icon"><Globe2 size={22} color="var(--accent-cyan)" /></div>
                <h4>Özel rDNS PTR Kaydı Yönetimi</h4>
                <p>E-posta gönderimlerinizde spam'e düşmemek için panelinizden ters DNS (PTR) kaydınızı anında düzenleyin.</p>
              </div>
            </div>
          </div>

          {/* VDS Specific FAQ Section */}
          <div className="subpage-faq-section">
            <div className="section-header text-center" style={{ maxWidth: '750px', margin: '0 auto 2.5rem' }}>
              <div className="section-pill">
                <HelpCircle size={13} />
                <span>SIKÇA SORULAN SORULAR</span>
              </div>
              <h2 className="section-title">
                NVMe Sanal Sunucular Hakkında <span className="text-gradient">Merak Edilenler</span>
              </h2>
            </div>

            <div className="faq-accordion" style={{ maxWidth: '850px', margin: '0 auto' }}>
              {vdsFaqs.map((faq, idx) => (
                <div key={idx} className={`faq-card ${openFaq === idx ? 'open' : ''}`}>
                  <button 
                    type="button"
                    className="faq-question"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? <ChevronUp size={18} color="var(--accent-cyan)" /> : <ChevronDown size={18} />}
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
