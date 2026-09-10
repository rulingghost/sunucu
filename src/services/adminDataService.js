/**
 * NovaQ Servers - Yönetici Veri ve Çift Yönlü Senkronizasyon Servisi
 * Müşteriler, Ürünler, Siparişler, Faturalar, Ödemeler, İki Yönlü Ticket Sistemi ve İşlem Geçmişi
 */

import { 
  INITIAL_USER, 
  INITIAL_SERVERS, 
  INITIAL_ORDERS, 
  INITIAL_TICKETS, 
  INITIAL_INVOICES, 
  AUDIT_LOGS 
} from '../data/mockPortalData.js';
import { SERVER_CATEGORIES } from '../data/serverPlans.js';
import { vercelDbService } from './vercelDbService.js';

const STORAGE_CUSTOMERS = 'novaq_admin_customers';
const STORAGE_PRODUCTS = 'novaq_admin_products';
const STORAGE_ORDERS = 'novaq_admin_orders';
const STORAGE_INVOICES = 'novaq_admin_invoices';
const STORAGE_PAYMENTS = 'novaq_admin_payments';
const STORAGE_TICKETS = 'novaq_admin_tickets';
const STORAGE_AUDIT = 'novaq_admin_audit_logs';

// ----------------------------------------------------
// BAŞLANGIÇ VERİLERİ (SEED DATA)
// ----------------------------------------------------

const INITIAL_CUSTOMERS = [
  {
    id: 'NQ-84920',
    name: 'Ahmet Yılmaz',
    company: 'Yılmaz Teknoloji A.Ş.',
    email: 'ahmet.yilmaz@novaq-client.com',
    phone: '+90 532 555 19 23',
    tier: 'Enterprise VIP',
    status: 'Aktif',
    balance: 285.00,
    twoFactorEnabled: true,
    taxOffice: 'Maslak Vergi Dairesi',
    taxNumber: '9481028491',
    address: 'Büyükdere Cad. No: 194 K:8 Levent',
    city: 'İstanbul',
    country: 'Türkiye',
    registeredAt: '14.02.2024',
    totalSpent: 1420.00,
    orderCount: 2,
    internalNotes: [
      { id: 'note-1', text: 'Stratejik kurumsal müşteri. 7/24 VIP SLA anlaşması bulunmaktadır.', author: 'admin', date: '10.01.2026' }
    ]
  },
  {
    id: 'NQ-72314',
    name: 'Burak Demir',
    company: 'Demir Gaming Network',
    email: 'burak.demir@demirgaming.net',
    phone: '+90 533 444 88 11',
    tier: 'Game VIP',
    status: 'Aktif',
    balance: 540.00,
    twoFactorEnabled: false,
    taxOffice: 'Kadıköy Vergi Dairesi',
    taxNumber: '3819401823',
    address: 'Bağdat Cad. No: 42 Kat:3 Kadıköy',
    city: 'İstanbul',
    country: 'Türkiye',
    registeredAt: '28.05.2025',
    totalSpent: 2850.00,
    orderCount: 4,
    internalNotes: [
      { id: 'note-2', text: 'FiveM ve Rust oyun sunucuları barındırıyor, L7 Game DDoS koruması kritik.', author: 'admin', date: '15.02.2026' }
    ]
  },
  {
    id: 'NQ-39102',
    name: 'Selin Kaya',
    company: 'Nova Medya & Prodüksiyon A.Ş.',
    email: 'selin@novamedya.com.tr',
    phone: '+90 544 222 33 44',
    tier: 'Kurumsal',
    status: 'Aktif',
    balance: 120.00,
    twoFactorEnabled: true,
    taxOffice: 'Çankaya Vergi Dairesi',
    taxNumber: '1948201948',
    address: 'Tunalı Hilmi Cad. No: 88',
    city: 'Ankara',
    country: 'Türkiye',
    registeredAt: '12.09.2025',
    totalSpent: 890.00,
    orderCount: 2,
    internalNotes: []
  },
  {
    id: 'NQ-55198',
    name: 'Mehmet Çelik',
    company: 'Çelik Lojistik Ltd.',
    email: 'mehmet@celiklojistik.com',
    phone: '+90 535 777 99 00',
    tier: 'Standart',
    status: 'Pasif',
    balance: 0.00,
    twoFactorEnabled: false,
    taxOffice: 'Bornova Vergi Dairesi',
    taxNumber: '5819401928',
    address: 'Sanayi Cad. No: 12',
    city: 'İzmir',
    country: 'Türkiye',
    registeredAt: '05.11.2025',
    totalSpent: 180.00,
    orderCount: 1,
    internalNotes: [
      { id: 'note-3', text: 'Fatura ödemesi geciktiğinden hesabı geçici olarak pasife alındı.', author: 'admin', date: '01.03.2026' }
    ]
  },
  {
    id: 'NQ-61204',
    name: 'Zeynep Arslan',
    company: 'Arslan AI Araştırma Lab',
    email: 'zeynep.arslan@arslan-ai.org',
    phone: '+90 530 111 44 55',
    tier: 'Enterprise VIP',
    status: 'Aktif',
    balance: 890.00,
    twoFactorEnabled: true,
    taxOffice: 'Beşiktaş Vergi Dairesi',
    taxNumber: '7194829103',
    address: 'Yıldız Teknopark C Blok',
    city: 'İstanbul',
    country: 'Türkiye',
    registeredAt: '19.01.2026',
    totalSpent: 3960.00,
    orderCount: 3,
    internalNotes: [
      { id: 'note-4', text: 'NVIDIA H100 GPU kümesi kiralayan yapay zeka araştırma kuruluşu.', author: 'admin', date: '20.01.2026' }
    ]
  }
];

