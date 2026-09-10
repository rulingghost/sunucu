import { createPool } from '@vercel/postgres';
import { 
  SEED_CUSTOMERS, 
  SEED_SERVERS, 
  SEED_PRODUCTS, 
  SEED_ORDERS, 
  SEED_INVOICES, 
  SEED_PAYMENTS, 
  SEED_TICKETS, 
  SEED_AUDIT_LOGS 
} from './seedData.js';

let poolInstance = null;
let isInitialized = false;

export function isDatabaseConfigured() {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;
  return Boolean(url && url.length > 10);
}

export function getPool() {
  if (!isDatabaseConfigured()) {
    return null;
  }
  if (!poolInstance) {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;
    poolInstance = createPool({
      connectionString
    });
  }
  return poolInstance;
}

export async function query(text, params = []) {
  const pool = getPool();
  if (!pool) {
    throw new Error('POSTGRES_URL ortam değişkeni bulunamadı. Lütfen Vercel Dashboard veya .env dosyasından tanımlayınız.');
  }
  return await pool.query(text, params);
}

/**
 * Veritabanı tablolarını otomatik oluşturur ve boşsa tohumlar (seed)
 */
export async function ensureDatabaseInitialized() {
  if (isInitialized) return { success: true, message: 'Already initialized' };
  if (!isDatabaseConfigured()) {
    return { success: false, reason: 'unconfigured' };
  }

  try {
    // 1. Tabloları oluştur
    await query(`
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
        receipt_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

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
        receipt_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

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

      CREATE TABLE IF NOT EXISTS blob_files (
        id SERIAL PRIMARY KEY,
        url TEXT UNIQUE NOT NULL,
        pathname TEXT NOT NULL,
        size BIGINT DEFAULT 0,
        content_type VARCHAR(128),
        category VARCHAR(64) DEFAULT 'general',
        uploaded_by VARCHAR(64),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Tablolar boş mu kontrol et, boşsa tohum verilerini yükle
    const countCheck = await query('SELECT COUNT(*) as count FROM customers');
    const existingCount = parseInt(countCheck.rows[0]?.count || 0, 10);

    if (existingCount === 0) {
      // Tohumla: Customers
      for (const c of SEED_CUSTOMERS) {
        await query(
          `INSERT INTO customers (id, name, company, email, phone, tier, status, balance, two_factor_enabled, tax_office, tax_number, address, city, country, registered_at, total_spent, order_count, internal_notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
           ON CONFLICT (id) DO NOTHING`,
          [c.id, c.name, c.company, c.email, c.phone, c.tier, c.status, c.balance, c.two_factor_enabled, c.tax_office, c.tax_number, c.address, c.city, c.country, c.registered_at, c.total_spent, c.order_count, JSON.stringify(c.internal_notes)]
        );
      }

      // Tohumla: Servers
      for (const s of SEED_SERVERS) {
        await query(
          `INSERT INTO servers (id, customer_id, name, hostname, plan_name, category, status, location, flag, ip, gateway, netmask, rdns, os, cores, ram, disk, disk_used, bandwidth_total, bandwidth_used_month, uptime, purchased_at, renewal_date, billing_cycle, days_remaining, price_monthly, metrics, snapshots)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)
           ON CONFLICT (id) DO NOTHING`,
          [s.id, s.customer_id, s.name, s.hostname, s.plan_name, s.category, s.status, s.location, s.flag, s.ip, s.gateway, s.netmask, s.rdns, s.os, s.cores, s.ram, s.disk, s.disk_used, s.bandwidth_total, s.bandwidth_used_month, s.uptime, s.purchased_at, s.renewal_date, s.billing_cycle, s.days_remaining, s.price_monthly, JSON.stringify(s.metrics), JSON.stringify(s.snapshots)]
        );
      }

      // Tohumla: Products
      for (const p of SEED_PRODUCTS) {
        await query(
          `INSERT INTO products (id, name, category, cores, ram, disk, bandwidth, port, ddos, price, monthly_price, popular, stock, status, features)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
           ON CONFLICT (id) DO NOTHING`,
          [p.id, p.name, p.category, p.cores, p.ram, p.disk, p.bandwidth, p.port, p.ddos, p.price, p.monthly_price, p.popular, p.stock, p.status, JSON.stringify(p.features)]
        );
      }

      // Tohumla: Orders
      for (const o of SEED_ORDERS) {
        await query(
          `INSERT INTO orders (order_id, customer_id, customer_name, date, plan_name, location, flag, os, cycle_label, total, payment_status, provision_status, target_server_template, assigned_server_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
           ON CONFLICT (order_id) DO NOTHING`,
          [o.order_id, o.customer_id, o.customer_name, o.date, o.plan_name, o.location, o.flag, o.os, o.cycle_label, o.total, o.payment_status, o.provision_status, JSON.stringify(o.target_server_template || {}), o.assigned_server_id || null]
        );
      }

      // Tohumla: Invoices
      for (const inv of SEED_INVOICES) {
        await query(
          `INSERT INTO invoices (id, customer_id, customer_name, date, due_date, subtotal, vat, total, status, payment_method, paid_at, items)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           ON CONFLICT (id) DO NOTHING`,
          [inv.id, inv.customer_id, inv.customer_name, inv.date, inv.due_date, inv.subtotal, inv.vat, inv.total, inv.status, inv.payment_method, inv.paid_at, JSON.stringify(inv.items)]
        );
      }

      // Tohumla: Payments
      for (const pay of SEED_PAYMENTS) {
        await query(
          `INSERT INTO payments (id, invoice_id, customer_id, customer_name, amount, method, status, date, transaction_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO NOTHING`,
          [pay.id, pay.invoice_id, pay.customer_id, pay.customer_name, pay.amount, pay.method, pay.status, pay.date, pay.transaction_id]
        );
      }

      // Tohumla: Tickets
      for (const t of SEED_TICKETS) {
        await query(
          `INSERT INTO tickets (id, customer_id, customer_name, subject, department, related_server, priority, status, messages, internal_notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (id) DO NOTHING`,
          [t.id, t.customer_id, t.customer_name, t.subject, t.department, t.related_server, t.priority, t.status, JSON.stringify(t.messages), JSON.stringify(t.internal_notes)]
        );
      }

      // Tohumla: Audit Logs
      for (const log of SEED_AUDIT_LOGS) {
        await query(
          `INSERT INTO audit_logs (action, target, user_name, ip, details)
           VALUES ($1, $2, $3, $4, $5)`,
          [log.action, log.target, log.user_name, log.ip, log.details]
        );
      }
    }

    isInitialized = true;
    return { success: true, initialized: true };
  } catch (error) {
    console.error('[DB Init Error]', error);
    return { success: false, error: error.message };
  }
}
