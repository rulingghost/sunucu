import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  Server, 
  ShieldCheck, 
  CreditCard, 
  Wallet, 
  Building2, 
  Check, 
  Tag, 
  AlertCircle, 
  Lock, 
  Zap, 
  FileText,
  ChevronRight,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { formatCurrency } from '../data/serverPlans';

export default function PortalCheckout({ 
  cartItems = [], 
  onRemoveItem, 
  onClearCart, 
  onCheckout, 
  user, 
  onNavigate,
  addToast 
}) {
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'balance' | 'eft'
  
  // Card Form State
  const [cardNumber, setCardNumber] = useState('4543 •••• •••• 8820');
  const [cardHolder, setCardHolder] = useState(user?.name || 'Ahmet Yılmaz');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('•••');
  
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate Verified Totals
  let subtotal = 0;
  cartItems.forEach(item => {
    subtotal += item.pricing?.subtotal || item.pricing?.planTotal || 0;
  });

  let couponDiscount = 0;
  if (couponApplied) {
    couponDiscount = Math.round(subtotal * 0.15);
  }

  const finalSubtotal = Math.max(0, subtotal - couponDiscount);
  const vat = Math.round(finalSubtotal * 0.20);
  const total = finalSubtotal + vat;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'NOVAQ2026' || code === 'NOVAQ' || code === 'VIP15') {
      setCouponApplied(true);
      if (addToast) addToast('İndirim Kuponu Uygulandı!', '%15 ek kupon indirimi sepetinize yansıtıldı.');
    } else {
      alert('Geçersiz veya süresi dolmuş kupon kodu! (Geçerli deneme kuponu: NOVAQ2026)');
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (!agreeTerms) {
      alert('Lütfen Mesafeli Satış Sözleşmesi ve SLA Taahhüdünü onaylayınız.');
      return;
    }

    if (paymentMethod === 'balance' && (user?.balance || 0) < total) {
      alert(`Kredi bakiyeniz yetersiz! Mevcut bakiye: $${(user?.balance || 0).toLocaleString('tr-TR')}, Gereken: $${total.toLocaleString('tr-TR')}. Lütfen Kredi Kartı seçiniz veya bakiye yükleyiniz.`);
      return;
    }

    setIsSubmitting(true);

    const paymentMethodLabel = 
      paymentMethod === 'card' ? 'Kredi Kartı (3D Secure 2.0)' :
      paymentMethod === 'balance' ? 'Müşteri Kredi Bakiyesi' :
      'Kurumsal Havale / EFT';

    setTimeout(() => {
      onCheckout({
        items: cartItems,
        subtotal: finalSubtotal,
        vat,
        total,
        couponDiscount,
        paymentMethod: paymentMethodLabel
      });
      setIsSubmitting(false);
    }, 600);
  };

  if (cartItems.length === 0) {
    return (
      <div className="portal-content-inner" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          maxWidth: '560px',
          margin: '0 auto',
          background: 'var(--card-bg)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '3.5rem 2rem'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(0, 210, 255, 0.08)',
            border: '1px solid rgba(0, 210, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            color: 'var(--accent-cyan)'
          }}>
            <ShoppingCart size={32} />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem', color: '#ffffff' }}>
            Sepetinizde Henüz Ürün Bulunmuyor
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Web sitesi üzerinden dilediğiniz NVMe VDS, Extreme Ryzen 9 veya Dedicated sunucu paketini seçip sepete ekleyerek siparişinizi buradan kolayca tamamlayabilirsiniz.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              className="btn btn-primary"
              onClick={() => onNavigate('vds')}
            >
              <Server size={16} />
              <span>NVMe Sunucuları İncele</span>
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => onNavigate('home')}
            >
              <ArrowLeft size={16} />
              <span>Ana Sayfaya Dön</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-content-inner" style={{ paddingBottom: '4rem' }}>
      {/* Breadcrumb Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            <span style={{ cursor: 'pointer', color: 'var(--accent-cyan)' }} onClick={() => onNavigate('panel-dashboard')}>Müşteri Paneli</span>
            <ChevronRight size={14} />
            <span>Güvenli Sipariş Tamamlama & Checkout</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
            Siparişi Tamamla & Ödeme
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onClearCart}
            style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
          >
            <Trash2 size={14} />
            <span>Sepeti Boşalt</span>
          </button>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate('vds')}
          >
            <span>+ Yeni Sunucu Ekle</span>
          </button>
        </div>
      </div>

      {/* Main Checkout Layout Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 420px',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* LEFT COLUMN: Items, Invoice Info & Payment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* SECTION 1: Cart Items */}
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '1.5rem',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Server size={18} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                  Yapılandırılan Sunucu Paketleri ({cartItems.length})
                </h3>
              </div>
              <span className="brand-badge" style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                ✓ Anında Aktivasyon Hazır
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map((item, idx) => {
                const planTotal = item.pricing?.planTotal || item.pricing?.subtotal || 0;
                return (
                  <div 
                    key={item.cartItemId || idx}
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>{item.location?.flag || '🇩🇪'}</span>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                          {item.plan?.name}
                        </h4>
                        <span style={{
                          fontSize: '0.7rem',
                          background: 'rgba(0, 210, 255, 0.12)',
                          color: 'var(--accent-cyan)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '6px',
                          fontWeight: 600
                        }}>
                          {item.cycle?.label} {item.cycle?.discount > 0 && `(%${item.cycle.discount} İndirimli)`}
                        </span>
                      </div>

                      {/* Specs Row */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                        <span>📍 {item.location?.country} ({item.location?.city})</span>
                        <span>•</span>
                        <span>🖥️ {item.os?.name}</span>
                        <span>•</span>
                        <span>⚙️ {item.plan?.cores} / {item.plan?.ram}</span>
                        <span>•</span>
                        <span>⚡ {item.plan?.disk}</span>
                      </div>

                      {item.addons && item.addons.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.6rem' }}>
                          {item.addons.map(addon => (
                            <span 
                              key={addon.id}
                              style={{
                                fontSize: '0.72rem',
                                background: 'rgba(255,255,255,0.05)',
                                color: '#cbd5e1',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '4px',
                                border: '1px solid rgba(255,255,255,0.1)'
                              }}
                            >
                              + {addon.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.hostname && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                          Hostname: {item.hostname}
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)' }}>
                        ${formatCurrency(planTotal)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.cycle?.months} Aylık Toplam
                      </div>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => onRemoveItem(item.cartItemId)}
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: '#ef4444', borderRadius: '6px' }}
                        title="Bu paketi sepetten çıkar"
                      >
                        <Trash2 size={12} />
                        <span>Kaldır</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: Billing & Invoice Information */}
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Building2 size={18} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                  Kurumsal Fatura ve Müşteri Bilgileri
                </h3>
              </div>
              <button 
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onNavigate('panel-security')}
                style={{ fontSize: '0.75rem' }}
              >
                Bilgileri Düzenle
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
              <div style={{ background: 'rgba(15,23,42,0.5)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Fatura Sahibi / Ünvan</span>
                <strong style={{ color: '#ffffff' }}>{user?.company || user?.name || 'Ahmet Yılmaz'}</strong>
              </div>
              <div style={{ background: 'rgba(15,23,42,0.5)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem' }}>E-Posta & İletişim</span>
                <strong style={{ color: '#ffffff' }}>{user?.email || 'ahmet.yilmaz@novaq-client.com'}</strong>
              </div>
              <div style={{ background: 'rgba(15,23,42,0.5)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Vergi Dairesi / No</span>
                <strong style={{ color: '#ffffff' }}>{user?.taxOffice || 'Maslak Vergi Dairesi'} - {user?.taxNumber || '9481028491'}</strong>
              </div>
              <div style={{ background: 'rgba(15,23,42,0.5)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Fatura Adresi</span>
                <strong style={{ color: '#ffffff' }}>{user?.address || 'Büyükdere Cad. No: 194 K:8 Levent / İstanbul'}</strong>
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.85rem' }}>
              ✓ E-Arşiv / E-Faturanız sipariş onaylandıktan sonra GİB entegrasyonuyla otomatik olarak düzenlenip e-posta adresinize iletilecektir.
            </div>
          </div>

          {/* SECTION 3: Payment Method Selection */}
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
              <CreditCard size={18} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                Ödeme Yöntemi Seçimi
              </h3>
            </div>

            {/* Payment Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {/* Option 1: Credit Card */}
              <div 
                style={{
                  border: `2px solid ${paymentMethod === 'card' ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                  background: paymentMethod === 'card' ? 'rgba(0, 210, 255, 0.08)' : 'rgba(15,23,42,0.5)',
                  borderRadius: '12px',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard size={22} color={paymentMethod === 'card' ? 'var(--accent-cyan)' : '#94a3b8'} style={{ margin: '0 auto 0.4rem auto' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: paymentMethod === 'card' ? '#ffffff' : '#94a3b8' }}>
                  Kredi Kartı
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  3D Secure 2.0
                </div>
              </div>

              {/* Option 2: Account Balance */}
              <div 
                style={{
                  border: `2px solid ${paymentMethod === 'balance' ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                  background: paymentMethod === 'balance' ? 'rgba(0, 210, 255, 0.08)' : 'rgba(15,23,42,0.5)',
                  borderRadius: '12px',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
                onClick={() => setPaymentMethod('balance')}
              >
                <Wallet size={22} color={paymentMethod === 'balance' ? 'var(--accent-cyan)' : '#94a3b8'} style={{ margin: '0 auto 0.4rem auto' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: paymentMethod === 'balance' ? '#ffffff' : '#94a3b8' }}>
                  Kredi Bakiyesi
                </div>
                <div style={{ fontSize: '0.7rem', color: (user?.balance || 0) >= total ? '#10b981' : '#f59e0b', marginTop: '0.2rem', fontWeight: 600 }}>
                  ${(user?.balance || 0).toLocaleString('tr-TR')} Mevcut
                </div>
              </div>

              {/* Option 3: Bank Transfer */}
              <div 
                style={{
                  border: `2px solid ${paymentMethod === 'eft' ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                  background: paymentMethod === 'eft' ? 'rgba(0, 210, 255, 0.08)' : 'rgba(15,23,42,0.5)',
                  borderRadius: '12px',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
                onClick={() => setPaymentMethod('eft')}
              >
                <Building2 size={22} color={paymentMethod === 'eft' ? 'var(--accent-cyan)' : '#94a3b8'} style={{ margin: '0 auto 0.4rem auto' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: paymentMethod === 'eft' ? '#ffffff' : '#94a3b8' }}>
                  Havale / EFT
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Garanti / İş Bankası
                </div>
              </div>
            </div>

            {/* Payment Method Details */}
            {paymentMethod === 'card' && (
              <div style={{ background: 'rgba(15,23,42,0.7)', borderRadius: '12px', padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>Kart Bilgileri (256-Bit SSL)</span>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', background: '#ffffff', color: '#090d18', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>VISA</span>
                    <span style={{ fontSize: '0.75rem', background: '#eb001b', color: '#ffffff', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>Mastercard</span>
                    <span style={{ fontSize: '0.75rem', background: '#00579f', color: '#ffffff', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>TROY</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Kart Üzerindeki İsim</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={cardHolder} 
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Ad Soyad"
                      style={{ background: 'rgba(2,6,23,0.8)', borderColor: 'rgba(255,255,255,0.1)', color: '#ffffff', padding: '0.65rem 0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Kart Numarası</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="text" 
                        className="form-control"
                        value={cardNumber} 
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        style={{ background: 'rgba(2,6,23,0.8)', borderColor: 'rgba(255,255,255,0.1)', color: '#ffffff', padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)' }}
                      />
                      <Lock size={15} color="var(--accent-cyan)" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Son Kullanma (AA/YY)</label>
                      <input 
                        type="text" 
                        className="form-control"
                        value={cardExpiry} 
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="08/28"
                        style={{ background: 'rgba(2,6,23,0.8)', borderColor: 'rgba(255,255,255,0.1)', color: '#ffffff', padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Güvenlik Kodu (CVC/CVV)</label>
                      <input 
                        type="password" 
                        className="form-control"
                        value={cardCvc} 
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="•••"
                        maxLength={4}
                        style={{ background: 'rgba(2,6,23,0.8)', borderColor: 'rgba(255,255,255,0.1)', color: '#ffffff', padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'balance' && (
              <div style={{ background: 'rgba(15,23,42,0.7)', borderRadius: '12px', padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mevcut NovaQ Kredi Bakiyeniz:</span>
                  <strong style={{ fontSize: '1.2rem', color: '#ffffff' }}>${(user?.balance || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</strong>
                </div>

                {(user?.balance || 0) >= total ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '0.75rem 1rem', borderRadius: '8px', color: '#10b981', fontSize: '0.85rem' }}>
                    <Check size={16} />
                    <span>Bakiyeniz bu siparişin tamamını karşılamak için yeterlidir. Ödeme anında düşülecektir.</span>
                  </div>
                ) : (
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '0.85rem 1rem', borderRadius: '8px', color: '#ef4444', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                      <AlertCircle size={16} />
                      <span>Yetersiz Bakiye!</span>
                    </div>
                    <span>Bu siparişi tamamlamak için ${(total - (user?.balance || 0)).toLocaleString('tr-TR')} ek bakiye gereklidir. Lütfen Kredi Kartı seçiniz veya Fatura bölümünden bakiye yükleyiniz.</span>
                  </div>
                )}
              </div>
            )}

            {paymentMethod === 'eft' && (
              <div style={{ background: 'rgba(15,23,42,0.7)', borderRadius: '12px', padding: '1.25rem', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
                <p style={{ color: '#cbd5e1', marginBottom: '0.75rem' }}>
                  Sipariş oluşturulduktan sonra aşağıdaki kurumsal banka hesabımıza <strong>Sipariş No</strong> açıklama kısmına yazılarak transfer gerçekleştirilmelidir:
                </p>
                <div style={{ background: 'rgba(2,6,23,0.8)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#ffffff', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div><strong>Banka:</strong> Garanti BBVA - Levent Ticari Şube</div>
                  <div><strong>Alıcı:</strong> NovaQ Bulut ve Ağ Teknolojileri A.Ş.</div>
                  <div><strong>IBAN:</strong> TR48 0006 2000 1234 5678 9012 34</div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.65rem' }}>
                  ✓ EFT/Havale bildirimi yapıldıktan sonra NOC ekibimiz tarafından 10 dakika içinde onaylanır.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary & Action */}
        <div style={{ position: 'sticky', top: '2rem' }}>
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              Sipariş Özeti
            </h3>

            {/* Coupon Code Section */}
            <form onSubmit={handleApplyCoupon} style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                İndirim Kuponu
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="NOVAQ2026"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                    style={{
                      background: 'rgba(15,23,42,0.8)',
                      borderColor: couponApplied ? '#10b981' : 'rgba(255,255,255,0.1)',
                      color: '#ffffff',
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-mono)',
                      padding: '0.6rem 0.85rem'
                    }}
                  />
                  <Tag size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-secondary btn-sm"
                  disabled={couponApplied || !couponCode.trim()}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {couponApplied ? 'Uygulandı' : 'Uygula'}
                </button>
              </div>
              {couponApplied && (
                <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Check size={13} />
                  <span>%15 indirim başarıyla uygulandı!</span>
                </div>
              )}
            </form>

            {/* Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#cbd5e1', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Ara Toplam ({cartItems.length} Ürün):</span>
                <span>${formatCurrency(subtotal)}</span>
              </div>

              {couponApplied && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                  <span>Kupon İndirimi (%15):</span>
                  <span>-${formatCurrency(couponDiscount)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Hesaplanan KDV (%20):</span>
                <span>${formatCurrency(vat)}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                paddingTop: '1rem',
                marginTop: '0.25rem'
              }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Toplam Tutar:</span>
                <span style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)' }}>
                  ${formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Terms Checkbox */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.5rem', cursor: 'pointer', lineHeight: 1.4 }}>
              <input 
                type="checkbox" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{ marginTop: '2px', accentColor: 'var(--accent-cyan)' }}
              />
              <span>
                <a href="/hizmet-sozlesmesi.html" target="_blank" style={{ color: 'var(--accent-cyan)' }}>Hizmet Sözleşmesi</a>, SLA Taahhüdü ve İptal Şartlarını okudum, onaylıyorum.
              </span>
            </label>

            {/* Complete Order Button */}
            <button 
              className="btn btn-primary btn-block"
              style={{ padding: '0.95rem', fontSize: '1rem', fontWeight: 700 }}
              onClick={handlePaymentSubmit}
              disabled={isSubmitting || (paymentMethod === 'balance' && (user?.balance || 0) < total)}
            >
              {isSubmitting ? (
                <span>Sipariş İşleniyor...</span>
              ) : (
                <>
                  <span>Ödemeyi Onayla & Siparişi Ver</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Trust Badges */}
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#10b981' }}>
                <ShieldCheck size={15} />
                <span>3.2 Tbps DDoS Koruması Dahil</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                <Zap size={15} />
                <span>Yönetim Onayı Sonrası 60 Sn Otomatik Kurulum</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                <Lock size={15} />
                <span>256-Bit SSL 3D Secure 2.0 Güvenli Ödeme</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