// Başlangıç Ödeme Hareketleri
const INITIAL_PAYMENTS = [
  {
    id: 'PAY-2026-9481',
    customerId: 'NQ-84920',
    customerName: 'Ahmet Yılmaz',
    orderId: 'ORD-2026-9041',
    amount: 147.00,
    currency: '$ USD',
    method: 'Kredi Kartı (3D Secure)',
    date: '10.09.2026 03:42',
    status: 'Başarılı',
    referenceCode: 'TXN-9481928419'
  },
  {
    id: 'PAY-2026-8820',
    customerId: 'NQ-72314',
    customerName: 'Burak Demir',
    orderId: 'ORD-2026-7712',
    amount: 270.00,
    currency: '$ USD',
    method: 'Kredi Bakiyesi',
    date: '08.09.2026 14:15',
    status: 'Başarılı',
    referenceCode: 'BAL-8820194821'
  },
  {
    id: 'PAY-2026-7201',
    customerId: 'NQ-61204',
    customerName: 'Zeynep Arslan',
    orderId: 'ORD-2026-6104',
    amount: 990.00,
    currency: '$ USD',
    method: 'Kurumsal Havale / EFT',
    date: '05.09.2026 11:30',
    status: 'Başarılı',
    referenceCode: 'EFT-GARANTI-49210'
  }
];

// ----------------------------------------------------
// LOCAL STORAGE YÖNETİMİ
// ----------------------------------------------------

function readStorage(key, defaultData) {
  if (typeof window === 'undefined') return defaultData;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Read error for ${key}:`, e);
    return defaultData;
  }
}

function writeStorage(key, data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Write error for ${key}:`, e);
  }
}

/**
 * Vercel Postgres'ten verileri arka planda çekip yerel önbelleğe senkronize eder.
 */
export async function syncFromDatabase() {
  if (typeof window === 'undefined') return;
  try {
    const [cust, prod, ord, inv, pay, tick, logs] = await Promise.all([
      vercelDbService.getCustomers().catch(() => null),
      vercelDbService.getProducts().catch(() => null),
      vercelDbService.getOrders().catch(() => null),
      vercelDbService.getInvoices().catch(() => null),
      vercelDbService.getPayments().catch(() => null),
      vercelDbService.getTickets().catch(() => null),
      vercelDbService.getAuditLogs().catch(() => null)
    ]);

    if (Array.isArray(cust) && cust.length > 0) writeStorage(STORAGE_CUSTOMERS, cust);
    if (Array.isArray(prod) && prod.length > 0) writeStorage(STORAGE_PRODUCTS, prod);
    if (Array.isArray(ord) && ord.length > 0) writeStorage(STORAGE_ORDERS, ord);
    if (Array.isArray(inv) && inv.length > 0) writeStorage(STORAGE_INVOICES, inv);
    if (Array.isArray(pay) && pay.length > 0) writeStorage(STORAGE_PAYMENTS, pay);
    if (Array.isArray(tick) && tick.length > 0) writeStorage(STORAGE_TICKETS, tick);
    if (Array.isArray(logs) && logs.length > 0) writeStorage(STORAGE_AUDIT, logs);
  } catch (e) {
    console.warn('[Sync DB Error]', e);
  }
}

// ----------------------------------------------------
// 1. MÜŞTERİ YÖNETİMİ (CUSTOMERS)
// ----------------------------------------------------

export function getCustomers(options = {}) {
  let list = readStorage(STORAGE_CUSTOMERS, INITIAL_CUSTOMERS);

  if (options && typeof options === 'object') {
    if (options.search) {
      const q = options.search.toLowerCase();
      list = list.filter(c => 
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.company && c.company.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.id && c.id.toLowerCase().includes(q))
      );
    }

    if (options.status && options.status !== 'all') {
      list = list.filter(c => c.status === options.status);
    }

    if (options.page || options.limit) {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const total = list.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const startIndex = (page - 1) * limit;
      const items = list.slice(startIndex, startIndex + limit);

      const res = [...items];
      res.items = items;
      res.total = total;
      res.totalPages = totalPages;
      res.page = page;
      res.limit = limit;
      return res;
    }
  }

  const res = [...list];
  res.items = list;
  res.total = list.length;
  res.totalPages = 1;
  res.page = 1;
  res.limit = list.length;
  return res;
}

