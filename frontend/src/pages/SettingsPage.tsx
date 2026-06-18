import { useState } from 'react';
import SectionCard from '../components/SectionCard';

const SettingsPage = () => {
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="System Preferences" subtitle="Control your dashboard experience">
          <div className="space-y-5 text-slate-300">
            <div className="rounded-3xl bg-white/5 p-5">
              <h3 className="text-sm uppercase tracking-[0.2em] text-slate-400">Theme</h3>
              <div className="mt-3 flex gap-3">
                {['dark', 'light'].map((option) => (
                  <button key={option} className={`rounded-2xl border px-4 py-2 text-sm ${theme === option ? 'border-blue-400 bg-blue-500/10 text-white' : 'border-white/10 text-slate-300'}`} onClick={() => setTheme(option)}>{option}</button>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-white/5 p-5">
              <h3 className="text-sm uppercase tracking-[0.2em] text-slate-400">Notifications</h3>
              <label className="mt-3 flex items-center gap-3 text-slate-300">
                <input type="checkbox" checked={notifications} onChange={() => setNotifications((v) => !v)} className="h-5 w-5 rounded border-white/20 bg-slate-900 text-blue-500" />
                Enable urgent alerts and donor follow-up reminders.
              </label>
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Security & API" subtitle="Manage access controls">
          <div className="space-y-5 rounded-3xl bg-white/5 p-6 text-slate-300">
            <div>
              <p className="text-sm text-slate-400">API Token</p>
              <p className="mt-2 break-all text-slate-200">••••••••••••••••••••••••••••••</p>
            </div>
            <button className="w-full rounded-3xl bg-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-600">Regenerate API Key</button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default SettingsPage;
