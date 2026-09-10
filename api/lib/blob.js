import { put, list, del } from '@vercel/blob';

export function isBlobConfigured() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  return Boolean(token && token.length > 10);
}

/**
 * Dosyayı Vercel Blob nesne depolama alanına yükler.
 * @param {string} pathname - Örn: 'tickets/tck-9942-error.png'
 * @param {Buffer|Blob|string} data - Dosya içeriği veya base64 string
 * @param {object} options - Ek parametreler (contentType, category, etc.)
 */
export async function uploadToBlob(pathname, data, options = {}) {
  const cleanPath = pathname.replace(/^\/+/, '');
  const contentType = options.contentType || 'application/octet-stream';

  if (!isBlobConfigured()) {
    // Vercel Blob Token henüz girilmemişse güvenli yerel/mock Data-URL fallback
    console.warn('[Vercel Blob] BLOB_READ_WRITE_TOKEN bulunamadı. Yerel güvenli önizleme oluşturuluyor.');
    let base64String = '';
    if (typeof data === 'string') {
      base64String = data.startsWith('data:') ? data : `data:${contentType};base64,${data}`;
    } else if (Buffer.isBuffer(data)) {
      base64String = `data:${contentType};base64,${data.toString('base64')}`;
    } else {
      base64String = `https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60`;
    }

    return {
      url: base64String,
      downloadUrl: base64String,
      pathname: cleanPath,
      contentType,
      size: typeof data === 'string' ? data.length : 1024,
      uploadedAt: new Date().toISOString(),
      isMock: true
    };
  }

  try {
    let bodyData = data;
    // Eğer base64 veri gelmişse Buffer'a dönüştür
    if (typeof data === 'string' && data.includes(';base64,')) {
      const parts = data.split(';base64,');
      bodyData = Buffer.from(parts[1], 'base64');
    }

    const blob = await put(cleanPath, bodyData, {
      access: 'public',
      contentType: contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return {
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      contentType: blob.contentType,
      size: blob.size || (Buffer.isBuffer(bodyData) ? bodyData.length : 0),
      uploadedAt: new Date().toISOString(),
      isMock: false
    };
  } catch (error) {
    console.error('[Vercel Blob Upload Error]', error);
    throw error;
  }
}

/**
 * Vercel Blob'daki dosyaları listeler
 */
export async function listBlobFiles(options = {}) {
  if (!isBlobConfigured()) {
    return { blobs: [], isMock: true };
  }
  try {
    const result = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      limit: options.limit || 50,
      prefix: options.prefix || ''
    });
    return result;
  } catch (error) {
    console.error('[Vercel Blob List Error]', error);
    return { blobs: [], error: error.message };
  }
}

/**
 * Vercel Blob'dan bir dosyayı siler
 */
export async function deleteBlobFile(url) {
  if (!isBlobConfigured() || !url || url.startsWith('data:')) {
    return { success: true };
  }
  try {
    await del(url, {
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    return { success: true };
  } catch (error) {
    console.error('[Vercel Blob Delete Error]', error);
    return { success: false, error: error.message };
  }
}
