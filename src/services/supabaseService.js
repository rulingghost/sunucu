import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { 
  INITIAL_USER, 
  INITIAL_SERVERS, 
  INITIAL_ORDERS, 
  INITIAL_TICKETS, 
  INITIAL_INVOICES, 
  AUDIT_LOGS 
} from '../data/mockPortalData';

// Yerel bellek durumu (Supabase bağlanana kadar demo verilerini canlı tutar)
let localUser = { ...INITIAL_USER };
let localServers = [...INITIAL_SERVERS];
let localOrders = [...INITIAL_ORDERS];
let localTickets = [...INITIAL_TICKETS];
let localInvoices = [...INITIAL_INVOICES];
let localLogs = [...AUDIT_LOGS];

// ==========================================
// 1. KİMLİK DOĞRULAMA (AUTH) SERVİSLERİ
// ==========================================

export const authService = {
  isConfigured: () => isSupabaseConfigured,

  async getSession() {
    if (!isSupabaseConfigured) {
      return { data: { session: { user: { id: 'mock-user-1', email: localUser.email } } }, error: null };
    }
    return await supabase.auth.getSession();
  },

  async getUser() {
    if (!isSupabaseConfigured) {
      return { data: { user: { id: 'mock-user-1', email: localUser.email, user_metadata: { full_name: localUser.name } } }, error: null };
    }
    return await supabase.auth.getUser();
  },

  async signIn(email, password) {
    if (!isSupabaseConfigured) {
      localUser.email = email;
      return { data: { user: { id: 'mock-user-1', email }, session: { access_token: 'demo-token' } }, error: null };
    }
    return await supabase.auth.signInWithPassword({ email, password });
  },

  async signUp(email, password, fullName = '', company = '') {
    if (!isSupabaseConfigured) {
      localUser.email = email;
      if (fullName) localUser.name = fullName;
      if (company) localUser.company = company;
      return { data: { user: { id: 'mock-user-1', email }, session: null }, error: null };
    }
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company: company
        }
      }
    });
  },

  async signOut() {
    if (!isSupabaseConfigured) {
      return { error: null };
    }
    return await supabase.auth.signOut();
  },

  onAuthStateChange(callback) {
    if (!isSupabaseConfigured) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange(callback);
  }
};

// ==========================================
// 2. MÜŞTERİ PROFİLİ SERVİSİ
// ==========================================

export const profileService = {
  async getProfile(userId) {
    if (!isSupabaseConfigured) {
      return { data: localUser, error: null };
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return { data: localUser, error };
    }

    return {
      data: {
        name: data.full_name || localUser.name,
        company: data.company || localUser.company,
        email: data.email || localUser.email,
        phone: data.phone || localUser.phone,
        customerId: data.customer_id || localUser.customerId,
        tier: data.tier || localUser.tier,
        balance: Number(data.balance ?? localUser.balance),
        twoFactorEnabled: Boolean(data.two_factor_enabled),
        taxOffice: data.tax_office || localUser.taxOffice,
        taxNumber: data.tax_number || localUser.taxNumber,
        address: data.address || localUser.address,
        city: data.city || localUser.city,
        country: data.country || localUser.country,
        registeredAt: data.created_at ? new Date(data.created_at).toLocaleDateString('tr-TR') : localUser.registeredAt
      },
      error: null
    };
  },

  async updateProfile(userId, updates) {
    if (!isSupabaseConfigured) {
      localUser = { ...localUser, ...updates };
      return { data: localUser, error: null };
    }
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: updates.name,
        company: updates.company,
        phone: updates.phone,
        tax_office: updates.taxOffice,
        tax_number: updates.taxNumber,
        address: updates.address,
        city: updates.city,
        two_factor_enabled: updates.twoFactorEnabled,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  },

  async updateBalance(userId, newBalance) {
    if (!isSupabaseConfigured) {
      localUser.balance = newBalance;
      return { data: localUser, error: null };
    }
    return await supabase
      .from('profiles')
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('id', userId);
  }
};

// ==========================================
// 3. SUNUCULAR SERVİSİ
// ==========================================

