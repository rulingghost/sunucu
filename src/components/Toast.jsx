import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onRemoveToast }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className="toast">
          {toast.type === 'success' && <CheckCircle2 size={18} color="#10b981" />}
          {toast.type === 'warning' && <AlertCircle size={18} color="#f59e0b" />}
          {toast.type === 'info' && <Info size={18} color="var(--accent-cyan)" />}
          
          <div style={{ flexGrow: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{toast.title}</div>
            {toast.message && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                {toast.message}
              </div>
            )}
          </div>

          <button 
            onClick={() => onRemoveToast(toast.id)}
            style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
