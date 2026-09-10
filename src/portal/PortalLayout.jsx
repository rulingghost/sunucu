import React from 'react';
import { 
  LayoutDashboard, 
  Server, 
  PackageCheck,
  LifeBuoy, 
  CreditCard, 
  Shield, 
  ArrowLeft, 
  Bell, 
  PlusCircle, 
  LogOut,
  ExternalLink,
  Wallet,
  ShoppingCart,
  Globe,
  Database,
  UploadCloud
} from 'lucide-react';
import { vercelDbService } from '../services/vercelDbService';

export default function PortalLayout({ 
  currentTab, 
  onNavigateTab, 
  user, 
  serversCount = 0, 
  pendingOrdersCount = 0, 
  openTicketsCount = 0,
  cartCount = 0,
  onReturnToPublic,
  onOpenAddBalance,
  onOpenNewServer,
  onLogout,
  children
}) {
  const navItems = [
    { id: 'dashboard', label: 'Genel Bakış', icon: <LayoutDashboard size={18} />, path: '/panel' },
    { id: 'servers', label: 'Sunucularım', icon: <Server size={18} />, badge: serversCount, path: '/panel/servers' },
    { id: 'orders', label: 'Siparişler & Aktivasyon', icon: <PackageCheck size={18} />, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null, badgeTitle: pendingOrdersCount > 0 ? `${pendingOrdersCount} sipariş onay bekliyor` : undefined, badgeColor: '#f59e0b', path: '/panel/orders' },
    { id: 'tickets', label: 'Destek & Ticket', icon: <LifeBuoy size={18} />, badge: openTicketsCount > 0 ? openTicketsCount : null, badgeColor: '#f59e0b', path: '/panel/tickets' },
    { id: 'invoices', label: 'Fatura & Bakiye', icon: <CreditCard size={18} />, path: '/panel/invoices' },
    { id: 'security', label: 'Profil & Güvenlik', icon: <Shield size={18} />, path: '/panel/security' }
  ];

  if (cartCount > 0) {
    navItems.push({
      id: 'checkout',
      label: 'Sepet & Ödeme',
      icon: <ShoppingCart size={18} />,
      badge: cartCount,
      badgeTitle: `${cartCount} ürün sepette`,
      badgeColor: 'var(--accent-cyan)',
      path: '/panel/checkout'
    });
  }

  return (
    <div className="portal-container">
      {/* Sidebar */}
      <aside className="portal-sidebar">
        {/* Logo and Head */}
        <div className="portal-sidebar-head">
          <div 
            className="portal-sidebar-logo" 
            style={{ cursor: 'pointer' }} 
            onClick={() => onNavigateTab('dashboard', '/panel')}
            title="Müşteri paneli ana sayfası"
          >
            <img 
              src="/assets/novaq-logo.png" 
              alt="NovaQ Servers" 
              className="portal-sidebar-logo-img"
            />
          </div>
          <span className="portal-sidebar-badge">MÜŞTERİ PANELİ</span>
        </div>

        {/* User Balance & Info Card */}
        <div className="portal-user-box">
          <div className="portal-user-row">
            <span className="portal-user-name">{user?.name || 'Kullanıcı'}</span>
            <span className="portal-user-tier">
              {user?.tier || 'Standart Üye'}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            Müşteri No: {user?.customerId || 'NQ-84920'}
          </div>

          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mevcut Kredi Bakiyesi</div>
            <div className="portal-user-balance">
              ${(user?.balance || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </div>
            <button 
              className="btn btn-portal btn-sm portal-sidebar-btn" 
              style={{ marginTop: '0.5rem' }}
              onClick={onOpenAddBalance}
            >
              <Wallet size={12} />
              <span>Bakiye Yükle</span>
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="portal-nav">
          {navItems.map(item => (
            <div
              key={item.id}
              className={`portal-nav-item ${currentTab === item.id ? 'active' : ''}`}
              onClick={() => onNavigateTab(item.id, item.path)}
            >
              <span className="portal-nav-icon">{item.icon}</span>
              <span className="portal-nav-label">{item.label}</span>
              {item.badge !== undefined && item.badge !== null && (
                <span 
                  className="portal-nav-badge" 
                  style={{ background: item.badgeColor || 'var(--accent-blue)' }}
                  title={item.badgeTitle || undefined}
                >
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </nav>

        <div className="portal-sidebar-foot">
          <button 
            type="button"
            className="portal-sidebar-btn portal-sidebar-btn-primary" 
            onClick={onOpenNewServer}
          >
            <PlusCircle size={15} />
            <span>Yeni Sunucu Kirala</span>
          </button>
          <button 
            type="button"
            className="portal-sidebar-btn portal-sidebar-btn-ghost" 
            onClick={onReturnToPublic}
            title="Ana web sitesine geri dön"
          >
            <ArrowLeft size={15} />
            <span>Ana Siteye Dön</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div className="portal-main">
        {/* Top bar */}
        <header className="portal-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {currentTab === 'dashboard' && 'Kontrol Paneli Genel Bakış'}
              {currentTab === 'servers' && 'Sunucu Yönetimi & Sanal Sunucular'}
              {currentTab === 'orders' && 'Siparişler & Kurulum Onay Takibi'}
              {currentTab === 'tickets' && 'Müşteri Destek & Ticket Sistemi'}
              {currentTab === 'invoices' && 'Faturalar & Finansal İşlemler'}
              {currentTab === 'security' && 'Üyelik Profili & Hesap Güvenliği'}
              {currentTab === 'checkout' && 'Güvenli Sipariş Tamamlama & Checkout'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Direct Return to Site Button */}
            <button 
              className="btn btn-secondary btn-sm"
              onClick={onReturnToPublic}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', gap: '0.4rem' }}
              title="Ana web sitesini ziyaret et"
            >
              <Globe size={14} />
              <span>Ana Web Sitesi</span>
            </button>

            {/* Vercel Postgres & Blob Status Indicator */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.45rem', 
                fontSize: '0.8rem', 
                color: 'var(--accent-cyan)', 
                background: 'rgba(0,210,255,0.08)', 
                border: '1px solid rgba(0,210,255,0.25)', 
                padding: '0.35rem 0.75rem', 
                borderRadius: '8px' 
              }}
              title="Vercel Postgres (Neon) veritabanı ve Vercel Blob depolama aktif"
            >
              <Database size={13} color="var(--accent-cyan)" />
              <span>Vercel Postgres & Blob: Canlı</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '0.35rem 0.75rem', borderRadius: '8px' }}>
              <span className="pulse-online"></span>
              <span>Frankfurt, HK & Paris Aktif</span>
            </div>

            <button 
              className="btn btn-secondary btn-sm" 
              style={{ borderRadius: '8px', padding: '0.5rem' }}
              onClick={() => alert('Sistemde bekleyen 1 adet okunmamış bildiriminiz var: "ORD-2026-9041 numaralı sunucunuz kurulum onayı bekliyor."')}
              title="Bildirimler"
            >
              <Bell size={16} />
            </button>

            <button 
              className="btn btn-secondary btn-sm" 
              style={{ borderRadius: '8px', padding: '0.5rem', color: '#ef4444' }}
              onClick={onLogout}
              title="Oturumu Kapat"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Content View is injected here */}
        {children}
      </div>
    </div>
  );
}