export const serverService = {
  async getServers(userId) {
    if (!isSupabaseConfigured) {
      return { data: localServers, error: null };
    }
    const { data, error } = await supabase
      .from('servers')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return { data: localServers, error };
    }

    const mapped = data.map(s => ({
      id: s.id,
      name: s.name,
      hostname: s.hostname,
      planName: s.plan_name,
      category: s.category,
      status: s.status,
      location: s.location,
      flag: s.flag,
      ip: s.ip,
      gateway: s.gateway,
      netmask: s.netmask,
      rdns: s.rdns,
      os: s.os,
      cores: s.cores,
      ram: s.ram,
      disk: s.disk,
      diskUsed: s.disk_used,
      bandwidthTotal: s.bandwidth_total,
      bandwidthUsedMonth: s.bandwidth_used_month,
      uptime: s.uptime,
      purchasedAt: s.purchased_at,
      renewalDate: s.renewal_date,
      billingCycle: s.billing_cycle,
      daysRemaining: s.days_remaining,
      priceMonthly: Number(s.price_monthly),
      metrics: s.metrics || { cpuHistory: [20, 25], ramHistory: [50, 52], diskIOHistory: [15, 20], netMbps: [100, 120] },
      snapshots: s.snapshots || []
    }));

    return { data: mapped, error: null };
  },

  async updateStatus(serverId, newStatus) {
    if (!isSupabaseConfigured) {
      localServers = localServers.map(s => s.id === serverId ? { ...s, status: newStatus } : s);
      return { error: null };
    }
    return await supabase.from('servers').update({ status: newStatus }).eq('id', serverId);
  },

  async updateRdns(serverId, newRdns) {
    if (!isSupabaseConfigured) {
      localServers = localServers.map(s => s.id === serverId ? { ...s, rdns: newRdns } : s);
      return { error: null };
    }
    return await supabase.from('servers').update({ rdns: newRdns }).eq('id', serverId);
  },

  async addSnapshot(serverId, snapshot) {
    if (!isSupabaseConfigured) {
      localServers = localServers.map(s => s.id === serverId ? { ...s, snapshots: [snapshot, ...(s.snapshots || [])] } : s);
      return { error: null };
    }
    // Supabase'den mevcut snapshots al ve ekle
    const { data } = await supabase.from('servers').select('snapshots').eq('id', serverId).single();
    const list = data?.snapshots || [];
    return await supabase.from('servers').update({ snapshots: [snapshot, ...list] }).eq('id', serverId);
  }
};

// ==========================================
// 4. SİPARİŞLER SERVİSİ
// ==========================================

export const orderService = {
  async getOrders(userId) {
    if (!isSupabaseConfigured) {
      return { data: localOrders, error: null };
    }
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return { data: localOrders, error };
    }

    const mapped = data.map(o => ({
      orderId: o.order_id,
      date: o.date,
      planName: o.plan_name,
      location: o.location,
      flag: o.flag,
      os: o.os,
      cycleLabel: o.cycle_label,
      total: Number(o.total),
      paymentStatus: o.payment_status,
      provisionStatus: o.provision_status,
      targetServerTemplate: o.target_server_template,
      assignedServerId: o.assigned_server_id
    }));

    return { data: mapped, error: null };
  },

  async createOrder(userId, order) {
    if (!isSupabaseConfigured) {
      localOrders = [order, ...localOrders];
      return { data: order, error: null };
    }
    const { data, error } = await supabase.from('orders').insert({
      order_id: order.orderId,
      user_id: userId,
      date: order.date,
      plan_name: order.planName,
      location: order.location,
      flag: order.flag,
      os: order.os,
      cycle_label: order.cycleLabel,
      total: order.total,
      payment_status: order.paymentStatus,
      provision_status: order.provisionStatus,
      target_server_template: order.targetServerTemplate
    }).select().single();

    return { data, error };
  },

  async approveOrder(orderId, assignedServerId) {
    if (!isSupabaseConfigured) {
      localOrders = localOrders.map(o => o.orderId === orderId ? { ...o, provisionStatus: 'approved', assignedServerId } : o);
      return { error: null };
    }
    return await supabase.from('orders').update({
      provision_status: 'approved',
      assigned_server_id: assignedServerId
    }).eq('order_id', orderId);
  }
};

// ==========================================
// 5. DESTEK BİLETLERİ (TICKETS) SERVİSİ
// ==========================================

