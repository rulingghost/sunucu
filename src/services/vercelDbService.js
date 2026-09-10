/**
 * NovaQ Servers - Vercel Postgres & Vercel Blob İstemci Servisi
 * Bu servis tarayıcıdaki tüm veri operasyonlarını /api/* Serverless uç noktaları üzerinden
 * Vercel Postgres veritabanına ve Vercel Blob depolama alanına kaydeder.
 */

async function apiRequest(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const res = await fetch(endpoint, {
      ...options,
      headers
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || `HTTP ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.warn(`[Vercel DB Service] ${endpoint} isteğinde hata:`, error.message);
    throw error;
  }
}

export const vercelDbService = {
  // ==========================================
  // 1. SİSTEM VE DURUM KONTROLÜ
  // ==========================================
  async getStatus() {
    try {
      return await apiRequest('/api/status');
    } catch {
      return {
        ok: false,
        postgres: { configured: false, connected: false },
        blob: { configured: false }
      };
    }
  },

  async initDatabase(reset = false) {
    return await apiRequest(`/api/init-db${reset ? '?reset=true' : ''}`, {
      method: 'POST'
    });
  },

  // ==========================================
  // 2. MÜŞTERİLER (CUSTOMERS)
  // ==========================================
  async getCustomers() {
    const res = await apiRequest('/api/customers');
    return res.data || [];
  },

  async getCustomerById(id) {
    const res = await apiRequest(`/api/customers?id=${encodeURIComponent(id)}`);
    return res.data;
  },

  async addCustomer(customerData) {
    const res = await apiRequest('/api/customers', {
      method: 'POST',
      body: JSON.stringify(customerData)
    });
    return res.data;
  },

  async updateCustomer(id, customerData) {
    const res = await apiRequest(`/api/customers?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(customerData)
    });
    return res.data;
  },

  async toggleCustomerStatus(id) {
    const res = await apiRequest(`/api/customers?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'toggle_status' })
    });
    return res;
  },

  async addCustomerNote(id, noteText, author = 'admin') {
    const note = {
      id: `note-${Date.now()}`,
      text: noteText,
      author,
      date: new Date().toLocaleDateString('tr-TR')
    };
    const res = await apiRequest(`/api/customers?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'add_note', note })
    });
    return res;
  },

  async deleteCustomer(id) {
    return await apiRequest(`/api/customers?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  // ==========================================
  // 3. SUNUCULAR (SERVERS)
  // ==========================================
  async getServers(customerId) {
    const query = customerId ? `?customer_id=${encodeURIComponent(customerId)}` : '';
    const res = await apiRequest(`/api/servers${query}`);
    return res.data || [];
  },

  async getServerById(id) {
    const res = await apiRequest(`/api/servers?id=${encodeURIComponent(id)}`);
    return res.data;
  },

  async createServer(serverData) {
    const res = await apiRequest('/api/servers', {
      method: 'POST',
      body: JSON.stringify(serverData)
    });
    return res.data;
  },

  async powerServer(id, newStatus) {
    const res = await apiRequest(`/api/servers?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'power', status: newStatus })
    });
    return res;
  },

  async addServerSnapshot(id, snapshot) {
    const res = await apiRequest(`/api/servers?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'add_snapshot', snapshot })
    });
    return res;
  },

  async updateServer(id, updateData) {
    const res = await apiRequest(`/api/servers?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
    return res.data;
  },

  // ==========================================
  // 4. ÜRÜNLER VE PAKETLER (PRODUCTS)
  // ==========================================
  async getProducts() {
    const res = await apiRequest('/api/products');
    return res.data || [];
  },

  async getProductById(id) {
    const res = await apiRequest(`/api/products?id=${encodeURIComponent(id)}`);
    return res.data;
  },

  async addProduct(productData) {
    const res = await apiRequest('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
    return res.data;
  },

  async updateProduct(id, productData) {
    const res = await apiRequest(`/api/products?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
    return res.data;
  },

  async deleteProduct(id) {
    return await apiRequest(`/api/products?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  // ==========================================
  // 5. SİPARİŞLER (ORDERS)
  // ==========================================
  async getOrders(customerId) {
    const query = customerId ? `?customer_id=${encodeURIComponent(customerId)}` : '';
    const res = await apiRequest(`/api/orders${query}`);
    return res.data || [];
  },

  async getOrderById(id) {
    const res = await apiRequest(`/api/orders?id=${encodeURIComponent(id)}`);
    return res.data;
  },

  async createOrder(orderData) {
    const res = await apiRequest('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
    return res.data;
  },

  async updateOrderStatus(id, provisionStatus, adminNotes, assignedServerId) {
    const res = await apiRequest(`/api/orders?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({
        provisionStatus,
        adminNotes,
        assignedServerId
      })
    });
    return res.data;
  },

  // ==========================================
  // 6. FATURALAR (INVOICES)
  // ==========================================
  async getInvoices(customerId) {
    const query = customerId ? `?customer_id=${encodeURIComponent(customerId)}` : '';
    const res = await apiRequest(`/api/invoices${query}`);
    return res.data || [];
  },

  async getInvoiceById(id) {
    const res = await apiRequest(`/api/invoices?id=${encodeURIComponent(id)}`);
    return res.data;
  },

  async createInvoice(invoiceData) {
    const res = await apiRequest('/api/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData)
    });
    return res.data;
  },

  async updateInvoiceStatus(id, status, paymentMethod = 'Kredi Bakiyesi', receiptUrl = null) {
    const res = await apiRequest(`/api/invoices?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({
        status,
        paymentMethod,
        paidAt: status === 'Ödendi' ? new Date().toLocaleDateString('tr-TR') : null,
        receiptUrl
      })
    });
    return res.data;
  },

  // ==========================================
  // 7. DESTEK TALEPLERİ (TICKETS)
  // ==========================================
  async getTickets(customerId) {
    const query = customerId ? `?customer_id=${encodeURIComponent(customerId)}` : '';
    const res = await apiRequest(`/api/tickets${query}`);
    return res.data || [];
  },

  async getTicketById(id) {
    const res = await apiRequest(`/api/tickets?id=${encodeURIComponent(id)}`);
    return res.data;
  },

  async createTicket(ticketData) {
    const res = await apiRequest('/api/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData)
    });
    return res.data;
  },

  async replyTicket(ticketId, replyText, isStaff = false, extra = {}) {
    const res = await apiRequest(`/api/tickets?id=${encodeURIComponent(ticketId)}`, {
      method: 'PUT',
      body: JSON.stringify({
        action: 'reply',
        replyText,
        isStaff,
        sender: extra.sender,
        role: extra.role,
        avatar: extra.avatar,
        attachments: extra.attachments || []
      })
    });
    return res.data;
  },

  async addTicketNote(ticketId, noteText, author = 'Admin') {
    return await apiRequest(`/api/tickets?id=${encodeURIComponent(ticketId)}`, {
      method: 'PUT',
      body: JSON.stringify({
        action: 'add_note',
        noteText,
        author
      })
    });
  },

  async updateTicketStatus(ticketId, status) {
    const res = await apiRequest(`/api/tickets?id=${encodeURIComponent(ticketId)}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    return res.data;
  },

  async updateTicketPriority(ticketId, priority) {
    const res = await apiRequest(`/api/tickets?id=${encodeURIComponent(ticketId)}`, {
      method: 'PUT',
      body: JSON.stringify({ priority })
    });
    return res.data;
  },

  // ==========================================
  // 8. ÖDEMELER VE DENETİM (PAYMENTS & AUDIT)
  // ==========================================
  async getPayments() {
    const res = await apiRequest('/api/payments');
    return res.data || [];
  },

  async getAuditLogs() {
    const res = await apiRequest('/api/audit');
    return res.data || [];
  },

  async logAudit(action, target, details, userName = 'Kullanıcı') {
    return await apiRequest('/api/audit', {
      method: 'POST',
      body: JSON.stringify({
        action,
        target,
        details,
        userName
      })
    }).catch(() => {});
  },

  // ==========================================
  // 9. VERCEL BLOB DOSYA YÜKLEME (DOSYA / MEDYA)
  // ==========================================
  /**
   * Dosyayı (File nesnesi veya base64 string) Vercel Blob'a yükler.
   * @param {File|string} fileInput - File nesnesi veya base64 string
   * @param {string} filename - Örn: 'dekont.jpg' veya 'hata-ekrani.png'
   * @param {string} category - 'receipt' | 'ticket' | 'general'
   * @returns {Promise<{ url: string, pathname: string, size: number }>}
   */
  async uploadFile(fileInput, filename, category = 'general') {
    let fileData = '';
    let contentType = 'application/octet-stream';
    let cleanName = filename || 'dosya';

    if (fileInput instanceof File || fileInput instanceof Blob) {
      cleanName = fileInput.name || cleanName;
      contentType = fileInput.type || contentType;
      fileData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(fileInput);
      });
    } else if (typeof fileInput === 'string') {
      fileData = fileInput;
    }

    const res = await apiRequest('/api/upload', {
      method: 'POST',
      body: JSON.stringify({
        filename: cleanName,
        file: fileData,
        contentType,
        category
      })
    });

    return res.data;
  }
};
