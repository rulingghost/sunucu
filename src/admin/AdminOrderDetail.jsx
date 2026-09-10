import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  ArrowLeft, 
  User, 
  Server, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  Send,
  Building,
  Mail,
  Phone,
  ShieldCheck,
  Check,
  Save
} from 'lucide-react';
import { adminDataService } from '../services/adminDataService.js';

export default function AdminOrderDetail({ orderId, navigate }) {
  const [order, setOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [newNote, setNewNote] = useState('');
  const [statusUpdated, setStatusUpdated] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadOrder = () => {
    setLoading(true);
    const ord = adminDataService.getAdminOrderById(orderId);
    if (ord) {
      setOrder(ord);
      setSelectedStatus(ord.status);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const handleStatusChange = () => {
    if (!selectedStatus || selectedStatus === order.status) return;
    adminDataService.updateAdminOrderStatus(orderId, selectedStatus, newNote.trim() || undefined);
    setStatusUpdated(true);
    setNewNote('');
    loadOrder();
    setTimeout(() => setStatusUpdated(false), 3000);
  };

  const handleAddNoteOnly = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    adminDataService.updateAdminOrderStatus(orderId, order.status, newNote.trim());
    setNewNote('');
    loadOrder();
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Sipariş yükleniyor...</div>;
  }

  if (!order) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center space-y-4">
        <ShoppingCart className="w-12 h-12 text-gray-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Sipariş Bulunamadı</h2>
        <p className="text-sm text-gray-400">
          Belirtilen sipariş numarası ({orderId}) ile eşleşen kayıt bulunamadı.
        </p>
        <button
          onClick={() => navigate('/yonetici/siparisler')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Sipariş Listesine Dön
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Üst Navigasyon & Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/yonetici/siparisler')}
            className="p-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl border border-gray-700/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
              <span className="font-mono">{order.id}</span>
              <span>•</span>
              <span>{order.date}</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              Sipariş Detayı: {order.planName}
            </h1>
          </div>
        </div>

        {statusUpdated && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Sipariş Durumu Başarıyla Güncellendi! Müşteri paneline yansıtıldı.
          </div>
        )}
      </div>

      {/* Durum Yönetim Kutusu (Action Box) */}
      <div className="bg-gradient-to-r from-blue-950/40 via-gray-900/60 to-gray-900/60 border border-blue-500/30 rounded-2xl p-5 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Durum Yönetimi</span>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-gray-300 font-medium">Mevcut Durum:</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {order.status}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3.5 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Yeni">Yeni</option>
              <option value="Ödeme Bekliyor">Ödeme Bekliyor</option>
              <option value="Ödendi">Ödendi</option>
              <option value="İşleme Alındı">İşleme Alındı</option>
              <option value="Devam Ediyor">Devam Ediyor</option>
              <option value="Tamamlandı">Tamamlandı (Sunucuyu Başlat)</option>
              <option value="İptal Edildi">İptal Edildi</option>
              <option value="İade Edildi">İade Edildi</option>
            </select>

            <button
              onClick={handleStatusChange}
              disabled={selectedStatus === order.status}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              Durumu Kaydet & Müşteriye Bildir
            </button>
          </div>
        </div>
      </div>

      {/* 2 Sütunlu Detay Alanı: Müşteri & Sipariş İçeriği */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Müşteri Bilgileri */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-purple-400" />
              Müşteri Bilgileri
            </h3>
            {order.customerId && (
              <button
                onClick={() => navigate(`/yonetici/musteriler/${order.customerId}`)}
                className="flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
              >
                Müşteri Detayına Git
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Müşteri Adı</span>
              <span className="font-semibold text-white">{order.customerName}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Müşteri ID</span>
              <span className="font-mono text-gray-300">{order.customerId || 'Bilinmiyor'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Fatura Durumu</span>
              <span className="font-semibold text-emerald-400">Kesildi ({order.invoiceId || 'INV-2026-01'})</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Ödeme Yöntemi</span>
              <span className="text-gray-200">{order.paymentMethod || 'Kredi Kartı (3D Secure)'}</span>
            </div>
          </div>
        </div>

        {/* Sunucu & Paket Detayı */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="border-b border-gray-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              Paket & Sunucu Detayları
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Plan Adı</span>
              <span className="font-semibold text-white">{order.planName}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Fatura Dönemi</span>
              <span className="font-semibold text-cyan-400">{order.billingCycle || 'Aylık'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Donanım</span>
              <span className="text-gray-200">{order.specs || 'Yüksek Performanslı NVMe Altyapı'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">IP Tahsisi</span>
              <span className="font-mono text-gray-300">1x Dedicated IPv4 + /64 IPv6</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sipariş Finansal Özeti & Kalemler */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-emerald-400" />
          Mali Döküm & Tutar Hesabı
        </h3>

        <div className="space-y-2 border-b border-gray-800 pb-4 text-xs">
          <div className="flex justify-between text-gray-300">
            <span>{order.planName} ({order.billingCycle || 'Aylık'})</span>
            <span>${(order.subtotal || order.total * 0.8).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>KDV / Vergi (%20)</span>
            <span>${(order.tax || order.total * 0.2).toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-400 font-semibold">
              <span>Uygulanan İndirim</span>
              <span>-${order.discount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4 text-base font-bold text-white">
          <span>Genel Toplam (USD):</span>
          <span className="text-cyan-400">${order.total}</span>
        </div>
      </div>

      {/* Yönetici Notu & Durum Geçmişi */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          Sipariş Notları & Dahili Takip
        </h3>

        <form onSubmit={handleAddNoteOnly} className="space-y-3">
          <textarea
            rows={2}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Sipariş hakkında dahili teknik / idari not ekleyin..."
            className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newNote.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-xs font-semibold text-white rounded-xl transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Not Ekle
            </button>
          </div>
        </form>

        {order.notes && order.notes.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-gray-800">
            {order.notes.map((n, idx) => (
              <div key={idx} className="p-3 bg-gray-800/40 rounded-xl border border-gray-700/50 text-xs">
                <div className="flex items-center justify-between text-gray-400 text-[11px] mb-1">
                  <span className="font-semibold text-blue-400">@{n.author || 'admin'}</span>
                  <span>{n.date}</span>
                </div>
                <p className="text-gray-200">{n.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
