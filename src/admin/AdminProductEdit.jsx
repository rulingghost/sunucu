import React, { useState, useEffect } from 'react';
import { 
  Server, 
  ArrowLeft, 
  Save, 
  Cpu, 
  HardDrive, 
  Zap, 
  ShieldCheck, 
  DollarSign, 
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { adminDataService } from '../services/adminDataService.js';

export default function AdminProductEdit({ productId, mode = 'edit', navigate }) {
  const isNew = mode === 'new' || !productId;

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'nvme-cloud',
    cpu: '',
    cores: 4,
    ram: '16 GB DDR5 ECC',
    storage: '250 GB NVMe',
    bandwidth: 'Limitsiz Trafik',
    portSpeed: '1 Gbps',
    ddos: '5 Tbit/s L3/L4/L7 NovaShield',
    monthlyPrice: 29.99,
    status: 'Aktif',
    isPopular: false,
    features: ['Tier III+ Veri Merkezi', 'Anında Otomatik Kurulum', '%99.99 SLA Garantisi']
  });

  const [featuresInput, setFeaturesInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isNew && productId) {
      const p = adminDataService.getAdminProductById(productId);
      if (p) {
        setFormData(p);
        setFeaturesInput(Array.isArray(p.features) ? p.features.join('\n') : '');
      } else {
        setErrorMsg('Ürün bulunamadı!');
      }
    } else {
      // New product id generator
      setFormData(prev => ({
        ...prev,
        id: 'PLAN-CUSTOM-' + Math.floor(1000 + Math.random() * 9000)
      }));
      setFeaturesInput('Tier III+ Veri Merkezi\nAnında Otomatik Kurulum\n%99.99 SLA Garantisi\nÜcretsiz Snapshot Yedekleme');
    }
  }, [productId, isNew]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.monthlyPrice) {
      setErrorMsg('Lütfen paket adı ve fiyat alanlarını doldurunuz.');
      return;
    }

    const cleanedFeatures = featuresInput
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const payload = {
      ...formData,
      monthlyPrice: parseFloat(formData.monthlyPrice),
      price: parseFloat(formData.monthlyPrice),
      cores: parseInt(formData.cores, 10) || 4,
      features: cleanedFeatures
    };

    if (isNew) {
      adminDataService.addAdminProduct(payload);
    } else {
      adminDataService.updateAdminProduct(productId, payload);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      navigate('/yonetici/urunler');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Üst Çubuk */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/yonetici/urunler')}
            className="p-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl border border-gray-700/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Server className="w-6 h-6 text-cyan-400" />
              {isNew ? 'Yeni Sunucu Paketi Oluştur' : `Paketi Düzenle: ${formData.name}`}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Yapılan değişiklikler doğrudan ana web sitesine ve yapılandırıcıya yansır
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Başarıyla Kaydedildi! Yönlendiriliyor...
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
          <AlertCircle className="w-4 h-4" />
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Paket Adı */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Paket / Sunucu Adı *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              placeholder="Örn: Cloud Ultra NVMe-8"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Kategori *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="nvme-cloud">NVMe Cloud Sunucular</option>
              <option value="extreme-ryzen">Extreme Ryzen VDS Sunucular</option>
              <option value="dedicated">Fiziksel Dedicated Sunucular</option>
              <option value="gpu-ai">Ekran Kartlı / AI & Render Sunucuları</option>
            </select>
          </div>

          {/* İşlemci (CPU) */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">İşlemci Modeli (CPU)</label>
            <input
              type="text"
              value={formData.cpu}
              onChange={(e) => setFormData({ ...formData, cpu: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              placeholder="Örn: AMD EPYC 9654 (3.70 GHz)"
            />
          </div>

          {/* Çekirdek Sayısı */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">vCPU / Çekirdek Sayısı</label>
            <input
              type="number"
              min="1"
              max="256"
              value={formData.cores}
              onChange={(e) => setFormData({ ...formData, cores: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* RAM */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Bellek (RAM)</label>
            <input
              type="text"
              value={formData.ram}
              onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              placeholder="Örn: 32 GB DDR5 ECC"
            />
          </div>

          {/* Disk */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Depolama (Disk)</label>
            <input
              type="text"
              value={formData.storage}
              onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              placeholder="Örn: 500 GB NVMe Gen4"
            />
          </div>

          {/* Aylık Fiyat ($) */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Aylık Fiyat ($ USD) *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
              <input
                type="number"
                step="0.01"
                required
                value={formData.monthlyPrice}
                onChange={(e) => setFormData({ ...formData, monthlyPrice: e.target.value })}
                className="w-full pl-8 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white font-bold focus:outline-none focus:border-cyan-500"
                placeholder="29.99"
              />
            </div>
          </div>

          {/* Port Hızı */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Port / Hat Hızı</label>
            <input
              type="text"
              value={formData.portSpeed}
              onChange={(e) => setFormData({ ...formData, portSpeed: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              placeholder="Örn: 1 Gbps veya 10 Gbps"
            />
          </div>

          {/* Trafik */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Aylık Trafik Limiti</label>
            <input
              type="text"
              value={formData.bandwidth}
              onChange={(e) => setFormData({ ...formData, bandwidth: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              placeholder="Örn: Limitsiz veya 20 TB"
            />
          </div>

          {/* DDoS Koruması */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">DDoS Koruması</label>
            <input
              type="text"
              value={formData.ddos}
              onChange={(e) => setFormData({ ...formData, ddos: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              placeholder="Örn: 5 Tbit/s L3/L4/L7 NovaShield"
            />
          </div>
        </div>

        {/* Durum & Popüler Seçenekleri */}
        <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl bg-gray-800/40 border border-gray-800">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
            <input
              type="checkbox"
              checked={formData.status === 'Aktif'}
              onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'Aktif' : 'Pasif' })}
              className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-gray-700 border-gray-600"
            />
            <span>Paket Satışta Aktif Olsun</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
            <input
              type="checkbox"
              checked={formData.isPopular}
              onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
              className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-gray-700 border-gray-600"
            />
            <span>Öne Çıkan / Popüler Rozeti Göster</span>
          </label>
        </div>

        {/* Özellikler Listesi */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Özellikler (Her satıra bir özellik yazınız)
          </label>
          <textarea
            rows={4}
            value={featuresInput}
            onChange={(e) => setFeaturesInput(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            placeholder="Tier III+ Veri Merkezi&#10;Anında Otomatik Kurulum&#10;%99.99 SLA Garantisi"
          />
        </div>

        {/* Butonlar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
          <button
            type="button"
            onClick={() => navigate('/yonetici/urunler')}
            className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-sm font-medium text-gray-300 rounded-xl transition-colors"
          >
            İptal
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-sm font-bold text-white rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            {isNew ? 'Paketi Oluştur ve Yayınla' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
