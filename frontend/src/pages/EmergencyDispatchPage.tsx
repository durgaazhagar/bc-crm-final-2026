import React, { useState } from 'react';
import { MapPin, Phone } from 'lucide-react';
import EmergencyDispatchTable from '../components/EmergencyDispatchTable';

const EmergencyDispatchPage: React.FC = () => {
  const [summary, setSummary] = useState({ totalAll: 0, pending: 0, active: 0, completed: 0 });

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center gap-4">
        <MapPin className="h-8 w-8 text-rose-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Emergency Dispatch</h1>
          <p className="text-sm text-slate-400">Manage live dispatches and keep patient deliveries on track.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-cyan-500/5 transition hover:shadow-cyan-500/20">
          <div className="text-sm text-slate-400">Total Dispatches</div>
          <div className="mt-3 text-4xl font-semibold text-white">{summary.totalAll}</div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-amber-500/5 transition hover:shadow-amber-500/20">
          <div className="text-sm text-slate-400">Pending</div>
          <div className="mt-3 text-4xl font-semibold text-amber-300">{summary.pending}</div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-rose-500/5 transition hover:shadow-rose-500/20">
          <div className="text-sm text-slate-400">Active</div>
          <div className="mt-3 text-4xl font-semibold text-rose-300">{summary.active}</div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-emerald-500/5 transition hover:shadow-emerald-500/20">
          <div className="text-sm text-slate-400">Completed</div>
          <div className="mt-3 text-4xl font-semibold text-emerald-300">{summary.completed}</div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <EmergencyDispatchTable onSummary={(s) => setSummary(s)} />

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-slate-900/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-sm text-slate-400">Patient Support</div>
              <div className="mt-2 text-white font-semibold">Estimated arrival: 12 min</div>
              <div className="mt-1 text-slate-400">Help is on the way — stay calm. We've notified nearby donors.</div>
            </div>
            <button className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-rose-500 to-fuchsia-500 px-4 py-3 text-white font-semibold shadow-lg shadow-rose-500/20 transition hover:brightness-105">
              <Phone className="w-4 h-4" /> Emergency Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyDispatchPage;
