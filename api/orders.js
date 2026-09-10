import { isDatabaseConfigured, ensureDatabaseInitialized, query } from './lib/db.js';
import { SEED_ORDERS } from './lib/seedData.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (!isDatabaseConfigured()) {
    return res.status(200).json({
      success: true,
      data: SEED_ORDERS,
      isMock: true
    });
  }

  try {
    await ensureDatabaseInitialized();

    const { id, customer_id } = req.query || {};

    if (req.method === 'GET') {
      if (id) {
        const result = await query('SELECT * FROM orders WHERE order_id = $1', [id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ success: false, error: 'Sipariş bulunamadı' });
        }
        return res.status(200).json({ success: true, data: result.rows[0] });
      }

      if (customer_id) {
        const result = await query('SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC', [customer_id]);
        return res.status(200).json({ success: true, data: result.rows });
      }

      const result = await query('SELECT * FROM orders ORDER BY created_at DESC');
      return res.status(200).json({ success: true, data: result.rows });
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const newOrderId = body.orderId || body.order_id || `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const dateStr = body.date || new Date().toLocaleString('tr-TR');

      await query(
        `INSERT INTO orders (order_id, customer_id, customer_name, date, plan_name, location, flag, os, cycle_label, total, payment_status, provision_status, target_server_template, assigned_server_id, admin_notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          newOrderId,
          body.customerId || body.customer_id || 'NQ-84920',
          body.customerName || body.customer_name || 'Ahmet Yılmaz',
          dateStr,
          body.planName || body.plan_name || 'Nova VDS Plan',
          body.location || 'Almanya (Frankfurt)',
          body.flag || '🇩🇪',
          body.os || 'Ubuntu 24.04 LTS',
          body.cycleLabel || body.cycle_label || 'Aylık',
          parseFloat(body.total || 0),
          body.paymentStatus || body.payment_status || 'Ödendi',
          body.provisionStatus || body.provision_status || 'pending_approval',
          JSON.stringify(body.targetServerTemplate || body.target_server_template || {}),
          body.assignedServerId || body.assigned_server_id || null,
          body.adminNotes || ''
        ]
      );

      const created = await query('SELECT * FROM orders WHERE order_id = $1', [newOrderId]);
      return res.status(201).json({ success: true, data: created.rows[0] });
    }

    if (req.method === 'PUT') {
      const orderId = id || req.body?.orderId || req.body?.order_id;
      if (!orderId) {
        return res.status(400).json({ success: false, error: 'Sipariş ID gerekli' });
      }

      const body = req.body || {};

      await query(
        `UPDATE orders SET
           provision_status = COALESCE($1, provision_status),
           payment_status = COALESCE($2, payment_status),
           assigned_server_id = COALESCE($3, assigned_server_id),
           admin_notes = COALESCE($4, admin_notes)
         WHERE order_id = $5`,
        [
          body.provisionStatus || body.provision_status,
          body.paymentStatus || body.payment_status,
          body.assignedServerId || body.assigned_server_id,
          body.adminNotes || body.admin_notes,
          orderId
        ]
      );

      const updated = await query('SELECT * FROM orders WHERE order_id = $1', [orderId]);
      return res.status(200).json({ success: true, data: updated.rows[0] });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
