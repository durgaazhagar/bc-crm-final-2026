import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import SectionCard from '../components/SectionCard';
import { Trophy, Star, Users, Activity, Award } from 'lucide-react';
import { API_BASE } from '../services/config';

const tiers = [
  {
    name: 'Platinum',
    icon: '🏆',
    min: 100,
    donorCount: 28,
    currentPoints: 1240,
    nextThreshold: null,
    progress: 100,
    gradient: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(209,250,229,0.22))',
    options: ['Executive donor badge', 'Premium recognition kit', 'Hospital VIP pass'],
  },
  {
    name: 'Gold',
    icon: '🥇',
    min: 60,
    donorCount: 62,
    currentPoints: 84,
    nextThreshold: 100,
    progress: 84,
    gradient: 'linear-gradient(135deg, rgba(254,243,199,0.22), rgba(251,191,36,0.14))',
    options: ['Gift voucher', 'Priority campaign invites', 'Donor spotlight'],
  },
  {
    name: 'Silver',
    icon: '🥈',
    min: 30,
    donorCount: 108,
    currentPoints: 48,
    nextThreshold: 60,
    progress: 80,
    gradient: 'linear-gradient(135deg, rgba(226,232,240,0.22), rgba(147,197,253,0.18))',
    options: ['Wellness gift set', 'Recognition certificate', 'Early access perks'],
  },
  {
    name: 'Bronze',
    icon: '🥉',
    min: 0,
    donorCount: 154,
    currentPoints: 18,
    nextThreshold: 30,
    progress: 60,
    gradient: 'linear-gradient(135deg, rgba(254,226,226,0.22), rgba(252,165,165,0.16))',
    options: ['Welcome gift', 'Community badge', 'Donation reminder support'],
  },
];

const sampleLeaderboard = [
  { name: 'Durga', points: 1240, donations: 22, tier: 'Platinum' },
  { name: 'Gopi', points: 1120, donations: 20, tier: 'Gold' },
  { name: 'Ganesh', points: 980, donations: 18, tier: 'Gold' },
  { name: 'Dinesh', points: 860, donations: 15, tier: 'Silver' },
  { name: 'Praveen', points: 720, donations: 12, tier: 'Silver' },
];

const retentionForecast = [
  { period: 'Now', retention: 82 },
  { period: '30d', retention: 78 },
  { period: '60d', retention: 74 },
  { period: '90d', retention: 71 },
  { period: '180d', retention: 68 },
];

const redemptionHistory = [
  { id: 'R-1001', date: '2026-05-12', reward: 'T-Shirt', points: 120 },
  { id: 'R-1008', date: '2026-05-28', reward: 'Coffee Voucher', points: 60 },
];

const sparkData = [
  { name: 'Week1', value: 40 },
  { name: 'Week2', value: 52 },
  { name: 'Week3', value: 63 },
  { name: 'Week4', value: 75 },
];

type AIRecommendation = {
  id: number;
  title: string;
  estLift: string;
  status: string;
  appliedOn?: string;
};

