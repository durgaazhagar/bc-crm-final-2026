import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Heart,
  Hospital,
  Megaphone,
  User,
  BarChart3,
  ShieldCheck,
  Archive,
  AlertTriangle,
  Globe,
  Gamepad,
  Smartphone,
  Cpu,
  Map,
  Menu,
  X,
  MessageSquare,
} from 'lucide-react';

const items = [
  { label: 'Home 🏠', path: '/dashboard/admin/home', icon: <Home className="w-5 h-5" /> },
  { label: 'Donors ❤️', path: '/dashboard/admin/donors', icon: <Heart className="w-5 h-5 text-rose-400" /> },
  { label: 'Donor Map 🗺', path: '/dashboard/admin/donor-map', icon: <Map className="w-5 h-5 text-sky-400" /> },
  { label: 'Inventory 🩸', path: '/dashboard/admin/inventory', icon: <Archive className="w-5 h-5 text-sky-400" /> },
  { label: 'Hospitals 🏥', path: '/dashboard/admin/hospitals', icon: <Hospital className="w-5 h-5 text-cyan-400" /> },
  { label: 'Requests 📢', path: '/dashboard/admin/requests', icon: <Megaphone className="w-5 h-5 text-amber-400" /> },
  { label: 'Chatbot 🤖', path: '/dashboard/admin/chatbot', icon: <MessageSquare className="w-5 h-5 text-fuchsia-300" /> },
  { label: 'Emergency Dispatch 🚑', path: '/dashboard/admin/dispatch', icon: <AlertTriangle className="w-5 h-5 text-red-400" /> },
  { label: 'Campaigns 🎉', path: '/dashboard/admin/campaigns', icon: <Megaphone className="w-5 h-5 text-violet-400" /> },
  { label: 'Fraud Detection ⚠️', path: '/dashboard/admin/fraud', icon: <ShieldCheck className="w-5 h-5 text-emerald-300" /> },
  { label: 'Loyalty & Trust 🛡', path: '/dashboard/admin/trust', icon: <Heart className="w-5 h-5 text-amber-300" /> },
  { label: 'Analytics 📊', path: '/dashboard/admin/reports', icon: <BarChart3 className="w-5 h-5 text-cyan-300" /> },
  { label: 'Donor Wellness 🩺', path: '/dashboard/admin/wellness', icon: <Heart className="w-5 h-5 text-emerald-300" /> },
  { label: 'Social Impact 🌍', path: '/dashboard/admin/impact', icon: <Globe className="w-5 h-5 text-sky-300" /> },
  { label: 'Gamification 🎮', path: '/dashboard/admin/gamification', icon: <Gamepad className="w-5 h-5 text-indigo-300" /> },
  { label: 'Communication Hub 📱', path: '/dashboard/admin/communication', icon: <Smartphone className="w-5 h-5 text-pink-300" /> },
  { label: 'AI Prediction Hub 🤖', path: '/dashboard/admin/prediction', icon: <Cpu className="w-5 h-5 text-yellow-300" /> },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 p-3 text-white shadow-2xl shadow-red-500/30 transition hover:scale-105 md:hidden"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle navigation menu"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white shadow-2xl shadow-black/40 transition duration-300 h-screen overflow-y-auto md:static md:translate-x-0 md:w-72 ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(241,146,205,0.12),transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12),transparent_25%)] p-4">
          <div className="flex items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-cyan-500/5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/20">
                🩸
              </div>
              <div>
                <p className="text-sm font-semibold text-white">BloodConnect</p>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Admin Portal</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 md:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="mt-6 flex-1 min-h-0 overflow-y-auto pr-2">
            <div className="space-y-2">
              {items.map((it) => (
                <NavLink
                  key={it.path}
                  to={it.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-3xl px-4 py-3 transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-red-500 via-rose-500 to-fuchsia-500 text-white shadow-[0_15px_40px_rgba(236,72,153,0.18)] ring-1 ring-white/10'
                        : 'text-slate-300 hover:-translate-x-0.5 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-lg text-white shadow-sm transition group-hover:bg-white/10">
                    {it.icon}
                  </div>
                  <span className="text-sm font-medium">{it.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>

          <div className="mt-auto rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 shadow-inner shadow-white/5">
            <p className="font-semibold text-white">BloodConnect</p>
            <p className="mt-1 text-xs text-slate-400">Fast access to every workspace section.</p>
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} />}
    </>
  );
};

export default Sidebar;
