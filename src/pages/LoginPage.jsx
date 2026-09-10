import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Lock,
  Building,
  Phone,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  ShoppingCart,
  AlertCircle,
  Eye,
  EyeOff,
  Server,
  Globe,
  LifeBuoy,
  Zap,
  CheckCircle2,
  LockKeyhole,
  Clock
} from 'lucide-react';
import { authService } from '../services/supabaseService';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { cartService } from '../services/cartService';
import './login-page.css';

function passwordStrength(value) {
  if (!value) return { score: 0, label: '', cls: '' };
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  if (score <= 1) return { score, label: 'Zayıf şifre', cls: 'weak' };
  if (score === 2 || score === 3) return { score, label: 'Orta seviye', cls: 'mid' };
  return { score, label: 'Güçlü şifre', cls: 'strong' };
}

export default function LoginPage({
  onLoginSuccess,
  onNavigate,
  cartCount = 0,
  initialMode = 'login',
  returnUrlOverride = null
}) {
  const [returnUrl, setReturnUrl] = useState('/panel');
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [accountType, setAccountType] = useState('corporate');
  const [regName, setRegName] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPass2, setRegPass2] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [regTerms, setRegTerms] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const searchParams = new URLSearchParams(window.location.search);
    const urlParam = searchParams.get('returnUrl');
    if (urlParam) setReturnUrl(urlParam);
    else if (returnUrlOverride) setReturnUrl(returnUrlOverride);
    if (window.location.pathname.includes('register')) setMode('register');
  }, [returnUrlOverride, initialMode]);

  const switchMode = (next) => {
    setMode(next);
    setErrorMessage('');
    const path = next === 'register' ? '/register' : '/login';
    if (onNavigate) onNavigate(path);
  };

  const handleQuickDemoLogin = () => {
    const demoUser = {
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
      registeredAt: '14.02.2024',
      isLoggedIn: true
    };
    cartService.mergeCartOnAuth(demoUser.customerId);
    onLoginSuccess(demoUser, returnUrl, 'Ahmet Yılmaz hesabı ile giriş yapıldı.');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPass.trim()) {
      setErrorMessage('E-posta ve şifre alanlarını doldurunuz.');
      return;
    }
    setLoading(true);
    setErrorMessage('');

    try {
      if (isSupabaseConfigured) {
        const res = await authService.signIn(loginEmail, loginPass);
        if (res.error) {
          setErrorMessage(res.error.message || 'Giriş yapılamadı. Bilgilerinizi kontrol ediniz.');
          setLoading(false);
          return;
        }
      }

      const loggedUser = {
        name: loginEmail.includes('ahmet') ? 'Ahmet Yılmaz' : loginEmail.split('@')[0],
        company: loginEmail.includes('ahmet') ? 'Yılmaz Teknoloji A.Ş.' : 'NovaQ Müşteri',
        email: loginEmail,
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
        registeredAt: '14.02.2024',
        isLoggedIn: true,
        rememberMe
      };

      cartService.mergeCartOnAuth(loggedUser.customerId);
      onLoginSuccess(loggedUser, returnUrl, 'Müşteri paneline başarıyla giriş yapıldı.');
    } catch (err) {
      setErrorMessage(err.message || 'Giriş sırasında hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPass.trim()) {
      setErrorMessage('Ad soyad, e-posta ve şifre zorunludur.');
      return;
    }
    if (accountType === 'corporate' && !regCompany.trim()) {
      setErrorMessage('Kurumsal hesap için şirket unvanı giriniz.');
      return;
    }
    if (regPass.length < 8) {
      setErrorMessage('Şifre en az 8 karakter olmalıdır.');
      return;
    }
    if (regPass !== regPass2) {
      setErrorMessage('Şifre tekrarı eşleşmiyor.');
      return;
    }
    if (!regTerms) {
      setErrorMessage('Devam etmek için Hizmet Sözleşmesi ve KVKK metnini onaylayınız.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      if (isSupabaseConfigured) {
        const res = await authService.signUp(regEmail, regPass, regName, regCompany);
        if (res.error) {
          setErrorMessage(res.error.message || 'Kayıt oluşturulamadı.');
          setLoading(false);
          return;
        }
      }

      const newUserId = 'NQ-' + Math.floor(10000 + Math.random() * 89999);
      const newUser = {
        name: regName,
        company: accountType === 'corporate' ? (regCompany || `${regName} Şahıs`) : `${regName} (Bireysel)`,
        email: regEmail,
        phone: regPhone || '',
        customerId: newUserId,
        tier: accountType === 'corporate' ? 'Kurumsal Üye' : 'Standart Üye',
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

      cartService.mergeCartOnAuth(newUserId);
      onLoginSuccess(newUser, returnUrl, 'Üyeliğiniz oluşturuldu. Müşteri paneliniz hazır.');
    } catch (err) {
      setErrorMessage(err.message || 'Kayıt sırasında hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const isCheckoutReturn = returnUrl && returnUrl.includes('checkout');
  const strength = passwordStrength(regPass);

  return (
    <div className="auth-page">
      <header className="auth-topbar">
        <button type="button" className="auth-topbar-logo" onClick={() => onNavigate('home')}>
          <img src="/assets/novaq-logo.png" alt="NovaQ Servers" />
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => onNavigate('home')}>
          <ArrowLeft size={15} />
          <span>Ana Siteye Dön</span>
        </button>
      </header>

      <div className="auth-shell">
        <aside className="auth-brand">
          <div className="auth-kicker">
            <LockKeyhole size={13} />
            {mode === 'login' ? 'Müşteri Portalı' : 'Yeni Kurumsal Hesap'}
          </div>
          {mode === 'login' ? (
            <>
              <h1>Altyapınıza <em>tek panelden</em> hakim olun</h1>
              <p className="auth-brand-lead">
                NovaQ müşteri portalı; sunucu güç işlemleri, faturalama, bakiye ve 7/24 NOC destek
                biletlerini tek oturumda birleştirir. Frankfurt, Hong Kong ve Paris omurgalarına
                bağlı hesaplarınız güvenli SSL ile açılır.
              </p>
            </>
          ) : (
            <>
              <h1>Kurumsal hesabınız <em>dakikalar içinde</em> hazır</h1>
              <p className="auth-brand-lead">
                Kayıt tamamlandığında müşteri numaranız tanımlanır, paneliniz açılır ve varsa
                sepetiniz hesabınıza aktarılır. NVMe VDS, Ryzen, dedicated ve GPU paketlerine
                aynı hesaptan sipariş verebilirsiniz.
              </p>
            </>
          )}

          <ul className="auth-points">
            <li>
              <div className="auth-point-ico"><Server size={18} /></div>
              <div>
                <strong>Anlık sunucu yönetimi</strong>
                <span>Reboot, kapat/aç, OS kurulumu, snapshot ve rDNS işlemleri panelden yürür.</span>
              </div>
            </li>
            <li>
              <div className="auth-point-ico"><LifeBuoy size={18} /></div>
              <div>
                <strong>7/24 NOC ve ticket hattı</strong>
                <span>Teknik talepleriniz öncelik kuyruğuna düşer; yanıtlar aynı bilette toplanır.</span>
              </div>
            </li>
            <li>
              <div className="auth-point-ico"><Globe size={18} /></div>
              <div>
                <strong>Üç kıta, tek sözleşme</strong>
                <span>Almanya, Hong Kong ve Fransa lokasyonları %99.99 SLA ve 3.2 Tbps DDoS kalkanı.</span>
              </div>
            </li>
          </ul>

          <div className="auth-stats">
            <div className="auth-stat">
              <b>%99.99</b>
              <small>Uptime SLA</small>
            </div>
            <div className="auth-stat">
              <b>10 Gbps</b>
              <small>Port hızı</small>
            </div>
            <div className="auth-stat">
              <b>60 sn</b>
              <small>Kurulum süresi</small>
            </div>
          </div>
        </aside>

        <section className="auth-panel">
          <div className="auth-card">
            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                onClick={() => switchMode('login')}
              >
                <User size={15} />
                Müşteri Girişi
              </button>
              <button
                type="button"
                className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
                onClick={() => switchMode('register')}
              >
                <Building size={15} />
                Yeni Üye Ol
              </button>
            </div>

            {isCheckoutReturn && (
              <div className="auth-alert">
                <ShoppingCart size={18} color="#22d3ee" />
                <div>
                  <div className="auth-alert-title">Sepetiniz korundu</div>
                  <div className="auth-alert-text">
                    {cartCount > 0 ? `${cartCount} yapılandırma sepetinizde duruyor. ` : ''}
                    Giriş veya kayıttan sonra doğrudan güvenli ödeme adımına alınacaksınız.
                  </div>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="auth-alert error">
                <AlertCircle size={18} />
                <div>
                  <div className="auth-alert-title">İşlem tamamlanamadı</div>
                  <div className="auth-alert-text">{errorMessage}</div>
                </div>
              </div>
            )}

            <div className="auth-card-body">
              {mode === 'login' ? (
                <>
                  <div className="auth-card-intro">
                    <h2>Hesabınıza giriş yapın</h2>
                    <p>Kayıtlı e-posta ve şifrenizle müşteri paneline bağlanın. 2FA aktif hesaplarda ek doğrulama istenebilir.</p>
                  </div>

                  <form className="auth-form" onSubmit={handleLoginSubmit}>
                    <div className="auth-field">
                      <label htmlFor="login-email">Kurumsal e-posta</label>
                      <div className="auth-input-wrap">
                        <Mail size={16} className="auth-ico" />
                        <input
                          id="login-email"
                          type="email"
                          className="auth-input"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="ad@sirket.com"
                          autoComplete="email"
                          required
                        />
                      </div>
                    </div>

                    <div className="auth-field">
                      <label htmlFor="login-pass">Şifre</label>
                      <div className="auth-input-wrap">
                        <Lock size={16} className="auth-ico" />
                        <input
                          id="login-pass"
                          type={showLoginPass ? 'text' : 'password'}
                          className="auth-input has-eye"
                          value={loginPass}
                          onChange={(e) => setLoginPass(e.target.value)}
                          placeholder="Şifrenizi girin"
                          autoComplete="current-password"
                          required
                        />
                        <button type="button" className="auth-eye" onClick={() => setShowLoginPass((v) => !v)} aria-label="Şifreyi göster">
                          {showLoginPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="auth-row-between">
                      <label className="auth-check">
                        <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                        <span>Bu cihazda oturumu açık tut</span>
                      </label>
                      <button
                        type="button"
                        className="auth-link"
                        onClick={() => setErrorMessage('Şifre sıfırlama bağlantısı, kayıtlı e-posta adresinize iletilir. Destek için NOC hattını da kullanabilirsiniz.')}
                      >
                        Şifremi unuttum
                      </button>
                    </div>

                    <button type="submit" className="auth-submit" disabled={loading}>
                      {loading ? 'Doğrulanıyor...' : (
                        <>
                          <span>{isCheckoutReturn ? 'Giriş yap ve ödemeye geç' : 'Müşteri paneline gir'}</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="auth-demo">
                    <span>Kurumsal demo hesabıyla paneli incelemek ister misiniz?</span>
                    <button type="button" onClick={handleQuickDemoLogin}>Demo giriş</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="auth-card-intro">
                    <h2>Yeni müşteri hesabı oluşturun</h2>
                    <p>Bireysel veya kurumsal üyelik seçin. Kayıt sonrası müşteri numaranız üretilir ve paneliniz anında açılır.</p>
                  </div>

                  <form className="auth-form" onSubmit={handleRegisterSubmit}>
                    <div className="auth-field">
                      <label>Hesap türü</label>
                      <div className="auth-type">
                        <button
                          type="button"
                          className={`auth-type-btn ${accountType === 'individual' ? 'active' : ''}`}
                          onClick={() => setAccountType('individual')}
                        >
                          <b>Bireysel</b>
                          <span>Kişisel projeler ve test ortamları</span>
                        </button>
                        <button
                          type="button"
                          className={`auth-type-btn ${accountType === 'corporate' ? 'active' : ''}`}
                          onClick={() => setAccountType('corporate')}
                        >
                          <b>Kurumsal</b>
                          <span>Şirket faturası ve resmi unvan</span>
                        </button>
                      </div>
                    </div>

                    <div className="auth-field">
                      <label htmlFor="reg-name">Ad soyad *</label>
                      <div className="auth-input-wrap">
                        <User size={16} className="auth-ico" />
                        <input
                          id="reg-name"
                          type="text"
                          className="auth-input"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Örn. Mehmet Öz"
                          autoComplete="name"
                          required
                        />
                      </div>
                    </div>

                    {accountType === 'corporate' && (
                      <div className="auth-field">
                        <label htmlFor="reg-company">Şirket unvanı *</label>
                        <div className="auth-input-wrap">
                          <Building size={16} className="auth-ico" />
                          <input
                            id="reg-company"
                            type="text"
                            className="auth-input"
                            value={regCompany}
                            onChange={(e) => setRegCompany(e.target.value)}
                            placeholder="Örn. Öz Bilişim Ltd. Şti."
                            autoComplete="organization"
                          />
                        </div>
                      </div>
                    )}

                    <div className="auth-row">
                      <div className="auth-field">
                        <label htmlFor="reg-email">E-posta *</label>
                        <div className="auth-input-wrap">
                          <Mail size={16} className="auth-ico" />
                          <input
                            id="reg-email"
                            type="email"
                            className="auth-input"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="ad@sirket.com"
                            autoComplete="email"
                            required
                          />
                        </div>
                      </div>
                      <div className="auth-field">
                        <label htmlFor="reg-phone">Telefon</label>
                        <div className="auth-input-wrap">
                          <Phone size={16} className="auth-ico" />
                          <input
                            id="reg-phone"
                            type="tel"
                            className="auth-input"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            placeholder="+90 5XX XXX XX XX"
                            autoComplete="tel"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="auth-row">
                      <div className="auth-field">
                        <label htmlFor="reg-pass">Şifre *</label>
                        <div className="auth-input-wrap">
                          <Lock size={16} className="auth-ico" />
                          <input
                            id="reg-pass"
                            type={showRegPass ? 'text' : 'password'}
                            className="auth-input has-eye"
                            value={regPass}
                            onChange={(e) => setRegPass(e.target.value)}
                            placeholder="En az 8 karakter"
                            autoComplete="new-password"
                            required
                          />
                          <button type="button" className="auth-eye" onClick={() => setShowRegPass((v) => !v)} aria-label="Şifreyi göster">
                            {showRegPass ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {regPass && (
                          <>
                            <div className="auth-strength">
                              <i className={strength.score >= 1 ? `on ${strength.cls}` : ''} />
                              <i className={strength.score >= 2 ? `on ${strength.cls}` : ''} />
                              <i className={strength.score >= 3 ? `on ${strength.cls}` : ''} />
                              <i className={strength.score >= 4 ? `on ${strength.cls}` : ''} />
                            </div>
                            <div className="auth-strength-label">{strength.label}</div>
                          </>
                        )}
                      </div>
                      <div className="auth-field">
                        <label htmlFor="reg-pass2">Şifre tekrar *</label>
                        <div className="auth-input-wrap">
                          <Lock size={16} className="auth-ico" />
                          <input
                            id="reg-pass2"
                            type={showRegPass ? 'text' : 'password'}
                            className="auth-input"
                            value={regPass2}
                            onChange={(e) => setRegPass2(e.target.value)}
                            placeholder="Şifreyi doğrulayın"
                            autoComplete="new-password"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <label className="auth-check">
                      <input type="checkbox" checked={regTerms} onChange={(e) => setRegTerms(e.target.checked)} />
                      <span>
                        <a href="/hizmet-sozlesmesi.html" target="_blank" rel="noreferrer" style={{ color: '#22d3ee' }}>Hizmet Sözleşmesi</a>
                        {' '}ve{' '}
                        <a href="/kvkk-aydinlatma-metni.html" target="_blank" rel="noreferrer" style={{ color: '#22d3ee' }}>KVKK Aydınlatma Metni</a>
                        ’ni okudum, kabul ediyorum. Fatura ve destek bildirimleri bu e-postaya gider.
                      </span>
                    </label>

                    <button type="submit" className="auth-submit" disabled={loading}>
                      {loading ? 'Hesap açılıyor...' : (
                        <>
                          <span>{isCheckoutReturn ? 'Hesabı oluştur ve ödemeye geç' : 'Hesabı oluştur ve panele gir'}</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}

              <div className="auth-foot-note">
                256-bit SSL şifreli oturum. Giriş denemeleri güvenlik kaydı altına alınır.
              </div>
              <div className="auth-trust">
                <span><ShieldCheck size={13} color="#22d3ee" /> PCI uyumlu ödeme</span>
                <span><Zap size={13} color="#22d3ee" /> 2FA destekli hesap</span>
                <span><Clock size={13} color="#22d3ee" /> 7/24 NOC</span>
                <span><CheckCircle2 size={13} color="#22d3ee" /> %99.99 SLA</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
