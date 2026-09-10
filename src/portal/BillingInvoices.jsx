import React, { useState } from 'react';
import { 
  CreditCard, 
  Wallet, 
  FileText, 
  Download, 
  Printer, 
  CheckCircle, 
  Clock, 
  X, 
  ArrowRight,
  ShieldCheck,
  UploadCloud,
  Paperclip
} from 'lucide-react';
import { vercelDbService } from '../services/vercelDbService';

export default function BillingInvoices({ invoices, user, onPayInvoice, onAddBalance }) {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showAddBalanceModal, setShowAddBalanceModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState(50);
  const [depositMethod, setDepositMethod] = useState('card');
  const [uploadingInvId, setUploadingInvId] = useState(null);

  const handleUploadReceipt = async (invId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingInvId(invId);
      const blob = await vercelDbService.uploadFile(file, `dekont-${invId}-${file.name}`, 'receipt');
      onPayInvoice(invId, blob.url);
    } catch (err) {
      alert('Dekont yüklenirken hata oluştu: ' + err.message);
    } finally {
      setUploadingInvId(null);
      e.target.value = '';
    }
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    if (depositAmount <= 0) return;
    onAddBalance(Number(depositAmount));
    setShowAddBalanceModal(false);
  };

  return (
    <div className="portal-content">
      {/* Top Balance Card */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(14, 25, 48, 0.9) 0%, rgba(10, 16, 30, 0.95) 100%)',
          border: '1px solid rgba(0, 210, 255, 0.3)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mevcut Kredi Bakiyesi</span>
            <Wallet size={20} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', margin: '0.5rem 0' }}>
            ${user.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </div>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddBalanceModal(true)}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            <span>+ Bakiye Yükle (3D Secure)</span>
          </button>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Bekleyen Faturalar</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.2rem', fontWeight: 800, color: '#f59e0b', margin: '0.5rem 0' }}>
            ${invoices.filter(i => i.status === 'Beklemede').reduce((acc, curr) => acc + curr.total, 0).toLocaleString('tr-TR')}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {invoices.filter(i => i.status === 'Beklemede').length} Adet ödeme bekleyen fatura
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Kurumsal Fatura Bilgileri</div>
          <div style={{ fontWeight: 700, color: '#ffffff', marginTop: '0.5rem', fontSize: '0.95rem' }}>{user.company}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Vergi Dairesi: Maslak V.D. • VN: 9481028491
          </div>
        </div>
      </div>

      {/* Invoices Table Card */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '1.75rem'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Geçmiş ve Aktif Faturalarınız
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Fatura No</th>
                <th style={{ padding: '0.75rem 1rem' }}>Fatura Tarihi</th>
                <th style={{ padding: '0.75rem 1rem' }}>Son Ödeme</th>
                <th style={{ padding: '0.75rem 1rem' }}>Ödeme Tarihi & Yöntemi</th>
                <th style={{ padding: '0.75rem 1rem' }}>Tutar</th>
                <th style={{ padding: '0.75rem 1rem' }}>Durum</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr 
                  key={inv.id} 
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', color: '#cbd5e1' }}
                >
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                    {inv.id}
                  </td>
                  <td style={{ padding: '1rem' }}>{inv.date}</td>
                  <td style={{ padding: '1rem' }}>{inv.dueDate}</td>
                  <td style={{ padding: '1rem', fontSize: '0.8rem' }}>
                    {inv.status === 'Ödendi' ? (
                      <div>
                        <div style={{ color: '#10b981', fontWeight: 600 }}>{inv.paidAt || inv.date}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{inv.paymentMethod}</div>
                      </div>
                    ) : (
                      <span style={{ color: '#f59e0b' }}>Ödeme Bekleniyor</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ffffff' }}>
                    ${inv.total.toLocaleString('tr-TR')}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: inv.status === 'Ödendi' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                      color: inv.status === 'Ödendi' ? '#10b981' : '#f59e0b'
                    }}>
                      {inv.status === 'Ödendi' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      <span>{inv.status}</span>
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedInvoice(inv)}
                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                      >
                        <FileText size={13} />
                        <span>Fatura Görüntüle</span>
                      </button>

                      {inv.status === 'Beklemede' && (
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => onPayInvoice(inv.id, null)}
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                          >
                            <span>Bakiyeden Öde</span>
                          </button>
                          <label
                            className="btn btn-secondary btn-sm"
                            style={{ 
                              fontSize: '0.75rem', 
                              padding: '0.35rem 0.65rem',
                              cursor: uploadingInvId === inv.id ? 'wait' : 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              whiteSpace: 'nowrap'
                            }}
                            title="Vercel Blob üzerine havale dekontu yükleyin"
                          >
                            <UploadCloud size={12} />
                            <span>{uploadingInvId === inv.id ? 'Yükleniyor...' : 'Dekont Yükle'}</span>
                            <input 
                              type="file" 
                              style={{ display: 'none' }}
                              accept="image/*,.pdf"
                              disabled={uploadingInvId === inv.id}
                              onChange={(e) => handleUploadReceipt(inv.id, e)}
                            />
                          </label>
                        </div>
                      )}

                      {inv.receiptUrl && (
                        <a
                          href={inv.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.7rem',
                            color: '#38bdf8',
                            background: 'rgba(56, 189, 248, 0.12)',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '6px',
                            textDecoration: 'none'
                          }}
                        >
                          <Paperclip size={10} />
                          <span>Dekont (Blob)</span>
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF-STYLE INVOICE PREVIEW MODAL */}
      {selectedInvoice && (
        <div className="modal-overlay" onClick={() => setSelectedInvoice(null)}>
          <div 
            className="modal-card" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '750px', background: '#ffffff', color: '#1e293b' }}
          >
            {/* Modal action bar */}
            <div style={{ background: '#0f172a', padding: '0.85rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 600 }}>
                Fatura Önizleme - {selectedInvoice.id}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => window.print()}
                  style={{ fontSize: '0.75rem' }}
                >
                  <Printer size={13} />
                  <span>Yazdır / PDF Kaydet</span>
                </button>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => setSelectedInvoice(null)}
                  style={{ borderRadius: '50%', width: '28px', height: '28px', padding: 0 }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Printable Paper Area */}
            <div style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e2e8f0', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <img src="/assets/novaq-logo.png" alt="NovaQ Servers" style={{ height: '48px' }} />
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
                    NovaQ Servers Bilişim Hizmetleri A.Ş.<br />
                    Büyükdere Cad. No: 194 Levent / İstanbul<br />
                    Mersis: 062910482019001
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>E-FATURA</h2>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#2563eb' }}>{selectedInvoice.id}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.35rem' }}>
                    Tarih: {selectedInvoice.date}<br />
                    Vade: {selectedInvoice.dueDate}
                  </div>
                  <div style={{
                    display: 'inline-block',
                    marginTop: '0.5rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    background: selectedInvoice.status === 'Ödendi' ? '#dcfce7' : '#fef3c7',
                    color: selectedInvoice.status === 'Ödendi' ? '#15803d' : '#b45309'
                  }}>
                    DURUM: {selectedInvoice.status.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Bill To */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Sayın Müşteri:</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{user.company}</div>
                <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                  Yetkili: {user.name} ({user.customerId})<br />
                  E-posta: {user.email}
                </div>
              </div>

              {/* Line Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '0.75rem' }}>Hizmet Açıklaması</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem', color: '#1e293b' }}>{item.desc}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>
                        ${item.amount.toLocaleString('tr-TR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '260px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                    <span>Ara Toplam:</span>
                    <span style={{ fontWeight: 600 }}>${selectedInvoice.subtotal.toLocaleString('tr-TR')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                    <span>KDV (%20):</span>
                    <span style={{ fontWeight: 600 }}>${selectedInvoice.vat.toLocaleString('tr-TR')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #0f172a', paddingTop: '0.5rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                    <span>GENEL TOPLAM:</span>
                    <span>${selectedInvoice.total.toLocaleString('tr-TR')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BALANCE TOP-UP MODAL */}
      {showAddBalanceModal && (
        <div className="modal-overlay" onClick={() => setShowAddBalanceModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="terminal-header" style={{ padding: '1.25rem 1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wallet size={18} color="var(--accent-cyan)" />
                <span>Hesaba Kredi Bakiyesi Yükle</span>
              </h3>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setShowAddBalanceModal(false)}
                style={{ borderRadius: '50%', width: '30px', height: '30px', padding: 0 }}
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Yüklenecek Tutar ($ USD)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {[25, 50, 100, 250].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      style={{
                        background: depositAmount === amt ? 'var(--grad-primary)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${depositAmount === amt ? 'transparent' : 'var(--border-subtle)'}`,
                        borderRadius: '8px',
                        padding: '0.5rem',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      ${amt.toLocaleString('tr-TR')}
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem 1rem', color: '#ffffff', fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700 }}
                  min="10"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Ödeme Yöntemi
                </label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div 
                    onClick={() => setDepositMethod('card')}
                    style={{
                      flexGrow: 1,
                      background: depositMethod === 'card' ? 'rgba(0, 210, 255, 0.12)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${depositMethod === 'card' ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                      borderRadius: '10px',
                      padding: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem'
                    }}
                  >
                    <CreditCard size={18} color="var(--accent-cyan)" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#ffffff' }}>Kredi Kartı (3D Secure)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Anında Otomatik Tanımlanır</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '0.65rem 1rem', borderRadius: '8px' }}>
                <ShieldCheck size={16} />
                <span>256-Bit SSL ve PCI-DSS Banka Güvenlik Seviyesi</span>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem' }}>
                <span>${(Number(depositAmount) || 0).toLocaleString('tr-TR')} Bakiyeyi Hesaba Yükle</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