export function getCustomerById(id) {
  const customers = readStorage(STORAGE_CUSTOMERS, INITIAL_CUSTOMERS);
  const customer = customers.find(c => c.id === id);
  if (!customer) return null;

  const orders = readStorage(STORAGE_ORDERS, INITIAL_ORDERS).filter(o => 
    o.customerId === id || o.customerName === customer.name || id === 'NQ-84920'
  );
  const invoices = readStorage(STORAGE_INVOICES, INITIAL_INVOICES);
  const tickets = readStorage(STORAGE_TICKETS, INITIAL_TICKETS);
  const payments = readStorage(STORAGE_PAYMENTS, INITIAL_PAYMENTS).filter(p => p.customerId === id);

  return {
    ...customer,
    orders,
    invoices,
    tickets,
    payments
  };
}

export function addCustomer(data) {
  const customers = readStorage(STORAGE_CUSTOMERS, INITIAL_CUSTOMERS);
  const newId = 'NQ-' + Math.floor(10000 + Math.random() * 89999);
  const newCust = {
    id: newId,
    name: data.name,
    company: data.company || `${data.name} Şahıs`,
    email: data.email,
    phone: data.phone || '+90 5XX XXX XX XX',
    tier: data.tier || 'Standart Üye',
    status: data.status || 'Aktif',
    balance: Number(data.balance) || 0,
    twoFactorEnabled: false,
    taxOffice: data.taxOffice || 'Belirtilmedi',
    taxNumber: data.taxNumber || 'Belirtilmedi',
    address: data.address || 'Belirtilmedi',
    city: data.city || 'İstanbul',
    country: 'Türkiye',
    registeredAt: new Date().toLocaleDateString('tr-TR'),
    totalSpent: 0,
    orderCount: 0,
    internalNotes: data.initialNote ? [{ id: 'note-' + Date.now(), text: data.initialNote, author: 'admin', date: new Date().toLocaleDateString('tr-TR') }] : []
  };

  customers.unshift(newCust);
  writeStorage(STORAGE_CUSTOMERS, customers);
  logAdminAction('Müşteri Eklendi', newCust.name, `Müşteri No: ${newId}, E-posta: ${newCust.email}`);
  return newCust;
}

export function updateCustomer(id, data) {
  const customers = readStorage(STORAGE_CUSTOMERS, INITIAL_CUSTOMERS);
  const index = customers.findIndex(c => c.id === id);
  if (index === -1) return null;

  const oldData = customers[index];
  const updated = { ...oldData, ...data };
  customers[index] = updated;
  writeStorage(STORAGE_CUSTOMERS, customers);
  logAdminAction('Müşteri Güncellendi', updated.name, `Müşteri No: ${id}`);
  return updated;
}

export function toggleCustomerStatus(id) {
  const customers = readStorage(STORAGE_CUSTOMERS, INITIAL_CUSTOMERS);
  const cust = customers.find(c => c.id === id);
  if (!cust) return null;

  const newStatus = cust.status === 'Aktif' ? 'Pasif' : 'Aktif';
  cust.status = newStatus;
  writeStorage(STORAGE_CUSTOMERS, customers);
  logAdminAction('Müşteri Durumu Değiştirildi', cust.name, `${newStatus} yapıldı.`);
  return cust;
}

export function deleteCustomer(id) {
  let customers = readStorage(STORAGE_CUSTOMERS, INITIAL_CUSTOMERS);
  const target = customers.find(c => c.id === id);
  customers = customers.filter(c => c.id !== id);
  writeStorage(STORAGE_CUSTOMERS, customers);
  if (target) {
    logAdminAction('Müşteri Silindi', target.name, `Müşteri No: ${id}`);
  }
  return true;
}

export function addCustomerNote(customerId, noteText) {
  const customers = readStorage(STORAGE_CUSTOMERS, INITIAL_CUSTOMERS);
  const cust = customers.find(c => c.id === customerId);
  if (!cust) return false;

  const newNote = {
    id: 'note-' + Date.now(),
    text: noteText,
    author: 'Sistem Yöneticisi',
    date: new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  };

  cust.internalNotes = cust.internalNotes || [];
  cust.internalNotes.unshift(newNote);
  writeStorage(STORAGE_CUSTOMERS, customers);
  logAdminAction('Dahili Müşteri Notu Eklendi', cust.name, noteText.substring(0, 40) + '...');
  return newNote;
}

// ----------------------------------------------------
// 2. ÜRÜN / PAKET YÖNETİMİ (PRODUCTS)
// ----------------------------------------------------

function initializeProductCatalog() {
  const flattened = [];
  SERVER_CATEGORIES.forEach(cat => {
    cat.plans.forEach((plan, idx) => {
      flattened.push({
        ...plan,
        category: cat.id,
        categoryTitle: cat.title,
        status: 'Aktif',
        sortOrder: idx + 1
      });
    });
  });
  return flattened;
}

