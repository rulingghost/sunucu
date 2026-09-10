import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  Phone, 
  Building, 
  DollarSign, 
  Calendar,
  AlertTriangle,
  X,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { adminDataService } from '../services/adminDataService.js';

export default function AdminCustomers({ navigate }) {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, Aktif, Pasif
  const [sortBy, setSortBy] = useState('name'); // name, date, spent
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Yeni Müşteri Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustForm, setNewCustForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    tier: 'Kurumsal',
    taxOffice: '',
    taxNumber: '',
    address: '',
    city: 'İstanbul'
  });

  // Silme Onay Modal
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Düzenleme Modal
  const [editingCustomer, setEditingCustomer] = useState(null);

  const loadCustomers = () => {
    const list = adminDataService.getCustomers();
    setCustomers(list);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // Filtreleme ve Arama
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' ? true : c.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'spent') return (b.totalSpent || 0) - (a.totalSpent || 0);
    if (sortBy === 'date') return b.id.localeCompare(a.id);
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleToggleStatus = (id, e) => {
    e.stopPropagation();
    adminDataService.toggleCustomerStatus(id);
    loadCustomers();
  };

  const handleDeleteConfirm = () => {
    if (!customerToDelete) return;
    adminDataService.deleteCustomer(customerToDelete.id);
    setCustomerToDelete(null);
    loadCustomers();
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newCustForm.name || !newCustForm.email) return;
    adminDataService.addCustomer(newCustForm);
    setIsAddModalOpen(false);
    setNewCustForm({
      name: '',
      company: '',
      email: '',
      phone: '',
      tier: 'Kurumsal',
      taxOffice: '',
      taxNumber: '',
      address: '',
      city: 'İstanbul'
    });
    loadCustomers();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingCustomer) return;
    adminDataService.updateCustomer(editingCustomer.id, editingCustomer);
    setEditingCustomer(null);
    loadCustomers();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Başlık ve Eylemler */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-7 h-7 text-purple-400" />
            Müşteri Portföy Yönetimi
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Kayıtlı kurumsal ve bireysel müşterilerin hesap, finans ve sunucu bilgileri
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-sm font-semibold text-white rounded-xl shadow-lg shadow-purple-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Yeni Müşteri Ekle
        </button>
      </div>

      {/* Arama, Filtreleme ve Sıralama Çubuğu */}
      <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-4 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Müşteri adı, firma, ID veya e-posta ile ara..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/80 border border-gray-700/60 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
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
                <option value="all" className="bg-gray-900">Tümü</option>
                <option value="Aktif" className="bg-gray-900">Aktif</option>
                <option value="Pasif" className="bg-gray-900">Pasif</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-gray-800/80 border border-gray-700/60 rounded-xl px-3 py-1.5 text-xs text-gray-300">
              <span>Sırala:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none"
              >
                <option value="name" className="bg-gray-900">İsim (A-Z)</option>
                <option value="spent" className="bg-gray-900">En Çok Harcayan</option>
                <option value="date" className="bg-gray-900">En Yeni Kayıt</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Müşteri Tablosu */}
      <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/30 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Müşteri / Firma</th>
                <th className="py-3.5 px-4">İletişim</th>
                <th className="py-3.5 px-4">Kayıt Tarihi</th>
                <th className="py-3.5 px-4">Hesap Durumu</th>
                <th className="py-3.5 px-4">Siparişler</th>
                <th className="py-3.5 px-4">Toplam Harcama</th>
                <th className="py-3.5 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400 text-sm">
                    Arama kriterlerine uygun müşteri bulunamadı.
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((cust) => (
                  <tr 
                    key={cust.id}
                    onClick={() => navigate(`/yonetici/musteriler/${cust.id}`)}
                    className="hover:bg-gray-800/40 cursor-pointer transition-colors group"
                  >
                    {/* Müşteri & Firma */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-bold text-sm text-purple-400">
                          {cust.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-purple-300 transition-colors flex items-center gap-2">
                            {cust.name}
                            <span className="font-mono text-[10px] text-gray-400 font-normal">({cust.id})</span>
                          </div>
                          {cust.company && (
                            <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                              <Building className="w-3 h-3 text-gray-500" />
                              {cust.company}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* İletişim */}
                    <td className="py-3 px-4">
                      <div className="text-gray-300 flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-gray-500" />
                        {cust.email}
                      </div>
                      {cust.phone && (
                        <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3 text-gray-500" />
                          {cust.phone}
                        </div>
                      )}
                    </td>

                    {/* Kayıt Tarihi */}
                    <td className="py-3 px-4 text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        {cust.registeredAt || '12.01.2025'}
                      </div>
                      <span className="text-[10px] text-purple-400 font-medium">{cust.tier || 'Kurumsal'}</span>
                    </td>

                    {/* Hesap Durumu */}
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleToggleStatus(cust.id, e)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                          cust.status === 'Aktif'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                        }`}
                        title="Tıklayarak Durumu Değiştir"
                      >
                        {cust.status === 'Aktif' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Aktif
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Pasif
                          </>
                        )}
                      </button>
                    </td>

                    {/* Sipariş Sayısı */}
                    <td className="py-3 px-4 font-semibold text-white">
                      {cust.orderCount || 0} Adet
                    </td>

                    {/* Toplam Harcama */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">
                        ${(cust.totalSpent || 0).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-gray-500">Bakiye: ${cust.balance || 0}</div>
                    </td>

                    {/* İşlemler */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/yonetici/musteriler/${cust.id}`)}
                          className="p-1.5 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors"
                          title="Detay Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingCustomer(cust)}
                          className="p-1.5 hover:bg-gray-800 text-gray-400 hover:text-cyan-400 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setCustomerToDelete(cust)}
                          className="p-1.5 hover:bg-gray-800 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Sayfalama (Pagination) */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800 bg-gray-900/40 text-xs text-gray-400">
          <div>
            Toplam <span className="text-white font-semibold">{filteredCustomers.length}</span> müşteri kayıtlı
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

      {/* YENİ MÜŞTERİ EKLE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Yeni Müşteri Oluştur
              </h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Ad Soyad *</label>
                  <input
                    type="text"
                    required
                    value={newCustForm.name}
                    onChange={(e) => setNewCustForm({ ...newCustForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                    placeholder="Örn: Can Berke"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Firma Adı</label>
                  <input
                    type="text"
                    value={newCustForm.company}
                    onChange={(e) => setNewCustForm({ ...newCustForm, company: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                    placeholder="Örn: Apex Bilişim A.Ş."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">E-Posta *</label>
                  <input
                    type="email"
                    required
                    value={newCustForm.email}
                    onChange={(e) => setNewCustForm({ ...newCustForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                    placeholder="musteri@firma.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Telefon</label>
                  <input
                    type="tel"
                    value={newCustForm.phone}
                    onChange={(e) => setNewCustForm({ ...newCustForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                    placeholder="+90 5XX XXX XX XX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Vergi Dairesi</label>
                  <input
                    type="text"
                    value={newCustForm.taxOffice}
                    onChange={(e) => setNewCustForm({ ...newCustForm, taxOffice: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                    placeholder="Maslak V.D."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Vergi Numarası</label>
                  <input
                    type="text"
                    value={newCustForm.taxNumber}
                    onChange={(e) => setNewCustForm({ ...newCustForm, taxNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                    placeholder="10 Haneli VKN / TC"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Adres</label>
                <textarea
                  rows={2}
                  value={newCustForm.address}
                  onChange={(e) => setNewCustForm({ ...newCustForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                  placeholder="Fatura ve tebligat adresi"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-sm font-medium text-gray-300 rounded-xl transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-sm font-semibold text-white rounded-xl shadow-lg shadow-purple-600/20 transition-colors"
                >
                  Müşteriyi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DÜZENLEME MODAL */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-cyan-400" />
                Müşteri Bilgilerini Düzenle ({editingCustomer.id})
              </h2>
              <button 
                onClick={() => setEditingCustomer(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Ad Soyad</label>
                  <input
                    type="text"
                    value={editingCustomer.name}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Firma</label>
                  <input
                    type="text"
                    value={editingCustomer.company || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, company: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">E-posta</label>
                  <input
                    type="email"
                    value={editingCustomer.email}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Telefon</label>
                  <input
                    type="tel"
                    value={editingCustomer.phone || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Vergi Dairesi</label>
                  <input
                    type="text"
                    value={editingCustomer.taxOffice || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, taxOffice: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Vergi Numarası</label>
                  <input
                    type="text"
                    value={editingCustomer.taxNumber || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, taxNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-sm font-medium text-gray-300 rounded-xl transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-sm font-semibold text-white rounded-xl shadow-lg shadow-cyan-600/20 transition-colors"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SİLME ONAY MODALI (Section 11: Yanlışlıkla silinmeyi önleme) */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-gray-900 border border-red-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Müşteri Kaydını Sil</h3>
                <p className="text-xs text-gray-400">Bu işlem geri alınamaz</p>
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-6">
              <span className="font-semibold text-white">{customerToDelete.name}</span> ({customerToDelete.id}) müşterisini sistemden tamamen kaldırmak istediğinizden emin misiniz?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCustomerToDelete(null)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-sm font-medium text-gray-300 rounded-xl transition-colors"
              >
                Vazgeç
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-sm font-semibold text-white rounded-xl shadow-lg shadow-red-600/20 transition-colors"
              >
                Evet, Müşteriyi Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
