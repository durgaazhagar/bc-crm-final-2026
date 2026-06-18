import React, { useMemo } from 'react';
import {
  Cpu,
  Zap,
  Heart,
  ShieldCheck,
  BarChart3,
  Globe,
  MapPin,
  Sparkles,
  CalendarDays,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

const availabilityData = [
  { date: 'Mon', donors: 86, demand: 74 },
  { date: 'Tue', donors: 94, demand: 80 },
  { date: 'Wed', donors: 102, demand: 88 },
  { date: 'Thu', donors: 89, demand: 95 },
  { date: 'Fri', donors: 76, demand: 110 },
  { date: 'Sat', donors: 68, demand: 122 },
  { date: 'Sun', donors: 82, demand: 100 },
];

const groupDemand = [
  { name: 'A+', value: 28 },
  { name: 'O+', value: 22 },
  { name: 'B+', value: 18 },
  { name: 'AB+', value: 12 },
  { name: 'O-', value: 10 },
  { name: 'A-', value: 8 },
];

const campaignPrediction = [
  { campaign: 'City Drive', probability: 78 },
  { campaign: 'College Rally', probability: 65 },
  { campaign: 'Blood Fest', probability: 89 },
  { campaign: 'Wellness Camp', probability: 54 },
  { campaign: 'Hospital Push', probability: 72 },
];

const hotspots = [
  { zone: 'Central', level: 'High', cases: 18 },
  { zone: 'North', level: 'Moderate', cases: 10 },
  { zone: 'East', level: 'High', cases: 16 },
  { zone: 'South', level: 'Low', cases: 6 },
  { zone: 'West', level: 'Moderate', cases: 12 },
];

const insights = [
  { title: 'Blood Group Shortage', value: 'O+ & A-', detail: 'Predict shortage in 3 days', icon: AlertTriangle, color: 'from-rose-500 to-fuchsia-500' },
  { title: 'Re-engagement Campaign', value: 'Refer donors in Chennai', detail: 'Suggested by AI for highest impact', icon: Sparkles, color: 'from-cyan-500 to-blue-500' },
  { title: 'Hospital Readiness', value: 'City Care 82%', detail: 'Forecast stable for next 72 hrs', icon: ShieldCheck, color: 'from-emerald-500 to-teal-500' },
  { title: 'Seasonal Pattern', value: 'Blood demand spikes +24%', detail: 'May-June donation gaps predicted', icon: CalendarDays, color: 'from-violet-500 to-slate-500' },
  { title: 'Fraud Risk', value: 'Region 4 alerts', detail: 'Monitor donor activity flags', icon: Globe, color: 'from-orange-500 to-red-500' },
];

const alertBadges = [
  { label: 'Emergency Hotspot', value: 'Central', emoji: '🚨' },
  { label: 'Shortage Alert', value: 'A- donors', emoji: '⚠️' },
  { label: 'Campaign Surge', value: 'Wellness Camp', emoji: '📊' },
];

const colorScale = ['#f97316', '#fb7185', '#38bdf8', '#a78bfa', '#34d399', '#facc15'];

const AIPredictionHubPage: React.FC = () => {
  const totalDemand = useMemo(() => groupDemand.reduce((sum, group) => sum + group.value, 0), []);

  return (
    <div className="min-h-screen p-6 text-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20">
            <Cpu className="h-5 w-5" />
            AI Prediction Hub
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">Predictive analytics for donor readiness, demand, and emergency response.</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">Monitor donor availability, blood group demand, hospital readiness, and campaign success probability in one future-ready dashboard.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-xl shadow-slate-900/20">
            <div className="flex items-center gap-3 text-slate-300">
              <Zap className="h-5 w-5 text-amber-400" />
              <span>Donor Availability</span>
            </div>
            <p className="mt-4 text-3xl font-semibold text-white">Strong</p>
            <p className="mt-2 text-sm text-slate-400">Forecast of donors available in the next 24 hrs.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-xl shadow-slate-900/20">
            <div className="flex items-center gap-3 text-slate-300">
              <Heart className="h-5 w-5 text-rose-400" />
              <span>Blood Demand</span>
            </div>
            <p className="mt-4 text-3xl font-semibold text-white">High</p>
            <p className="mt-2 text-sm text-slate-400">O+ and A- predicted in short supply soon.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-xl shadow-slate-900/20">
            <div className="flex items-center gap-3 text-slate-300">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span>Hospital Trend</span>
            </div>
            <p className="mt-4 text-3xl font-semibold text-white">Stable</p>
            <p className="mt-2 text-sm text-slate-400">Readiness scores remain steady across facilities.</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl shadow-slate-900/20">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Donor Availability Forecast</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Next 7 days</h2>
                </div>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">Trend</span>
              </div>
              <div className="mt-5 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={availabilityData} margin={{ top: 10, right: 0, left: -12, bottom: 0 }}>
                    <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148, 163, 184, 0.2)' }} />
                    <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                    <Line type="monotone" dataKey="donors" stroke="#38bdf8" strokeWidth={3} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="demand" stroke="#fb7185" strokeWidth={3} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl shadow-slate-900/20">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Blood Group Demand</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Predicted demand share</h2>
                </div>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">Total {totalDemand}%</span>
              </div>
              <div className="mt-5 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={groupDemand} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
                      {groupDemand.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colorScale[index % colorScale.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148, 163, 184, 0.2)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-5 grid gap-2 text-sm text-slate-300">
                {groupDemand.map((group, index) => (
                  <div key={group.name} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colorScale[index % colorScale.length] }} />
                      <span>{group.name}</span>
                    </div>
                    <span>{group.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl shadow-slate-900/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Campaign Success Probability</p>
                <h2 className="mt-2 text-xl font-semibold text-white">AI confidence scores</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                <BarChart3 className="h-4 w-4" /> Forecast
              </div>
            </div>
            <div className="mt-5 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignPrediction} margin={{ top: 15, right: 0, left: -10, bottom: 5 }}>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                  <XAxis dataKey="campaign" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148, 163, 184, 0.2)' }} />
                  <Bar dataKey="probability" fill="#8b5cf6" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl shadow-slate-900/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Emergency Hotspot Alerts</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Regional heatmap</h2>
              </div>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">Live</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {hotspots.map((hotspot) => (
                <div key={hotspot.zone} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{hotspot.zone}</p>
                      <p className="text-xs text-slate-400">{hotspot.level} risk zone</p>
                    </div>
                    <div className="rounded-full bg-slate-900 px-3 py-1 text-sm text-white">{hotspot.cases} cases</div>
                  </div>
                  <div className="mt-4 h-14 rounded-3xl bg-gradient-to-r from-red-500/20 via-amber-500/20 to-emerald-500/10" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl shadow-slate-900/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">AI Insights</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Actionable recommendations</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                <TrendingUp className="h-4 w-4" /> Insights
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {insights.map((insight) => {
                const Icon = insight.icon;
                return (
                  <div key={insight.title} className="rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-400/20 hover:bg-slate-900/80">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br ${insight.color} text-white shadow-lg shadow-slate-900/20`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-white">{insight.title}</p>
                        <p className="text-sm text-slate-400">{insight.detail}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm font-semibold text-white">
                      <span>{insight.value}</span>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">AI</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl shadow-slate-900/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Future Features</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Smart alert readiness</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                <MapPin className="h-4 w-4" /> Predictive
              </div>
            </div>
            <div className="mt-5 space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Smart notifications</p>
                <p className="mt-2 text-base font-semibold text-white">Admin alerts for donor outreach and hospital readiness.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Wellness integration</p>
                <p className="mt-2 text-base font-semibold text-white">Combine donor health, hydration, nutrition, and rest data for better models.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">AI outreach</p>
                <p className="mt-2 text-base font-semibold text-white">Suggested re-engagement campaigns with predicted response rates.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950/80 to-slate-900/80 p-5 shadow-xl shadow-slate-900/30">
            <div className="flex items-center gap-3 text-slate-300">
              <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Motivational insight</p>
                <p className="mt-2 text-lg font-semibold text-white">“Data-driven preparation helps keep blood shelves safe and patients alive.”</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPredictionHubPage;
