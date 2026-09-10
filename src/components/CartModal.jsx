import React from 'react';
import { 
  X, 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  Server, 
  ShieldCheck, 
  Zap, 
  Lock,
  CheckCircle,
  LogIn
} from 'lucide-react';
import { formatCurrency } from '../data/serverPlans';

export default function CartModal({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  onRemoveItem, 
  onClearCart, 
  onProceedToCheckout,
  user
}) {
  if (!isOpen) return null;

  // Calculate totals
  let subtotal = 0;
  cartItems.forEach(item => {
    subtotal += item.pricing?.subtotal || item.pricing?.planTotal || 0;
  });

  const vat = Math.round(subtotal * 0.20);
  const total = subtotal + vat;

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) return;
    onClose();
    if (onProceedToCheckout) {
      onProceedToCheckout();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="terminal-header" style={{ padding: '1.25rem 1.75rem', background: '#090d18' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingCart size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>Alışveriş Sepetiniz</h3>
            <span className="brand-badge" style={{ marginLeft: '0.5rem', fontSize: '0.75rem' }}>
              {cartItems.length} Ürün
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {cartItems.length > 0 && (
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={onClearCart}
                style={{ fontSize: '0.75rem', color: '#ef4444' }}
              >
                <Trash2 size={12} />
                <span>Sepeti Boşalt</span>
              </button>
            )}
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={onClose}
              style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: 'var(--text-muted)' }}>
              <ShoppingCart size={28} />
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#ffffff' }}>Sepetiniz Boş</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto 1.5rem auto' }}>
              Sunucu listesinden ihtiyacınıza uygun paketi seçip sepete ekleyerek başlayabilirsiniz.
            </p>
            <button className="btn btn-primary btn-sm" onClick={onClose}>
              Sunucu Paketlerini İncele
            </button>
          </div>
        ) : (
          <div style={{ padding: '1.5rem 1.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) 300px', gap: '1.75rem' }}>
              
              {/* Left Column: Cart Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {cartItems.map((item, index) => (
                  <div 
                    key={item.cartItemId || index}
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '1.3rem' }}>{item.location?.flag || '🇩🇪'}</span>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                            {item.plan?.name}
                          </h4>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                            {item.location?.country} • {item.os?.name?.split(' ')[0]}
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => onRemoveItem(item.cartItemId)}
                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
                        title="Sepetten Çıkar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem', marginTop: '0.2rem' }}>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(0, 210, 255, 0.1)', color: 'var(--accent-cyan)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 600 }}>
                        {item.cycle?.label} {item.cycle?.discount > 0 && `(%${item.cycle.discount} İndirim)`}
                      </span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                        ${formatCurrency(item.pricing?.planTotal || item.pricing?.subtotal || 0)}
                      </span>
                    </div>
                  </div>
                ))}

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                  <CheckCircle size={14} color="#10b981" />
                  <span>Sepetiniz tarayıcınızda ve hesabınızda otomatik olarak saklanmaktadır.</span>
                </div>
              </div>

              {/* Right Column: Mini Summary & Direct Checkout CTA */}
              <div>
                <div style={{
                  background: 'rgba(10, 15, 26, 0.95)',
                  border: '1px solid rgba(0, 210, 255, 0.3)',
                  borderRadius: '16px',
                  padding: '1.25rem'
                }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                    Sipariş Özeti
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Ara Toplam:</span>
                      <span>${formatCurrency(subtotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>KDV (%20):</span>
                      <span>${formatCurrency(vat)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                      <span>Toplam:</span>
                      <span style={{ color: 'var(--accent-cyan)' }}>${formatCurrency(total)}</span>
                    </div>
                  </div>

                  {/* Auth Status Notice */}
                  {user && user.isLoggedIn ? (
                    <div style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '0.5rem 0.65rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle size={14} />
                      <span>{user.name} olarak giriş yapıldı</span>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.75rem', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '0.5rem 0.65rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <LogIn size={14} />
                      <span>Sipariş için giriş / üyelik adımına yönlendirileceksiniz</span>
                    </div>
                  )}

                  {/* Primary CTA */}
                  <button 
                    className="btn btn-primary btn-block"
                    style={{ padding: '0.85rem', fontSize: '0.95rem', fontWeight: 700 }}
                    onClick={handleCheckoutClick}
                  >
                    <span>Sipariş Ver / Devam Et</span>
                    <ArrowRight size={16} />
                  </button>

                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center', lineHeight: 1.4 }}>
                    🔒 Ödeme ve fatura bilgileri Müşteri Panelinde 3D Secure güvencesiyle tamamlanır.
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
