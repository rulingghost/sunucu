import React from 'react';
import { Server, ShieldCheck, Mail, Phone, MapPin, ExternalLink, Heart, Lock, CheckCircle2 } from 'lucide-react';

export default function Footer({ onNavigate, onOpenPortal }) {
  const handleLink = (pageId, e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (onNavigate) onNavigate(pageId, e);
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-brand">
            <a href="/" className="brand-logo-wrap" onClick={(e) => handleLink('home', e)}>
              <img 
                src="/assets/novaq-logo.png" 
                alt="NovaQ Servers" 
                className="brand-logo-img" 
                style={{ height: '52px' }}
              />
            </a>
            <p>
              NovaQ Servers, kurumsal işletmeler, oyun sağlayıcıları ve yüksek trafikli platformlar için 
              Almanya, Hong Kong ve Fransa lokasyonlarında 10 Gbps NVMe ve Bare-Metal Dedicated sunucu 
              kiralama hizmeti sunan kurumsal altyapı sağlayıcısıdır.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', color: '#94a3b8', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={16} color="var(--accent-cyan)" />
                <span>Tier IV Veri Merkezleri</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Server size={16} color="#10b981" />
                <span>%99.99 SLA Uptime</span>
              </div>
            </div>
          </div>

          {/* Col 1: Sunucu Çözümleri */}
          <div className="footer-col">
            <h4>Sunucu Çözümleri</h4>
            <ul>
              <li>
                <a href="/sanal-sunucu.html" onClick={(e) => handleLink('vds', e)}>
                  NVMe Bulut VDS (Intel/EPYC)
                </a>
              </li>
              <li>
                <a href="/extreme-sunucu.html" onClick={(e) => handleLink('extreme', e)}>
                  Extreme Ryzen 9 VDS (5.7 GHz)
                </a>
              </li>
              <li>
                <a href="/fiziksel-sunucu.html" onClick={(e) => handleLink('dedicated', e)}>
                  Fiziksel Dedicated Sunucular
                </a>
              </li>
              <li>
                <a href="/ekran-kartli-sunucu.html" onClick={(e) => handleLink('gpu', e)}>
                  NVIDIA GPU & AI Sunucuları
                </a>
              </li>
              <li>
                <a href="/veri-merkezleri.html" onClick={(e) => handleLink('datacenters', e)}>
                  3.2 Tbps Voxility DDoS Kalkanı
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Kurumsal & Lokasyon */}
          <div className="footer-col">
            <h4>Kurumsal</h4>
            <ul>
              <li>
                <a href="/hakkimizda.html" onClick={(e) => handleLink('about', e)}>
                  Hakkımızda
                </a>
              </li>
              <li>
                <a href="/iletisim.html" onClick={(e) => handleLink('contact', e)}>
                  İletişim & Ofislerimiz
                </a>
              </li>
              <li>
                <a href="/veri-merkezleri.html" onClick={(e) => handleLink('datacenters', e)}>
                  Veri Merkezleri & Looking Glass
                </a>
              </li>
              <li>
                <a href="#status" onClick={(e) => { e.preventDefault(); alert('Sistem Durumu: Almanya (Frankfurt), Hong Kong ve Fransa (Paris) omurgaları %100 operasyoneldir.'); }}>
                  Canlı Sistem Durumu (%100)
                </a>
              </li>
              <li>
                <a href="/iletisim.html" onClick={(e) => handleLink('contact', e)}>
                  Kurumsal Satış & BGP Talepleri
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Yasal Mevzuat & Sözleşmeler */}
          <div className="footer-col">
            <h4>Yasal & Sözleşmeler</h4>
            <ul>
              <li>
                <a href="/hizmet-sozlesmesi.html" onClick={(e) => handleLink('terms', e)}>
                  Hizmet Sözleşmesi & SLA
                </a>
              </li>
              <li>
                <a href="/gizlilik-politikasi.html" onClick={(e) => handleLink('privacy', e)}>
                  Gizlilik Politikası
                </a>
              </li>
              <li>
                <a href="/kvkk-aydinlatma-metni.html" onClick={(e) => handleLink('kvkk', e)}>
                  KVKK Aydınlatma Metni
                </a>
              </li>
              <li>
                <a href="/cerez-politikasi.html" onClick={(e) => handleLink('cookies', e)}>
                  Yasal Çerez Kullanımı Politikası
                </a>
              </li>
              <li>
                <a href="/panel/invoices" onClick={(e) => { e.preventDefault(); onOpenPortal('invoices'); }}>
                  Müşteri Fatura & Ödeme Portalı
                </a>
              </li>
              <li>
                <a href="/yonetici/giris" onClick={(e) => handleLink('/yonetici/giris', e)}>
                  Yönetici Girişi
                </a>
              </li>
            </ul>
          </div>


        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div>
            © 2026 <strong>NovaQ Servers</strong> Teknoloji A.Ş. Tüm hakları saklıdır.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#94a3b8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Lock size={14} color="var(--accent-cyan)" />
              <span>256-Bit SSL Güvenli Altyapı</span>
            </div>
            <span>•</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>Equinix & OVH Tier-IV</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
