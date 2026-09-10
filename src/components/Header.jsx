import React, { useState, useEffect, useRef } from 'react';
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Zap, 
  Globe, 
  ChevronDown, 
  ShoppingCart, 
  User, 
  LogIn, 
  ArrowRight, 
  Building2, 
  FileText, 
  ShieldCheck, 
  Lock, 
  BookOpen, 
  Cookie, 
  Phone, 
  Menu, 
  X,
  Sparkles,
  Activity
} from 'lucide-react';

export default function Header({ 
  user,
  cartCount = 0,
  currentPage = 'home',
  onNavigate,
  onOpenCart,
  onOpenAuth,
  onOpenPortal, 
  onOpenConfigurator 
}) {
  const [vdsDropdownOpen, setVdsDropdownOpen] = useState(false);
  const [corporateDropdownOpen, setCorporateDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const vdsRef = useRef(null);
  const corpRef = useRef(null);
  const vdsTimeoutRef = useRef(null);
  const corpTimeoutRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (vdsRef.current && !vdsRef.current.contains(event.target)) {
        setVdsDropdownOpen(false);
      }
      if (corpRef.current && !corpRef.current.contains(event.target)) {
        setCorporateDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (vdsTimeoutRef.current) clearTimeout(vdsTimeoutRef.current);
      if (corpTimeoutRef.current) clearTimeout(corpTimeoutRef.current);
    };
  }, []);

  // Smooth debounced hover handlers to prevent closing while mouse travels
  const handleVdsEnter = () => {
    if (vdsTimeoutRef.current) clearTimeout(vdsTimeoutRef.current);
    setVdsDropdownOpen(true);
  };

  const handleVdsLeave = () => {
    if (vdsTimeoutRef.current) clearTimeout(vdsTimeoutRef.current);
    vdsTimeoutRef.current = setTimeout(() => {
      setVdsDropdownOpen(false);
    }, 250);
  };

  const handleVdsToggle = (e) => {
    e.preventDefault();
    if (vdsTimeoutRef.current) clearTimeout(vdsTimeoutRef.current);
    setVdsDropdownOpen(prev => !prev);
  };

  const handleCorpEnter = () => {
    if (corpTimeoutRef.current) clearTimeout(corpTimeoutRef.current);
    setCorporateDropdownOpen(true);
  };

  const handleCorpLeave = () => {
    if (corpTimeoutRef.current) clearTimeout(corpTimeoutRef.current);
    corpTimeoutRef.current = setTimeout(() => {
      setCorporateDropdownOpen(false);
    }, 250);
  };

  const handleCorpToggle = (e) => {
    e.preventDefault();
    if (corpTimeoutRef.current) clearTimeout(corpTimeoutRef.current);
    setCorporateDropdownOpen(prev => !prev);
  };

  const handleNavClick = (pageId, e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (vdsTimeoutRef.current) clearTimeout(vdsTimeoutRef.current);
    if (corpTimeoutRef.current) clearTimeout(corpTimeoutRef.current);
    setVdsDropdownOpen(false);
    setCorporateDropdownOpen(false);
    setMobileMenuOpen(false);
    if (onNavigate) onNavigate(pageId, e);
  };

  return (
    <>
      {/* Top corporate notice bar */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-bar-left">
            <span className="top-tag">2026 YENİ NESİL ALTYAPI</span>
            <span className="top-headline-text">Almanya, Hong Kong & Fransa Lokasyonlarında 10 Gbps NVMe NovaQ Servers Altyapısı</span>
          </div>
          <div className="top-bar-right">
            <a 
              href="/veri-merkezleri.html"
              className="top-link" 
              onClick={(e) => handleNavClick('datacenters', e)} 
              title="Canlı Ping ve Durum Testi"
              style={{ textDecoration: 'none' }}
            >
              <span className="pulse-online"></span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>Tüm Veri Merkezleri Operasyonel (%99.99 Uptime)</span>
            </a>
            <div className="top-link" style={{ cursor: 'default' }}>
              <Globe size={14} />
              <span>Para Birimi: <strong>$ USD</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="site-header">
        <div className="container header-inner">
          {/* Logo */}
          <div className="header-logo-area">
            <a 
              href="/" 
              className="brand-logo-wrap" 
              onClick={(e) => handleNavClick('home', e)}
              title="NovaQ Servers Anasayfa"
            >
              <img 
                src="/assets/novaq-logo.png" 
                alt="NovaQ Servers" 
                className="brand-logo-img" 
              />
            </a>
          </div>

          {/* Desktop Nav & Utility Column */}
          <div className="header-nav-column desktop-only">
            {/* Upper Tier: Cart & Auth/Panel left-aligned directly above the menu */}
            <div className="header-utility-row">
              {/* Shopping Cart Button */}
              <button 
                className="btn-utility cart-utility-btn"
                onClick={onOpenCart}
                title="Alışveriş Sepeti"
              >
                <ShoppingCart size={13} />
                <span>Sepet</span>
                {cartCount > 0 && (
                  <span className="cart-badge-pill">
                    {cartCount}
                  </span>
                )}
              </button>

              <span className="utility-divider">•</span>

              {/* Auth / Client Portal Buttons */}
              {user && user.isLoggedIn ? (
                <button 
                  className="btn-utility portal-utility-btn"
                  onClick={onOpenPortal}
                  title="Müşteri Yönetim ve Sunucu Kontrol Paneli"
                >
                  <User size={13} />
                  <span>Müşteri Paneli ({user.name ? user.name.split(' ')[0] : 'Kullanıcı'})</span>
                </button>
              ) : (
                <div className="utility-auth-group">
                  <button 
                    className="btn-utility auth-login-btn"
                    onClick={onOpenPortal}
                    title="Müşteri Yönetim Paneline Giriş Yap"
                  >
                    <User size={13} />
                    <span>Müşteri Paneli</span>
                  </button>
                  <span className="utility-divider">/</span>
                  <button 
                    className="btn-utility auth-register-btn"
                    onClick={() => onOpenAuth('register')}
                    title="Yeni Müşteri Hesabı Oluştur"
                  >
                    <span>Kayıt Ol</span>
                  </button>
                </div>
              )}
            </div>

            {/* Desktop Navigation Menu */}
            <nav className="main-nav desktop-nav">
              {/* Sanal Sunucular Dropdown */}
              <div 
                className={`nav-dropdown-item ${vdsDropdownOpen ? 'open' : ''}`}
                ref={vdsRef}
                onMouseEnter={handleVdsEnter}
                onMouseLeave={handleVdsLeave}
              >
                <button 
                  type="button"
                  className={`nav-link dropdown-toggle ${currentPage === 'vds' ? 'active' : ''}`}
                  onClick={handleVdsToggle}
                >
                  <Server size={15} />
                  <span>Sanal Sunucular</span>
                  <ChevronDown size={14} className={`caret ${vdsDropdownOpen ? 'rotate' : ''}`} />
                </button>

                {vdsDropdownOpen && (
                  <div 
                    className="dropdown-menu-wrapper"
                    onMouseEnter={handleVdsEnter}
                    onMouseLeave={handleVdsLeave}
                  >
                    <div className="dropdown-menu">
                      <div className="dropdown-menu-inner">
                        <a 
                          href="/sanal-sunucu.html" 
                          className="dropdown-link" 
                          onClick={(e) => handleNavClick('vds', e)}
                        >
                          <div className="dd-icon"><Server size={18} color="var(--accent-cyan)" /></div>
                          <div className="dd-text">
                            <strong>NVMe Bulut VDS</strong>
                            <span>Intel Xeon & AMD EPYC paylaşımsız kaynaklar</span>
                          </div>
                        </a>

                        <a 
                          href="/extreme-sunucu.html" 
                          className="dropdown-link" 
                          onClick={(e) => handleNavClick('extreme', e)}
                        >
                          <div className="dd-icon"><Zap size={18} color="#f59e0b" /></div>
                          <div className="dd-text">
                            <strong>Extreme Ryzen 9 VDS</strong>
                            <span>5.7 GHz Boost, Samsung PM9A3 7400 MB/s NVMe</span>
                          </div>
                        </a>

                        <div className="dropdown-divider"></div>

                        <a 
                          href="/sanal-sunucu.html" 
                          className="dropdown-footer-link"
                          onClick={(e) => handleNavClick('vds', e)}
                        >
                          <span>Tüm Sanal Sunucu Paketlerini Gör</span>
                          <ArrowRight size={13} />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Fiziksel Sunucular */}
              <a 
                href="/fiziksel-sunucu.html" 
                className={`nav-link ${currentPage === 'dedicated' ? 'active' : ''}`}
                onClick={(e) => handleNavClick('dedicated', e)}
              >
                <HardDrive size={15} />
                <span>Fiziksel Sunucular</span>
              </a>

              {/* Ekran Kartlı Sunucular */}
              <a 
                href="/ekran-kartli-sunucu.html" 
                className={`nav-link ${currentPage === 'gpu' ? 'active' : ''}`}
                onClick={(e) => handleNavClick('gpu', e)}
              >
                <Cpu size={15} />
                <span>Ekran Kartlı Sunucular</span>
                <span className="nav-badge-ai">AI & GPU</span>
              </a>

              {/* Veri Merkezleri */}
              <a 
                href="/veri-merkezleri.html" 
                className={`nav-link ${currentPage === 'datacenters' ? 'active' : ''}`}
                onClick={(e) => handleNavClick('datacenters', e)}
              >
                <Globe size={15} />
                <span>Veri Merkezleri</span>
              </a>

              {/* Kurumsal Dropdown */}
              <div 
                className={`nav-dropdown-item ${corporateDropdownOpen ? 'open' : ''}`}
                ref={corpRef}
                onMouseEnter={handleCorpEnter}
                onMouseLeave={handleCorpLeave}
              >
                <button 
                  type="button"
                  className={`nav-link dropdown-toggle ${['about', 'contact', 'terms', 'privacy', 'kvkk', 'cookies'].includes(currentPage) ? 'active' : ''}`}
                  onClick={handleCorpToggle}
                >
                  <Building2 size={15} />
                  <span>Kurumsal</span>
                  <ChevronDown size={14} className={`caret ${corporateDropdownOpen ? 'rotate' : ''}`} />
                </button>

                {corporateDropdownOpen && (
                  <div 
                    className="dropdown-menu-wrapper dropdown-align-right"
                    onMouseEnter={handleCorpEnter}
                    onMouseLeave={handleCorpLeave}
                  >
                    <div className="dropdown-menu corporate-dropdown">
                      <div className="dropdown-menu-inner">
                        <div className="dd-section-title">Şirket & İletişim</div>
                        <a 
                          href="/hakkimizda.html" 
                          className="dropdown-link" 
                          onClick={(e) => handleNavClick('about', e)}
                        >
                          <div className="dd-icon"><Building2 size={16} color="var(--accent-cyan)" /></div>
                          <div className="dd-text">
                            <strong>Hakkımızda</strong>
                            <span>NovaQ Servers vizyonu, altyapısı ve standartları</span>
                          </div>
                        </a>

                        <a 
                          href="/iletisim.html" 
                          className="dropdown-link" 
                          onClick={(e) => handleNavClick('contact', e)}
                        >
                          <div className="dd-icon"><Phone size={16} color="var(--accent-cyan)" /></div>
                          <div className="dd-text">
                            <strong>İletişim & Ofislerimiz</strong>
                            <span>7/24 NOC destek hattı, kurumsal teklif formu</span>
                          </div>
                        </a>

                        <div className="dropdown-divider"></div>
                        <div className="dd-section-title">Yasal Mevzuat & Sözleşmeler</div>

                        <a 
                          href="/hizmet-sozlesmesi.html" 
                          className="dropdown-link sub-link" 
                          onClick={(e) => handleNavClick('terms', e)}
                        >
                          <FileText size={15} color="#94a3b8" />
                          <span>Hizmet Sözleşmesi & SLA (%99.99)</span>
                        </a>

                        <a 
                          href="/gizlilik-politikasi.html" 
                          className="dropdown-link sub-link" 
                          onClick={(e) => handleNavClick('privacy', e)}
                        >
                          <ShieldCheck size={15} color="#94a3b8" />
                          <span>Gizlilik Politikası</span>
                        </a>

                        <a 
                          href="/kvkk-aydinlatma-metni.html" 
                          className="dropdown-link sub-link" 
                          onClick={(e) => handleNavClick('kvkk', e)}
                        >
                          <BookOpen size={15} color="#94a3b8" />
                          <span>KVKK Aydınlatma Metni</span>
                        </a>

                        <a 
                          href="/cerez-politikasi.html" 
                          className="dropdown-link sub-link" 
                          onClick={(e) => handleNavClick('cookies', e)}
                        >
                          <Cookie size={15} color="#94a3b8" />
                          <span>Yasal Çerez Kullanımı</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Mobile Header Actions */}
          <div className="header-mobile-actions mobile-only">
            {/* Shopping Cart Button */}
            <button 
              className="btn btn-secondary btn-sm cart-btn"
              onClick={onOpenCart}
              title="Alışveriş Sepeti"
            >
              <ShoppingCart size={16} />
              {cartCount > 0 && (
                <span className="cart-badge-pill">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button 
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menüyü Aç/Kapat"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <img 
                src="/assets/novaq-logo.png" 
                alt="NovaQ Servers" 
                style={{ height: '38px' }} 
              />
              <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)}>
                <X size={22} />
              </button>
            </div>

            {/* Mobile Quick Auth Bar */}
            <div className="mobile-auth-bar" style={{ padding: '0.85rem 1.25rem', background: 'rgba(15,23,42,0.6)', borderBottom: '1px solid var(--border-subtle)' }}>
              {user && user.isLoggedIn ? (
                <button 
                  className="btn btn-portal btn-block btn-sm"
                  onClick={() => { setMobileMenuOpen(false); onOpenPortal(); }}
                >
                  <User size={15} />
                  <span>Müşteri Paneli ({user.name ? user.name.split(' ')[0] : 'Kullanıcı'})</span>
                </button>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => { setMobileMenuOpen(false); onOpenPortal(); }}
                  >
                    <User size={14} />
                    <span>Müşteri Paneli</span>
                  </button>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => { setMobileMenuOpen(false); onOpenAuth('register'); }}
                  >
                    <span>Kayıt Ol</span>
                  </button>
                </div>
              )}
            </div>

            <div className="mobile-nav-list">
              <div className="mobile-nav-heading">SUNUCU ÇÖZÜMLERİ</div>
              <div className="mobile-nav-item" onClick={() => handleNavClick('vds')}>
                <Server size={18} color="var(--accent-cyan)" />
                <span>NVMe Bulut VDS</span>
              </div>
              <div className="mobile-nav-item" onClick={() => handleNavClick('extreme')}>
                <Zap size={18} color="#f59e0b" />
                <span>Extreme Ryzen 9 VDS (5.7 GHz)</span>
              </div>
              <div className="mobile-nav-item" onClick={() => handleNavClick('dedicated')}>
                <HardDrive size={18} color="#10b981" />
                <span>Fiziksel Dedicated Sunucular</span>
              </div>
              <div className="mobile-nav-item" onClick={() => handleNavClick('gpu')}>
                <Cpu size={18} color="#a855f7" />
                <span>Ekran Kartlı Sunucular (GPU Cloud)</span>
              </div>
              <div className="mobile-nav-item" onClick={() => handleNavClick('datacenters')}>
                <Globe size={18} color="var(--accent-cyan)" />
                <span>Veri Merkezlerimiz & Canlı Ping</span>
              </div>

              <div className="mobile-nav-heading" style={{ marginTop: '1.5rem' }}>KURUMSAL & DESTEK</div>
              <div className="mobile-nav-item" onClick={() => handleNavClick('about')}>
                <Building2 size={18} />
                <span>Hakkımızda</span>
              </div>
              <div className="mobile-nav-item" onClick={() => handleNavClick('contact')}>
                <Phone size={18} />
                <span>İletişim & Ofislerimiz</span>
              </div>

              <div className="mobile-nav-heading" style={{ marginTop: '1.5rem' }}>YASAL & SÖZLEŞMELER</div>
              <div className="mobile-nav-item sub" onClick={() => handleNavClick('terms')}>
                <FileText size={16} />
                <span>Hizmet Sözleşmesi & SLA (%99.99)</span>
              </div>
              <div className="mobile-nav-item sub" onClick={() => handleNavClick('privacy')}>
                <ShieldCheck size={16} />
                <span>Gizlilik Politikası</span>
              </div>
              <div className="mobile-nav-item sub" onClick={() => handleNavClick('kvkk')}>
                <BookOpen size={16} />
                <span>KVKK Aydınlatma Metni</span>
              </div>
              <div className="mobile-nav-item sub" onClick={() => handleNavClick('cookies')}>
                <Cookie size={16} />
                <span>Yasal Çerez Kullanımı</span>
              </div>
            </div>

            <div className="mobile-drawer-footer">
              <button 
                className="btn btn-primary btn-block"
                onClick={() => { setMobileMenuOpen(false); onOpenConfigurator(null); }}
              >
                <span>Hemen Sunucu Kirala</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
