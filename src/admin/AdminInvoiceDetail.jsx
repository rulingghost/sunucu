import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  ArrowLeft, 
  Printer, 
  Download, 
  Building, 
  User, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  DollarSign, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { adminDataService } from '../services/adminDataService.js';

export default function AdminInvoiceDetail({ invoiceId, navigate }) {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadInvoice = () => {
    setLoading(true);
    const inv = adminDataService.getAdminInvoiceById(invoiceId);
    setInvoice(inv);
    setLoading(false);
  };

  useEffect(() => {
    loadInvoice();
  }, [invoiceId]);

  const handleStatusChange = (newStatus) => {
    if (!invoice) return;
    adminDataService.updateAdminInvoiceStatus(invoice.id, newStatus);
    loadInvoice();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Fatura yükleniyor...</div>;
  }

  if (!invoice) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center space-y-4">
        <FileText className="w-12 h-12 text-gray-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Fatura Bulunamadı</h2>
        <p className="text-sm text-gray-400">
          Belirtilen fatura numarası ({invoiceId}) ile eşleşen bir kayıt bulunamadı.
        </p>
        <button
          onClick={() => navigate('/yonetici/faturalar')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Fatura Listesine Dön
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Üst İşlem Çubuğu (Yazdırırken gizlenir) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/yonetici/faturalar')}
            className="p-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl border border-gray-700/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-xs font-semibold text-emerald-400">Fatura İnceleme & Baskı</div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              {invoice.id}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Durum Değiştirici */}
          <select
            value={invoice.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-3.5 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="Ödendi">Ödendi Olarak İşaretle</option>
            <option value="Bekliyor">Bekliyor</option>
            <option value="Gecikti">Gecikti</option>
            <option value="İptal">İptal Et</option>
          </select>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            Yazdır / PDF Kaydet
          </button>
        </div>
      </div>

      {/* RESMİ FATURA KAĞIDI (PRINTABLE INVOICE SHEET) */}
      <div className="bg-white text-gray-900 rounded-2xl p-8 sm:p-12 shadow-2xl border border-gray-200">
        {/* Fatura Başlık & Kurumsal Bilgi */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-gray-200 pb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-gray-950 font-mono">
                NOVA<span className="text-blue-600">Q</span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                SERVERS
              </span>
            </div>
            <div className="mt-3 text-xs text-gray-600 space-y-1">
              <p className="font-semibold text-gray-900">NovaQ Bilişim ve İnternet Hizmetleri A.Ş.</p>
              <p>Büyükdere Cad. No: 194 K:8 Levent / İstanbul</p>
              <p>Maslak Vergi Dairesi | VKN: 6310948192</p>
              <p>Ticaret Sicil No: 849201 | Mersis: 0631094819200001</p>
              <p>destek@novaq.com • +90 850 532 94 94</p>
            </div>
          </div>

          <div className="text-right space-y-1">
            <span className="text-2xl font-black text-gray-950 tracking-wider">E-FATURA</span>
            <div className="text-sm font-mono font-bold text-blue-600">{invoice.id}</div>
            <div className="text-xs text-gray-600 mt-2">
              <p>Fatura Tarihi: <span className="font-medium text-gray-900">{invoice.date}</span></p>
              <p>Son Ödeme: <span className="font-medium text-gray-900">{invoice.dueDate || 'Peşin'}</span></p>
              <p>Ödeme Durumu: <span className={`font-bold ${invoice.status === 'Ödendi' ? 'text-emerald-600' : 'text-amber-600'}`}>{invoice.status}</span></p>
            </div>
          </div>
        </div>

        {/* Müşteri / Fatura Alıcısı Bilgileri */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-gray-200 text-xs">
          <div>
            <span className="font-bold text-gray-400 uppercase tracking-wider text-[11px] block mb-2">
              Sayın / Müşteri:
            </span>
            <p className="text-sm font-bold text-gray-950">{invoice.customerName}</p>
            {invoice.company && <p className="font-semibold text-gray-800 mt-0.5">{invoice.company}</p>}
            <p className="text-gray-600 mt-1">Müşteri ID: {invoice.customerId || 'Bilinmiyor'}</p>
          </div>

          <div className="sm:text-right">
            <span className="font-bold text-gray-400 uppercase tracking-wider text-[11px] block mb-2">
              Vergi & Tebligat Bilgileri:
            </span>
            <p className="text-gray-700">Vergi Dairesi: {invoice.taxOffice || 'Belirtilmedi'}</p>
            <p className="text-gray-700 font-mono font-medium">VKN / TCKN: {invoice.taxNumber || 'Belirtilmedi'}</p>
            <p className="text-gray-600 mt-1">Hizmet Türü: Veri Merkezi ve Sunucu Barındırma</p>
          </div>
        </div>

        {/* Fatura Kalemleri Tablosu */}
        <div className="py-6">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-gray-900 text-gray-900 font-bold uppercase">
                <th className="pb-3">Sıra</th>
                <th className="pb-3">Hizmet / Açıklama</th>
                <th className="pb-3 text-center">Miktar</th>
                <th className="pb-3 text-right">Birim Fiyat ($)</th>
                <th className="pb-3 text-right">KDV</th>
                <th className="pb-3 text-right">Toplam ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoice.items && invoice.items.length > 0 ? (
                invoice.items.map((item, idx) => (
                  <tr key={idx} className="py-3">
                    <td className="py-3 text-gray-500 font-mono">{idx + 1}</td>
                    <td className="py-3 font-medium text-gray-900">{item.name}</td>
                    <td className="py-3 text-center font-medium">{item.qty || 1}</td>
                    <td className="py-3 text-right font-mono">${item.price}</td>
                    <td className="py-3 text-right font-mono">%20</td>
                    <td className="py-3 text-right font-bold font-mono text-gray-900">
                      ${(item.qty || 1) * item.price}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-3 text-gray-500 font-mono">1</td>
                  <td className="py-3 font-medium text-gray-900">{invoice.description || 'Sunucu Barındırma Hizmeti'}</td>
                  <td className="py-3 text-center font-medium">1</td>
                  <td className="py-3 text-right font-mono">${invoice.subtotal || invoice.total}</td>
                  <td className="py-3 text-right font-mono">%20</td>
                  <td className="py-3 text-right font-bold font-mono text-gray-900">${invoice.subtotal || invoice.total}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Toplam Hesap Dökümü */}
        <div className="border-t border-gray-200 pt-4 flex justify-end">
          <div className="w-72 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Ara Toplam (Matrah):</span>
              <span className="font-mono font-medium">${(invoice.subtotal || invoice.total * 0.83).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Hesaplanan KDV (%20):</span>
              <span className="font-mono font-medium">${(invoice.tax || invoice.total * 0.17).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-gray-950 pt-2 border-t-2 border-gray-900">
              <span>Genel Toplam (USD):</span>
              <span className="text-blue-600 font-mono">${invoice.total}</span>
            </div>
          </div>
        </div>

        {/* Fatura Alt Notu / Yasal Metin */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-[10px] text-gray-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-gray-700">213 Sayılı Vergi Usul Kanunu Hükümlerine Uygun Olarak Düzenlenmiştir.</p>
            <p>İşbu fatura dijital imzalı elektronik belgedir, ıslak imza gerektirmez.</p>
          </div>
          <div className="font-mono text-gray-400">
            UUID: 80effaae-4571-4373-904d-7df36aa41a52
          </div>
        </div>
      </div>
    </div>
  );
}
