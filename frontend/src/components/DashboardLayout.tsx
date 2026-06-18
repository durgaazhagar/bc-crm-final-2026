import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, Users, Droplets, Hospital, Calendar, Shield, MapPin, BarChart3, 
  Bell, Menu, X, LogOut, Settings, Search, User
} from 'lucide-react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigationItems = [
    { icon: Home, label: 'Home', path: '/dashboard/home', color: 'from-blue-500 to-cyan-500' },
    { icon: Users, label: 'Donors', path: '/dashboard/donors', color: 'from-red-500 to-pink-500' },
    { icon: Droplets, label: 'Inventory', path: '/dashboard/inventory', color: 'from-red-600 to-orange-500' },
    { icon: Hospital, label: 'Requests', path: '/dashboard/requests', color: 'from-sky-500 to-blue-500' },
    { icon: Calendar, label: 'Campaigns', path: '/dashboard/campaigns', color: 'from-violet-500 to-purple-500' },
    { icon: Shield, label: 'Fraud Detection', path: '/dashboard/fraud', color: 'from-emerald-500 to-teal-500' },
    { icon: MapPin, label: 'Tracking', path: '/dashboard/tracking', color: 'from-yellow-500 to-orange-500' },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics', color: 'from-indigo-500 to-blue-500' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('bloodconnect_token');
    localStorage.removeItem('bloodconnect_user');
    navigate('/app/register', { replace: true });
  };

  const currentItem = navigationItems.find(item => item.path === location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Sidebar */}
      <motion.div
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3 }}
        className="border-r border-white/10 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-xl shadow-lg"
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <motion.div
              layout
              className="flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg shadow-red-500/50">
                <span className="text-white font-bold text-lg">🩸</span>
              </div>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col"
                >
                  <span className="font-bold text-white">BloodConnect</span>
                  <span className="text-xs text-slate-400">AI Dashboard</span>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3 group relative overflow-hidden ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-sm font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -z-10"
                      />
                    )}
                  </motion.button>
                </Link>
              );
            })}
          </nav>

          {/* Bottom User Section */}
          <div className="border-t border-white/10 p-4 space-y-2">
            <button className="w-full px-4 py-3 rounded-lg text-slate-300 hover:bg-white/5 transition-all flex items-center gap-3 group">
              <Settings className="w-5 h-5" />
              {sidebarOpen && <span className="text-sm font-medium">Settings</span>}
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full px-4 py-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-3"
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="border-b border-white/10 bg-gradient-to-r from-slate-800/30 to-slate-800/10 backdrop-blur-xl px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <h1 className="text-2xl font-bold text-white">{currentItem?.label || 'Dashboard'}</h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent text-white placeholder-slate-400 outline-none text-sm w-40"
                />
              </div>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <Bell className="w-5 h-5 text-slate-300" />
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                />
              </motion.button>

              {/* User Profile */}
              <button className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-lg transition-all">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-slate-300 hidden sm:block">Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
