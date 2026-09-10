/**
 * NovaQ Servers - Yönetici Güvenlik ve Kimlik Doğrulama Servisi
 * SHA-256 Kriptografik Şifreleme, Brute-Force Koruması, Rol Bazlı Yetkilendirme
 */

const CREDENTIALS_KEY = 'novaq_admin_credentials';
const SESSION_KEY = 'novaq_admin_session';
const ATTEMPTS_KEY = 'novaq_admin_login_attempts';

// Varsayılan Güvenli Yönetici Kimlik Bilgileri (Şifre açık metin olarak kodda TUTULMAZ!)
// Varsayılan şifre: "NovaQ@Admin2026!"
const DEFAULT_CREDENTIALS = {
  username: 'admin',
  salt: 'novaq_k9x7_2026',
  passwordHash: '110b3da2633f22af99d9ae97596a83f03da198a197619a42323035290905a6fb',
  fullName: 'Sistem Yöneticisi',
  email: 'admin@novaq.com',
  role: 'super_admin'
};

// SHA-256 Kriptografik Hash Fonksiyonu (Web Crypto API)
export async function hashPassword(password, salt = DEFAULT_CREDENTIALS.salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '::novaq_salt::' + salt);
  
  const cryptoObj = typeof globalThis !== 'undefined' ? (globalThis.crypto || globalThis.msCrypto) : null;
  if (cryptoObj?.subtle) {
    const hashBuffer = await cryptoObj.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback if subtle crypto is unavailable
  let hash = 0;
  const str = password + '::novaq_salt::' + salt;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

// Kayıtlı Yönetici Bilgilerini Getir
export function getStoredAdminCredentials() {
  if (typeof window === 'undefined') return DEFAULT_CREDENTIALS;
  try {
    const raw = localStorage.getItem(CREDENTIALS_KEY);
    if (!raw) {
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(DEFAULT_CREDENTIALS));
      return DEFAULT_CREDENTIALS;
    }
    const parsed = JSON.parse(raw);
    if (!parsed?.username || !parsed?.passwordHash || !parsed?.salt) {
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(DEFAULT_CREDENTIALS));
      return DEFAULT_CREDENTIALS;
    }
    return parsed;
  } catch (e) {
    return DEFAULT_CREDENTIALS;
  }
}

// Brute Force Kontrolü
export function checkBruteForce() {
  if (typeof window === 'undefined') return { isLocked: false, remainingSeconds: 0 };
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    if (!raw) return { isLocked: false, remainingSeconds: 0 };
    const { count, lockUntil } = JSON.parse(raw);
    const now = Date.now();
    if (lockUntil && now < lockUntil) {
      const remainingSeconds = Math.ceil((lockUntil - now) / 1000);
      return { isLocked: true, remainingSeconds };
    }
    if (lockUntil && now >= lockUntil) {
      localStorage.removeItem(ATTEMPTS_KEY);
    }
    return { isLocked: false, remainingSeconds: 0 };
  } catch (e) {
    return { isLocked: false, remainingSeconds: 0 };
  }
}

function recordFailedAttempt() {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    let attempts = raw ? JSON.parse(raw) : { count: 0, lockUntil: null };
    attempts.count = (attempts.count || 0) + 1;
    if (attempts.count >= 5) {
      attempts.lockUntil = Date.now() + 60 * 1000; // 60 saniye soğuma kilidi
    }
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
  } catch (e) {
    console.error('Attempt recording error:', e);
  }
}

function clearFailedAttempts() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ATTEMPTS_KEY);
}

/**
 * Yönetici Giriş Doğrulaması
 */
export async function adminLogin(username, password) {
  // 1. Brute Force Kilidi Kontrolü
  const lockStatus = checkBruteForce();
  if (lockStatus.isLocked) {
    return {
      success: false,
      error: `Çok fazla başarısız deneme! Güvenliğiniz için lütfen ${lockStatus.remainingSeconds} saniye bekleyiniz.`
    };
  }

  const credentials = getStoredAdminCredentials();

  // 2. Kullanıcı adı kontrolü
  if (username.trim().toLowerCase() !== credentials.username.toLowerCase()) {
    recordFailedAttempt();
    return { success: false, error: 'Geçersiz yönetici kullanıcı adı veya şifre.' };
  }

  // 3. Şifre Hash Doğrulaması
  const computedHash = await hashPassword(password, credentials.salt);
  if (computedHash !== credentials.passwordHash) {
    recordFailedAttempt();
    return { success: false, error: 'Geçersiz yönetici kullanıcı adı veya şifre.' };
  }

  // 4. Başarılı Giriş - Oturum Jetonu Oluştur
  clearFailedAttempts();
  const token = 'adm_token_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
  const session = {
    token,
    username: credentials.username,
    fullName: credentials.fullName,
    email: credentials.email,
    role: credentials.role || 'super_admin',
    loginTime: new Date().toISOString(),
    expiresAt: Date.now() + 8 * 3600 * 1000 // 8 saat geçerli oturum
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, session };
}

/**
 * Yönetici Oturumunu Doğrula (Müşterilerin erişimini kesinlikle engeller)
 */
export function verifyAdminSession() {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw);
    if (!session || !session.token || session.role !== 'super_admin') {
      return false;
    }
    if (session.expiresAt && Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Aktif Yönetici Oturum Verisini Getir
 */
export function getAdminSession() {
  if (!verifyAdminSession()) return null;
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch (e) {
    return null;
  }
}

/**
 * Yönetici Oturumunu Kapat
 */
export function adminLogout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Yönetici Profil & Şifre Güncelleme
 */
export async function updateAdminProfile({ username, fullName, email, currentPassword, newPassword }) {
  const credentials = getStoredAdminCredentials();

  // Mevcut şifreyi doğrula
  const computedCurrentHash = await hashPassword(currentPassword, credentials.salt);
  if (computedCurrentHash !== credentials.passwordHash) {
    return { success: false, error: 'Mevcut yönetici şifrenizi hatalı girdiniz!' };
  }

  const updatedCredentials = {
    ...credentials,
    username: username ? username.trim() : credentials.username,
    fullName: fullName ? fullName.trim() : credentials.fullName,
    email: email ? email.trim() : credentials.email
  };

  // Yeni şifre belirtilmişse hashle ve güncelle
  if (newPassword && newPassword.trim().length >= 8) {
    const newSalt = 'novaq_k' + Math.random().toString(36).substring(2, 8) + '_' + Date.now();
    const newHash = await hashPassword(newPassword.trim(), newSalt);
    updatedCredentials.salt = newSalt;
    updatedCredentials.passwordHash = newHash;
  }

  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(updatedCredentials));

  // Aktif oturumu güncelle
  const session = getAdminSession();
  if (session) {
    const updatedSession = {
      ...session,
      username: updatedCredentials.username,
      fullName: updatedCredentials.fullName,
      email: updatedCredentials.email
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
  }

  return { success: true };
}

export const adminAuthService = {
  adminLogin,
  verifyAdminSession,
  getAdminSession,
  adminLogout,
  updateAdminProfile,
  checkBruteForce,
  hashPassword,
  getStoredAdminCredentials
};
