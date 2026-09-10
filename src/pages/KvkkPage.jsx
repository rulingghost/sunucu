import React from 'react';
import { BookOpen, ShieldCheck, CheckCircle2, Building, Mail, FileText, Award } from 'lucide-react';
import LegalLayout from '../components/LegalLayout';

export default function KvkkPage({ onNavigate, onOpenConfigurator }) {
  return (
    <LegalLayout
      currentDocId="kvkk"
      title={<>KVKK <span className="text-gradient">Aydınlatma Metni</span></>}
      subtitle="6698 Sayılı Kişisel Verilerin Korunması Kanunu uyarınca kişisel verilerinizin işlenmesine, saklanmasına ve yasal haklarınıza dair aydınlatma bildirimimizdir."
      onNavigate={onNavigate}
      onOpenConfigurator={onOpenConfigurator}
    >
      {/* Document Top Bar */}
      <div className="legal-doc-header">
        <div className="doc-meta-badge">
          <Award size={14} color="var(--accent-cyan)" />
          <span>KVKK 6698 UYUMLULUK BİLDİRİMİ</span>
        </div>
        <div className="doc-date">Yürürlük: 01 Ocak 2026</div>
      </div>

      <div className="legal-intro-box">
        <Building size={32} color="var(--accent-cyan)" className="intro-icon" />
        <div>
          <h4>Veri Sorumlusu Sıfatıyla Aydınlatma Beyanı</h4>
          <p>
            <strong>NovaQ Servers Teknoloji Anonim Şirketi</strong> ("NovaQ Servers") olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, veri sorumlusu sıfatıyla müşterilerimizin, web sitesi ziyaretçilerimizin ve temsilcilerimizin kişisel verilerini aşağıda açıklanan çerçevede işlemekteyiz.
          </p>
        </div>
      </div>

      <div className="legal-article">
        <h2>1. Veri Sorumlusunun Kurumsal Kimliği</h2>
        <div className="company-info-panel">
          <div className="company-info-row">
            <span>Şirket Unvanı:</span>
            <strong>NovaQ Servers Teknoloji Anonim Şirketi</strong>
          </div>
          <div className="company-info-row">
            <span>Genel Merkez Adresi:</span>
            <strong>Maslak Mahallesi, Büyükdere Caddesi No: 247, Sarıyer / İstanbul</strong>
          </div>
          <div className="company-info-row">
            <span>Mersis Numarası:</span>
            <strong>0632-0988-1240-0019</strong>
          </div>
          <div className="company-info-row">
            <span>Vergi Dairesi & No:</span>
            <strong>Maslak V.D. - 6320988124</strong>
          </div>
          <div className="company-info-row">
            <span>Kayıtlı E-Posta (KEP):</span>
            <strong>novaqservers@hs01.kep.tr</strong>
          </div>
          <div className="company-info-row">
            <span>KVKK İrtibat E-Postası:</span>
            <strong style={{ color: 'var(--accent-cyan)' }}>kvkk@novaqservers.com</strong>
          </div>
        </div>
      </div>

      <div className="legal-article">
        <h2>2. Kişisel Verilerin İşlenme Amaçları</h2>
        <p>Kişisel verileriniz aşağıdaki yasal ve operasyonel amaçlarla işlenmektedir:</p>
        <ul className="legal-list">
          <li>
            <CheckCircle2 size={16} color="var(--accent-cyan)" />
            <div>Sanal Bulut VDS, Dedicated Fiziksel Sunucu ve GPU kiralama sözleşmesinin kurulması ve ifası,</div>
          </li>
          <li>
            <CheckCircle2 size={16} color="var(--accent-cyan)" />
            <div>Sunucu kaynaklarının teknik olarak tahsis edilmesi, IP anonsu ve rDNS kayıtlarının yapılandırılması,</div>
          </li>
          <li>
            <CheckCircle2 size={16} color="var(--accent-cyan)" />
            <div>Vergi Usul Kanunu ve Türk Ticaret Kanunu uyarınca e-fatura düzenlenmesi ve muhasebesel kayıtların tutulması,</div>
          </li>
          <li>
            <CheckCircle2 size={16} color="var(--accent-cyan)" />
            <div>5651 sayılı "İnternet Ortamında Yapılan Yayınların Düzenlenmesi Hakkında Kanun" gereği erişim ve trafik loglarının mevzuata uygun tutulması,</div>
          </li>
          <li>
            <CheckCircle2 size={16} color="var(--accent-cyan)" />
            <div>Müşteri kontrol paneli giriş güvenliğinin sağlanması, şüpheli oturum açma denemelerinin engellenmesi.</div>
          </li>
        </ul>
      </div>

      <div className="legal-article">
        <h2>3. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h2>
        <p>
          Kişisel verileriniz; web sitemiz, üyelik ve kayıt formları, sipariş sepeti, müşteri destek biletleri ve NOC çağrı merkezi kanalları vasıtasıyla tamamen veya kısmen otomatik yollarla elektronik ortamda toplanmaktadır.
        </p>
        <p>
          Bu veriler, KVKK'nın 5. maddesinde yer alan; <em>"Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması kaydıyla sözleşmenin taraflarına ait kişisel verilerin işlenmesinin gerekli olması"</em>, <em>"Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması"</em> ve <em>"İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması"</em> hukuki sebeplerine dayanılarak işlenmektedir.
        </p>
      </div>

      <div className="legal-article">
        <h2>4. İlgili Kişinin KVKK 11. Madde Kapsamındaki Hakları</h2>
        <p>Veri sahibi olarak kanun kapsamında aşağıdaki haklarınızı serbestçe kullanabilirsiniz:</p>
        <ul className="legal-list">
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
          <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,</li>
          <li>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
          <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,</li>
          <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
          <li>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme.</li>
        </ul>

        <div className="legal-callout info">
          <strong>Başvuru Kanalı:</strong> KVKK kapsamındaki taleplerinizi yazılı ve ıslak imzalı olarak şirket merkezimize veya güvenli elektronik imzanızla <strong>kvkk@novaqservers.com</strong> adresine iletebilirsiniz. Başvurular azami 30 gün içinde yazılı olarak yanıtlanmaktadır.
        </div>
      </div>

      {/* Official Signoff Box */}
      <div className="legal-signoff-box">
        <div className="signoff-seal">
          <ShieldCheck size={36} color="var(--accent-cyan)" />
          <span>KVKK ONAYI</span>
        </div>
        <div className="signoff-details">
          <strong>NovaQ Servers Kişisel Verileri Koruma Komitesi</strong>
          <span>VERBİS Kayıt No: 2026-9948210</span>
          <small>Tüm veriler ISO 27001 ve GDPR uyumlu standartlarda saklanır.</small>
        </div>
      </div>
    </LegalLayout>
  );
}
