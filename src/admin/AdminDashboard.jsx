import React, { useState, useEffect } from 'react';
import {
  Users,
  ShoppingCart,
  DollarSign,
  LifeBuoy,
  TrendingUp,
  FileText,
  CreditCard,
  ArrowUpRight,
  Server,
  Plus,
  RefreshCw,
  Eye,
  ChevronRight,
  Activity,
  AlertCircle
} from 'lucide-react';
import { adminDataService } from '../services/adminDataService.js';
import './admin-dashboard.css';

function orderBadgeClass(status) {
  if (status === 'Tamamlandı') return 'ok';
  if (status === 'Ödeme Bekliyor' || status === 'Yeni') return 'warn';
  return 'info';
}

function ticketBadgeClass(status) {
  if (status === 'Yeni' || status === 'Yönetici Yanıtı Bekleniyor') return 'danger';
  if (status === 'Müşteri Yanıtı Bekleniyor') return 'warn';
  return 'ok';
}

export default function AdminDashboard({ navigate }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    const data = adminDataService.getDashboardMetrics();
    setMetrics(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="ad-dash-loading">
        <RefreshCw size={28} className="ad-dash-spin" />
        <span>Dashboard verileri yükleniyor...</span>
      </div>
    );
  }

  const {
    totalCustomers,
    newCustomersCount,
    totalOrders,
    pendingOrdersCount,
    processingOrdersCount,
    completedOrdersCount,
    totalRevenue,
    dailyRevenue,
    weeklyRevenue,
    monthlyRevenue,
    pendingPaymentsCount,
    paidInvoicesCount,
    unpaidInvoicesCount,
    openTicketsCount,
    newTicketsCount,
    recentOrders,
    recentTickets,
    recentCustomers,
    recentPayments
  } = metrics;

  return (
    <div className="ad-dash">
      <div className="ad-dash-hero">
        <div>
          <div className="ad-dash-kicker">
            <Activity size={16} />
            Sistem Operasyon Paneli
          </div>
          <h1 className="ad-dash-title">
            Hoş Geldiniz, <em>Yönetici</em>
          </h1>
          <p className="ad-dash-sub">
            NovaQ Cloud & Dedicated Altyapısı gerçek zamanlı performans ve finansal özet.
          </p>
        </div>

        <div className="ad-dash-actions">
          <button type="button" className="ad-dash-btn ad-dash-btn-icon" onClick={loadData} title="Verileri Yenile">
            <RefreshCw size={16} />
          </button>
          <button type="button" className="ad-dash-btn" onClick={() => navigate('/yonetici/musteriler')}>
            <Plus size={16} color="#22d3ee" />
            Yeni Müşteri
          </button>
          <button type="button" className="ad-dash-btn" onClick={() => navigate('/yonetici/faturalar')}>
            <FileText size={16} color="#34d399" />
            Fatura Kes
          </button>
          <button type="button" className="ad-dash-btn ad-dash-btn-primary" onClick={() => navigate('/yonetici/urunler/yeni')}>
            <Server size={16} />
            Yeni Paket Ekle
          </button>
        </div>
      </div>

      <div className="ad-dash-metrics">
        <div className="ad-dash-card">
          <div className="ad-dash-card-glow cyan" />
          <div className="ad-dash-card-head">
            <span className="ad-dash-label">Toplam Satış (Ciro)</span>
            <div className="ad-dash-ico cyan"><DollarSign size={20} /></div>
          </div>
          <div className="ad-dash-value">
            ${(totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="ad-dash-meta">
            <span className="ok" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <ArrowUpRight size={14} />
              Bu Ay: ${(monthlyRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="sep">|</span>
            <span className="muted">Bugün: ${dailyRevenue}</span>
          </div>
        </div>

        <div className="ad-dash-card">
          <div className="ad-dash-card-glow blue" />
          <div className="ad-dash-card-head">
            <span className="ad-dash-label">Toplam Siparişler</span>
            <div className="ad-dash-ico blue"><ShoppingCart size={20} /></div>
          </div>
          <div className="ad-dash-value">
            {totalOrders} <span>adet</span>
          </div>
          <div className="ad-dash-meta">
            <span className="warn">{pendingOrdersCount} Bekleyen</span>
            <span className="info">{processingOrdersCount} İşlemde</span>
            <span className="ok">{completedOrdersCount} Aktif</span>
          </div>
        </div>

        <div className="ad-dash-card">
          <div className="ad-dash-card-glow purple" />
          <div className="ad-dash-card-head">
            <span className="ad-dash-label">Müşteriler</span>
            <div className="ad-dash-ico purple"><Users size={20} /></div>
          </div>
          <div className="ad-dash-value">
            {totalCustomers} <span>kayıtlı</span>
          </div>
          <div className="ad-dash-meta">
            <span className="ok">+{newCustomersCount} Yeni Bu Hafta</span>
            <span className="sep">|</span>
            <span style={{ color: '#c084fc' }}>Enterprise VIP</span>
          </div>
        </div>

        <div className="ad-dash-card">
          <div className="ad-dash-card-glow amber" />
          <div className="ad-dash-card-head">
            <span className="ad-dash-label">Destek / Ticket</span>
            <div className="ad-dash-ico amber"><LifeBuoy size={20} /></div>
          </div>
          <div className="ad-dash-value">
            {openTicketsCount} <span>açık talep</span>
          </div>
          <div className="ad-dash-meta">
            {newTicketsCount > 0 ? (
              <span className="danger">
                <AlertCircle size={14} />
                {newTicketsCount} Yeni Yanıt Bekleyen!
              </span>
            ) : (
              <span className="muted">Tüm talepler yanıtlandı</span>
            )}
          </div>
        </div>
      </div>

      <div className="ad-dash-thirds">
        <div className="ad-dash-card">
          <div className="ad-dash-panel-head">
            <strong><TrendingUp size={16} color="#22d3ee" /> Periyodik Gelir Analizi</strong>
            <span style={{ color: '#22d3ee' }}>Haftalık: ${weeklyRevenue}</span>
          </div>
          <div className="ad-dash-bars">
            <div>
              <div className="ad-dash-bar-row">
                <span>Günlük Ciro</span>
                <b>${dailyRevenue}</b>
              </div>
              <div className="ad-dash-bar cyan"><i style={{ width: '45%' }} /></div>
            </div>
            <div>
              <div className="ad-dash-bar-row">
                <span>Haftalık Ciro</span>
                <b>${weeklyRevenue}</b>
              </div>
              <div className="ad-dash-bar blue"><i style={{ width: '70%' }} /></div>
            </div>
            <div>
              <div className="ad-dash-bar-row">
                <span>Aylık Hedef (%82)</span>
                <b>${monthlyRevenue}</b>
              </div>
              <div className="ad-dash-bar purple"><i style={{ width: '82%' }} /></div>
            </div>
          </div>
        </div>

        <div className="ad-dash-card">
          <div className="ad-dash-panel-head">
            <strong><FileText size={16} color="#34d399" /> Fatura ve Tahsilat Durumu</strong>
            <span style={{ color: '#34d399' }}>{paidInvoicesCount} Ödendi</span>
          </div>
          <div className="ad-dash-mini-grid">
            <div className="ad-dash-mini">
              <small>Ödenmiş Faturalar</small>
              <b className="ok">{paidInvoicesCount}</b>
              <em>Düzenli tahsil edildi</em>
            </div>
            <div className="ad-dash-mini">
              <small>Bekleyen / Ödenmemiş</small>
              <b className="warn">{unpaidInvoicesCount}</b>
              <em>Vade bekleniyor</em>
            </div>
          </div>
          <div className="ad-dash-panel-head" style={{ marginBottom: 0, marginTop: '0.85rem' }}>
            <span>Bekleyen Tahsilat İşlemi:</span>
            <span className="warn">{pendingPaymentsCount} İşlem</span>
          </div>
        </div>

        <div className="ad-dash-card">
          <div className="ad-dash-panel-head">
            <strong><Server size={16} color="#22d3ee" /> Sipariş Akış Dağılımı</strong>
            <span style={{ color: '#22d3ee' }}>{totalOrders} Toplam</span>
          </div>
          <div className="ad-dash-flow">
            <div className="ad-dash-flow-row">
              <span><span className="ad-dash-dot amber" /> Ödeme / Onay Bekleyen</span>
              <b className="warn">{pendingOrdersCount}</b>
            </div>
            <div className="ad-dash-flow-row">
              <span><span className="ad-dash-dot blue" /> Kurulum / İşleme Alınan</span>
              <b className="info">{processingOrdersCount}</b>
            </div>
            <div className="ad-dash-flow-row">
              <span><span className="ad-dash-dot ok" /> Tamamlanan / Aktif</span>
              <b className="ok">{completedOrdersCount}</b>
            </div>
          </div>
        </div>
      </div>

      <div className="ad-dash-halves">
        <div className="ad-dash-card">
          <div className="ad-dash-section-head">
            <div>
              <h2><ShoppingCart size={18} color="#22d3ee" /> Son Siparişler</h2>
              <p>En son sisteme düşen müşteri siparişleri</p>
            </div>
            <button type="button" className="ad-dash-link" onClick={() => navigate('/yonetici/siparisler')}>
              Tümünü Gör <ChevronRight size={16} />
            </button>
          </div>
          <div className="ad-dash-table-wrap">
            <table className="ad-dash-table">
              <thead>
                <tr>
                  <th>Sipariş No</th>
                  <th>Müşteri</th>
                  <th>Paket</th>
                  <th>Tutar</th>
                  <th>Durum</th>
                  <th className="ad-dash-right">Detay</th>
                </tr>
              </thead>
              <tbody>
                {(recentOrders || []).map((ord) => (
                  <tr key={ord.id || ord.orderId}>
                    <td className="ad-dash-mono">{ord.id || ord.orderId}</td>
                    <td>{ord.customerName}</td>
                    <td>{ord.planName}</td>
                    <td style={{ color: '#fff', fontWeight: 700 }}>${ord.total}</td>
                    <td>
                      <span className={`ad-dash-badge ${orderBadgeClass(ord.status)}`}>{ord.status}</span>
                    </td>
                    <td className="ad-dash-right">
                      <button
                        type="button"
                        className="ad-dash-icon-btn"
                        title="Sipariş İncele"
                        onClick={() => navigate(`/yonetici/siparisler/${ord.id || ord.orderId}`)}
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ad-dash-card">
          <div className="ad-dash-section-head">
            <div>
              <h2><LifeBuoy size={18} color="#fbbf24" /> Son Destek Talepleri</h2>
              <p>Müşteri paneli ile anlık senkronize mesajlar</p>
            </div>
            <button type="button" className="ad-dash-link amber" onClick={() => navigate('/yonetici/ticketlar')}>
              Tümünü Gör <ChevronRight size={16} />
            </button>
          </div>
          <div className="ad-dash-list">
            {(recentTickets || []).map((tck) => (
              <div
                key={tck.id}
                className="ad-dash-item"
                onClick={() => navigate(`/yonetici/ticketlar/${tck.id}`)}
              >
                <div className="ad-dash-item-top">
                  <div className="ad-dash-item-top-left">
                    <span className="ad-dash-mono" style={{ color: '#22d3ee' }}>{tck.id}</span>
                    <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{tck.customerName}</span>
                    <span className="ad-dash-chip">{tck.category}</span>
                  </div>
                  <span className={`ad-dash-badge ${ticketBadgeClass(tck.status)}`}>{tck.status}</span>
                </div>
                <div className="ad-dash-item-title">{tck.subject}</div>
                <div className="ad-dash-item-foot">
                  <span>
                    Son mesaj: {tck.messages?.[tck.messages.length - 1]?.text || 'Giriş kaydı'}
                  </span>
                  <span>{tck.updatedAt || tck.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ad-dash-halves">
        <div className="ad-dash-card">
          <div className="ad-dash-section-head">
            <div>
              <h2><Users size={18} color="#c084fc" /> Son Müşteriler</h2>
              <p>Sisteme en son kaydolan kurumsal ve bireysel hesaplar</p>
            </div>
            <button type="button" className="ad-dash-link purple" onClick={() => navigate('/yonetici/musteriler')}>
              Müşteri Yönetimi <ChevronRight size={16} />
            </button>
          </div>
          <div className="ad-dash-list">
            {(recentCustomers || []).map((cust) => (
              <div
                key={cust.id}
                className="ad-dash-item ad-dash-person"
                onClick={() => navigate(`/yonetici/musteriler/${cust.id}`)}
              >
                <div className="ad-dash-person-left">
                  <div className="ad-dash-avatar">{(cust.name || '?').charAt(0)}</div>
                  <div>
                    <div className="ad-dash-person-name">{cust.name}</div>
                    <div className="ad-dash-person-sub">{cust.company || cust.email}</div>
                  </div>
                </div>
                <div className="ad-dash-person-right">
                  <b>${cust.totalSpent || 0}</b>
                  <span>{cust.orderCount || 0} Sipariş</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ad-dash-card">
          <div className="ad-dash-section-head">
            <div>
              <h2><CreditCard size={18} color="#34d399" /> Son Ödemeler & Tahsilatlar</h2>
              <p>3D Secure ve kurumsal transfer logları</p>
            </div>
            <button type="button" className="ad-dash-link ok" onClick={() => navigate('/yonetici/odemeler')}>
              Tüm Ödemeler <ChevronRight size={16} />
            </button>
          </div>
          <div className="ad-dash-list">
            {(recentPayments || []).map((pay) => (
              <div key={pay.id} className="ad-dash-item ad-dash-person" style={{ cursor: 'default' }}>
                <div>
                  <div className="ad-dash-pay-amt">
                    <span>${pay.amount}</span>
                    <span className="ad-dash-chip">{pay.currency}</span>
                  </div>
                  <div className="ad-dash-person-sub" style={{ marginTop: 4 }}>
                    {pay.customerName} • {pay.method}
                  </div>
                </div>
                <div className="ad-dash-person-right">
                  <span className="ad-dash-badge ok">{pay.status}</span>
                  <span style={{ display: 'block', marginTop: 4 }}>{pay.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
