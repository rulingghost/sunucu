import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ArrowLeft, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  ShoppingCart, 
  CreditCard, 
  LifeBuoy, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  DollarSign, 
  Calendar,
  Eye,
  MessageSquare,
  Edit,
  Clock,
  Send
} from 'lucide-react';
import { adminDataService } from '../services/adminDataService.js';

export default function AdminCustomerDetail({ customerId, navigate }) {
  const [customer, setCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, orders, invoices, tickets, notes
  const [newNoteText, setNewNoteText] = useState('');
  const [loading, setLoading] = useState(true);

  // İlişkili kayıtlar
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [payments, setPayments] = useState([]);

  const loadCustomerData = () => {
    setLoading(true);
    const c = adminDataService.getCustomerById(customerId);
    if (!c) {
      setCustomer(null);
      setLoading(false);
      return;
    }
    setCustomer(c);

    // Müşteriye ait siparişler
    const allOrders = adminDataService.getAdminOrders();
    const custOrders = allOrders.filter(o => o.customerId === c.id || o.customerName === c.name);
    setOrders(custOrders);

    // Müşteriye ait faturalar
    const allInvoices = adminDataService.getAdminInvoices();
    const custInvoices = allInvoices.filter(i => i.customerId === c.id || i.customerName === c.name);
    setInvoices(custInvoices);

    // Müşteriye ait ticketlar
    const allTickets = adminDataService.getAdminTickets();
    const custTickets = allTickets.filter(t => t.customerId === c.id || t.customerName === c.name);
    setTickets(custTickets);

    // Müşteriye ait ödemeler
    const allPayments = adminDataService.getAdminPayments();
    const custPayments = allPayments.filter(p => p.customerId === c.id || p.customerName === c.name);
    setPayments(custPayments);

    setLoading(false);
  };

  useEffect(() => {
    loadCustomerData();
  }, [customerId]);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    adminDataService.addCustomerNote(customerId, newNoteText.trim());
    setNewNoteText('');
    loadCustomerData();
  };

  const handleToggleStatus = () => {
    adminDataService.toggleCustomerStatus(customerId);
    loadCustomerData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-gray-400">
        Müşteri detayları yükleniyor...
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center space-y-4">
        <Users className="w-12 h-12 text-gray-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Müşteri Bulunamadı</h2>
        <p className="text-sm text-gray-400">
          Belirtilen ID ({customerId}) ile eşleşen bir müşteri kaydı mevcut değil.
        </p>
        <button
          onClick={() => navigate('/yonetici/musteriler')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Müşteri Listesine Dön
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Üst Navigasyon ve Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/yonetici/musteriler')}
            className="p-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl border border-gray-700/60 transition-colors"
            title="Geri Dön"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400">
              <span>{customer.id}</span>
              <span>•</span>
              <span>{customer.tier || 'Kurumsal Müşteri'}</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              {customer.name}
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                customer.status === 'Aktif'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {customer.status}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleStatus}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              customer.status === 'Aktif'
                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20'
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
            }`}
          >
            {customer.status === 'Aktif' ? 'Hesabı Askıya Al / Pasif' : 'Hesabı Aktifleştir'}
          </button>
          <button
            onClick={() => navigate('/yonetici/faturalar')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 hover:text-white rounded-xl border border-gray-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            Fatura Kes
          </button>
        </div>
      </div>

      {/* 4 Özet İstatistik Kartı */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4">
          <span className="text-xs text-gray-400 font-medium">Toplam Harcama</span>
          <div className="text-xl font-bold text-white mt-1">${(customer.totalSpent || 0).toLocaleString()}</div>
          <span className="text-[11px] text-gray-500">Ömür boyu ciro</span>
        </div>
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4">
          <span className="text-xs text-gray-400 font-medium">Mevcut Bakiye</span>
          <div className="text-xl font-bold text-emerald-400 mt-1">${(customer.balance || 0).toLocaleString()}</div>
          <span className="text-[11px] text-gray-500">Kullanılabilir kredi</span>
        </div>
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4">
          <span className="text-xs text-gray-400 font-medium">Aktif Sipariş / Sunucu</span>
          <div className="text-xl font-bold text-cyan-400 mt-1">{orders.length} Adet</div>
          <span className="text-[11px] text-gray-500">Altyapı hizmeti</span>
        </div>
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4">
          <span className="text-xs text-gray-400 font-medium">Destek Talepleri</span>
          <div className="text-xl font-bold text-amber-400 mt-1">{tickets.length} Talep</div>
          <span className="text-[11px] text-gray-500">Toplam iletişim</span>
        </div>
      </div>

      {/* Tab Başlıkları */}
      <div className="flex border-b border-gray-800 space-x-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors ${
            activeTab === 'overview'
              ? 'bg-gray-800 text-white border-t border-x border-gray-700'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Genel Bakış & Fatura Bilgileri
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors ${
            activeTab === 'orders'
              ? 'bg-gray-800 text-white border-t border-x border-gray-700'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Siparişler ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors ${
            activeTab === 'invoices'
              ? 'bg-gray-800 text-white border-t border-x border-gray-700'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Faturalar & Ödemeler ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors ${
            activeTab === 'tickets'
              ? 'bg-gray-800 text-white border-t border-x border-gray-700'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Destek Talepleri ({tickets.length})
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors ${
            activeTab === 'notes'
              ? 'bg-gray-800 text-white border-t border-x border-gray-700'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Yönetici Notları ({customer.internalNotes?.length || 0})
        </button>
      </div>

      {/* TAB 1: GENEL BAKIŞ & FATURA BİLGİLERİ */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              İletişim & Profil Bilgileri
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Ad Soyad</span>
                <span className="font-semibold text-white">{customer.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Firma Ünvanı</span>
                <span className="font-semibold text-white">{customer.company || 'Bireysel Hesap'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">E-Posta</span>
                <span className="font-semibold text-cyan-400">{customer.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Telefon</span>
                <span className="font-semibold text-white">{customer.phone || 'Belirtilmedi'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Kayıt Tarihi</span>
                <span className="font-semibold text-white">{customer.registeredAt || '12.01.2025'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400">İki Faktörlü Doğrulama (2FA)</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {customer.twoFactorEnabled ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-cyan-400" />
              Resmi Fatura & Vergi Detayları
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Vergi Dairesi</span>
                <span className="font-semibold text-white">{customer.taxOffice || 'Belirtilmedi'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Vergi Numarası / T.C.</span>
                <span className="font-mono font-semibold text-white">{customer.taxNumber || 'Belirtilmedi'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Şehir / Ülke</span>
                <span className="font-semibold text-white">{customer.city || 'İstanbul'} / {customer.country || 'Türkiye'}</span>
              </div>
              <div className="py-2">
                <span className="text-gray-400 block mb-1">Açık Adres:</span>
                <p className="text-gray-200 font-medium bg-gray-800/50 p-3 rounded-xl border border-gray-800">
                  {customer.address || 'Kayıtlı resmi adres bulunmuyor.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SİPARİŞLER */}
      {activeTab === 'orders' && (
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-400" />
              Müşterinin Sipariş Geçmişi
            </h3>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">
              Bu müşteriye ait henüz bir sipariş bulunmuyor.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 font-semibold">
                    <th className="pb-3">Sipariş No</th>
                    <th className="pb-3">Paket / Sunucu</th>
                    <th className="pb-3">Tarih</th>
                    <th className="pb-3">Tutar</th>
                    <th className="pb-3">Durum</th>
                    <th className="pb-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-800/40">
                      <td className="py-3 font-mono font-medium text-white">{ord.id}</td>
                      <td className="py-3 text-gray-300">{ord.planName}</td>
                      <td className="py-3 text-gray-400">{ord.date}</td>
                      <td className="py-3 font-semibold text-white">${ord.total}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => navigate(`/yonetici/siparisler/${ord.id}`)}
                          className="p-1.5 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FATURALAR & ÖDEMELER */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-emerald-400" />
              Müşteri Faturaları
            </h3>
            {invoices.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-xs">Kayıtlı fatura yok.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 font-semibold">
                      <th className="pb-3">Fatura No</th>
                      <th className="pb-3">Açıklama</th>
                      <th className="pb-3">Düzenleme Tarihi</th>
                      <th className="pb-3">Tutar</th>
                      <th className="pb-3">Durum</th>
                      <th className="pb-3 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-gray-800/40">
                        <td className="py-3 font-mono font-medium text-white">{inv.id}</td>
                        <td className="py-3 text-gray-300">{inv.description || 'Sunucu Barındırma Hizmeti'}</td>
                        <td className="py-3 text-gray-400">{inv.date}</td>
                        <td className="py-3 font-semibold text-white">${inv.total}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            inv.status === 'Ödendi'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => navigate(`/yonetici/faturalar/${inv.id}`)}
                            className="p-1.5 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: DESTEK TALEPLERİ */}
      {activeTab === 'tickets' && (
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <LifeBuoy className="w-4 h-4 text-amber-400" />
            Destek Talepleri & İletişim Geçmişi
          </h3>
          {tickets.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-xs">
              Bu müşteriden henüz bir destek talebi gelmedi.
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((tck) => (
                <div
                  key={tck.id}
                  onClick={() => navigate(`/yonetici/ticketlar/${tck.id}`)}
                  className="p-4 rounded-xl bg-gray-800/40 hover:bg-gray-800/80 border border-gray-800 hover:border-gray-700 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-cyan-400 font-semibold">{tck.id}</span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-700 text-gray-300">{tck.category}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400">{tck.createdAt}</span>
                    </div>
                    <div className="font-semibold text-white text-sm mt-1">{tck.subject}</div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      tck.status === 'Yeni' || tck.status === 'Yönetici Yanıtı Bekleniyor'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {tck.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: DAHİLİ YÖNETİCİ NOTLARI */}
      {activeTab === 'notes' && (
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              Müşteriye Özel Dahili Yönetici Notları
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Bu notlar yalnızca yöneticiler tarafından görülebilir, müşteri paneline yansımaz.
            </p>
          </div>

          <form onSubmit={handleAddNote} className="space-y-3">
            <textarea
              rows={3}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Müşteri hakkında önemli teknik veya idari not giriniz..."
              className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newNoteText.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-xs font-semibold text-white rounded-xl transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Not Ekle
              </button>
            </div>
          </form>

          <div className="space-y-3 pt-2">
            {!customer.internalNotes || customer.internalNotes.length === 0 ? (
              <div className="text-center py-4 text-xs text-gray-500">
                Henüz eklenmiş bir yönetici notu yok.
              </div>
            ) : (
              customer.internalNotes.map((note) => (
                <div key={note.id} className="p-3.5 rounded-xl bg-gray-800/40 border border-gray-700/60 text-xs">
                  <div className="flex items-center justify-between text-gray-400 mb-1.5">
                    <span className="font-semibold text-cyan-400">@{note.author}</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-gray-500" />
                      {note.date}
                    </span>
                  </div>
                  <p className="text-gray-200 leading-relaxed">{note.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
