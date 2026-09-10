# NovaQ Servers — Vercel Postgres & Vercel Blob Kurulum ve Kullanım Rehberi

Bu rehber, projenizin verilerini tarayıcı hafızasından (`localStorage`) kurtarıp **Vercel Postgres** (ilişkisel veritabanı) ve **Vercel Blob** (dosya ve medya depolama) bulut sistemine nasıl bağlayacağınızı adım adım açıklar.

---

## 🚀 1 Dakikada Canlıya Alma Adımları (Vercel Dashboard)

### 1. Adım: Vercel Postgres Veritabanını Oluşturma
1. [Vercel Dashboard](https://vercel.com/dashboard) hesabınıza giriş yapın.
2. Üst menüden **Storage** sekmesine tıklayın.
3. **Create Database** butonuna basın ve **Postgres (Neon)** seçeneğini seçin.
4. Veritabanı adı olarak `novaq-db` yazın, bölgeyi **Frankfurt (fra1 / eu-central-1)** seçin ve **Create** butonuna tıklayın.
5. Açılan ekranda **Connect to Project** butonuna basarak `sunucu` projenizi seçin.
   - *Vercel projenize otomatik olarak `POSTGRES_URL`, `POSTGRES_PRISMA_URL` ve `DATABASE_URL` ortam değişkenlerini tanımlayacaktır.*

### 2. Adım: Vercel Blob Dosya Depolamasını Oluşturma
1. Yine **Storage** sekmesine gelin.
2. **Create Database / Storage** butonuna tıklayıp bu kez **Blob** seçeneğini seçin.
3. Ad olarak `novaq-blob` yazın ve **Create** butonuna basın.
4. **Connect to Project** diyerek projenizi bağlayın.
   - *Vercel projenize otomatik olarak `BLOB_READ_WRITE_TOKEN` ortam değişkenini tanımlayacaktır.*

---

## 💻 Yerel Geliştirme (Localhost / Bilgisayarınızda Çalıştırma)

Bilgisayarınızda test ederken canlı veritabanına bağlanmak için:
1. Vercel Storage sayfasında oluşturduğunuz Postgres veritabanına tıklayın -> **.env.local** sekmesine gelin.
2. Oradaki `POSTGRES_URL="..."` değerini kopyalayıp projenizin kök dizinindeki `.env` dosyasına yapıştırın.
3. Blob sayfasından `BLOB_READ_WRITE_TOKEN="..."` değerini kopyalayıp `.env` dosyasına yapıştırın.
4. Terminalde `npm run dev` komutunu çalıştırın.

> [!TIP]
> **Önemli Kolaylık:**
> Projenin `vite.config.js` dosyasına özel sunucusuz middleware eklendiği için, yerel ortamda `npm run dev` çalıştırdığınızda da `/api/*` uç noktaları Vercel gibi Node.js üzerinde çalışır. Vercel CLI kurmanıza gerek kalmadan test yapabilirsiniz.

---

## 🗄️ Veritabanı Tabloları ve Otomatik Tohumlama (Seed)

Sistem ilk API çağrısında tabloların varlığını kontrol eder. Tablolar henüz oluşmamışsa:
- Tabloları (`customers`, `servers`, `products`, `orders`, `invoices`, `payments`, `tickets`, `audit_logs`, `blob_files`) **otomatik olarak oluşturur**.
- Başlangıç demo verilerini (`Ahmet Yılmaz`, Frankfurt/HK/Paris sunucuları, paketler, biletler) **otomatik olarak PostgreSQL'e aktarır**.

İstediğiniz zaman Yönetici Paneli -> Dashboard üzerindeki **"Tohumla (Seed Data)"** veya **"Şimdi Eşitle (Sync)"** butonlarına basarak veritabanını tek tıkla yenileyebilirsiniz.

Doğrudan SQL çalıştırmak isterseniz proje kökündeki [database-schema.sql](file:///c:/Users/dell/Desktop/SUNUCU/database-schema.sql) dosyasını Vercel Postgres -> Query sekmesine yapıştırıp çalıştırabilirsiniz.

---

## 📦 Vercel Blob ile Neler Yapılabilir?

1. **Destek Biletleri (Tickets):**
   - Müşteri veya yönetici bilet ekranındaki **"Ek Yükle"** (ataç ikonu) butonuna basarak ekran görüntüsü, log dosyası veya doküman yükleyebilir.
   - Dosya Vercel Blob'a yüklenir ve mesajın altına kalıcı indirme linki olarak iliştirilir.

2. **Ödeme Dekontları (Billing & Invoices):**
   - Müşteri faturalar sekmesinde **"Dekont Yükle"** butonuna basarak banka havalesi dekontunu Vercel Blob'a yükleyebilir.
   - Fatura durumu otomatik olarak `Dekont İnceleniyor` durumuna geçer ve yönetici onayına sunulur.

---

## 🛠️ Sunucusuz API Uç Noktaları

| Uç Nokta | Metotlar | Açıklama |
|---|---|---|
| `/api/status` | GET | Postgres ve Blob bağlantı durumu ve tablo satır sayıları |
| `/api/init-db` | POST / DELETE | Tabloları oluşturur ve tohumlama verilerini yükler |
| `/api/customers` | GET, POST, PUT, DELETE | Müşteri yönetimi |
| `/api/servers` | GET, POST, PUT, DELETE | Sunucu yönetimi, güç işlemleri, snapshot |
| `/api/products` | GET, POST, PUT, DELETE | Ürün ve paket yönetimi |
| `/api/orders` | GET, POST, PUT | Sipariş oluşturma ve provizyon onayı |
| `/api/invoices` | GET, POST, PUT | Faturalandırma ve dekont bağlama |
| `/api/tickets` | GET, POST, PUT | Destek biletleri ve ekli mesajlaşma |
| `/api/upload` | POST | Vercel Blob dosya yükleme servisi |
| `/api/payments` | GET, POST | Finansal ödeme kayıtları |
| `/api/audit` | GET, POST | Yönetici işlem denetim günlüğü |
