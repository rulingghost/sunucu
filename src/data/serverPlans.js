export const BILLING_CYCLES = [
  { id: 'monthly', months: 1, label: 'Aylık', discount: 0, tag: null },
  { id: 'quarterly', months: 3, label: '3 Aylık', discount: 5, tag: '%5 İndirim' },
  { id: 'semi_annual', months: 6, label: '6 Aylık', discount: 8, tag: '%8 İndirim' },
  { id: 'annual', months: 12, label: '1 Yıllık', discount: 13, tag: '%13 İndirim' }
];

export const LOCATIONS = [
  {
    id: 'de',
    country: 'Almanya',
    city: 'Frankfurt am Main',
    flag: '🇩🇪',
    datacenter: 'Equinix FR2 / Interxion Campus',
    pingEst: '28-36 ms (TR)',
    tier: 'Tier IV',
    ddos: 'Voxility 3.2 Tbps'
  },
  {
    id: 'hk',
    country: 'Hong Kong',
    city: 'Kowloon',
    flag: '🇭🇰',
    datacenter: 'Equinix HK1 / Mega-i Global Gateway',
    pingEst: '120-145 ms (Asya-Pasifik Hub)',
    tier: 'Tier III+',
    ddos: 'Path.net Anycast'
  },
  {
    id: 'fr',
    country: 'Fransa',
    city: 'Paris / Gravelines',
    flag: '🇫🇷',
    datacenter: 'OVHcloud EcoCampus / Telehouse Voltaire',
    pingEst: '32-42 ms (TR)',
    tier: 'Tier III+',
    ddos: 'VAC + Arbor Networks'
  }
];

export const OPERATING_SYSTEMS = [
  { id: 'ubuntu-24', name: 'Ubuntu 24.04 LTS (Noble)', type: 'linux', icon: 'ubuntu', free: true },
  { id: 'ubuntu-22', name: 'Ubuntu 22.04 LTS (Jammy)', type: 'linux', icon: 'ubuntu', free: true },
  { id: 'debian-12', name: 'Debian 12 (Bookworm)', type: 'linux', icon: 'debian', free: true },
  { id: 'almalinux-9', name: 'AlmaLinux 9.4 (Enterprise)', type: 'linux', icon: 'linux', free: true },
  { id: 'rocky-9', name: 'Rocky Linux 9.4', type: 'linux', icon: 'linux', free: true },
  { id: 'windows-2022', name: 'Windows Server 2022 Datacenter', type: 'windows', icon: 'windows', free: false, priceMonthly: 15 },
  { id: 'windows-2025', name: 'Windows Server 2025 Standard', type: 'windows', icon: 'windows', free: false, priceMonthly: 20 }
];

export const ADDONS = [
  { id: 'extra_ip', name: 'Ek Statik IPv4 Adresi (/32)', priceMonthly: 3, max: 8 },
  { id: 'backup_daily', name: 'Günlük Otomatik Snapshot Yedekleme', priceMonthly: 5, default: true },
  { id: 'ddos_premium', name: 'NovaQ Ultra L7 DDoS Kalkanı (Layer 7 BGP)', priceMonthly: 15 },
  { id: 'cpanel_admin', name: 'cPanel / WHM Admin Lisansı (5 Hesap)', priceMonthly: 25 },
  { id: 'plesk_web', name: 'Plesk Web Pro Edition (30 Domain)', priceMonthly: 18 }
];

