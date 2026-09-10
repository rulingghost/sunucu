import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight,
  LifeBuoy,
  Building,
  CheckCircle2,
  Globe2,
  Radio,
  Server
} from 'lucide-react';
import SubpageHeader from '../components/SubpageHeader';
import EnterpriseCtaBanner from '../components/EnterpriseCtaBanner';

export default function ContactPage({ onNavigate, onOpenPortal, onOpenConfigurator, addToast }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: 'sales',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      if (addToast) addToast('Eksik Alanlar', 'Lütfen adınız, kurumsal e-posta adresiniz ve mesajınızı eksiksiz doldurunuz.', 'danger');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (addToast) {
        addToast('Mesajınız Alındı', 'NovaQ Servers kurumsal müşteri temsilcimiz talebinizi inceleyip en geç 30 dakika içerisinde dönüş yapacaktır.', 'success');
      }
    }, 600);
  };

  return (
    <div className="subpage-view contact-subpage-view">
      {/* Subpage Header */}
      <SubpageHeader 
        badge={{
          icon: <Phone size={14} />,
          text: '7/24 KESİNTİSİZ DESTEK & KURUMSAL SATIŞ'
        }}
        title={<>Bizimle <span className="text-gradient">İletişime Geçin</span></>}
        subtitle="Kurumsal sunucu kiralama, özel donanım yapılandırmaları, veri merkezi ziyaretleri veya toplu BGP/Transit talepleriniz için uzman ekibimiz 7/24 hazır."
        breadcrumbs={[
          { label: 'Kurumsal', pageId: 'about' },
          { label: 'İletişim & Ofislerimiz', active: true }
        ]}
        onNavigate={onNavigate}
        trustPills={[
          { icon: <Clock size={15} color="#10b981" />, text: 'Ortalama NOC Yanıt Süresi: 12 Dk' },
          { icon: <ShieldCheck size={15} color="var(--accent-cyan)" />, text: '7/24 Çağrı & Ticket Desteği' },
          { icon: <Globe2 size={15} color="#a855f7" />, text: 'Frankfurt • Hong Kong • Paris' }
        ]}
      />

      {/* Main Section */}
      <section className="section-padding">
        <div className="container">
          {/* Quick Notice for Registered Customers */}
          <div className="existing-customer-alert">
            <div className="alert-content">
              <div className="alert-icon-box">
                <LifeBuoy size={26} color="var(--accent-cyan)" />
              </div>
              <div>
                <h4>Mevcut Bir NovaQ Servers Müşterisi misiniz?</h4>
                <p>
                  Aktif sunucularınızla ilgili teknik arıza, donanım müdahalesi veya rDNS PTR talepleriniz için 
                  Müşteri Paneli üzerinden <strong>Destek Bileti (Ticket)</strong> açarak 15 dakikalık SLA süremizden faydalanabilirsiniz.
                </p>
              </div>
            </div>
            <button 
              type="button" 
              className="btn btn-portal btn-sm"
              onClick={() => onOpenPortal && onOpenPortal('tickets')}
            >
              <span>Destek Talebi Aç</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="contact-main-grid" style={{ marginTop: '3rem' }}>
            {/* Contact Form Card */}
            <div className="contact-form-card">
              <div className="card-top-header">
                <h3>Kurumsal İletişim & Teklif Formu</h3>
                <p>Projenizi anlatın, mühendislerimiz 30 dakika içinde size özel mimari planı hazırlasın.</p>
              </div>

              {isSubmitted ? (
                <div className="form-success-state">
                  <div className="success-icon-wrap">
                    <CheckCircle2 size={54} color="#10b981" />
                  </div>
                  <h3>Mesajınız Başarıyla İletildi!</h3>
                  <p>
                    Talebiniz ilgili departmanımıza aktarılmıştır. Belirttiğiniz <strong>{formData.email}</strong> adresi 
                    üzerinden en geç 30 dakika içerisinde resmi teklif ve bilgi paylaşılacaktır.
                  </p>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ fullName: '', email: '', phone: '', department: 'sales', message: '' });
                    }}
                  >
                    <span>Yeni Bir Mesaj Gönder</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group-row">
                    <div className="form-group">
                      <label>Adınız ve Soyadınız *</label>
                      <input 
                        type="text" 
                        placeholder="Örn: Mehmet Yılmaz"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Kurumsal E-Posta *</label>
                      <input 
                        type="email" 
                        placeholder="mehmet@sirketiniz.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label>Telefon Numarası</label>
                      <input 
                        type="tel" 
                        placeholder="+90 (5XX) XXX XX XX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>İlgili Departman</label>
                      <select 
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      >
                        <option value="sales">Kurumsal Satış & Özel Proje Teklifi</option>
                        <option value="dedicated">Dedicated / Bare-Metal Özel Donanım</option>
                        <option value="network">BGP, Voxility DDoS & Ağ Altyapısı</option>
                        <option value="billing">Muhasebe & Kurumsal Faturalama</option>
                        <option value="legal">Hukuk & KVKK / Mevzuat</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Mesajınız veya Sunucu İhtiyaçlarınız *</label>
                    <textarea 
                      rows={5}
                      placeholder="Projenizin vCPU, RAM, disk, lokasyon veya bant genişliği gereksinimlerini detaylandırabilirsiniz..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="form-action-bar">
                    <div className="form-privacy-note">
                      <ShieldCheck size={14} color="#10b981" />
                      <span>Bilgileriniz 256-bit SSL ile şifrelenir ve KVKK kapsamında korunur.</span>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span>Gönderiliyor...</span>
                      ) : (
                        <>
                          <span>Talebi İlet</span>
                          <Send size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Global NOC & Office Cards */}
            <div className="contact-sidebar-info">
              {/* General Headquarters */}
              <div className="hq-office-card">
                <div className="hq-badge">GENEL MERKEZ (NOC 1)</div>
                <h4>NovaQ Servers Teknoloji A.Ş.</h4>
                <p className="hq-address">
                  <MapPin size={16} color="var(--accent-cyan)" />
                  <span>Maslak Mahallesi, Büyükdere Caddesi No: 247, Sarıyer / İstanbul</span>
                </p>
                <div className="hq-contact-details">
                  <div className="hq-item">
                    <Phone size={15} color="#10b981" />
                    <span>+90 (212) 800 90 00 (Santral & Kurumsal)</span>
                  </div>
                  <div className="hq-item">
                    <Mail size={15} color="var(--accent-cyan)" />
                    <span>kurumsal@novaqservers.com</span>
                  </div>
                </div>
              </div>

              {/* 3 Datacenter NOC Operations */}
              <div className="datacenter-noc-list">
                <div className="dc-noc-card">
                  <div className="dc-noc-header">
                    <span className="dc-flag">🇩🇪</span>
                    <div>
                      <strong>Almanya (Frankfurt) NOC</strong>
                      <span>Equinix FR2 Kleyerstraße</span>
                    </div>
                    <span className="live-status-tag">7/24 AKTİF</span>
                  </div>
                  <div className="dc-noc-meta">
                    <span>IP Transit: DE-CIX, Lumen, Voxility</span>
                    <span>Acil NOC: frankfurt-noc@novaqservers.com</span>
                  </div>
                </div>

                <div className="dc-noc-card">
                  <div className="dc-noc-header">
                    <span className="dc-flag">🇭🇰</span>
                    <div>
                      <strong>Hong Kong NOC</strong>
                      <span>Equinix HK1 Mega-i TKO</span>
                    </div>
                    <span className="live-status-tag">7/24 AKTİF</span>
                  </div>
                  <div className="dc-noc-meta">
                    <span>IP Transit: HKIX, China Telecom (CN2), Telstra</span>
                    <span>Acil NOC: hk-noc@novaqservers.com</span>
                  </div>
                </div>

                <div className="dc-noc-card">
                  <div className="dc-noc-header">
                    <span className="dc-flag">🇫🇷</span>
                    <div>
                      <strong>Fransa (Paris) NOC</strong>
                      <span>OVH Campus / Interxion PAR7</span>
                    </div>
                    <span className="live-status-tag">7/24 AKTİF</span>
                  </div>
                  <div className="dc-noc-meta">
                    <span>IP Transit: France-IX, Cogent, Telia</span>
                    <span>Acil NOC: paris-noc@novaqservers.com</span>
                  </div>
                </div>
              </div>
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
