import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Activity, 
  FileText, 
  Server, 
  DollarSign, 
  LifeBuoy, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { adminDataService } from '../services/adminDataService.js';

export default function AdminAuditLogs({ navigate }) {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setLogs(adminDataService.getAdminAuditLogs());
  }, []);

  const filteredLogs = logs.filter(l => {
    const matchesSearch = 
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.details && l.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.target && l.target.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = actionFilter === 'all' ? true : l.action.toLowerCase().includes(actionFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getActionBadgeColor = (action) => {
    if (action.includes('Giriş') || action.includes('Profil')) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    if (action.includes('Müşteri')) return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    if (action.includes('Ürün') || action.includes('Fiyat')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (action.includes('Sipariş')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    if (action.includes('Fatura')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (action.includes('Ticket')) return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    return 'bg-gray-800 text-gray-300 border-gray-700';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Üst Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 text-cyan-400" />
            Yönetici İşlem Geçmişi (Audit Logs)
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Yönetim panelinde gerçekleştirilen tüm idari, finansal ve güvenlik hareketlerinin denetim kayıtları
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
              placeholder="İşlem adı, hedef kayıt veya detay ile ara..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/80 border border-gray-700/60 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 bg-gray-800/80 border border-gray-700/60 rounded-xl px-3 py-1.5 text-xs text-gray-300 w-full md:w-auto">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span>İşlem Türü:</span>
            <select
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-white font-medium focus:outline-none"
            >
              <option value="all" className="bg-gray-900">Tümü ({logs.length})</option>
              <option value="Giriş" className="bg-gray-900">Oturum / Giriş</option>
              <option value="Müşteri" className="bg-gray-900">Müşteri İşlemleri</option>
              <option value="Ürün" className="bg-gray-900">Ürün / Fiyat</option>
              <option value="Sipariş" className="bg-gray-900">Sipariş Güncellemeleri</option>
              <option value="Fatura" className="bg-gray-900">Fatura İşlemleri</option>
              <option value="Ticket" className="bg-gray-900">Destek / Ticket</option>
            </select>
          </div>
        </div>
      </div>

      {/* Log Tablosu */}
      <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/30 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Zaman / Tarih</th>
                <th className="py-3.5 px-4">Yönetici</th>
                <th className="py-3.5 px-4">İşlem</th>
                <th className="py-3.5 px-4">İlgili Kayıt</th>
                <th className="py-3.5 px-4">Detay / Değişiklik</th>
                <th className="py-3.5 px-4 text-right">IP Adresi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                    Kriterlere uygun işlem geçmişi kaydı bulunamadı.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-800/40 transition-colors">
                    {/* Tarih */}
                    <td className="py-3 px-4 font-mono text-gray-400 whitespace-nowrap">
                      {log.date}
                    </td>

                    {/* Yönetici */}
                    <td className="py-3 px-4 font-medium text-white">
                      <span className="text-cyan-400 font-mono">@{log.user || 'admin'}</span>
                    </td>

                    {/* İşlem */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getActionBadgeColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>

                    {/* İlgili Kayıt */}
                    <td className="py-3 px-4 font-mono text-gray-300">
                      {log.target || '-'}
                    </td>

                    {/* Detay */}
                    <td className="py-3 px-4 text-gray-300 max-w-xs truncate">
                      {log.details || log.action}
                    </td>

                    {/* IP */}
                    <td className="py-3 px-4 text-right font-mono text-gray-500">
                      {log.ip || '185.193.12.4'}
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
            Toplam <span className="text-white font-semibold">{filteredLogs.length}</span> denetim kaydı
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
