export const INITIAL_USER = {
  name: 'Ahmet Yılmaz',
  company: 'Yılmaz Teknoloji A.Ş.',
  email: 'ahmet.yilmaz@novaq-client.com',
  phone: '+90 532 555 19 23',
  customerId: 'NQ-84920',
  tier: 'Enterprise VIP',
  balance: 285.00,
  twoFactorEnabled: true,
  taxOffice: 'Maslak Vergi Dairesi',
  taxNumber: '9481028491',
  address: 'Büyükdere Cad. No: 194 K:8 Levent',
  city: 'İstanbul',
  country: 'Türkiye',
  registeredAt: '14.02.2024'
};

export const INITIAL_SERVERS = [
  {
    id: 'srv-fra-101',
    name: 'prod-fra-app01',
    hostname: 'app01.novaq-fra.internal',
    planName: 'Nova Cloud V3 (EPYC 9454)',
    category: 'nvme-vds',
    status: 'running', // running, stopped, rebooting, installing
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
    diskUsed: '64.8 GB',
    bandwidthTotal: 'Sınırsız (10 Gbps)',
    bandwidthUsedMonth: '4.2 TB',
    uptime: '47 Gün, 14 Saat',
    purchasedAt: '15.08.2026',
    renewalDate: '15.10.2026',
    billingCycle: 'Aylık',
    daysRemaining: 35,
    priceMonthly: 29,
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
    name: 'game-node-asia',
    hostname: 'node-hk.novaq.asia',
    planName: 'Ryzen Ultra R2 (Ryzen 9 9950X)',
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
    diskUsed: '42.1 GB',
    bandwidthTotal: 'Sınırsız (10 Gbps)',
    bandwidthUsedMonth: '9.8 TB',
    uptime: '18 Gün, 6 Saat',
    purchasedAt: '28.08.2026',
    renewalDate: '28.09.2026',
    billingCycle: 'Aylık',
    daysRemaining: 18,
    priceMonthly: 36,
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
    name: 'db-cluster-france',
    hostname: 'db-core.novaq-par.internal',
    planName: 'Nova Bare-Metal XE1',
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
    diskUsed: '340 GB',
    bandwidthTotal: '100 TB (1 Gbps Hat)',
    bandwidthUsedMonth: '18.4 TB',
    uptime: '89 Gün, 22 Saat',
    purchasedAt: '04.08.2026',
    renewalDate: '04.11.2026',
    billingCycle: '3 Aylık',
    daysRemaining: 55,
    priceMonthly: 169,
    metrics: {
      cpuHistory: [15, 16, 22, 19, 18, 20, 16, 17, 24, 19, 18, 17],
      ramHistory: [44, 45, 44, 45, 46, 45, 44, 45, 45, 46, 45, 45],
      diskIOHistory: [85, 120, 190, 140, 95, 110, 130, 180, 125, 90, 105, 115],
      netMbps: [90, 110, 140, 120, 130, 115, 105, 135, 125, 110, 120, 130]
    },
    snapshots: []
  }
];

export const INITIAL_ORDERS = [
  {
    orderId: 'ORD-2026-9041',
    date: '10.09.2026 01:15',
    planName: 'Ryzen Extreme RX-3 (AMD Ryzen 9 9950X)',
    location: 'Almanya (Frankfurt)',
    flag: '🇩🇪',
    os: 'Ubuntu 24.04 LTS',
    cycleLabel: 'Aylık',
    total: 43,
    paymentStatus: 'Ödendi (3D Secure)',
    provisionStatus: 'pending_approval', // 'pending_approval' (Yönetim Onayı Bekliyor) | 'provisioning' | 'approved' (Aktif)
    targetServerTemplate: {
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
      priceMonthly: 2350,
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
    orderId: 'ORD-2026-8819',
    date: '15.08.2026 14:20',
    planName: 'Nova Cloud V3 (EPYC 9454)',
    location: 'Almanya (Frankfurt)',
    flag: '🇩🇪',
    os: 'Ubuntu 24.04 LTS',
    cycleLabel: 'Aylık',
    total: 1548,
    paymentStatus: 'Ödendi (Bakiye)',
    provisionStatus: 'approved',
    assignedServerId: 'srv-fra-101'
  }
];

export const INITIAL_TICKETS = [
  {
    id: 'TCK-9942',
    subject: 'Frankfurt Sunucusuna Ek /29 IPv4 Tahsisi ve rDNS Yapılandırması',
    department: 'Teknik Destek & Network',
    relatedServer: 'prod-fra-app01 (194.15.36.142)',
    priority: 'Yüksek',
    status: 'Yanıtlandı', // Açık, Yanıtlandı, Müşteri Yanıtı, Çözüldü
    createdAt: '09.09.2026 18:24',
    updatedAt: '09.09.2026 18:41',
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
    ]
  },
  {
    id: 'TCK-9810',
    subject: 'Hong Kong Lokasyonu BGP Anycast DDoS Koruma Eşiği',
    department: 'Ağ Güvenliği & DDoS',
    relatedServer: 'game-node-asia (103.88.221.78)',
    priority: 'Acil',
    status: 'Çözüldü',
    createdAt: '03.09.2026 14:10',
    updatedAt: '03.09.2026 14:35',
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
    ]
  }
];

export const INITIAL_INVOICES = [
  {
    id: 'INV-2026-8819',
    date: '01.09.2026',
    dueDate: '15.09.2026',
    items: [
      { desc: 'Nova Cloud V4 (8 vCPU / 16GB RAM) - 1 Aylık Yenileme', amount: 29 },
      { desc: 'Ryzen Extreme RX-3 (4 vCPU / 12GB RAM) - 1 Aylık Yenileme', amount: 36 },
      { desc: 'Nova Bare-Metal XE1 Dedicated - 1 Aylık Yenileme', amount: 169 }
    ],
    subtotal: 234,
    vat: 47,
    total: 281,
    status: 'Ödendi',
    paymentMethod: 'Kurumsal Havale / Bakiye',
    paidAt: '01.09.2026 10:14'
  },
  {
    id: 'INV-2026-8940',
    date: '09.09.2026',
    dueDate: '23.09.2026',
    items: [
      { desc: 'Ek /30 Statik IPv4 Bloğu (4 Adet) - Frankfurt DC', amount: 12 },
      { desc: 'Ultra L7 DDoS Özel Filtreleme Lisansı', amount: 15 }
    ],
    subtotal: 27,
    vat: 5,
    total: 32,
    status: 'Beklemede',
    paymentMethod: 'Bakiye veya Kredi Kartı',
    paidAt: null
  }
];

export const AUDIT_LOGS = [
  { id: 1, action: 'Sunucu Yeniden Başlatıldı', target: 'prod-fra-app01', time: 'Dün, 21:40', ip: '88.241.12.9' },
  { id: 2, action: 'Reverse DNS Güncellendi', target: '194.15.36.142 -> mail.yilmazholding.com.tr', time: '09.09.2026 18:42', ip: 'Sistem NOC' },
  { id: 3, action: 'Snapshot Oluşturuldu', target: 'Pre-Deploy Auto Backup', time: '08.09.2026 03:00', ip: 'Zamanlanmış Görev' },
  { id: 4, action: 'Fatura Ödemesi Alındı', target: 'INV-2026-8819 ($281)', time: '01.09.2026 10:14', ip: 'Bakiye Hesabı' }
];
