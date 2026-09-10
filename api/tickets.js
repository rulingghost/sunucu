import { isDatabaseConfigured, ensureDatabaseInitialized, query } from './lib/db.js';
import { SEED_TICKETS } from './lib/seedData.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (!isDatabaseConfigured()) {
    return res.status(200).json({
      success: true,
      data: SEED_TICKETS,
      isMock: true
    });
  }

  try {
    await ensureDatabaseInitialized();

    const { id, customer_id } = req.query || {};

    if (req.method === 'GET') {
      if (id) {
        const result = await query('SELECT * FROM tickets WHERE id = $1', [id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ success: false, error: 'Bilet bulunamadı' });
        }
        return res.status(200).json({ success: true, data: result.rows[0] });
      }

      if (customer_id) {
        const result = await query('SELECT * FROM tickets WHERE customer_id = $1 ORDER BY updated_at DESC', [customer_id]);
        return res.status(200).json({ success: true, data: result.rows });
      }

      const result = await query('SELECT * FROM tickets ORDER BY updated_at DESC');
      return res.status(200).json({ success: true, data: result.rows });
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const newTicketId = body.id || `TCK-${Math.floor(1000 + Math.random() * 9000)}`;

      const initialMessages = body.message ? [{
        id: `msg-${Date.now()}`,
        sender: body.customerName || 'Müşteri',
        isStaff: false,
        avatar: (body.customerName || 'M').substring(0, 2).toUpperCase(),
        time: new Date().toLocaleString('tr-TR'),
        text: body.message,
        attachments: body.attachments || []
      }] : (body.messages || []);

      await query(
        `INSERT INTO tickets (id, customer_id, customer_name, subject, department, related_server, priority, status, messages, internal_notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          newTicketId,
          body.customerId || body.customer_id || 'NQ-84920',
          body.customerName || body.customer_name || 'Ahmet Yılmaz',
          body.subject || 'Destek Talebi',
          body.department || 'Teknik Destek',
          body.relatedServer || body.related_server || '',
          body.priority || 'Normal',
          body.status || 'Açık',
          JSON.stringify(initialMessages),
          JSON.stringify(body.internalNotes || [])
        ]
      );

      const created = await query('SELECT * FROM tickets WHERE id = $1', [newTicketId]);
      return res.status(201).json({ success: true, data: created.rows[0] });
    }

    if (req.method === 'PUT') {
      const ticketId = id || req.body?.id;
      if (!ticketId) {
        return res.status(400).json({ success: false, error: 'Bilet ID gerekli' });
      }

      const body = req.body || {};
      const current = await query('SELECT messages, internal_notes FROM tickets WHERE id = $1', [ticketId]);
      if (current.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Bilet bulunamadı' });
      }

      // Yanıt ekleme (Müşteri veya Admin)
      if (body.action === 'reply' && body.replyText) {
        const messages = current.rows[0].messages || [];
        const isStaff = Boolean(body.isStaff);
        const newMsg = {
          id: `msg-${Date.now()}`,
          sender: body.sender || (isStaff ? 'NovaQ Destek' : 'Müşteri'),
          role: body.role || (isStaff ? 'NovaQ NOC Destek Uzmanı' : undefined),
          isStaff,
          avatar: body.avatar || (isStaff ? 'NQ' : 'M'),
          time: new Date().toLocaleString('tr-TR'),
          text: body.replyText,
          attachments: body.attachments || []
        };
        messages.push(newMsg);

        const newStatus = isStaff ? 'Yanıtlandı' : 'Müşteri Yanıtı';

        await query(
          `UPDATE tickets SET messages = $1, status = $2, updated_at = NOW() WHERE id = $3`,
          [JSON.stringify(messages), newStatus, ticketId]
        );

        const updated = await query('SELECT * FROM tickets WHERE id = $1', [ticketId]);
        return res.status(200).json({ success: true, data: updated.rows[0] });
      }

      // Dahili not ekleme (Yalnızca Admin)
      if (body.action === 'add_note' && body.noteText) {
        const notes = current.rows[0].internal_notes || [];
        notes.unshift({
          id: `note-${Date.now()}`,
          text: body.noteText,
          author: body.author || 'Admin',
          date: new Date().toLocaleDateString('tr-TR')
        });

        await query('UPDATE tickets SET internal_notes = $1, updated_at = NOW() WHERE id = $2', [JSON.stringify(notes), ticketId]);
        return res.status(200).json({ success: true, message: 'Dahili not eklendi' });
      }

      // Durum veya Öncelik güncelleme
      await query(
        `UPDATE tickets SET
           status = COALESCE($1, status),
           priority = COALESCE($2, priority),
           updated_at = NOW()
         WHERE id = $3`,
        [body.status, body.priority, ticketId]
      );

      const updated = await query('SELECT * FROM tickets WHERE id = $1', [ticketId]);
      return res.status(200).json({ success: true, data: updated.rows[0] });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