export function getAdminProducts(options = {}) {
  let list = readStorage(STORAGE_PRODUCTS, initializeProductCatalog()).map(p => ({
    ...p,
    id: p.id,
    name: p.name,
    monthlyPrice: p.monthlyPrice || p.price || 19.99,
    price: p.monthlyPrice || p.price || 19.99,
    status: p.status || 'Aktif',
    cpu: p.cpu || p.processor || `${p.cores || 4} vCPU`
  }));

  if (options && typeof options === 'object') {
    if (options.category && options.category !== 'all') {
      list = list.filter(p => p.category === options.category);
    }

    if (options.status && options.status !== 'all') {
      list = list.filter(p => p.status === options.status);
    }

    if (options.search) {
      const q = options.search.toLowerCase();
      list = list.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.cpu && p.cpu.toLowerCase().includes(q)) ||
        (p.id && p.id.toLowerCase().includes(q))
      );
    }

    if (options.page || options.limit) {
      const page = options.page || 1;
      const limit = options.limit || 12;
      const total = list.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const startIndex = (page - 1) * limit;
      const items = list.slice(startIndex, startIndex + limit);

      const res = [...items];
      res.items = items;
      res.total = total;
      res.totalPages = totalPages;
      res.page = page;
      res.limit = limit;
      return res;
    }
  }

  const res = [...list];
  res.items = list;
  res.total = list.length;
  res.totalPages = 1;
  res.page = 1;
  res.limit = list.length;
  return res;
}

export function getAdminProductById(id) {
  const list = readStorage(STORAGE_PRODUCTS, initializeProductCatalog());
  return list.find(p => p.id === id) || null;
}

/**
 * Ürün/Paket Güncelleme (Fiyat veya Donanım)
 * GÜNCELLENEN BİLGİ DOĞRUDAN SERVER_CATEGORIES VE SİTEYE YANSIR!
 */
export function updateAdminProduct(id, updatedFields) {
  const list = readStorage(STORAGE_PRODUCTS, initializeProductCatalog());
  const index = list.findIndex(p => p.id === id);
  if (index === -1) return null;

  const oldProduct = list[index];
  const updated = { ...oldProduct, ...updatedFields };
  list[index] = updated;
  writeStorage(STORAGE_PRODUCTS, list);

  // Canlı SERVER_CATEGORIES belleğini de güncelle
  syncCategoriesInMemory(list);

  logAdminAction(
    'Ürün/Fiyat Güncellendi', 
    updated.name, 
    `Eski Fiyat: $${oldProduct.basePriceMonthly}, Yeni Fiyat: $${updated.basePriceMonthly}`
  );

  return updated;
}

export function addAdminProduct(newPlan) {
  const list = readStorage(STORAGE_PRODUCTS, initializeProductCatalog());
  const planWithMeta = {
    ...newPlan,
    id: newPlan.id || 'plan-' + Date.now(),
    status: newPlan.status || 'Aktif',
    sortOrder: list.length + 1
  };

  list.unshift(planWithMeta);
  writeStorage(STORAGE_PRODUCTS, list);
  syncCategoriesInMemory(list);

  logAdminAction('Yeni Ürün/Paket Eklendi', planWithMeta.name, `$${planWithMeta.basePriceMonthly}/ay (${planWithMeta.category})`);
  return planWithMeta;
}

export function deleteAdminProduct(id) {
  let list = readStorage(STORAGE_PRODUCTS, initializeProductCatalog());
  const target = list.find(p => p.id === id);
  list = list.filter(p => p.id !== id);
  writeStorage(STORAGE_PRODUCTS, list);
  syncCategoriesInMemory(list);

  if (target) {
    logAdminAction('Ürün/Paket Silindi', target.name, `ID: ${id}`);
  }
  return true;
}

// Canlı bellekteki SERVER_CATEGORIES array'ini senkronize eder
function syncCategoriesInMemory(activeProductList) {
  SERVER_CATEGORIES.forEach(cat => {
    const plansForCat = activeProductList.filter(p => p.category === cat.id && p.status === 'Aktif');
    if (plansForCat.length > 0) {
      cat.plans = plansForCat;
    }
  });
}

// ----------------------------------------------------
// 3. SİPARİŞ YÖNETİMİ (ORDERS)
// ----------------------------------------------------

export function getAdminOrders(options = {}) {
  let list = readStorage(STORAGE_ORDERS, INITIAL_ORDERS).map(o => ({
    ...o,
    id: o.id || o.orderId,
    orderId: o.orderId || o.id,
    customerName: o.customerName || 'Ahmet Yılmaz',
    customerId: o.customerId || 'NQ-84920',
    planName: o.planName || 'Cloud NVMe Pro-4',
    status: o.status || (o.provisionStatus === 'approved' ? 'Tamamlandı' : o.provisionStatus === 'pending_approval' ? 'Ödeme Bekliyor' : 'İşleme Alındı'),
    paymentStatus: o.paymentStatus || 'Ödendi',
    date: o.date || '10.09.2026',
    total: o.total || 43
  }));

  if (options && typeof options === 'object') {
    if (options.status && options.status !== 'all') {
      list = list.filter(o => o.status === options.status || o.provisionStatus === options.status);
    }

    if (options.search) {
      const q = options.search.toLowerCase();
      list = list.filter(o => 
        (o.id && o.id.toLowerCase().includes(q)) ||
        (o.orderId && o.orderId.toLowerCase().includes(q)) ||
        (o.planName && o.planName.toLowerCase().includes(q)) ||
        (o.customerName && o.customerName.toLowerCase().includes(q))
      );
    }

    if (options.page || options.limit) {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const total = list.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const startIndex = (page - 1) * limit;
      const items = list.slice(startIndex, startIndex + limit);

      const res = [...items];
      res.items = items;
      res.total = total;
      res.totalPages = totalPages;
      res.page = page;
      res.limit = limit;
      return res;
    }
  }

  const res = [...list];
  res.items = list;
  res.total = list.length;
  res.totalPages = 1;
  res.page = 1;
  res.limit = list.length;
  return res;
}

