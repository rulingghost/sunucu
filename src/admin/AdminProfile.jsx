import React, { useState, useEffect } from 'react';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Mail, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  Terminal
} from 'lucide-react';
import { adminAuthService } from '../services/adminAuthService.js';

export default function AdminProfile({ navigate }) {
  const [profile, setProfile] = useState({
    username: '',
    fullName: '',
    email: '',
    role: 'super_admin'
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const creds = adminAuthService.getStoredAdminCredentials();
    if (creds) {
      setProfile({
        username: creds.username || 'admin',
        fullName: creds.fullName || 'Sistem Yöneticisi',
        email: creds.email || 'admin@novaq.com',
        role: creds.role || 'super_admin'
      });
    }
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', text: '' });

    if (newPassword) {
      if (!currentPassword) {
        setFeedback({ type: 'error', text: 'Şifrenizi değiştirmek için lütfen mevcut şifrenizi giriniz.' });
        return;
      }
      if (newPassword.length < 8) {
        setFeedback({ type: 'error', text: 'Yeni şifre en az 8 karakterden oluşmalıdır.' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setFeedback({ type: 'error', text: 'Yeni şifreler birbiriyle eşleşmiyor.' });
        return;
      }
    }

    setLoading(true);
    const result = await adminAuthService.updateAdminProfile({
      username: profile.username,
      fullName: profile.fullName,
      email: profile.email,
      currentPassword: currentPassword || undefined,
      newPassword: newPassword || undefined
    });

    setLoading(false);
    if (result.success) {
      setFeedback({ type: 'success', text: result.message || 'Yönetici profili başarıyla güncellendi!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setFeedback({ type: 'error', text: result.error || 'Profil güncellenirken hata oluştu.' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Üst Başlık */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
          <User className="w-7 h-7 text-cyan-400" />
          Yönetici Profil & Güvenlik Ayarları
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Yönetici kimlik bilgilerinizi, yetkili e-posta adresinizi ve SHA-256 erişim şifrenizi güncelleyin
        </p>
      </div>

      {feedback.text && (
        <div className={`flex items-center gap-2.5 p-4 rounded-xl text-xs font-semibold ${
          feedback.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {feedback.text}
        </div>
      )}

      {/* Profil Güncelleme Kartı */}
      <form onSubmit={handleUpdateProfile} className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-6 shadow-xl">
        {/* Temel Bilgiler */}
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4 pb-2 border-b border-gray-800">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Temel Hesap Bilgileri
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Kullanıcı Adı *</label>
              <input
                type="text"
                required
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Yetkili Ad Soyad *</label>
              <input
                type="text"
                required
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Sistem Bildirim E-Postası *</label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Şifre Değiştirme */}
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4 pb-2 border-b border-gray-800">
            <Lock className="w-4 h-4 text-cyan-400" />
            Güvenli Şifre Değiştirme (İsteğe Bağlı)
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Şifrenizi değiştirmek istemiyorsanız aşağıdaki şifre alanlarını boş bırakınız.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Mevcut Şifre</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Şifre değiştirmek için mevcut şifrenizi girin"
                className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Yeni Şifre</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="En az 8 karakter"
                  className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Yeni Şifre Tekrar</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Yeni şifreyi onaylayın"
                  className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buton */}
        <div className="flex justify-end pt-4 border-t border-gray-800">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-sm font-bold text-white rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Kaydediliyor...' : 'Profil Bilgilerini Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
