import { isDatabaseConfigured, ensureDatabaseInitialized, query } from './lib/db.js';
import { SEED_AUDIT_LOGS } from './lib/seedData.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (!isDatabaseConfigured()) {
    return res.status(200).json({
      success: true,
      data: SEED_AUDIT_LOGS,
      isMock: true
    });
  }

  try {
    await ensureDatabaseInitialized();

    if (req.method === 'GET') {
      const result = await query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100');
      return res.status(200).json({ success: true, data: result.rows });
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      await query(
        `INSERT INTO audit_logs (action, target, user_id, user_name, ip, details)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          body.action || 'Bilinmeyen İşlem',
          body.target || 'Sistem',
          body.userId || body.user_id || 'system',
          body.userName || body.user_name || 'Admin',
          body.ip || '127.0.0.1',
          body.details || ''
        ]
      );

      return res.status(201).json({ success: true, message: 'Log kaydedildi' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
