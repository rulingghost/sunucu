import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ServerCatalog from './components/ServerCatalog';
import DatacenterMap from './components/DatacenterMap';
import InfraFeatures from './components/InfraFeatures';
import Footer from './components/Footer';
import ConfiguratorModal from './components/ConfiguratorModal';
import CartModal from './components/CartModal';
import Toast from './components/Toast';

import HomePage from './pages/HomePage';
import VdsPage from './pages/VdsPage';
import ExtremePage from './pages/ExtremePage';
import DedicatedPage from './pages/DedicatedPage';
import GpuPage from './pages/GpuPage';
import DatacentersPage from './pages/DatacentersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import KvkkPage from './pages/KvkkPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import LoginPage from './pages/LoginPage';

import PortalLayout from './portal/PortalLayout';
import PortalDashboard from './portal/PortalDashboard';
import ServerManagement from './portal/ServerManagement';
import OrdersApproval from './portal/OrdersApproval';
import WebTerminalModal from './portal/WebTerminalModal';
import TicketSystem from './portal/TicketSystem';
import BillingInvoices from './portal/BillingInvoices';
import AccountSecurity from './portal/AccountSecurity';
import PortalCheckout from './portal/PortalCheckout';

import { 
  INITIAL_USER, 
  INITIAL_SERVERS, 
  INITIAL_ORDERS, 
  INITIAL_TICKETS, 
  INITIAL_INVOICES 
} from './data/mockPortalData';
import { SERVER_CATEGORIES } from './data/serverPlans';
import { ROUTE_MAP, PATH_TO_PAGE, resolveRoute } from './data/routes';
import { cartService } from './services/cartService';

import { 
  authService, 
  profileService, 
  serverService, 
  orderService, 
  ticketService, 
  invoiceService, 
  auditService 
} from './services/supabaseService';
import { isSupabaseConfigured } from './lib/supabaseClient';
import { getAdminSession, adminLogout, verifyAdminSession } from './services/adminAuthService';
import { getDashboardMetrics, getUnreadTicketCount } from './services/adminDataService';

import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminCustomers from './admin/AdminCustomers';
import AdminCustomerDetail from './admin/AdminCustomerDetail';
import AdminProducts from './admin/AdminProducts';
import AdminProductEdit from './admin/AdminProductEdit';
import AdminOrders from './admin/AdminOrders';
import AdminOrderDetail from './admin/AdminOrderDetail';
import AdminInvoices from './admin/AdminInvoices';
import AdminInvoiceDetail from './admin/AdminInvoiceDetail';
import AdminPayments from './admin/AdminPayments';
import AdminTickets from './admin/AdminTickets';
import AdminTicketDetail from './admin/AdminTicketDetail';
import AdminAuditLogs from './admin/AdminAuditLogs';
import AdminProfile from './admin/AdminProfile';

function isYoneticiPage(page) {
  return typeof page === 'string' && page.startsWith('yonetici');
}

function resolveAdminPath(page, params = {}) {
  if (page === 'yonetici-musteri-detay' && params.id) return `/yonetici/musteriler/${params.id}`;
  if (page === 'yonetici-urun-detay' && params.id) return `/yonetici/urunler/${params.id}`;
  if (page === 'yonetici-siparis-detay' && params.id) return `/yonetici/siparisler/${params.id}`;
  if (page === 'yonetici-fatura-detay' && params.id) return `/yonetici/faturalar/${params.id}`;
  if (page === 'yonetici-ticket-detay' && params.id) return `/yonetici/ticketlar/${params.id}`;
  return ROUTE_MAP[page]?.path || '/yonetici/dashboard';
}

