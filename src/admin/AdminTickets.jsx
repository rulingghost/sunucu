import React, { useState, useEffect } from 'react';
import { 
  LifeBuoy, 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  MessageSquare, 
  User, 
  Tag, 
  ArrowRight,
  ShieldAlert,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { adminDataService } from '../services/adminDataService.js';

export default function AdminTickets({ navigate }) {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const loadTickets = () => {
    const list = adminDataService.getAdminTickets();
    setTickets(list);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' ? true : t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' ? true : t.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' ? true : t.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage) || 1;
  const paginatedTickets = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Yeni':
      case 'Yönetici Yanıtı Bekleniyor':
        return 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse';
      case 'Açık':
      case 'Müşteri Yanıtı Bekleniyor':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Çözüldü':
      case 'Kapalı':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'Acil':
        return 'bg-red-500/20 text-red-300 border-red-500/30 font-bold';
      case 'Yüksek':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Normal':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Düşük':
        return 'bg-gray-700 text-gray-300 border-gray-600';
      default:
        return 'bg-gray-800 text-gray-400';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Üst Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
            <LifeBuoy className="w-7 h-7 text-amber-400" />
            Destek Talepleri & Ticket Sistemi
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Müşteri paneli ile tam entegre, iki yönlü gerçek zamanlı teknik destek merkezi
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
              placeholder="Ticket No, konu veya müşteri adı ile ara..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/80 border border-gray-700/60 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Durum Filtresi */}
            <div className="flex items-center gap-2 bg-gray-800/80 border border-gray-700/60 rounded-xl px-3 py-1.5 text-xs text-gray-300">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span>Durum:</span>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-white font-medium focus:outline-none"
              >
                <option value="all" className="bg-gray-900">Tümü ({tickets.length})</option>
                <option value="Yeni" className="bg-gray-900">Yeni</option>
                <option value="Yönetici Yanıtı Bekleniyor" className="bg-gray-900">Yönetici Yanıtı Bekleyen</option>
                <option value="Müşteri Yanıtı Bekleniyor" className="bg-gray-900">Müşteri Yanıtı Bekleyen</option>
                <option value="Çözüldü" className="bg-gray-900">Çözüldü</option>
                <option value="Kapalı" className="bg-gray-900">Kapalı</option>
              </select>
            </div>

            {/* Öncelik Filtresi */}
            <div className="flex items-center gap-2 bg-gray-800/80 border border-gray-700/60 rounded-xl px-3 py-1.5 text-xs text-gray-300">
              <span>Öncelik:</span>
              <select
                value={priorityFilter}
                onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-white font-medium focus:outline-none"
              >
                <option value="all" className="bg-gray-900">Tümü</option>
                <option value="Acil" className="bg-gray-900">Acil</option>
                <option value="Yüksek" className="bg-gray-900">Yüksek</option>
                <option value="Normal" className="bg-gray-900">Normal</option>
                <option value="Düşük" className="bg-gray-900">Düşük</option>
              </select>
            </div>

            {/* Kategori Filtresi */}
            <div className="flex items-center gap-2 bg-gray-800/80 border border-gray-700/60 rounded-xl px-3 py-1.5 text-xs text-gray-300">
              <span>Kategori:</span>
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-white font-medium focus:outline-none"
              >
                <option value="all" className="bg-gray-900">Tümü</option>
                <option value="Teknik Destek" className="bg-gray-900">Teknik Destek</option>
                <option value="Sipariş" className="bg-gray-900">Sipariş</option>
                <option value="Fatura" className="bg-gray-900">Fatura</option>
                <option value="Ödeme" className="bg-gray-900">Ödeme</option>
                <option value="Hesap" className="bg-gray-900">Hesap</option>
                <option value="Diğer" className="bg-gray-900">Diğer</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Tablosu */}
      <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/30 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Talep No</th>
                <th className="py-3.5 px-4">Müşteri</th>
                <th className="py-3.5 px-4">Konu / Başlık</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Öncelik</th>
                <th className="py-3.5 px-4">Durum</th>
                <th className="py-3.5 px-4">Son Güncelleme</th>
                <th className="py-3.5 px-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {paginatedTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400 text-sm">
                    Filtre kriterlerine uygun destek talebi bulunamadı.
                  </td>
                </tr>
              ) : (
                paginatedTickets.map((tck) => (
                  <tr 
                    key={tck.id}
                    onClick={() => navigate(`/yonetici/ticketlar/${tck.id}`)}
                    className="hover:bg-gray-800/40 cursor-pointer transition-colors group"
                  >
                    {/* Talep No */}
                    <td className="py-3 px-4 font-mono font-medium text-cyan-400 group-hover:text-cyan-300 transition-colors">
                      {tck.id}
                    </td>

                    {/* Müşteri */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{tck.customerName}</div>
                      <div className="text-[11px] text-gray-400">{tck.customerId}</div>
                    </td>

                    {/* Konu */}
                    <td className="py-3 px-4 max-w-[240px]">
                      <div className="font-medium text-white truncate group-hover:text-amber-300 transition-colors">
                        {tck.subject}
                      </div>
                      <div className="text-[11px] text-gray-400 truncate mt-0.5">
                        {tck.messages?.[tck.messages.length - 1]?.text || 'Giriş metni'}
                      </div>
                    </td>

                    {/* Kategori */}
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-gray-800 text-gray-300 border border-gray-700">
                        {tck.category}
                      </span>
                    </td>

                    {/* Öncelik */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${getPriorityBadge(tck.priority)}`}>
                        {tck.priority}
                      </span>
                    </td>

                    {/* Durum */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusBadge(tck.status)}`}>
                        {tck.status}
                      </span>
                    </td>

                    {/* Tarih */}
                    <td className="py-3 px-4 text-gray-400 text-[11px]">
                      {tck.updatedAt || tck.createdAt}
                    </td>

                    {/* İşlem */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/yonetici/ticketlar/${tck.id}`)}
                        className="p-1.5 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors"
                        title="Talebi Aç ve Yanıtla"
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
            Toplam <span className="text-white font-semibold">{filteredTickets.length}</span> destek talebi listeleniyor
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
