# 🚀 NovaQ Servers — Supabase Kurulum ve Entegrasyon Rehberi

NovaQ Servers projenizin tüm backend altyapısı (Kimlik Doğrulama, Sunucu Yönetimi, Siparişler, Destek Biletleri, Faturalar ve Güvenlik Kayıtları) Supabase ile tam uyumlu hale getirilmiştir.

Aşağıdaki **3 basit adımı** takip ederek sisteminizi 2 dakikada canlı Supabase veritabanına bağlayabilirsiniz.

---

## 1. Adım: Supabase Projesi Oluşturun

1. [supabase.com](https://supabase.com) adresine gidin ve ücretsiz hesabınızla giriş yapın.
2. **"New Project"** butonuna tıklayın.
3. Proje adı olarak örneğin `novaq-servers` belirleyin, güçlü bir veritabanı şifresi oluşturun ve size en yakın bölgeyi (örneğin `Central EU - Frankfurt`) seçin.
4. **"Create new project"** butonuna basarak projenizi başlatın.

---

## 2. Adım: Veritabanı Şemasını Yükleyin (Tek Tıkla)

Projenizin ana dizininde bulunan **[`supabase-schema.sql`](./supabase-schema.sql)** dosyası, gerekli tüm tabloları, ilişkileri, güvenlik politikalarını (RLS) ve otomatik kullanıcı oluşturma tetikleyicilerini içerir.

1. Supabase Dashboard'unuzda sol menüden **SQL Editor** simgesine tıklayın.
2. **"New query"** butonuna tıklayın.
3. Projedeki `supabase-schema.sql` dosyasının tüm içeriğini kopyalayıp editöre yapıştırın.
4. Sağ alttaki yeşil **"Run"** butonuna tıklayın.

> **Tebrikler!** Şu tablolar ve güvenlik kuralları anında oluşturulur:
> - `profiles` (Müşteri bilgileri, kurumsal unvan, bakiye, SLA seviyesi)
> - `servers` (VDS, Extreme Ryzen, Dedicated ve GPU sunucuları)
> - `orders` (Yeni siparişler ve yönetim onay akışı)
> - `tickets` & `ticket_messages` (7/24 destek talepleri ve mesajlaşma)
> - `invoices` & `invoice_items` (Faturalandırma ve ödemeler)
> - `audit_logs` (Güvenlik denetim günlüğü)

---

## 3. Adım: API Anahtarlarını `.env` Dosyasına Ekleyin

1. Supabase Dashboard'da sol alttaki **Project Settings** (Dişli çark) simgesine tıklayın.
2. **API** sekmesine geçin.
3. Buradan:
   - **Project URL** değerini kopyalayın.
   - **Project API Keys** altındaki `anon` `public` anahtarını kopyalayın.
4. Projenin ana dizinindeki **`.env`** dosyasını açın ve değerleri yapıştırın:

```env
VITE_SUPABASE_URL=https://proje-id-niz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

5. Dosyayı kaydedin. Vite geliştirme sunucusu otomatik olarak yeniden yüklenecek ve portal başlığında yeşil **"Supabase Canlı"** rozeti belirecektir!

---

## 🔒 Güvenlik Notları (Row Level Security - RLS)

Sistemde tam donanımlı **Row Level Security (RLS)** devrededir:
- Her kullanıcı sadece **kendisine ait** sunucuları, siparişleri, destek biletlerini ve faturaları görebilir ve yönetebilir.
- Bir kullanıcının diğerinin verilerine erişmesi veritabanı seviyesinde engellenmiştir.

---

## ⚡ Demo Modu (Fallback Mekanizması)

`.env` dosyasındaki değerler henüz girilmemişse veya boş bırakılmışsa:
- Web sitesi ve müşteri paneli asla çökmez veya hata vermez.
- Sistem yerel demo verileriyle (**Mock Mode**) tam işlevsel olarak çalışmaya devam eder.
- İstediğiniz zaman `.env` dosyasını doldurarak canlıya geçebilirsiniz.
