import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ShieldCheck, 
  DollarSign, 
  Calendar,
  Building,
  User,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { adminDataService } from '../services/adminDataService.js';

export default function AdminPayments({ navigate }) {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const itemsPerPage = 7;

  useEffect(() => {
    setPayments(adminDataService.getAdminPayments());
  }, []);

  const filteredPayments = payments.filter(p => {
    const matchesSearch = 
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.reference && p.reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.orderId && p.orderId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' ? true : p.status === statusFilter;
    const matchesMethod = methodFilter === 'all' ? true : p.method.includes(methodFilter);

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage) || 1;
  const paginatedPayments = filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Başarılı':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Bekliyor':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'İade Edildi':
      case 'Hatalı':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Üst Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
            <CreditCard className="w-7 h-7 text-emerald-400" />
            Ödeme Hareketleri & Tahsilat Yönetimi
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Gerçek zamanlı 3D Secure, sanal pos ve banka transfer logları
          </p>
        </div>
      </div>

      {/* Arama & Filtre Çubuğu */}
      <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-4 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="İşlem ID, müşteri adı veya referans no ile ara..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/80 border border-gray-700/60 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Yöntem Filtresi */}
            <div className="flex items-center gap-2 bg-gray-800/80 border border-gray-700/60 rounded-xl px-3 py-1.5 text-xs text-gray-300">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span>Yöntem:</span>
              <select
                value={methodFilter}
                onChange={(e) => { setMethodFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-white font-medium focus:outline-none"
              >
                <option value="all" className="bg-gray-900">Tümü</option>
                <option value="Kredi Kartı" className="bg-gray-900">Kredi Kartı (3D Secure)</option>
                <option value="Havale" className="bg-gray-900">Havale / EFT</option>
                <option value="Kripto" className="bg-gray-900">Kripto Para</option>
              </select>
            </div>

            {/* Durum Filtresi */}
            <div className="flex items-center gap-2 bg-gray-800/80 border border-gray-700/60 rounded-xl px-3 py-1.5 text-xs text-gray-300">
              <span>Durum:</span>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-white font-medium focus:outline-none"
              >
                <option value="all" className="bg-gray-900">Tümü</option>
                <option value="Başarılı" className="bg-gray-900">Başarılı</option>
                <option value="Bekliyor" className="bg-gray-900">Bekliyor</option>
                <option value="İade Edildi" className="bg-gray-900">İade Edildi</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Ödemeler Tablosu */}
      <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/30 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">İşlem ID</th>
                <th className="py-3.5 px-4">Müşteri</th>
                <th className="py-3.5 px-4">İlgili Sipariş</th>
                <th className="py-3.5 px-4">Tutar</th>
                <th className="py-3.5 px-4">Ödeme Yöntemi</th>
                <th className="py-3.5 px-4">Tarih</th>
                <th className="py-3.5 px-4">Durum</th>
                <th className="py-3.5 px-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400 text-sm">
                    Kriterlere uygun ödeme hareketi bulunamadı.
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((pay) => (
                  <tr 
                    key={pay.id}
                    onClick={() => setSelectedPayment(pay)}
                    className="hover:bg-gray-800/40 cursor-pointer transition-colors group"
                  >
                    {/* İşlem ID */}
                    <td className="py-3 px-4 font-mono font-medium text-white group-hover:text-emerald-400 transition-colors">
                      {pay.id}
                    </td>

                    {/* Müşteri */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{pay.customerName}</div>
                      <div className="text-[11px] text-gray-400">{pay.customerId}</div>
                    </td>

                    {/* Sipariş No */}
                    <td className="py-3 px-4 font-mono text-cyan-400">
                      {pay.orderId || '-'}
                    </td>

                    {/* Tutar */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-white text-sm">${pay.amount}</span>
                      <span className="text-[10px] text-gray-400 ml-1">{pay.currency}</span>
                    </td>

                    {/* Yöntem */}
                    <td className="py-3 px-4 text-gray-300">
                      {pay.method}
                    </td>

                    {/* Tarih */}
                    <td className="py-3 px-4 text-gray-400">
                      {pay.date}
                    </td>

                    {/* Durum */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusBadge(pay.status)}`}>
                        {pay.status}
                      </span>
                    </td>

                    {/* Detay */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedPayment(pay)}
                        className="p-1.5 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors"
                        title="İşlem Detayını İncele"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Sayfalama */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800 bg-gray-900/40 text-xs text-gray-400">
          <div>
            Toplam <span className="text-white font-semibold">{filteredPayments.length}</span> işlem kaydı
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-gray-300">
              Sayfa <span className="font-semibold text-white">{currentPage}</span> / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ÖDEME DETAY MODALI */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                Ödeme İşlem Detayı ({selectedPayment.id})
              </h2>
              <button 
                onClick={() => setSelectedPayment(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-800">
                <span className="text-gray-400">İşlem Durumu</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(selectedPayment.status)}`}>
                  {selectedPayment.status}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-800">
                <span className="text-gray-400">Ödenen Tutar</span>
                <span className="font-bold text-white text-sm">${selectedPayment.amount} {selectedPayment.currency}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-800">
                <span className="text-gray-400">Müşteri</span>
                <span className="font-semibold text-white">{selectedPayment.customerName} ({selectedPayment.customerId})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-800">
                <span className="text-gray-400">İlişkili Sipariş</span>
                <span className="font-mono text-cyan-400 font-semibold">{selectedPayment.orderId}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-800">
                <span className="text-gray-400">Ödeme Kanalı</span>
                <span className="text-gray-200">{selectedPayment.method}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-800">
                <span className="text-gray-400">Banka Referans Kodu</span>
                <span className="font-mono text-gray-300">{selectedPayment.reference || 'POS-3D-948190284'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-800">
                <span className="text-gray-400">İşlem Zamanı</span>
                <span className="text-gray-300">{selectedPayment.date}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-400">3D Secure Doğrulama</span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Doğrulandı (Full Liability Shift)
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-800">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-white rounded-xl transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
