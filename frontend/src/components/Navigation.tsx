import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Hospital,
  HeartPulse,
  Megaphone,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Bell,
  Plus,
  Brain,
  BarChart3,
  MessageCircle,
} from 'lucide-react';

const navigationItems = [
  { label: 'Dashboard', path: '/app/dashboard', Icon: LayoutDashboard, emoji: '🏠' },
  { label: 'Donors', path: '/app/donors', Icon: Users, emoji: '👥' },
  { label: 'Hospitals', path: '/app/hospitals', Icon: Hospital, emoji: '🏥' },
  { label: 'Campaigns', path: '/app/campaigns', Icon: Megaphone, emoji: '🎯' },
  { label: 'Communication', path: '/app/communication', Icon: MessageCircle, emoji: '💬' },
  { label: 'AI Engine', path: '/app/ai', Icon: Brain, emoji: '🤖' },
  { label: 'Analytics', path: '/app/analytics', Icon: BarChart3, emoji: '📊' },
];

const Navigation = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('bloodconnect_token') || sessionStorage.getItem('bloodconnect_token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('bloodconnect_token');
    localStorage.removeItem('bloodconnect_user');
    sessionStorage.removeItem('bloodconnect_token');
    sessionStorage.removeItem('bloodconnect_user');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <>
      <div className="sticky top-0 z-30 lg:hidden border-b border-white/10 bg-slate-950/95 px-4 py-3 shadow-sm shadow-black/10 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3 rounded-3xl bg-gradient-to-br from-red-500 to-rose-500 px-3 py-2 text-white shadow-lg shadow-red-500/20 transition hover:opacity-90">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-lg">🩸</div>
            <div className="hidden sm:block">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-200">BloodConnect</p>
              <p className="text-sm font-semibold">CRM</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <Link
                to="/app/register"
                className="inline-flex h-11 items-center gap-2 rounded-3xl border border-white/10 bg-gradient-to-r from-red-600 to-rose-500 px-4 text-sm text-white font-semibold transition hover:opacity-90"
              >
                Register
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/app/dashboard')}
                className="inline-flex h-11 items-center gap-2 rounded-3xl border border-white/10 bg-slate-900/80 px-4 text-sm text-slate-200 transition hover:border-white/20 hover:bg-slate-900"
              >
                <ArrowRight className="h-4 w-4 text-emerald-300" />
                Dashboard
              </button>
            )}
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-3xl bg-white/5 p-3 text-slate-200 transition hover:bg-white/10"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-3xl bg-white/5 p-3 text-slate-200 transition hover:bg-white/10"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: mobileOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className={`fixed inset-y-0 left-0 z-40 w-full max-w-xs overflow-hidden border-r border-white/10 bg-slate-950/95 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl lg:hidden ${mobileOpen ? 'block' : 'hidden'}`}
      >
        <div className="flex items-center justify-between gap-3 pb-4">
          <Link to="/" className="flex items-center gap-3 rounded-3xl bg-gradient-to-br from-red-500 to-rose-500 px-3 py-2 text-white shadow-lg shadow-red-500/20 transition hover:opacity-90" onClick={() => setMobileOpen(false)}>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-lg">🩸</div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-200">BloodConnect</p>
              <p className="text-sm font-semibold">CRM</p>
            </div>
          </Link>
          <button type="button" onClick={() => setMobileOpen(false)} className="rounded-full bg-white/5 p-3 text-slate-200 transition hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <motion.span 
                whileHover={{ scale: 1.15 }}
                className={`flex h-10 w-10 items-center justify-center rounded-2xl transition text-lg ${
                  window.location.pathname === item.path 
                    ? 'bg-gradient-to-br from-red-400 to-rose-400 shadow-lg shadow-red-500/40' 
                    : 'bg-white/5 group-hover:bg-white/15 group-hover:shadow-lg group-hover:shadow-red-500/30'
                }`}
              >
                {item.emoji}
              </motion.span>
              {item.label}
            </NavLink>
          ))}
        </nav>

          <div className="mt-6 space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3 text-slate-300">
            <Sparkles className="h-5 w-5 text-rose-400" />
            <div>
              <p className="text-xs uppercase tracking-[0.36em] text-slate-400">Quick Actions</p>
              <p className="text-sm text-white">Fast access</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              navigate('/app/dashboard');
            }}
            className="w-full rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-cyan-500/30"
          >
            View Dashboard
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              navigate('/app/campaigns');
            }}
            className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-900"
          >
            Campaigns
          </button>
        </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/80 p-5 text-slate-300">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="h-5 w-5 text-cyan-400" />
            <p className="text-sm font-semibold text-white">Secure access</p>
          </div>
          <p className="text-xs leading-5 text-slate-400">Your session stays safe while navigating the CRM.</p>
          {!isAuthenticated ? (
            <Link
              to="/app/register"
              onClick={() => setMobileOpen(false)}
              className="mt-4 w-full inline-flex items-center justify-center rounded-3xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              Register
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              className="mt-4 w-full rounded-3xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              Logout
            </button>
          )}
        </div>
      </motion.div>

      <aside className="hidden lg:flex h-screen w-80 flex-col rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-3xl">
        <div className="mb-8 flex items-center justify-between gap-4 px-1">
          <Link to="/" className="flex items-center gap-3 rounded-3xl bg-gradient-to-br from-red-500 to-rose-500 px-4 py-3 text-white shadow-lg shadow-red-500/20 transition hover:opacity-90">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-xl">🩸</div>
            <div>
              <p className="text-xs uppercase tracking-[0.36em] text-slate-200">BloodConnect</p>
              <p className="text-sm font-semibold">CRM Portal</p>
            </div>
          </Link>
        </div>

        <div className="mb-8 space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-4 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <motion.span 
                whileHover={{ scale: 1.15 }}
                className={`flex h-10 w-10 items-center justify-center rounded-2xl transition text-lg ${
                  window.location.pathname === item.path 
                    ? 'bg-gradient-to-br from-red-400 to-rose-400 shadow-lg shadow-red-500/40' 
                    : 'bg-white/5 group-hover:bg-white/15 group-hover:shadow-lg group-hover:shadow-red-500/30'
                }`}
              >
                {item.emoji}
              </motion.span>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="mt-auto space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3 text-slate-300">
            <Sparkles className="h-5 w-5 text-rose-400" />
            <div>
              <p className="text-xs uppercase tracking-[0.36em] text-slate-400">Quick Actions</p>
              <p className="text-sm text-white">Launch tasks fast</p>
            </div>
          </div>
          {!isAuthenticated ? (
            <Link
              to="/app/register"
              className="w-full inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-red-500 to-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Register
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/app/dashboard')}
              className="w-full rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-cyan-500/30"
            >
              View Dashboard
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('/app/campaigns')}
            className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-900"
          >
            Campaigns
          </button>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/80 p-5 text-slate-300">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="h-5 w-5 text-cyan-400" />
            <p className="text-sm font-semibold text-white">Secure access</p>
          </div>
          <p className="text-xs leading-5 text-slate-400">Protected user sessions and role-aware navigation ensure dashboard safety.</p>
          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 w-full rounded-3xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              Logout
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navigation;
