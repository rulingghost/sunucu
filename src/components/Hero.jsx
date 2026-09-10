import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Cpu, 
  Shield, 
  Zap, 
  Server, 
  Globe2, 
  ChevronLeft, 
  ChevronRight,
  Flame,
  Sparkles,
  HardDrive
} from 'lucide-react';

export default function Hero({ onNavigate, onOpenCatalog, onOpenPortal, onOpenConfigurator }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const SLIDE_DURATION = 6000; // 6 seconds

  const slides = [
    {
      id: 'vds',
      image: '/assets/slider-nvme.jpg',
      badgeText: 'Tier IV Standartlarında Küresel Bulut Altyapısı',
      badgeIcon: <span className="pulse-online"></span>,
      badgeColor: 'cyan',
      titleLead: 'Geleceğin Performansı:',
      titleHighlight: 'Yüksek Güçlü NVMe VDS',
      highlightClass: 'grad-cyber-text',
      description: '%100 KVM tahsisli çekirdek gücü, kurumsal Samsung Gen4 NVMe diskler ve 10 Gbps port ile 60 saniyede hazır bulut sunucular.',
      locations: [
        { flag: '🇩🇪', text: 'Frankfurt (Equinix FR2)' },
        { flag: '🇭🇰', text: 'Hong Kong (Equinix HK1)' },
        { flag: '🇫🇷', text: 'Fransa (OVH Campus)' }
      ],
      primaryBtn: {
        text: 'NVMe Paketlerini İncele',
        action: () => onNavigate ? onNavigate('vds') : onOpenCatalog()
      },
      secondaryBtn: {
        text: 'Canlı Ping & Test IP',
        action: () => onNavigate ? onNavigate('datacenters') : null
      }
    },
    {
      id: 'extreme',
      image: '/assets/slider-ryzen.jpg',
      badgeText: '5.7 GHz Rekor Tek Çekirdek & Sıvı Soğutma',
      badgeIcon: <Flame size={14} color="#f59e0b" />,
      badgeColor: 'amber',
      titleLead: 'Maksimum Saat Hızı:',
      titleHighlight: 'Extreme Ryzen 9 9950X VDS',
      highlightClass: 'grad-fire-text',
      description: 'DDR5 6000MHz ECC bellekler ve L7 Game Anti-DDoS ile FiveM, Minecraft ve derleme projelerinde sıfır gecikme.',
      locations: [
        { flag: '🇩🇪', text: 'Frankfurt Game Hub (28ms)' },
        { flag: '🇫🇷', text: 'Paris EcoCampus' },
        { flag: '🇭🇰', text: 'Hong Kong Hub' }
      ],
      primaryBtn: {
        text: 'Extreme Ryzen Paketleri',
        action: () => onNavigate ? onNavigate('extreme') : onOpenCatalog()
      },
      secondaryBtn: {
        text: 'Game DDoS Kalkanı',
        action: () => onNavigate ? onNavigate('extreme') : null
      }
    },
    {
      id: 'dedicated',
      image: '/assets/slider-gpu.jpg',
      badgeText: '%100 Donanım İzolasyonu & Tensor GPU',
      badgeIcon: <Sparkles size={14} color="#10b981" />,
      badgeColor: 'emerald',
      titleLead: 'Saf Bare-Metal Gücü:',
      titleHighlight: 'Dedicated & NVIDIA RTX 4090',
      highlightClass: 'grad-emerald-text',
      description: 'Sanallaştırma katmanı olmadan tüm donanım size ait. Çift AMD EPYC, IPMI KVM tam yetki ve 120 dakikada parça SLA garantisi.',
      locations: [
        { flag: '🇩🇪', text: 'Frankfurt Tier-IV' },
        { flag: '🇫🇷', text: 'Paris Enterprise' },
        { flag: '🇭🇰', text: 'Hong Kong Mega-i' }
      ],
      primaryBtn: {
        text: 'Dedicated Sunucuları Keşfet',
        action: () => onNavigate ? onNavigate('dedicated') : onOpenCatalog()
      },
      secondaryBtn: {
        text: 'GPU & AI Sunucular',
        action: () => onNavigate ? onNavigate('gpu') : null
      }
    }
  ];

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentSlide]);

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  return (
    <section 
      className="hero-slider-section" 
      id="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container">
        
        {/* Banner Slide Frame */}
        <div className="hero-banner-wrapper">
          {slides.map((s, idx) => {
            const isActive = idx === currentSlide;
            return (
              <div 
                key={s.id}
                className={`hero-slide-item ${isActive ? 'active' : ''}`}
              >
                {/* Background Image */}
                <div 
                  className="hero-banner-bg"
                  style={{ backgroundImage: `url(${s.image})` }}
                ></div>

                {/* Dark Contrast Gradient Overlay for crystal clear typography */}
                <div className="hero-banner-gradient"></div>

                {/* Slide Text Content */}
                <div className="hero-banner-content">
                  {/* Top Badge Pill */}
                  <div className={`hero-banner-pill pill-${s.badgeColor}`}>
                    {s.badgeIcon}
                    <span>{s.badgeText}</span>
                  </div>

                  {/* Title */}
                  <h1 className="hero-banner-title">
                    {s.titleLead} <br />
                    <span className={s.highlightClass}>{s.titleHighlight}</span>
                  </h1>

                  {/* Description */}
                  <p className="hero-banner-desc">
                    {s.description}
                  </p>

                  {/* Location Badges */}
                  <div className="hero-banner-locations">
                    {s.locations.map((loc, lIdx) => (
                      <React.Fragment key={lIdx}>
                        <div className="hero-loc-item">
                          <span className="hero-loc-flag">{loc.flag}</span>
                          <span>{loc.text}</span>
                        </div>
                        {lIdx < s.locations.length - 1 && (
                          <span className="loc-bullet">•</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="hero-banner-ctas">
                    <button 
                      type="button"
                      className={`btn btn-primary cta-${s.badgeColor}`}
                      onClick={s.primaryBtn.action}
                    >
                      <span>{s.primaryBtn.text}</span>
                      <ArrowRight size={17} />
                    </button>
                    
                    <button 
                      type="button"
                      className="btn btn-secondary"
                      onClick={s.secondaryBtn.action}
                    >
                      <span>{s.secondaryBtn.text}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Left / Right Navigation Arrows */}
          <button 
            type="button" 
            className="hero-arrow-btn prev"
            onClick={handlePrev}
            aria-label="Önceki Slayt"
          >
            <ChevronLeft size={26} />
          </button>

          <button 
            type="button" 
            className="hero-arrow-btn next"
            onClick={handleNext}
            aria-label="Sonraki Slayt"
          >
            <ChevronRight size={26} />
          </button>

          {/* Bottom Dot Indicators */}
          <div className="hero-banner-dots">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                className={`hero-banner-dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`${idx + 1}. Slayta Geç`}
              >
                <span className="dot-fill"></span>
              </button>
            ))}
          </div>

        </div>

        {/* Global Key Stats Bar Underneath Banner */}
        <div className="hero-stats-grid" style={{ marginTop: '2.5rem' }}>
          <div className="stat-card">
            <div className="stat-number">
              <Zap size={24} style={{ color: 'var(--accent-cyan)' }} />
              <span>10 Gbps</span>
            </div>
            <div className="stat-label">Yedekli BGP Port Hızı</div>
          </div>

          <div className="stat-card">
            <div className="stat-number">
              <Cpu size={24} style={{ color: '#f59e0b' }} />
              <span>5.7 GHz</span>
            </div>
            <div className="stat-label">Ryzen 9 & EPYC Gücü</div>
          </div>

          <div className="stat-card">
            <div className="stat-number">
              <Shield size={24} style={{ color: '#10b981' }} />
              <span>3.2 Tbps</span>
            </div>
            <div className="stat-label">Voxility Anti-DDoS Koruma</div>
          </div>

          <div className="stat-card">
            <div className="stat-number">
              <Sparkles size={24} style={{ color: '#a855f7' }} />
              <span>%99.99</span>
            </div>
            <div className="stat-label">Kurumsal Uptime Garantisi</div>
          </div>
        </div>

      </div>
    </section>
  );
}
