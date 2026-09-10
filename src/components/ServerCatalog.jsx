import React, { useState } from 'react';
import { 
  SERVER_CATEGORIES, 
  BILLING_CYCLES, 
  calculatePlanPrice 
} from '../data/serverPlans';
import { 
  Cpu, 
  Database, 
  HardDrive, 
  Network, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Sparkles,
  Layers
} from 'lucide-react';

export default function ServerCatalog({ onSelectPlan }) {
  const [selectedCategory, setSelectedCategory] = useState('nvme-vds');
  const [selectedCycle, setSelectedCycle] = useState('monthly');

  const currentCategory = SERVER_CATEGORIES.find(c => c.id === selectedCategory) || SERVER_CATEGORIES[0];

  return (
    <section className="catalog-section" id="catalog">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-pill">
            <Layers size={14} />
            <span>Kurumsal Sunucu Çözümleri</span>
          </div>
          <h2 className="section-title">
            Yüksek Güçlü <span className="grad-cyber-text">Sunucu Paketleri</span>
          </h2>
          <p className="section-desc">
            Almanya, Hong Kong ve Fransa veri merkezlerimizde barınan, anında otomatik kurulan 
            ve kurumsal seviyede izole edilen sunucu altyapınızı hemen seçin.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          {SERVER_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <Cpu size={16} />
              <span>{cat.title}</span>
              {cat.badge && (
                <span style={{ 
                  fontSize: '0.7rem', 
                  background: 'rgba(0,210,255,0.15)', 
                  color: 'var(--accent-cyan)',
                  padding: '0.15rem 0.4rem',
                  borderRadius: '4px'
                }}>
                  {cat.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Billing Period Selector with Discounts */}
        <div className="billing-toggle-wrap">
          <div className="billing-selector">
            {BILLING_CYCLES.map(cycle => (
              <button
                key={cycle.id}
                className={`cycle-btn ${selectedCycle === cycle.id ? 'active' : ''}`}
                onClick={() => setSelectedCycle(cycle.id)}
              >
                <span>{cycle.label}</span>
                {cycle.tag && (
                  <span className="discount-badge">{cycle.tag}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Plans Grid */}
        <div className="plans-grid">
          {currentCategory.plans.map(plan => {
            const pricing = calculatePlanPrice(plan.basePriceMonthly, selectedCycle);

            return (
              <div 
                key={plan.id} 
                className={`plan-card ${plan.popular ? 'popular-card' : ''}`}
              >
                {plan.popular && (
                  <div className="popular-banner">
                    <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    En Çok Satan
                  </div>
                )}

                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-processor">{plan.processor}</div>
                </div>

                {/* Price Display */}
                <div className="plan-price-box">
                  <div className="price-row">
                    <span className="price-currency">$</span>
                    <span className="price-amount">
                      {pricing.cycle.months > 1
                        ? pricing.planTotal.toLocaleString('tr-TR')
                        : pricing.discountedMonthly.toLocaleString('tr-TR')}
                    </span>
                    <span className="price-period">
                      / {pricing.cycle.months === 12 ? 'yıl' : pricing.cycle.months > 1 ? `${pricing.cycle.months} ay` : 'ay'}
                    </span>
                  </div>
                  
                  {pricing.cycle.months > 1 ? (
                    <div className="price-billed-subtext">
                      Aylık <strong>${pricing.discountedMonthly.toLocaleString('tr-TR')}</strong> eşdeğeri (%{pricing.cycle.discount} indirim)
                      <div className="price-saving-tag">
                        🎉 Bu periyotta ${pricing.savings.toLocaleString('tr-TR')} tasarruf ediyorsunuz!
                      </div>
                    </div>
                  ) : (
                    <div className="price-billed-subtext">
                      Aylık taahhütsüz faturalandırma (KDV hariç)
                    </div>
                  )}
                </div>

                {/* Specs List */}
                <ul className="specs-list">
                  <li className="spec-item">
                    <div className="spec-icon-wrap"><Cpu size={13} /></div>
                    <span>İşlemci: <strong className="spec-strong">{plan.cores}</strong></span>
                  </li>
                  <li className="spec-item">
                    <div className="spec-icon-wrap"><Database size={13} /></div>
                    <span>Bellek: <strong className="spec-strong">{plan.ram}</strong></span>
                  </li>
                  <li className="spec-item">
                    <div className="spec-icon-wrap"><HardDrive size={13} /></div>
                    <span>Depolama: <strong className="spec-strong">{plan.storage}</strong></span>
                  </li>
                  {plan.gpu && (
                    <li className="spec-item">
                      <div className="spec-icon-wrap" style={{ color: '#10b981', background: 'rgba(16,185,129,0.15)' }}>
                        <Sparkles size={13} />
                      </div>
                      <span>GPU: <strong className="spec-strong" style={{ color: '#10b981' }}>{plan.gpu}</strong></span>
                    </li>
                  )}
                  <li className="spec-item">
                    <div className="spec-icon-wrap"><Network size={13} /></div>
                    <span>Trafik & Port: <strong className="spec-strong">{plan.bandwidth}</strong></span>
                  </li>
                  <li className="spec-item">
                    <div className="spec-icon-wrap"><ShieldCheck size={13} /></div>
                    <span>DDoS Filtresi: <strong className="spec-strong">{plan.ddos}</strong></span>
                  </li>
                </ul>

                {/* Action button */}
                <button
                  className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%', marginTop: 'auto' }}
                  onClick={() => onSelectPlan(plan, selectedCycle)}
                >
                  <span>Yapılandır & Kirala</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
