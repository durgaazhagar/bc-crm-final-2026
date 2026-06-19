import { NavLink, Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import Chatbot from '../components/Chatbot';
import logoSrc from '../assets/logo-bloodconnect-dark.svg';
import {
  BarChart3,
  Droplet,
  Hospital,
  Megaphone,
  User,
  AlertTriangle,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react';
import IconBadge from '../components/IconBadge';

const links = [
  { path: '/app/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/app/donors', label: 'Donors', icon: Droplet },
  { path: '/app/hospitals', label: 'Hospitals', icon: Hospital },
  { path: '/app/patients', label: 'Patients', icon: User },
  { path: '/app/campaigns', label: 'Campaigns', icon: Megaphone },
  { path: '/app/emergency', label: 'Emergency', icon: AlertTriangle },
  { path: '/app/analytics', label: 'Analytics', icon: BarChart3 },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((value) => !value);
  const location = useLocation();

  const userInfo = useMemo(() => {
    try {
      const raw = localStorage.getItem('bloodconnect_user');
      const parsed = raw ? JSON.parse(raw) : {};
      const name = parsed?.name || parsed?.user?.name || 'Operator';
      const role = parsed?.role || parsed?.user?.role || 'Admin';
      return { name, role };
    } catch (error) {
      return { name: 'Operator', role: 'Admin' };
    }
  }, []);

  const navigate = useNavigate();

  const breadcrumb = () => {
    const path = location.pathname.replace('/app', '').replace(/^\//, '') || 'dashboard';
    const parts = path.split('/');
    return ['Dashboard', ...(parts[0] ? [parts[0].charAt(0).toUpperCase() + parts[0].slice(1)] : [])];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f14] via-[#0d1117] to-[#161b22] text-white">
      <div className="flex min-h-screen overflow-visible">
        <aside className={`sidebar glass-panel neon-outline-cyan m-2 rounded-xl ${sidebarOpen ? '' : 'hidden'}`}>
          <div className="flex h-20 items-center justify-between px-5 border-b border-white/10 neon-outline-blue rounded-t-lg">
            <Link to="/app/dashboard" className="flex items-center gap-3">
              <img src={logoSrc} alt="BloodConnect" className="h-10 w-10 rounded-lg object-cover shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.36em] text-avatar-cyan">BloodConnect</p>
                <h1 className="text-sm font-semibold">CRM</h1>
              </div>
            </Link>
            <div className="hidden flex-col items-end gap-1 text-right sm:flex">
              <span className="text-xs uppercase tracking-[0.32em] text-slate-400">Signed in as</span>
              <p className="text-sm font-semibold text-white">{userInfo.name}</p>
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-cyan-200">{userInfo.role}</span>
            </div>
            <button
              type="button"
              className="text-red-400 transition hover:text-red-300"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? '×' : '☰'}
            </button>
          </div>

          <nav className="px-2 py-4 space-y-2">
            {links.map((link) => {
              const Icon = (link as any).icon as any;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-3xl px-4 py-3 transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-red-600/20 via-white/5 to-cyan-600/10 text-white font-semibold shadow-[0_8px_30px_rgba(236,72,153,0.08)]'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                  <IconBadge Icon={Icon} />
                  <span className="text-sm md:text-base font-medium">{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <div className="main-wrapper flex-1 overflow-visible">
          <div className={`main glass-panel neon-outline-blue m-2 rounded-xl flex-1 overflow-y-auto p-4 ${sidebarOpen ? '' : 'full'}`}>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button className="rounded-2xl glass-panel px-3 py-2" onClick={() => { /* placeholder home action */ window.location.href = '/app/dashboard'; }}>Home</button>
                <div className="text-sm text-slate-400">{breadcrumb().join(' > ')}</div>
              </div>

              <div className="flex items-center gap-3">
                <button className="rounded-3xl glass-panel neon-outline-blue px-4 py-3 text-sm text-white">Live Status: Green</button>
                <button className="rounded-3xl glass-panel neon-outline-red px-4 py-3 text-sm text-white">1-Click Emergency</button>
                <button
                  className="rounded-3xl glass-panel px-4 py-3 text-sm text-white bg-red-600 hover:bg-red-500"
                  onClick={() => {
                    // Clear session and navigate to registration
                    try {
                      localStorage.removeItem('bloodconnect_token');
                      localStorage.removeItem('bloodconnect_user');
                      // optional cleanup
                      localStorage.removeItem('bloodconnect_remember_email');
                    } catch (e) {}
                    navigate('/app/register', { replace: true });
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
            <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Workspace</p>
                <p className="mt-2 font-semibold text-white">Operational console</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Role insights</p>
                <p className="mt-2 font-semibold text-white">{userInfo.role} analytics</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Quick action</p>
                <p className="mt-2 font-semibold text-white">Monitor response flow</p>
              </div>
            </div>

            <Outlet />
          </div>
        </div>

      </div>

      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'visible' : ''}`}
        onClick={toggleSidebar}
        aria-hidden="true"
      />
      <Chatbot isGuest={false} />
    </div>
  );
};

export default DashboardLayout;
