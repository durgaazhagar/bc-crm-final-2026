import { NavLink, Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import Chatbot from '../components/Chatbot';
import SharedNavbar from '../components/SharedNavbar';
import logo from '../assets/logo-bloodconnect-light.svg';
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

const moduleGroups = [
  {
    key: 'fraud',
    label: 'Fraud Detection',
    icon: '🛡️',
    items: [
      { path: '/app/fraud/risk-donors', label: 'Risk Donors', icon: '⚠️' },
      { path: '/app/fraud/suspicious', label: 'Suspicious Activity', icon: '👀' },
      { path: '/app/fraud/reports', label: 'AI Reports', icon: '🤖' },
    ],
  },
  {
    key: 'trusted',
    label: 'Trusted List',
    icon: '✅',
    items: [
      { path: '/app/trusted/donors', label: 'Verified Donors', icon: '🩸' },
      { path: '/app/trusted/hospitals', label: 'Partner Hospitals', icon: '🏥' },
      { path: '/app/trusted/campaigns', label: 'Safe Campaigns', icon: '📢' },
    ],
  },
  {
    key: 'aiinsights',
    label: 'AI Insights',
    icon: '💡',
    items: [
      { path: '/app/insights/predictions', label: 'Donor Predictions', icon: '📊' },
      { path: '/app/insights/forecast', label: 'Demand Forecast', icon: '📈' },
      { path: '/app/insights/suggestions', label: 'Smart Suggestions', icon: '✨' },
    ],
  },
  {
    key: 'emergency_center',
    label: 'Emergency Center',
    icon: '🚨',
    items: [
      { path: '/app/emergency/alerts', label: 'Alerts', icon: '🔔' },
      { path: '/app/emergency/priority', label: 'Priority Requests', icon: '📋' },
      { path: '/app/emergency/volunteers', label: 'Volunteer Mobilization', icon: '👥' },
    ],
  },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const raw = localStorage.getItem('sidebar_open');
    return raw === null ? true : raw === '1';
  });
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem('sidebar_groups');
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  });
  const [logoError, setLogoError] = useState(false);
  const toggleSidebar = () => setSidebarOpen((value) => !value);
  const location = useLocation();

  useEffect(()=>{
    try{ localStorage.setItem('sidebar_open', sidebarOpen ? '1' : '0'); }catch(e){}
  },[sidebarOpen]);

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
      <SharedNavbar isLoggedIn={true} />
      <div className="flex min-h-screen overflow-hidden">
          <aside className={`sidebar glass-panel neon-outline-cyan m-2 flex h-screen min-h-0 flex-col overflow-hidden rounded-xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl shadow-black/40 transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-16 overflow-hidden'}`}>
          <div className="flex h-20 items-center justify-between px-5 border-b border-white/10 neon-outline-blue rounded-t-lg">
            <Link to="/app/dashboard" className="flex items-center gap-3">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {!logoError ? (
                  <img
                    src={logo}
                    alt="BloodConnect"
                    onError={() => setLogoError(true)}
                    className="h-6 w-6 md:h-8 md:w-8 transition duration-300 hover:shadow-[0_0_18px_rgba(236,72,153,0.18)] object-contain"
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#ef4444', fontSize: 24 }}>🩸</span>
                    <span style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>BloodConnect</span>
                  </div>
                )}
              </div>
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

          <nav className="flex-1 min-h-0 overflow-y-auto px-2 py-4 space-y-2">
            {links.map((link) => {
              const Icon = (link as any).icon as any;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  title={!sidebarOpen ? link.label : ''}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-3xl px-4 py-3 transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-red-600/20 via-white/5 to-cyan-600/10 text-white font-semibold shadow-[0_8px_30px_rgba(236,72,153,0.08)] border-l-4 border-gradient-to-r'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                  <IconBadge Icon={Icon} />
                  <span className={`text-sm md:text-base font-medium ${!sidebarOpen ? 'hidden' : ''}`}>{link.label}</span>
                </NavLink>
              );
            })}

            {/* New AI / Trust / Fraud / Emergency module groups */}
            {moduleGroups.map((group) => {
              const isExpanded = !!expandedGroups[group.key];
              const anyActive = group.items.some(it => location.pathname.startsWith(it.path));
              return (
                <div key={group.key} className="relative">
                  <button
                    onClick={() => {
                      const next = { ...expandedGroups, [group.key]: !isExpanded };
                      setExpandedGroups(next);
                      localStorage.setItem('sidebar_groups', JSON.stringify(next));
                    }}
                    title={!sidebarOpen ? group.label : ''}
                    className={`w-full flex items-center gap-3 rounded-3xl px-4 py-3 transition-all duration-300 ${anyActive ? 'text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full text-lg ${anyActive ? 'bg-gradient-to-r from-rose-500 to-cyan-400 text-white shadow-lg' : 'bg-white/3'}`}>
                      <span className="transform-gpu animate-pulse">{group.icon}</span>
                    </div>
                    <div className={`flex-1 text-sm font-medium ${!sidebarOpen ? 'hidden' : ''}`}>{group.label}</div>
                    <div className={`text-xs ${!sidebarOpen ? 'hidden' : ''}`}>{isExpanded ? '▾' : '▸'}</div>
                  </button>

                  <div style={{ maxHeight: isExpanded ? 400 : 0 }} className={`overflow-hidden transition-all duration-300 mt-2 ml-10 ${!sidebarOpen ? 'hidden' : ''}`}>
                    <div className="space-y-1">
                      {group.items.map(it => (
                        <NavLink key={it.path} to={it.path} className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${isActive ? 'bg-gradient-to-r from-rose-600/20 to-cyan-400/10 text-white border-l-4' : 'text-slate-300 hover:bg-white/6'}`}>
                          <div className="w-6 text-center">{it.icon}</div>
                          <div className="flex-1">{it.label}</div>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
        </aside>

        <div className="main-wrapper flex-1 min-h-0 overflow-hidden">
          <div className={`main glass-panel neon-outline-blue m-2 rounded-xl flex-1 min-h-0 overflow-y-auto p-4 ${sidebarOpen ? '' : 'full'}`}>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button className="rounded-2xl glass-panel px-3 py-2" onClick={() => { /* placeholder home action */ window.location.href = '/app/dashboard'; }}>Home</button>
                <div className="text-sm text-slate-400">{breadcrumb().join(' > ')}</div>
              </div>

              <div className="flex items-center gap-3">
                <button className="rounded-3xl glass-panel neon-outline-blue px-4 py-3 text-sm text-white">Live Status: Green</button>
                <button className="rounded-3xl glass-panel neon-outline-red px-4 py-3 text-sm text-white">1-Click Emergency</button>
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
