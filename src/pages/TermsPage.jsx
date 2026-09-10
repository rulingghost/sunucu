import React from 'react';
import { FileText, ShieldCheck, CheckCircle2, AlertTriangle, Scale, Clock, Award } from 'lucide-react';
import LegalLayout from '../components/LegalLayout';

export default function TermsPage({ onNavigate, onOpenConfigurator }) {
  return (
    <LegalLayout
      currentDocId="terms"
      title={<>Hizmet Sözleşmesi <span className="text-gradient">& SLA Taahhüdü</span></>}
      subtitle="NovaQ Servers Teknoloji A.Ş. sunucu kiralama kuralları, %99.99 kesintisiz çalışma garantisi ve servis standartları."
      onNavigate={onNavigate}
      onOpenConfigurator={onOpenConfigurator}
    >
      {/* Document Top Bar */}
      <div className="legal-doc-header">
        <div className="doc-meta-badge">
          <Award size={14} color="var(--accent-cyan)" />
          <span>RESMİ SÖZLEŞME METNİ • SÜRÜM 2.4</span>
        </div>
        <div className="doc-date">Yürürlük Tarihi: 01 Ocak 2026</div>
      </div>

      <div className="legal-intro-box">
        <Scale size={32} color="var(--accent-cyan)" className="intro-icon" />
        <div>
          <h4>Kurumsal Hizmet Standartlarımız ve Taahhüdümüz</h4>
          <p>
            İşbu sözleşme, NovaQ Servers Teknoloji A.Ş. ("NovaQ Servers") tarafından sağlanan Sanal Bulut Sunucu (VDS), 
            Fiziksel Dedicated Sunucu ve GPU Sunucu kiralama hizmetlerinin kullanım şartlarını ve %99.99 Servis Seviyesi 
            Taahhüdünü (SLA) belirler. Platformumuz üzerinden sipariş veren veya üye olan her kullanıcı bu şartları peşinen kabul etmiş sayılır.
          </p>
        </div>
      </div>

      <div className="legal-article">
        <h2>Madde 1: Taraflar ve Sözleşmenin Konusu</h2>
        <p>
          İşbu sözleşme, merkezi Maslak / İstanbul adresinde bulunan <strong>NovaQ Servers Teknoloji Anonim Şirketi</strong> (bundan böyle "Hizmet Sağlayıcı" olarak anılacaktır) ile, NovaQ Servers web sitesi üzerinden üyelik oluşturan ve sunucu kiralama hizmeti satın alan gerçek veya tüzel kişi (bundan böyle "Müşteri" olarak anılacaktır) arasında akdedilmiştir.
        </p>
        
        <div className="legal-callout info">
          <strong>Önemli Kapsam Bildirimi:</strong> NovaQ Servers platformunda alan adı (domain) satışı, tescili veya transferi yapılmamaktadır. Hizmet kapsamı münhasıran Almanya, Hong Kong ve Fransa lokasyonlarındaki yüksek performanslı sunucu donanımı kiralama, internet bağlantısı ve 3.2 Tbps DDoS kalkanı tahsisinden ibarettir.
        </div>
      </div>

      <div className="legal-article">
        <h2>Madde 2: %99.99 Servis Seviyesi Anlaşması (SLA Taahhüdü)</h2>
        <p>
          Hizmet Sağlayıcı, kiralanan sunucuların omurga ağ erişilebilirliği ve veri merkezi enerji sürekliliği için takvim ayı bazında <strong>%99.99 kesintisiz çalışma (Uptime)</strong> taahhüt eder.
        </p>
        
        <div className="sla-table-wrap">
          <table className="sla-table">
            <thead>
              <tr>
                <th>Aylık Uptime Oranı</th>
                <th>Kesinti Durumu</th>
                <th>SLA Telafi Kredisi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>%99.99 ve üzeri</strong></td>
                <td>Normal Operasyon</td>
                <td>Standart</td>
              </tr>
              <tr>
                <td><strong>%99.00 - %99.98</strong></td>
                <td>Kritik Eşik Aşımı</td>
                <td>%10 Fatura İade Kredisi</td>
              </tr>
              <tr>
                <td><strong>%98.00 - %98.99</strong></td>
                <td>Hizmet Aksaklığı</td>
                <td>%25 Fatura İade Kredisi</td>
              </tr>
              <tr>
                <td><strong>%98.00 altı</strong></td>
                <td>Ağır Kusur</td>
                <td>%50 Fatura İade Kredisi</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ul className="legal-list">
          <li>
            <CheckCircle2 size={16} color="var(--accent-cyan)" />
            <div>
              <strong>Planlı Bakımlar:</strong> Altyapı iyileştirme çalışmaları en az 48 saat önceden e-posta ile duyurulur ve gece 02:00 - 06:00 saatleri arasında gerçekleştirilir. Bu bakımlar SLA kesinti süresine dahil edilmez.
            </div>
          </li>
          <li>
            <CheckCircle2 size={16} color="var(--accent-cyan)" />
            <div>
              <strong>Dedicated Donanım Değişim Garantisi:</strong> Fiziksel Dedicated sunucularda tespit edilen herhangi bir donanım arızası (disk, RAM, anakart, PSU vb.), arıza tespitinden itibaren azami <strong>120 dakika (2 saat)</strong> içerisinde yedek parça ile birebir değiştirilir.
            </div>
          </li>
          <li>
            <CheckCircle2 size={16} color="var(--accent-cyan)" />
            <div>
              <strong>SLA Kredisi Yükleme:</strong> Taahhüt edilen oranın altına düşülen aylarda, Müşterinin yazılı talebi doğrultusunda Müşteri Paneli bakiyesine SLA iade kredisi anında yüklenir.
            </div>
          </li>
        </ul>
      </div>

      <div className="legal-article">
        <h2>Madde 3: Kabul Edilebilir Kullanım Politikası (AUP)</h2>
        <p>
          NovaQ Servers altyapısı aşağıdaki yasadışı veya altyapıya zarar verici eylemler için kesinlikle kullanılamaz:
        </p>
        
        <div className="legal-callout warning">
          <div className="callout-header">
            <AlertTriangle size={18} color="#ef4444" />
            <strong>Yasaklanan Faaliyetler (Kesin Fesih Sebebi):</strong>
          </div>
          <ul className="alert-list">
            <li>İstenmeyen toplu ticari e-posta (SPAM / Bulk Mail) gönderimi,</li>
            <li>İzinsiz port tarama (port scanning), brute-force saldırıları veya botnet komuta merkezleri,</li>
            <li>Hizmet içi veya dışı DDoS/DoS saldırıları başlatma, IP spoofing veya flood araçları çalıştırma,</li>
            <li>Telif hakkı ihlali oluşturan korsan içerik dağıtımı, phishing, kötü amaçlı yazılım barındırma,</li>
            <li>T.C. kanunlarına ve uluslararası bilişim hukukuna göre suç teşkil eden her türlü materyalin barındırılması.</li>
          </ul>
        </div>
        <p>
          Bu tür faaliyetlerin tespiti durumunda NovaQ Servers, hizmeti derhal askıya alma ve ilgili adli makamlara bildirim yapma hakkını saklı tutar.
        </p>
      </div>

      <div className="legal-article">
        <h2>Madde 4: Faturalandırma, Ödeme ve İptal Şartları</h2>
        <p>
          Sunucu hizmetleri Müşteri tarafından seçilen faturalama dönemine göre (Aylık, 3 Aylık, 6 Aylık, Yıllık) peşin olarak tahsil edilir. Fiyatlara yasal %20 KDV oranı dahil edilir.
        </p>
        <p>
          Hizmet süresi dolmadan önce Müşteri Paneli üzerinden otomatik yenileme faturası oluşturulur. Fatura vadesi geçen sunucular 3 gün süreyle askıya alınır, 7. günün sonunda veri güvenliği amacıyla sistemden otomatik olarak silinir.
        </p>
      </div>

      {/* Official Signoff Box */}
      <div className="legal-signoff-box">
        <div className="signoff-seal">
          <ShieldCheck size={36} color="var(--accent-cyan)" />
          <span>RESMİ ONAY</span>
        </div>
        <div className="signoff-details">
          <strong>NovaQ Servers Teknoloji Anonim Şirketi</strong>
          <span>Yönetim Kurulu & Hukuk Müşavirliği</span>
          <small>Elektronik İmza ve Zaman Damgası ile Korunmaktadır</small>
        </div>
      </div>
    </LegalLayout>
  );
}
