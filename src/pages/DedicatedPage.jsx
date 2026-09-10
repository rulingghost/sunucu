import React, { useState } from 'react';
import { 
  HardDrive, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Layers, 
  Activity, 
  Server, 
  Globe2, 
  Lock,
  Clock,
  Settings2,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import SubpageHeader from '../components/SubpageHeader';
import EnterpriseCtaBanner from '../components/EnterpriseCtaBanner';
import { SERVER_CATEGORIES, BILLING_CYCLES, calculatePlanPrice } from '../data/serverPlans';

export default function DedicatedPage({ onSelectPlan, onNavigate, onOpenConfigurator }) {
  const [selectedCycle, setSelectedCycle] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);
  const dedicatedCategory = SERVER_CATEGORIES.find(c => c.id === 'dedicated');

  const dedicatedFaqs = [
    {
      q: 'Fiziksel Dedicated sunucuda IPMI / iDRAC KVM erişimi veriliyor mu?',
      a: 'Evet. Tüm Dedicated sunucularımızda donanımsal IPMI / iDRAC KVM uzaktan yönetim kartı tahsis edilir. İşletim sistemi çökmüş olsa bile uzaktan ISO bağlayabilir, BIOS ayarlarına girebilir ve sunucuyu yeniden başlatabilirsiniz.'
    },
    {
      q: 'Donanım arızalarında SLA garantiniz nedir?',
      a: 'Sözleşmeli SLA taahhüdümüz kapsamında; RAM, disk, anakart veya güç kaynağı (PSU) arızalarında en geç 120 dakika (2 saat) içerisinde parça değişimi garantimiz bulunmaktadır.'
    },
    {
      q: 'Kendi IP bloğumu (BGP Anonsu) getirebilir miyim?',
      a: 'Evet. Kendi ASN ve RIPE IP subnet bloklarınızı veri merkezlerimizdeki NovaQ Servers BGP yönlendiricilerine anons ettirebilirsiniz. NOC ekibimiz BGP yapılandırmasını ücretsiz olarak sağlar.'
    },
    {
      q: 'Donanımsal RAID desteği var mı?',
      a: 'Tüm sunucularımızda LSI / Broadcom MegaRAID donanımsal denetleyici ve BBU (Battery Backup Unit) seçenekleri mevcuttur. RAID 1, RAID 5, RAID 10 yapılandırmaları sipariş sırasında seçilebilir.'
    }
  ];

  return (
    <div className="subpage-view dedicated-subpage-view">
      {/* Subpage Header */}
      <SubpageHeader 
        badge={{
          icon: <HardDrive size={14} />,
          text: '%100 BARE-METAL İZOLASYON & SAF DONANIM GÜCÜ'
        }}
        title={<>Kurumsal <span className="text-gradient">Fiziksel Dedicated Sunucular</span></>}
        subtitle="Sanallaştırma katmanı ve kaynak paylaşımı olmadan, fiziksel sunucunun tüm işlemci, bellek ve disk gücünü projenize tahsis edin. IPMI/iDRAC KVM uzaktan erişim, donanımsal RAID ve 2 saatte parça değişim garantisi."
        breadcrumbs={[
          { label: 'Sunucu Çözümleri', pageId: 'dedicated' },
          { label: 'Fiziksel Sunucular', active: true }
        ]}
        onNavigate={onNavigate}
        trustPills={[
          { icon: <Cpu size={15} color="var(--accent-cyan)" />, text: 'Çift AMD EPYC & Xeon Platinum' },
          { icon: <Clock size={15} color="#10b981" />, text: '2 Saat Parça Değişim SLA' },
          { icon: <ShieldCheck size={15} color="#a855f7" />, text: 'IPMI/iDRAC KVM Tam Kontrol' }
        ]}
      />

      {/* Main Content */}
      <section className="section-padding" style={{ paddingTop: '2.5rem' }}>
        <div className="container">
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
          <div className="plan-grid dedicated-grid" style={{ marginTop: '3rem' }}>
            {dedicatedCategory?.plans.map((plan) => {
              const pricing = calculatePlanPrice(plan.basePriceMonthly, selectedCycle);

              return (
                <div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
                  {plan.popular && (
                    <div className="card-ribbon">
                      <span>EN POPÜLER TERCİH</span>
                    </div>
                  )}

                  <div className="card-header">
                    <div className="plan-category-tag">ENTERPRISE BARE-METAL</div>
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
                        <span>%{pricing.cycle.discount} Tasarruf</span>
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
                        <strong>İşlemci:</strong>
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
                        <strong>Depolama:</strong>
                        <span>{plan.storage}</span>
                      </div>
                    </li>
                    <li>
                      <Activity size={16} className="spec-icon" />
                      <div>
                        <strong>Bant Genişliği:</strong>
                        <span>{plan.bandwidth}</span>
                      </div>
                    </li>
                    <li>
                      <ShieldCheck size={16} className="spec-icon" />
                      <div>
                        <strong>DDoS Süzme:</strong>
                        <span>{plan.ddos}</span>
                      </div>
                    </li>
                    <li>
                      <Globe2 size={16} className="spec-icon" />
                      <div>
                        <strong>IP Adresleri:</strong>
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
                      <Clock size={13} color="#10b981" />
                      <span>2-4 Saatte Donanım Hazırlığı & Teslim</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bare-Metal Guarantees Banner */}
          <div className="dedicated-features-banner">
            <div className="banner-title-box">
              <h3>Fiziksel Dedicated Altyapısında Kurumsal Güvencelerimiz</h3>
              <p>Yüksek hacimli veri tabanları, ERP yazılımları ve sanallaştırma hipervizörleri için ideal temel.</p>
            </div>
            <div className="banner-features-grid">
              <div className="banner-feature-item">
                <div className="bf-icon purple"><Clock size={22} color="#a855f7" /></div>
                <h4>120 Dakika Donanım Değişimi</h4>
                <p>Olası disk, RAM veya güç kaynağı arızalarında 2 saat içinde teknik müdahale garantisi.</p>
              </div>
              <div className="banner-feature-item">
                <div className="bf-icon purple"><Settings2 size={22} color="#a855f7" /></div>
                <h4>IPMI / iDRAC Uzak KVM</h4>
                <p>İnternet üzerinden BIOS erişimi, donanımsal güç kontrolü ve sanal medya bağlama.</p>
              </div>
              <div className="banner-feature-item">
                <div className="bf-icon purple"><ShieldCheck size={22} color="#a855f7" /></div>
                <h4>Özel BGP ve Donanımsal Firewall</h4>
                <p>Kendi IP bloklarınızı anons edin veya donanımsal Fortinet/Cisco güvenlik duvarı ekleyin.</p>
              </div>
              <div className="banner-feature-item">
                <div className="bf-icon purple"><Globe2 size={22} color="#a855f7" /></div>
                <h4>Frankfurt, Hong Kong, Paris Kabinleri</h4>
                <p>Tier-IV veri merkezlerimizde doğrudan kabin içi 10 Gbps yedekli fiber omurga.</p>
              </div>
            </div>
          </div>

          {/* Dedicated FAQ Accordion */}
          <div className="subpage-faq-section">
            <div className="section-header text-center" style={{ maxWidth: '750px', margin: '0 auto 2.5rem' }}>
              <div className="section-pill" style={{ borderColor: 'rgba(168, 85, 247, 0.3)', color: '#a855f7' }}>
                <HelpCircle size={13} />
                <span>SIKÇA SORULAN SORULAR</span>
              </div>
              <h2 className="section-title">
                Fiziksel Sunucular Hakkında <span className="text-gradient">Merak Edilenler</span>
              </h2>
            </div>

            <div className="faq-accordion" style={{ maxWidth: '850px', margin: '0 auto' }}>
              {dedicatedFaqs.map((faq, idx) => (
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
