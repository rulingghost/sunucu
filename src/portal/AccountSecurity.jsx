import React, { useState } from 'react';
import { 
  Shield, 
  Key, 
  Lock, 
  CheckCircle, 
  Smartphone, 
  Plus, 
  Trash2, 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Save 
} from 'lucide-react';

export default function AccountSecurity({ user, onUpdateProfile, onToggle2FA }) {
  // Profile edit state
  const [formData, setFormData] = useState({
    name: user.name || '',
    company: user.company || '',
    email: user.email || '',
    phone: user.phone || '',
    taxOffice: user.taxOffice || '',
    taxNumber: user.taxNumber || '',
    address: user.address || '',
    city: user.city || '',
    country: user.country || 'Türkiye'
  });

  const [twoFA, setTwoFA] = useState(user.twoFactorEnabled);
  const [sshKeys, setSshKeys] = useState([
    { id: 1, name: 'MacBook Pro - Ahmet', fingerprint: 'SHA256:7uK+aP9zW912y7Bw+n4m1Lk', date: '14.02.2024' },
    { id: 2, name: 'Office Workstation Linux', fingerprint: 'SHA256:3xL8qA19sL01z8Bw+r2m9Qp', date: '20.05.2025' }
  ]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyContent, setNewKeyContent] = useState('');

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(formData);
  };

  const handleAddSshKey = (e) => {
    e.preventDefault();
    if (!newKeyName.trim() || !newKeyContent.trim()) return;

    setSshKeys(prev => [
      ...prev,
      {
        id: Date.now(),
        name: newKeyName,
        fingerprint: 'SHA256:' + Math.random().toString(36).substring(2, 15) + 'NovaQ',
        date: 'Şimdi'
      }
    ]);
    setNewKeyName('');
    setNewKeyContent('');
    alert('Yeni SSH Anahtarı hesabınıza tanımlandı. Gelecekte kurulan tüm sunucularınıza otomatik eklenecektir.');
  };

  const handleRemoveKey = (id) => {
    setSshKeys(prev => prev.filter(k => k.id !== id));
  };

  const handleToggle2FA = () => {
    const newState = !twoFA;
    setTwoFA(newState);
    onToggle2FA(newState);
  };

  return (
    <div className="portal-content">
      <div style={{ maxWidth: '860px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* EDITABLE PROFILE CARD */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <User size={20} color="var(--accent-cyan)" />
                <span>Üyelik & Kurumsal Profil Bilgilerini Düzenle</span>
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                Fatura kesimi, resmi bildirimler ve müşteri iletişim bilgilerinizi buradan güncelleyin.
              </p>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-cyan)', background: 'rgba(0,210,255,0.1)', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
              Müşteri No: #{user.customerId}
            </span>
          </div>

          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Yetkili Adı Soyadı *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem 0.9rem', color: '#ffffff', fontSize: '0.875rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Şirket / Firma Unvanı
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem 0.9rem', color: '#ffffff', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Kayıtlı E-posta Adresi *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem 0.9rem', color: '#ffffff', fontSize: '0.875rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  İletişim Telefon Numarası
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem 0.9rem', color: '#ffffff', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Vergi Dairesi
                </label>
                <input
                  type="text"
                  value={formData.taxOffice}
                  onChange={(e) => setFormData({ ...formData, taxOffice: e.target.value })}
                  placeholder="Maslak Vergi Dairesi"
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem 0.9rem', color: '#ffffff', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Vergi Numarası / TCKN
                </label>
                <input
                  type="text"
                  value={formData.taxNumber}
                  onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                  placeholder="9481028491"
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem 0.9rem', color: '#ffffff', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Fatura ve Tebligat Adresi
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Büyükdere Cad. No: 194 K:8 Levent"
                style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem 0.9rem', color: '#ffffff', fontSize: '0.875rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Şehir / İl
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem 0.9rem', color: '#ffffff', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Ülke
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem 0.9rem', color: '#ffffff', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0.65rem 1.4rem' }}>
                <Save size={15} />
                <span>Üyelik Bilgilerimi Güncelle & Kaydet</span>
              </button>
            </div>
          </form>
        </div>

        {/* 2FA Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(0, 210, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                <Smartphone size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>İki Adımlı Doğrulama (2FA - TOTP)</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Girişlerde Google Authenticator veya Authy tek kullanımlık şifre zorunluluğu.
                </p>
              </div>
            </div>

            <button 
              className={`btn btn-sm ${twoFA ? 'btn-primary' : 'btn-secondary'}`}
              onClick={handleToggle2FA}
            >
              {twoFA ? 'Aktif (Korumalı)' : 'Etkinleştir'}
            </button>
          </div>
        </div>

        {/* SSH Keys Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={18} color="var(--accent-cyan)" />
            <span>Kayıtlı SSH Açık Anahtarları (Public Keys)</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Yeni oluşturulan tüm Linux bulut sunucularına otomatik enjekte edilir. Şifresiz ve güvenli SSH erişimi sağlar.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {sshKeys.map(k => (
              <div 
                key={k.id}
                style={{
                  background: 'rgba(10, 15, 26, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '0.85rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9rem' }}>{k.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {k.fingerprint} • {k.date}
                  </div>
                </div>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleRemoveKey(k.id)}
                  style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Add SSH Key form */}
          <form onSubmit={handleAddSshKey} style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Yeni SSH Anahtarı Ekle</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Anahtar Başlığı</label>
                <input 
                  type="text" 
                  placeholder="Örn: Ofis Dizüstü Bilgisayar"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#ffffff', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Açık Anahtar İçeriği (ssh-ed25519 veya ssh-rsa)</label>
                <textarea 
                  rows="3"
                  placeholder="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... user@novaq"
                  value={newKeyContent}
                  onChange={(e) => setNewKeyContent(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#ffffff', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', resize: 'vertical' }}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-sm" style={{ width: 'fit-content' }}>
                <Plus size={14} />
                <span>SSH Anahtarını Kaydet</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
