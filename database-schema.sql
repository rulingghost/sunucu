-- ==============================================================================
-- NOVAQ SERVERS - VERCEL POSTGRES (NEON) VERİTABANI ŞEMASI
-- ==============================================================================
-- Bu dosya Vercel Postgres veya herhangi bir standart PostgreSQL veritabanında
-- doğrudan çalıştırılabilir. Tablolar, indeksler ve ilişkiler eksiksiz tanımlanmıştır.
-- ==============================================================================

-- 1. MÜŞTERİLER (CUSTOMERS) TABLOSU
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(64),
  tier VARCHAR(64) DEFAULT 'Enterprise VIP',
  status VARCHAR(32) DEFAULT 'Aktif',
  balance NUMERIC(12, 2) DEFAULT 0.00,
  two_factor_enabled BOOLEAN DEFAULT false,
  tax_office VARCHAR(255),
  tax_number VARCHAR(64),
  address TEXT,
  city VARCHAR(128),
  country VARCHAR(128) DEFAULT 'Türkiye',
  registered_at VARCHAR(64),
  total_spent NUMERIC(12, 2) DEFAULT 0.00,
  order_count INTEGER DEFAULT 0,
  internal_notes JSONB DEFAULT '[]'::jsonb,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SUNUCULAR (SERVERS) TABLOSU
CREATE TABLE IF NOT EXISTS servers (
  id VARCHAR(64) PRIMARY KEY,
  customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  hostname VARCHAR(255),
  plan_name VARCHAR(255) NOT NULL,
  category VARCHAR(64) DEFAULT 'nvme-vds',
  status VARCHAR(32) DEFAULT 'running',
  location VARCHAR(128) NOT NULL,
  flag VARCHAR(16) DEFAULT '🇩🇪',
  ip VARCHAR(64) NOT NULL,
  gateway VARCHAR(64),
  netmask VARCHAR(64) DEFAULT '255.255.255.0',
  rdns VARCHAR(255),
  os VARCHAR(255) NOT NULL,
  cores VARCHAR(128) NOT NULL,
  ram VARCHAR(128) NOT NULL,
  disk VARCHAR(128) NOT NULL,
  disk_used VARCHAR(64) DEFAULT '0 GB',
  bandwidth_total VARCHAR(128) DEFAULT 'Sınırsız (10 Gbps)',
  bandwidth_used_month VARCHAR(64) DEFAULT '0 TB',
  uptime VARCHAR(128) DEFAULT '1 Gün',
  purchased_at VARCHAR(64),
  renewal_date VARCHAR(64),
  billing_cycle VARCHAR(64) DEFAULT 'Aylık',
  days_remaining INTEGER DEFAULT 30,
  price_monthly NUMERIC(10, 2) DEFAULT 0.00,
  metrics JSONB DEFAULT '{"cpuHistory":[20,25,22,28,24],"ramHistory":[50,52,51,53,52],"diskIOHistory":[15,18,22,19,20],"netMbps":[150,180,210,190,200]}'::jsonb,
  snapshots JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ÜRÜNLER VE PAKETLER (PRODUCTS) TABLOSU
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  cores VARCHAR(128) NOT NULL,
  ram VARCHAR(128) NOT NULL,
  disk VARCHAR(128) NOT NULL,
  bandwidth VARCHAR(128) NOT NULL,
  port VARCHAR(64) DEFAULT '10 Gbps',
  ddos VARCHAR(128) DEFAULT '3.2 Tbps Voxility',
  price NUMERIC(10, 2) NOT NULL,
  monthly_price NUMERIC(10, 2) NOT NULL,
  popular BOOLEAN DEFAULT false,
  stock INTEGER DEFAULT 99,
  status VARCHAR(32) DEFAULT 'active',
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SİPARİŞLER (ORDERS) TABLOSU
CREATE TABLE IF NOT EXISTS orders (
  order_id VARCHAR(64) PRIMARY KEY,
  customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE SET NULL,
  customer_name VARCHAR(255),
  date VARCHAR(64) NOT NULL,
  plan_name VARCHAR(255) NOT NULL,
  location VARCHAR(128) NOT NULL,
  flag VARCHAR(16) DEFAULT '🇩🇪',
  os VARCHAR(255) NOT NULL,
  cycle_label VARCHAR(64) DEFAULT 'Aylık',
  total NUMERIC(10, 2) NOT NULL,
  payment_status VARCHAR(64) DEFAULT 'Ödendi',
  provision_status VARCHAR(64) DEFAULT 'pending_approval',
  target_server_template JSONB,
  assigned_server_id VARCHAR(64),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FATURALAR (INVOICES) TABLOSU
CREATE TABLE IF NOT EXISTS invoices (
  id VARCHAR(64) PRIMARY KEY,
  customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE SET NULL,
  customer_name VARCHAR(255),
  date VARCHAR(64) NOT NULL,
  due_date VARCHAR(64) NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  vat NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  status VARCHAR(32) DEFAULT 'Beklemede',
  payment_method VARCHAR(128),
  paid_at VARCHAR(64),
  items JSONB DEFAULT '[]'::jsonb,
  receipt_url TEXT, -- Vercel Blob URL'si (Yüklenen Banka Dekontu)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ÖDEME KAYITLARI (PAYMENTS) TABLOSU
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(64) PRIMARY KEY,
  invoice_id VARCHAR(64) REFERENCES invoices(id) ON DELETE SET NULL,
  customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE SET NULL,
  customer_name VARCHAR(255),
  amount NUMERIC(10, 2) NOT NULL,
  method VARCHAR(128) NOT NULL,
  status VARCHAR(64) DEFAULT 'Başarılı',
  date VARCHAR(64) NOT NULL,
  transaction_id VARCHAR(128),
  receipt_url TEXT, -- Vercel Blob URL'si
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DESTEK TALEPLERİ (TICKETS) TABLOSU
CREATE TABLE IF NOT EXISTS tickets (
  id VARCHAR(64) PRIMARY KEY,
  customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE SET NULL,
  customer_name VARCHAR(255),
  subject VARCHAR(255) NOT NULL,
  department VARCHAR(128) NOT NULL,
  related_server VARCHAR(255),
  priority VARCHAR(32) DEFAULT 'Normal',
  status VARCHAR(32) DEFAULT 'Açık',
  messages JSONB DEFAULT '[]'::jsonb,
  internal_notes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. GÜVENLİK VE DENETİM GÜNLÜKLERİ (AUDIT_LOGS) TABLOSU
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  action VARCHAR(255) NOT NULL,
  target VARCHAR(255),
  user_id VARCHAR(64),
  user_name VARCHAR(255),
  ip VARCHAR(64),
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. VERCEL BLOB DOSYA ARŞİVİ (BLOB_FILES) TABLOSU
CREATE TABLE IF NOT EXISTS blob_files (
  id SERIAL PRIMARY KEY,
  url TEXT UNIQUE NOT NULL,
  pathname TEXT NOT NULL,
  size BIGINT DEFAULT 0,
  content_type VARCHAR(128),
  category VARCHAR(64) DEFAULT 'general', -- 'receipt', 'ticket_attachment', 'document', 'avatar', 'backup'
  uploaded_by VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- İNDEKS TANIMLARI
CREATE INDEX IF NOT EXISTS idx_servers_customer_id ON servers(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_customer_id ON tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(provision_status);
CREATE INDEX IF NOT EXISTS idx_blob_files_category ON blob_files(category);
