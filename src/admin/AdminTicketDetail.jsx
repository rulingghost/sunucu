import React, { useState, useEffect, useRef } from 'react';
import { 
  LifeBuoy, 
  ArrowLeft, 
  Send, 
  User, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  MessageSquare, 
  FileText, 
  Lock, 
  Unlock,
  Phone,
  Mail,
  Building,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { adminDataService } from '../services/adminDataService.js';

export default function AdminTicketDetail({ ticketId, navigate }) {
  const [ticket, setTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [internalNoteText, setInternalNoteText] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('conversation'); // conversation, notes
  const messagesEndRef = useRef(null);

  const loadTicket = () => {
    setLoading(true);
    const t = adminDataService.getAdminTicketById(ticketId);
    setTicket(t);
    setLoading(false);
  };

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages]);

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    adminDataService.adminReplyTicket(ticketId, replyText.trim());
    setReplyText('');
    loadTicket();
  };

  const handleAddInternalNote = (e) => {
    e.preventDefault();
    if (!internalNoteText.trim()) return;

    adminDataService.addAdminTicketNote(ticketId, internalNoteText.trim());
    setInternalNoteText('');
    loadTicket();
  };

  const handleStatusChange = (newStatus) => {
    adminDataService.updateAdminTicketStatus(ticketId, newStatus);
    loadTicket();
  };

  const handlePriorityChange = (newPriority) => {
    adminDataService.updateAdminTicketPriority(ticketId, newPriority);
    loadTicket();
  };

  const applyCannedResponse = (text) => {
    setReplyText(text);
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Destek talebi yükleniyor...</div>;
  }

  if (!ticket) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center space-y-4">
        <LifeBuoy className="w-12 h-12 text-gray-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Destek Talebi Bulunamadı</h2>
        <p className="text-sm text-gray-400">
          Belirtilen talep numarası ({ticketId}) ile eşleşen kayıt bulunamadı.
        </p>
        <button
          onClick={() => navigate('/yonetici/ticketlar')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Destek Listesine Dön
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Üst Navigasyon & Aksiyon Başlığı */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/yonetici/ticketlar')}
            className="p-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl border border-gray-700/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
              <span className="font-mono">{ticket.id}</span>
              <span>•</span>
              <span>{ticket.category}</span>
              <span>•</span>
              <span className="text-gray-400">{ticket.createdAt}</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-white mt-0.5">
              {ticket.subject}
            </h1>
          </div>
        </div>

        {/* Durum & Öncelik Seçicileri */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Durum */}
          <div className="flex items-center gap-1.5 bg-gray-900 border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-gray-300">
            <span className="text-gray-400">Durum:</span>
            <select
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Yeni" className="bg-gray-900">Yeni</option>
              <option value="Açık" className="bg-gray-900">Açık</option>
              <option value="Yönetici Yanıtı Bekleniyor" className="bg-gray-900">Yönetici Yanıtı Bekliyor</option>
              <option value="Müşteri Yanıtı Bekleniyor" className="bg-gray-900">Müşteri Yanıtı Bekliyor</option>
              <option value="Çözüldü" className="bg-gray-900">Çözüldü</option>
              <option value="Kapalı" className="bg-gray-900">Kapalı</option>
            </select>
          </div>

          {/* Öncelik */}
          <div className="flex items-center gap-1.5 bg-gray-900 border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-gray-300">
            <span className="text-gray-400">Öncelik:</span>
            <select
              value={ticket.priority}
              onChange={(e) => handlePriorityChange(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Düşük" className="bg-gray-900">Düşük</option>
              <option value="Normal" className="bg-gray-900">Normal</option>
              <option value="Yüksek" className="bg-gray-900">Yüksek</option>
              <option value="Acil" className="bg-gray-900 text-red-400">Acil</option>
            </select>
          </div>

          {ticket.status === 'Kapalı' ? (
            <button
              onClick={() => handleStatusChange('Açık')}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-emerald-400 rounded-xl border border-gray-700 transition-colors"
            >
              <Unlock className="w-3.5 h-3.5" />
              Talebi Yeniden Aç
            </button>
          ) : (
            <button
              onClick={() => handleStatusChange('Kapalı')}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-red-400 rounded-xl border border-gray-700 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              Talebi Kapat
            </button>
          )}
        </div>
      </div>

      {/* Müşteri & Sipariş Hızlı Bağlantı Şeridi */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-gray-300">
          <div className="flex items-center gap-1.5 font-semibold text-white">
            <User className="w-4 h-4 text-purple-400" />
            {ticket.customerName}
          </div>
          {ticket.customerEmail && (
            <div className="flex items-center gap-1.5 text-gray-400">
              <Mail className="w-3.5 h-3.5 text-gray-500" />
              {ticket.customerEmail}
            </div>
          )}
          {ticket.customerPhone && (
            <div className="flex items-center gap-1.5 text-gray-400">
              <Phone className="w-3.5 h-3.5 text-gray-500" />
              {ticket.customerPhone}
            </div>
          )}
          <span className="text-gray-500">ID: {ticket.customerId}</span>
        </div>

        <div className="flex items-center gap-2">
          {ticket.customerId && (
            <button
              onClick={() => navigate(`/yonetici/musteriler/${ticket.customerId}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/10 hover:bg-purple-600/20 text-purple-300 rounded-xl border border-purple-500/20 transition-colors font-medium"
            >
              Müşteriyi Görüntüle
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
          {ticket.relatedOrderId && (
            <button
              onClick={() => navigate(`/yonetici/siparisler/${ticket.relatedOrderId}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 rounded-xl border border-blue-500/20 transition-colors font-medium"
            >
              Siparişi Görüntüle ({ticket.relatedOrderId})
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Sekmeler: Konuşma Geçmişi & Dahili Yönetici Notları */}
      <div className="flex border-b border-gray-800 space-x-2">
        <button
          onClick={() => setActiveTab('conversation')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-colors ${
            activeTab === 'conversation'
              ? 'bg-gray-800 text-white border-t border-x border-gray-700'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Konuşma Geçmişi ({ticket.messages?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-colors ${
            activeTab === 'notes'
              ? 'bg-gray-800 text-white border-t border-x border-gray-700'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Dahili Yönetici Notları ({ticket.internalNotes?.length || 0})
        </button>
      </div>

      {/* SEKME 1: KONUŞMA GEÇMİŞİ VE YANITLAMA */}
      {activeTab === 'conversation' && (
        <div className="space-y-4">
          {/* Mesaj Akışı Kutusu */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 min-h-[400px] max-h-[550px] overflow-y-auto space-y-4 shadow-inner">
            {ticket.messages && ticket.messages.map((msg) => {
              const isAdmin = msg.senderType === 'admin';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[11px] text-gray-400">
                    <span className="font-semibold text-white">
                      {isAdmin ? 'NovaQ Destek Ekibi (Yönetici)' : (msg.senderName || ticket.customerName)}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span>{msg.timestamp || msg.date}</span>
                    {isAdmin && (
                      <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[9px]">
                        ADMIN
                      </span>
                    )}
                  </div>

                  <div
                    className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-wrap ${
                      isAdmin
                        ? 'bg-gradient-to-br from-cyan-950/60 to-blue-900/40 border border-cyan-500/30 text-white rounded-tr-none'
                        : 'bg-gray-800/80 border border-gray-700 text-gray-100 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Hızlı Yanıt Şablonları */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-gray-500 flex items-center gap-1 shrink-0 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Hızlı Şablonlar:
            </span>
            <button
              onClick={() => applyCannedResponse('Merhaba,\n\nDestek talebiniz ilgili teknik birimimize iletilmiştir. Sunucu kontrolleriniz gerçekleştirilmekte olup en kısa sürede bilgi verilecektir.\n\nSaygılarımızla,\nNovaQ Destek')}
              className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg shrink-0 border border-gray-700 transition-colors"
            >
              İncelemede
            </button>
            <button
              onClick={() => applyCannedResponse('Merhaba,\n\nTalep ettiğiniz işlem başarıyla gerçekleştirilmiştir. Sunucunuz aktif durumda çalışmaktadır. Herhangi bir sorunuz olursa lütfen bize bildirin.\n\nİyi çalışmalar,\nNovaQ Destek Ekibi')}
              className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg shrink-0 border border-gray-700 transition-colors"
            >
              İşlem Tamamlandı
            </button>
            <button
              onClick={() => applyCannedResponse('Merhaba,\n\nKonuyu detaylı inceleyebilmemiz için sunucu IP adresiniz veya erişim detaylarını paylaşabilir misiniz?\n\nTeşekkür ederiz,\nNovaQ Sistem Ekibi')}
              className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg shrink-0 border border-gray-700 transition-colors"
            >
              Ek Bilgi İste
            </button>
          </div>

          {/* Yanıt Gönderme Formu */}
          <form onSubmit={handleSendReply} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 space-y-3">
            <textarea
              rows={4}
              required
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Müşteriye resmi teknik destek cevabınızı yazınız (Müşteri panelinde anında görünür)..."
              className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-500">
                Yanıt gönderildiğinde durum otomatik olarak "Müşteri Yanıtı Bekleniyor" yapılacaktır.
              </span>
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-white rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                Yanıtı Gönder
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SEKME 2: DAHİLİ YÖNETİCİ NOTLARI */}
      {activeTab === 'notes' && (
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              Destek Talebine Dahili Not Ekle
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Bu notlar yalnızca yöneticiler tarafından görülebilir, müşteri paneline kesinlikle iletilmez.
            </p>
          </div>

          <form onSubmit={handleAddInternalNote} className="space-y-3">
            <textarea
              rows={3}
              value={internalNoteText}
              onChange={(e) => setInternalNoteText(e.target.value)}
              placeholder="Talep hakkında şirket içi not giriniz..."
              className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!internalNoteText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-xs font-semibold text-white rounded-xl transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Dahili Notu Kaydet
              </button>
            </div>
          </form>

          <div className="space-y-2 pt-2">
            {!ticket.internalNotes || ticket.internalNotes.length === 0 ? (
              <div className="text-center py-6 text-xs text-gray-500">
                Henüz bu destek talebine dahili bir not eklenmemiş.
              </div>
            ) : (
              ticket.internalNotes.map((n, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-gray-800/40 border border-gray-700/60 text-xs">
                  <div className="flex items-center justify-between text-gray-400 mb-1">
                    <span className="font-semibold text-amber-400">@{n.author || 'admin'}</span>
                    <span className="text-[11px]">{n.date}</span>
                  </div>
                  <p className="text-gray-200">{n.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
