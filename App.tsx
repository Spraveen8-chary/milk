import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './authContext';
import { ThemeProvider } from './themeContext';
import { Layout } from './components/Layout';
import { StatCard } from './components/DashboardComponents';
import { MockService } from './services/mockService';
import { Product, Bill, DeliveryDay, User } from './types';
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
  QrCode,
  CreditCard,
  User as UserIcon,
  Phone,
  MapPin,
  Save,
  Camera
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// --- Login Page ---
const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('john@example.com');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, allow easy login
    const success = login(email || 'demo', role);
    if (success) {
      navigate(role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    } else {
      setError('Invalid credentials');
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
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
            >
              Sign In
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
  const data = [
    { name: 'Week 1', revenue: 4000 },
    { name: 'Week 2', revenue: 3000 },
    { name: 'Week 3', revenue: 2000 },
    { name: 'Week 4', revenue: 2780 },
    { name: 'Week 5', revenue: 1890 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
        <span className="text-sm text-slate-500 dark:text-slate-400">{new Date().toLocaleDateString()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value="₹42,500" trend="+12.5%" trendUp icon={DollarSign} color="bg-primary" />
        <StatCard title="Active Customers" value="142" trend="+3" trendUp icon={Users} color="bg-accent" />
        <StatCard title="Daily Delivery" value="280 L" trend="-2 L" trendUp={false} icon={Droplets} color="bg-blue-400" />
        <StatCard title="Pending Payments" value="₹8,200" icon={AlertCircle} color="bg-orange-500" />
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
    const [bills, setBills] = useState<Bill[]>([]);

    useEffect(() => {
        if(user) MockService.getBills(user.id).then(setBills);
    }, [user]);

    const currentBill = bills.find(b => b.status === 'pending');

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
                        <h3 className="font-bold text-slate-800 dark:text-white">Current Bill</h3>
                        <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-xs font-medium">Due in 5 days</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">₹{currentBill?.amount || 0}</div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">For {currentBill?.month || 'Current Month'}</p>
                    <button className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">Pay Now</button>
                 </div>

                 <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-white">Next Delivery</h3>
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400"><CheckCircle size={16} /></div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
                            <Droplets className="text-primary" size={24} />
                        </div>
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">Tomorrow Morning</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">1L Cow Milk, 200g Paneer</p>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button className="flex-1 py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg font-medium">Skip</button>
                        <button className="flex-1 py-2 text-sm text-primary dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg font-medium">Add Items</button>
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
    const [date, setDate] = useState(new Date());
    const [deliveries, setDeliveries] = useState<DeliveryDay[]>([]);
    
    useEffect(() => {
        MockService.getMonthlyDeliveries(date.getFullYear(), date.getMonth()).then(setDeliveries);
    }, [date]);

    const handleSkip = (dayDate: string) => {
        const d = deliveries.find(d => d.date === dayDate);
        if (d && d.status !== 'delivered') {
            const newStatus = d.status === 'skipped' ? 'pending' : 'skipped';
            MockService.updateDeliveryStatus(dayDate, newStatus).then(() => {
                setDeliveries(prev => prev.map(item => item.date === dayDate ? {...item, status: newStatus} : item));
            });
        }
    };

    const getDayClass = (status: string) => {
        switch(status) {
            case 'delivered': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
            case 'skipped': return 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border-red-100 dark:border-red-900/50 opacity-60';
            default: return 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-700 hover:border-primary dark:hover:border-primary';
        }
    };

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
                    const isToday = new Date().toDateString() === new Date(day.date).toDateString();

                    return (
                        <div 
                            key={day.date}
                            onClick={() => handleSkip(day.date)}
                            className={`
                                relative aspect-square rounded-xl border p-1 flex flex-col items-center justify-center cursor-pointer transition-all
                                ${getDayClass(day.status)}
                                ${isToday ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900' : ''}
                            `}
                        >
                            <span className="text-sm font-bold">{dayNum}</span>
                            <div className="mt-1 flex gap-0.5">
                                {day.status === 'delivered' && <CheckCircle size={12} />}
                                {day.status === 'skipped' && <XCircle size={12} />}
                                {day.status === 'pending' && <div className="w-2 h-2 bg-primary rounded-full" />}
                            </div>
                            
                            {/* Visual cue for skip action */}
                            {day.status === 'pending' && (
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
        </div>
    );
};

// --- Products Page (Shared) ---
const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    
    useEffect(() => {
        MockService.getProducts().then(setProducts);
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Our Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(p => (
                    <div key={p.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all duration-200">
                        <div className="h-48 overflow-hidden bg-slate-100 dark:bg-slate-700">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">{p.category}</span>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{p.name}</h3>
                                </div>
                                <span className="font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-lg">₹{p.price}</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{p.description}</p>
                            <button className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-700 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition">
                                <Plus size={18} /> Subscribe
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Profile Page ---
const UserProfile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
    });

    const handleSave = () => {
        // Mock save functionality
        setIsEditing(false);
        // Would typically call update API here
    };

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
                                <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">Cancel</button>
                                <button onClick={handleSave} className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </div>
             </div>
        </div>
    );
};

// --- Billing Page ---
const BillingPage = () => {
    const { user } = useAuth();
    
    return (
        <div className="space-y-6">
             <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Billing & Payments</h1>
             
             {user?.role === 'user' ? (
                <>
                    <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="text-center md:text-left">
                                <p className="text-blue-100 mb-1">Total Due Amount</p>
                                <h2 className="text-4xl font-bold">₹1,920</h2>
                                <p className="text-sm text-blue-100 mt-2">Due by 05 Nov 2023</p>
                                <div className="mt-6">
                                     <button className="bg-white text-primary font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition w-full md:w-auto">
                                        Pay via UPI
                                     </button>
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded-xl shadow-inner max-w-[200px]">
                                {/* Using the requested QR code image or a placeholder that represents it */}
                                <img 
                                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=universalmilk@upi&pn=Universal%20Milk&am=1920.00&cu=INR" 
                                    alt="Payment QR Code" 
                                    className="w-full h-auto rounded-lg mix-blend-multiply" 
                                />
                                <p className="text-center text-xs text-slate-500 mt-2 font-mono">Scan to Pay</p>
                            </div>
                        </div>
                    </div>
                    
                    <h3 className="font-bold text-lg mt-8 mb-4 text-slate-800 dark:text-white">Payment History</h3>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-200">
                        {[
                            { date: '05 Oct 2023', amount: 1850, status: 'Success' },
                            { date: '05 Sep 2023', amount: 1800, status: 'Success' },
                        ].map((tx, i) => (
                            <div key={i} className="flex justify-between items-center p-4 border-b border-slate-50 dark:border-slate-700 last:border-0">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Monthly Bill Payment</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{tx.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900 dark:text-white">- ₹{tx.amount}</p>
                                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">{tx.status}</p>
                                </div>
                            </div>
                        ))}
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
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </AuthProvider>
        </HashRouter>
    </ThemeProvider>
  );
};

export default App;