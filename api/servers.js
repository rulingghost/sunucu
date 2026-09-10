import { isDatabaseConfigured, ensureDatabaseInitialized, query } from './lib/db.js';
import { SEED_SERVERS } from './lib/seedData.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (!isDatabaseConfigured()) {
    return res.status(200).json({
      success: true,
      data: SEED_SERVERS,
      isMock: true
    });
  }

  try {
    await ensureDatabaseInitialized();

    const { id, customer_id } = req.query || {};

    if (req.method === 'GET') {
      if (id) {
        const result = await query('SELECT * FROM servers WHERE id = $1', [id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ success: false, error: 'Sunucu bulunamadı' });
        }
        return res.status(200).json({ success: true, data: result.rows[0] });
      }

      if (customer_id) {
        const result = await query('SELECT * FROM servers WHERE customer_id = $1 ORDER BY created_at DESC', [customer_id]);
        return res.status(200).json({ success: true, data: result.rows });
      }

      const result = await query('SELECT * FROM servers ORDER BY created_at DESC');
      return res.status(200).json({ success: true, data: result.rows });
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const newId = body.id || `srv-${Math.random().toString(36).substring(2, 8)}`;

      await query(
        `INSERT INTO servers (id, customer_id, name, hostname, plan_name, category, status, location, flag, ip, gateway, netmask, rdns, os, cores, ram, disk, disk_used, bandwidth_total, bandwidth_used_month, uptime, purchased_at, renewal_date, billing_cycle, days_remaining, price_monthly, metrics, snapshots)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)`,
        [
          newId,
          body.customerId || body.customer_id || 'NQ-84920',
          body.name || 'Nova Server',
          body.hostname || `${newId}.novaq.internal`,
          body.planName || body.plan_name || 'Nova Cloud VDS',
          body.category || 'nvme-vds',
          body.status || 'running',
          body.location || 'Almanya (Frankfurt)',
          body.flag || '🇩🇪',
          body.ip || `194.15.36.${Math.floor(100 + Math.random() * 150)}`,
          body.gateway || '194.15.36.1',
          body.netmask || '255.255.255.0',
          body.rdns || `${newId}.novaq.internal`,
          body.os || 'Ubuntu 24.04 LTS',
          body.cores || '4 vCPU',
          body.ram || '8 GB DDR5',
          body.disk || '120 GB NVMe',
          body.diskUsed || '0 GB',
          body.bandwidthTotal || 'Sınırsız (10 Gbps)',
          body.bandwidthUsedMonth || '0 TB',
          body.uptime || '1 Dakika',
          body.purchasedAt || new Date().toLocaleDateString('tr-TR'),
          body.renewalDate || new Date(Date.now() + 30 * 24 * 3600 * 1000).toLocaleDateString('tr-TR'),
          body.billingCycle || 'Aylık',
          30,
          parseFloat(body.priceMonthly || body.price_monthly || 0),
          JSON.stringify(body.metrics || { cpuHistory: [10, 15, 12, 18], ramHistory: [30, 32, 31, 30], diskIOHistory: [10, 12, 15], netMbps: [100, 120, 150] }),
          JSON.stringify(body.snapshots || [])
        ]
      );

      const created = await query('SELECT * FROM servers WHERE id = $1', [newId]);
      return res.status(201).json({ success: true, data: created.rows[0] });
    }

    if (req.method === 'PUT') {
      const serverId = id || req.body?.id;
      if (!serverId) {
        return res.status(400).json({ success: false, error: 'Sunucu ID gerekli' });
      }

      const body = req.body || {};

      // Güç eylemi (power action: reboot, stop, start)
      if (body.action === 'power') {
        const newStatus = body.status || 'running';
        await query('UPDATE servers SET status = $1, updated_at = NOW() WHERE id = $2', [newStatus, serverId]);
        return res.status(200).json({ success: true, status: newStatus });
      }

      // Snapshot ekleme
      if (body.action === 'add_snapshot' && body.snapshot) {
        const current = await query('SELECT snapshots FROM servers WHERE id = $1', [serverId]);
        const snaps = current.rows[0]?.snapshots || [];
        snaps.unshift(body.snapshot);
        await query('UPDATE servers SET snapshots = $1, updated_at = NOW() WHERE id = $2', [JSON.stringify(snaps), serverId]);
        return res.status(200).json({ success: true, snapshots: snaps });
      }

      // Genel alan güncelleme
      await query(
        `UPDATE servers SET 
           name = COALESCE($1, name),
           status = COALESCE($2, status),
           rdns = COALESCE($3, rdns),
           hostname = COALESCE($4, hostname),
           updated_at = NOW()
         WHERE id = $5`,
        [body.name, body.status, body.rdns, body.hostname, serverId]
      );

      const updated = await query('SELECT * FROM servers WHERE id = $1', [serverId]);
      return res.status(200).json({ success: true, data: updated.rows[0] });
    }

    if (req.method === 'DELETE') {
      const serverId = id || req.body?.id;
      await query('DELETE FROM servers WHERE id = $1', [serverId]);
      return res.status(200).json({ success: true, message: 'Sunucu silindi' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