export const SERVER_CATEGORIES = [
  {
    id: 'nvme-vds',
    title: 'NVMe Bulut VDS',
    subtitle: 'Intel Xeon Platinum & AMD EPYC Kurumsal Sanal Sunucular',
    badge: 'En Çok Tercih Edilen',
    plans: [
      {
        id: 'vds-v1',
        name: 'Nova Cloud V1',
        processor: 'Intel Xeon Platinum 8268',
        cores: '2 vCPU (3.7 GHz)',
        ram: '4 GB DDR4 ECC',
        storage: '60 GB Enterprise Gen4 NVMe',
        bandwidth: 'Sınırsız Trafik (1 Gbit/s Port)',
        ip: '1 Adet Statik IPv4 + /64 IPv6',
        ddos: '3.2 Tbps L3/L4/L7 Korumalı',
        basePriceMonthly: 8,
        popular: false
      },
      {
        id: 'vds-v2',
        name: 'Nova Cloud V2',
        processor: 'Intel Xeon Platinum 8268',
        cores: '4 vCPU (3.7 GHz)',
        ram: '8 GB DDR4 ECC',
        storage: '100 GB Enterprise Gen4 NVMe',
        bandwidth: 'Sınırsız Trafik (1 Gbit/s Port)',
        ip: '1 Adet Statik IPv4 + /64 IPv6',
        ddos: '3.2 Tbps L3/L4/L7 Korumalı',
        basePriceMonthly: 15,
        popular: false
      },
      {
        id: 'vds-v3',
        name: 'Nova Cloud V3',
        processor: 'Intel Xeon Platinum 8268',
        cores: '6 vCPU (3.7 GHz)',
        ram: '12 GB DDR4 ECC',
        storage: '150 GB Enterprise Gen4 NVMe',
        bandwidth: 'Sınırsız Trafik (1 Gbit/s Port)',
        ip: '1 Adet Statik IPv4 + /64 IPv6',
        ddos: '3.2 Tbps L3/L4/L7 Korumalı',
        basePriceMonthly: 22,
        popular: true
      },
      {
        id: 'vds-v4',
        name: 'Nova Cloud V4',
        processor: 'AMD EPYC™ 9454',
        cores: '8 vCPU (4.0 GHz)',
        ram: '16 GB DDR5 ECC 5600MHz',
        storage: '220 GB Enterprise Gen4 NVMe',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Port)',
        ip: '1 Adet Statik IPv4 + /64 IPv6',
        ddos: '3.2 Tbps L3/L4/L7 Korumalı',
        basePriceMonthly: 29,
        popular: false
      },
      {
        id: 'vds-v5',
        name: 'Nova Cloud V5',
        processor: 'AMD EPYC™ 9454',
        cores: '10 vCPU (4.0 GHz)',
        ram: '24 GB DDR5 ECC 5600MHz',
        storage: '300 GB Enterprise Gen4 NVMe',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Port)',
        ip: '1 Adet Statik IPv4 + /64 IPv6',
        ddos: '3.2 Tbps L3/L4/L7 Korumalı',
        basePriceMonthly: 39,
        popular: false
      },
      {
        id: 'vds-v6',
        name: 'Nova Cloud V6',
        processor: 'AMD EPYC™ 9454',
        cores: '12 vCPU (4.0 GHz)',
        ram: '32 GB DDR5 ECC 5600MHz',
        storage: '420 GB Enterprise Gen4 NVMe',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Port)',
        ip: '2 Adet Statik IPv4 + /64 IPv6',
        ddos: '3.2 Tbps L3/L4/L7 Korumalı',
        basePriceMonthly: 49,
        popular: false
      },
      {
        id: 'vds-v7',
        name: 'Nova Cloud V7',
        processor: 'AMD EPYC™ 9554',
        cores: '16 vCPU (4.1 GHz)',
        ram: '48 GB DDR5 ECC 5600MHz',
        storage: '550 GB Enterprise Gen4 NVMe',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Port)',
        ip: '2 Adet Statik IPv4 + /64 IPv6',
        ddos: '3.2 Tbps L3/L4/L7 Korumalı',
        basePriceMonthly: 69,
        popular: false
      },
      {
        id: 'vds-v8',
        name: 'Nova Cloud V8',
        processor: 'AMD EPYC™ 9554',
        cores: '24 vCPU (4.1 GHz)',
        ram: '64 GB DDR5 ECC 5600MHz',
        storage: '750 GB Enterprise Gen4 NVMe',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Port)',
        ip: '3 Adet Statik IPv4 + /64 IPv6',
        ddos: '3.2 Tbps L3/L4/L7 Korumalı',
        basePriceMonthly: 89,
        popular: false
      },
      {
        id: 'vds-v9',
        name: 'Nova Cloud V9 Enterprise',
        processor: 'AMD EPYC™ 9654',
        cores: '32 vCPU (4.2 GHz)',
        ram: '96 GB DDR5 ECC 5600MHz',
        storage: '1 TB Enterprise Gen4 NVMe',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Port)',
        ip: '4 Adet Statik IPv4 + /64 IPv6',
        ddos: '3.2 Tbps L3/L4/L7 Korumalı',
        basePriceMonthly: 129,
        popular: false
      }
    ]
  },
  {
    id: 'ryzen-vds',
    title: 'Extreme Ryzen VDS',
    subtitle: 'AMD Ryzen 9 9950X (5.7 GHz Boost) ile Maksimum Tek Çekirdek Performansı',
    badge: '5.7 GHz Tek Çekirdek Gücü',
    plans: [
      {
        id: 'ryzen-1',
        name: 'Ryzen Extreme RX-1',
        processor: 'AMD Ryzen 9 9950X',
        cores: '2 Dedicated vCPU @ 5.7 GHz',
        ram: '6 GB DDR5 ECC 6000MHz',
        storage: '80 GB Samsung PM9A3 NVMe',
        bandwidth: 'Sınırsız Trafik (1 Gbit/s Hat)',
        ip: '1 Adet Statik IPv4',
        ddos: 'Game & Bot Anti-DDoS Filter',
        basePriceMonthly: 19,
        popular: false
      },
      {
        id: 'ryzen-2',
        name: 'Ryzen Extreme RX-2',
        processor: 'AMD Ryzen 9 9950X',
        cores: '3 Dedicated vCPU @ 5.7 GHz',
        ram: '8 GB DDR5 ECC 6000MHz',
        storage: '120 GB Samsung PM9A3 NVMe',
        bandwidth: 'Sınırsız Trafik (1 Gbit/s Hat)',
        ip: '1 Adet Statik IPv4',
        ddos: 'Game & Bot Anti-DDoS Filter',
        basePriceMonthly: 27,
        popular: false
      },
      {
        id: 'ryzen-3',
        name: 'Ryzen Extreme RX-3',
        processor: 'AMD Ryzen 9 9950X',
        cores: '4 Dedicated vCPU @ 5.7 GHz',
        ram: '12 GB DDR5 ECC 6000MHz',
        storage: '180 GB Samsung PM9A3 NVMe',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '1 Adet Statik IPv4',
        ddos: 'Game & Bot Anti-DDoS Filter',
        basePriceMonthly: 36,
        popular: true
      },
      {
        id: 'ryzen-4',
        name: 'Ryzen Extreme RX-4',
        processor: 'AMD Ryzen 9 9950X',
        cores: '6 Dedicated vCPU @ 5.7 GHz',
        ram: '16 GB DDR5 ECC 6000MHz',
        storage: '250 GB Samsung PM9A3 NVMe',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '1 Adet Statik IPv4',
        ddos: 'Game & Bot Anti-DDoS Filter',
        basePriceMonthly: 54,
        popular: false
      },
      {
        id: 'ryzen-5',
        name: 'Ryzen Extreme RX-5',
        processor: 'AMD Ryzen 9 9950X',
        cores: '8 Dedicated vCPU @ 5.7 GHz',
        ram: '24 GB DDR5 ECC 6000MHz',
        storage: '350 GB Samsung PM9A3 NVMe',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '2 Adet Statik IPv4',
        ddos: 'Game & Bot Anti-DDoS Filter',
        basePriceMonthly: 72,
        popular: false
      },
      {
        id: 'ryzen-6',
        name: 'Ryzen Extreme RX-6',
        processor: 'AMD Ryzen 9 9950X',
        cores: '10 Dedicated vCPU @ 5.7 GHz',
        ram: '32 GB DDR5 ECC 6000MHz',
        storage: '450 GB Samsung PM9A3 NVMe',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '2 Adet Statik IPv4',
        ddos: 'Game & Bot Anti-DDoS Filter',
        basePriceMonthly: 89,
        popular: false
      },
      {
        id: 'ryzen-7',
        name: 'Ryzen Extreme RX-7',
        processor: 'AMD Ryzen 9 9950X',
        cores: '12 Dedicated vCPU @ 5.7 GHz',
        ram: '40 GB DDR5 ECC 6000MHz',
        storage: '550 GB Samsung PM9A3 NVMe',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '2 Adet Statik IPv4',
        ddos: 'Game & Bot Anti-DDoS Filter',
        basePriceMonthly: 109,
        popular: false
      },
      {
        id: 'ryzen-8',
        name: 'Ryzen Extreme RX-8',
        processor: 'AMD Ryzen 9 9950X',
        cores: '14 Dedicated vCPU @ 5.7 GHz',
        ram: '48 GB DDR5 ECC 6000MHz',
        storage: '700 GB Samsung PM9A3 NVMe',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '3 Adet Statik IPv4',
        ddos: 'Game & Bot Anti-DDoS Filter',
        basePriceMonthly: 129,
        popular: false
      },
      {
        id: 'ryzen-9',
        name: 'Ryzen Extreme RX-9',
        processor: 'AMD Ryzen 9 9950X',
        cores: '16 Dedicated vCPU @ 5.7 GHz',
        ram: '64 GB DDR5 ECC 6000MHz',
        storage: '850 GB Samsung PM9A3 NVMe',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '3 Adet Statik IPv4',
        ddos: 'Game & Bot Anti-DDoS Filter',
        basePriceMonthly: 149,
        popular: false
      },
      {
        id: 'ryzen-10',
        name: 'Ryzen Extreme RX-10',
        processor: 'AMD Ryzen 9 9950X',
        cores: '20 Dedicated vCPU @ 5.7 GHz',
        ram: '80 GB DDR5 ECC 6000MHz',
        storage: '1 TB Samsung PM9A3 NVMe',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '4 Adet Statik IPv4',
        ddos: 'Game & Bot Anti-DDoS Filter',
        basePriceMonthly: 189,
        popular: false
      },
      {
        id: 'ryzen-11',
        name: 'Ryzen Extreme RX-11 Pro',
        processor: 'AMD Ryzen 9 9950X',
        cores: '24 Dedicated vCPU @ 5.7 GHz',
        ram: '96 GB DDR5 ECC 6000MHz',
        storage: '1.5 TB Samsung PM9A3 NVMe',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '4 Adet Statik IPv4',
        ddos: 'Game & Bot Anti-DDoS Filter',
        basePriceMonthly: 229,
        popular: false
      },
      {
        id: 'ryzen-12',
        name: 'Ryzen Extreme RX-12 Beast',
        processor: 'AMD Ryzen 9 9950X',
        cores: '32 Dedicated vCPU @ 5.7 GHz',
        ram: '128 GB DDR5 ECC 6000MHz',
        storage: '2 TB Samsung PM9A3 NVMe',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '5 Adet Statik IPv4',
        ddos: 'Game & Bot Anti-DDoS Filter',
        basePriceMonthly: 299,
        popular: false
      }
    ]
  },
  {
    id: 'dedicated',
    title: 'Fiziksel Dedicated Sunucular',
    subtitle: '100% Donanım İzolasyonu, Donanımsal RAID, IPMI/iDRAC KVM ve Çift Güç Kaynağı',
    badge: 'Bare-Metal Güç',
    plans: [
      {
        id: 'dedi-1',
        name: 'Nova Dedi E-2388G',
        processor: 'Intel Xeon E-2388G (5.1 GHz)',
        cores: '8 Core / 16 Thread',
        ram: '32 GB DDR4 ECC',
        storage: '2x 512 GB NVMe (HW RAID-1)',
        bandwidth: '100 TB Aylık Trafik (1 Gbit/s Hat)',
        ip: '5 Adet Kullanılabilir IPv4',
        ddos: 'Voxility Donanımsal 3.2 Tbps',
        basePriceMonthly: 89,
        popular: false
      },
      {
        id: 'dedi-2',
        name: 'Nova Dedi E-2488',
        processor: 'Intel Xeon E-2488 (5.6 GHz)',
        cores: '8 Core / 16 Thread',
        ram: '64 GB DDR5 ECC',
        storage: '2x 1 TB Gen4 NVMe (HW RAID-1)',
        bandwidth: 'Sınırsız Trafik (1 Gbit/s Hat)',
        ip: '5 Adet Kullanılabilir IPv4',
        ddos: 'Voxility Donanımsal 3.2 Tbps',
        basePriceMonthly: 119,
        popular: false
      },
      {
        id: 'dedi-3',
        name: 'Nova Dedi XE-16',
        processor: 'Intel Xeon Silver 4314',
        cores: '16 Core / 32 Thread (3.4 GHz)',
        ram: '64 GB DDR4 ECC Reg',
        storage: '2x 960 GB Enterprise NVMe',
        bandwidth: 'Sınırsız Trafik (1 Gbit/s Hat)',
        ip: '5 Adet Kullanılabilir IPv4',
        ddos: 'Voxility Donanımsal 3.2 Tbps',
        basePriceMonthly: 139,
        popular: false
      },
      {
        id: 'dedi-4',
        name: 'Nova Bare-Metal XE1',
        processor: 'Dual Intel Xeon Silver 4314',
        cores: '32 Core / 64 Thread (3.4 GHz)',
        ram: '64 GB DDR4 ECC Registered',
        storage: '2x 960 GB Enterprise NVMe (RAID-1)',
        bandwidth: '100 TB Aylık Trafik (1 Gbit/s Hat)',
        ip: '5 Adet Kullanılabilir IPv4',
        ddos: 'Voxility Donanımsal 3.2 Tbps',
        basePriceMonthly: 169,
        popular: false
      },
      {
        id: 'dedi-5',
        name: 'Nova Dedi Dual XE-40',
        processor: '2x Intel Xeon Silver 4316',
        cores: '40 Core / 80 Thread (3.4 GHz)',
        ram: '128 GB DDR4 ECC Reg',
        storage: '2x 1.92 TB Enterprise NVMe',
        bandwidth: 'Sınırsız Trafik (1 Gbit/s Hat)',
        ip: '6 Adet Kullanılabilir IPv4',
        ddos: 'Voxility Donanımsal 3.2 Tbps',
        basePriceMonthly: 199,
        popular: false
      },
      {
        id: 'dedi-6',
        name: 'Nova Dedi Gold 5318Y',
        processor: '2x Intel Xeon Gold 5318Y',
        cores: '48 Core / 96 Thread (3.4 GHz)',
        ram: '128 GB DDR4 ECC Reg',
        storage: '2x 1.92 TB Enterprise NVMe',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '8 Adet Kullanılabilir IPv4',
        ddos: 'Voxility Donanımsal 3.2 Tbps',
        basePriceMonthly: 239,
        popular: false
      },
      {
        id: 'dedi-7',
        name: 'Nova Dedi Gold 6330',
        processor: '2x Intel Xeon Gold 6330',
        cores: '56 Core / 112 Thread (3.1 GHz)',
        ram: '256 GB DDR4 ECC Reg',
        storage: '4x 1.92 TB Enterprise NVMe (RAID-10)',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '8 Adet Kullanılabilir IPv4',
        ddos: 'Voxility Donanımsal 3.2 Tbps',
        basePriceMonthly: 289,
        popular: false
      },
      {
        id: 'dedi-8',
        name: 'Nova Dedi EPYC 7763',
        processor: 'AMD EPYC™ 7763 Milan',
        cores: '64 Core / 128 Thread (3.5 GHz)',
        ram: '128 GB DDR4 ECC Reg',
        storage: '2x 1.92 TB Enterprise NVMe',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '8 Adet Kullanılabilir IPv4',
        ddos: 'Voxility Donanımsal 3.2 Tbps',
        basePriceMonthly: 269,
        popular: false
      },
      {
        id: 'dedi-9',
        name: 'Nova Dedi Dual EPYC 7763',
        processor: '2x AMD EPYC™ 7763 Milan',
        cores: '128 Core / 256 Thread (3.5 GHz)',
        ram: '256 GB DDR4 ECC Reg',
        storage: '4x 3.84 TB Enterprise NVMe',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '12 Adet Kullanılabilir IPv4',
        ddos: 'Voxility + Arbor Donanımsal',
        basePriceMonthly: 389,
        popular: false
      },
      {
        id: 'dedi-10',
        name: 'Nova Dedi EPYC 9124',
        processor: 'AMD EPYC™ 9124 Genoa',
        cores: '16 Core / 32 Thread (3.7 GHz)',
        ram: '64 GB DDR5 ECC 4800MHz',
        storage: '2x 960 GB Gen5 NVMe',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '6 Adet Kullanılabilir IPv4',
        ddos: 'Voxility + Arbor Donanımsal',
        basePriceMonthly: 179,
        popular: false
      },
      {
        id: 'dedi-11',
        name: 'Nova Dedi EPYC 9254',
        processor: 'AMD EPYC™ 9254 Genoa',
        cores: '24 Core / 48 Thread (4.15 GHz)',
        ram: '96 GB DDR5 ECC 4800MHz',
        storage: '2x 1.92 TB Gen5 NVMe',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '8 Adet Kullanılabilir IPv4',
        ddos: 'Voxility + Arbor Donanımsal',
        basePriceMonthly: 229,
        popular: false
      },
      {
        id: 'dedi-12',
        name: 'Nova Bare-Metal EPYC 9354',
        processor: 'AMD EPYC™ 9354 32C/64T',
        cores: '32 Core / 64 Thread (3.8 GHz)',
        ram: '128 GB DDR5 ECC 4800MHz',
        storage: '2x 1.92 TB NVMe U.2 Enterprise',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '8 Adet Kullanılabilir IPv4',
        ddos: 'Voxility + Arbor Donanımsal',
        basePriceMonthly: 279,
        popular: true
      },
      {
        id: 'dedi-13',
        name: 'Nova Dedi EPYC 9454',
        processor: 'AMD EPYC™ 9454 Genoa',
        cores: '48 Core / 96 Thread (3.8 GHz)',
        ram: '192 GB DDR5 ECC 4800MHz',
        storage: '2x 3.84 TB NVMe U.2 Enterprise',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '10 Adet Kullanılabilir IPv4',
        ddos: 'Voxility + Arbor Donanımsal',
        basePriceMonthly: 349,
        popular: false
      },
      {
        id: 'dedi-14',
        name: 'Nova Dedi EPYC 9554',
        processor: 'AMD EPYC™ 9554 Genoa',
        cores: '64 Core / 128 Thread (3.75 GHz)',
        ram: '256 GB DDR5 ECC 4800MHz',
        storage: '4x 1.92 TB NVMe (RAID-10)',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '12 Adet Kullanılabilir IPv4',
        ddos: 'Voxility + Arbor Donanımsal',
        basePriceMonthly: 429,
        popular: false
      },
      {
        id: 'dedi-15',
        name: 'Nova Dedi Dual EPYC 9354',
        processor: '2x AMD EPYC™ 9354 Genoa',
        cores: '64 Core / 128 Thread (3.8 GHz)',
        ram: '256 GB DDR5 ECC 4800MHz',
        storage: '4x 3.84 TB NVMe U.2 Enterprise',
        bandwidth: 'Sınırsız Trafik (20 Gbit/s Dual Hat)',
        ip: '16 Adet Kullanılabilir IPv4',
        ddos: 'Özel BGP L7 Koruma',
        basePriceMonthly: 499,
        popular: false
      },
      {
        id: 'dedi-16',
        name: 'Nova Dedi Dual EPYC 9554',
        processor: '2x AMD EPYC™ 9554 Genoa',
        cores: '128 Core / 256 Thread (3.75 GHz)',
        ram: '512 GB DDR5 ECC 4800MHz',
        storage: '4x 3.84 TB NVMe Enterprise',
        bandwidth: 'Sınırsız Trafik (20 Gbit/s Dual Hat)',
        ip: '16 Adet Kullanılabilir IPv4',
        ddos: 'Özel BGP L7 Koruma',
        basePriceMonthly: 649,
        popular: false
      },
      {
        id: 'dedi-17',
        name: 'Nova Bare-Metal DUAL EPYC 9654',
        processor: '2x AMD EPYC™ 9654 Extreme',
        cores: '192 Core / 384 Thread (3.7 GHz)',
        ram: '512 GB DDR5 ECC Reg (12 Channel)',
        storage: '4x 3.84 TB Enterprise NVMe (HW RAID-10)',
        bandwidth: 'Sınırsız Trafik (2x 10 Gbit/s Redundant)',
        ip: '16 Adet Kullanılabilir IPv4',
        ddos: 'Özel Custom BGP L7 Koruma',
        basePriceMonthly: 899,
        popular: false
      },
      {
        id: 'dedi-18',
        name: 'Nova Titan Bergamo 9754 Monster',
        processor: '2x AMD EPYC™ 9754 Bergamo',
        cores: '256 Core / 512 Thread (3.1 GHz)',
        ram: '1024 GB (1 TB) DDR5 ECC',
        storage: '8x 7.68 TB Gen5 Enterprise NVMe',
        bandwidth: 'Sınırsız Trafik (40 Gbit/s Quad Hat)',
        ip: '32 Adet Kullanılabilir IPv4',
        ddos: 'Özel Custom BGP L7 Koruma',
        basePriceMonthly: 1450,
        popular: false
      }
    ]
  },
  {
    id: 'gpu-cloud',
    title: 'GPU & Yapay Zeka Sunucuları',
    subtitle: 'NVIDIA RTX 4090 & Enterprise L40S ile LLM Eğitimi, Render ve Yapay Zeka',
    badge: 'NVIDIA Tensor Core',
    plans: [
      {
        id: 'gpu-1',
        name: 'Nova-AI RTX 4060 Ti',
        processor: 'Intel Core i7-14700K + 1x RTX 4060 Ti',
        cores: '20 Core / 28 Thread (5.6 GHz)',
        ram: '32 GB DDR5 5600MHz',
        storage: '1 TB Gen4 NVMe',
        gpu: '1x NVIDIA RTX 4060 Ti (16GB VRAM)',
        bandwidth: 'Sınırsız Trafik (1 Gbit/s Hat)',
        ip: '2 Adet IPv4',
        ddos: 'Akıllı AI Filtre Katmanı',
        basePriceMonthly: 129,
        popular: false
      },
      {
        id: 'gpu-2',
        name: 'Nova-AI RTX 4070 Ti Super',
        processor: 'Intel Core i9-14900K + 1x RTX 4070 Ti Super',
        cores: '24 Core / 32 Thread (6.0 GHz)',
        ram: '48 GB DDR5 5600MHz',
        storage: '1 TB Gen4 NVMe',
        gpu: '1x NVIDIA RTX 4070 Ti Super (16GB VRAM)',
        bandwidth: 'Sınırsız Trafik (1 Gbit/s Hat)',
        ip: '2 Adet IPv4',
        ddos: 'Akıllı AI Filtre Katmanı',
        basePriceMonthly: 179,
        popular: false
      },
      {
        id: 'gpu-3',
        name: 'Nova-AI RTX 4080 Super',
        processor: 'AMD Ryzen 9 7950X + 1x RTX 4080 Super',
        cores: '16 Core / 32 Thread (5.7 GHz)',
        ram: '64 GB DDR5 5600MHz',
        storage: '1 TB Gen4 NVMe',
        gpu: '1x NVIDIA RTX 4080 Super (16GB GDDR6X)',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '2 Adet IPv4',
        ddos: 'Akıllı AI Filtre Katmanı',
        basePriceMonthly: 239,
        popular: false
      },
      {
        id: 'gpu-4',
        name: 'Nova-AI Workstation 4090',
        processor: 'AMD Ryzen 9 7950X + 1x RTX 4090',
        cores: '16 Core / 32 Thread (5.7 GHz)',
        ram: '64 GB DDR5 5600MHz',
        storage: '1 TB Gen4 NVMe (7400 MB/s)',
        gpu: '1x NVIDIA GeForce RTX 4090 (24GB GDDR6X)',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '2 Adet IPv4',
        ddos: 'Akıllı AI Filtre Katmanı',
        basePriceMonthly: 299,
        popular: true
      },
      {
        id: 'gpu-5',
        name: 'Nova-AI Workstation Dual 4090',
        processor: 'AMD Ryzen 9 9950X + 2x RTX 4090',
        cores: '16 Core / 32 Thread (5.7 GHz)',
        ram: '128 GB DDR5 6000MHz',
        storage: '2x 2 TB Gen4 NVMe (RAID-0)',
        gpu: '2x NVIDIA GeForce RTX 4090 (48GB Total VRAM)',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '4 Adet IPv4',
        ddos: 'Akıllı AI Filtre Katmanı',
        basePriceMonthly: 549,
        popular: false
      },
      {
        id: 'gpu-6',
        name: 'Nova-AI Quadro RTX A4500',
        processor: 'Intel Xeon Silver 4314 + 1x RTX A4500',
        cores: '16 Core / 32 Thread (3.4 GHz)',
        ram: '64 GB DDR4 ECC Reg',
        storage: '2x 960 GB Enterprise NVMe',
        gpu: '1x NVIDIA RTX A4500 (20GB GDDR6 ECC)',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '2 Adet IPv4',
        ddos: 'Voxility + Arbor Donanımsal',
        basePriceMonthly: 279,
        popular: false
      },
      {
        id: 'gpu-7',
        name: 'Nova-AI Quadro RTX A5000',
        processor: 'Intel Xeon Silver 4314 + 1x RTX A5000',
        cores: '16 Core / 32 Thread (3.4 GHz)',
        ram: '128 GB DDR4 ECC Reg',
        storage: '2x 1.92 TB Enterprise NVMe',
        gpu: '1x NVIDIA RTX A5000 (24GB GDDR6 ECC)',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '3 Adet IPv4',
        ddos: 'Voxility + Arbor Donanımsal',
        basePriceMonthly: 379,
        popular: false
      },
      {
        id: 'gpu-8',
        name: 'Nova-AI Quadro RTX A6000',
        processor: 'AMD EPYC™ 9254 + 1x RTX A6000',
        cores: '24 Core / 48 Thread (4.15 GHz)',
        ram: '128 GB DDR5 ECC 4800MHz',
        storage: '2x 1.92 TB Enterprise NVMe',
        gpu: '1x NVIDIA RTX A6000 (48GB GDDR6 ECC)',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '4 Adet IPv4',
        ddos: 'Voxility + Arbor Donanımsal',
        basePriceMonthly: 589,
        popular: false
      },
      {
        id: 'gpu-9',
        name: 'Nova-AI Tensor Dual L4',
        processor: 'AMD EPYC™ 9354 + 2x NVIDIA L4',
        cores: '32 Core / 64 Thread',
        ram: '128 GB DDR5 ECC Reg',
        storage: '2x 1.92 TB NVMe Gen4 Enterprise',
        gpu: '2x NVIDIA L4 Tensor Core (48GB Total VRAM)',
        bandwidth: 'Sınırsız Trafik (10 Gbit/s Hat)',
        ip: '4 Adet IPv4',
        ddos: 'Voxility + Arbor Donanımsal',
        basePriceMonthly: 690,
        popular: false
      },
      {
        id: 'gpu-10',
        name: 'Nova-AI Enterprise L40S',
        processor: 'AMD EPYC™ 9354 + 2x NVIDIA L40S',
        cores: '32 Core / 64 Thread',
        ram: '256 GB DDR5 ECC Reg',
        storage: '2x 3.84 TB NVMe Gen4 Enterprise',
        gpu: '2x NVIDIA L40S (96GB Total VRAM)',
        bandwidth: 'Sınırsız Trafik (20 Gbit/s Dual Hat)',
        ip: '4 Adet IPv4',
        ddos: 'Voxility + Arbor Global Kalkan',
        basePriceMonthly: 1290,
        popular: false
      },
      {
        id: 'gpu-11',
        name: 'Nova-AI Enterprise Quad L40S',
        processor: '2x AMD EPYC™ 9454 + 4x NVIDIA L40S',
        cores: '96 Core / 192 Thread',
        ram: '512 GB DDR5 ECC Reg',
        storage: '4x 3.84 TB NVMe Enterprise',
        gpu: '4x NVIDIA L40S (192GB Total VRAM)',
        bandwidth: 'Sınırsız Trafik (20 Gbit/s Dual Hat)',
        ip: '8 Adet IPv4',
        ddos: 'Voxility + Arbor Global Kalkan',
        basePriceMonthly: 2490,
        popular: false
      },
      {
        id: 'gpu-12',
        name: 'Nova-AI Supercluster 8x H100',
        processor: '2x AMD EPYC™ 9654 + 8x NVIDIA H100 SXM5',
        cores: '192 Core / 384 Thread',
        ram: '1024 GB (1 TB) DDR5 ECC',
        storage: '8x 3.84 TB NVMe U.2 Enterprise',
        gpu: '8x NVIDIA H100 (640GB HBM3 VRAM)',
        bandwidth: '400 Gbit/s Quantum-2 InfiniBand',
        ip: '16 Adet IPv4',
        ddos: 'Özel Kurumsal AI Altyapısı',
        basePriceMonthly: 16500,
        popular: false
      }
    ]
  }
];

export function formatPrice(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '0';
  return Math.round(Number(amount)).toLocaleString('tr-TR');
}

export const formatCurrency = formatPrice;

export function calculatePlanPrice(baseMonthly, cycleId, addons = []) {
  const cycle = BILLING_CYCLES.find(c => c.id === cycleId) || BILLING_CYCLES[0];
  const discountedMonthly = baseMonthly * (1 - cycle.discount / 100);
  const planTotal = discountedMonthly * cycle.months;

  let addonsTotal = 0;
  addons.forEach(addon => {
    addonsTotal += (addon.priceMonthly || 0) * cycle.months;
  });

  const subtotal = planTotal + addonsTotal;
  const vat = subtotal * 0.20;
  const total = subtotal + vat;

  return {
    cycle,
    baseMonthly,
    discountedMonthly: Math.round(discountedMonthly),
    planTotal: Math.round(planTotal),
    addonsTotal: Math.round(addonsTotal),
    subtotal: Math.round(subtotal),
    vat: Math.round(vat),
    total: Math.round(total),
    savings: Math.round((baseMonthly * cycle.months) - planTotal)
  };
}
