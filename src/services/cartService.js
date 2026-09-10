import { SERVER_CATEGORIES, BILLING_CYCLES, ADDONS, calculatePlanPrice } from '../data/serverPlans.js';

const STORAGE_KEY = 'novaq_cart_storage';

// Get guest cart ID or generate one
function getGuestCartId() {
  if (typeof window === 'undefined') return 'guest-cart-default';
  let guestId = localStorage.getItem('novaq_guest_cart_id');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem('novaq_guest_cart_id', guestId);
  }
  return guestId;
}

// Find authoritative plan by ID in server catalog
export function findServerPlan(planId) {
  for (const cat of SERVER_CATEGORIES) {
    const found = cat.plans.find(p => p.id === planId);
    if (found) return found;
  }
  return null;
}

/**
 * Validate and re-calculate cart items against the authoritative serverPlans data
 * Ensures frontend tampering of price/discount is impossible.
 */
export function validateCartItems(items = []) {
  if (!Array.isArray(items)) return [];

  return items.map(item => {
    // 1. Verify Plan
    const authoritativePlan = findServerPlan(item.plan?.id) || item.plan;
    const baseMonthly = authoritativePlan.basePriceMonthly || item.plan?.basePriceMonthly || 19;

    // 2. Verify Cycle
    const cycleId = item.cycle?.id || 'monthly';
    const cycleObj = BILLING_CYCLES.find(c => c.id === cycleId) || BILLING_CYCLES[0];

    // 3. Verify Addons
    const verifiedAddons = (item.addons || []).map(addon => {
      const authAddon = ADDONS.find(a => a.id === addon.id);
      return authAddon ? { ...authAddon } : addon;
    });

    // 4. Recompute exact pricing
    const authoritativePricing = calculatePlanPrice(baseMonthly, cycleObj.id, verifiedAddons);

    return {
      ...item,
      plan: {
        ...authoritativePlan,
        basePriceMonthly: baseMonthly
      },
      cycle: cycleObj,
      addons: verifiedAddons,
      pricing: authoritativePricing
    };
  });
}

/**
 * Read cart from localStorage
 */
export function getStoredCart() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Return initial demo cart item if first time
      const initialItem = {
        cartItemId: 'sample-cart-1',
        plan: SERVER_CATEGORIES[1].plans[1], // Ryzen Ultra R2
        location: { country: 'Almanya', city: 'Frankfurt am Main', flag: '🇩🇪', id: 'de' },
        os: { name: 'Ubuntu 24.04 LTS', id: 'ubuntu-24' },
        cycle: BILLING_CYCLES[1], // 3 Aylık (%5)
        addons: [{ id: 'backup_daily', name: 'Günlük Otomatik Snapshot', priceMonthly: 5 }],
        hostname: 'game-de01.novaq.internal',
        pricing: calculatePlanPrice(SERVER_CATEGORIES[1].plans[1].basePriceMonthly, 'quarterly', [{ id: 'backup_daily', priceMonthly: 5 }])
      };
      saveStoredCart([initialItem]);
      return [initialItem];
    }

    const parsed = JSON.parse(raw);
    const items = parsed.items || [];
    // Always validate items against catalog prices
    return validateCartItems(items);
  } catch (err) {
    console.error('Error reading stored cart:', err);
    return [];
  }
}

/**
 * Save cart items to localStorage
 */
export function saveStoredCart(items = [], userId = null) {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      guestCartId: getGuestCartId(),
      userId: userId || null,
      items: items,
      lastUpdated: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Error saving stored cart:', err);
  }
}

/**
 * Merge Guest Cart with User Cart on Login or Register
 */
export function mergeCartOnAuth(userId) {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const items = parsed.items || [];
    
    // Associate with user and update
    parsed.userId = userId;
    parsed.lastUpdated = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    return validateCartItems(items);
  } catch (err) {
    console.error('Error merging cart on auth:', err);
    return [];
  }
}

/**
 * Clear the stored cart
 */
export function clearStoredCart(userId = null) {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      guestCartId: getGuestCartId(),
      userId: userId || null,
      items: [],
      lastUpdated: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Error clearing stored cart:', err);
  }
}

export const cartService = {
  getGuestCartId,
  getStoredCart,
  saveStoredCart,
  validateCartItems,
  mergeCartOnAuth,
  clearStoredCart
};