export const ticketService = {
  async getTickets(userId) {
    if (!isSupabaseConfigured) {
      return { data: localTickets, error: null };
    }
    const { data, error } = await supabase
      .from('tickets')
      .select('*, ticket_messages(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return { data: localTickets, error };
    }

    const mapped = data.map(t => ({
      id: t.id,
      subject: t.subject,
      department: t.department,
      relatedServer: t.related_server,
      priority: t.priority,
      status: t.status,
      createdAt: t.created_at ? new Date(t.created_at).toLocaleString('tr-TR') : 'Bugün',
      updatedAt: t.updated_at ? new Date(t.updated_at).toLocaleString('tr-TR') : 'Bugün',
      messages: (t.ticket_messages || []).map(m => ({
        id: m.id,
        sender: m.sender_name,
        isStaff: m.is_staff,
        role: m.role,
        avatar: m.avatar,
        time: m.time,
        text: m.message
      }))
    }));

    return { data: mapped, error: null };
  },

  async createTicket(userId, ticket) {
    if (!isSupabaseConfigured) {
      localTickets = [ticket, ...localTickets];
      return { data: ticket, error: null };
    }
    // Bilet oluştur
    const { data: tData, error: tErr } = await supabase.from('tickets').insert({
      id: ticket.id,
      user_id: userId,
      subject: ticket.subject,
      department: ticket.department,
      related_server: ticket.relatedServer,
      priority: ticket.priority,
      status: ticket.status
    }).select().single();

    if (tErr) return { error: tErr };

    // İlk mesajı ekle
    if (ticket.messages && ticket.messages.length > 0) {
      const msg = ticket.messages[0];
      await supabase.from('ticket_messages').insert({
        id: msg.id,
        ticket_id: ticket.id,
        sender_name: msg.sender,
        is_staff: false,
        role: 'Müşteri',
        avatar: msg.avatar,
        time: msg.time,
        message: msg.text
      });
    }

    return { data: tData, error: null };
  },

  async addMessage(ticketId, message) {
    if (!isSupabaseConfigured) {
      localTickets = localTickets.map(t => t.id === ticketId ? { ...t, status: 'Müşteri Yanıtı', messages: [...t.messages, message] } : t);
      return { error: null };
    }
    const { data, error } = await supabase.from('ticket_messages').insert({
      id: message.id,
      ticket_id: ticketId,
      sender_name: message.sender,
      is_staff: message.isStaff,
      role: message.role || 'Müşteri',
      avatar: message.avatar,
      time: message.time,
      message: message.text
    });

    await supabase.from('tickets').update({
      status: message.isStaff ? 'Yanıtlandı' : 'Müşteri Yanıtı',
      updated_at: new Date().toISOString()
    }).eq('id', ticketId);

    return { data, error };
  }
};

// ==========================================
// 6. FATURALAR SERVİSİ
// ==========================================

export const invoiceService = {
  async getInvoices(userId) {
    if (!isSupabaseConfigured) {
      return { data: localInvoices, error: null };
    }
    const { data, error } = await supabase
      .from('invoices')
      .select('*, invoice_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return { data: localInvoices, error };
    }

    const mapped = data.map(inv => ({
      id: inv.id,
      date: inv.date,
      dueDate: inv.due_date,
      subtotal: Number(inv.subtotal),
      vat: Number(inv.vat),
      total: Number(inv.total),
      status: inv.status,
      paymentMethod: inv.payment_method,
      paidAt: inv.paid_at,
      items: (inv.invoice_items || []).map(i => ({
        desc: i.description,
        amount: Number(i.amount)
      }))
    }));

    return { data: mapped, error: null };
  },

  async payInvoice(invoiceId, paymentMethod = 'Bakiye Hesabı') {
    if (!isSupabaseConfigured) {
      localInvoices = localInvoices.map(inv => inv.id === invoiceId ? {
        ...inv,
        status: 'Ödendi',
        paymentMethod,
        paidAt: new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      } : inv);
      return { error: null };
    }
    return await supabase.from('invoices').update({
      status: 'Ödendi',
      payment_method: paymentMethod,
      paid_at: new Date().toISOString()
    }).eq('id', invoiceId);
  }
};

// ==========================================
// 7. DENETİM GÜNLÜĞÜ (AUDIT LOGS)
// ==========================================

export const auditService = {
  async getLogs(userId) {
    if (!isSupabaseConfigured) {
      return { data: localLogs, error: null };
    }
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error || !data || data.length === 0) {
      return { data: localLogs, error };
    }

    return {
      data: data.map(l => ({
        id: l.id,
        action: l.action,
        target: l.target,
        time: l.time || new Date(l.created_at).toLocaleString('tr-TR'),
        ip: l.ip_address
      })),
      error: null
    };
  },

  async addLog(userId, action, target) {
    const newLog = {
      id: Date.now(),
      action,
      target,
      time: 'Az önce',
      ip: '194.15.36.10'
    };
    if (!isSupabaseConfigured) {
      localLogs = [newLog, ...localLogs];
      return { error: null };
    }
    return await supabase.from('audit_logs').insert({
      user_id: userId,
      action,
      target,
      time: 'Şimdi',
      ip_address: '194.15.36.10'
    });
  }
};
