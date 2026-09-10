import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export default function SubpageHeader({ 
  badge, 
  title, 
  subtitle, 
  breadcrumbs = [], 
  onNavigate,
  trustPills = [] 
}) {
  return (
    <section className="subpage-hero">
      {/* Ambient Cyber Lighting */}
      <div className="subpage-ambient-glow glow-1"></div>
      <div className="subpage-ambient-glow glow-2"></div>
      <div className="subpage-grid-overlay"></div>

      <div className="container subpage-hero-container">
        {/* Breadcrumb Navigation */}
        <nav className="subpage-breadcrumb" aria-label="Ekmek Kırıntısı Navigasyonu">
          <button 
            type="button" 
            className="crumb-link home-crumb" 
            onClick={() => onNavigate && onNavigate('home')}
            title="NovaQ Servers Anasayfa"
          >
            <Home size={14} />
            <span>Anasayfa</span>
          </button>

          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight size={13} className="crumb-separator" />
              {crumb.pageId ? (
                <button 
                  type="button" 
                  className="crumb-link" 
                  onClick={() => onNavigate && onNavigate(crumb.pageId)}
                >
                  {crumb.label}
                </button>
              ) : (
                <span className={`crumb-item ${crumb.active ? 'crumb-active' : ''}`}>
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Hero Title & Description Wrap */}
        <div className="subpage-title-wrap">
          {badge && (
            <div className="subpage-badge">
              <span className="badge-pulse"></span>
              {badge.icon && <span className="badge-icon">{badge.icon}</span>}
              <span className="badge-text">{badge.text}</span>
            </div>
          )}

          <h1 className="subpage-title">
            {title}
          </h1>

          {subtitle && (
            <p className="subpage-desc">
              {subtitle}
            </p>
          )}
        </div>

        {/* Trust & Network Indicators Bar */}
        {trustPills && trustPills.length > 0 && (
          <div className="subpage-trust-bar">
            {trustPills.map((pill, idx) => (
              <div key={idx} className="subpage-trust-pill">
                {pill.icon}
                <span>{pill.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
