import { isDatabaseConfigured, ensureDatabaseInitialized, query } from './lib/db.js';
import { SEED_INVOICES } from './lib/seedData.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (!isDatabaseConfigured()) {
    return res.status(200).json({
      success: true,
      data: SEED_INVOICES,
      isMock: true
    });
  }

  try {
    await ensureDatabaseInitialized();

    const { id, customer_id } = req.query || {};

    if (req.method === 'GET') {
      if (id) {
        const result = await query('SELECT * FROM invoices WHERE id = $1', [id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ success: false, error: 'Fatura bulunamadı' });
        }
        return res.status(200).json({ success: true, data: result.rows[0] });
      }

      if (customer_id) {
        const result = await query('SELECT * FROM invoices WHERE customer_id = $1 ORDER BY created_at DESC', [customer_id]);
        return res.status(200).json({ success: true, data: result.rows });
      }

      const result = await query('SELECT * FROM invoices ORDER BY created_at DESC');
      return res.status(200).json({ success: true, data: result.rows });
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const newInvId = body.id || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const dateStr = body.date || new Date().toLocaleDateString('tr-TR');
      const dueDateStr = body.dueDate || body.due_date || new Date(Date.now() + 14 * 24 * 3600 * 1000).toLocaleDateString('tr-TR');

      await query(
        `INSERT INTO invoices (id, customer_id, customer_name, date, due_date, subtotal, vat, total, status, payment_method, paid_at, items, receipt_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          newInvId,
          body.customerId || body.customer_id || 'NQ-84920',
          body.customerName || body.customer_name || 'Ahmet Yılmaz',
          dateStr,
          dueDateStr,
          parseFloat(body.subtotal || 0),
          parseFloat(body.vat || 0),
          parseFloat(body.total || 0),
          body.status || 'Beklemede',
          body.paymentMethod || body.payment_method || null,
          body.paidAt || body.paid_at || null,
          JSON.stringify(body.items || []),
          body.receiptUrl || body.receipt_url || null
        ]
      );

      const created = await query('SELECT * FROM invoices WHERE id = $1', [newInvId]);
      return res.status(201).json({ success: true, data: created.rows[0] });
    }

    if (req.method === 'PUT') {
      const invId = id || req.body?.id;
      if (!invId) {
        return res.status(400).json({ success: false, error: 'Fatura ID gerekli' });
      }

      const body = req.body || {};

      await query(
        `UPDATE invoices SET
           status = COALESCE($1, status),
           payment_method = COALESCE($2, payment_method),
           paid_at = COALESCE($3, paid_at),
           receipt_url = COALESCE($4, receipt_url)
         WHERE id = $5`,
        [
          body.status,
          body.paymentMethod || body.payment_method,
          body.paidAt || body.paid_at,
          body.receiptUrl || body.receipt_url,
          invId
        ]
      );

      const updated = await query('SELECT * FROM invoices WHERE id = $1', [invId]);
      return res.status(200).json({ success: true, data: updated.rows[0] });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