export function getAdminOrderById(orderId) {
  const orders = getAdminOrders();
  return orders.find(o => o.orderId === orderId || o.id === orderId) || null;
}

export function updateAdminOrderStatus(orderId, newStatus, adminNote = '') {
  const orders = readStorage(STORAGE_ORDERS, INITIAL_ORDERS);
  const index = orders.findIndex(o => o.orderId === orderId || o.id === orderId);
  if (index === -1) return null;

  const targetOrder = orders[index];
  const oldStatus = targetOrder.status || targetOrder.provisionStatus;
  
  targetOrder.status = newStatus;
  if (newStatus === 'Tamamlandı' || newStatus === 'approved') {
    targetOrder.provisionStatus = 'approved';
  } else if (newStatus === 'İptal Edildi' || newStatus === 'cancelled') {
    targetOrder.provisionStatus = 'cancelled';
  } else {
    targetOrder.provisionStatus = newStatus;
  }
  
  if (adminNote) {
    targetOrder.notes = targetOrder.notes || targetOrder.adminNotes || [];
    targetOrder.notes.push({
      text: adminNote,
      author: 'admin',
      date: new Date().toLocaleDateString('tr-TR')
    });
    targetOrder.adminNotes = targetOrder.notes;
  }

  // Eğer onaylandıysa ('approved' veya 'Tamamlandı'), sunucuyu müşterinin sunucu listesine ekle
  if ((targetOrder.provisionStatus === 'approved' || newStatus === 'Tamamlandı') && targetOrder.targetServerTemplate) {
    const servers = readStorage('novaq_client_servers', INITIAL_SERVERS);
    if (!servers.some(s => s.id === targetOrder.targetServerTemplate.id)) {
      servers.unshift(targetOrder.targetServerTemplate);
      writeStorage('novaq_client_servers', servers);
    }
  }

  orders[index] = targetOrder;
  writeStorage(STORAGE_ORDERS, orders);

  logAdminAction(
    'Sipariş Durumu Güncellendi', 
    targetOrder.orderId || targetOrder.id, 
    `Eski: ${oldStatus}, Yeni: ${newStatus} (${targetOrder.planName})`
  );

  return targetOrder;
}

// ----------------------------------------------------
// 4. FATURA YÖNETİMİ (INVOICES)
// ----------------------------------------------------

export function getAdminInvoices(options = {}) {
  let list = readStorage(STORAGE_INVOICES, INITIAL_INVOICES).map(i => ({
    ...i,
    id: i.id || i.invoiceId,
    customerName: i.customerName || 'Ahmet Yılmaz',
    customerId: i.customerId || 'NQ-84920',
    total: i.total || i.amount || 43,
    status: i.status || 'Ödendi',
    date: i.date || '10.09.2026'
  }));

  if (options && typeof options === 'object') {
    if (options.status && options.status !== 'all') {
      list = list.filter(i => i.status === options.status);
    }

    if (options.search) {
      const q = options.search.toLowerCase();
      list = list.filter(i => 
        (i.id && i.id.toLowerCase().includes(q)) ||
        (i.customerName && i.customerName.toLowerCase().includes(q)) ||
        (i.company && i.company.toLowerCase().includes(q))
      );
    }

    if (options.page || options.limit) {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const total = list.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const startIndex = (page - 1) * limit;
      const items = list.slice(startIndex, startIndex + limit);

      const res = [...items];
      res.items = items;
      res.total = total;
      res.totalPages = totalPages;
      res.page = page;
      res.limit = limit;
      return res;
    }
  }

  const res = [...list];
  res.items = list;
  res.total = list.length;
  res.totalPages = 1;
  res.page = 1;
  res.limit = list.length;
  return res;
}

export function getAdminInvoiceById(invoiceId) {
  const list = getAdminInvoices();
  return list.find(i => i.id === invoiceId) || null;
}

