import { isDatabaseConfigured, ensureDatabaseInitialized, query } from './lib/db.js';
import { SEED_PRODUCTS } from './lib/seedData.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (!isDatabaseConfigured()) {
    return res.status(200).json({
      success: true,
      data: SEED_PRODUCTS,
      isMock: true
    });
  }

  try {
    await ensureDatabaseInitialized();

    const { id } = req.query || {};

    if (req.method === 'GET') {
      if (id) {
        const result = await query('SELECT * FROM products WHERE id = $1', [id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ success: false, error: 'Ürün bulunamadı' });
        }
        return res.status(200).json({ success: true, data: result.rows[0] });
      }

      const result = await query('SELECT * FROM products ORDER BY price ASC');
      return res.status(200).json({ success: true, data: result.rows });
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const newId = body.id || `prod-${Math.random().toString(36).substring(2, 8)}`;

      await query(
        `INSERT INTO products (id, name, category, cores, ram, disk, bandwidth, port, ddos, price, monthly_price, popular, stock, status, features)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          newId,
          body.name || 'Yeni Sunucu Paketi',
          body.category || 'nvme-vds',
          body.cores || '4 vCPU',
          body.ram || '8 GB DDR5',
          body.disk || '100 GB NVMe',
          body.bandwidth || 'Sınırsız (10 Gbps)',
          body.port || '10 Gbps',
          body.ddos || '3.2 Tbps Voxility',
          parseFloat(body.price || 19),
          parseFloat(body.monthlyPrice || body.price || 19),
          Boolean(body.popular),
          parseInt(body.stock || 50, 10),
          body.status || 'active',
          JSON.stringify(body.features || [])
        ]
      );

      const created = await query('SELECT * FROM products WHERE id = $1', [newId]);
      return res.status(201).json({ success: true, data: created.rows[0] });
    }

    if (req.method === 'PUT') {
      const prodId = id || req.body?.id;
      if (!prodId) {
        return res.status(400).json({ success: false, error: 'Ürün ID gerekli' });
      }

      const body = req.body || {};

      await query(
        `UPDATE products SET
           name = COALESCE($1, name),
           category = COALESCE($2, category),
           cores = COALESCE($3, cores),
           ram = COALESCE($4, ram),
           disk = COALESCE($5, disk),
           price = COALESCE($6, price),
           monthly_price = COALESCE($7, monthly_price),
           stock = COALESCE($8, stock),
           status = COALESCE($9, status),
           popular = COALESCE($10, popular)
         WHERE id = $11`,
        [
          body.name,
          body.category,
          body.cores,
          body.ram,
          body.disk,
          body.price !== undefined ? parseFloat(body.price) : null,
          body.monthlyPrice !== undefined ? parseFloat(body.monthlyPrice) : null,
          body.stock !== undefined ? parseInt(body.stock, 10) : null,
          body.status,
          body.popular !== undefined ? Boolean(body.popular) : null,
          prodId
        ]
      );

      const updated = await query('SELECT * FROM products WHERE id = $1', [prodId]);
      return res.status(200).json({ success: true, data: updated.rows[0] });
    }

    if (req.method === 'DELETE') {
      const prodId = id || req.body?.id;
      await query('DELETE FROM products WHERE id = $1', [prodId]);
      return res.status(200).json({ success: true, message: 'Ürün silindi' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
