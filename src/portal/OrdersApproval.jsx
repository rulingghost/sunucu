import React, { useState } from 'react';
import { 
  PackageCheck, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Server, 
  Cpu, 
  ArrowRight, 
  ShieldCheck, 
  Play, 
  Terminal 
} from 'lucide-react';

export default function OrdersApproval({ orders, onApproveOrder, onGoToServer }) {
  const [approvingOrderId, setApprovingOrderId] = useState(null);

  const handleApprove = (orderId) => {
    setApprovingOrderId(orderId);
    setTimeout(() => {
      onApproveOrder(orderId);
      setApprovingOrderId(null);
    }, 1500);
  };

  return (
    <div className="portal-content">
      {/* Overview Notice */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14, 25, 48, 0.9) 0%, rgba(10, 16, 30, 0.95) 100%)',
        border: '1px solid rgba(0, 210, 255, 0.3)',
        borderRadius: '16px',
        padding: '1.75rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <PackageCheck size={24} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Siparişler & Kurulum Aktivasyon Takibi</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
            Ödemesi tamamlanan sunucularınızın veri merkezi orkestrasyonu, donanım tahsisi ve yönetim onay durumunu buradan izleyebilirsiniz.
          </p>
        </div>

        <div style={{ background: 'rgba(0, 210, 255, 0.1)', border: '1px solid rgba(0, 210, 255, 0.25)', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
          ✓ Otomatik Altyapı API & KVM Hypervisor Entegrasyonu
        </div>
      </div>

      {/* Orders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {orders.map(order => {
          const isPending = order.provisionStatus === 'pending_approval';
          const isApproving = approvingOrderId === order.orderId;

          return (
            <div 
              key={order.orderId}
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${isPending ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-subtle)'}`,
                borderRadius: '16px',
                padding: '1.75rem',
                transition: 'all 0.3s ease',
                boxShadow: isPending ? '0 0 25px -5px rgba(245, 158, 11, 0.15)' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span style={{ fontSize: '1.6rem' }}>{order.flag}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                        #{order.orderId}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>• {order.date}</span>
                    </div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginTop: '0.2rem' }}>
                      {order.planName}
                    </h4>
                  </div>
                </div>

                {/* Status Badges */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    ✓ {order.paymentStatus}
                  </span>

                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    background: isPending ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0, 210, 255, 0.15)',
                    color: isPending ? '#f59e0b' : 'var(--accent-cyan)',
                    border: `1px solid ${isPending ? 'rgba(245, 158, 11, 0.3)' : 'rgba(0, 210, 255, 0.3)'}`
                  }}>
                    {isPending ? '⏳ Kurulum & Yönetim Onayı Bekleniyor' : '✓ Kuruldu & Çevrimiçi'}
                  </span>
                </div>
              </div>

              {/* Order Meta details */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                background: 'rgba(10, 15, 26, 0.6)',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                marginBottom: '1.25rem'
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Lokasyon:</span>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>{order.location}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>İşletim Sistemi:</span>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>{order.os}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Faturalandırma:</span>
                  <div style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{order.cycleLabel}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Ödenen Tutar:</span>
                  <div style={{ fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>${order.total.toLocaleString('tr-TR')}</div>
                </div>
              </div>

              {/* Action Box based on Status */}
              {isPending ? (
                <div style={{
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <strong style={{ color: '#f59e0b', fontSize: '0.9rem', display: 'block' }}>
                      Ödeme Alındı - Yönetim Paneli Kurulum Sırasında
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Yönetici onayından sonra sunucunuzun IP adresi tahsis edilir ve "Sunucularım" listenizde aktif olarak görünür.
                    </span>
                  </div>

                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleApprove(order.orderId)}
                    disabled={isApproving}
                    style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
                  >
                    <Play size={14} />
                    <span>{isApproving ? 'Orkestrasyon Kuruluyor...' : 'Yönetim Olarak Kurulumu Onayla'}</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => onGoToServer(order.assignedServerId || 'srv-fra-101')}
                  >
                    <Server size={14} />
                    <span>Aktif Sunucu Yönetimine Git</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
