/**
-- NovaQ Servers - Vercel Postgres Başlangıç Tohumlama Verileri (Seed Data)
*/

export const SEED_CUSTOMERS = [
  {
    id: 'NQ-84920',
    name: 'Ahmet Yılmaz',
    company: 'Yılmaz Teknoloji A.Ş.',
    email: 'ahmet.yilmaz@novaq-client.com',
    phone: '+90 532 555 19 23',
    tier: 'Enterprise VIP',
    status: 'Aktif',
    balance: 3450.00,
    two_factor_enabled: true,
    tax_office: 'Maslak Vergi Dairesi',
    tax_number: '9481028491',
    address: 'Büyükdere Cad. No: 194 K:8 Levent',
    city: 'İstanbul',
    country: 'Türkiye',
    registered_at: '14.02.2024',
    total_spent: 1420.00,
    order_count: 2,
    internal_notes: [
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
    two_factor_enabled: false,
    tax_office: 'Kadıköy Vergi Dairesi',
    tax_number: '3819401823',
    address: 'Bağdat Cad. No: 42 Kat:3 Kadıköy',
    city: 'İstanbul',
    country: 'Türkiye',
    registered_at: '28.05.2025',
    total_spent: 2850.00,
    order_count: 4,
    internal_notes: [
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
    two_factor_enabled: true,
    tax_office: 'Çankaya Vergi Dairesi',
    tax_number: '1948201948',
    address: 'Tunalı Hilmi Cad. No: 88',
    city: 'Ankara',
    country: 'Türkiye',
    registered_at: '12.09.2025',
    total_spent: 890.00,
    order_count: 2,
    internal_notes: []
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
    two_factor_enabled: false,
    tax_office: 'Konak Vergi Dairesi',
    tax_number: '5519284102',
    address: 'Alsancak Mah. 1440 Sok. No: 12',
    city: 'İzmir',
    country: 'Türkiye',
    registered_at: '05.11.2024',
    total_spent: 420.00,
    order_count: 1,
    internal_notes: []
  }
];

export const SEED_SERVERS = [
  {
    id: 'srv-fra-101',
    customer_id: 'NQ-84920',
    name: 'prod-fra-app01',
    hostname: 'app01.novaq-fra.internal',
    plan_name: 'Nova Cloud V3 (EPYC 9454)',
    category: 'nvme-vds',
    status: 'running',
    location: 'Almanya (Frankfurt)',
    flag: '🇩🇪',
    ip: '194.15.36.142',
    gateway: '194.15.36.1',
    netmask: '255.255.255.0',
    rdns: 'mail.yilmazholding.com.tr',
    os: 'Ubuntu 24.04 LTS (x86_64)',
    cores: '8 vCPU @ 4.0 GHz',
    ram: '16 GB DDR5 ECC',
    disk: '250 GB Gen4 NVMe',
    disk_used: '64.8 GB',
    bandwidth_total: 'Sınırsız (10 Gbps)',
    bandwidth_used_month: '4.2 TB',
    uptime: '47 Gün, 14 Saat',
    purchased_at: '15.08.2026',
    renewal_date: '15.10.2026',
    billing_cycle: 'Aylık',
    days_remaining: 35,
    price_monthly: 29.00,
    metrics: {
      cpuHistory: [24, 28, 35, 42, 38, 30, 26, 29, 34, 31, 28, 32],
      ramHistory: [52, 53, 54, 55, 54, 56, 55, 57, 56, 56, 55, 56],
      diskIOHistory: [14, 22, 45, 18, 12, 30, 24, 16, 20, 15, 18, 22],
      netMbps: [140, 180, 220, 195, 310, 280, 190, 240, 260, 290, 220, 275]
    },
    snapshots: [
      { id: 'snp-1', name: 'Pre-Deploy Auto Backup', date: '08.09.2026 03:00', size: '14.2 GB' },
      { id: 'snp-2', name: 'Database Migration Point', date: '01.09.2026 12:45', size: '18.6 GB' }
    ]
  },
  {
    id: 'srv-hk-202',
    customer_id: 'NQ-84920',
    name: 'game-node-asia',
    hostname: 'node-hk.novaq.asia',
    plan_name: 'Ryzen Ultra R2 (Ryzen 9 9950X)',
    category: 'ryzen-vds',
    status: 'running',
    location: 'Hong Kong (Kowloon)',
    flag: '🇭🇰',
    ip: '103.88.221.78',
    gateway: '103.88.221.1',
    netmask: '255.255.255.0',
    rdns: 'asia.gamecluster.net',
    os: 'Debian 12 (Bookworm)',
    cores: '4 Dedicated vCPU @ 5.7 GHz',
    ram: '12 GB DDR5 ECC',
    disk: '180 GB Samsung PM9A3 NVMe',
    disk_used: '42.1 GB',
    bandwidth_total: 'Sınırsız (10 Gbps)',
    bandwidth_used_month: '9.8 TB',
    uptime: '18 Gün, 6 Saat',
    purchased_at: '28.08.2026',
    renewal_date: '28.09.2026',
    billing_cycle: 'Aylık',
    days_remaining: 18,
    price_monthly: 36.00,
    metrics: {
      cpuHistory: [45, 50, 68, 72, 60, 54, 48, 55, 62, 59, 52, 57],
      ramHistory: [68, 70, 71, 69, 70, 72, 71, 73, 72, 70, 69, 71],
      diskIOHistory: [40, 55, 80, 60, 35, 45, 50, 70, 48, 42, 55, 60],
      netMbps: [420, 510, 680, 590, 720, 640, 580, 610, 690, 730, 620, 650]
    },
    snapshots: [
      { id: 'snp-3', name: 'Weekly System Image', date: '07.09.2026 04:00', size: '28.1 GB' }
    ]
  },
  {
    id: 'srv-par-303',
    customer_id: 'NQ-84920',
    name: 'db-cluster-france',
    hostname: 'db-core.novaq-par.internal',
    plan_name: 'Nova Bare-Metal XE1',
    category: 'dedicated',
    status: 'running',
    location: 'Fransa (Paris)',
    flag: '🇫🇷',
    ip: '51.77.104.92',
    gateway: '51.77.104.1',
    netmask: '255.255.255.248',
    rdns: 'backup-sql.holding.fr',
    os: 'Windows Server 2022 Datacenter',
    cores: '32 Core / 64 Thread (Xeon Silver)',
    ram: '64 GB DDR4 ECC Reg',
    disk: '2x 960 GB NVMe HW-RAID1',
    disk_used: '340 GB',
    bandwidth_total: '100 TB (1 Gbps Hat)',
    bandwidth_used_month: '18.4 TB',
    uptime: '89 Gün, 22 Saat',
    purchased_at: '04.08.2026',
    renewal_date: '04.11.2026',
    billing_cycle: '3 Aylık',
    days_remaining: 55,
    price_monthly: 169.00,
    metrics: {
      cpuHistory: [15, 16, 22, 19, 18, 20, 16, 17, 24, 19, 18, 17],
      ramHistory: [44, 45, 44, 45, 46, 45, 44, 45, 45, 46, 45, 45],
      diskIOHistory: [85, 120, 190, 140, 95, 110, 130, 180, 125, 90, 105, 115],
      netMbps: [90, 110, 140, 120, 130, 115, 105, 135, 125, 110, 120, 130]
    },
    snapshots: []
  }
];

export const SEED_PRODUCTS = [
  {
    id: 'vds-1',
    name: 'Nova NVMe V1',
    category: 'nvme-vds',
    cores: '2 vCPU (EPYC 9454)',
    ram: '4 GB DDR5 ECC',
    disk: '60 GB Gen4 NVMe',
    bandwidth: 'Sınırsız (10 Gbps Hat)',
    port: '10 Gbps',
    ddos: '3.2 Tbps Voxility L3/L4/L7',
    price: 9.00,
    monthly_price: 9.00,
    popular: false,
    stock: 24,
    status: 'active',
    features: ['1 Gelişmiş Statik IPv4', 'DDoS Voxility Koruma', 'Otomatik Anlık Yedekleme', 'Gelişmiş Web Terminal']
  },
  {
    id: 'vds-2',
    name: 'Nova NVMe V2',
    category: 'nvme-vds',
    cores: '4 vCPU (EPYC 9454)',
    ram: '8 GB DDR5 ECC',
    disk: '120 GB Gen4 NVMe',
    bandwidth: 'Sınırsız (10 Gbps Hat)',
    port: '10 Gbps',
    ddos: '3.2 Tbps Voxility L3/L4/L7',
    price: 17.00,
    monthly_price: 17.00,
    popular: true,
    stock: 18,
    status: 'active',
    features: ['1 Gelişmiş Statik IPv4', 'DDoS Voxility Koruma', 'Haftalık Ücretsiz Snapshot', 'KVM Donanım Sanallaştırma']
  },
  {
    id: 'ryzen-1',
    name: 'Ryzen Ultra R1',
    category: 'ryzen-vds',
    cores: '2 Dedicated vCPU @ 5.7 GHz',
    ram: '8 GB DDR5 6000MHz',
    disk: '120 GB Samsung PM9A3 NVMe',
    bandwidth: 'Sınırsız (10 Gbps Hat)',
    port: '10 Gbps',
    ddos: 'Path.net Anycast Game Filter',
    price: 19.00,
    monthly_price: 19.00,
    popular: false,
    stock: 12,
    status: 'active',
    features: ['Path.net Özel Oyun Profili', 'Sıfır Ping Jitter', 'Özel rDNS Yönetimi', '7/24 Teknik Öncelik']
  },
  {
    id: 'ryzen-2',
    name: 'Ryzen Ultra R2',
    category: 'ryzen-vds',
    cores: '4 Dedicated vCPU @ 5.7 GHz',
    ram: '12 GB DDR5 6000MHz',
    disk: '180 GB Samsung PM9A3 NVMe',
    bandwidth: 'Sınırsız (10 Gbps Hat)',
    port: '10 Gbps',
    ddos: 'Path.net Anycast Game Filter',
    price: 36.00,
    monthly_price: 36.00,
    popular: true,
    stock: 9,
    status: 'active',
    features: ['Path.net Özel Oyun Profili', 'L7 UDP Koruma', 'Tam Donanım İzolasyonu', 'VIP Ticket SLA']
  },
  {
    id: 'dedi-1',
    name: 'Nova Bare-Metal XE1',
    category: 'dedicated',
    cores: '32 Core / 64 Thread (Xeon Silver)',
    ram: '64 GB DDR4 ECC Reg',
    disk: '2x 960 GB NVMe HW-RAID1',
    bandwidth: '100 TB (1 Gbps Hat)',
    port: '1 Gbps Dedicated',
    ddos: '3.2 Tbps Voxility Enterprise',
    price: 169.00,
    monthly_price: 169.00,
    popular: false,
    stock: 5,
    status: 'active',
    features: ['IPMI / KVM Uzaktan Erişim', 'HW RAID Denetleyicisi', 'Yedekli Çift Güç Kaynağı', '%99.99 Donanım SLA']
  }
];

export const SEED_ORDERS = [
  {
    order_id: 'ORD-2026-9041',
    customer_id: 'NQ-84920',
    customer_name: 'Ahmet Yılmaz',
    date: '10.09.2026 01:15',
    plan_name: 'Ryzen Extreme RX-3 (AMD Ryzen 9 9950X)',
    location: 'Almanya (Frankfurt)',
    flag: '🇩🇪',
    os: 'Ubuntu 24.04 LTS',
    cycle_label: 'Aylık',
    total: 43.00,
    payment_status: 'Ödendi (3D Secure)',
    provision_status: 'pending_approval',
    target_server_template: {
      name: 'srv-ryzen-de03',
      hostname: 'ryzen03.novaq.internal',
      planName: 'Ryzen Ultra R3 (AMD Ryzen 9 9950X)',
      category: 'ryzen-vds',
      status: 'running',
      location: 'Almanya (Frankfurt)',
      flag: '🇩🇪',
      ip: '194.15.36.188',
      gateway: '194.15.36.1',
      netmask: '255.255.255.0',
      rdns: 'ryzen03.novaq.internal',
      os: 'Ubuntu 24.04 LTS',
      cores: '8 Dedicated vCPU @ 5.7 GHz',
      ram: '24 GB DDR5 ECC 6000MHz',
      disk: '350 GB Samsung PM9A3 NVMe',
      diskUsed: '14.2 GB',
      bandwidthTotal: 'Sınırsız (10 Gbps)',
      bandwidthUsedMonth: '0.2 TB',
      uptime: '1 Dakika (Yeni Kurulum)',
      purchasedAt: '10.09.2026',
      renewalDate: '10.10.2026',
      billingCycle: 'Aylık',
      daysRemaining: 30,
      priceMonthly: 43.00,
      metrics: {
        cpuHistory: [10, 14, 12, 16, 11, 13, 15, 12, 11, 10, 12, 11],
        ramHistory: [25, 26, 25, 27, 26, 25, 27, 26, 26, 25, 27, 26],
        diskIOHistory: [45, 60, 90, 30, 20, 22, 25, 18, 15, 18, 20, 22],
        netMbps: [40, 55, 70, 50, 45, 60, 52, 48, 54, 50, 46, 58]
      },
      snapshots: []
    }
  },
  {
    order_id: 'ORD-2026-8819',
    customer_id: 'NQ-84920',
    customer_name: 'Ahmet Yılmaz',
    date: '15.08.2026 14:20',
    plan_name: 'Nova Cloud V3 (EPYC 9454)',
    location: 'Almanya (Frankfurt)',
    flag: '🇩🇪',
    os: 'Ubuntu 24.04 LTS',
    cycle_label: 'Aylık',
    total: 29.00,
    payment_status: 'Ödendi (Bakiye)',
    provision_status: 'approved',
    assigned_server_id: 'srv-fra-101'
  }
];

export const SEED_INVOICES = [
  {
    id: 'INV-2026-8819',
    customer_id: 'NQ-84920',
    customer_name: 'Ahmet Yılmaz',
    date: '01.09.2026',
    due_date: '15.09.2026',
    items: [
      { desc: 'Nova Cloud V4 (8 vCPU / 16GB RAM) - 1 Aylık Yenileme', amount: 29 },
      { desc: 'Ryzen Extreme RX-3 (4 vCPU / 12GB RAM) - 1 Aylık Yenileme', amount: 36 },
      { desc: 'Nova Bare-Metal XE1 Dedicated - 1 Aylık Yenileme', amount: 169 }
    ],
    subtotal: 234.00,
    vat: 47.00,
    total: 281.00,
    status: 'Ödendi',
    payment_method: 'Kurumsal Havale / Bakiye',
    paid_at: '01.09.2026 10:14'
  },
  {
    id: 'INV-2026-8940',
    customer_id: 'NQ-84920',
    customer_name: 'Ahmet Yılmaz',
    date: '09.09.2026',
    due_date: '23.09.2026',
    items: [
      { desc: 'Ek /30 Statik IPv4 Bloğu (4 Adet) - Frankfurt DC', amount: 12 },
      { desc: 'Ultra L7 DDoS Özel Filtreleme Lisansı', amount: 15 }
    ],
    subtotal: 27.00,
    vat: 5.00,
    total: 32.00,
    status: 'Beklemede',
    payment_method: 'Bakiye veya Kredi Kartı',
    paid_at: null
  }
];

export const SEED_PAYMENTS = [
  {
    id: 'PAY-1082',
    invoice_id: 'INV-2026-8819',
    customer_id: 'NQ-84920',
    customer_name: 'Ahmet Yılmaz',
    amount: 281.00,
    method: 'Bakiye / Kredi Kartı',
    status: 'Başarılı',
    date: '01.09.2026 10:14',
    transaction_id: 'TXN-90214'
  }
];

export const SEED_TICKETS = [
  {
    id: 'TCK-9942',
    customer_id: 'NQ-84920',
    customer_name: 'Ahmet Yılmaz',
    subject: 'Frankfurt Sunucusuna Ek /29 IPv4 Tahsisi ve rDNS Yapılandırması',
    department: 'Teknik Destek & Network',
    related_server: 'prod-fra-app01 (194.15.36.142)',
    priority: 'Yüksek',
    status: 'Yanıtlandı',
    messages: [
      {
        id: 'msg-1',
        sender: 'Ahmet Yılmaz',
        isStaff: false,
        avatar: 'AY',
        time: '09.09.2026 18:24',
        text: 'Merhaba, prod-fra-app01 sunucumuza SSL ve alt hizmetler için ek 4 adet IPv4 adresi tanımlanmasını rica ediyoruz. Reverse DNS kayıtlarını mail.yilmazholding.com.tr olarak yönlendirebilir misiniz?'
      },
      {
        id: 'msg-2',
        sender: 'Kaan Demir',
        role: 'NovaQ Servers Kıdemli Ağ Mühendisi (L3 NOC)',
        isStaff: true,
        avatar: 'KD',
        time: '09.09.2026 18:41',
        text: 'Merhaba Ahmet Bey,\n\nTalep ettiğiniz ek IPv4 bloğu (194.15.36.144/30) sunucunuzun bağlı olduğu sanal anahtara tahsis edilmiştir. İlgili IP adreslerinin rDNS kayıtları "mail.yilmazholding.com.tr" olarak BGP tablomuzda güncellenmiştir. Propagasyon 5-10 dakika içerisinde tamamlanacaktır.\n\nHerhangi bir sorunuz olursa lütfen bize bildirin.'
      }
    ],
    internal_notes: [
      { id: 'tnote-1', text: 'Müşteriye /30 tahsisi VLAN 402 üzerinden yapıldı.', author: 'Kaan Demir', date: '09.09.2026 18:38' }
    ]
  },
  {
    id: 'TCK-9810',
    customer_id: 'NQ-84920',
    customer_name: 'Ahmet Yılmaz',
    subject: 'Hong Kong Lokasyonu BGP Anycast DDoS Koruma Eşiği',
    department: 'Ağ Güvenliği & DDoS',
    related_server: 'game-node-asia (103.88.221.78)',
    priority: 'Acil',
    status: 'Çözüldü',
    messages: [
      {
        id: 'msg-3',
        sender: 'Ahmet Yılmaz',
        isStaff: false,
        avatar: 'AY',
        time: '03.09.2026 14:10',
        text: 'Hong Kong sunucumuzdaki oyun altyapısına yönelik UDP flood atakları tespit edildi. Path.net kalkanında Gaming profilinin aktif edilmesini talep ediyoruz.'
      },
      {
        id: 'msg-4',
        sender: 'Burak Serter',
        role: 'NovaQ Servers Siber Güvenlik Uzmanı',
        isStaff: true,
        avatar: 'BS',
        time: '03.09.2026 14:35',
        text: 'Ahmet Bey iyi günler,\n\n103.88.221.78 IP adresiniz için Anycast Path.net katmanında "Aggressive Game Mitigation & UDP Payload Inspection" kuralları anında devreye alınmıştır. Ataklar başarıyla filtre edilmiş olup sunucu trafiğiniz 0 paket kaybı ile çalışmaktadır.'
      }
    ],
    internal_notes: []
  }
];

export const SEED_AUDIT_LOGS = [
  { action: 'Sunucu Yeniden Başlatıldı', target: 'prod-fra-app01', user_name: 'Ahmet Yılmaz', ip: '88.241.12.9', details: 'Web panel üzerinden soft reboot' },
  { action: 'Reverse DNS Güncellendi', target: '194.15.36.142 -> mail.yilmazholding.com.tr', user_name: 'Sistem NOC', ip: '10.0.0.1', details: 'BGP Anycast zone dosyası güncellendi' },
  { action: 'Snapshot Oluşturuldu', target: 'Pre-Deploy Auto Backup', user_name: 'Zamanlanmış Görev', ip: '127.0.0.1', details: 'KVM Storage zfs snapshot' },
  { action: 'Fatura Ödemesi Alındı', target: 'INV-2026-8819 ($281)', user_name: 'Ahmet Yılmaz', ip: '88.241.12.9', details: 'Bakiye hesabı üzerinden tahsilat' }
];
