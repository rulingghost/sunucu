import React from 'react';
import { 
  ShieldCheck, 
  HardDrive, 
  Zap, 
  Clock, 
  RefreshCw, 
  Headphones, 
  Server, 
  Lock, 
  Activity 
} from 'lucide-react';

export default function InfraFeatures() {
  const features = [
    {
      icon: <ShieldCheck size={28} />,
      title: '3.2 Tbps Voxility Anti-DDoS Kalkanı',
      desc: 'Layer 3, Layer 4 ve Layer 7 BGP Anycast filtreleme. SYN Flood, UDP Amplification ve HTTP bot saldırıları sunucunuza ulaşmadan engellenir.'
    },
    {
      icon: <HardDrive size={28} />,
      title: 'Enterprise Gen4 NVMe (7.300 MB/s)',
      desc: 'Tüm sanal ve dedicated sunucularımızda kurumsal Samsung PM9A3 ve Micron 7450 PRO U.2 NVMe diskler ile 1.000.000+ IOPS okuma-yazma performansı.'
    },
    {
      icon: <Zap size={28} />,
      title: '10 Gbit/s Redundant Tier-1 Uplink',
      desc: 'Her sunucu kabininde çift 10G uplink. DE-CIX, Telia Arelion, Cogent, France-IX ve HKIX doğrudan peering hatları ile sıfır darboğaz.'
    },
    {
      icon: <Clock size={28} />,
      title: '60 Saniye Anında Otomatik Aktivasyon',
      desc: 'Siparişiniz onaylandığı anda bulut orkestrasyon motorumuz seçtiğiniz işletim sistemini 60 saniye içinde deploy eder ve giriş bilgilerinizi panele yansıtır.'
    },
    {
      icon: <RefreshCw size={28} />,
      title: 'Otomatik Snapshot & Anlık Görüntü',
      desc: 'Sunucunuzun canlı imajını tek tıkla kaydedin. Olası yazılım veya yapılandırma hatalarında 10 saniye içinde geri yükleme gücü.'
    },
    {
      icon: <Headphones size={28} />,
      title: '7/24 Kıdemli NOC Mühendis Desteği',
      desc: 'Robot veya bot yanıtları yok. Deneyimli sistem ve ağ yöneticilerimizden ortalama 12 dakika içinde doğrudan teknik çözüm alın.'
    }
  ];

  return (
    <section className="infra-section" id="infra">
      <div className="container">
        <div className="section-header">
          <div className="section-pill">
            <Activity size={14} />
            <span>Neden NovaQ Servers Altyapısı?</span>
          </div>
          <h2 className="section-title">
            Ödün Verilmeyen <span className="grad-cyber-text">Kurumsal Güvenilirlik</span>
          </h2>
          <p className="section-desc">
            Sıradan hosting veya sanallaştırma platformlarından farklı olarak; saf kurumsal donanım, 
            kesintisiz enerji ve küresel BGP yedekliliği sunuyoruz.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-box">
              <div className="feature-icon-wrapper">
                {f.icon}
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
