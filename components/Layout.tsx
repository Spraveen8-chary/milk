
import React from 'react';
import { useAuth } from '../authContext';
import { useTheme } from '../themeContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  CreditCard, 
  Calendar, 
  Settings, 
  LogOut, 
  Bell,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const adminNav: NavItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Users', icon: Users, path: '/admin/users' },
    { label: 'Products', icon: Package, path: '/admin/products' },
    { label: 'Billing', icon: CreditCard, path: '/admin/billing' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const userNav: NavItem[] = [
    { label: 'Home', icon: LayoutDashboard, path: '/user/dashboard' },
    { label: 'Products', icon: Package, path: '/user/products' },
    { label: 'Calendar', icon: Calendar, path: '/user/calendar' },
    { label: 'Billing', icon: CreditCard, path: '/user/billing' },
    { label: 'Profile', icon: Settings, path: '/user/profile' },
  ];

  const navItems = user?.role === 'admin' ? adminNav : userNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-screen sticky top-0 transition-colors duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">U</div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">Universal Milk</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          
          <div className="flex items-center gap-3 px-4 py-3">
            <img src={user?.avatar} alt="User" className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600" />
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-slate-800 h-16 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sticky top-0 z-20 transition-colors duration-200">
        <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">U</div>
             <span className="font-bold text-slate-800 dark:text-white">Universal Milk</span>
        </div>
        <div className="flex items-center gap-4">
             <button onClick={toggleTheme} className="text-slate-600 dark:text-slate-400">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <button onClick={() => navigate('/user/notifications')} className="text-slate-600 dark:text-slate-400">
                <Bell size={20} />
             </button>
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 dark:text-slate-400">
                 {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        {children}
      </main>

      {/* Mobile Bottom Navigation (Sticky) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-30 pb-safe transition-colors duration-200">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                location.pathname === item.path
                  ? 'text-primary'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Mobile Menu Overlay for Extra Items */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="absolute right-0 top-16 bottom-0 w-64 bg-white dark:bg-slate-800 p-4 shadow-xl border-l border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-6 p-2 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <img src={user?.avatar} alt="User" className="w-10 h-10 rounded-full" />
                    <div>
                        <p className="font-medium text-slate-900 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 dark:text-red-400 w-full p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </div>
      )}
    </div>
  );
};
