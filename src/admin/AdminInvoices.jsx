import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Download, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle,
  Building,
  User,
  DollarSign,
  Calendar,
  X,
  Printer,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { adminDataService } from '../services/adminDataService.js';

export default function AdminInvoices({ navigate }) {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Yeni Fatura Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [invoiceDescription, setInvoiceDescription] = useState('Bulut Sunucu Barındırma ve Altyapı Hizmeti');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [invoiceTaxRate, setInvoiceTaxRate] = useState(20);
  const [dueDate, setDueDate] = useState('');

  const loadData = () => {
    setInvoices(adminDataService.getAdminInvoices());
    setCustomers(adminDataService.getCustomers());
  };

  useEffect(() => {
    loadData();
    // Default due date: +7 days
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setDueDate(d.toLocaleDateString('tr-TR'));
  }, []);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.customerName && inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inv.company && inv.company.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' ? true : inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage) || 1;
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    if (!selectedCustomerId || !invoiceAmount) return;

    const cust = customers.find(c => c.id === selectedCustomerId);
    if (!cust) return;

    const subtotal = parseFloat(invoiceAmount);
    const tax = subtotal * (invoiceTaxRate / 100);
    const total = subtotal + tax;

    const newInvPayload = {
      customerId: cust.id,
      customerName: cust.name,
      company: cust.company || '',
      taxOffice: cust.taxOffice || 'Maslak V.D.',
      taxNumber: cust.taxNumber || '9481028491',
      date: new Date().toLocaleDateString('tr-TR'),
      dueDate: dueDate || '20.09.2026',
      status: 'Bekliyor',
      description: invoiceDescription,
      items: [
        {
          id: 1,
          name: invoiceDescription,
          qty: 1,
          price: subtotal,
          total: subtotal
        }
      ],
      subtotal,
      tax,
      total
    };

    adminDataService.createAdminInvoice(newInvPayload);
    setIsCreateModalOpen(false);
    setSelectedCustomerId('');
    setInvoiceAmount('');
    loadData();
  };

  const handleStatusChange = (id, newStatus, e) => {
    e.stopPropagation();
    adminDataService.updateAdminInvoiceStatus(id, newStatus);
    loadData();
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Ödendi':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Bekliyor':
      case 'Taslak':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Gecikti':
      case 'İptal':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Üst Başlık & Buton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="w-7 h-7 text-emerald-400" />
            Fatura & Muhasebe Yönetimi
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Resmi e-fatura kayıtları, tahsilat takibi ve müşteri hesaplarına bağlı belgeler
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-sm font-semibold text-white rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Yeni Fatura Oluştur
        </button>
      </div>

      {/* Arama & Filtre Çubuğu */}
      <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-4 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Fatura No, müşteri veya firma adı ile ara..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/80 border border-gray-700/60 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors"
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
                <option value="all" className="bg-gray-900">Tümü ({invoices.length})</option>
                <option value="Ödendi" className="bg-gray-900">Ödendi</option>
                <option value="Bekliyor" className="bg-gray-900">Bekliyor</option>
                <option value="Gecikti" className="bg-gray-900">Gecikti</option>
                <option value="İptal" className="bg-gray-900">İptal</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Fatura Tablosu */}
      <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/30 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Fatura No</th>
                <th className="py-3.5 px-4">Müşteri / Kurum</th>
                <th className="py-3.5 px-4">Hizmet / Açıklama</th>
                <th className="py-3.5 px-4">Tarih / Vade</th>
                <th className="py-3.5 px-4">Tutar (USD)</th>
                <th className="py-3.5 px-4">Durum</th>
                <th className="py-3.5 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {paginatedInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400 text-sm">
                    Filtre kriterine uygun fatura bulunamadı.
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((inv) => (
                  <tr 
                    key={inv.id}
                    onClick={() => navigate(`/yonetici/faturalar/${inv.id}`)}
                    className="hover:bg-gray-800/40 cursor-pointer transition-colors group"
                  >
                    {/* Fatura No */}
                    <td className="py-3 px-4 font-mono font-medium text-white group-hover:text-emerald-400 transition-colors">
                      {inv.id}
                    </td>

                    {/* Müşteri / Kurum */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{inv.customerName}</div>
                      {inv.company && (
                        <div className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Building className="w-3 h-3 text-gray-500" />
                          {inv.company}
                        </div>
                      )}
                    </td>

                    {/* Açıklama */}
                    <td className="py-3 px-4 text-gray-300 max-w-[200px] truncate">
                      {inv.description || inv.items?.[0]?.name || 'Sunucu Hizmeti'}
                    </td>

                    {/* Tarih & Vade */}
                    <td className="py-3 px-4 text-gray-400">
                      <div>Düzenleme: {inv.date}</div>
                      <div className="text-[11px] text-gray-500">Vade: {inv.dueDate || 'Peşin'}</div>
                    </td>

                    {/* Tutar */}
                    <td className="py-3 px-4 font-bold text-white text-sm">
                      ${inv.total}
                    </td>

                    {/* Durum */}
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={inv.status}
                        onChange={(e) => handleStatusChange(inv.id, e.target.value, e)}
                        className={`text-[11px] font-semibold rounded-full px-2.5 py-1 border focus:outline-none cursor-pointer bg-gray-900 ${getStatusStyle(inv.status)}`}
                      >
                        <option value="Ödendi">Ödendi</option>
                        <option value="Bekliyor">Bekliyor</option>
                        <option value="Gecikti">Gecikti</option>
                        <option value="İptal">İptal</option>
                      </select>
                    </td>

                    {/* İşlemler */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/yonetici/faturalar/${inv.id}`)}
                          className="p-1.5 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors"
                          title="Fatura Görüntüle & Yazdır"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
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
            Toplam <span className="text-white font-semibold">{filteredInvoices.length}</span> fatura kaydı
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

      {/* YENİ FATURA OLUŞTURMA MODALI */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                Müşteriye Yeni Fatura Düzenle
              </h2>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Müşteri Seçin *</label>
                <select
                  required
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- Müşteri Seçiniz --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.company || c.email}) - {c.id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Fatura Hizmet / Ürün Açıklaması *</label>
                <input
                  type="text"
                  required
                  value={invoiceDescription}
                  onChange={(e) => setInvoiceDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Ara Toplam ($ USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    placeholder="100.00"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">KDV Oranı (%)</label>
                  <select
                    value={invoiceTaxRate}
                    onChange={(e) => setInvoiceTaxRate(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="20">%20 Standart KDV</option>
                    <option value="10">%10 İndirimli KDV</option>
                    <option value="0">%0 Muaf / İhracat</option>
                  </select>
                </div>
              </div>

              {invoiceAmount && (
                <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-800 text-xs space-y-1">
                  <div className="flex justify-between text-gray-400">
                    <span>Ara Toplam:</span>
                    <span>${parseFloat(invoiceAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>KDV Tutarı:</span>
                    <span>${(parseFloat(invoiceAmount) * (invoiceTaxRate / 100)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold pt-1 border-t border-gray-700">
                    <span>Ödenecek Toplam Tutar:</span>
                    <span className="text-emerald-400">
                      ${(parseFloat(invoiceAmount) * (1 + invoiceTaxRate / 100)).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Son Ödeme Tarihi (Vade)</label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="20.09.2026"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-sm font-medium text-gray-300 rounded-xl transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-sm font-semibold text-white rounded-xl shadow-lg shadow-emerald-600/20 transition-colors"
                >
                  Faturayı Kes & Gönder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
