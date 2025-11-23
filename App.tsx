
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './authContext';
import { ThemeProvider } from './themeContext';
import { Layout } from './components/Layout';
import { StatCard } from './components/DashboardComponents';
import { DbService } from './services/mockService';
import { Product, Bill, DeliveryDay, User, Notification, Subscription } from './types';
import { 
  DollarSign, 
  Users, 
  Droplets, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  QrCode,
  CreditCard,
  User as UserIcon,
  Phone,
  MapPin,
  Save,
  Camera,
  Loader2,
  Bell
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// --- Login Page ---
const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('john@example.com');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
        const success = await login(email || 'demo', role);
        if (success) {
          navigate(role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
        } else {
          setError('Invalid credentials');
        }
    } catch (e) {
        setError('Login failed');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200">
        <div className="bg-primary p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Universal Milk</h1>
          <p className="text-blue-100">Fresh delivery management system</p>
        </div>
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => { setRole('user'); setEmail('john@example.com'); }}
                  className={`py-2 text-sm font-medium rounded-md transition-all ${role === 'user' ? 'bg-white dark:bg-slate-600 shadow text-primary dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => { setRole('admin'); setEmail('admin@universalmilk.com'); }}
                  className={`py-2 text-sm font-medium rounded-md transition-all ${role === 'admin' ? 'bg-white dark:bg-slate-600 shadow text-primary dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  Admin
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email / Phone</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'admin' ? "admin@universalmilk.com" : "john@example.com"}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>

            {error && <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</div>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex justify-center items-center"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider text-center">Click to Auto-fill Demo Credentials</p>
            <div className="grid grid-cols-2 gap-3">
                <div 
                    onClick={() => { setRole('admin'); setEmail('admin@universalmilk.com'); }}
                    className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer hover:border-primary hover:bg-blue-50 dark:hover:bg-slate-600 transition text-center group"
                >
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary dark:group-hover:text-blue-400">Admin</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">admin@universalmilk.com</p>
                </div>
                <div 
                    onClick={() => { setRole('user'); setEmail('john@example.com'); }}
                    className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer hover:border-primary hover:bg-blue-50 dark:hover:bg-slate-600 transition text-center group"
                >
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary dark:group-hover:text-blue-400">User</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">john@example.com</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Admin Dashboard ---
const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, pendingRevenue: 0, activeUsers: 0 });
  const data = [
    { name: 'Week 1', revenue: 4000 },
    { name: 'Week 2', revenue: 3000 },
    { name: 'Week 3', revenue: 2000 },
    { name: 'Week 4', revenue: 2780 },
    { name: 'Week 5', revenue: 1890 },
  ];

  useEffect(() => {
    DbService.getAdminStats().then(setStats);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
        <span className="text-sm text-slate-500 dark:text-slate-400">{new Date().toLocaleDateString()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} trend="+12.5%" trendUp icon={DollarSign} color="bg-primary" />
        <StatCard title="Active Customers" value={stats.activeUsers.toString()} trend="+3" trendUp icon={Users} color="bg-accent" />
        <StatCard title="Daily Delivery" value="280 L" trend="-2 L" trendUp={false} icon={Droplets} color="bg-blue-400" />
        <StatCard title="Pending Payments" value={`₹${stats.pendingRevenue}`} icon={AlertCircle} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-200">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-200">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Stock Overview</h3>
          <div className="space-y-4">
            {[
                { label: 'Cow Milk', total: 300, sold: 240 },
                { label: 'Buffalo Milk', total: 100, sold: 85 },
                { label: 'Paneer', total: 50, sold: 42 }
            ].map((item) => (
                <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                        <span className="text-slate-500 dark:text-slate-400">{item.sold}/{item.total} units</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(item.sold / item.total) * 100}%` }}></div>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- User Dashboard ---
const UserDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bills, setBills] = useState<Bill[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [nextDelivery, setNextDelivery] = useState<DeliveryDay | null>(null);
    const [loadingNext, setLoadingNext] = useState(false);
    const [currentMonthAccrued, setCurrentMonthAccrued] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            if (!user) return;
            setLoadingNext(true);

            // Fetch products for pricing
            const prods = await DbService.getProducts();
            setProducts(prods);

            // Fetch bills
            const userBills = await DbService.getBills(user.id);
            setBills(userBills);
            
            const today = new Date();
            const tYear = today.getFullYear();
            const tMonth = today.getMonth();

            // 1. Get Next Delivery (Tomorrow)
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            
            const tomorrowYear = tomorrow.getFullYear();
            const tomorrowMonth = tomorrow.getMonth();
            const dateStr = `${tomorrowYear}-${String(tomorrowMonth + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
            
            // Fetch delivery for tomorrow's month
            const nextMonthData = await DbService.getMonthlyDeliveries(user.id, tomorrowYear, tomorrowMonth);
            const targetDay = nextMonthData.find(d => d.date === dateStr);
            setNextDelivery(targetDay || null);

            // 2. Calculate Current Month Accrued Amount (delivered items so far this month)
            // Fetch current month data
            const currentMonthData = await DbService.getMonthlyDeliveries(user.id, tYear, tMonth);
            const accrued = currentMonthData.reduce((total, day) => {
                if (day.status === 'delivered') {
                    const dayCost = day.items.reduce((dTotal, item) => {
                        const p = prods.find(prod => prod.id === item.productId);
                        return dTotal + (item.quantity * (p?.price || 0));
                    }, 0);
                    return total + dayCost;
                }
                return total;
            }, 0);
            setCurrentMonthAccrued(accrued);

            setLoadingNext(false);
        };
        loadData();
    }, [user]);

    const handleSkipNext = async () => {
        if(!user || !nextDelivery) return;
        
        const newStatus = 'skipped';
        await DbService.updateDeliveryStatus(user.id, nextDelivery.date, newStatus);
        
        // Add Notification
        const notif: Notification = {
            id: Date.now().toString(),
            userId: user.id,
            title: 'Delivery Skipped',
            message: `Your delivery for ${new Date(nextDelivery.date).toLocaleDateString()} has been skipped.`,
            date: new Date().toISOString().split('T')[0],
            read: false,
            type: 'info'
        };
        await DbService.addNotification(notif);
        
        // Update Local State
        setNextDelivery({...nextDelivery, status: newStatus});
    };

    const currentBill = bills.find(b => b.status === 'pending');
    
    // Total Due = Pending Bills + Current Month Accrued
    const pendingBillsAmount = bills.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.amount, 0);
    const totalPayable = pendingBillsAmount + currentMonthAccrued;

    // Helper to get product name from ID
    const getProductName = (id: string) => {
        const p = products.find(prod => prod.id === id);
        return p ? `${p.name} (${p.unit})` : 'Unknown Product';
    };

    return (
        <div className="space-y-6">
             <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden transition-colors duration-200">
                <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 dark:bg-primary/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Hello, {user?.name}</h1>
                    <p className="text-slate-500 dark:text-slate-400">Welcome back to Universal Milk</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-white">Total Payable</h3>
                        {pendingBillsAmount > 0 && <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-xs font-medium">Overdue Bills</span>}
                    </div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">₹{totalPayable}</div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        {pendingBillsAmount > 0 
                          ? `Includes ₹${pendingBillsAmount} pending dues + current month` 
                          : 'Current month accrued amount'}
                    </p>
                    <button onClick={() => navigate('/user/billing')} className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">Pay Now</button>
                 </div>

                 <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-200 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800 dark:text-white">Next Delivery</h3>
                            <div className={`p-2 rounded-full ${nextDelivery?.status === 'skipped' ? 'bg-red-100 text-red-600' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                                {nextDelivery?.status === 'skipped' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg mt-1">
                                <Droplets className="text-primary" size={24} />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">Tomorrow Morning</p>
                                {loadingNext ? (
                                    <div className="h-4 w-32 bg-slate-200 animate-pulse rounded mt-1"></div>
                                ) : (
                                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        {nextDelivery && nextDelivery.items.length > 0 ? (
                                            nextDelivery.items.map((item, idx) => (
                                                <div key={idx} className="flex gap-1">
                                                    <span className="font-semibold">{item.quantity}x</span> 
                                                    <span>{getProductName(item.productId)}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <span>No items scheduled</span>
                                        )}
                                        {nextDelivery?.status === 'skipped' && <span className="text-red-500 font-medium block mt-1">(Skipped)</span>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button 
                            onClick={handleSkipNext} 
                            disabled={nextDelivery?.status === 'skipped'}
                            className={`flex-1 py-2 text-sm rounded-lg font-medium transition-colors ${nextDelivery?.status === 'skipped' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'}`}
                        >
                            {nextDelivery?.status === 'skipped' ? 'Skipped' : 'Skip'}
                        </button>
                        <button 
                            onClick={() => navigate('/user/products')} 
                            className="flex-1 py-2 text-sm text-primary dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg font-medium"
                        >
                            Add Items
                        </button>
                    </div>
                 </div>
             </div>

             <h3 className="font-bold text-lg text-slate-800 dark:text-white mt-8">Recent Activity</h3>
             <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm divide-y divide-slate-100 dark:divide-slate-700 transition-colors duration-200">
                 {[1,2,3].map((i) => (
                     <div key={i} className="p-4 flex items-center gap-4">
                         <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-full text-slate-400 dark:text-slate-500">
                             <CheckCircle size={18} />
                         </div>
                         <div className="flex-1">
                             <p className="text-sm font-medium text-slate-900 dark:text-white">Delivery Completed</p>
                             <p className="text-xs text-slate-500 dark:text-slate-400">Today, 7:00 AM</p>
                         </div>
                         <span className="text-sm font-medium text-slate-900 dark:text-white">₹60</span>
                     </div>
                 ))}
             </div>
        </div>
    );
}

// --- User Calendar ---
const UserCalendar = () => {
    const { user } = useAuth();
    const [date, setDate] = useState(new Date());
    const [deliveries, setDeliveries] = useState<DeliveryDay[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
             if(user) {
                 const prods = await DbService.getProducts();
                 setProducts(prods);
                 const data = await DbService.getMonthlyDeliveries(user.id, date.getFullYear(), date.getMonth());
                 setDeliveries(data);
             }
        };
        fetchData();
    }, [date, user]);

    // Calculate today's date string safely in local time to match calendar generation
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const handleSkip = (dayDate: string) => {
        if(!user) return;
        
        // Prevent modification of past days
        // We use string comparison here which works because Format is YYYY-MM-DD
        if (dayDate < todayStr) {
             return; 
        }

        const d = deliveries.find(d => d.date === dayDate);
        if (d && d.status !== 'delivered') {
            const newStatus = d.status === 'skipped' ? 'pending' : 'skipped';
            DbService.updateDeliveryStatus(user.id, dayDate, newStatus).then((success) => {
                if(success) {
                    setDeliveries(prev => prev.map(item => item.date === dayDate ? {...item, status: newStatus} : item));
                }
            });
        }
    };

    const getDayClass = (status: string, isPast: boolean) => {
        if (isPast) {
            switch(status) {
                case 'delivered': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 opacity-80';
                case 'skipped': return 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border-red-100 dark:border-red-900/50 opacity-60';
                default: return 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700';
            }
        }
        
        switch(status) {
            case 'delivered': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
            case 'skipped': return 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border-red-100 dark:border-red-900/50';
            default: return 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-700 hover:border-primary dark:hover:border-primary';
        }
    };
    
    // Calculate Monthly Total (Only for Delivered items in selected month)
    const monthlyTotal = deliveries.reduce((total, day) => {
        if (day.status === 'delivered') {
            const dayCost = day.items.reduce((dTotal, item) => {
                const p = products.find(prod => prod.id === item.productId);
                return dTotal + (item.quantity * (p?.price || 0));
            }, 0);
            return total + dayCost;
        }
        return total;
    }, 0);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Delivery Calendar</h1>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
                    <button onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="font-medium text-slate-700 dark:text-slate-300 min-w-[120px] text-center">
                        {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {/* Empty placeholders for start of month */
                  Array.from({ length: new Date(date.getFullYear(), date.getMonth(), 1).getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))
                }
                {deliveries.map((day) => {
                    const dayNum = parseInt(day.date.split('-')[2]);
                    // Check local time string consistency
                    const isToday = day.date === todayStr;
                    const isPast = day.date < todayStr;

                    return (
                        <div 
                            key={day.date}
                            onClick={() => handleSkip(day.date)}
                            className={`
                                relative aspect-square rounded-xl border p-1 flex flex-col items-center justify-center transition-all
                                ${getDayClass(day.status, isPast)}
                                ${isToday ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900' : ''}
                                ${isPast ? 'cursor-default' : 'cursor-pointer'}
                            `}
                        >
                            <span className="text-sm font-bold">{dayNum}</span>
                            <div className="mt-1 flex gap-0.5">
                                {day.status === 'delivered' && <CheckCircle size={12} />}
                                {day.status === 'skipped' && <XCircle size={12} />}
                                {day.status === 'pending' && <div className="w-2 h-2 bg-primary rounded-full" />}
                            </div>
                            
                            {/* Visual cue for skip action only on future/today pending dates */}
                            {day.status === 'pending' && !isPast && (
                                <div className="absolute inset-0 bg-red-500/10 opacity-0 hover:opacity-100 rounded-xl flex items-center justify-center text-red-600 text-xs font-bold backdrop-blur-[1px] transition-opacity">
                                    Skip
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400 mt-4 justify-center">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800"></div> Delivered</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"></div> Pending</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-50 dark:bg-red-900/50 border border-red-100 dark:border-red-900"></div> Skipped</div>
            </div>
            
            <div className="mt-6 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex justify-between items-center transition-colors duration-200">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Amount for {date.toLocaleDateString('en-US', { month: 'long' })}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Based on delivered items</p>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    ₹{monthlyTotal}
                </div>
            </div>
        </div>
    );
};

// --- Notifications Page ---
const NotificationsPage = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    
    useEffect(() => {
        if(user) DbService.getNotifications(user.id).then(setNotifications);
    }, [user]);

    const handleRead = (id: string) => {
        DbService.markNotificationRead(id).then(() => {
            setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n));
        });
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
             <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Notifications</h1>
             <div className="space-y-3">
                {notifications.length > 0 ? (
                    notifications.map(n => (
                        <div 
                            key={n.id} 
                            onClick={() => handleRead(n.id)} 
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex gap-4 ${n.read ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700' : 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/50'}`}
                        >
                            <div className={`mt-1 min-w-[32px] w-8 h-8 rounded-full flex items-center justify-center ${n.type === 'alert' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                {n.type === 'alert' ? <AlertCircle size={16} /> : <Bell size={16} />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`text-sm font-bold ${n.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>{n.title}</h4>
                                    <span className="text-xs text-slate-400">{new Date(n.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{n.message}</p>
                            </div>
                            {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-slate-400">
                        <Bell size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No notifications yet</p>
                    </div>
                )}
             </div>
        </div>
    );
};

// --- Products Page (Shared) ---
const ProductsPage = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState<string | null>(null); // productId being processed
    
    useEffect(() => {
        DbService.getProducts().then(setProducts);
        if (user) {
            DbService.getSubscriptions(user.id).then(setSubscriptions);
        }
    }, [user]);

    const handleUpdateQuantity = async (product: Product, newQuantity: number) => {
        if (!user) return;
        setLoading(product.id);
        
        // Optimistic update
        const prevSubs = [...subscriptions];
        
        // Update local state temporarily
        if (newQuantity <= 0) {
            setSubscriptions(prev => prev.filter(s => s.productId !== product.id));
        } else {
            setSubscriptions(prev => {
                const idx = prev.findIndex(s => s.productId === product.id);
                if (idx > -1) {
                    const next = [...prev];
                    next[idx].quantity = newQuantity;
                    return next;
                }
                return [...prev, { userId: user.id, productId: product.id, quantity: newQuantity }];
            });
        }

        const success = await DbService.updateSubscription(user.id, product.id, newQuantity);
        
        if (success) {
            // Re-fetch to be sure
            const newSubs = await DbService.getSubscriptions(user.id);
            setSubscriptions(newSubs);
            
            // Notification logic (only if adding new subscription)
            const wasSubscribed = prevSubs.some(s => s.productId === product.id);
            if (!wasSubscribed && newQuantity > 0) {
                 await DbService.addNotification({
                    id: Date.now().toString(),
                    userId: user.id,
                    title: 'Subscription Added',
                    message: `You have successfully subscribed to ${product.name}.`,
                    date: new Date().toISOString().split('T')[0],
                    read: false,
                    type: 'success'
                });
            }
        } else {
            // Revert on failure
            setSubscriptions(prevSubs);
        }
        setLoading(null);
    };

    const getSubscription = (productId: string) => subscriptions.find(s => s.productId === productId);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Our Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(p => {
                    const sub = getSubscription(p.id);
                    const qty = sub ? sub.quantity : 0;
                    
                    return (
                        <div key={p.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col">
                            <div className="h-48 overflow-hidden bg-slate-100 dark:bg-slate-700 relative group">
                                <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">{p.category}</span>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{p.name}</h3>
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg text-sm">₹{p.price}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{p.description}</p>
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-700">
                                     {qty > 0 ? (
                                        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 rounded-lg p-1">
                                            <button 
                                                onClick={() => handleUpdateQuantity(p, qty - 1)}
                                                disabled={loading === p.id}
                                                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-600 rounded-md shadow-sm text-slate-600 dark:text-white hover:text-red-500 disabled:opacity-50"
                                            >
                                                <Minus size={18} />
                                            </button>
                                            <span className="font-bold text-lg text-slate-900 dark:text-white w-12 text-center">
                                                {loading === p.id ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : qty}
                                            </span>
                                            <button 
                                                onClick={() => handleUpdateQuantity(p, qty + 1)}
                                                disabled={loading === p.id}
                                                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-600 rounded-md shadow-sm text-slate-600 dark:text-white hover:text-green-500 disabled:opacity-50"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                     ) : (
                                        <button 
                                            onClick={() => handleUpdateQuantity(p, 1)}
                                            disabled={loading === p.id}
                                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all duration-200 bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 shadow-lg shadow-slate-200 dark:shadow-none hover:shadow-xl active:scale-[0.98]"
                                        >
                                            {loading === p.id ? <Loader2 className="animate-spin" size={18} /> : <><Plus size={18} /> Subscribe</>}
                                        </button>
                                     )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Profile Page ---
const UserProfile = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
    });
    
    // Subscription Data
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            });
            // Fetch subs
            DbService.getSubscriptions(user.id).then(setSubscriptions);
            DbService.getProducts().then(setProducts);
        }
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            await updateProfile({
                ...user,
                ...formData
            });
            setIsEditing(false);
        } catch (e) {
            console.error("Failed to update profile", e);
        } finally {
            setIsSaving(false);
        }
    };
    
    // Helper to enrich subscription data
    const enrichedSubscriptions = subscriptions.map(sub => {
        const product = products.find(p => p.id === sub.productId);
        return {
            ...sub,
            product,
            cost: (product?.price || 0) * sub.quantity
        };
    }).filter(item => item.product); // remove if product not found

    const totalDailyCost = enrichedSubscriptions.reduce((acc, curr) => acc + curr.cost, 0);

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
             <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Profile</h1>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="text-primary font-medium hover:underline">Edit Details</button>
                )}
             </div>

             <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-200">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <div className="px-6 pb-6 relative">
                    <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full p-1 -mt-12 mb-4 relative group">
                        <img src={user?.avatar} alt={user?.name} className="w-full h-full rounded-full object-cover" />
                        {isEditing && (
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer">
                                <Camera className="text-white" size={24} />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
                                {isEditing ? (
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-3 text-slate-400" size={18} />
                                        <input 
                                            type="text" 
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none" 
                                        />
                                    </div>
                                ) : (
                                    <p className="text-slate-900 dark:text-white font-medium">{formData.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Phone Number</label>
                                {isEditing ? (
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                                        <input 
                                            type="text" 
                                            value={formData.phone}
                                            onChange={e => setFormData({...formData, phone: e.target.value})}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none" 
                                        />
                                    </div>
                                ) : (
                                    <p className="text-slate-900 dark:text-white font-medium">{formData.phone}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
                            <p className="text-slate-900 dark:text-white font-medium">{formData.email}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Delivery Address</label>
                            {isEditing ? (
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <textarea 
                                        value={formData.address}
                                        onChange={e => setFormData({...formData, address: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none h-24" 
                                    />
                                </div>
                            ) : (
                                <p className="text-slate-900 dark:text-white font-medium">{formData.address}</p>
                            )}
                        </div>

                        {isEditing && (
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <button 
                                    onClick={() => { setIsEditing(false); setFormData({name: user?.name || '', email: user?.email || '', phone: user?.phone || '', address: user?.address || ''}) }} 
                                    className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave} 
                                    disabled={isSaving}
                                    className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
             </div>
             
             {/* Subscriptions Section */}
             <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 transition-colors duration-200">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">My Subscriptions</h3>
                
                {enrichedSubscriptions.length > 0 ? (
                    <div className="space-y-4">
                        {enrichedSubscriptions.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                <img src={item.product?.image} alt={item.product?.name} className="w-12 h-12 rounded-lg object-cover" />
                                <div className="flex-1">
                                    <p className="font-medium text-slate-900 dark:text-white">{item.product?.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Qty: {item.quantity} x {item.product?.unit}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900 dark:text-white">₹{item.cost}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">per day</p>
                                </div>
                            </div>
                        ))}
                        
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <span className="font-medium text-slate-600 dark:text-slate-400">Total Daily Cost</span>
                            <span className="text-xl font-bold text-primary dark:text-blue-400">₹{totalDailyCost}</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-6 text-slate-500">
                        <p>No active subscriptions.</p>
                    </div>
                )}
                
                <button 
                    onClick={() => navigate('/user/products')} 
                    className="w-full mt-6 py-3 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                >
                    Add Items
                </button>
             </div>
        </div>
    );
};

// --- Billing Page ---
const BillingPage = () => {
    const { user } = useAuth();
    const [bills, setBills] = useState<Bill[]>([]);
    const upiId = "9390425742@ybl";
    
    useEffect(() => {
        if(user) DbService.getBills(user.id).then(setBills);
    }, [user]);

    const currentBill = bills.find(b => b.status === 'pending');
    const paidBills = bills.filter(b => b.status === 'paid');

    return (
        <div className="space-y-6">
             <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Billing & Payments</h1>
             
             {user?.role === 'user' ? (
                <>
                    <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="text-center md:text-left">
                                <p className="text-blue-100 mb-1">Total Due Amount</p>
                                <h2 className="text-4xl font-bold">₹{currentBill?.amount || 0}</h2>
                                <p className="text-sm text-blue-100 mt-2">Due by {currentBill ? new Date(currentBill.dueDate).toLocaleDateString() : 'N/A'}</p>
                                <div className="mt-6">
                                     <button className="bg-white text-primary font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition w-full md:w-auto">
                                        Pay via UPI
                                     </button>
                                     <p className="mt-2 text-sm text-blue-100 font-mono">UPI: {upiId}</p>
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded-xl shadow-inner max-w-[240px] flex flex-col items-center">
                                {/* Using placeholder QR code but captioned with user name */}
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiId}&pn=Universal%20Milk&am=${currentBill?.amount || 0}.00&cu=INR`} 
                                    alt="Payment QR Code" 
                                    className="w-full h-auto rounded-lg mix-blend-multiply" 
                                />
                                <div className="mt-2 text-center">
                                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold mx-auto mb-1 border-2 border-white shadow-sm">
                                        पे
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wide">{user.name}</p>
                                    <p className="text-[9px] text-slate-500 font-mono">Scan to Pay</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <h3 className="font-bold text-lg mt-8 mb-4 text-slate-800 dark:text-white">Payment History</h3>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-200">
                        {paidBills.length > 0 ? paidBills.map((bill, i) => (
                            <div key={i} className="flex justify-between items-center p-4 border-b border-slate-50 dark:border-slate-700 last:border-0">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Bill for {bill.month}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Paid on {bill.dueDate}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900 dark:text-white">- ₹{bill.amount}</p>
                                    <p className="text-xs text-green-600 dark:text-green-400 font-medium uppercase">Success</p>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-slate-500">No payment history found</div>
                        )}
                    </div>
                </>
             ) : (
                 <div className="bg-white dark:bg-slate-800 p-8 text-center rounded-xl border border-slate-100 dark:border-slate-700 transition-colors duration-200">
                     <div className="mx-auto w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-primary mb-4">
                        <CreditCard size={32} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white">Admin Billing Panel</h3>
                     <p className="text-slate-500 dark:text-slate-400 mt-2">Generate monthly bills and track user payments here.</p>
                     <button className="mt-6 bg-primary text-white px-6 py-2 rounded-lg font-medium">Generate October Bills</button>
                 </div>
             )}
        </div>
    );
};

// --- Protected Route Wrapper ---
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole?: 'admin' | 'user' }> = ({ children, allowedRole }) => {
    const { user, isLoading } = useAuth();
    
    if (isLoading) return <div className="flex items-center justify-center h-screen text-primary bg-slate-50 dark:bg-slate-900">Loading...</div>;
    
    if (!user) return <Navigate to="/login" replace />;
    
    if (allowedRole && user.role !== allowedRole) {
        // Redirect to their respective dashboard if trying to access wrong area
        return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />;
    }

    return <Layout>{children}</Layout>;
};

// --- Main App Component ---
const App = () => {
  return (
    <ThemeProvider>
        <HashRouter>
        <AuthProvider>
            <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRole="admin"><div>Users List</div></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute allowedRole="admin"><ProductsPage /></ProtectedRoute>} />
            <Route path="/admin/billing" element={<ProtectedRoute allowedRole="admin"><BillingPage /></ProtectedRoute>} />
            
            {/* User Routes */}
            <Route path="/user/dashboard" element={<ProtectedRoute allowedRole="user"><UserDashboard /></ProtectedRoute>} />
            <Route path="/user/products" element={<ProtectedRoute allowedRole="user"><ProductsPage /></ProtectedRoute>} />
            <Route path="/user/calendar" element={<ProtectedRoute allowedRole="user"><UserCalendar /></ProtectedRoute>} />
            <Route path="/user/billing" element={<ProtectedRoute allowedRole="user"><BillingPage /></ProtectedRoute>} />
            <Route path="/user/profile" element={<ProtectedRoute allowedRole="user"><UserProfile /></ProtectedRoute>} />
            <Route path="/user/notifications" element={<ProtectedRoute allowedRole="user"><NotificationsPage /></ProtectedRoute>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </AuthProvider>
        </HashRouter>
    </ThemeProvider>
  );
};

export default App;
