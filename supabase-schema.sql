-- ==============================================================================
-- NOVAQ SERVERS - SUPABASE VERİTABANI ŞEMASI VE GÜVENLİK POLİTİKALARI (RLS)
-- ==============================================================================
-- Bu SQL dosyasını Supabase Dashboard -> SQL Editor alanına yapıştırıp 
-- "RUN" butonuna basarak veritabanınızı 1 saniyede canlıya alabilirsiniz.
-- ==============================================================================

-- 1. PROFILES TABLOSU (auth.users ile 1-1 ilişkilidir)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id TEXT UNIQUE DEFAULT ('NQ-' || floor(10000 + random() * 90000)::text),
  full_name TEXT,
  company TEXT,
  email TEXT,
  phone TEXT,
  tier TEXT DEFAULT 'Enterprise VIP',
  balance NUMERIC(12, 2) DEFAULT 3450.00,
  tax_office TEXT,
  tax_number TEXT,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Türkiye',
  two_factor_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. SERVERS TABLOSU (Kullanıcıların Sanal & Fiziksel Sunucuları)
CREATE TABLE IF NOT EXISTS public.servers (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  hostname TEXT,
  plan_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'nvme-vds', -- 'nvme-vds', 'ryzen-vds', 'dedicated', 'gpu-cloud'
  status TEXT NOT NULL DEFAULT 'running',    -- 'running', 'stopped', 'rebooting', 'installing'
  location TEXT NOT NULL,
  flag TEXT DEFAULT '🇩🇪',
  ip TEXT NOT NULL,
  gateway TEXT,
  netmask TEXT DEFAULT '255.255.255.0',
  rdns TEXT,
  os TEXT NOT NULL,
  cores TEXT NOT NULL,
  ram TEXT NOT NULL,
  disk TEXT NOT NULL,
  disk_used TEXT DEFAULT '0 GB',
  bandwidth_total TEXT DEFAULT 'Sınırsız (10 Gbps)',
  bandwidth_used_month TEXT DEFAULT '0 TB',
  uptime TEXT DEFAULT '1 Gün, 0 Saat',
  purchased_at TEXT,
  renewal_date TEXT,
  billing_cycle TEXT DEFAULT 'Aylık',
  days_remaining INTEGER DEFAULT 30,
  price_monthly NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  metrics JSONB DEFAULT '{"cpuHistory":[20,25,22,28,24],"ramHistory":[50,52,51,53,52],"diskIOHistory":[15,18,22,19,20],"netMbps":[150,180,210,190,200]}'::jsonb,
  snapshots JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ORDERS TABLOSU (Siparişler & Provizyon Akışı)
CREATE TABLE IF NOT EXISTS public.orders (
  order_id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  location TEXT NOT NULL,
  flag TEXT DEFAULT '🇩🇪',
  os TEXT NOT NULL,
  cycle_label TEXT NOT NULL DEFAULT 'Aylık',
  total NUMERIC(10, 2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'Ödendi',
  provision_status TEXT NOT NULL DEFAULT 'pending_approval', -- 'pending_approval', 'provisioning', 'approved'
  target_server_template JSONB,
  assigned_server_id TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TICKETS TABLOSU (7/24 Teknik Destek Biletleri)
CREATE TABLE IF NOT EXISTS public.tickets (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  department TEXT NOT NULL,
  related_server TEXT,
  priority TEXT NOT NULL DEFAULT 'Normal', -- 'Düşük', 'Normal', 'Yüksek', 'Acil'
  status TEXT NOT NULL DEFAULT 'Açık',     -- 'Açık', 'Yanıtlandı', 'Müşteri Yanıtı', 'Çözüldü'
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TICKET_MESSAGES TABLOSU (Bilet İçi Canlı Mesajlaşma)
CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id TEXT PRIMARY KEY,
  ticket_id TEXT REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  sender_name TEXT NOT NULL,
  is_staff BOOLEAN DEFAULT false,
  role TEXT,
  avatar TEXT,
  time TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. INVOICES TABLOSU (Faturalandırma & Muhasebe)
CREATE TABLE IF NOT EXISTS public.invoices (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date TEXT NOT NULL,
  due_date TEXT NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  vat NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Beklemede', -- 'Ödendi', 'Beklemede', 'İptal'
  payment_method TEXT,
  paid_at TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. INVOICE_ITEMS TABLOSU (Fatura Kalemleri)
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id SERIAL PRIMARY KEY,
  invoice_id TEXT REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL
);

-- 8. AUDIT_LOGS TABLOSU (Güvenlik ve İşlem Denetim Kayıtları)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  target TEXT,
  time TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) - KULLANICI GÜVENLİK POLİTİKALARI
-- Her müşteri yalnızca kendisine ait sunucuları, biletleri ve faturaları görebilir.
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles politikaları
CREATE POLICY "Kullanıcı kendi profilini görebilir" 
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Kullanıcı kendi profilini güncelleyebilir" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Servers politikaları
CREATE POLICY "Kullanıcı kendi sunucularını görebilir" 
  ON public.servers FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcı kendi sunucularını yönetebilir" 
  ON public.servers FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcı sunucu ekleyebilir" 
  ON public.servers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Orders politikaları
CREATE POLICY "Kullanıcı kendi siparişlerini görebilir" 
  ON public.orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcı yeni sipariş oluşturabilir" 
  ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Kullanıcı siparişini güncelleyebilir" 
  ON public.orders FOR UPDATE USING (auth.uid() = user_id);

-- Tickets & Mesaj politikaları
CREATE POLICY "Kullanıcı kendi destek biletlerini görebilir" 
  ON public.tickets FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcı destek bileti oluşturabilir" 
  ON public.tickets FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Kullanıcı destek biletini güncelleyebilir" 
  ON public.tickets FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcı kendi biletinin mesajlarını görebilir" 
  ON public.ticket_messages FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.tickets WHERE tickets.id = ticket_messages.ticket_id AND tickets.user_id = auth.uid()));

CREATE POLICY "Kullanıcı kendi biletine mesaj gönderebilir" 
  ON public.ticket_messages FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.tickets WHERE tickets.id = ticket_messages.ticket_id AND tickets.user_id = auth.uid()));

-- Invoices politikaları
CREATE POLICY "Kullanıcı kendi faturalarını görebilir" 
  ON public.invoices FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcı kendi fatura kalemlerini görebilir" 
  ON public.invoice_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()));

-- Audit Logs politikaları
CREATE POLICY "Kullanıcı kendi denetim kayıtlarını görebilir" 
  ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcı denetim kaydı ekleyebilir" 
  ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- OTOMATİK PROFİL OLUŞTURMA TRIGGER'I
-- Yeni bir kullanıcı üye olduğunda (auth.users) otomatik olarak public.profiles oluşturulur.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, company, tier, balance)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'company', 'Bireysel Müşteri'),
    'Enterprise VIP',
    1000.00 -- Hoş geldin demo kredisi
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı bağla
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- CANLI REALTIME YAYINI (Gerçek Zamanlı Güncellemeler)
-- ==============================================================================
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.servers;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.ticket_messages;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END;
END $$;
