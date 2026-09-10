import { uploadToBlob } from './lib/blob.js';
import { isDatabaseConfigured, query } from './lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = req.body || {};
    const { filename, file, contentType, category = 'general', uploadedBy = 'user' } = body;

    if (!file) {
      return res.status(400).json({ success: false, error: 'Yüklenecek dosya verisi (file) bulunamadı.' });
    }

    const cleanFilename = (filename || `upload-${Date.now()}`).replace(/[^a-zA-Z0-9._-]/g, '_');
    const folder = category === 'receipt' ? 'dekontlar' : (category === 'ticket' ? 'destek-ekleri' : 'dosyalar');
    const targetPath = `${folder}/${Date.now()}-${cleanFilename}`;

    const blobResult = await uploadToBlob(targetPath, file, {
      contentType: contentType || 'image/png'
    });

    // Postgres bağlıysa dosya kaydını veritabanına da ekle
    if (isDatabaseConfigured()) {
      try {
        await query(
          `INSERT INTO blob_files (url, pathname, size, content_type, category, uploaded_by)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (url) DO NOTHING`,
          [
            blobResult.url,
            blobResult.pathname,
            blobResult.size || 0,
            blobResult.contentType || contentType || 'application/octet-stream',
            category,
            uploadedBy
          ]
        );
      } catch (dbErr) {
        console.warn('[Blob DB Record Warning]', dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      data: blobResult
    });
  } catch (error) {
    console.error('[Upload API Error]', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
