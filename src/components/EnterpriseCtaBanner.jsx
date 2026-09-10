import React from 'react';
import { Server, ArrowRight, ShieldCheck, Zap, Phone, Sparkles, Clock } from 'lucide-react';

export default function EnterpriseCtaBanner({ 
  onNavigate, 
  onOpenConfigurator,
  title = "Projeniz İçin Doğru Sunucu Altyapısını Birlikte Belirleyelim",
  subtitle = "Almanya (Frankfurt), Hong Kong ve Fransa (Paris) lokasyonlarında 10 Gbps NVMe ve Bare-Metal sunucularımızla altyapınızı güçlendirin. Uzman NOC ekibimiz 7/24 yanınızda.",
  primaryActionText = "Sunucu Yapılandır & Kirala",
  secondaryActionText = "Uzman ile Görüşün"
}) {
  return (
    <section className="enterprise-cta-section">
      <div className="container">
        <div className="cta-banner-card">
          <div className="cta-banner-glow"></div>
          
          <div className="cta-banner-content">
            {/* Live Indicator Badge */}
            <div className="cta-live-pill">
              <span className="cta-pulse-dot"></span>
              <Clock size={13} />
              <span>7/24 Kesintisiz Mühendislik & NOC Desteği (Ortalama Yanıt: 12 Dk)</span>
            </div>

            <h2 className="cta-banner-title">
              {title}
            </h2>

            <p className="cta-banner-desc">
              {subtitle}
            </p>

            {/* Feature Pills */}
            <div className="cta-feature-pills">
              <div className="cta-pill-item">
                <ShieldCheck size={16} color="var(--accent-cyan)" />
                <span>%99.99 SLA Uptime Garantisi</span>
              </div>
              <div className="cta-pill-item">
                <Zap size={16} color="#f59e0b" />
                <span>60 Saniyede Otomatik Kurulum</span>
              </div>
              <div className="cta-pill-item">
                <Server size={16} color="#10b981" />
                <span>3.2 Tbps Voxility DDoS Kalkanı</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="cta-actions-group">
              <button 
                type="button" 
                className="btn btn-primary btn-lg"
                onClick={() => {
                  if (onOpenConfigurator) {
                    onOpenConfigurator(null);
                  } else if (onNavigate) {
                    onNavigate('vds');
                  }
                }}
              >
                <span>{primaryActionText}</span>
                <ArrowRight size={16} />
              </button>

              <button 
                type="button" 
                className="btn btn-secondary btn-lg"
                onClick={() => onNavigate && onNavigate('contact')}
              >
                <Phone size={16} />
                <span>{secondaryActionText}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
