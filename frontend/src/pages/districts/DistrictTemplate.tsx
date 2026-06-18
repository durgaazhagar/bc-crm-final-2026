import SectionCard from '../../components/SectionCard';
import { motion } from 'framer-motion';

interface Props {
  name: string;
  avatarTitle: string;
  avatarName?: string;
  status: string;
  level: string;
  activeRequests: number;
  availableDonors: number;
  theme?: string;
}

const DistrictTemplate = ({ name, avatarTitle, avatarName, status, level, activeRequests, availableDonors, theme = 'cyan' }: Props) => {
  const bloodGroups = [
    { label: 'O+', value: 92 },
    { label: 'O-', value: 47 },
    { label: 'A+', value: 85 },
    { label: 'A-', value: 42 },
    { label: 'B+', value: 78 },
    { label: 'B-', value: 35 },
    { label: 'AB+', value: 61 },
    { label: 'AB-', value: 28 },
  ];

  const hospitals = [
    { name: 'City Hospital', active: 3, status: 'Responding' },
    { name: 'Saint Marys', active: 1, status: 'Standby' },
    { name: 'Metro Care', active: 2, status: 'Responding' },
  ];

  const donors = [
    { name: 'Gopi', lastDonated: '2d', loyalty: 92 },
    { name: 'Durga', lastDonated: '1d', loyalty: 88 },
    { name: 'Malathi', lastDonated: '5d', loyalty: 74 },
  ];

  const themeGradient = (t: string) => {
    switch (t) {
      case 'red':
        return 'from-red-500 to-rose-600';
      case 'amber':
        return 'from-amber-400 to-amber-600';
      case 'emerald':
        return 'from-emerald-400 to-cyan-400';
      case 'purple':
        return 'from-violet-500 to-purple-600';
      default:
        return 'from-cyan-500 to-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`h-20 w-20 rounded-xl bg-gradient-to-br ${themeGradient(theme || 'cyan')} flex items-center justify-center text-3xl font-bold text-white`}>{avatarTitle}</div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">{name} District</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">{name} Emergency Command</h1>
              <p className="mt-1 text-sm text-slate-300">Status: <span className="font-semibold text-white">{status}</span> • Level: <span className="font-semibold text-white">{level}</span></p>
              {avatarName && <div className="mt-2 inline-flex items-center gap-2"><span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200">{avatarName}</span></div>}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-3 text-center">
              <p className="text-xs text-slate-400">Active Requests</p>
              <p className="mt-2 text-2xl font-semibold text-white">{activeRequests}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-3 text-center">
              <p className="text-xs text-slate-400">Available Donors</p>
              <p className="mt-2 text-2xl font-semibold text-white">{availableDonors}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="AI Emergency Intelligence" subtitle="Forecast & risk analytics" className="lg:col-span-2">
          <div className="grid gap-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Demand forecast (48h)</p>
              <p className="mt-2 text-2xl font-semibold text-white">O+ demand up 18%</p>
              <p className="mt-1 text-xs text-slate-400">Predicted surge window: 6-10 PM</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">Shortage prediction</p>
                <p className="mt-2 text-xl font-semibold text-white">O- below 40%</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">Risk score</p>
                <p className="mt-2 text-xl font-semibold text-white">78</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">AI confidence</p>
                <p className="mt-2 text-xl font-semibold text-white">92%</p>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Blood Availability Analysis" subtitle="Group-wise availability">
          <div className="space-y-3">
            {bloodGroups.map((bg) => (
              <div key={bg.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-300">{bg.label}</p>
                  <p className="text-sm font-semibold text-white">{bg.value}%</p>
                </div>
                <div className="h-3 w-full rounded-full bg-white/5">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${bg.value}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
                </div>
              </div>
            ))}
            <div className="mt-3 text-sm text-amber-300">Critical: AB- below 30%</div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Hospital Network" subtitle="Connected hospitals">
          <div className="space-y-3">
            {hospitals.map((h) => (
              <div key={h.name} className="flex items-center justify-between rounded-3xl border border-white/10 p-3 bg-white/5">
                <div>
                  <p className="font-semibold text-white">{h.name}</p>
                  <p className="text-xs text-slate-400">Active emergencies: {h.active}</p>
                </div>
                <div className="text-sm text-slate-300">{h.status}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Donor Intelligence" subtitle="Top responders & scores">
          <div className="space-y-3">
            {donors.map((d) => (
              <div key={d.name} className="flex items-center justify-between rounded-3xl border border-white/10 p-3 bg-white/5">
                <div>
                  <p className="font-semibold text-white">{d.name}</p>
                  <p className="text-xs text-slate-400">Last donated: {d.lastDonated}</p>
                </div>
                <div className="text-sm text-slate-300">Loyalty {d.loyalty}%</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="AI Recommended Actions" subtitle="Priority actions">
          <div className="space-y-3">
            <div className="rounded-3xl border border-white/10 p-4 bg-white/5">
              <p className="font-semibold text-white">Donor activation: Target O- donors</p>
              <p className="text-sm text-slate-400 mt-1">Send SMS & app push with priority tag</p>
            </div>
            <div className="rounded-3xl border border-white/10 p-4 bg-white/5">
              <p className="font-semibold text-white">Coordinate with City Hospital</p>
              <p className="text-sm text-slate-400 mt-1">Allocate mobile units and redistribution</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Emergency Timeline" subtitle="Recent alerts & actions">
          <div className="space-y-3">
            <div className="rounded-3xl border border-white/10 p-3 bg-white/5">
              <p className="text-sm text-slate-300">[09:12] O+ request created — City Hospital</p>
              <p className="text-xs text-slate-400">Action: Notified nearby donors</p>
            </div>
            <div className="rounded-3xl border border-white/10 p-3 bg-white/5">
              <p className="text-sm text-slate-300">[08:50] AI forecast: Surge likely in 2h</p>
              <p className="text-xs text-slate-400">Action: Pre-authorize redistribution</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default DistrictTemplate;
