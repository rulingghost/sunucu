import React from 'react';
import { Shield, Lock, Eye, KeyRound, Server, CheckCircle2, Award, ShieldCheck } from 'lucide-react';
import LegalLayout from '../components/LegalLayout';

export default function PrivacyPage({ onNavigate, onOpenConfigurator }) {
  return (
    <LegalLayout
      currentDocId="privacy"
      title={<>Gizlilik <span className="text-gradient">Politikası & Veri Güvenliği</span></>}
      subtitle="NovaQ Servers olarak müşteri mahremiyetine, sunucu verilerinin dokunulmazlığına ve uluslararası siber güvenlik standartlarına azami derecede riayet ediyoruz."
      onNavigate={onNavigate}
      onOpenConfigurator={onOpenConfigurator}
    >
      {/* Document Top Bar */}
      <div className="legal-doc-header">
        <div className="doc-meta-badge">
          <Award size={14} color="#10b981" />
          <span>GİZLİLİK VE VERİ KORUMA TAAHHÜDÜ • 2026</span>
        </div>
        <div className="doc-date">Son Güncelleme: 01 Ocak 2026</div>
      </div>

      <div className="legal-intro-box">
        <Shield size={32} color="#10b981" className="intro-icon" />
        <div>
          <h4>Sıfır İhlal ve Tam Mahremiyet İlkesi</h4>
          <p>
            NovaQ Servers Teknoloji A.Ş., müşterilerimizin kimlik, iletişim, ödeme ve sunucu verilerini en güncel 
            şifreleme algoritmaları ve fiziksel güvenlik protokolleri ile korur. Sunucularınızdaki dosyalara 
            veya veritabanlarınıza izniniz olmadan hiçbir personelimizin erişim yetkisi bulunmaz.
          </p>
        </div>
      </div>

      <div className="legal-article">
        <h2>1. Toplanan Veri Kategorileri ve Kapsam</h2>
        <p>Hizmetlerimizden yararlanabilmeniz için işlenen temel bilgiler şunlardır:</p>
        <ul className="legal-list">
          <li>
            <CheckCircle2 size={16} color="var(--accent-cyan)" />
            <div>
              <strong>Kimlik ve İletişim Bilgileri:</strong> Ad, soyad, unvan, kurumsal e-posta adresi, cep telefonu numarası.
            </div>
          </li>
          <li>
            <CheckCircle2 size={16} color="var(--accent-cyan)" />
            <div>
              <strong>Fatura ve Vergi Bilgileri:</strong> Şirket unvanı, vergi dairesi, vergi kimlik numarası (VKN) veya T.C. kimlik numarası, yasal tebligat adresi.
            </div>
          </li>
          <li>
            <CheckCircle2 size={16} color="var(--accent-cyan)" />
            <div>
              <strong>İşlem ve Altyapı Kayıtları:</strong> Müşteri paneli giriş IP adresleri, sunucu güç yönetim işlemleri (Reboot, Reinstall), rDNS PTR talepleri ve destek bileti (ticket) mesajlaşmaları.
            </div>
          </li>
          <li>
            <CheckCircle2 size={16} color="var(--accent-cyan)" />
            <div>
              <strong>Ödeme Güvenlik Verileri:</strong> Kredi kartı numaraları sistemlerimizde ASLA saklanmaz. Ödemeler BDDK lisanslı 3D Secure güvenli ödeme geçitleri üzerinden tokenized olarak gerçekleşir.
            </div>
          </li>
        </ul>
      </div>

      <div className="legal-article">
        <h2>2. Sunucu Trafiği ve İçerik Dokunulmazlığı</h2>
        <p>
          NovaQ Servers, kiralanan sunucuların ağ trafiğindeki paket içeriklerini denetlemez, kaydetmez veya üçüncü taraflarla paylaşmaz. Altyapımızda çalışan <strong>Voxility 3.2 Tbps DDoS Koruma Sistemi</strong> yalnızca volumetric saldırı anormalliklerini filtrelemek amacıyla paket başlık (header) seviyesinde anlık analiz gerçekleştirir; kullanıcı dosyalarına ve verilerine müdahale etmez.
        </p>
      </div>

      <div className="legal-article">
        <h2>3. Çok Katmanlı Güvenlik Standartlarımız</h2>
        <p>Bilgi varlıklarınızın korunması için uygulanan kurumsal tedbirler:</p>
        
        <div className="security-badges-grid">
          <div className="sec-feature-card">
            <Lock size={20} color="var(--accent-cyan)" />
            <strong>TLS 1.3 & 256-Bit SSL</strong>
            <span>Web sitemiz ve kontrol panelimiz arasındaki tüm veri trafiği askeri düzeyde şifrelenir.</span>
          </div>

          <div className="sec-feature-card">
            <KeyRound size={20} color="#10b981" />
            <strong>2FA Çift Faktörlü Giriş</strong>
            <span>Google Authenticator ve donanımsal TOTP anahtarları ile hesap güvenliğiniz garanti altındadır.</span>
          </div>

          <div className="sec-feature-card">
            <Server size={20} color="#a855f7" />
            <strong>Tier-IV Biyometrik Koruma</strong>
            <span>Almanya, Hong Kong ve Fransa veri merkezlerimizde retina, parmak izi ve 7/24 CCTV güvenliği.</span>
          </div>
        </div>
      </div>

      <div className="legal-article">
        <h2>4. Bilgilerin Üçüncü Taraflarla Paylaşımı</h2>
        <p>
          Müşterilerimize ait kişisel veya ticari veriler hiçbir suretle reklam, pazarlama veya ticari kazanç amacıyla üçüncü şahıslara satılamaz, kiralanamaz veya devredilemez. Veriler yalnızca yetkili adli mercilerin resmi müzekkeresi ve yasal zorunluluklar çerçevesinde kanunlara uygun şekilde ilgili makamlara sunulabilir.
        </p>
      </div>

      {/* Official Signoff Box */}
      <div className="legal-signoff-box">
        <div className="signoff-seal">
          <ShieldCheck size={36} color="#10b981" />
          <span>GÜVENLİ VERİ</span>
        </div>
        <div className="signoff-details">
          <strong>NovaQ Servers Bilgi Güvenliği Kurulu</strong>
          <span>ISO 27001 & SOC-2 Tip II Uyumluluk Sertifikalı</span>
          <small>Sıfır Günlük Tutma (Zero Log) ve Güvenli Şifreleme</small>
        </div>
      </div>
    </LegalLayout>
  );
}
