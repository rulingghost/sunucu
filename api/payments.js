import { isDatabaseConfigured, ensureDatabaseInitialized, query } from './lib/db.js';
import { SEED_PAYMENTS } from './lib/seedData.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (!isDatabaseConfigured()) {
    return res.status(200).json({
      success: true,
      data: SEED_PAYMENTS,
      isMock: true
    });
  }

  try {
    await ensureDatabaseInitialized();

    if (req.method === 'GET') {
      const result = await query('SELECT * FROM payments ORDER BY created_at DESC');
      return res.status(200).json({ success: true, data: result.rows });
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const newPayId = body.id || `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
      const dateStr = body.date || new Date().toLocaleString('tr-TR');

      await query(
        `INSERT INTO payments (id, invoice_id, customer_id, customer_name, amount, method, status, date, transaction_id, receipt_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          newPayId,
          body.invoiceId || body.invoice_id || null,
          body.customerId || body.customer_id || 'NQ-84920',
          body.customerName || body.customer_name || 'Ahmet Yılmaz',
          parseFloat(body.amount || 0),
          body.method || 'Kredi Kartı',
          body.status || 'Başarılı',
          dateStr,
          body.transactionId || body.transaction_id || `TXN-${Date.now()}`,
          body.receiptUrl || body.receipt_url || null
        ]
      );

      const created = await query('SELECT * FROM payments WHERE id = $1', [newPayId]);
      return res.status(201).json({ success: true, data: created.rows[0] });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
