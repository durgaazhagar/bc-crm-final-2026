import React, { useState } from 'react';
import SectionCard from '../components/SectionCard';

const PRIMARY = '#B22222';

const Settings = () => {
  // Appearance
  const [theme, setTheme] = useState('system');
  const [accent, setAccent] = useState('red');
  const [fontSize, setFontSize] = useState(14);

  // Notifications
  const [notifEmergency, setNotifEmergency] = useState(true);
  const [notifFollowup, setNotifFollowup] = useState(true);
  const [notifInventory, setNotifInventory] = useState(true);
  const [notifFraud, setNotifFraud] = useState(false);
  const [notifRewards, setNotifRewards] = useState(false);

  // Security & API
  const [apiToken, setApiToken] = useState('sk_live_••••••••••••••');
  const [showToken, setShowToken] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30min');
  const [twoFactor, setTwoFactor] = useState(false);
  const loginActivity = [
    { device: 'Chrome - Windows', location: 'Bengaluru, IN', time: '2026-06-15 09:12' },
    { device: 'Safari - iPhone', location: 'Chennai, IN', time: '2026-06-12 18:03' },
    { device: 'Edge - Windows', location: 'Hyderabad, IN', time: '2026-06-01 11:21' },
  ];

  // Donor preferences
  const [autoNotify, setAutoNotify] = useState(true);
  const [smartScoring, setSmartScoring] = useState(true);
  const [searchRadius, setSearchRadius] = useState(20);

  // Platform stats (read-only)
  const totalDonors = 12458;
  const donorsThisMonth = 384;
  const uptime = 99.98;
  const storageUsed = 4.2; // GB
  const apiCalls = 3124; // this month

  // Language & region
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('Asia/Kolkata');

  // Organization
  const [avatarColor, setAvatarColor] = useState('bg-red-600');
  const [orgName, setOrgName] = useState('BloodConnect NGO');
  const [adminEmail, setAdminEmail] = useState('admin@bloodconnect.org');

  // Save bar
  const [saved, setSaved] = useState(false);

  const notificationCount = [notifEmergency, notifFollowup, notifInventory, notifFraud, notifRewards].filter(Boolean).length;

  const resetDefaults = () => {
    setTheme('system');
    setAccent('red');
    setFontSize(14);
    setNotifEmergency(true);
    setNotifFollowup(true);
    setNotifInventory(true);
    setNotifFraud(false);
    setNotifRewards(false);
    setApiToken('sk_live_••••••••••••••');
    setSessionTimeout('30min');
    setTwoFactor(false);
    setAutoNotify(true);
    setSmartScoring(true);
    setSearchRadius(20);
    setLanguage('English');
    setTimezone('Asia/Kolkata');
    setAvatarColor('bg-red-600');
    setOrgName('BloodConnect NGO');
    setAdminEmail('admin@bloodconnect.org');
    setSaved(false);
  };

  const saveAll = () => {
    // simulate save
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const regenerateToken = () => {
    const rand = Math.random().toString(36).slice(2, 10);
    setApiToken(`sk_live_${rand}`);
  };

  return (
    <div className="space-y-6 pb-28">
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Appearance" subtitle="Theme, accent and typography">
          <div className="space-y-4 text-slate-300">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full" style={{ background: PRIMARY }} />
              <div>
                <h4 className="text-white font-semibold">Theme</h4>
                <div className="mt-2 flex gap-2">
                  {['light', 'dark', 'system'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setTheme(opt)}
                      className={`rounded-full px-3 py-2 text-sm font-medium ${theme === opt ? 'bg-red-600 text-white' : 'bg-white/5 text-slate-300'}`}
                    >
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold">Accent Color</h4>
              <div className="mt-2 flex items-center gap-3">
                {[
                  { key: 'red', color: '#B22222' },
                  { key: 'blue', color: '#2563EB' },
                  { key: 'teal', color: '#14B8A6' },
                  { key: 'purple', color: '#7C3AED' },
                  { key: 'coral', color: '#FF6B6B' },
                ].map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setAccent(c.key)}
                    className={`h-8 w-8 rounded-full border-2 ${accent === c.key ? 'ring-4 ring-red-600/40' : 'border-white/20'}`}
                    style={{ background: c.color }}
                    aria-label={`Accent ${c.key}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold">Font Size</h4>
              <div className="mt-2 flex items-center gap-3">
                <input type="range" min="12" max="18" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full" />
                <div className="w-12 text-right text-slate-300">{fontSize}px</div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title={`Notifications`} subtitle="Manage notification channels">
          <div className="space-y-4 text-slate-300">
            <div className="flex items-center justify-between">
              <div className="text-sm">Emergency blood alerts</div>
              <Toggle value={notifEmergency} onChange={() => setNotifEmergency((v) => !v)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">Donor follow-up reminders</div>
              <Toggle value={notifFollowup} onChange={() => setNotifFollowup((v) => !v)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">Inventory low alerts</div>
              <Toggle value={notifInventory} onChange={() => setNotifInventory((v) => !v)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">Fraud detection flags</div>
              <Toggle value={notifFraud} onChange={() => setNotifFraud((v) => !v)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">Reward redemptions</div>
              <Toggle value={notifRewards} onChange={() => setNotifRewards((v) => !v)} />
            </div>

            <div className="mt-3 inline-flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-white/5 text-sm text-slate-200">Active: <span className="font-semibold">{notificationCount}</span></div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Security & API" subtitle="Keys, sessions and activity">
          <div className="space-y-4 text-slate-300">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 rounded-2xl bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">API Token</p>
                    <div className="mt-2 flex items-center gap-3">
                      <input value={showToken ? apiToken : apiToken.replace(/.(?=.{4})/g, '•')} readOnly className="w-full rounded-md bg-transparent border border-white/10 px-3 py-2 text-slate-200" />
                      <button onClick={() => setShowToken((s) => !s)} className="px-3 py-2 rounded-md bg-white/5">{showToken ? 'Hide' : 'Show'}</button>
                      <button onClick={regenerateToken} className="px-3 py-2 rounded-md bg-red-600 text-white">Regenerate</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Session Timeout</p>
                <select value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} className="mt-2 w-full rounded-md bg-transparent border border-white/10 px-3 py-2 text-slate-200">
                  <option value="30min">30min</option>
                  <option value="1hr">1hr</option>
                  <option value="4hr">4hr</option>
                  <option value="8hr">8hr</option>
                </select>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Two-factor Authentication</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm text-slate-200">Require 2FA on login</div>
                  <Toggle value={twoFactor} onChange={() => setTwoFactor((v) => !v)} />
                </div>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Recent Login Activity</p>
                <ul className="mt-2 space-y-2 text-sm">
                  {loginActivity.map((l, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{l.device}</div>
                        <div className="text-slate-400">{l.location}</div>
                      </div>
                      <div className="text-slate-400">{l.time}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Donor Preferences" subtitle="How donors are notified">
          <div className="space-y-4 text-slate-300">
            <div className="flex items-center justify-between">
              <div className="text-sm">Auto-notify when eligible</div>
              <Toggle value={autoNotify} onChange={() => setAutoNotify((v) => !v)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">Smart engagement scoring</div>
              <Toggle value={smartScoring} onChange={() => setSmartScoring((v) => !v)} />
            </div>

            <div>
              <p className="text-sm text-slate-400">Default search radius</p>
              <div className="mt-2 flex items-center gap-3">
                <input type="range" min="5" max="50" value={searchRadius} onChange={(e) => setSearchRadius(Number(e.target.value))} className="w-full" />
                <div className="w-12 text-right text-slate-300">{searchRadius}km</div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Platform Stats" subtitle="Read-only metrics">
          <div className="space-y-4 text-slate-300">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white/5 p-4 text-center">
                <div className="text-sm text-slate-400">Total Donors</div>
                <div className="mt-2 text-xl font-semibold text-white">{totalDonors.toLocaleString()}</div>
              </div>

              <div className="rounded-2xl bg-white/5 p-4 text-center">
                <div className="text-sm text-slate-400">This Month</div>
                <div className="mt-2 text-xl font-semibold text-white">{donorsThisMonth}</div>
              </div>

              <div className="rounded-2xl bg-white/5 p-4 text-center">
                <div className="text-sm text-slate-400">Uptime</div>
                <div className="mt-2 text-xl font-semibold text-white">{uptime}%</div>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-400">Storage used</p>
              <div className="mt-2 w-full rounded-full bg-white/5 h-4">
                <div className="h-4 rounded-full bg-red-600" style={{ width: `${(storageUsed / 10) * 100}%` }} />
                <div className="mt-1 text-sm text-slate-300">{storageUsed} GB / 10 GB</div>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-400">API calls this month</p>
              <div className="mt-2 w-full rounded-full bg-white/5 h-4">
                <div className="h-4 rounded-full bg-red-600" style={{ width: `${(apiCalls / 10000) * 100}%` }} />
                <div className="mt-1 text-sm text-slate-300">{apiCalls} / 10,000</div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Language & Region" subtitle="Localization settings">
          <div className="space-y-4 text-slate-300">
            <div>
              <p className="text-sm text-slate-400">Language</p>
              <div className="mt-2 flex gap-2">
                {['English', 'Tamil', 'Hindi', 'Telugu'].map((l) => (
                  <button key={l} onClick={() => setLanguage(l)} className={`rounded-full px-3 py-2 text-sm ${language === l ? 'bg-red-600 text-white' : 'bg-white/5 text-slate-300'}`}>{l}</button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-400">Timezone</p>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="mt-2 w-full rounded-md bg-transparent border border-white/10 px-3 py-2 text-slate-200">
                <option value="Asia/Kolkata">Asia/Kolkata</option>
                <option value="Asia/Karachi">Asia/Karachi</option>
                <option value="Asia/Dubai">Asia/Dubai</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Organization" subtitle="Company profile">
          <div className="space-y-4 text-slate-300">
            <div>
              <p className="text-sm text-slate-400">Avatar Color</p>
              <div className="mt-2 flex gap-2">
                {['bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-purple-600'].map((c) => (
                  <button key={c} onClick={() => setAvatarColor(c)} className={`${c} h-10 w-10 rounded-full border-2 ${avatarColor === c ? 'ring-4 ring-red-600/40' : 'border-white/10'}`}></button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-400">Organization name</p>
              <input value={orgName} onChange={(e) => setOrgName(e.target.value)} className="mt-2 w-full rounded-md bg-transparent border border-white/10 px-3 py-2 text-slate-200" />
            </div>

            <div>
              <p className="text-sm text-slate-400">Admin email</p>
              <input value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="mt-2 w-full rounded-md bg-transparent border border-white/10 px-3 py-2 text-slate-200" />
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Save bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl rounded-3xl bg-white/5 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={resetDefaults} className="rounded-2xl bg-white/5 px-4 py-2 text-slate-300">Reset to defaults</button>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={saveAll} className={`rounded-2xl px-4 py-2 font-semibold transition-all ${saved ? 'bg-green-600 text-white scale-105' : 'bg-red-600 text-white'}`}>
            {saved ? 'Saved ✓' : 'Save all settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Toggle = ({ value, onChange }) => (
  <button
    onClick={onChange}
    className={`w-12 h-7 rounded-full p-1 transition-colors ${value ? 'bg-red-600' : 'bg-white/10'}`}
    aria-pressed={value}
  >
    <div className={`h-5 w-5 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

export default Settings;
