# NovaQ Servers — Alt Sayfalar Kurumsal Tasarım ve Bütünlük Güncellemesi

Kullanıcı geri bildirimi doğrultusunda, alt sayfaların amatör ve ana sayfadan kopuk görünmesine neden olan eksik stil tanımları giderilmiş; tüm alt sayfalar ana sayfanın **premium siber koyu tema (dark mode)**, neon cam morfoloji (glassmorphism) ve kurumsal kimlik standartlarına kavuşturulmuştur.

---

## 1. Tespit Edilen Eksiklikler ve Çözümler

1. **Eksik CSS Tanımları Tamamlandı:**
   - Önceden oluşturulmuş `.subpage-hero`, `.subpage-breadcrumb`, `.subpage-title`, `.legal-doc-card`, `.about-grid`, `.about-stats-card`, `.contact-form-card`, `.vds-features-banner`, `.dc-deep-grid` gibi onlarca sınıf için `App.css` dosyasına zengin, modern ve responsive CSS kuralları eklendi.

2. **Birleşik Alt Sayfa Başlığı (`SubpageHeader.jsx`):**
   - Tüm alt sayfalara ortak, modern siber arka plan ışıklandırması (`.subpage-ambient-glow`), siber ızgara deseni (`.subpage-grid-overlay`), tıklanabilir ve hiyerarşik ekmek kırıntısı (`breadcrumb`) navigasyonu ve güven rozetleri (SLA %99.99, Voxility 3.2 Tbps, Lokasyonlar) eklendi.

3. **Birleşik Kurumsal Kapanış Banner'ı (`EnterpriseCtaBanner.jsx`):**
   - Ana sayfa ile alt sayfalar arasındaki kopukluğu tamamen ortadan kaldırmak için her alt sayfanın altına NovaQ Servers imza çağrı bloğu yerleştirildi:
     - 7/24 Aktif NOC Mühendisliği rozeti (Canlı yeşil sinyal)
     - Doğrudan sunucu yapılandırma ve iletişim butonları
     - 3.2 Tbps DDoS ve %99.99 Uptime kurumsal göstergeleri.

4. **Yasal Mevzuat Merkezi (`LegalLayout.jsx`):**
   - `Hizmet Sözleşmesi & SLA`, `Gizlilik Politikası`, `KVKK Aydınlatma` ve `Yasal Çerez Kullanımı` sayfaları amatör metin görünümünden çıkarılarak prestijli bir **Hukuk & Uyum Portalı** mimarisine dönüştürüldü:
     - **Sol Sabit Menü:** 4 yasal politika arasında tek tıkla geçiş sağlayan aktif göstergeli liste.
     - **Resmi Kurumsal Mühür:** NovaQ Servers Hukuk ve Uyum Departmanı Onay damgası.
     - **Yazdır / PDF İndir:** Tek tıkla resmi sözleşme çıktısı alma butonu.
     - **SLA Telafi Tablosu:** Kesinti oranlarına göre %10, %25 ve %50 fatura iade tablosu.

5. **Kurumsal Sayfalar (`Hakkımızda`, `İletişim`, `Veri Merkezleri`):**
   - **Hakkımızda:** Mühendislik vizyonu, çift sütunlu hikaye, ışıltılı yönetici alıntı kutusu, "Rakamlarla NovaQ Servers" canlı sayaç kartları (%99.99 SLA, 3.2 Tbps, 0.4ms latency) ve 4 temel ilke kartı.
   - **İletişim:** Mevcut müşteriler için acil destek bileti (ticket) yönlendirmesi, departman seçilebilir kurumsal teklif formu, Maslak Genel Merkez ve Frankfurt/Paris/Hong Kong veri merkezi operasyon kartları.
   - **Veri Merkezleri:** İnteraktif Looking Glass canlı ping simülatörü, tesis özellikleri (2N+1 yedeklilik, doğrudan peering noktaları DE-CIX/HKIX/France-IX) ve tek tıkla kopyalanabilir test IP'leri.

6. **Ürün Sayfaları (`Sanal Sunucu`, `Fiziksel Sunucu`, `Ekran Kartlı Sunucu`):**
   - NVMe VDS / Ryzen 9 5.7 GHz sekme geçişi,
   - Aylık / 3 Aylık (%10) / 6 Aylık (%18) / Yıllık (%25) indirim seçicileri,
   - Donanım detay kartları, kurumsal ayrıcalıklar paneli ve kategoriye özel Sıkça Sorulan Sorular (FAQ) akordiyonu.

---

## 2. Test ve Doğrulama

- **Vite Build (`npm run build`):** 11 adet bağımsız fiziksel HTML sayfası ve CSS dosyaları 0 hata ile 492 ms'de derlendi.
- **HTTP Durum Kodları:** Tüm `.html` uç noktaları (`/hakkimizda.html`, `/iletisim.html`, `/sanal-sunucu.html`, `/fiziksel-sunucu.html`, `/ekran-kartli-sunucu.html`, `/veri-merkezleri.html`, `/hizmet-sozlesmesi.html`) HTTP 200 OK ile sorunsuz yanıt vermektedir.
