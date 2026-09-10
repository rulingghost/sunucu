import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  BookOpen, 
  Cookie, 
  Printer, 
  Building, 
  CheckCircle2, 
  ArrowRight,
  HelpCircle,
  Clock,
  Scale
} from 'lucide-react';
import SubpageHeader from './SubpageHeader';
import EnterpriseCtaBanner from './EnterpriseCtaBanner';

const LEGAL_DOCS = [
  {
    id: 'terms',
    label: 'Hizmet Sözleşmesi & SLA',
    path: '/hizmet-sozlesmesi.html',
    icon: <FileText size={16} />,
    desc: '%99.99 Uptime Taahhüdü ve Donanım Garantisi'
  },
  {
    id: 'privacy',
    label: 'Gizlilik Politikası',
    path: '/gizlilik-politikasi.html',
    icon: <ShieldCheck size={16} />,
    desc: 'Veri Dokunulmazlığı ve Şifreleme Standartları'
  },
  {
    id: 'kvkk',
    label: 'KVKK Aydınlatma Metni',
    path: '/kvkk-aydinlatma-metni.html',
    icon: <BookOpen size={16} />,
    desc: '6698 Sayılı Kanun Kapsamında Aydınlatma'
  },
  {
    id: 'cookies',
    label: 'Yasal Çerez Kullanımı',
    path: '/cerez-politikasi.html',
    icon: <Cookie size={16} />,
    desc: 'Oturum ve Güvenlik Çerezleri Yönetimi'
  }
];

export default function LegalLayout({ 
  currentDocId, 
  title, 
  subtitle, 
  onNavigate, 
  onOpenConfigurator,
  children 
}) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="subpage-view legal-subpage-view">
      {/* Unified Subpage Header */}
      <SubpageHeader 
        badge={{
          icon: <Scale size={14} />,
          text: 'YASAL MEVZUAT & KURUMSAL ŞARTLAR'
        }}
        title={title}
        subtitle={subtitle}
        breadcrumbs={[
          { label: 'Yasal Mevzuat', pageId: 'terms' },
          { label: LEGAL_DOCS.find(d => d.id === currentDocId)?.label || 'Yasal Belge', active: true }
        ]}
        onNavigate={onNavigate}
        trustPills={[
          { icon: <ShieldCheck size={15} color="#10b981" />, text: 'Resmi Tescilli & Yasal Altyapı' },
          { icon: <Clock size={15} color="var(--accent-cyan)" />, text: 'Son Güncelleme: 01 Ocak 2026' },
          { icon: <Building size={15} color="#a855f7" />, text: 'Mersis: 0632-0988-1240-0019' }
        ]}
      />

      {/* Main Legal Content Hub */}
      <section className="section-padding">
        <div className="container">
          <div className="legal-layout-grid">
            {/* Left Sticky Sidebar */}
            <aside className="legal-sidebar">
              <div className="legal-sidebar-sticky">
                <div className="sidebar-section-title">
                  <span>YASAL POLİTİKALAR</span>
                </div>

                <div className="legal-nav-menu">
                  {LEGAL_DOCS.map((doc) => {
                    const isActive = doc.id === currentDocId;
                    return (
                      <button
                        key={doc.id}
                        type="button"
                        className={`legal-nav-btn ${isActive ? 'active' : ''}`}
                        onClick={() => onNavigate && onNavigate(doc.id)}
                      >
                        <div className="legal-btn-icon">{doc.icon}</div>
                        <div className="legal-btn-text">
                          <strong>{doc.label}</strong>
                          <span>{doc.desc}</span>
                        </div>
                        {isActive && <div className="active-dot"></div>}
                      </button>
                    );
                  })}
                </div>

                {/* Print & Compliance Box */}
                <div className="legal-sidebar-card">
                  <div className="sidebar-card-header">
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm btn-block print-btn"
                      onClick={handlePrint}
                    >
                      <Printer size={15} />
                      <span>Bu Metni Yazdır / PDF</span>
                    </button>
                  </div>

                  <div className="legal-seal-box">
                    <div className="seal-badge">
                      <ShieldCheck size={20} color="#10b981" />
                    </div>
                    <div>
                      <strong>NovaQ Servers Hukuk Onaylı</strong>
                      <p>Mevzuat ve KVKK 6698 uyumluluk belgesi doğrulanmıştır.</p>
                    </div>
                  </div>

                  <div className="company-meta-list">
                    <div className="meta-row">
                      <span>Veri Sorumlusu:</span>
                      <strong>NovaQ Servers A.Ş.</strong>
                    </div>
                    <div className="meta-row">
                      <span>Sicil & Mersis:</span>
                      <strong>0632-0988-1240-0019</strong>
                    </div>
                    <div className="meta-row">
                      <span>Vergi Dairesi:</span>
                      <strong>Maslak V.D. 6320988124</strong>
                    </div>
                    <div className="meta-row">
                      <span>Hukuk İletişim:</span>
                      <strong style={{ color: 'var(--accent-cyan)' }}>hukuk@novaqservers.com</strong>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Main Article */}
            <main className="legal-content-area">
              <div className="legal-doc-card">
                {children}
              </div>
            </main>
          </div>
        </div>
      </section>

      {/* Global Pre-Footer CTA */}
      <EnterpriseCtaBanner 
        onNavigate={onNavigate} 
        onOpenConfigurator={onOpenConfigurator}
      />
    </div>
  );
}
