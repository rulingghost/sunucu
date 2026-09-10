import { isDatabaseConfigured, ensureDatabaseInitialized, query } from './lib/db.js';
import { 
  SEED_CUSTOMERS, 
  SEED_SERVERS, 
  SEED_PRODUCTS, 
  SEED_ORDERS, 
  SEED_INVOICES, 
  SEED_PAYMENTS, 
  SEED_TICKETS, 
  SEED_AUDIT_LOGS 
} from './lib/seedData.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (!isDatabaseConfigured()) {
    return res.status(400).json({
      success: false,
      message: 'POSTGRES_URL bulunamadı. Lütfen Vercel Dashboard veya .env dosyasından veritabanı bağlantı adresini tanımlayınız.'
    });
  }

  const { reset } = req.query || {};

  try {
    if (reset === 'true' || req.method === 'DELETE') {
      // Tabloları temizle
      await query(`
        TRUNCATE TABLE blob_files, audit_logs, tickets, payments, invoices, orders, products, servers, customers CASCADE;
      `).catch(() => {});
    }

    const initResult = await ensureDatabaseInitialized();

    if (reset === 'true') {
      // Yeniden tohumla
      for (const c of SEED_CUSTOMERS) {
        await query(
          `INSERT INTO customers (id, name, company, email, phone, tier, status, balance, two_factor_enabled, tax_office, tax_number, address, city, country, registered_at, total_spent, order_count, internal_notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
           ON CONFLICT (id) DO UPDATE SET 
             name = EXCLUDED.name, company = EXCLUDED.company, email = EXCLUDED.email, balance = EXCLUDED.balance`,
          [c.id, c.name, c.company, c.email, c.phone, c.tier, c.status, c.balance, c.two_factor_enabled, c.tax_office, c.tax_number, c.address, c.city, c.country, c.registered_at, c.total_spent, c.order_count, JSON.stringify(c.internal_notes)]
        );
      }

      for (const s of SEED_SERVERS) {
        await query(
          `INSERT INTO servers (id, customer_id, name, hostname, plan_name, category, status, location, flag, ip, gateway, netmask, rdns, os, cores, ram, disk, disk_used, bandwidth_total, bandwidth_used_month, uptime, purchased_at, renewal_date, billing_cycle, days_remaining, price_monthly, metrics, snapshots)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)
           ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, metrics = EXCLUDED.metrics`,
          [s.id, s.customer_id, s.name, s.hostname, s.plan_name, s.category, s.status, s.location, s.flag, s.ip, s.gateway, s.netmask, s.rdns, s.os, s.cores, s.ram, s.disk, s.disk_used, s.bandwidth_total, s.bandwidth_used_month, s.uptime, s.purchased_at, s.renewal_date, s.billing_cycle, s.days_remaining, s.price_monthly, JSON.stringify(s.metrics), JSON.stringify(s.snapshots)]
        );
      }

      for (const p of SEED_PRODUCTS) {
        await query(
          `INSERT INTO products (id, name, category, cores, ram, disk, bandwidth, port, ddos, price, monthly_price, popular, stock, status, features)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
           ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, monthly_price = EXCLUDED.monthly_price`,
          [p.id, p.name, p.category, p.cores, p.ram, p.disk, p.bandwidth, p.port, p.ddos, p.price, p.monthly_price, p.popular, p.stock, p.status, JSON.stringify(p.features)]
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Vercel Postgres veritabanı başarıyla başlatıldı ve tohumlandı.',
      details: initResult
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
