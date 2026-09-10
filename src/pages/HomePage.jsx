import React from 'react';
import { 
  Server, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  HardDrive, 
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import Hero from '../components/Hero';
import DatacenterMap from '../components/DatacenterMap';
import InfraFeatures from '../components/InfraFeatures';
import { SERVER_CATEGORIES } from '../data/serverPlans';

export default function HomePage({ onNavigate, onSelectPlan, onOpenConfigurator, onOpenPortal }) {
  const vdsPlans = SERVER_CATEGORIES.find(c => c.id === 'nvme-vds')?.plans || [];
  const ryzenPlans = SERVER_CATEGORIES.find(c => c.id === 'ryzen-vds')?.plans || [];
  const dediPlans = SERVER_CATEGORIES.find(c => c.id === 'dedicated')?.plans || [];
  const gpuPlans = SERVER_CATEGORIES.find(c => c.id === 'gpu-cloud')?.plans || [];

  return (
    <div className="home-page-view">
      {/* Hero Section */}
      <Hero 
        onNavigate={onNavigate}
        onOpenCatalog={() => onNavigate('vds')}
        onOpenPortal={onOpenPortal}
        onOpenConfigurator={() => onOpenConfigurator(vdsPlans[1] || vdsPlans[0])}
      />

      {/* Featured Server Solutions Grid (Multi-page Gateway) */}
      <section className="section-padding" style={{ background: 'linear-gradient(180deg, rgba(7,9,14,0.4) 0%, rgba(11,15,25,0.8) 100%)' }}>
        <div className="container">
          <div className="section-header text-center" style={{ maxWidth: '1100px', margin: '0 auto 3rem' }}>
            <div className="section-badge">
              <Sparkles size={14} />
              <span>KURUMSAL ÇÖZÜMLERİMİZ</span>
            </div>
            <h2 className="section-title home-solutions-title">
              İhtiyacınıza Özel <span className="text-gradient">Yüksek Performanslı Sunucular</span>
            </h2>
            <p className="section-subtitle" style={{ maxWidth: '780px', margin: '0 auto' }}>
              Sanal Bulut VDS, saf güç sunan Dedicated Fiziksel Sunucular ve Yapay Zeka GPU iş istasyonları.
              Frankfurt, Hong Kong ve Paris Tier-IV veri merkezlerimizde anında aktif.
            </p>
          </div>

          <div className="product-showcase-grid">
            {/* Card 1: Sanal Sunucular */}
            <div className="showcase-card" onClick={() => onNavigate('vds')}>
              <div className="showcase-badge">En Çok Satan</div>
              <div className="showcase-icon">
                <Server size={28} color="var(--accent-cyan)" />
              </div>
              <h3>Sanal Sunucular (VDS)</h3>
              <p>Intel Xeon Platinum ve AMD EPYC mimarisi ile Gen4 NVMe diskli, paylaşımsız kaynaklı kurumsal bulut sunucular.</p>
              <ul className="showcase-features">
                <li><CheckCircle2 size={16} color="var(--accent-cyan)" /> 2 - 16 Dedicated vCPU Seçenekleri</li>
                <li><CheckCircle2 size={16} color="var(--accent-cyan)" /> 4 GB - 32 GB DDR5/DDR4 ECC RAM</li>
                <li><CheckCircle2 size={16} color="var(--accent-cyan)" /> 60s Anında Otomatik Kurulum</li>
              </ul>
              <div className="showcase-footer">
                <div className="showcase-price">
                  <span className="price-start">Başlangıç:</span>
                  <span className="price-val">$8 <small>/ay</small></span>
                </div>
                <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); onNavigate('vds'); }}>
                  <span>İncele</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Card 2: Extreme Ryzen VDS */}
            <div className="showcase-card featured" onClick={() => onNavigate('vds')}>
              <div className="showcase-badge featured-badge">5.7 GHz Boost</div>
              <div className="showcase-icon">
                <Zap size={28} color="#f59e0b" />
              </div>
              <h3>Extreme Ryzen 9 VDS</h3>
              <p>AMD Ryzen 9 9950X işlemcilerle maksimum tek çekirdek hızı. Oyun sunucuları, yüksek veritabanı ve anlık derleme için.</p>
              <ul className="showcase-features">
                <li><CheckCircle2 size={16} color="#f59e0b" /> 5.7 GHz Tüm Çekirdek Boost Frekansı</li>
                <li><CheckCircle2 size={16} color="#f59e0b" /> Samsung PM9A3 7400 MB/s NVMe</li>
                <li><CheckCircle2 size={16} color="#f59e0b" /> Voxility Game Anti-DDoS Kalkanı</li>
              </ul>
              <div className="showcase-footer">
                <div className="showcase-price">
                  <span className="price-start">Başlangıç:</span>
                  <span className="price-val">$19 <small>/ay</small></span>
                </div>
                <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); onNavigate('vds'); }}>
                  <span>İncele</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Card 3: Fiziksel Sunucular */}
            <div className="showcase-card" onClick={() => onNavigate('dedicated')}>
              <div className="showcase-badge">Bare-Metal Güç</div>
              <div className="showcase-icon">
                <HardDrive size={28} color="#10b981" />
              </div>
              <h3>Fiziksel Dedicated Sunucular</h3>
              <p>Donanımın %100'ü size tahsisli. Çift AMD EPYC veya Xeon Platinum, Donanımsal RAID ve 10 Gbps hat seçeneği.</p>
              <ul className="showcase-features">
                <li><CheckCircle2 size={16} color="#10b981" /> 192 Core / 384 Thread'e kadar güç</li>
                <li><CheckCircle2 size={16} color="#10b981" /> IPMI / iDRAC KVM Uzak Yönetim</li>
                <li><CheckCircle2 size={16} color="#10b981" /> 2 Saat Donanım Değişim Garantisi</li>
              </ul>
              <div className="showcase-footer">
                <div className="showcase-price">
                  <span className="price-start">Başlangıç:</span>
                  <span className="price-val">$89 <small>/ay</small></span>
                </div>
                <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); onNavigate('dedicated'); }}>
                  <span>İncele</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Card 4: Ekran Kartlı Sunucular */}
            <div className="showcase-card" onClick={() => onNavigate('gpu')}>
              <div className="showcase-badge gpu-badge">AI & Render</div>
              <div className="showcase-icon">
                <Cpu size={28} color="#a855f7" />
              </div>
              <h3>Ekran Kartlı Sunucular (GPU)</h3>
              <p>NVIDIA RTX 4090 ve L40S Tensor Core GPU'lar ile Yapay Zeka, LLM eğitimi, 3D Render ve Deep Learning altyapısı.</p>
              <ul className="showcase-features">
                <li><CheckCircle2 size={16} color="#a855f7" /> 24GB - 96GB GDDR6X / ECC VRAM</li>
                <li><CheckCircle2 size={16} color="#a855f7" /> CUDA, PyTorch, TensorRT Hazır İmajlar</li>
                <li><CheckCircle2 size={16} color="#a855f7" /> 20 Gbps Yedekli Ağ Omurgası</li>
              </ul>
              <div className="showcase-footer">
                <div className="showcase-price">
                  <span className="price-start">Başlangıç:</span>
                  <span className="price-val">$129 <small>/ay</small></span>
                </div>
                <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); onNavigate('gpu'); }}>
                  <span>İncele</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Datacenter Map & Ping Simulation */}
      <DatacenterMap />

      {/* Infrastructure & Security Highlights */}
      <InfraFeatures />


      {/* Corporate Final Call to Action */}
      <section className="cta-banner-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Kurumsal Projeleriniz İçin Özel Donanım Çözümleri</h2>
              <p>
                İhtiyacınıza uygun sunucu modelini seçin veya özel BGP anons, özel subnet ve 
                multi-datacenter mimarisi için mühendislerimizle görüşün.
              </p>
              <div className="cta-buttons">
                <button className="btn btn-primary" onClick={() => onNavigate('vds')}>
                  <span>Sanal Sunucuları İncele</span>
                  <ArrowRight size={16} />
                </button>
                <button className="btn btn-secondary" onClick={() => onNavigate('contact')}>
                  <span>Satış Ekibiyle İletişime Geç</span>
                </button>
              </div>
            </div>
            <div className="cta-stats">
              <div className="stat-box">
                <strong>%99.99</strong>
                <span>SLA Uptime Taahhüdü</span>
              </div>
              <div className="stat-box">
                <strong>60 Saniye</strong>
                <span>Otomatik Kurulum</span>
              </div>
              <div className="stat-box">
                <strong>3.2 Tbps</strong>
                <span>Voxility Koruması</span>
              </div>
              <div className="stat-box">
                <strong>7/24</strong>
                <span>Tier-3 NOC Mühendis Desteği</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