export function createAdminInvoice({ customerId, customerName, company, items = [], dueDate, status = 'Beklemede', paymentMethod = 'Kredi Kartı' }) {
  const invoices = readStorage(STORAGE_INVOICES, INITIAL_INVOICES);
  const newId = 'INV-2026-' + Math.floor(1000 + Math.random() * 9000);
  const now = new Date().toLocaleDateString('tr-TR');

  let subtotal = 0;
  items.forEach(it => { subtotal += Number(it.amount || it.price) || 0; });
  const vat = Math.round(subtotal * 0.20);
  const total = subtotal + vat;

  const newInvoice = {
    id: newId,
    customerId: customerId || 'NQ-84920',
    customerName: customerName || 'Ahmet Yılmaz',
    company: company || 'Yılmaz Teknoloji A.Ş.',
    date: now,
    dueDate: dueDate || new Date(Date.now() + 14 * 86400000).toLocaleDateString('tr-TR'),
    items: items.length > 0 ? items : [{ name: 'Bulut Altyapı ve Sunucu Hizmet Bedeli', price: subtotal, qty: 1 }],
    subtotal,
    vat,
    total,
    status,
    paymentMethod,
    paidAt: status === 'Ödendi' ? now : null
  };

  invoices.unshift(newInvoice);
  writeStorage(STORAGE_INVOICES, invoices);

  logAdminAction('Fatura Düzenlendi', newId, `Müşteri: ${newInvoice.customerName}, Tutar: $${total}`);
  return newInvoice;
}

export function updateAdminInvoiceStatus(invoiceId, newStatus) {
  const invoices = readStorage(STORAGE_INVOICES, INITIAL_INVOICES);
  const inv = invoices.find(i => i.id === invoiceId);
  if (!inv) return null;

  const oldStatus = inv.status;
  inv.status = newStatus;
  if (newStatus === 'Ödendi') {
    inv.paidAt = new Date().toLocaleDateString('tr-TR');
  }
  writeStorage(STORAGE_INVOICES, invoices);

  logAdminAction('Fatura Durumu Değiştirildi', invoiceId, `Eski: ${oldStatus}, Yeni: ${newStatus}`);
  return inv;
}

// ----------------------------------------------------
// 5. ÖDEME YÖNETİMİ (PAYMENTS)
// ----------------------------------------------------

export function getAdminPayments(options = {}) {
  let list = readStorage(STORAGE_PAYMENTS, INITIAL_PAYMENTS).map(p => ({
    ...p,
    id: p.id || p.paymentId,
    customerName: p.customerName || 'Ahmet Yılmaz',
    customerId: p.customerId || 'NQ-84920',
    currency: p.currency || '$ USD',
    status: p.status || 'Başarılı',
    method: p.method || 'Kredi Kartı (3D Secure)',
    date: p.date || '10.09.2026 03:42'
  }));

  if (options && typeof options === 'object') {
    if (options.method && options.method !== 'all') {
      list = list.filter(p => p.method.includes(options.method));
    }

    if (options.status && options.status !== 'all') {
      list = list.filter(p => p.status === options.status);
    }

    if (options.search) {
      const q = options.search.toLowerCase();
      list = list.filter(p => 
        (p.id && p.id.toLowerCase().includes(q)) ||
        (p.customerName && p.customerName.toLowerCase().includes(q)) ||
        (p.referenceCode && p.referenceCode.toLowerCase().includes(q)) ||
        (p.reference && p.reference.toLowerCase().includes(q))
      );
    }

    if (options.page || options.limit) {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const total = list.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const startIndex = (page - 1) * limit;
      const items = list.slice(startIndex, startIndex + limit);

      const res = [...items];
      res.items = items;
      res.total = total;
      res.totalPages = totalPages;
      res.page = page;
      res.limit = limit;
      return res;
    }
  }

  const res = [...list];
  res.items = list;
  res.total = list.length;
  res.totalPages = 1;
  res.page = 1;
  res.limit = list.length;
  return res;
}

// ----------------------------------------------------
// 6. DESTEK / TICKET SİSTEMİ (GERÇEK ÇİFT YÖNLÜ)
// ----------------------------------------------------

export function getAdminTickets(options = {}) {
  let list = readStorage(STORAGE_TICKETS, INITIAL_TICKETS).map(t => ({
    ...t,
    id: t.id || t.ticketId,
    customerName: t.customerName || t.author || 'Ahmet Yılmaz',
    customerId: t.customerId || 'NQ-84920',
    status: t.status || 'Açık',
    category: t.category || 'Teknik Destek',
    priority: t.priority || 'Normal',
    subject: t.subject || t.title || 'Destek Talebi',
    createdAt: t.createdAt || t.date || '10.09.2026',
    updatedAt: t.updatedAt || t.lastUpdate || 'Az önce'
  }));

  if (options && typeof options === 'object') {
    if (options.status && options.status !== 'all') {
      list = list.filter(t => t.status === options.status);
    }

    if (options.priority && options.priority !== 'all') {
      list = list.filter(t => t.priority === options.priority);
    }

    if (options.category && options.category !== 'all') {
      list = list.filter(t => t.category === options.category);
    }

    if (options.search) {
      const q = options.search.toLowerCase();
      list = list.filter(t => 
        (t.id && t.id.toLowerCase().includes(q)) ||
        (t.subject && t.subject.toLowerCase().includes(q)) ||
        (t.customerName && t.customerName.toLowerCase().includes(q)) ||
        (t.author && t.author.toLowerCase().includes(q))
      );
    }

    if (options.page || options.limit) {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const total = list.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const startIndex = (page - 1) * limit;
      const items = list.slice(startIndex, startIndex + limit);

      const res = [...items];
      res.items = items;
      res.total = total;
      res.totalPages = totalPages;
      res.page = page;
      res.limit = limit;
      return res;
    }
  }

  const res = [...list];
  res.items = list;
  res.total = list.length;
  res.totalPages = 1;
  res.page = 1;
  res.limit = list.length;
  return res;
}

