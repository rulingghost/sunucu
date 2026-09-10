import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  FileText, 
  CreditCard, 
  User, 
  Server,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { adminDataService } from '../services/adminDataService.js';

export default function AdminOrders({ navigate }) {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const loadOrders = () => {
    const list = adminDataService.getAdminOrders();
    setOrders(list);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.customerName && o.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.planName && o.planName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' ? true : o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Tamamlandı':
      case 'Aktif':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'İşleme Alındı':
      case 'Devam Ediyor':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Ödeme Bekliyor':
      case 'Yeni':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'İptal Edildi':
      case 'İade Edildi':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-700 text-gray-300 border-gray-600';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Üst Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-blue-400" />
            Sipariş Yönetimi
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Gelen sunucu siparişlerini inceleyin, durumlarını güncelleyin ve provizyon sağlayın
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
              placeholder="Sipariş No, müşteri adı veya paket ara..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/80 border border-gray-700/60 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-gray-800/80 border border-gray-700/60 rounded-xl px-3 py-1.5 text-xs text-gray-300">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span>Durum:</span>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-white font-medium focus:outline-none"
              >
                <option value="all" className="bg-gray-900">Tümü ({orders.length})</option>
                <option value="Yeni" className="bg-gray-900">Yeni</option>
                <option value="Ödeme Bekliyor" className="bg-gray-900">Ödeme Bekliyor</option>
                <option value="Ödendi" className="bg-gray-900">Ödendi</option>
                <option value="İşleme Alındı" className="bg-gray-900">İşleme Alındı</option>
                <option value="Tamamlandı" className="bg-gray-900">Tamamlandı</option>
                <option value="İptal Edildi" className="bg-gray-900">İptal Edildi</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Siparişler Tablosu */}
      <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/30 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Sipariş No</th>
                <th className="py-3.5 px-4">Müşteri</th>
                <th className="py-3.5 px-4">Ürün / Paket</th>
                <th className="py-3.5 px-4">Sipariş Tarihi</th>
                <th className="py-3.5 px-4">Tutar</th>
                <th className="py-3.5 px-4">Ödeme Durumu</th>
                <th className="py-3.5 px-4">Sipariş Durumu</th>
                <th className="py-3.5 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400 text-sm">
                    Kriterlere uygun sipariş bulunamadı.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((ord) => (
                  <tr 
                    key={ord.id}
                    onClick={() => navigate(`/yonetici/siparisler/${ord.id}`)}
                    className="hover:bg-gray-800/40 cursor-pointer transition-colors group"
                  >
                    {/* Sipariş No */}
                    <td className="py-3 px-4 font-mono font-medium text-white group-hover:text-blue-400 transition-colors">
                      {ord.id}
                    </td>

                    {/* Müşteri */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{ord.customerName}</div>
                      <div className="text-[11px] text-gray-400">{ord.customerId}</div>
                    </td>

                    {/* Paket */}
                    <td className="py-3 px-4">
                      <div className="text-gray-200 font-medium">{ord.planName}</div>
                      <div className="text-[11px] text-gray-500">{ord.billingCycle || 'Aylık'} Dönem</div>
                    </td>

                    {/* Tarih */}
                    <td className="py-3 px-4 text-gray-400">
                      {ord.date}
                    </td>

                    {/* Tutar */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-white text-sm">${ord.total}</span>
                    </td>

                    {/* Ödeme Durumu */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        ord.paymentStatus === 'Ödendi'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {ord.paymentStatus || 'Ödendi'}
                      </span>
                    </td>

                    {/* Sipariş Durumu */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusBadge(ord.status)}`}>
                        {ord.status}
                      </span>
                    </td>

                    {/* İşlemler */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/yonetici/siparisler/${ord.id}`)}
                        className="p-1.5 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors"
                        title="Siparişi İncele"
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
            Toplam <span className="text-white font-semibold">{filteredOrders.length}</span> sipariş listeleniyor
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
    </div>
  );
}
