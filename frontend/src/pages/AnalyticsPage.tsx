import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import SectionCard from '../components/SectionCard';

const data = [
  { name: 'Jan', donors: 28, emergencies: 12 },
  { name: 'Feb', donors: 35, emergencies: 15 },
  { name: 'Mar', donors: 40, emergencies: 13 },
  { name: 'Apr', donors: 32, emergencies: 11 },
  { name: 'May', donors: 45, emergencies: 18 },
  { name: 'Jun', donors: 49, emergencies: 20 },
];

const AnalyticsPage = () => (
  <div className="space-y-6">
    <div className="grid gap-6 xl:grid-cols-2">
      <SectionCard title="Donation Trend" subtitle="Monthly donor growth">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.12)' }} />
              <Bar dataKey="donors" fill="#f87171" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
      <SectionCard title="Response Rate" subtitle="Emergency response performance">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.12)' }} />
              <Bar dataKey="emergencies" fill="#fb7185" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
    <div className="grid gap-6 xl:grid-cols-3">
      <SectionCard title="Conversion Momentum" subtitle="Measure campaign strength">
        <div className="rounded-3xl bg-white/5 p-6 text-slate-300">Track how donor outreach converts into real-time emergency readiness.</div>
      </SectionCard>
      <SectionCard title="Trust Signals" subtitle="Donor reliability metrics">
        <div className="rounded-3xl bg-white/5 p-6 text-slate-300">Higher trust scores map to faster responses in crisis mode.</div>
      </SectionCard>
      <SectionCard title="Capacity Pulse" subtitle="Inventory and demand alignment">
        <div className="rounded-3xl bg-white/5 p-6 text-slate-300">Use this dashboard to balance available collections against predicted demand.</div>
      </SectionCard>
    </div>
  </div>
);

export default AnalyticsPage;