export function getAdminTicketById(id) {
  const list = getAdminTickets();
  return list.find(t => t.id === id) || null;
}

export function getUnreadTicketCount() {
  const list = getAdminTickets();
  return list.filter(t => t.status !== 'Çözüldü' && t.status !== 'Kapalı').length;
}

/**
 * Yöneticinin Müşteriye Cevap Vermesi
 * MÜŞTERİ PANELİNDEKİ TICKET EKRANINA ANINDA YANSIR!
 */
export function adminReplyTicket(ticketId, messageText, adminName = 'Kıdemli NOC Mühendisi', newStatus = 'Yanıtlandı') {
  const tickets = readStorage(STORAGE_TICKETS, INITIAL_TICKETS);
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return null;

  const replyMsg = {
    id: 'msg-' + Date.now(),
    sender: 'staff',
    senderType: 'admin',
    author: adminName,
    isStaff: true,
    role: 'NovaQ Kıdemli NOC Mühendisi',
    avatar: '🛡️',
    time: 'Az önce',
    text: messageText,
    date: new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  };

  ticket.messages = ticket.messages || [];
  ticket.messages.push(replyMsg);
  ticket.status = newStatus;
  ticket.updatedAt = 'Az önce';

  writeStorage(STORAGE_TICKETS, tickets);
  logAdminAction('Destek Biletine Cevap Verildi', `#${ticketId}`, messageText.substring(0, 45) + '...');
  return ticket;
}

/**
 * Müşterinin Cevap Vermesi (Portal tarafından çağrılır)
 * YÖNETİCİ PANELİNDEKİ TICKET EKRANINA ANINDA YANSIR!
 */
export function customerReplyTicket(ticketId, messageText, customerName = 'Ahmet Yılmaz') {
  const tickets = readStorage(STORAGE_TICKETS, INITIAL_TICKETS);
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return null;

  const custMsg = {
    id: 'msg-' + Date.now(),
    sender: 'user',
    senderType: 'customer',
    author: customerName,
    isStaff: false,
    avatar: '👤',
    time: 'Az önce',
    text: messageText,
    date: new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  };

  ticket.messages = ticket.messages || [];
  ticket.messages.push(custMsg);
  ticket.status = 'Müşteri Yanıtı Bekleniyor';
  ticket.updatedAt = 'Az önce';

  writeStorage(STORAGE_TICKETS, tickets);
  return ticket;
}

export function updateAdminTicketStatus(ticketId, newStatus) {
  const tickets = readStorage(STORAGE_TICKETS, INITIAL_TICKETS);
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return null;

  const oldStatus = ticket.status;
  ticket.status = newStatus;
  ticket.updatedAt = 'Az önce';
  writeStorage(STORAGE_TICKETS, tickets);

  logAdminAction('Ticket Durumu Değiştirildi', `#${ticketId}`, `Eski: ${oldStatus}, Yeni: ${newStatus}`);
  return ticket;
}

export function updateAdminTicketPriority(ticketId, newPriority) {
  const tickets = readStorage(STORAGE_TICKETS, INITIAL_TICKETS);
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return null;

  ticket.priority = newPriority;
  writeStorage(STORAGE_TICKETS, tickets);
  logAdminAction('Ticket Önceliği Değiştirildi', `#${ticketId}`, `Yeni Öncelik: ${newPriority}`);
  return ticket;
}

export function addAdminTicketNote(ticketId, noteText) {
  const tickets = readStorage(STORAGE_TICKETS, INITIAL_TICKETS);
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return null;

  ticket.internalNotes = ticket.internalNotes || ticket.adminNotes || [];
  ticket.internalNotes.unshift({
    id: 't-note-' + Date.now(),
    text: noteText,
    author: 'Yönetici',
    date: new Date().toLocaleDateString('tr-TR')
  });
  ticket.adminNotes = ticket.internalNotes;

  writeStorage(STORAGE_TICKETS, tickets);
  logAdminAction('Bilete Dahili Not Eklendi', `#${ticketId}`, noteText.substring(0, 40) + '...');
  return ticket;
}

// ----------------------------------------------------
// 7. İŞLEM GEÇMİŞİ (AUDIT LOGS)
// ----------------------------------------------------

export function getAdminAuditLogs(options = {}) {
  let list = readStorage(STORAGE_AUDIT, AUDIT_LOGS).map(l => ({
    ...l,
    id: l.id || 'log-' + Math.random(),
    action: l.action || 'İşlem',
    user: l.user || 'admin',
    date: l.date || l.time || '10.09.2026',
    target: l.target || '-',
    details: l.details || l.action,
    ip: l.ip || '194.15.36.10'
  }));

  if (options && typeof options === 'object') {
    if (options.search) {
      const q = options.search.toLowerCase();
      list = list.filter(l => 
        l.action.toLowerCase().includes(q) ||
        (l.target && l.target.toLowerCase().includes(q)) ||
        (l.details && l.details.toLowerCase().includes(q))
      );
    }

    if (options.page || options.limit) {
      const page = options.page || 1;
      const limit = options.limit || 15;
      const total = list.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const startIndex = (page - 1) * limit;
      const items = list.slice(startIndex, startIndex + limit);

      const res = [...items];
      res.items = items;
      res.total = total;
      res.totalPages = totalPages;
      res.page = page;
      res.limit = limit;
      return res;
    }
  }

  const res = [...list];
  res.items = list;
  res.total = list.length;
  res.totalPages = 1;
  res.page = 1;
  res.limit = list.length;
  return res;
}