export default function App() {
  // User Authentication State
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return { ...INITIAL_USER, isLoggedIn: true };
    try {
      const savedSession = localStorage.getItem('novaq_user_session');
      if (savedSession) {
        return JSON.parse(savedSession);
      }
    } catch (e) {
      console.error('Session parse error:', e);
    }
    return { ...INITIAL_USER, isLoggedIn: true };
  });

  // Dynamic Routing State (derived from URL)
  const [routeState, setRouteState] = useState(() => {
    if (typeof window === 'undefined') return { page: 'home', params: {} };
    const resolved = resolveRoute(window.location.pathname);
    return resolved;
  });

  const [adminSession, setAdminSession] = useState(() => getAdminSession());

  const [selectedServerId, setSelectedServerId] = useState(INITIAL_SERVERS[0].id);

  // Core Data State
  const [servers, setServers] = useState(INITIAL_SERVERS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);

  // Persistent Cart State
  const [cartItems, setCartItems] = useState(() => cartService.getStoredCart());

  // Modals & UI States
  const [configuratorPlan, setConfiguratorPlan] = useState(null);
  const [configuratorCycle, setConfiguratorCycle] = useState('monthly');
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [terminalServer, setTerminalServer] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Toast helper
  const addToast = (title, message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Keep session synced to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('novaq_user_session', JSON.stringify(user));
      } catch (e) {
        console.error('Failed to sync session:', e);
      }
    }
  }, [user]);

  // Protected Route Guard: If user visits /panel/* while unauthenticated, redirect to login
  useEffect(() => {
    if (routeState.page.startsWith('panel') && (!user || !user.isLoggedIn)) {
      handleNavigateToLogin(window.location.pathname + window.location.search);
    }
  }, [routeState.page, user?.isLoggedIn]);

  // Protected Route Guard: Yönetici sayfalarına yetkisiz erişimi giriş ekranına yönlendir
  useEffect(() => {
    if (!isYoneticiPage(routeState.page)) return;
    const hasAdmin = verifyAdminSession();
    if (!hasAdmin && routeState.page !== 'yonetici-giris') {
      handleNavigateToAdminLogin();
      return;
    }
    if (hasAdmin && routeState.page === 'yonetici-giris') {
      handleNavigate('/yonetici/dashboard');
    }
  }, [routeState.page, adminSession]);

  // HTML5 History API route listener for browser back/forward buttons
  useEffect(() => {
    const routeInfo = ROUTE_MAP[routeState.page] || ROUTE_MAP.home;
    document.title = routeInfo.title;

    const handlePopState = () => {
      const resolved = resolveRoute(window.location.pathname);
      setRouteState(resolved);
      const rInfo = ROUTE_MAP[resolved.page] || ROUTE_MAP.home;
      document.title = rInfo.title;
      if (resolved.params.serverId) {
        setSelectedServerId(resolved.params.serverId);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [routeState.page]);

  // Supabase Canlı Veri Senkronizasyonu
  useEffect(() => {
    async function loadSupabaseData() {
      if (!isSupabaseConfigured) return;
      try {
        const { data: userData } = await authService.getUser();
        const currentUserId = userData?.user?.id;
        if (!currentUserId) return;

        const [profRes, srvRes, ordRes, tckRes, invRes] = await Promise.all([
          profileService.getProfile(currentUserId),
          serverService.getServers(currentUserId),
          orderService.getOrders(currentUserId),
          ticketService.getTickets(currentUserId),
          invoiceService.getInvoices(currentUserId)
        ]);

        if (profRes.data) {
          setUser(prev => ({ ...prev, ...profRes.data, isLoggedIn: true }));
        }
        if (srvRes.data && srvRes.data.length > 0) {
          setServers(srvRes.data);
          setSelectedServerId(srvRes.data[0].id);
        }
        if (ordRes.data && ordRes.data.length > 0) {
          setOrders(ordRes.data);
        }
        if (tckRes.data && tckRes.data.length > 0) {
          setTickets(tckRes.data);
        }
        if (invRes.data && invRes.data.length > 0) {
          setInvoices(invRes.data);
        }
      } catch (err) {
        console.error('Supabase senkronizasyon hatası:', err);
      }
    }

    loadSupabaseData();
  }, []);

  // Standard Same-Tab Navigation Handler
  const handleNavigate = (pageIdOrPath, e) => {
    if (e && e.preventDefault) e.preventDefault();

    let targetPage = 'home';
    let targetPath = '/';
    let targetParams = {};

    if (typeof pageIdOrPath === 'string' && (pageIdOrPath.startsWith('/') || pageIdOrPath.includes('.'))) {
      targetPath = pageIdOrPath;
      const resolved = resolveRoute(pageIdOrPath);
      targetPage = resolved.page;
      targetParams = resolved.params;
    } else if (ROUTE_MAP[pageIdOrPath]) {
      targetPage = pageIdOrPath;
      targetPath = ROUTE_MAP[pageIdOrPath].path;
    }

    // Protection check for panel routes
    if (targetPage.startsWith('panel') && (!user || !user.isLoggedIn)) {
      handleNavigateToLogin(targetPath);
      return;
    }

    if (isYoneticiPage(targetPage) && targetPage !== 'yonetici-giris' && !verifyAdminSession()) {
      handleNavigateToAdminLogin();
      return;
    }

    window.history.pushState({ pageId: targetPage }, '', targetPath);
    const rInfo = ROUTE_MAP[targetPage] || ROUTE_MAP.home;
    document.title = rInfo.title;
    setRouteState({ page: targetPage, params: targetParams });
    
    if (targetParams.serverId) {
      setSelectedServerId(targetParams.serverId);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dedicated Navigate to Login with returnUrl query param
  const handleNavigateToLogin = (returnUrl = '/panel') => {
    const targetPath = `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
    window.history.pushState({ pageId: 'login' }, '', targetPath);
    document.title = ROUTE_MAP.login?.title || 'Müşteri Girişi | NovaQ Servers';
    setRouteState({ page: 'login', params: { returnUrl } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToAdminLogin = () => {
    window.history.pushState({ pageId: 'yonetici-giris' }, '', '/yonetici/giris');
    document.title = ROUTE_MAP['yonetici-giris']?.title || 'Yönetici Girişi | NovaQ Servers';
    setRouteState({ page: 'yonetici-giris', params: {} });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = (session) => {
    setAdminSession(session);
    addToast('Yönetici Girişi', 'NovaQ yönetici oturumu açıldı.');
    window.history.pushState({ pageId: 'yonetici-dashboard' }, '', '/yonetici/dashboard');
    document.title = ROUTE_MAP['yonetici-dashboard']?.title || 'Yönetici Kontrol Paneli | NovaQ Servers';
    setRouteState({ page: 'yonetici-dashboard', params: {} });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    adminLogout();
    setAdminSession(null);
    addToast('Yönetici Oturumu Kapatıldı', 'Yönetici oturumunuz sonlandırıldı.', 'info');
    handleNavigateToAdminLogin();
  };

  // Client Portal Trigger (Same-tab redirect!)
  const handleOpenPortal = (tab = 'dashboard') => {
    const targetPath = tab === 'dashboard' ? '/panel' : `/panel/${tab}`;
    if (user && user.isLoggedIn) {
      handleNavigate(targetPath);
    } else {
      handleNavigateToLogin(targetPath);
    }
  };

  // Cart Checkout Trigger (From CartModal or Buy actions)
  const handleProceedToCheckout = () => {
    setCartModalOpen(false);
    if (user && user.isLoggedIn) {
      handleNavigate('/panel/checkout');
    } else {
      handleNavigateToLogin('/panel/checkout');
    }
  };

  // Successful Login/Register handler
  const handleLoginSuccess = (userData, returnUrl, toastMsg) => {
    const updatedUser = { ...user, ...userData, isLoggedIn: true };
    setUser(updatedUser);
    localStorage.setItem('novaq_user_session', JSON.stringify(updatedUser));

    // Merge guest cart with authenticated user
    const mergedCart = cartService.mergeCartOnAuth(updatedUser.customerId);
    if (mergedCart && mergedCart.length > 0) {
      setCartItems(mergedCart);
    }

    addToast('Giriş Başarılı', toastMsg || 'NovaQ Servers müşteri oturumu açıldı.');
    
    // Redirect to returnUrl in the same tab
    const target = returnUrl || '/panel';
    handleNavigate(target);
  };

  // Logout handler
  const handleLogout = () => {
    const loggedOutUser = { ...user, isLoggedIn: false };
    setUser(loggedOutUser);
    localStorage.setItem('novaq_user_session', JSON.stringify(loggedOutUser));
    authService.signOut();
    handleNavigate('home');
    addToast('Oturum Kapatıldı', 'NovaQ Servers müşteri oturumunuz sonlandırıldı.', 'info');
  };

  // Plan Selection from Catalog
  const handleSelectPlan = (plan, cycle = 'monthly') => {
    setConfiguratorPlan(plan);
    setConfiguratorCycle(cycle);
  };

  // Add to Cart handler (with persistent storage & validation)
  const handleAddToCart = (item) => {
    const updated = [...cartItems, item];
    const validated = cartService.validateCartItems(updated);
    setCartItems(validated);
    cartService.saveStoredCart(validated, user?.customerId);
    addToast('Sepete Eklendi!', `${item.plan.name} (${item.location.country}) başarıyla sepetinize eklendi.`);
  };

  const handleRemoveFromCart = (cartItemId) => {
    const updated = cartItems.filter(item => item.cartItemId !== cartItemId);
    setCartItems(updated);
    cartService.saveStoredCart(updated, user?.customerId);
    addToast('Ürün Sepetten Çıkarıldı', 'Seçilen yapılandırma sepetinizden silindi.', 'info');
  };

  const handleClearCart = () => {
    setCartItems([]);
    cartService.clearStoredCart(user?.customerId);
    addToast('Sepet Boşaltıldı', 'Sepetinizdeki tüm ürünler temizlendi.', 'info');
  };

  // Final Order & Checkout completion handler from PortalCheckout
  const handleCheckout = ({ items, subtotal, vat, total, couponDiscount, paymentMethod }) => {
    const newOrderId = 'ORD-2026-' + Math.floor(1000 + Math.random() * 9000);
    const invoiceId = 'INV-2026-' + Math.floor(1000 + Math.random() * 9000);
    const orderDate = new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    // Deduct from balance if balance was used
    if (paymentMethod.includes('Bakiye')) {
      const newBal = (user.balance || 0) - total;
      setUser(prev => ({ ...prev, balance: newBal }));
      profileService.updateBalance(user.customerId || 'user', newBal);
    }

    // Create order entries for each item
    const newOrderEntries = items.map((item, idx) => {
      const serverInstId = 'srv-ord-' + Math.floor(100 + Math.random() * 900);
      const generatedIp = item.location.id === 'hk' ? '103.88.221.' + Math.floor(110 + Math.random() * 90) :
                          item.location.id === 'fr' ? '51.77.104.' + Math.floor(110 + Math.random() * 90) :
                          '194.15.36.' + Math.floor(110 + Math.random() * 90);

      return {
        orderId: idx === 0 ? newOrderId : `${newOrderId}-${idx + 1}`,
        date: orderDate,
        planName: item.plan.name,
        location: `${item.location.country} (${item.location.city})`,
        flag: item.location.flag,
        os: item.os.name,
        cycleLabel: item.cycle.label,
        total: item.pricing?.planTotal || item.pricing?.subtotal || 0,
        paymentStatus: `Ödendi (${paymentMethod})`,
        provisionStatus: 'pending_approval',
        assignedServerId: serverInstId,
        targetServerTemplate: {
          id: serverInstId,
          name: (item.hostname ? item.hostname.split('.')[0] : 'novaq-srv') + '-' + Math.floor(10 + Math.random() * 90),
          hostname: item.hostname || 'cloud-inst.novaq.internal',
          planName: item.plan.name,
          category: item.plan.category || 'nvme-vds',
          status: 'running',
          location: `${item.location.country} (${item.location.city})`,
          flag: item.location.flag,
          ip: generatedIp,
          gateway: generatedIp.substring(0, generatedIp.lastIndexOf('.')) + '.1',
          netmask: '255.255.255.0',
          rdns: item.hostname || 'cloud-srv.novaq.internal',
          os: item.os.name,
          cores: item.plan.cores,
          ram: item.plan.ram,
          disk: item.plan.disk,
          diskUsed: '12.4 GB',
          bandwidthTotal: item.plan.bandwidth || 'Sınırsız (10 Gbps)',
          bandwidthUsedMonth: '0.1 TB',
          uptime: '1 Saat',
          purchasedAt: orderDate,
          renewalDate: new Date(Date.now() + (item.cycle.months || 1) * 30 * 86400000).toLocaleDateString('tr-TR'),
          billingCycle: item.cycle.label,
          daysRemaining: (item.cycle.months || 1) * 30,
          priceMonthly: item.plan.basePriceMonthly,
          metrics: {
            cpuHistory: [5, 8, 12, 10, 7, 9, 11, 8, 10, 9, 8, 10],
            ramHistory: [20, 22, 22, 23, 22, 24, 23, 23, 23, 24, 23, 23],
            diskIOHistory: [5, 10, 8, 12, 6, 8, 7, 9, 6, 8, 7, 8],
            netMbps: [15, 30, 25, 40, 20, 35, 28, 45, 30, 38, 25, 32]
          },
          snapshots: []
        }
      };
    });

    setOrders(prev => [...newOrderEntries, ...prev]);

    // Supabase Kayıtları
    newOrderEntries.forEach(ord => {
      orderService.createOrder(user.customerId || 'user', ord);
    });

    // Create Invoice
    const newInvoice = {
      id: invoiceId,
      date: orderDate,
      dueDate: new Date(Date.now() + 14 * 86400000).toLocaleDateString('tr-TR'),
      items: items.map(it => ({
        desc: `${it.plan.name} (${it.location.country} - ${it.os.name.split(' ')[0]}) [${it.cycle.label}]`,
        amount: it.pricing?.planTotal || it.pricing?.subtotal || 0
      })),
      subtotal,
      vat,
      total,
      status: 'Ödendi',
      paymentMethod,
      paidAt: orderDate
    };

    setInvoices(prev => [newInvoice, ...prev]);
    invoiceService.payInvoice(invoiceId, paymentMethod);

    // Clear cart both in state and in persistent storage
    setCartItems([]);
    cartService.clearStoredCart(user.customerId);

    // Navigate to Orders in Customer Portal
    handleNavigate('panel-orders');

    addToast(
      'Siparişiniz Başarıyla Alındı & Ödemesi Onaylandı!',
      `Sipariş No: #${newOrderId}. Yönetim onayından sonra sunucunuz hemen aktif edilecektir.`
    );
  };

  // Instant order from Configurator modal
  const handleInstantOrderComplete = (newServer, pricing) => {
    const newOrderId = 'ORD-2026-' + Math.floor(1000 + Math.random() * 9000);
    const newInvoiceId = 'INV-2026-' + Math.floor(1000 + Math.random() * 9000);
    const orderDate = new Date().toLocaleDateString('tr-TR');

    const newOrder = {
      orderId: newOrderId,
      date: orderDate,
      planName: newServer.planName,
      location: newServer.location,
      flag: newServer.flag,
      os: newServer.os,
      cycleLabel: pricing.cycle.label,
      total: pricing.total,
      paymentStatus: 'Ödendi (3D Secure)',
      provisionStatus: 'approved',
      assignedServerId: newServer.id
    };

    setOrders(prev => [newOrder, ...prev]);
    setServers(prev => [newServer, ...prev]);
    setSelectedServerId(newServer.id);

    orderService.createOrder(user.customerId || 'user', newOrder);

    const newInvoice = {
      id: newInvoiceId,
      date: orderDate,
      dueDate: new Date(Date.now() + 14 * 86400000).toLocaleDateString('tr-TR'),
      items: [
        { desc: `${newServer.planName} (${newServer.cores} / ${newServer.ram}) - ${pricing.cycle.label} Kiralama`, amount: pricing.subtotal }
      ],
      subtotal: pricing.subtotal,
      vat: pricing.vat,
      total: pricing.total,
      status: 'Ödendi',
      paymentMethod: 'Kredi Kartı (3D Secure)',
      paidAt: orderDate
    };

    setInvoices(prev => [newInvoice, ...prev]);
    invoiceService.payInvoice(newInvoiceId, 'Kredi Kartı (3D Secure)');

    setConfiguratorPlan(null);
    handleNavigate('panel-servers');

    addToast(
      'Sunucunuz Başarıyla Kuruldu!',
      `${newServer.name} (${newServer.ip}) omurgaya bağlandı ve aktif edildi.`
    );
  };

  // Approve Order Workflow
  const handleApproveOrder = (orderId) => {
    const targetOrder = orders.find(o => o.orderId === orderId);
    if (!targetOrder || !targetOrder.targetServerTemplate) return;

    const newServer = targetOrder.targetServerTemplate;
    setServers(prev => [newServer, ...prev]);
    setSelectedServerId(newServer.id);

    setOrders(prev => prev.map(o => {
      if (o.orderId === orderId) {
        return {
          ...o,
          provisionStatus: 'approved',
          assignedServerId: newServer.id
        };
      }
      return o;
    }));

    orderService.approveOrder(orderId, newServer.id);

    addToast(
      'Yönetici Onayı Verildi & Sunucu Aktif!',
      `${newServer.name} (${newServer.ip}) hazır! "Sunucularım" sekmesinden yönetebilirsiniz.`
    );
  };

  // Server Power Actions
  const handlePowerAction = (serverId, action) => {
    const target = servers.find(s => s.id === serverId);
    if (!target) return;

    if (action === 'reboot') {
      setServers(prev => prev.map(s => s.id === serverId ? { ...s, status: 'rebooting' } : s));
      addToast('Sunucu Yeniden Başlatılıyor', `${target.name} ACPI sinyali gönderildi.`, 'info');

      serverService.updateStatus(serverId, 'rebooting');
      auditService.addLog(user.customerId || 'user', 'Sunucu Yeniden Başlatıldı', target.name);

      setTimeout(() => {
        setServers(prev => prev.map(s => s.id === serverId ? { ...s, status: 'running' } : s));
        serverService.updateStatus(serverId, 'running');
        addToast('Sunucu Hazır', `${target.name} yeniden başlatıldı ve çevrimiçi duruma geçti.`);
      }, 3500);
    } else if (action === 'shutdown' || action === 'stop') {
      setServers(prev => prev.map(s => s.id === serverId ? { ...s, status: 'stopped' } : s));
      serverService.updateStatus(serverId, 'stopped');
      auditService.addLog(user.customerId || 'user', 'Sunucu Kapatıldı', target.name);
      addToast('Sunucu Kapatıldı', `${target.name} kapatıldı ve güç kesildi.`, 'warning');
    } else if (action === 'start') {
      setServers(prev => prev.map(s => s.id === serverId ? { ...s, status: 'running' } : s));
      serverService.updateStatus(serverId, 'running');
      auditService.addLog(user.customerId || 'user', 'Sunucu Başlatıldı', target.name);
      addToast('Sunucu Başlatıldı', `${target.name} KVM hypervisor üzerinde çalıştırıldı.`);
    }
  };

  // Update rDNS
  const handleUpdateRdns = (serverId, newRdns) => {
    setServers(prev => prev.map(s => s.id === serverId ? { ...s, rdns: newRdns } : s));
    serverService.updateRdns(serverId, newRdns);
    auditService.addLog(user.customerId || 'user', 'Reverse DNS Güncellendi', newRdns);
    addToast('rDNS PTR Güncellendi', `Yeni Reverse DNS adresi BGP tablosuna iletildi: ${newRdns}`);
  };

  // Create Snapshot
  const handleCreateSnapshot = (serverId, snapshotName) => {
    const newSnap = {
      id: 'snp-' + Date.now(),
      name: snapshotName || 'Kullanıcı Manuel Snapshot',
      date: new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      size: '15.4 GB'
    };

    setServers(prev => prev.map(s => {
      if (s.id === serverId) {
        return {
          ...s,
          snapshots: [newSnap, ...(s.snapshots || [])]
        };
      }
      return s;
    }));

    serverService.createSnapshot(serverId, newSnap);
    auditService.addLog(user.customerId || 'user', 'Snapshot Alındı', `${snapshotName} (${serverId})`);
    addToast('Snapshot Oluşturuldu', `ZFS anlık disk görüntüsü "${snapshotName}" başarıyla kaydedildi.`);
  };

  // Restore Snapshot
  const handleRestoreSnapshot = (serverId, snapshotId) => {
    setServers(prev => prev.map(s => s.id === serverId ? { ...s, status: 'rebooting' } : s));
    addToast('Geri Yükleniyor', 'Snapshot imajı NVMe depolama havuzuna yazılıyor...', 'info');

    setTimeout(() => {
      setServers(prev => prev.map(s => s.id === serverId ? { ...s, status: 'running' } : s));
      addToast('Geri Yükleme Tamamlandı', 'Sunucu seçilen snapshot noktasına döndürüldü.');
    }, 4000);
  };

  // Reinstall OS
  const handleReinstallOS = (serverId, newOsName) => {
    setServers(prev => prev.map(s => s.id === serverId ? { ...s, status: 'installing', os: newOsName } : s));
    addToast('İşletim Sistemi Kuruluyor', `${newOsName} ISO kalıbı KVM diskine yazılıyor...`, 'info');

    serverService.reinstallOS(serverId, newOsName);
    auditService.addLog(user.customerId || 'user', 'OS Yeniden Kuruldu', `${newOsName} (${serverId})`);

    setTimeout(() => {
      setServers(prev => prev.map(s => s.id === serverId ? { ...s, status: 'running' } : s));
      addToast('Kurulum Tamamlandı!', `${newOsName} kuruldu. Yeni root şifresi destek biletinize ve e-postanıza iletildi.`);
    }, 4500);
  };

  // Ticket Operations
  const handleAddTicket = (newTicket) => {
    setTickets(prev => [newTicket, ...prev]);
    ticketService.createTicket(user.customerId || 'user', newTicket);
    addToast('Destek Talebi Oluşturuldu', `Bilet #${newTicket.id} NOC mühendislerine iletildi.`);
  };

  const handleReplyTicket = (ticketId, replyMessage) => {
    const newMsg = {
      sender: 'user',
      author: user.name,
      time: 'Az önce',
      avatar: '👤',
      text: replyMessage
    };

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'Yanıt Bekliyor',
          lastUpdate: 'Az önce',
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    }));

    ticketService.addMessage(ticketId, newMsg);
    addToast('Yanıtınız Gönderildi', 'Mesajınız destek biletine eklendi.');
  };

  // Billing Operations
  const handlePayInvoice = (invoiceId) => {
    const targetInvoice = invoices.find(inv => inv.id === invoiceId);
    if (!targetInvoice) return;

    if (user.balance < targetInvoice.total) {
      alert(`Kredi bakiyeniz yetersiz! Mevcut bakiye: $${user.balance.toLocaleString('tr-TR')}, Fatura tutarı: $${targetInvoice.total.toLocaleString('tr-TR')}. Lütfen bakiye yükleyin.`);
      return;
    }

    const newBalance = user.balance - targetInvoice.total;
    setUser(prev => ({ ...prev, balance: newBalance }));
    profileService.updateBalance(user.customerId || 'user', newBalance);

    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return {
          ...inv,
          status: 'Ödendi',
          paymentMethod: 'Kredi Bakiyesi',
          paidAt: new Date().toLocaleDateString('tr-TR')
        };
      }
      return inv;
    }));

    invoiceService.payInvoice(invoiceId, 'Kredi Bakiyesi');
    addToast('Fatura Ödendi', `${invoiceId} tutarı bakiyenizden tahsil edildi.`);
  };

  const handleAddBalance = (amount) => {
    const newBalance = (user.balance || 0) + amount;
    setUser(prev => ({ ...prev, balance: newBalance }));
    profileService.updateBalance(user.customerId || 'user', newBalance);
    addToast('Bakiye Yüklendi', `$${amount.toLocaleString('tr-TR')} hesabınıza başarıyla tanımlandı.`);
  };

  // Profile Update handler
  const handleUpdateProfile = (newProfile) => {
    setUser(prev => ({ ...prev, ...newProfile }));
    profileService.updateProfile(user.customerId || 'user', newProfile);
    addToast('Profil Güncellendi', 'Kurumsal üyelik bilgileriniz başarıyla kaydedildi.');
  };

  const pendingOrdersCount = orders.filter(o => o.provisionStatus === 'pending_approval').length;
  const currentPage = routeState.page;

  // Derive active tab if on a portal route
  let currentPortalTab = 'dashboard';
  if (currentPage.startsWith('panel')) {
    if (currentPage === 'panel-dashboard' || currentPage === 'panel') currentPortalTab = 'dashboard';
    else if (currentPage === 'panel-servers') currentPortalTab = 'servers';
    else if (currentPage === 'panel-orders') currentPortalTab = 'orders';
    else if (currentPage === 'panel-tickets') currentPortalTab = 'tickets';
    else if (currentPage === 'panel-invoices') currentPortalTab = 'invoices';
    else if (currentPage === 'panel-security') currentPortalTab = 'security';
    else if (currentPage === 'panel-checkout') currentPortalTab = 'checkout';
  }

  return (
    <div className="app-wrapper">
      {/* Toast Notifications */}
      <Toast toasts={toasts} onRemoveToast={removeToast} />

      {/* 1. AUTH ROUTES: /login and /register */}
      {(currentPage === 'login' || currentPage === 'register') && (
        <LoginPage 
          onLoginSuccess={handleLoginSuccess}
          onNavigate={handleNavigate}
          cartCount={cartItems.length}
          initialMode={currentPage === 'register' ? 'register' : 'login'}
          returnUrlOverride={routeState.params?.returnUrl || null}
        />
      )}

      {/* 2. CLIENT PORTAL ROUTES: /panel, /panel/dashboard, /panel/servers, etc. */}
      {currentPage.startsWith('panel') && (
        <PortalLayout 
          currentTab={currentPortalTab}
          onNavigateTab={(tabId, tabPath) => handleNavigate(tabPath || `/panel/${tabId}`)}
          user={user}
          serversCount={servers.length}
          pendingOrdersCount={pendingOrdersCount}
          openTicketsCount={tickets.filter(t => t.status !== 'Çözüldü').length}
          cartCount={cartItems.length}
          onReturnToPublic={() => handleNavigate('home')}
          onOpenAddBalance={() => handleNavigate('panel-invoices')}
          onOpenNewServer={() => handleSelectPlan(SERVER_CATEGORIES[0].plans[1])}
          onLogout={handleLogout}
        >
          {currentPortalTab === 'dashboard' && (
            <PortalDashboard 
              servers={servers}
              user={user}
              onSelectServerManage={(id) => { setSelectedServerId(id); handleNavigate(`/panel/servers/${id}`); }}
              onOpenTerminal={(server) => setTerminalServer(server)}
              onPowerAction={handlePowerAction}
              onOpenNewServer={() => handleSelectPlan(SERVER_CATEGORIES[0].plans[1])}
              onNavigateTab={(tab) => handleNavigate(`/panel/${tab}`)}
            />
          )}

          {currentPortalTab === 'servers' && (
            <ServerManagement 
              servers={servers}
              selectedServerId={selectedServerId}
              setSelectedServerId={setSelectedServerId}
              onPowerAction={handlePowerAction}
              onOpenTerminal={(server) => setTerminalServer(server)}
              onUpdateRdns={handleUpdateRdns}
              onCreateSnapshot={handleCreateSnapshot}
              onRestoreSnapshot={handleRestoreSnapshot}
              onReinstallOS={handleReinstallOS}
            />
          )}

          {currentPortalTab === 'orders' && (
            <OrdersApproval 
              orders={orders}
              onApproveOrder={handleApproveOrder}
              onGoToServer={(srvId) => { setSelectedServerId(srvId); handleNavigate(`/panel/servers/${srvId}`); }}
            />
          )}

          {currentPortalTab === 'tickets' && (
            <TicketSystem 
              tickets={tickets}
              servers={servers}
              user={user}
              onAddTicket={handleAddTicket}
              onReplyTicket={handleReplyTicket}
            />
          )}

          {currentPortalTab === 'invoices' && (
            <BillingInvoices 
              invoices={invoices}
              user={user}
              onPayInvoice={handlePayInvoice}
              onAddBalance={handleAddBalance}
            />
          )}

          {currentPortalTab === 'security' && (
            <AccountSecurity 
              user={user}
              onUpdateProfile={handleUpdateProfile}
              onToggle2FA={(val) => {
                setUser(prev => ({ ...prev, twoFactorEnabled: val }));
                addToast(val ? '2FA Aktif Edildi' : '2FA Devre Dışı Bırakıldı', 'Güvenlik ayarlarınız güncellendi.');
              }}
            />
          )}

          {currentPortalTab === 'checkout' && (
            <PortalCheckout 
              cartItems={cartItems}
              onRemoveItem={handleRemoveFromCart}
              onClearCart={handleClearCart}
              onCheckout={handleCheckout}
              user={user}
              onNavigate={handleNavigate}
              addToast={addToast}
            />
          )}
        </PortalLayout>
      )}

      {/* 3. ADMIN ROUTES: /yonetici, /yonetici/giris, /yonetici/dashboard, ... */}
      {isYoneticiPage(currentPage) && (
        currentPage === 'yonetici-giris' || !adminSession ? (
          <AdminLogin
            onLoginSuccess={handleAdminLoginSuccess}
            onNavigate={handleNavigate}
          />
        ) : (
          <AdminLayout
            currentPath={resolveAdminPath(currentPage, routeState.params)}
            onNavigate={handleNavigate}
            adminUser={adminSession}
            pendingOrdersCount={getDashboardMetrics().pendingOrdersCount}
            unreadTicketsCount={getUnreadTicketCount()}
            unpaidInvoicesCount={getDashboardMetrics().unpaidInvoicesCount}
            onLogout={handleAdminLogout}
          >
            {currentPage === 'yonetici-dashboard' && (
              <AdminDashboard navigate={handleNavigate} />
            )}
            {currentPage === 'yonetici-musteriler' && (
              <AdminCustomers navigate={handleNavigate} />
            )}
            {currentPage === 'yonetici-musteri-detay' && (
              <AdminCustomerDetail customerId={routeState.params.id} navigate={handleNavigate} />
            )}
            {currentPage === 'yonetici-urunler' && (
              <AdminProducts navigate={handleNavigate} />
            )}
            {(currentPage === 'yonetici-urun-detay' || currentPage === 'yonetici-urunler-yeni') && (
              <AdminProductEdit
                productId={routeState.params.id}
                mode={currentPage === 'yonetici-urunler-yeni' ? 'new' : 'edit'}
                navigate={handleNavigate}
              />
            )}
            {currentPage === 'yonetici-siparisler' && (
              <AdminOrders navigate={handleNavigate} />
            )}
            {currentPage === 'yonetici-siparis-detay' && (
              <AdminOrderDetail orderId={routeState.params.id} navigate={handleNavigate} />
            )}
            {currentPage === 'yonetici-faturalar' && (
              <AdminInvoices navigate={handleNavigate} />
            )}
            {currentPage === 'yonetici-fatura-detay' && (
              <AdminInvoiceDetail invoiceId={routeState.params.id} navigate={handleNavigate} />
            )}
            {currentPage === 'yonetici-odemeler' && (
              <AdminPayments navigate={handleNavigate} />
            )}
            {currentPage === 'yonetici-ticketlar' && (
              <AdminTickets navigate={handleNavigate} />
            )}
            {currentPage === 'yonetici-ticket-detay' && (
              <AdminTicketDetail ticketId={routeState.params.id} navigate={handleNavigate} />
            )}
            {currentPage === 'yonetici-islem-gecmisi' && (
              <AdminAuditLogs navigate={handleNavigate} />
            )}
            {currentPage === 'yonetici-profil' && (
              <AdminProfile navigate={handleNavigate} />
            )}
          </AdminLayout>
        )
      )}

      {/* 4. PUBLIC WEBSITE ROUTES: /, /sanal-sunucu.html, /fiziksel-sunucu.html, etc. */}
      {!currentPage.startsWith('panel') && !isYoneticiPage(currentPage) && currentPage !== 'login' && currentPage !== 'register' && (
        <>
          <Header 
            user={user}
            cartCount={cartItems.length}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onOpenCart={() => setCartModalOpen(true)}
            onOpenAuth={(mode) => handleNavigateToLogin(mode === 'register' ? '/register' : '/login')}
            onOpenPortal={() => handleOpenPortal('dashboard')}
            onOpenConfigurator={() => handleSelectPlan(SERVER_CATEGORIES[0].plans[1])}
          />
          
          <main>
            {currentPage === 'home' && (
              <HomePage 
                onNavigate={handleNavigate}
                onSelectPlan={handleSelectPlan}
                onOpenConfigurator={handleSelectPlan}
                onOpenPortal={() => handleOpenPortal('dashboard')}
              />
            )}
            {currentPage === 'vds' && (
              <VdsPage 
                onSelectPlan={handleSelectPlan}
                onNavigate={handleNavigate}
                onOpenConfigurator={handleSelectPlan}
              />
            )}
            {currentPage === 'extreme' && (
              <ExtremePage 
                onSelectPlan={handleSelectPlan}
                onNavigate={handleNavigate}
                onOpenConfigurator={handleSelectPlan}
              />
            )}
            {currentPage === 'dedicated' && (
              <DedicatedPage 
                onSelectPlan={handleSelectPlan}
                onNavigate={handleNavigate}
                onOpenConfigurator={handleSelectPlan}
              />
            )}
            {currentPage === 'gpu' && (
              <GpuPage 
                onSelectPlan={handleSelectPlan}
                onNavigate={handleNavigate}
                onOpenConfigurator={handleSelectPlan}
              />
            )}
            {currentPage === 'datacenters' && (
              <DatacentersPage 
                onNavigate={handleNavigate}
                onOpenConfigurator={handleSelectPlan}
              />
            )}
            {currentPage === 'about' && (
              <AboutPage 
                onNavigate={handleNavigate}
                onOpenConfigurator={handleSelectPlan}
              />
            )}
            {currentPage === 'contact' && (
              <ContactPage 
                onNavigate={handleNavigate}
                onOpenPortal={(tab) => handleOpenPortal(tab || 'tickets')}
                onOpenConfigurator={handleSelectPlan}
                addToast={addToast}
              />
            )}
            {currentPage === 'terms' && (
              <TermsPage 
                onNavigate={handleNavigate}
                onOpenConfigurator={handleSelectPlan}
              />
            )}
            {currentPage === 'privacy' && (
              <PrivacyPage 
                onNavigate={handleNavigate}
                onOpenConfigurator={handleSelectPlan}
              />
            )}
            {currentPage === 'kvkk' && (
              <KvkkPage 
                onNavigate={handleNavigate}
                onOpenConfigurator={handleSelectPlan}
              />
            )}
            {currentPage === 'cookies' && (
              <CookiePolicyPage 
                onNavigate={handleNavigate}
                onOpenConfigurator={handleSelectPlan}
              />
            )}
          </main>

          <Footer 
            onNavigate={handleNavigate}
            onOpenPortal={(tab = 'dashboard') => handleOpenPortal(tab)}
          />
        </>
      )}

      {/* MODAL: Server Configurator */}
      {configuratorPlan && (
        <ConfiguratorModal 
          plan={configuratorPlan}
          initialCycle={configuratorCycle}
          onClose={() => setConfiguratorPlan(null)}
          onOrderComplete={handleInstantOrderComplete}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* MODAL: Shopping Cart View (Routes to /panel/checkout) */}
      <CartModal 
        isOpen={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
        user={user}
      />

      {/* MODAL: Live Web SSH Terminal in Portal */}
      {terminalServer && (
        <WebTerminalModal 
          server={terminalServer}
          onClose={() => setTerminalServer(null)}
        />
      )}
    </div>
  );
}
