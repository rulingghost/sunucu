import { isDatabaseConfigured, ensureDatabaseInitialized, query } from './lib/db.js';
import { SEED_CUSTOMERS } from './lib/seedData.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (!isDatabaseConfigured()) {
    // Fallback mode: return seed customers
    return res.status(200).json({
      success: true,
      data: SEED_CUSTOMERS,
      isMock: true
    });
  }

  try {
    await ensureDatabaseInitialized();

    const { id } = req.query || {};

    if (req.method === 'GET') {
      if (id) {
        const result = await query('SELECT * FROM customers WHERE id = $1', [id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ success: false, error: 'Müşteri bulunamadı' });
        }
        return res.status(200).json({ success: true, data: result.rows[0] });
      }

      const result = await query('SELECT * FROM customers ORDER BY created_at DESC');
      return res.status(200).json({ success: true, data: result.rows });
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const newId = body.id || `NQ-${Math.floor(10000 + Math.random() * 90000)}`;
      const registeredAt = body.registeredAt || new Date().toLocaleDateString('tr-TR');

      await query(
        `INSERT INTO customers (id, name, company, email, phone, tier, status, balance, two_factor_enabled, tax_office, tax_number, address, city, country, registered_at, total_spent, order_count, internal_notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [
          newId,
          body.name || 'Yeni Müşteri',
          body.company || '',
          body.email || `user-${Date.now()}@novaq.com`,
          body.phone || '',
          body.tier || 'Standart',
          body.status || 'Aktif',
          parseFloat(body.balance || 0),
          Boolean(body.twoFactorEnabled),
          body.taxOffice || '',
          body.taxNumber || '',
          body.address || '',
          body.city || 'İstanbul',
          body.country || 'Türkiye',
          registeredAt,
          parseFloat(body.totalSpent || 0),
          parseInt(body.orderCount || 0, 10),
          JSON.stringify(body.internalNotes || [])
        ]
      );

      const created = await query('SELECT * FROM customers WHERE id = $1', [newId]);
      return res.status(201).json({ success: true, data: created.rows[0] });
    }

    if (req.method === 'PUT') {
      const customerId = id || req.body?.id;
      if (!customerId) {
        return res.status(400).json({ success: false, error: 'Müşteri ID gerekli' });
      }

      const body = req.body || {};

      // Özel aksiyon: Not ekleme
      if (body.action === 'add_note' && body.note) {
        const current = await query('SELECT internal_notes FROM customers WHERE id = $1', [customerId]);
        const notes = current.rows[0]?.internal_notes || [];
        notes.unshift(body.note);
        await query('UPDATE customers SET internal_notes = $1, updated_at = NOW() WHERE id = $2', [JSON.stringify(notes), customerId]);
        return res.status(200).json({ success: true, message: 'Not eklendi' });
      }

      // Özel aksiyon: Durum değiştirme
      if (body.action === 'toggle_status') {
        const current = await query('SELECT status FROM customers WHERE id = $1', [customerId]);
        const newStatus = current.rows[0]?.status === 'Aktif' ? 'Pasif' : 'Aktif';
        await query('UPDATE customers SET status = $1, updated_at = NOW() WHERE id = $2', [newStatus, customerId]);
        return res.status(200).json({ success: true, status: newStatus });
      }

      // Genel güncelleme
      await query(
        `UPDATE customers SET 
           name = COALESCE($1, name),
           company = COALESCE($2, company),
           email = COALESCE($3, email),
           phone = COALESCE($4, phone),
           tier = COALESCE($5, tier),
           status = COALESCE($6, status),
           balance = COALESCE($7, balance),
           two_factor_enabled = COALESCE($8, two_factor_enabled),
           tax_office = COALESCE($9, tax_office),
           tax_number = COALESCE($10, tax_number),
           address = COALESCE($11, address),
           city = COALESCE($12, city),
           updated_at = NOW()
         WHERE id = $13`,
        [
          body.name,
          body.company,
          body.email,
          body.phone,
          body.tier,
          body.status,
          body.balance !== undefined ? parseFloat(body.balance) : null,
          body.twoFactorEnabled !== undefined ? Boolean(body.twoFactorEnabled) : null,
          body.taxOffice,
          body.taxNumber,
          body.address,
          body.city,
          customerId
        ]
      );

      const updated = await query('SELECT * FROM customers WHERE id = $1', [customerId]);
      return res.status(200).json({ success: true, data: updated.rows[0] });
    }

    if (req.method === 'DELETE') {
      const customerId = id || req.body?.id;
      if (!customerId) {
        return res.status(400).json({ success: false, error: 'Müşteri ID gerekli' });
      }
      await query('DELETE FROM customers WHERE id = $1', [customerId]);
      return res.status(200).json({ success: true, message: 'Müşteri silindi' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
