export const DATACENTERS = [
  {
    id: 'frankfurt',
    country: 'Almanya',
    city: 'Frankfurt am Main',
    code: 'FRA1',
    flag: '🇩🇪',
    datacenter: 'Equinix FR2 / Interxion Campus',
    status: 'Operational',
    uptime: '100.0%',
    basePingTR: 32,
    jitter: '0.8 ms',
    networkSpeed: '10 Gbit/s Redundant (DE-CIX, Telia, Cogent)',
    power: '2N UPS + Dizel Jeneratör (Tier IV Standartları)',
    security: 'Biyometrik Giriş, 7/24 Güvenlik Görevlisi, CCTV',
    cooling: 'N+2 Free Cooling Hassas İklimlendirme',
    features: [
      'Türkiye ve Avrupa geneline ultra düşük ping (<35ms)',
      '3.2 Tbps Voxility Donanımsal DDoS Koruması',
      'DE-CIX doğrudan peering bağlantısı',
      'Tam redundant BGP routing altyapısı'
    ],
    testIp: '194.15.36.1',
    downloadFiles: [
      { name: '100 MB Test Dosyası', size: '100MB', url: '#' },
      { name: '1000 MB Test Dosyası', size: '1GB', url: '#' }
    ]
  },
  {
    id: 'hongkong',
    country: 'Hong Kong',
    city: 'Kowloon / Chai Wan',
    code: 'HKG1',
    flag: '🇭🇰',
    datacenter: 'Equinix HK1 / Mega-i Global Hub',
    status: 'Operational',
    uptime: '99.99%',
    basePingTR: 135,
    jitter: '1.4 ms',
    networkSpeed: '10 Gbit/s BGP (HKIX, China Telecom CN2, PCCW Global)',
    power: '2N Redundant Yedekli Şebeke & Otomatik Jeneratör',
    security: 'Askeri Seviye Fiziksel Erişim ve Mantrap',
    cooling: 'Akıllı Soğuk Koridor Muhafaza Sistemi',
    features: [
      'Asya-Pasifik ve Çin yönüne optimize CN2 / Direct Routing',
      'Path.net Anycast Akıllı L3/L4/L7 Filtreleme',
      'Finans ve global ticaret için düşük gecikme',
      'Bölgesel 10 Gbps Tier-1 uplinkler'
    ],
    testIp: '103.88.221.1',
    downloadFiles: [
      { name: '100 MB Test Dosyası', size: '100MB', url: '#' },
      { name: '1000 MB Test Dosyası', size: '1GB', url: '#' }
    ]
  },
  {
    id: 'paris',
    country: 'Fransa',
    city: 'Paris / Gravelines',
    code: 'PAR1',
    flag: '🇫🇷',
    datacenter: 'OVHcloud EcoCampus / Telehouse Voltaire',
    status: 'Operational',
    uptime: '100.0%',
    basePingTR: 38,
    jitter: '0.9 ms',
    networkSpeed: '10 Gbit/s (France-IX, Zayo, NTT Global)',
    power: 'A+B Besleme, N+1 Kesintisiz Güç Kaynağı',
    security: 'ISO 27001, SOC 1 & 2 Tip II Sertifikalı Tesis',
    cooling: 'Patentli Sıvı Soğutma (Su Soğutmalı Yeşil Altyapı)',
    features: [
      'Batı Avrupa ve Akdeniz bölgesine optimum erişim',
      'VAC & Arbor Networks Çok Katmanlı Anti-DDoS Kalkanı',
      'Enerji verimli sürdürülebilir yeşil veri merkezi',
      'France-IX doğrudan internet değişim noktası'
    ],
    testIp: '51.77.104.1',
    downloadFiles: [
      { name: '100 MB Test Dosyası', size: '100MB', url: '#' },
      { name: '1000 MB Test Dosyası', size: '1GB', url: '#' }
    ]
  }
];