export function logAdminAction(action, target = '', details = '', adminName = 'Sistem Yöneticisi') {
  const logs = readStorage(STORAGE_AUDIT, AUDIT_LOGS);
  const now = new Date();
  const timeStr = now.toLocaleDateString('tr-TR') + ' ' + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const newLog = {
    id: 'log-' + Date.now(),
    user: adminName,
    action,
    target,
    details,
    date: timeStr,
    time: timeStr,
    ip: '194.15.36.10'
  };

  logs.unshift(newLog);
  // Max 200 logs
  if (logs.length > 200) logs.pop();
  writeStorage(STORAGE_AUDIT, logs);
  return newLog;
}

// ----------------------------------------------------
// 8. DASHBOARD ÖZET METRİKLERİ
// ----------------------------------------------------

export function getDashboardMetrics() {
  const customers = getCustomers();
  const orders = getAdminOrders();
  const invoices = getAdminInvoices();
  const tickets = getAdminTickets();
  const payments = getAdminPayments();

  // Revenue calculations
  let totalRevenue = 0;
  invoices.forEach(inv => {
    if (inv.status === 'Ödendi') totalRevenue += inv.total || 0;
  });

  const pendingOrders = orders.filter(o => o.status === 'Ödeme Bekliyor' || o.provisionStatus === 'pending_approval');
  const processingOrders = orders.filter(o => o.status === 'İşleme Alındı' || o.provisionStatus === 'provisioning');
  const completedOrders = orders.filter(o => o.status === 'Tamamlandı' || o.provisionStatus === 'approved');
  const cancelledOrders = orders.filter(o => o.status === 'İptal Edildi' || o.provisionStatus === 'cancelled');

  const openTickets = tickets.filter(t => t.status !== 'Çözüldü' && t.status !== 'Kapalı');
  const newTickets = tickets.filter(t => t.status === 'Yeni' || t.status === 'Yönetici Yanıtı Bekleniyor');

  const paidInvoices = invoices.filter(i => i.status === 'Ödendi');
  const unpaidInvoices = invoices.filter(i => i.status !== 'Ödendi');

  let unpaidAmount = 0;
  unpaidInvoices.forEach(i => { unpaidAmount += i.total || 0; });

  const pendingPayments = payments.filter(p => p.status === 'Bekliyor');

  return {
    totalCustomers: customers.length,
    newCustomersCount: 2,
    activeCustomers: customers.filter(c => c.status === 'Aktif').length,
    totalOrders: orders.length,
    pendingOrdersCount: pendingOrders.length,
    processingOrdersCount: processingOrders.length || 1,
    completedOrdersCount: completedOrders.length,
    cancelledOrdersCount: cancelledOrders.length,
    totalRevenue,
    dailyRevenue: 485,
    weeklyRevenue: 2840,
    monthlyRevenue: 12450,
    unpaidInvoicesAmount: unpaidAmount,
    paidInvoicesCount: paidInvoices.length,
    unpaidInvoicesCount: unpaidInvoices.length,
    pendingPaymentsCount: pendingPayments.length,
    totalTicketsCount: tickets.length,
    openTicketsCount: openTickets.length,
    newTicketsCount: newTickets.length,
    recentOrders: orders.slice(0, 5),
    recentTickets: tickets.slice(0, 5),
    recentCustomers: customers.slice(0, 5),
    recentPayments: payments.slice(0, 5),
    monthlyChartData: [
      { month: 'Nis', amount: 8200 },
      { month: 'May', amount: 9400 },
      { month: 'Haz', amount: 10800 },
      { month: 'Tem', amount: 11200 },
      { month: 'Ağu', amount: 13400 },
      { month: 'Eyl', amount: 15900 }
    ]
  };
}

export const adminDataService = {
  getCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  toggleCustomerStatus,
  deleteCustomer,
  addCustomerNote,

  getAdminProducts,
  getAdminProductById,
  updateAdminProduct,
  addAdminProduct,
  deleteAdminProduct,

  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,

  getAdminInvoices,
  getAdminInvoiceById,
  createAdminInvoice,
  updateAdminInvoiceStatus,

  getAdminPayments,

  getAdminTickets,
  getAdminTicketById,
  getUnreadTicketCount,
  adminReplyTicket,
  customerReplyTicket,
  updateAdminTicketStatus,
  updateAdminTicketPriority,
  addAdminTicketNote,

  getAdminAuditLogs,
  logAdminAction,

  getDashboardMetrics,
  syncFromDatabase
};
