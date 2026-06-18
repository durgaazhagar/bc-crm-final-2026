import { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import SectionCard from '../components/SectionCard';
import api from '../services/api';
import { AlertTriangle, CheckCircle2, Clock, Zap, Shield, AlertCircle } from 'lucide-react';

const demandColors: Record<string, string> = {
  High: '#fb7185',
  Medium: '#f59e0b',
  Low: '#34d399',
};

const riskColors: Record<string, string> = {
  Low: '#34d399',
  Medium: '#f59e0b',
  High: '#fb7185',
};

const statusColors: Record<string, string> = {
  available: 'bg-emerald-500/15 text-emerald-200',
  busy: 'bg-amber-500/15 text-amber-200',
  unavailable: 'bg-red-500/15 text-red-200',
};

const AIInsightsPage = () => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/analytics/overview');
        setInsights(data);
        setLastUpdated(new Date());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'just now';
    if (minutes === 1) return '1 min ago';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hr ago';
    return `${hours} hr ago`;
  };

  const summaryStats = useMemo(() => ({
    totalPredictions: insights?.summary?.totalPredictions ?? 2845,
    aiAccuracy: insights?.summary?.aiAccuracy ?? 92,
    emergencySuccess: insights?.summary?.emergencySuccess ?? 87,
    retentionImprovement: insights?.summary?.retentionImprovement ?? 11,
  }), [insights]);

  const fraudStats = useMemo(() => ({
    fraudCases: insights?.fraud?.fraudCases ?? 12,
    accountsUnderReview: insights?.fraud?.accountsUnderReview ?? 8,
    verifiedDonors: insights?.fraud?.verifiedDonors ?? 1842,
    securityHealth: insights?.fraud?.securityHealth ?? 94,
    fraudRiskScore: insights?.fraud?.fraudRiskScore ?? 3.2,
  }), [insights]);

  const fraudAlerts: any[] = useMemo(() => insights?.fraud?.alerts ?? [
    { type: 'duplicate', title: 'Duplicate Donor Detected', detail: 'ID#4521 matches existing record', risk: 'High', timestamp: '5m ago' },
    { type: 'fake', title: 'Fake Registration Flag', detail: 'Account#7834 failed verification', risk: 'Medium', timestamp: '12m ago' },
    { type: 'hospital', title: 'Suspicious Hospital Activity', detail: 'Abnormal request pattern from H-422', risk: 'High', timestamp: '22m ago' },
    { type: 'activity', title: 'Unusual Activity Alert', detail: '3 failed attempts from new IP', risk: 'Low', timestamp: '1h ago' },
  ], [insights]);

  const topDonors = useMemo(() => {
    const donors = insights?.lifeSaver?.topDonors ?? [
      { name: 'Gopi', score: 98, bloodGroup: 'O+', status: 'available' },
      { name: 'Durga', score: 96, bloodGroup: 'O+', status: 'available' },
      { name: 'Ganesh', score: 94, bloodGroup: 'O-', status: 'available' },
      { name: 'Dinesh', score: 91, bloodGroup: 'B+', status: 'busy' },
      { name: 'Praveen', score: 89, bloodGroup: 'B-', status: 'available' },
      { name: 'Malathika', score: 88, bloodGroup: 'A+', status: 'busy' },
      { name: 'Pratiksha', score: 86, bloodGroup: 'A-', status: 'busy' },
      { name: 'Nithish', score: 84, bloodGroup: 'AB-', status: 'unavailable' },
      { name: 'Gokulan', score: 82, bloodGroup: 'B+', status: 'available' },
      { name: 'Devatamil', score: 80, bloodGroup: 'AB+', status: 'unavailable' },
    ];
    return donors.slice(0, 10);
  }, [insights]);

  const demandData = useMemo(() => insights?.demandForecast?.bloodGroups ?? [
    { group: 'O+', demand: 88, trend: 12, level: 'High' },
    { group: 'A+', demand: 73, trend: 8, level: 'Medium' },
    { group: 'B+', demand: 65, trend: 5, level: 'Medium' },
    { group: 'AB+', demand: 38, trend: -3, level: 'Low' },
    { group: 'O-', demand: 59, trend: 6, level: 'Medium' },
    { group: 'A-', demand: 52, trend: 2, level: 'Low' },
    { group: 'B-', demand: 44, trend: -1, level: 'Low' },
    { group: 'AB-', demand: 31, trend: -5, level: 'Low' },
  ], [insights]);

  const emergencyData = useMemo(() => insights?.emergencyIntelligence ?? {
    activeRequests: 14,
    requiredGroups: ['O+', 'B+', 'A-'],
    matchedDonors: 26,
    estimatedResponse: '18m',
    trend: 0.12,
  }, [insights]);

  const retentionData = useMemo(() => insights?.retentionSignals ?? [
    { name: 'Anjali', risk: 76, status: 'Dormant for 42 days' },
    { name: 'Suresh', risk: 68, status: 'No donation in 35 days' },
    { name: 'Meena', risk: 62, status: 'Low engagement last 3 campaigns' },
    { name: 'Rahul', risk: 58, status: 'Recently inactive' },
  ], [insights]);

  const aiRecommendations = useMemo(() => insights?.recommendations ?? [
    { title: 'Launch urgent O+ campaign in Chennai', label: 'High priority' },
    { title: 'Reward top 5 donors with bonus points', label: 'Retention' },
    { title: 'Target B+ donors in Coimbatore for next drive', label: 'Campaign' },
    { title: 'Alert logistics team for AB- transport', label: 'Ops' },
  ], [insights]);

  const demandOverview = useMemo(() => ({
    high: demandData.filter((item: any) => item.level === 'High').length,
    medium: demandData.filter((item: any) => item.level === 'Medium').length,
    low: demandData.filter((item: any) => item.level === 'Low').length,
  }), [demandData]);

  return (
    <div className="space-y-6">
      {/* Header with live timestamp */}
      <div className="flex items-center justify-between rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div>
          <h1 className="text-3xl font-semibold text-white">AI Intelligence Center</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time CRM analytics, fraud detection & emergency response</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 border border-emerald-500/20">
          <Zap className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-200">Last Updated: {getTimeAgo(lastUpdated)}</span>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid gap-6 xl:grid-cols-4">
        {[
          { label: 'Predictions Generated', value: summaryStats.totalPredictions, accent: 'from-cyan-500 to-slate-900', icon: '📊' },
          { label: 'AI Accuracy', value: `${summaryStats.aiAccuracy}%`, accent: 'from-emerald-500 to-slate-900', icon: '✓' },
          { label: 'Emergency Success', value: `${summaryStats.emergencySuccess}%`, accent: 'from-amber-500 to-slate-900', icon: '🚨' },
          { label: 'Retention Lift', value: `${summaryStats.retentionImprovement}%`, accent: 'from-violet-500 to-slate-900', icon: '📈' },
        ].map((item) => (
          <div key={item.label} className={`rounded-[28px] border border-white/10 bg-gradient-to-br ${item.accent} p-6 shadow-xl shadow-cyan-500/10 group hover:shadow-2xl transition`}>
            <div className="text-sm uppercase tracking-[0.24em] text-slate-300">{item.label}</div>
            <div className="mt-4 text-4xl font-semibold text-white">{item.value}</div>
          </div>
        ))}
      </div>

      {/* AI Fraud Detection Section */}
      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard title="🛡️ AI Fraud Detection" subtitle="Live security monitoring" className="xl:col-span-2">
          <div className="space-y-4">
            {/* Fraud metrics row */}
            <div className="grid grid-cols-4 gap-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-xs uppercase text-slate-500 font-semibold">Fraud Risk</div>
                <div className="mt-3 text-2xl font-bold text-red-300">{fraudStats.fraudRiskScore}</div>
                <div className="text-xs text-slate-400 mt-1">out of 10</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-xs uppercase text-slate-500 font-semibold">Cases Detected</div>
                <div className="mt-3 text-2xl font-bold text-amber-300">{fraudStats.fraudCases}</div>
                <div className="text-xs text-slate-400 mt-1">This month</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-xs uppercase text-slate-500 font-semibold">Under Review</div>
                <div className="mt-3 text-2xl font-bold text-orange-300">{fraudStats.accountsUnderReview}</div>
                <div className="text-xs text-slate-400 mt-1">Accounts</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-xs uppercase text-slate-500 font-semibold">Security Health</div>
                <div className="mt-3 text-2xl font-bold text-emerald-300">{fraudStats.securityHealth}%</div>
                <div className="text-xs text-slate-400 mt-1">Score</div>
              </div>
            </div>

            {/* Fraud detection categories */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: 'Duplicate Donors', count: 3, icon: '👥' },
                { title: 'Fake Registrations', count: 2, icon: '❌' },
                { title: 'Hospital Anomalies', count: 4, icon: '🏥' },
                { title: 'Verified Donors', count: fraudStats.verifiedDonors, icon: '✅' },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="text-xs text-slate-500">{item.title}</div>
                      <div className="text-xl font-semibold text-white">{item.count}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Live alerts */}
        <SectionCard title="⚠️ Real-Time Alerts" subtitle="AI-generated threats">
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {fraudAlerts.map((alert: any, idx: number) => (
              <div key={idx} className={`rounded-3xl border-2 p-4 ${
                alert.risk === 'High' ? 'border-red-500/20 bg-red-500/5' :
                alert.risk === 'Medium' ? 'border-amber-500/20 bg-amber-500/5' :
                'border-emerald-500/20 bg-emerald-500/5'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-semibold text-white text-sm">{alert.title}</div>
                    <div className="text-xs text-slate-400 mt-1">{alert.detail}</div>
                  </div>
                  <div className={`rounded-full px-2 py-1 text-xs font-bold whitespace-nowrap ${
                    alert.risk === 'High' ? 'bg-red-500/20 text-red-200' :
                    alert.risk === 'Medium' ? 'bg-amber-500/20 text-amber-200' :
                    'bg-emerald-500/20 text-emerald-200'
                  }`}>{alert.risk}</div>
                </div>
                <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {alert.timestamp}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Life Saver & Demand Forecast */}
      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard title="Life Saver Score" subtitle="Ranked by AI donor readiness" className="xl:col-span-2">
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 text-xs uppercase text-slate-500">
              <span className="col-span-5">Donor</span>
              <span className="col-span-2">Group</span>
              <span className="col-span-3">Status</span>
              <span className="col-span-2 text-right">Score</span>
            </div>
            {topDonors.map((donor: any, index: number) => (
              <div key={donor.name} className="grid grid-cols-12 gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition">
                <div className="col-span-5">
                  <div className="text-sm font-semibold text-white">{index + 1}. {donor.name}</div>
                  <div className="text-xs text-slate-400">Donations, loyalty, response</div>
                </div>
                <div className="col-span-2 text-slate-300">{donor.bloodGroup}</div>
                <div className="col-span-3">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusColors[donor.status] || 'bg-slate-500/10 text-slate-200'}`}>{donor.status}</span>
                </div>
                <div className="col-span-2 text-right text-white font-semibold">{donor.score}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Blood Demand Forecast" subtitle="Forecast by blood group">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demandData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                    <XAxis dataKey="group" stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(15,23,42,0.7)' }} contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.18)', borderRadius: 12 }} />
                    <Bar dataKey="demand" radius={[12, 12, 0, 0]}>
                      {demandData.map((entry: any) => (
                        <Cell key={entry.group} fill={demandColors[entry.level as string] || '#38bdf8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {Object.entries(demandOverview).map(([level, count]) => (
                <div key={level} className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-center">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{level}</div>
                  <div className="mt-3 text-3xl font-semibold text-white">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Emergency & Retention */}
      <div className="grid gap-6 xl:grid-cols-4">
        <SectionCard title="Emergency Intelligence" subtitle="Critical response overview" className="xl:col-span-2">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-white/5 p-4">
                <div className="text-sm text-slate-400">Active Emergency Requests</div>
                <div className="mt-3 text-3xl font-semibold text-white">{emergencyData.activeRequests}</div>
              </div>
              <div className="rounded-3xl bg-white/5 p-4">
                <div className="text-sm text-slate-400">AI Matched Donors</div>
                <div className="mt-3 text-3xl font-semibold text-white">{emergencyData.matchedDonors}</div>
              </div>
            </div>
            <div className="rounded-3xl bg-white/5 p-4">
              <div className="text-sm text-slate-400">Required Blood Groups</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {emergencyData.requiredGroups.map((group: string) => (
                  <span key={group} className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">{group}</span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-white/5 p-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Estimated Response Time</div>
                <div className="mt-2 text-3xl font-semibold text-white">{emergencyData.estimatedResponse}</div>
              </div>
              <div className="rounded-3xl bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">{Math.round((emergencyData.trend ?? 0) * 100)}% faster</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Retention Signals" subtitle="Churn risk and re-engagement" className="xl:col-span-2">
          <div className="space-y-4">
            {retentionData.map((signal: any) => (
              <div key={signal.name} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-white">{signal.name}</div>
                    <div className="text-xs text-slate-400">{signal.status}</div>
                  </div>
                  <div className="text-2xl font-semibold text-slate-100">{signal.risk}%</div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${signal.risk}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* AI Recommendations */}
      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="AI Recommendations" subtitle="Priority actions for administrators">
          <div className="space-y-3">
            {aiRecommendations.map((item: any) => (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-white text-sm">{item.title}</div>
                  <div className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Performance Dashboard" subtitle="System metrics">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-slate-400">Total Predictions</div>
              <div className="mt-3 text-3xl font-semibold text-white">{summaryStats.totalPredictions}</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-slate-400">AI Accuracy</div>
              <div className="mt-3 text-3xl font-semibold text-white">{summaryStats.aiAccuracy}%</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-slate-400">Emergency Success</div>
              <div className="mt-3 text-3xl font-semibold text-white">{summaryStats.emergencySuccess}%</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-slate-400">Retention Gain</div>
              <div className="mt-3 text-3xl font-semibold text-white">{summaryStats.retentionImprovement}%</div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default AIInsightsPage;

