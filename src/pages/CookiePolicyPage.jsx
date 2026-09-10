import React from 'react';
import { Cookie, ShieldCheck, CheckCircle2, Settings, HelpCircle, Award } from 'lucide-react';
import LegalLayout from '../components/LegalLayout';

export default function CookiePolicyPage({ onNavigate, onOpenConfigurator }) {
  return (
    <LegalLayout
      currentDocId="cookies"
      title={<>Yasal Çerez <span className="text-gradient">Kullanımı Politikası</span></>}
      subtitle="NovaQ Servers web sitesinde güvenli oturum yönetimi, sepet optimizasyonu ve teknik altyapı performansı amacıyla kullanılan çerezlere dair detaylı bilgilendirmedir."
      onNavigate={onNavigate}
      onOpenConfigurator={onOpenConfigurator}
    >
      {/* Document Top Bar */}
      <div className="legal-doc-header">
        <div className="doc-meta-badge">
          <Award size={14} color="#f59e0b" />
          <span>ŞEFFAF ÇEREZ POLİTİKASI • 2026</span>
        </div>
        <div className="doc-date">Yürürlük: 01 Ocak 2026</div>
      </div>

      <div className="legal-intro-box">
        <Cookie size={32} color="#f59e0b" className="intro-icon" />
        <div>
          <h4>Sıfır Reklam Takibi & Güvenli Ziyaret Standardı</h4>
          <p>
            NovaQ Servers olarak web sitemizi ziyaret eden kullanıcılarımızın gizliliğine ve kişisel verilerinin korunmasına büyük önem vermekteyiz. Sitemizde üçüncü taraf pazarlama, casus izleme veya kullanıcıyı profilleme amaçlı reklam çerezleri <strong>KESİNLİKLE KULLANILMAMAKTADIR</strong>. Sadece sitenin ve müşteri kontrol panelinin güvenli çalışmasını sağlayan teknik çerezler yer alır.
          </p>
        </div>
      </div>

      <div className="legal-article">
        <h2>1. Çerez (Cookie) Nedir?</h2>
        <p>
          Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla bilgisayarınıza veya mobil cihazınıza kaydedilen küçük metin dosyalarıdır. Çerezler web sitesinin verimli çalışmasını, sepetinize eklediğiniz sunucu yapılandırmalarının hatırlanmasını ve müşteri paneli oturumunuzun güvenli bir şekilde sürdürülmesini sağlar.
        </p>
      </div>

      <div className="legal-article">
        <h2>2. Sitemizde Kullanılan Çerez Türleri ve Amaçları</h2>
        
        <div className="cookie-types-grid">
          <div className="cookie-type-card">
            <div className="ct-badge essential">Zorunlu Çerezler</div>
            <h4>Teknik & Güvenlik Çerezleri</h4>
            <p>
              Web sitesinin temel işlevleri için vazgeçilmezdir. Müşteri paneli giriş oturumunuzu (JWT token), CSRF korumasını ve sipariş sepetinizi korur. Bu çerezler devre dışı bırakılamaz.
            </p>
            <span className="ct-time">Kullanım Süresi: Oturum Süresince / 30 Gün</span>
          </div>

          <div className="cookie-type-card">
            <div className="ct-badge functional">Fonksiyonel</div>
            <h4>Tercih ve Özelleştirme Çerezleri</h4>
            <p>
              Para birimi seçiminizi ($ USD), sunucu yapılandırma tercihlerinizde seçtiğiniz işletim sistemi ve lokasyonu hatırlar; sonraki ziyaretinizde kolaylık sağlar.
            </p>
            <span className="ct-time">Kullanım Süresi: 1 Yıl</span>
          </div>

          <div className="cookie-type-card">
            <div className="ct-badge analytics">Performans</div>
            <h4>Looking Glass Ping & Ağ Çerezleri</h4>
            <p>
              Almanya, Hong Kong ve Fransa veri merkezlerimiz arasındaki Looking Glass canlı ping sürelerini ölçmek ve altyapı darboğazlarını tespit etmek için anonim olarak kullanılır.
            </p>
            <span className="ct-time">Kullanım Süresi: 90 Gün</span>
          </div>
        </div>
      </div>

      <div className="legal-article">
        <h2>3. Çerezlerin Kontrolü ve Tarayıcı Yönetimi</h2>
        <p>
          Çerezleri dilediğiniz zaman tarayıcınızın ayarlarından silebilir veya yeni çerezlerin kabulünü engelleyebilirsiniz. Ancak zorunlu teknik çerezleri devre dışı bırakmanız durumunda NovaQ Servers müşteri paneline giriş yapamayabilir veya sipariş tamamlama adımlarında teknik sorun yaşayabilirsiniz.
        </p>
        <p>
          Tarayıcınızda çerezleri yönetmek için aşağıdaki kılavuzları inceleyebilirsiniz:
        </p>
        <ul className="legal-list">
          <li><strong>Google Chrome:</strong> Ayarlar &gt; Gizlilik ve Güvenlik &gt; Çerezler ve Diğer Site Verileri</li>
          <li><strong>Mozilla Firefox:</strong> Seçenekler &gt; Gizlilik ve Güvenlik &gt; Çerezler ve Site Verileri</li>
          <li><strong>Apple Safari:</strong> Tercihler &gt; Gizlilik &gt; Tüm Çerezleri Engelle / Yönet</li>
          <li><strong>Microsoft Edge:</strong> Ayarlar &gt; Site İzinleri &gt; Çerezler ve Saklanan Veriler</li>
        </ul>
      </div>

      {/* Official Signoff Box */}
      <div className="legal-signoff-box">
        <div className="signoff-seal">
          <ShieldCheck size={36} color="#f59e0b" />
          <span>ONAYLANMIŞ</span>
        </div>
        <div className="signoff-details">
          <strong>NovaQ Servers Çerez Güvenlik Birimi</strong>
          <span>e-Gizlilik Direktifi (ePrivacy) ve KVKK Uyumlu</span>
          <small>Herhangi bir üçüncü taraf reklam ağıyla veri paylaşımı yapılmaz.</small>
        </div>
      </div>
    </LegalLayout>
  );
}
