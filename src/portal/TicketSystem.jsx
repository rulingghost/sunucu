import React, { useState } from 'react';
import { 
  LifeBuoy, 
  PlusCircle, 
  Send, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  User, 
  ShieldCheck, 
  ArrowLeft,
  X
} from 'lucide-react';

export default function TicketSystem({ tickets, servers, user, onAddTicket, onReplyTicket }) {
  const [selectedTicketId, setSelectedTicketId] = useState(tickets[0]?.id || null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [replyText, setReplyText] = useState('');

  // Form states for new ticket
  const [dept, setDept] = useState('Teknik Destek & Network');
  const [priority, setPriority] = useState('Normal');
  const [relatedServer, setRelatedServer] = useState(servers[0]?.name || 'Genel Soru');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  const filteredTickets = tickets.filter(t => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'open') return t.status !== 'Çözüldü';
    if (filterStatus === 'closed') return t.status === 'Çözüldü';
    return true;
  });

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    onReplyTicket(selectedTicket.id, replyText);
    setReplyText('');
  };

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      return alert('Lütfen konu ve mesaj alanlarını doldurunuz.');
    }

    const newTicket = {
      id: 'TCK-' + Math.floor(1000 + Math.random() * 9000),
      subject,
      department: dept,
      relatedServer,
      priority,
      status: 'Açık',
      createdAt: 'Az önce',
      updatedAt: 'Az önce',
      messages: [
        {
          id: 'msg-' + Date.now(),
          sender: user.name,
          isStaff: false,
          avatar: 'AY',
          time: 'Şimdi',
          text: message
        }
      ]
    };

    onAddTicket(newTicket);
    setSelectedTicketId(newTicket.id);
    setShowNewModal(false);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="portal-content">
      {/* Top action header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>7/24 Kurumsal Destek Masası</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            NOC ağ mühendislerimiz ve sistem uzmanlarımız taleplerinize anında müdahale eder.
          </p>
        </div>

        <button 
          className="btn btn-primary btn-sm"
          onClick={() => setShowNewModal(true)}
        >
          <PlusCircle size={15} />
          <span>Yeni Destek Talebi Aç</span>
        </button>
      </div>

      {/* Main Grid: Left Ticket List, Right Conversation Thread */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '1.75rem' }}>
        
        {/* Left: Ticket Listing */}
        <div>
          {/* Status filters */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
            <button 
              className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('all')}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
            >
              Tüm Talepler ({tickets.length})
            </button>
            <button 
              className={`btn btn-sm ${filterStatus === 'open' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('open')}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
            >
              Açık / Yanıtlananlar
            </button>
            <button 
              className={`btn btn-sm ${filterStatus === 'closed' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('closed')}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
            >
              Çözülenler
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredTickets.map(ticket => (
              <div 
                key={ticket.id} 
                className="ticket-item"
                onClick={() => setSelectedTicketId(ticket.id)}
                style={{
                  borderColor: selectedTicket?.id === ticket.id ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                  background: selectedTicket?.id === ticket.id ? 'rgba(0, 210, 255, 0.08)' : 'var(--bg-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                    #{ticket.id}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    background: ticket.status === 'Çözüldü' ? 'rgba(16,185,129,0.15)' : 
                               ticket.status === 'Yanıtlandı' ? 'rgba(37,99,235,0.2)' : 'rgba(245,158,11,0.15)',
                    color: ticket.status === 'Çözüldü' ? '#10b981' : 
                           ticket.status === 'Yanıtlandı' ? '#38bdf8' : '#f59e0b'
                  }}>
                    {ticket.status}
                  </span>
                </div>

                <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  {ticket.subject}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>{ticket.department}</span>
                  <span>{ticket.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected Ticket Detail & Messages */}
        {selectedTicket ? (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Thread Header */}
            <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      #{selectedTicket.id}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedTicket.department}</span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '0.35rem' }}>
                    {selectedTicket.subject}
                  </h3>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>İlgili Sunucu:</span>
                  <div style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    {selectedTicket.relatedServer}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Flow */}
            <div style={{ flexGrow: 1, maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem', marginBottom: '1.5rem' }}>
              {selectedTicket.messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`chat-bubble ${msg.isStaff ? 'staff' : 'client'}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {msg.isStaff ? (
                        <ShieldCheck size={16} color="var(--accent-cyan)" />
                      ) : (
                        <User size={16} color="#94a3b8" />
                      )}
                      <strong style={{ color: msg.isStaff ? 'var(--accent-cyan)' : '#ffffff', fontSize: '0.85rem' }}>
                        {msg.sender}
                      </strong>
                      {msg.role && (
                        <span style={{ fontSize: '0.7rem', color: '#38bdf8', background: 'rgba(56,189,248,0.15)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                          {msg.role}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{msg.time}</span>
                  </div>

                  <div style={{ color: '#e2e8f0', fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Input Box */}
            <form onSubmit={handleSendReply} style={{ marginTop: 'auto' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <textarea
                  rows="3"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Yanıtınızı buraya yazın..."
                  style={{
                    flexGrow: 1,
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    resize: 'none',
                    outline: 'none'
                  }}
                />
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ padding: '0 1.25rem', height: 'auto' }}
                >
                  <Send size={16} />
                  <span>Gönder</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            Görüntülenecek destek talebi seçilmedi.
          </div>
        )}
      </div>

      {/* NEW TICKET MODAL */}
      {showNewModal && (
        <div className="modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div className="terminal-header" style={{ padding: '1.25rem 1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LifeBuoy size={18} color="var(--accent-cyan)" />
                <span>Yeni Destek Talebi Oluştur</span>
              </h3>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setShowNewModal(false)}
                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Departman
                  </label>
                  <select
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    style={{ width: '100%', background: '#0a0e1c', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem', color: '#ffffff', fontSize: '0.85rem' }}
                  >
                    <option value="Teknik Destek & Network">Teknik Destek & Network</option>
                    <option value="Ağ Güvenliği & DDoS">Ağ Güvenliği & DDoS</option>
                    <option value="Satış & Fatura">Satış & Fatura</option>
                    <option value="Yedekleme & İmaj">Yedekleme & İmaj</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Öncelik Seviyesi
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    style={{ width: '100%', background: '#0a0e1c', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem', color: '#ffffff', fontSize: '0.85rem' }}
                  >
                    <option value="Düşük">Düşük</option>
                    <option value="Normal">Normal</option>
                    <option value="Yüksek">Yüksek</option>
                    <option value="Acil (Sunucu Erişimi Yok)">Acil (Sunucu Erişimi Yok)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  İlgili Sunucunuz
                </label>
                <select
                  value={relatedServer}
                  onChange={(e) => setRelatedServer(e.target.value)}
                  style={{ width: '100%', background: '#0a0e1c', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem', color: '#ffffff', fontSize: '0.85rem' }}
                >
                  <option value="Genel / Sunucu Bağımsız">Genel / Sunucu Bağımsız</option>
                  {servers.map(s => (
                    <option key={s.id} value={`${s.name} (${s.ip})`}>
                      {s.name} - {s.ip} ({s.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Konu Başlığı
                </label>
                <input
                  type="text"
                  placeholder="Örn: Port 443 BGP kuralı ekleme talebi..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem', color: '#ffffff', fontSize: '0.85rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Detaylı Açıklama
                </label>
                <textarea
                  rows="4"
                  placeholder="Yaşadığınız durum veya teknik isteğiniz hakkında ayrıntılı bilgi veriniz..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem', color: '#ffffff', fontSize: '0.85rem', resize: 'vertical' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => setShowNewModal(false)}
                >
                  İptal
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <span>Destek Talebini Aç</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
