import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Server, 
  FileText, 
  CreditCard, 
  LifeBuoy, 
  History, 
  ShieldCheck, 
  LogOut, 
  Globe, 
  ExternalLink, 
  Bell, 
  User, 
  Activity, 
  Search,
  ChevronRight,
  Shield,
  Database,
  UploadCloud
} from 'lucide-react';
import './admin-ui.css';

export default function AdminLayout({ 
  currentPath, 
  onNavigate, 
  adminUser, 
  pendingOrdersCount = 0, 
  unreadTicketsCount = 0, 
  unpaidInvoicesCount = 0,
  onLogout, 
  children 
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/yonetici/dashboard' },
    { id: 'customers', label: 'Müşteriler', icon: <Users size={18} />, path: '/yonetici/musteriler' },
    { 
      id: 'orders', 
      label: 'Siparişler', 
      icon: <ShoppingBag size={18} />, 
      path: '/yonetici/siparisler',
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : null,
      badgeColor: '#f59e0b'
    },
    { id: 'products', label: 'Ürünler / Paketler', icon: <Server size={18} />, path: '/yonetici/urunler' },
    { 
      id: 'invoices', 
      label: 'Faturalar', 
      icon: <FileText size={18} />, 
      path: '/yonetici/faturalar',
      badge: unpaidInvoicesCount > 0 ? `${unpaidInvoicesCount}` : null,
      badgeColor: '#ef4444'
    },
    { id: 'payments', label: 'Ödemeler', icon: <CreditCard size={18} />, path: '/yonetici/odemeler' },
    { 
      id: 'tickets', 
      label: 'Destek Talepleri', 
      icon: <LifeBuoy size={18} />, 
      path: '/yonetici/ticketlar',
      badge: unreadTicketsCount > 0 ? `${unreadTicketsCount}` : null,
      badgeColor: '#00d2ff'
    },
    { id: 'audit', label: 'İşlem Geçmişi', icon: <History size={18} />, path: '/yonetici/islem-gecmisi' },
    { id: 'profile', label: 'Yönetici Profili', icon: <ShieldCheck size={18} />, path: '/yonetici/profil' }
  ];

  const normalizedPath = (!currentPath || currentPath === '/yonetici.html' || currentPath === '/yonetici' || currentPath === '/yonetici/')
    ? '/yonetici/dashboard'
    : currentPath;

  // Helper to determine active tab based on current path
  const isActive = (itemPath) => {
    if (itemPath === '/yonetici/dashboard' && (normalizedPath === '/yonetici' || normalizedPath === '/yonetici/dashboard')) return true;
    return normalizedPath.startsWith(itemPath);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050811', color: '#e2e8f0', fontFamily: 'var(--font-sans)' }}>
      {/* LEFT SIDEBAR */}
      <aside style={{
        width: '260px',
        background: '#090d19',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50
      }}>
        {/* Brand Header */}
        <div style={{
          padding: '1.25rem 1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
            onClick={() => onNavigate('/yonetici/dashboard')}
          >
            <img 
              src="/assets/novaq-logo.png" 
              alt="NovaQ Servers" 
              style={{ height: '34px' }} 
            />
          </div>
          <span style={{
            fontSize: '0.65rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: '#ffffff',
            padding: '0.2rem 0.5rem',
            borderRadius: '6px',
            letterSpacing: '0.05em'
          }}>
            YÖNETİCİ
          </span>
        </div>

        {/* Current Admin Quick Card */}
        <div style={{
          margin: '0.85rem 1rem',
          padding: '0.85rem',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.2), rgba(30, 58, 138, 0.4))',
            border: '1px solid rgba(0, 210, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}>
            <Shield size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {adminUser?.fullName || 'Sistem Yöneticisi'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
              <span>Root Erişim (SuperAdmin)</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '0.5rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', padding: '0.5rem 0.6rem 0.25rem' }}>
            Yönetim Modülleri
          </div>
          {navItems.map(item => {
            const active = isActive(item.path);
            return (
              <div
                key={item.id}
                onClick={() => onNavigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: active ? 600 : 500,
                  color: active ? '#ffffff' : '#94a3b8',
                  background: active ? 'linear-gradient(90deg, rgba(0, 210, 255, 0.15) 0%, rgba(0, 210, 255, 0.03) 100%)' : 'transparent',
                  borderLeft: active ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: active ? 'var(--accent-cyan)' : '#94a3b8' }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    background: item.badgeColor,
                    color: '#090d18',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '10px'
                  }}>
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer Jump Links */}
        <div style={{
          padding: '0.85rem 1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate('/')}
            style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.78rem', padding: '0.45rem 0.65rem' }}
            title="Ana web sitesine git"
          >
            <Globe size={14} color="var(--accent-cyan)" />
            <span>Ana Web Sitesi</span>
          </button>
          
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate('/panel')}
            style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.78rem', padding: '0.45rem 0.65rem' }}
            title="Müşteri paneline git"
          >
            <ExternalLink size={14} color="#10b981" />
            <span>Müşteri Paneli</span>
          </button>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={onLogout}
            style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.78rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', padding: '0.45rem 0.65rem' }}
          >
            <LogOut size={14} />
            <span>Yönetici Oturumunu Kapat</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Bar */}
        <header style={{
          height: '64px',
          background: '#090d19',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
              <span style={{ cursor: 'pointer', color: 'var(--accent-cyan)' }} onClick={() => onNavigate('/yonetici/dashboard')}>Yönetici Paneli</span>
              <ChevronRight size={14} />
              <span style={{ color: '#ffffff', fontWeight: 600 }}>
                {normalizedPath.includes('musteriler') && 'Müşteri Yönetimi'}
                {normalizedPath.includes('urunler') && 'Ürün & Paket Yönetimi'}
                {normalizedPath.includes('siparisler') && 'Siparişler & Kurulum'}
                {normalizedPath.includes('faturalar') && 'Faturalandırma & Muhasebe'}
                {normalizedPath.includes('odemeler') && 'Finansal Hareketler & Ödemeler'}
                {normalizedPath.includes('ticketlar') && '7/24 Teknik Destek & NOC Biletleri'}
                {normalizedPath.includes('islem-gecmisi') && 'Yönetici İşlem Denetim Kayıtları'}
                {normalizedPath.includes('profil') && 'Yönetici Profil Ayarları'}
                {(normalizedPath === '/yonetici' || normalizedPath === '/yonetici/dashboard') && 'Genel Bakış & Metrikler'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Vercel Postgres Live Status */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.75rem',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                padding: '0.35rem 0.75rem',
                borderRadius: '20px'
              }}
              title="Vercel Postgres (Neon) Veritabanı Canlı"
            >
              <Database size={13} color="#34d399" />
              <span>Vercel Postgres: Canlı</span>
            </div>

            {/* Vercel Blob Status */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.75rem',
                background: 'rgba(0, 210, 255, 0.1)',
                border: '1px solid rgba(0, 210, 255, 0.3)',
                color: 'var(--accent-cyan)',
                padding: '0.35rem 0.75rem',
                borderRadius: '20px'
              }}
              title="Vercel Blob Nesne Depolama Aktif"
            >
              <UploadCloud size={13} color="var(--accent-cyan)" />
              <span>Vercel Blob: Aktif</span>
            </div>

            {/* Live Status Indicators */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#10b981',
              padding: '0.35rem 0.75rem',
              borderRadius: '20px'
            }}>
              <span className="pulse-online"></span>
              <span>NOC: Çevrimiçi</span>
            </div>

            {/* Notification Bell */}
            <button 
              className="btn btn-secondary btn-sm"
              style={{ position: 'relative', padding: '0.5rem', borderRadius: '8px' }}
              onClick={() => onNavigate('/yonetici/ticketlar')}
              title="Açık Destek Biletleri"
            >
              <Bell size={16} />
              {unreadTicketsCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {unreadTicketsCount}
                </span>
              )}
            </button>

            {/* Admin Avatar & Menu */}
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.35rem 0.65rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)' }}
              onClick={() => onNavigate('/yonetici/profil')}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--accent-cyan)',
                color: '#090d18',
                fontWeight: 800,
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                ADM
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>{adminUser?.username || 'admin'}</div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>SuperAdmin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Injected Main Content Area */}
        <main className="admin-ui" style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