const CRMIntelligenceCenter = () => {
  const [selectedTier, setSelectedTier] = useState('Gold');
  const [modalOpen, setModalOpen] = useState(false);
  const [deploymentModalOpen, setDeploymentModalOpen] = useState(false);
  const [deploymentAction, setDeploymentAction] = useState<{ title: string; subtitle: string; emoji: string; appliedOn?: string } | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [confettiActive, setConfettiActive] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([
    {
      id: 1,
      title: 'Send personalized gratitude messages to Platinum donors',
      estLift: '+6% engagement',
      status: 'Pending',
    },
    {
      id: 2,
      title: 'Offer points bonus for O- donors in critical districts',
      estLift: '+12% response',
      status: 'Pending',
    },
  ]);
  const totalPoints = sampleLeaderboard.reduce((s, d) => s + d.points, 0);

  const selectedTierData = tiers.find((tier) => tier.name === selectedTier) ?? tiers[1];
  const upliftPercent = deploymentAction?.emoji === '💌' ? 18 : deploymentAction?.emoji === '🚀' ? 24 : 20;

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timer = window.setTimeout(() => setToastMessage(''), 3000);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    if (!confettiActive) return undefined;
    const timer = window.setTimeout(() => setConfettiActive(false), 1800);
    return () => window.clearTimeout(timer);
  }, [confettiActive]);

  const atRisk = useMemo(() => [
    { name: 'Meena', lastDonationDays: 132, risk: 86 },
    { name: 'Suresh', lastDonationDays: 95, risk: 71 },
  ], []);

  const applyRewardAction = async (recommendation: AIRecommendation) => {
    const appliedOn = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setAiRecommendations((current) =>
      current.map((item) =>
        item.id === recommendation.id
          ? { ...item, status: 'Applied', appliedOn }
          : item
      )
    );

    setDeploymentAction({
      title: recommendation.title,
      subtitle:
        recommendation.id === 1
          ? 'Thank-you message sent and 50 pts bonus scheduled'
          : 'Points bonus deployed and tracking enabled',
      emoji: recommendation.id === 1 ? '🎁' : '🚀',
      appliedOn,
    });
    setDeploymentModalOpen(true);
    setToastMessage('✅ Action applied successfully');
    setConfettiActive(true);

    try {
      await fetch(`${API_BASE}/ai-reward-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: recommendation.title,
          appliedOn: new Date().toISOString(),
          meta: recommendation.id === 1 ? { bonusPoints: 50, donorTier: 'Platinum' } : { donorGroup: 'O-', region: 'Critical Districts' },
        }),
      });
    } catch (error) {
      console.warn('Reward action API unavailable, state updated locally.', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-400">CRM Intelligence Center</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Relationship Intelligence & Rewards</h1>
          <p className="mt-1 text-sm text-slate-300">Comprehensive donor engagement, loyalty, rewards, and retention analytics.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-slate-400">Total Loyalty Points</div>
            <div className="text-2xl font-semibold text-white">{totalPoints}</div>
          </div>
          <button className="rounded-full bg-amber-500/10 px-4 py-2 text-amber-200">Redeem Points</button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <SectionCard title="Reward Intelligence" subtitle="Tier distribution & redemption" className="lg:col-span-2">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Tier Breakdown</h3>
                  <p className="text-sm text-slate-400">Platinum / Gold / Silver / Bronze</p>
                </div>
                <Trophy className="h-6 w-6 text-slate-300" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {tiers.map((tier) => (
                  <motion.div
                    key={tier.name}
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className="dashboard-card overflow-hidden rounded-xl border border-white/20 bg-gray-900/80 backdrop-blur-xl p-4 text-center shadow-lg"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-4xl">{tier.icon}</div>
                      <div className="text-lg font-semibold text-white truncate tier-name-gradient">{tier.name}</div>
                      <div className="text-sm text-slate-400">Min points: {tier.min}</div>
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{tier.donorCount} donors</div>
                    </div>
                    <div className="mt-4">
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-blue-500" style={{ width: `${tier.progress}%` }} />
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-400">
                        <span>{tier.nextThreshold ? `${tier.progress}% to next tier` : 'Top tier elite'}</span>
                        <button
                          onClick={() => {
                            setSelectedTier(tier.name);
                            setModalOpen(true);
                          }}
                          className="view-button inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.35)]"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm text-slate-400">Recent Redemptions</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {redemptionHistory.map((r) => (
                  <li key={r.id} className="dashboard-card flex items-center justify-between gap-3 rounded-xl border border-white/20 bg-gray-900/80 p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🎁</span>
                      <div>
                        <div className="font-semibold text-white truncate">{r.reward}</div>
                        <div className="text-xs italic text-slate-500">{r.date}</div>
                      </div>
                    </div>
                    <span className="badge-gradient rounded-full px-3 py-1 text-sm font-semibold text-white">{r.points} pts</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Top Donor Leaderboard" subtitle="Recognition & gamification" className="lg:col-span-2">
          <div className="space-y-3">
            <div className="grid gap-3">
              {sampleLeaderboard.map((d, i) => (
                <div key={d.name} className="dashboard-card flex items-center justify-between gap-3 rounded-xl border border-white/20 bg-gray-900/80 p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-lg">👤</div>
                    <div>
                      <div className="font-semibold text-white truncate">{d.name}</div>
                      <div className="text-sm text-slate-400">{d.donations} donations</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="badge-gradient rounded-full px-3 py-1 text-sm font-semibold text-white">{d.points} pts</span>
                    <span className="text-xs text-slate-400">{d.tier}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Donor Relationship Health" subtitle="Engagement & lifetime value" className="lg:col-span-2">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/5 p-4 text-center">
                <div className="text-xs text-slate-400">Avg Relationship Score</div>
                <div className="text-2xl font-semibold text-white">86</div>
              </div>
              <div className="rounded-3xl bg-white/5 p-4 text-center">
                <div className="text-xs text-slate-400">Avg Donations / donor</div>
                <div className="text-2xl font-semibold text-white">3.6</div>
              </div>
              <div className="rounded-3xl bg-white/5 p-4 text-center">
                <div className="text-xs text-slate-400">Active Donor Rate</div>
                <div className="text-2xl font-semibold text-white">72%</div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/5 p-4">
              <div className="text-sm text-slate-400">At-Risk Donor Detection</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {atRisk.map((r) => (
                  <li key={r.name} className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{r.name}</div>
                      <div className="text-xs text-slate-400">Last donation {r.lastDonationDays} days ago</div>
                    </div>
                    <div className="text-sm font-semibold text-red-400">Risk {r.risk}%</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="AI Reward Recommendations" subtitle="Personalized reward ideas">
          <div className="space-y-3">
            {aiRecommendations.map((rec) => (
              <div key={rec.id} className="rounded-xl border border-white/10 bg-gray-900/80 backdrop-blur-xl p-4 shadow-lg shadow-blue-500/10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-semibold text-white">{rec.title}</div>
                  <div className="mt-1 text-xs text-slate-400">Estimated lift: {rec.estLift}</div>
                  <div className="mt-2 text-sm text-slate-300">
                    Status: <span className={`font-semibold ${rec.status === 'Applied' ? 'text-emerald-300' : 'text-slate-200'}`}>{rec.status}</span>
                    {rec.appliedOn ? ` · Applied on ${rec.appliedOn}` : ''}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => applyRewardAction(rec)}
                    className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(236,72,153,0.35)]"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Campaign Performance" subtitle="Engagement analytics" className="lg:col-span-2">
          <div className="rounded-3xl bg-white/5 p-4">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={sparkData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#06b6d4" fill="url(#areaColor)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Badges & Achievements" subtitle="Recognition" className="lg:col-span-1">
          <div className="space-y-3">
            <div className="rounded-3xl bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Lifetime Hero</div>
                  <div className="text-xs text-slate-400">Awarded to top 1% donors</div>
                </div>
                <div className="text-amber-300"><Award className="h-5 w-5" /></div>
              </div>
            </div>
            <div className="rounded-3xl bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Community Builder</div>
                  <div className="text-xs text-slate-400">Referred 10 donors</div>
                </div>
                <div className="text-amber-300"><Star className="h-5 w-5" /></div>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Future Retention Forecast" subtitle="Predictive retention" className="lg:col-span-1">
          <div className="rounded-3xl bg-white/5 p-4">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={retentionForecast}>
                <XAxis dataKey="period" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="retention" stroke="#f97316" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Personalized Engagement Insights" subtitle="AI-driven next actions" className="lg:col-span-1">
          <div className="space-y-4 text-sm text-slate-300">
            <div className="rounded-xl bg-gradient-to-br from-red-500/20 via-white/10 to-blue-600/20 p-5 shadow-lg shadow-red-500/10 ring-1 ring-white/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-white">Next Best Action</div>
                  <p className="mt-2 text-xs text-slate-300">Send thank-you + 50 pts bonus to high-value donors.</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-3 text-2xl text-red-200 shadow-glow-red">💌</div>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-200">Bonus reward ready: <span className="font-semibold text-white">50 pts</span></div>
                <button
                  type="button"
                  onClick={() => {
                    setDeploymentAction({
                      title: 'Thank-you bonus deployed',
                      subtitle: '50 points sent to high-value donors',
                      emoji: '💌',
                    });
                    setDeploymentModalOpen(true);
                    setToastMessage('Action deployed successfully!');
                    setConfettiActive(true);
                  }}
                  className="deploy-button inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(59,130,246,0.45)]"
                >
                  Deploy
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-slate-900/60 via-white/5 to-slate-900/70 p-5 shadow-lg shadow-blue-500/10 ring-1 ring-white/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-white">Segment Suggestion</div>
                  <p className="mt-2 text-xs text-slate-300">Recognition email to donors with repeat contributions.</p>
                </div>
                <div className="rounded-3xl bg-blue-500/10 p-3 text-2xl text-blue-200 shadow-glow-blue">📧</div>
              </div>
              <div className="mt-5 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Target segment</span>
                    <span className="font-semibold text-white">72%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-blue-500" style={{ width: '72%' }} />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDeploymentAction({
                      title: 'Recognition segment launched',
                      subtitle: 'Donor recognition email activated',
                      emoji: '🚀',
                    });
                    setDeploymentModalOpen(true);
                    setToastMessage('Action deployed successfully!');
                    setConfettiActive(true);
                  }}
                  className="deploy-button inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(96,165,250,0.45)]"
                >
                  Launch segment 🚀
                </button>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <AnimatePresence>
        {deploymentModalOpen && deploymentAction && (
          <motion.div
            className="reward-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setDeploymentModalOpen(false)}
          >
            <motion.div
              className="reward-modal-card"
              initial={{ y: -20, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-5xl">{deploymentAction.emoji}</div>
                <div className="mt-3 text-sm uppercase tracking-[0.4em] text-slate-400">Engagement update</div>
                <div className="mt-3 text-4xl font-semibold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                  ✨ Engagement Update
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-r from-red-500/10 via-white/10 to-blue-500/10 p-5 text-center text-slate-200 shadow-lg shadow-red-500/10">
                <p className="text-xl font-semibold bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                  Donors feel valued 💖
                </p>
                <p className="mt-3 text-sm text-slate-300">
                  Your tailored recognition action is live, building loyalty and stronger donor relationships.
                </p>
              </div>

              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <span className="text-lg">📊</span>
                    <div>
                      <div className="font-semibold text-white">Tracking engagement uplift</div>
                      <div className="text-xs text-slate-400">Realtime monitoring of sentiment and response rate</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-white">+{upliftPercent}% uplift</div>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-blue-500" style={{ width: `${upliftPercent}%` }} />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setDeploymentModalOpen(false)}
                  className="rounded-full bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeploymentModalOpen(false);
                    setToastMessage('Recognition segment confirmed 🎉');
                  }}
                  className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(236,72,153,0.35)]"
                >
                  Got it 🚀
                </button>
              </div>

              {confettiActive && (
                <div className="confetti-wrapper">
                  {Array.from({ length: 24 }).map((_, index) => (
                    <span
                      key={index}
                      className="confetti-piece"
                      style={{
                        left: `${4 + index * 3.8}%`,
                        animationDelay: `${index * 0.05}s`,
                        backgroundColor: ['#ef4444', '#2563eb', '#facc15', '#ffffff'][index % 4],
                        transform: `rotate(${index * 15}deg)`,
                        '--drift': `${(index % 7) * 10 - 30}px`,
                      } as React.CSSProperties}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {modalOpen && selectedTierData && (
          <motion.div
            className="reward-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              className="reward-modal-card"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{selectedTierData.icon}</div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Tier details</div>
                    <div className="mt-2 text-3xl font-semibold tier-name-gradient">{selectedTierData.name}</div>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  Close
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Minimum points</div>
                  <div className="mt-3 text-2xl font-semibold text-white">{selectedTierData.min} pts</div>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Donor count</div>
                  <div className="mt-3 text-2xl font-semibold text-white">{selectedTierData.donorCount}</div>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Progress</div>
                  <div className="mt-3 text-2xl font-semibold text-white">{selectedTierData.progress}%</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm text-slate-400">Points to next tier</div>
                  <div className="text-sm font-semibold text-white">
                    {selectedTierData.nextThreshold ? `${Math.max(selectedTierData.nextThreshold - selectedTierData.currentPoints, 0)} pts` : 'Elite status'}
                  </div>
                </div>
                <div className="mt-3 h-3 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${selectedTierData.progress}%`, background: 'linear-gradient(90deg, #ef4444, #3b82f6)' }}
                  />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {selectedTierData.options.map((option) => (
                  <div key={option} className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                    <span className="rounded-2xl bg-red-500/15 px-3 py-2 text-lg">🎁</span>
                    <span className="text-sm text-slate-200">{option}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-400">Redeem your tier reward instantly with confident donor perks.</div>
                <button
                  onClick={() => {
                    setConfettiActive(true);
                    setToastMessage('Reward redeemed successfully 🎉');
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-blue-600 px-6 py-3 text-white font-semibold shadow-[0_20px_40px_-25px_rgba(236,72,153,0.8)] transition hover:scale-105"
                >
                  Redeem
                </button>
              </div>

              {confettiActive && (
                <div className="confetti-wrapper">
                  {Array.from({ length: 24 }).map((_, index) => (
                    <span
                      key={index}
                      className="confetti-piece"
                      style={{
                        left: `${4 + index * 3.8}%`,
                        animationDelay: `${index * 0.05}s`,
                        backgroundColor: ['#ef4444', '#2563eb', '#facc15', '#ffffff'][index % 4],
                        transform: `rotate(${index * 15}deg)`,
                        '--drift': `${(index % 7) * 10 - 30}px`,
                      } as React.CSSProperties}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            className="toast-banner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CRMIntelligenceCenter;
