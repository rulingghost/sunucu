import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, Building, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { authService } from '../services/supabaseService';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('ahmet.yilmaz@novaq-client.com');
  const [loginPass, setLoginPass] = useState('••••••••••••');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regTerms, setRegTerms] = useState(true);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;
    setLoading(true);
    setErrorMessage('');
    
    try {
      const res = await authService.signIn(loginEmail, loginPass);
      if (res.error) {
        setErrorMessage(res.error.message || 'Giriş yapılamadı. Bilgilerinizi kontrol ediniz.');
        setLoading(false);
        return;
      }

      onLoginSuccess({
        name: loginEmail.includes('ahmet') ? 'Ahmet Yılmaz' : loginEmail.split('@')[0],
        email: loginEmail,
        isLoggedIn: true
      }, isSupabaseConfigured ? 'Supabase ile Canlı Giriş Yapıldı!' : 'Giriş Başarılı! (Demo Modu)');
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPass.trim()) {
      return alert('Lütfen zorunlu alanları (Ad Soyad, E-posta, Şifre) doldurunuz.');
    }
    if (!regTerms) {
      return alert('Lütfen Hizmet Sözleşmesi ve KVKK metnini onaylayınız.');
    }
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await authService.signUp(regEmail, regPass, regName, regCompany);
      if (res.error) {
        setErrorMessage(res.error.message || 'Kayıt oluşturulamadı.');
        setLoading(false);
        return;
      }

      const newUser = {
        name: regName,
        company: regCompany || `${regName} Şahıs`,
        email: regEmail,
        phone: regPhone || '+90 5XX XXX XX XX',
        customerId: 'NQ-' + Math.floor(10000 + Math.random() * 89999),
        tier: 'Standart Üye',
        balance: 1000.00,
        twoFactorEnabled: false,
        taxOffice: 'Belirtilmedi',
        taxNumber: 'Belirtilmedi',
        address: 'Belirtilmedi',
        city: 'İstanbul',
        country: 'Türkiye',
        registeredAt: new Date().toLocaleDateString('tr-TR'),
        isLoggedIn: true
      };

      onLoginSuccess(newUser, isSupabaseConfigured ? 'Supabase ile Kayıt Başarılı! E-posta onayınızı kontrol ediniz.' : 'Üyeliğiniz Başarıyla Oluşturuldu!');
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Kayıt sırasında hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '480px' }}
      >
        {/* Header with Mode Switcher */}
        <div className="terminal-header" style={{ padding: '1.25rem 1.75rem', background: '#090d18' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              className={`btn btn-sm ${mode === 'login' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setMode('login')}
            >
              <User size={14} />
              <span>Üye Girişi</span>
            </button>
            <button
              className={`btn btn-sm ${mode === 'register' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setMode('register')}
            >
              <Building size={14} />
              <span>Yeni Kayıt Ol</span>
            </button>
          </div>

          <button 
            className="btn btn-secondary btn-sm" 
            onClick={onClose}
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              <img src="/assets/novaq-logo.png" alt="NovaQ Servers" style={{ height: '42px', margin: '0 auto 0.5rem auto' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>NovaQ Servers Müşteri Girişi</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Sunucularınızı yönetmek ve siparişlerinizi takip etmek için giriş yapın.
              </p>
            </div>

            {errorMessage && (
              <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.825rem' }}>
                {errorMessage}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Kayıtlı E-posta Adresi
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="ornek@sirketiniz.com"
                  style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem' }}
                  required
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.825rem', fontWeight: 600 }}>Şifre</label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Demo: Şifre sıfırlama bağlantısı e-postanıza iletildi.'); }} style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                  Şifremi Unuttum?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••••••"
                  style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem' }}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.8rem', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}>
              <span>{loading ? 'Giriş Yapılıyor...' : 'Panele Giriş Yap'}</span>
              <ArrowRight size={16} />
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Henüz bir hesabınız yok mu?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setMode('register'); setErrorMessage(''); }} style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
                Hemen Ücretsiz Kayıt Olun
              </a>
            </div>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '75vh', overflowY: 'auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '0.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Yeni Müşteri Hesabı Oluştur</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                1 dakikada kurumsal sunucu kiralama hesabınızı açın.
              </p>
            </div>

            {errorMessage && (
              <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.825rem' }}>
                {errorMessage}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Ad Soyad *
              </label>
              <input
                type="text"
                placeholder="Örn: Ahmet Yılmaz"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Şirket / Firma Adı (Opsiyonel)
              </label>
              <input
                type="text"
                placeholder="Örn: Yılmaz Teknoloji A.Ş."
                value={regCompany}
                onChange={(e) => setRegCompany(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  E-posta *
                </label>
                <input
                  type="email"
                  placeholder="ornek@domain.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Cep Telefonu
                </label>
                <input
                  type="tel"
                  placeholder="+90 5XX XXX XX XX"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Şifre Belirleyin *
              </label>
              <input
                type="password"
                placeholder="En az 8 karakter..."
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem' }}
                required
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginTop: '0.35rem' }}>
              <input
                type="checkbox"
                id="terms"
                checked={regTerms}
                onChange={(e) => setRegTerms(e.target.checked)}
                style={{ marginTop: '0.2rem' }}
              />
              <label htmlFor="terms" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Hizmet Sözleşmesi ve SLA şartları.'); }} style={{ color: 'var(--accent-cyan)' }}>Hizmet Sözleşmesi</a> ve{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); alert('KVKK Aydınlatma Metni.'); }} style={{ color: 'var(--accent-cyan)' }}>KVKK Aydınlatma Metnini</a> okudum, onaylıyorum.
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.75rem', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}>
              <span>{loading ? 'Kayıt Yapılıyor...' : 'Hesabımı Oluştur & Giriş Yap'}</span>
              <ArrowRight size={16} />
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Zaten üye misiniz?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); setErrorMessage(''); }} style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
                Giriş Yapın
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
