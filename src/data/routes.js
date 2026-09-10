// SEO Route Definitions & Flat HTML Path Mapping
export const ROUTE_MAP = {
  home: { path: '/', title: 'NovaQ Servers | Kurumsal Sunucu Kiralama & Bulut Altyapısı' },
  vds: { path: '/sanal-sunucu.html', title: 'NVMe Sanal Sunucu (VDS) Kiralama | Kurumsal Bulut - NovaQ Servers' },
  extreme: { path: '/extreme-sunucu.html', title: 'Extreme Ryzen 9 VDS Kiralama | 5.7 GHz AMD Ryzen 9 9950X - NovaQ Servers' },
  dedicated: { path: '/fiziksel-sunucu.html', title: 'Fiziksel Dedicated Sunucu Kiralama | %100 Bare-Metal - NovaQ Servers' },
  gpu: { path: '/ekran-kartli-sunucu.html', title: 'Ekran Kartlı Sunucu (GPU Cloud) Kiralama | AI & Render - NovaQ Servers' },
  datacenters: { path: '/veri-merkezleri.html', title: 'Veri Merkezlerimiz & Canlı Looking Glass Ping Testi - NovaQ Servers' },
  about: { path: '/hakkimizda.html', title: 'Hakkımızda | NovaQ Servers Kurumsal Profil ve Altyapı' },
  contact: { path: '/iletisim.html', title: 'İletişim & Ofislerimiz | 7/24 NOC Destek Hattı - NovaQ Servers' },
  terms: { path: '/hizmet-sozlesmesi.html', title: 'Hizmet Sözleşmesi ve %99.99 SLA Taahhüdü | NovaQ Servers' },
  privacy: { path: '/gizlilik-politikasi.html', title: 'Gizlilik Politikası ve Veri Güvenliği | NovaQ Servers' },
  kvkk: { path: '/kvkk-aydinlatma-metni.html', title: 'KVKK Aydınlatma Metni (6698 Sayılı Kanun) | NovaQ Servers' },
  cookies: { path: '/cerez-politikasi.html', title: 'Yasal Çerez Kullanımı ve Yönetim Politikası | NovaQ Servers' },
  
  // Client Portal Routes
  'panel-dashboard': { path: '/panel', title: 'Genel Bakış | Müşteri Paneli - NovaQ Servers' },
  'panel-servers': { path: '/panel/servers', title: 'Sunucu Yönetimi & Bulut VDS | Müşteri Paneli - NovaQ Servers' },
  'panel-orders': { path: '/panel/orders', title: 'Siparişler & Kurulum Onay Takibi | Müşteri Paneli - NovaQ Servers' },
  'panel-tickets': { path: '/panel/tickets', title: '7/24 Teknik Destek & Biletler | Müşteri Paneli - NovaQ Servers' },
  'panel-invoices': { path: '/panel/invoices', title: 'Faturalar & Bakiye Yönetimi | Müşteri Paneli - NovaQ Servers' },
  'panel-security': { path: '/panel/security', title: 'Hesap Güvenliği & Profil | Müşteri Paneli - NovaQ Servers' },
  'panel-checkout': { path: '/panel/checkout', title: 'Güvenli Sipariş & Ödeme | Müşteri Paneli - NovaQ Servers' },

  // Auth Routes
  login: { path: '/login', title: 'Müşteri Girişi | NovaQ Servers' },
  register: { path: '/register', title: 'Yeni Müşteri Kaydı | NovaQ Servers' },

  // Yönetici Paneli Rotaları (Kesinlikle /yonetici prefix'i)
  'yonetici-giris': { path: '/yonetici/giris', title: 'Yönetici Girişi | NovaQ Servers' },
  'yonetici-dashboard': { path: '/yonetici/dashboard', title: 'Yönetici Kontrol Paneli | NovaQ Servers' },
  'yonetici-musteriler': { path: '/yonetici/musteriler', title: 'Müşteri Yönetimi | NovaQ Yönetici' },
  'yonetici-musteri-detay': { path: '/yonetici/musteriler', title: 'Müşteri Detayı | NovaQ Yönetici' },
  'yonetici-urunler': { path: '/yonetici/urunler', title: 'Ürün & Paket Yönetimi | NovaQ Yönetici' },
  'yonetici-urun-detay': { path: '/yonetici/urunler', title: 'Ürün Düzenle | NovaQ Yönetici' },
  'yonetici-urunler-yeni': { path: '/yonetici/urunler/yeni', title: 'Yeni Ürün Ekle | NovaQ Yönetici' },
  'yonetici-siparisler': { path: '/yonetici/siparisler', title: 'Sipariş Yönetimi | NovaQ Yönetici' },
  'yonetici-siparis-detay': { path: '/yonetici/siparisler', title: 'Sipariş Detayı | NovaQ Yönetici' },
  'yonetici-faturalar': { path: '/yonetici/faturalar', title: 'Fatura Yönetimi | NovaQ Yönetici' },
  'yonetici-fatura-detay': { path: '/yonetici/faturalar', title: 'Fatura Detayı | NovaQ Yönetici' },
  'yonetici-odemeler': { path: '/yonetici/odemeler', title: 'Ödeme Hareketleri | NovaQ Yönetici' },
  'yonetici-ticketlar': { path: '/yonetici/ticketlar', title: 'Destek Masası & NOC | NovaQ Yönetici' },
  'yonetici-ticket-detay': { path: '/yonetici/ticketlar', title: 'Bilet İncele & Yanıtla | NovaQ Yönetici' },
  'yonetici-islem-gecmisi': { path: '/yonetici/islem-gecmisi', title: 'İşlem Denetim Kayıtları | NovaQ Yönetici' },
  'yonetici-profil': { path: '/yonetici/profil', title: 'Yönetici Profili | NovaQ Yönetici' }
};

