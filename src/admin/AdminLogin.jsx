import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { adminLogin, checkBruteForce } from '../services/adminAuthService.js';

export default function AdminLogin({ onLoginSuccess, onNavigate }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('NovaQ@Admin2026!');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lockStatus, setLockStatus] = useState({ isLocked: false, remainingSeconds: 0 });

  useEffect(() => {
    const status = checkBruteForce();
    setLockStatus(status);

    if (status.isLocked) {
      const interval = setInterval(() => {
        const updated = checkBruteForce();
        setLockStatus(updated);
        if (!updated.isLocked) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await adminLogin(username, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Giriş yapılamadı.');
        const status = checkBruteForce();
        setLockStatus(status);
        setLoading(false);
        return;
      }

      onLoginSuccess(res.session);
    } catch (err) {
      setErrorMessage(err.message || 'Giriş sırasında hata oluştu.');
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setUsername('admin');
    setPassword('NovaQ@Admin2026!');
    setLoading(true);
    setErrorMessage('');
    const res = await adminLogin('admin', 'NovaQ@Admin2026!');
    if (res.success) {
      onLoginSuccess(res.session);
    } else {
      setErrorMessage(res.error);
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at center, #0f172a 0%, #030712 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem 1rem',
      fontFamily: 'var(--font-sans)',
      color: '#ffffff'
    }}>
      {/* Back to Public Link */}
      <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => onNavigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
        >
          <ArrowLeft size={14} />
          <span>Ana Web Sitesine Dön</span>
        </button>
      </div>

      <div style={{ maxWidth: '440px', width: '100%' }}>
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(30, 58, 138, 0.3))',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            color: '#ef4444',
            boxShadow: '0 0 25px rgba(239, 68, 68, 0.25)'
          }}>
            <Shield size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            NovaQ Servers Yönetici Portalı
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Kurumsal Altyapı ve Sunucu Yönetim Sistemi
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(16px)'
        }}>
          {/* Brute-force Lock Warning */}
          {lockStatus.isLocked && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              color: '#ef4444',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={18} />
              <span>Güvenlik kilidi devrede! Kalan süre: {lockStatus.remainingSeconds} saniye.</span>
            </div>
          )}

          {errorMessage && !lockStatus.isLocked && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              color: '#ef4444',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1-Click Quick Demo Login */}
          <button 
            type="button"
            className="btn btn-secondary btn-block"
            onClick={handleQuickDemoLogin}
            disabled={loading || lockStatus.isLocked}
            style={{
              borderColor: '#ef4444',
              color: '#ef4444',
              background: 'rgba(239, 68, 68, 0.08)',
              padding: '0.75rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Sparkles size={16} />
            <span>⚡ 1-Tıkla Yönetici Girişi Yap (Root Demo)</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0', gap: '0.75rem' }}>
            <div style={{ height: '1px', flex: 1, background: 'rgba(255, 255, 255, 0.1)' }}></div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>VEYA KİMLİK BİLGİLERİYLE</span>
            <div style={{ height: '1px', flex: 1, background: 'rgba(255, 255, 255, 0.1)' }}></div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>
                Yönetici Kullanıcı Adı
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  disabled={loading || lockStatus.isLocked}
                  style={{
                    background: 'rgba(2, 6, 23, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    padding: '0.75rem 1rem 0.75rem 2.5rem'
                  }}
                />
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>
                Yönetici Şifresi
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  disabled={loading || lockStatus.isLocked}
                  style={{
                    background: 'rgba(2, 6, 23, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    padding: '0.75rem 1rem 0.75rem 2.5rem'
                  }}
                />
                <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              style={{
                padding: '0.85rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                marginTop: '0.5rem',
                background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                borderColor: '#ef4444'
              }}
              disabled={loading || lockStatus.isLocked}
            >
              {loading ? (
                <span>Oturum Açılıyor...</span>
              ) : (
                <>
                  <span>Yönetici Paneline Giriş</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.72rem',
            color: '#64748b',
            lineHeight: 1.5,
            textAlign: 'center'
          }}>
            🔒 Bu alan yalnızca yetkili sistem yöneticileri içindir. Tüm erişim ve giriş girişimleri IP adresiyle birlikte kayıt altına alınmaktadır.
          </div>
        </div>
      </div>
    </div>
  );
}
