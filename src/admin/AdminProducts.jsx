import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  Cpu, 
  HardDrive, 
  Activity, 
  Zap,
  ExternalLink,
  Save,
  Check,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { adminDataService } from '../services/adminDataService.js';

export default function AdminProducts({ navigate }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Hızlı Fiyat Değiştirme State
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [tempPrice, setTempPrice] = useState('');

  // Silme Onay Modal
  const [productToDelete, setProductToDelete] = useState(null);

  const loadProducts = () => {
    const list = adminDataService.getAdminProducts();
    setProducts(list);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Filtreleme
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.cpu && p.cpu.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' ? true : p.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' ? true : p.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleToggleStatus = (id) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    const newStatus = prod.status === 'Aktif' ? 'Pasif' : 'Aktif';
    adminDataService.updateAdminProduct(id, { status: newStatus });
    loadProducts();
  };

  const handleStartEditPrice = (prod, e) => {
    e.stopPropagation();
    setEditingPriceId(prod.id);
    setTempPrice(prod.monthlyPrice || prod.price);
  };

  const handleSavePrice = (id, e) => {
    e.stopPropagation();
    const num = parseFloat(tempPrice);
    if (!isNaN(num) && num > 0) {
      adminDataService.updateAdminProduct(id, { monthlyPrice: num, price: num });
      loadProducts();
    }
    setEditingPriceId(null);
  };

  const handleDeleteConfirm = () => {
    if (!productToDelete) return;
    adminDataService.deleteAdminProduct(productToDelete.id);
    setProductToDelete(null);
    loadProducts();
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'nvme-cloud': return 'NVMe Cloud';
      case 'extreme-ryzen': return 'Extreme Ryzen';
      case 'dedicated': return 'Fiziksel Sunucu';
      case 'gpu-ai': return 'Ekran Kartlı / AI';
      default: return cat;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Üst Başlık & Eylemler */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
            <Server className="w-7 h-7 text-cyan-400" />
            Ürün & Paket Yönetimi
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Web sitesi ve sunucu yapılandırıcısındaki tüm 51 sunucu planını yönetin
          </p>
        </div>

        <button
          onClick={() => navigate('/yonetici/urunler/yeni')}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-sm font-semibold text-white rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Yeni Sunucu Paketi Ekle
        </button>
      </div>

      {/* Arama & Filtre Çubuğu */}
      <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-4 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Paket adı, işlemci modeli veya ID ile ara..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/80 border border-gray-700/60 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Kategori Filtresi */}
            <div className="flex items-center gap-2 bg-gray-800/80 border border-gray-700/60 rounded-xl px-3 py-1.5 text-xs text-gray-300">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span>Kategori:</span>
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-white font-medium focus:outline-none"
              >
                <option value="all" className="bg-gray-900">Tümü (51 Paket)</option>
                <option value="nvme-cloud" className="bg-gray-900">NVMe Cloud (9)</option>
                <option value="extreme-ryzen" className="bg-gray-900">Extreme Ryzen (12)</option>
                <option value="dedicated" className="bg-gray-900">Fiziksel Sunucu (18)</option>
                <option value="gpu-ai" className="bg-gray-900">Ekran Kartlı / AI (12)</option>
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
                <option value="Aktif" className="bg-gray-900">Aktif</option>
                <option value="Pasif" className="bg-gray-900">Pasif</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Ürünler Tablosu */}
      <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/30 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Paket / Sunucu</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Donanım Özellikleri</th>
                <th className="py-3.5 px-4">Aylık Fiyat ($)</th>
                <th className="py-3.5 px-4">Durum</th>
                <th className="py-3.5 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                    Filtreleme kriterine uygun sunucu paketi bulunamadı.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((prod) => (
                  <tr 
                    key={prod.id} 
                    className="hover:bg-gray-800/40 transition-colors group"
                  >
                    {/* Paket Adı */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-bold text-sm text-cyan-400">
                          <Server className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                            {prod.name}
                            {prod.isPopular && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                                POPÜLER
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-[11px] text-gray-400">{prod.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Kategori */}
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-gray-800 text-gray-300 border border-gray-700">
                        {getCategoryLabel(prod.category)}
                      </span>
                    </td>

                    {/* Donanım Özellikleri */}
                    <td className="py-3 px-4 text-gray-300">
                      <div className="font-medium text-white flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                        {prod.cpu || `${prod.cores} vCPU`}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        RAM: <span className="text-gray-300">{prod.ram}</span> • Disk: <span className="text-gray-300">{prod.storage}</span>
                      </div>
                    </td>

                    {/* Aylık Fiyat & Hızlı Düzenleme */}
                    <td className="py-3 px-4">
                      {editingPriceId === prod.id ? (
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="number"
                            step="0.01"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            className="w-20 px-2 py-1 bg-gray-800 border border-cyan-500 rounded text-xs text-white focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={(e) => handleSavePrice(prod.id, e)}
                            className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded"
                            title="Kaydet"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingPriceId(null); }}
                            className="p-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded"
                            title="İptal"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div 
                          onClick={(e) => handleStartEditPrice(prod, e)}
                          className="cursor-pointer group/price flex items-center gap-1.5"
                          title="Fiyatı doğrudan değiştirmek için tıklayın"
                        >
                          <span className="text-sm font-bold text-white group-hover/price:text-cyan-400 transition-colors">
                            ${prod.monthlyPrice || prod.price}
                          </span>
                          <span className="text-[10px] text-gray-400">/ay</span>
                          <Edit className="w-3 h-3 text-gray-400 group-hover/price:text-cyan-400 transition-colors" />
                        </div>
                      )}
                    </td>

                    {/* Durum */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(prod.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                          prod.status === 'Aktif'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                        }`}
                        title="Tıklayarak durumu değiştir"
                      >
                        {prod.status === 'Aktif' ? (
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

                    {/* İşlemler */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/yonetici/urunler/${prod.id}`)}
                          className="p-1.5 hover:bg-gray-800 text-gray-400 hover:text-cyan-400 rounded-lg transition-colors"
                          title="Tüm Özellikleri Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setProductToDelete(prod)}
                          className="p-1.5 hover:bg-gray-800 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                          title="Paketi Sil"
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
            Toplam <span className="text-white font-semibold">{filteredProducts.length}</span> sunucu paketi listeleniyor
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

      {/* SİLME ONAY MODALI */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-gray-900 border border-red-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Paketi Sil</h3>
                <p className="text-xs text-gray-400">Ana siteden kaldırılacak</p>
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-6">
              <span className="font-semibold text-white">{productToDelete.name}</span> ({productToDelete.id}) sunucu paketini silmek istediğinizden emin misiniz?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-sm font-medium text-gray-300 rounded-xl transition-colors"
              >
                Vazgeç
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-sm font-semibold text-white rounded-xl shadow-lg shadow-red-600/20 transition-colors"
              >
                Evet, Paketi Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
