
import { MOCK_PRODUCTS, MOCK_USERS, MOCK_BILLS, MOCK_NOTIFICATIONS, generateMockCalendar } from '../constants';
import { Product, Bill, DeliveryDay, User, Role, Notification, Subscription } from '../types';

const STORAGE_KEYS = {
  USERS: 'um_users',
  PRODUCTS: 'um_products',
  BILLS: 'um_bills',
  DELIVERIES: 'um_deliveries', // { userId: { 'YYYY-MM': DeliveryDay[] } }
  NOTIFICATIONS: 'um_notifications',
  SUBSCRIPTIONS: 'um_subscriptions'
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to sync future pending deliveries with current subscriptions
const syncFutureDeliveries = (userId: string) => {
    const subsRaw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    const allSubs = subsRaw ? JSON.parse(subsRaw) as Subscription[] : [];
    const userSubs = allSubs.filter(s => s.userId === userId);
    
    // Convert subs to items format
    const newItems = userSubs.map(s => ({ productId: s.productId, quantity: s.quantity }));

    // Update Deliveries
    const deliveriesRaw = localStorage.getItem(STORAGE_KEYS.DELIVERIES);
    if (!deliveriesRaw) return;
    
    const store = JSON.parse(deliveriesRaw);
    if (!store[userId]) return;

    const todayStr = new Date().toISOString().split('T')[0];

    Object.keys(store[userId]).forEach(monthKey => {
        const days = store[userId][monthKey] as DeliveryDay[];
        let modified = false;
        
        const updatedDays = days.map(day => {
            // Only update future pending days
            if (day.date > todayStr && day.status === 'pending') {
                modified = true;
                return { ...day, items: newItems };
            }
            return day;
        });

        if (modified) {
            store[userId][monthKey] = updatedDays;
        }
    });

    localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(store));
};

export const DbService = {
  // Initialize Database with Seed Data
  init: () => {
    if (typeof window === 'undefined') return;
    
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(MOCK_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BILLS)) {
      localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(MOCK_BILLS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DELIVERIES)) {
      localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify({}));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(MOCK_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS)) {
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify([
          { userId: 'user1', productId: 'p1', quantity: 1 }
      ]));
    }
  },

  getProducts: async (): Promise<Product[]> => {
    await delay(300);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  },

  getBills: async (userId: string): Promise<Bill[]> => {
    await delay(300);
    const allBills = JSON.parse(localStorage.getItem(STORAGE_KEYS.BILLS) || '[]') as Bill[];
    return allBills.filter(b => b.userId === userId);
  },

  getSubscriptions: async (userId: string): Promise<Subscription[]> => {
    await delay(300);
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS) || '[]') as Subscription[];
    return all.filter(s => s.userId === userId);
  },

  updateSubscription: async (userId: string, productId: string, quantity: number): Promise<boolean> => {
    await delay(300);
    let all = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS) || '[]') as Subscription[];
    
    const index = all.findIndex(s => s.userId === userId && s.productId === productId);
    
    if (quantity <= 0) {
        // Remove subscription
        if (index !== -1) {
            all.splice(index, 1);
        }
    } else {
        // Add or Update
        if (index !== -1) {
            all[index].quantity = quantity;
        } else {
            all.push({ userId, productId, quantity });
        }
    }
    
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(all));
    
    // Sync changes to future calendar days so they appear on dashboard immediately
    syncFutureDeliveries(userId);
    
    return true;
  },

  // Deprecated: Use updateSubscription instead
  addSubscription: async (userId: string, productId: string): Promise<boolean> => {
    return DbService.updateSubscription(userId, productId, 1);
  },

  getMonthlyDeliveries: async (userId: string, year: number, month: number): Promise<DeliveryDay[]> => {
    await delay(300);
    const store = JSON.parse(localStorage.getItem(STORAGE_KEYS.DELIVERIES) || '{}');
    const key = `${year}-${String(month + 1).padStart(2, '0')}`;
    
    // Ensure user entry exists
    if (!store[userId]) store[userId] = {};
    
    // If month data doesn't exist, generate and save it
    if (!store[userId][key]) {
        // Get user subscriptions for generation
        const subsRaw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
        const allSubs = subsRaw ? JSON.parse(subsRaw) as Subscription[] : [];
        const userSubs = allSubs.filter(s => s.userId === userId);
        
        // Default items if no subscriptions, otherwise use subscriptions
        const items = userSubs.length > 0 
            ? userSubs.map(s => ({ productId: s.productId, quantity: s.quantity }))
            : []; // No items if no sub

        const days = generateMockCalendar(year, month);
        
        // Apply subscribed items to the generated days
        const daysWithItems = days.map(d => ({
            ...d,
            items: items.length > 0 ? items : d.items
        }));

        store[userId][key] = daysWithItems;
        localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(store));
    }
    
    return store[userId][key];
  },

  updateDeliveryStatus: async (userId: string, date: string, status: 'skipped' | 'pending' | 'delivered'): Promise<boolean> => {
    await delay(200);
    const store = JSON.parse(localStorage.getItem(STORAGE_KEYS.DELIVERIES) || '{}');
    const [y, m] = date.split('-'); // 2023-10-05 -> 2023, 10
    const key = `${y}-${m}`;
    
    if (store[userId] && store[userId][key]) {
        const days = store[userId][key] as DeliveryDay[];
        const dayIndex = days.findIndex(d => d.date === date);
        if (dayIndex >= 0) {
            days[dayIndex].status = status;
            localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(store));
            return true;
        }
    }
    return false;
  },
  
  authenticate: async (email: string, role: Role): Promise<User | undefined> => {
      await delay(500);
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]') as User[];
      
      // Demo backdoor for generic demo login
      if (email === 'demo') {
          return users.find(u => u.role === role);
      }
      
      return users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
  },
  
  updateUser: async (updatedUser: User): Promise<void> => {
      await delay(300);
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]') as User[];
      const index = users.findIndex(u => u.id === updatedUser.id);
      if (index !== -1) {
          users[index] = updatedUser;
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      }
  },

  getNotifications: async (userId: string): Promise<Notification[]> => {
    await delay(300);
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]') as Notification[];
    // Filter by userId or return broadcast messages (no userId)
    return all.filter(n => !n.userId || n.userId === userId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  addNotification: async (notification: Notification): Promise<void> => {
    await delay(200);
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]') as Notification[];
    all.unshift(notification);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
  },

  markNotificationRead: async (id: string): Promise<void> => {
      await delay(200);
      const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]') as Notification[];
      const index = all.findIndex(n => n.id === id);
      if(index !== -1) {
          all[index].read = true;
          localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
      }
  },

  getAdminStats: async () => {
      await delay(500);
      const bills = JSON.parse(localStorage.getItem(STORAGE_KEYS.BILLS) || '[]') as Bill[];
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]') as User[];
      
      const totalRevenue = bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0);
      const pendingRevenue = bills.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.amount, 0);
      const activeUsers = users.filter(u => u.role === 'user').length;
      
      return { totalRevenue, pendingRevenue, activeUsers };
  }
};
