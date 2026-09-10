import React, { useState } from 'react';
import { 
  LOCATIONS, 
  OPERATING_SYSTEMS, 
  ADDONS, 
  BILLING_CYCLES, 
  calculatePlanPrice 
} from '../data/serverPlans';
import { 
  X, 
  Server, 
  Globe, 
  Cpu, 
  Check, 
  ShieldCheck, 
  HardDrive, 
  ArrowRight, 
  Sparkles, 
  Tag,
  ShoppingCart
} from 'lucide-react';

export default function ConfiguratorModal({ plan, initialCycle = 'monthly', onClose, onOrderComplete, onAddToCart }) {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0].id);
  const [selectedOS, setSelectedOS] = useState(OPERATING_SYSTEMS[0].id);
  const [selectedCycle, setSelectedCycle] = useState(initialCycle || 'monthly');
  const [selectedAddons, setSelectedAddons] = useState(['backup_daily']);
  const [hostname, setHostname] = useState('cloud-vm01.novaq.internal');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [provisioning, setProvisioning] = useState(false);
  const [provisionStep, setProvisionStep] = useState('');

  if (!plan) return null;

  const locationObj = LOCATIONS.find(l => l.id === selectedLocation) || LOCATIONS[0];
  const osObj = OPERATING_SYSTEMS.find(o => o.id === selectedOS) || OPERATING_SYSTEMS[0];
  const cycleObj = BILLING_CYCLES.find(c => c.id === selectedCycle) || BILLING_CYCLES[0];

  // Calculate pricing
  const activeAddonObjects = ADDONS.filter(a => selectedAddons.includes(a.id));
  if (!osObj.free && osObj.priceMonthly) {
    activeAddonObjects.push({ id: osObj.id, name: osObj.name, priceMonthly: osObj.priceMonthly });
  }

  let pricing = calculatePlanPrice(plan.basePriceMonthly, selectedCycle, activeAddonObjects);

  if (couponApplied) {
    const couponDiscount = Math.round(pricing.subtotal * 0.15);
    const newSubtotal = pricing.subtotal - couponDiscount;
    const newVat = Math.round(newSubtotal * 0.20);
    pricing = {
      ...pricing,
      couponDiscount,
      subtotal: newSubtotal,
      vat: newVat,
      total: newSubtotal + newVat
    };
  }

  const toggleAddon = (addonId) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
    );
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'NOVAQ2026' || couponCode.trim().toUpperCase() === 'NOVAQ') {
      setCouponApplied(true);
    } else {
      alert('Geçersiz kupon kodu! (Geçerli kupon örneği: NOVAQ2026)');
    }
  };

  const handleCompleteOrder = () => {
    setProvisioning(true);
    setProvisionStep('1/4: Donanım tahsisi ve MAC adresi oluşturuluyor...');

    setTimeout(() => {
      setProvisionStep('2/4: NVMe Gen4 disk bölümleniyor ve ' + osObj.name + ' kuruluyor...');
    }, 900);

    setTimeout(() => {
      setProvisionStep('3/4: 10 Gbps BGP hattı ve 3.2 Tbps DDoS kalkanı bağlanıyor...');
    }, 1800);

    setTimeout(() => {
      setProvisionStep('4/4: Sunucu hazır! Müşteri paneline aktarılıyor...');
    }, 2600);

    setTimeout(() => {
      const newServerInstance = {
        id: 'srv-custom-' + Math.floor(100 + Math.random() * 900),
        name: hostname.split('.')[0] || 'nova-cloud-inst',
        hostname: hostname,
        planName: plan.name,
        category: plan.category || 'nvme-vds',
        status: 'running',
        location: `${locationObj.country} (${locationObj.city})`,
        flag: locationObj.flag,
        ip: locationObj.id === 'de' ? '194.15.36.' + Math.floor(150 + Math.random() * 80) :
            locationObj.id === 'hk' ? '103.88.221.' + Math.floor(150 + Math.random() * 80) :
            '51.77.104.' + Math.floor(150 + Math.random() * 80),
        gateway: locationObj.id === 'de' ? '194.15.36.1' : locationObj.id === 'hk' ? '103.88.221.1' : '51.77.104.1',
        netmask: '255.255.255.0',
        rdns: hostname,
        os: osObj.name,
        cores: plan.cores,
        ram: plan.ram,
        disk: plan.storage,
        diskUsed: '12.4 GB',
        bandwidthTotal: plan.bandwidth,
        bandwidthUsedMonth: '0.1 TB',
        uptime: '1 Dakika (Yeni Kurulum)',
        renewalDate: '10.10.2026',
        priceMonthly: pricing.discountedMonthly,
        metrics: {
          cpuHistory: [8, 12, 10, 15, 9, 11, 14, 12, 10, 11, 13, 9],
          ramHistory: [20, 22, 21, 23, 22, 21, 23, 22, 22, 21, 23, 22],
          diskIOHistory: [40, 80, 110, 25, 12, 15, 18, 14, 10, 12, 14, 16],
          netMbps: [30, 45, 60, 40, 35, 50, 42, 38, 44, 40, 36, 48]
        },
        snapshots: []
      };

      setProvisioning(false);
      onOrderComplete(newServerInstance, pricing);
    }, 3200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '920px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="terminal-header" style={{ padding: '1.25rem 1.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Server size={20} color="var(--accent-cyan)" />
              <span>Sunucu Yapılandırıcı & Sipariş</span>
              <span className="brand-badge" style={{ marginLeft: '0.5rem' }}>{plan.name}</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Donanım: {plan.processor} • {plan.cores} • {plan.ram} • {plan.storage}
            </p>
          </div>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={onClose}
            style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Provisioning overlay if user clicked order */}
        {provisioning ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem auto' }}>
              <div className="pulse-online" style={{ width: '48px', height: '48px' }}></div>
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
              Sunucunuz Otomatik Kuruluyor...
            </h3>
            <p style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.95rem' }}>
              {provisionStep}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1.5rem' }}>
              Lütfen bekleyin, kurulum tamamlandığında müşteri panelinize aktarılacaksınız.
            </p>
          </div>
        ) : (
          <div style={{ padding: '1.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem' }}>
              {/* Left Config Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                
                {/* 1. Location Selection */}
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                    1. Veri Merkezi Lokasyonu Seçin
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    {LOCATIONS.map(loc => (
                      <div
                        key={loc.id}
                        onClick={() => setSelectedLocation(loc.id)}
                        style={{
                          background: selectedLocation === loc.id ? 'rgba(0, 210, 255, 0.12)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${selectedLocation === loc.id ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                          borderRadius: '12px',
                          padding: '0.9rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: '1.6rem', marginBottom: '0.25rem' }}>{loc.flag}</div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#ffffff' }}>{loc.country}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{loc.city}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', marginTop: '0.35rem' }}>{loc.pingEst}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Operating System Selection */}
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                    2. İşletim Sistemi Dağıtımı
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }}>
                    {OPERATING_SYSTEMS.map(os => (
                      <div
                        key={os.id}
                        onClick={() => setSelectedOS(os.id)}
                        style={{
                          background: selectedOS === os.id ? 'rgba(0, 210, 255, 0.12)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${selectedOS === os.id ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                          borderRadius: '10px',
                          padding: '0.75rem 1rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.85rem'
                        }}
                      >
                        <span style={{ color: selectedOS === os.id ? '#ffffff' : '#cbd5e1', fontWeight: selectedOS === os.id ? 600 : 400 }}>
                          {os.name}
                        </span>
                        {!os.free && (
                          <span style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600 }}>
                            +${os.priceMonthly.toLocaleString('tr-TR')}/ay
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Billing Period */}
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                    3. Faturalandırma Periyodu & İndirim
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                    {BILLING_CYCLES.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedCycle(c.id)}
                        style={{
                          background: selectedCycle === c.id ? 'var(--grad-primary)' : 'rgba(255,255,255,0.04)',
                          color: '#ffffff',
                          border: `1px solid ${selectedCycle === c.id ? 'transparent' : 'var(--border-subtle)'}`,
                          borderRadius: '10px',
                          padding: '0.75rem 0.5rem',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{c.label}</div>
                        {c.discount > 0 && (
                          <div style={{ fontSize: '0.7rem', color: selectedCycle === c.id ? '#ffffff' : '#10b981', fontWeight: 700, marginTop: '0.2rem' }}>
                            %{c.discount} İndirim
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Add-ons & Extra Services */}
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                    4. Ek Güvenlik ve Eklentiler (Opsiyonel)
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {ADDONS.map(addon => {
                      const isChecked = selectedAddons.includes(addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddon(addon.id)}
                          style={{
                            background: isChecked ? 'rgba(0, 210, 255, 0.08)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${isChecked ? 'rgba(0, 210, 255, 0.4)' : 'var(--border-subtle)'}`,
                            borderRadius: '10px',
                            padding: '0.75rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '4px',
                              border: `1px solid ${isChecked ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                              background: isChecked ? 'var(--accent-cyan)' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#000'
                            }}>
                              {isChecked && <Check size={13} strokeWidth={3} />}
                            </div>
                            <span style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>{addon.name}</span>
                          </div>
                          <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                            +${addon.priceMonthly.toLocaleString('tr-TR')} / ay
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Hostname */}
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                    Sunucu Hostname / Etiket
                  </label>
                  <input
                    type="text"
                    value={hostname}
                    onChange={(e) => setHostname(e.target.value)}
                    placeholder="ornek: server01.sirketiniz.com"
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      color: '#ffffff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              {/* Right Order Summary Column */}
              <div>
                <div style={{
                  background: 'rgba(10, 15, 26, 0.95)',
                  border: '1px solid rgba(0, 210, 255, 0.3)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  position: 'sticky',
                  top: '1rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
                }}>
                  <h4 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                    Sipariş Özeti
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Seçilen Plan:</span>
                      <strong style={{ color: '#ffffff' }}>{plan.name}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Lokasyon:</span>
                      <span>{locationObj.flag} {locationObj.country}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>İşletim Sistemi:</span>
                      <span>{osObj.name.split(' ')[0]}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Periyot:</span>
                      <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{cycleObj.label}</span>
                    </div>
                    {cycleObj.discount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                        <span>Dönem İndirimi (%{cycleObj.discount}):</span>
                        <span>-${pricing.savings.toLocaleString('tr-TR')}</span>
                      </div>
                    )}
                    {couponApplied && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                        <span>Kupon İndirimi (%15):</span>
                        <span>-${pricing.couponDiscount.toLocaleString('tr-TR')}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                      <span>Ara Toplam:</span>
                      <span>${pricing.subtotal.toLocaleString('tr-TR')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>KDV (%20):</span>
                      <span>${pricing.vat.toLocaleString('tr-TR')}</span>
                    </div>
                  </div>

                  {/* Coupon Form */}
                  <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <input
                      type="text"
                      placeholder="İndirim Kuponu (NOVAQ2026)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={couponApplied}
                      style={{
                        flexGrow: 1,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        padding: '0.5rem 0.75rem',
                        color: '#ffffff',
                        fontSize: '0.8rem'
                      }}
                    />
                    <button
                      type="submit"
                      className="btn btn-secondary btn-sm"
                      disabled={couponApplied}
                    >
                      {couponApplied ? 'Uygulandı' : 'Uygula'}
                    </button>
                  </form>

                  {/* Total Amount */}
                  <div style={{
                    background: 'rgba(0, 210, 255, 0.1)',
                    border: '1px solid rgba(0, 210, 255, 0.3)',
                    borderRadius: '12px',
                    padding: '1.1rem',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Ödenecek Toplam Tutar
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: '#ffffff' }}>
                      ${pricing.total.toLocaleString('tr-TR')}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.2rem' }}>
                      ✓ Kurulum Ücretsiz • 60 Saniye Anında Teslim
                    </div>
                  </div>

                  {/* Action Buttons: Sepete Ekle & Hemen Sipariş */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '0.85rem' }}
                      onClick={handleCompleteOrder}
                    >
                      <span>Hemen Sipariş Ver & Kuruluma Başla</span>
                      <ArrowRight size={16} />
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ width: '100%', padding: '0.75rem', borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}
                      onClick={() => {
                        onAddToCart({
                          cartItemId: 'cart-' + Date.now(),
                          plan,
                          location: locationObj,
                          os: osObj,
                          cycle: cycleObj,
                          addons: activeAddonObjects,
                          hostname,
                          pricing
                        });
                        onClose();
                      }}
                    >
                      <ShoppingCart size={15} />
                      <span>Bu Yapılandırmayı Sepete Ekle</span>
                    </button>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.85rem' }}>
                    Domain satışı yapılmamaktadır. Siparişiniz doğrudan müşteri panelinize aktarılacaktır.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