export const PATH_TO_PAGE = {
  '/': 'home',
  '/index.html': 'home',
  '/sanal-sunucu.html': 'vds',
  '/sanal-sunucu': 'vds',
  '/extreme-sunucu.html': 'extreme',
  '/extreme-sunucu': 'extreme',
  '/fiziksel-sunucu.html': 'dedicated',
  '/fiziksel-sunucu': 'dedicated',
  '/ekran-kartli-sunucu.html': 'gpu',
  '/ekran-kartli-sunucu': 'gpu',
  '/veri-merkezleri.html': 'datacenters',
  '/veri-merkezleri': 'datacenters',
  '/hakkimizda.html': 'about',
  '/hakkimizda': 'about',
  '/iletisim.html': 'contact',
  '/iletisim': 'contact',
  '/hizmet-sozlesmesi.html': 'terms',
  '/hizmet-sozlesmesi': 'terms',
  '/gizlilik-politikasi.html': 'privacy',
  '/gizlilik-politikasi': 'privacy',
  '/kvkk-aydinlatma-metni.html': 'kvkk',
  '/kvkk-aydinlatma-metni': 'kvkk',
  '/cerez-politikasi.html': 'cookies',
  '/cerez-politikasi': 'cookies',

  // Client Portal Path Mappings
  '/panel': 'panel-dashboard',
  '/panel/': 'panel-dashboard',
  '/panel.html': 'panel-dashboard',
  '/panel/dashboard': 'panel-dashboard',
  '/panel/servers': 'panel-servers',
  '/panel/orders': 'panel-orders',
  '/panel/tickets': 'panel-tickets',
  '/panel/invoices': 'panel-invoices',
  '/panel/payments': 'panel-invoices',
  '/panel/security': 'panel-security',
  '/panel/profile': 'panel-security',
  '/panel/settings': 'panel-security',
  '/panel/checkout': 'panel-checkout',

  // Auth Path Mappings
  '/login': 'login',
  '/login.html': 'login',
  '/register': 'register',
  '/register.html': 'register',

  // Yönetici Paneli Path Mappings
  '/yonetici': 'yonetici-dashboard',
  '/yonetici/': 'yonetici-dashboard',
  '/yonetici.html': 'yonetici-dashboard',
  '/yonetici/giris': 'yonetici-giris',
  '/yonetici/dashboard': 'yonetici-dashboard',
  '/yonetici/musteriler': 'yonetici-musteriler',
  '/yonetici/urunler': 'yonetici-urunler',
  '/yonetici/urunler/yeni': 'yonetici-urunler-yeni',
  '/yonetici/siparisler': 'yonetici-siparisler',
  '/yonetici/faturalar': 'yonetici-faturalar',
  '/yonetici/odemeler': 'yonetici-odemeler',
  '/yonetici/ticketlar': 'yonetici-ticketlar',
  '/yonetici/destek': 'yonetici-ticketlar',
  '/yonetici/islem-gecmisi': 'yonetici-islem-gecmisi',
  '/yonetici/profil': 'yonetici-profil'
};

/**
 * Resolves a given URL pathname to pageId and any extracted params
 */
export function resolveRoute(pathname) {
  if (!pathname) return { page: 'home', params: {} };
  const cleanPath = pathname.toLowerCase().replace(/\/$/, '') || '/';

  if (PATH_TO_PAGE[cleanPath]) {
    return { page: PATH_TO_PAGE[cleanPath], params: {} };
  }

  // Handle /panel/servers/:id
  const serverMatch = cleanPath.match(/^\/panel\/servers\/([^\/]+)$/);
  if (serverMatch) {
    return { page: 'panel-servers', params: { serverId: serverMatch[1] } };
  }

  // Handle /panel/orders/:id
  const orderMatch = cleanPath.match(/^\/panel\/orders\/([^\/]+)$/);
  if (orderMatch) {
    return { page: 'panel-orders', params: { orderId: orderMatch[1] } };
  }

  // Handle /yonetici/musteriler/:id
  const adminCustMatch = cleanPath.match(/^\/yonetici\/musteriler\/([^\/]+)$/);
  if (adminCustMatch) {
    return { page: 'yonetici-musteri-detay', params: { id: adminCustMatch[1] } };
  }

  // Handle /yonetici/urunler/:id
  const adminProdMatch = cleanPath.match(/^\/yonetici\/urunler\/([^\/]+)$/);
  if (adminProdMatch && adminProdMatch[1] !== 'yeni') {
    return { page: 'yonetici-urun-detay', params: { id: adminProdMatch[1] } };
  }

  // Handle /yonetici/siparisler/:id
  const adminOrderMatch = cleanPath.match(/^\/yonetici\/siparisler\/([^\/]+)$/);
  if (adminOrderMatch) {
    return { page: 'yonetici-siparis-detay', params: { id: adminOrderMatch[1] } };
  }

  // Handle /yonetici/faturalar/:id
  const adminInvMatch = cleanPath.match(/^\/yonetici\/faturalar\/([^\/]+)$/);
  if (adminInvMatch) {
    return { page: 'yonetici-fatura-detay', params: { id: adminInvMatch[1] } };
  }

  // Handle /yonetici/ticketlar/:id or /yonetici/destek/:id
  const adminTckMatch = cleanPath.match(/^\/yonetici\/(?:ticketlar|destek)\/([^\/]+)$/);
  if (adminTckMatch) {
    return { page: 'yonetici-ticket-detay', params: { id: adminTckMatch[1] } };
  }

  return { page: 'home', params: {} };
}


