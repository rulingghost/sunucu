import { isDatabaseConfigured, ensureDatabaseInitialized, query } from './lib/db.js';
import { isBlobConfigured, listBlobFiles } from './lib/blob.js';

export default async function handler(req, res) {
  const startTime = Date.now();
  let postgresConnected = false;
  let postgresLatency = null;
  let counts = {};
  let dbError = null;

  const dbConfigured = isDatabaseConfigured();
  const blobConfigured = isBlobConfigured();

  if (dbConfigured) {
    try {
      await ensureDatabaseInitialized();
      const pingStart = Date.now();
      await query('SELECT 1');
      postgresLatency = Date.now() - pingStart;
      postgresConnected = true;

      // Tablo satır sayılarını al
      const [cRes, sRes, pRes, oRes, iRes, tRes] = await Promise.all([
        query('SELECT COUNT(*) as c FROM customers').catch(() => ({ rows: [{ c: 0 }] })),
        query('SELECT COUNT(*) as c FROM servers').catch(() => ({ rows: [{ c: 0 }] })),
        query('SELECT COUNT(*) as c FROM products').catch(() => ({ rows: [{ c: 0 }] })),
        query('SELECT COUNT(*) as c FROM orders').catch(() => ({ rows: [{ c: 0 }] })),
        query('SELECT COUNT(*) as c FROM invoices').catch(() => ({ rows: [{ c: 0 }] })),
        query('SELECT COUNT(*) as c FROM tickets').catch(() => ({ rows: [{ c: 0 }] }))
      ]);

      counts = {
        customers: parseInt(cRes.rows[0]?.c || 0, 10),
        servers: parseInt(sRes.rows[0]?.c || 0, 10),
        products: parseInt(pRes.rows[0]?.c || 0, 10),
        orders: parseInt(oRes.rows[0]?.c || 0, 10),
        invoices: parseInt(iRes.rows[0]?.c || 0, 10),
        tickets: parseInt(tRes.rows[0]?.c || 0, 10)
      };
    } catch (err) {
      dbError = err.message;
      postgresConnected = false;
    }
  }

  let blobFileCount = 0;
  if (blobConfigured) {
    try {
      const bList = await listBlobFiles({ limit: 10 });
      blobFileCount = bList.blobs?.length || 0;
    } catch {
      // sessizce geç
    }
  }

  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    ok: true,
    timestamp: new Date().toISOString(),
    durationMs: Date.now() - startTime,
    postgres: {
      configured: dbConfigured,
      connected: postgresConnected,
      latencyMs: postgresLatency,
      error: dbError,
      counts
    },
    blob: {
      configured: blobConfigured,
      fileCount: blobFileCount,
      provider: 'Vercel Blob Storage'
    }
  });
}
