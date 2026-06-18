import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  Award,
  BarChart3,
  Droplet,
  Heart,
  HeartPulse,
  Lightbulb,
  LucideIcon,
  MapPin,
  Quote,
  Sparkles,
  TrendingUp,
  Utensils,
  Zap,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import SectionCard from '../components/SectionCard';

type DonorWellness = {
  id: string;
  name: string;
  lastDonation: string;
  nextEligible: string;
  status: 'good' | 'needs-attention' | 'at-risk';
  hemoglobin: number;
  suggestedActions: string[];
  recoveryScore: number;
};

type WellnessTip = {
  title: string;
  icon: LucideIcon;
  emoji: string;
  color: string;
};

const donors: DonorWellness[] = [
  {
    id: 'D001',
    name: 'Gopi Kumar',
    lastDonation: '15 days ago',
    nextEligible: 'Ready now',
    status: 'good',
    hemoglobin: 14.2,
    suggestedActions: ['Hydration', 'Nutrition'],
    recoveryScore: 9.2,
  },
  {
    id: 'D002',
    name: 'Dinesh Patel',
    lastDonation: '25 days ago',
    nextEligible: 'Ready now',
    status: 'good',
    hemoglobin: 13.8,
    suggestedActions: ['Rest', 'Iron-rich foods'],
    recoveryScore: 8.9,
  },
  {
    id: 'D003',
    name: 'Malathika Singh',
    lastDonation: '30 days ago',
    nextEligible: '5 days',
    status: 'needs-attention',
    hemoglobin: 12.1,
    suggestedActions: ['Hydration', 'Rest', 'Nutrition'],
    recoveryScore: 7.1,
  },
  {
    id: 'D004',
    name: 'Ganesh Reddy',
    lastDonation: '32 days ago',
    nextEligible: '3 days',
    status: 'at-risk',
    hemoglobin: 11.4,
    suggestedActions: ['Check-up recommended', 'Iron supplements', 'Rest'],
    recoveryScore: 6.2,
  },
  {
    id: 'D005',
    name: 'Durga Menon',
    lastDonation: '20 days ago',
    nextEligible: 'Ready now',
    status: 'good',
    hemoglobin: 14.5,
    suggestedActions: ['Light exercise'],
    recoveryScore: 9.1,
  },
];

const wellnessTips: WellnessTip[] = [
  { title: 'Drink plenty of water before and after donation', icon: Droplet, emoji: '💧', color: 'from-cyan-500 to-blue-500' },
  { title: 'Eat iron-rich foods like spinach and beans', icon: Utensils, emoji: '🥬', color: 'from-emerald-500 to-green-500' },
  { title: 'Avoid heavy exercise for 24 hours', icon: Activity, emoji: '🏋️', color: 'from-amber-500 to-orange-500' },
  { title: 'Get enough sleep (7-9 hours)', icon: Heart, emoji: '🛌', color: 'from-violet-500 to-purple-500' },
];

const recoveryProgressData = [
  { day: 'Day 1', score: 65, hemoglobin: 11.8 },
  { day: 'Day 2', score: 72, hemoglobin: 12.1 },
  { day: 'Day 3', score: 78, hemoglobin: 12.4 },
  { day: 'Day 4', score: 85, hemoglobin: 12.8 },
  { day: 'Day 5', score: 91, hemoglobin: 13.2 },
  { day: 'Day 6', score: 96, hemoglobin: 13.6 },
  { day: 'Day 7', score: 100, hemoglobin: 14.0 },
];

const donationFrequencyData = [
  { month: 'Jan', avg: 1.2 },
  { month: 'Feb', avg: 1.5 },
  { month: 'Mar', avg: 1.4 },
  { month: 'Apr', avg: 1.6 },
  { month: 'May', avg: 1.7 },
  { month: 'Jun', avg: 1.8 },
];

const wellnessBadges = [
  { title: 'Hydration Hero', icon: Droplet, description: 'Stayed hydrated for 30 consecutive days.' },
  { title: 'Nutrition Star', icon: Utensils, description: 'Maintained iron-rich diet goals.' },
  { title: 'Rest Champion', icon: Heart, description: 'Achieved optimal sleep patterns.' },
  { title: 'Wellness Warrior', icon: Zap, description: 'Completed all wellness milestones.' },
];

const motivationalQuotes = [
  '❤️ Your blood donation can save 3 lives. Take care of yourself!',
  '🌟 Recovery is a journey, not a destination. Celebrate small wins!',
  '💪 You are a hero. Your wellness matters to countless others.',
  '🎯 Consistent wellness habits lead to consistent donations.',
  '✨ Rest is productive. Your body needs time to bounce back.',
];

const DonorWellnessPage = () => {
  const [expandedDonor, setExpandedDonor] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const atRiskDonors = useMemo(() => donors.filter((d) => d.status === 'at-risk' || d.status === 'needs-attention'), []);
  const readyDonors = useMemo(() => donors.filter((d) => d.status === 'good'), []);
  const avgRecoveryScore = useMemo(() => Math.round(donors.reduce((acc, d) => acc + d.recoveryScore, 0) / donors.length * 10) / 10, []);

  const handleBadgeClick = (badge: string) => {
    setSelectedBadge(badge);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const currentQuote = useMemo(() => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)], []);

  const getStatusColor = (status: DonorWellness['status']) => {
    switch (status) {
      case 'good':
        return 'bg-emerald-500/10 text-emerald-200 border-emerald-500/30';
      case 'needs-attention':
        return 'bg-amber-500/10 text-amber-200 border-amber-500/30';
      case 'at-risk':
        return 'bg-rose-500/10 text-rose-200 border-rose-500/30';
    }
  };

  const getStatusIcon = (status: DonorWellness['status']) => {
    switch (status) {
      case 'good':
        return '✅';
      case 'needs-attention':
        return '⚠️';
      case 'at-risk':
        return '🚨';
    }
  };

  return (
    <div className="min-h-screen space-y-6 p-6 text-white">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-black/40">
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 w-fit text-sm font-semibold text-emerald-300">
              <HeartPulse className="mr-2 h-4 w-4" /> Donor Wellness
            </div>
            <div>
              <h1 className="text-4xl font-semibold text-white">Wellness Hub for Blood Donors</h1>
              <p className="mt-3 max-w-3xl text-slate-400">Track recovery progress, manage wellness goals, and celebrate milestones. Your health is our priority.</p>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Ready to Donate</p>
                <p className="mt-3 text-3xl font-semibold text-white">{readyDonors.length}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Needs Attention</p>
                <p className="mt-3 text-3xl font-semibold text-white">{atRiskDonors.length}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Avg Recovery Score</p>
                <p className="mt-3 text-3xl font-semibold text-white">{avgRecoveryScore}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-950 to-slate-900 p-6 shadow-xl shadow-black/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.1),_transparent_50%)]" />
          <div className="relative">
            <Quote className="h-8 w-8 text-indigo-400/50 mb-3" />
            <p className="text-lg font-semibold text-slate-100 leading-relaxed">{currentQuote}</p>
          </div>
        </div>
      </div>

      <SectionCard title="Wellness Tips" subtitle="Essential guidance for optimal recovery">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {wellnessTips.map((tip) => {
            const Icon = tip.icon;
            return (
              <div key={tip.title} className={`rounded-[28px] border border-white/10 bg-gradient-to-br ${tip.color} bg-opacity-10 p-6 shadow-xl shadow-black/20`}>
                <div className="text-4xl mb-3">{tip.emoji}</div>
                <Icon className="h-6 w-6 text-white mb-3" />
                <p className="text-sm font-semibold text-white">{tip.title}</p>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <SectionCard title="Donor Wellness Status" subtitle="Individual donor health profiles">
          <div className="space-y-4">
            {donors.map((donor) => (
              <motion.div
                key={donor.id}
                className={`rounded-3xl border p-5 cursor-pointer transition ${getStatusColor(donor.status)}`}
                whileHover={{ scale: 1.02 }}
                onClick={() => setExpandedDonor(expandedDonor === donor.id ? null : donor.id)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getStatusIcon(donor.status)}</span>
                      <div>
                        <p className="font-semibold text-white">{donor.name}</p>
                        <p className="text-xs text-slate-400">Hemoglobin: {donor.hemoglobin}g/dL</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">Last: {donor.lastDonation}</p>
                    <p className="text-xs text-slate-400">Next: {donor.nextEligible}</p>
                  </div>
                </div>

                {expandedDonor === donor.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-5 space-y-4 border-t border-white/20 pt-5">
                    <div>
                      <p className="text-sm font-semibold mb-3">Recovery Score: {donor.recoveryScore}/10</p>
                      <div className="h-2 overflow-hidden rounded-full bg-white/20">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${donor.recoveryScore * 10}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-2">Suggested Actions:</p>
                      <div className="flex flex-wrap gap-2">
                        {donor.suggestedActions.map((action) => (
                          <span key={action} className="rounded-full bg-white/10 px-3 py-1 text-xs">
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Quick Stats" subtitle="Wellness overview">
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-sm uppercase tracking-[0.2em] text-slate-400">Ready Donors</span>
                  <span className="text-2xl font-semibold text-emerald-300">{readyDonors.length}</span>
                </div>
                <p className="text-xs text-slate-500">Available for immediate donation</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-sm uppercase tracking-[0.2em] text-slate-400">At Risk</span>
                  <span className="text-2xl font-semibold text-rose-300">{atRiskDonors.length}</span>
                </div>
                <p className="text-xs text-slate-500">Require wellness check-in</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-sm uppercase tracking-[0.2em] text-slate-400">Wellness Avg</span>
                  <span className="text-2xl font-semibold text-cyan-300">{avgRecoveryScore}</span>
                </div>
                <p className="text-xs text-slate-500">Average recovery score</p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Recovery Progress" subtitle="Post-donation recovery timeline">
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recoveryProgressData} margin={{ top: 10, right: 0, left: -10, bottom: 5 }}>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[0, 110]} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148, 163, 184, 0.2)' }} />
                  <Line type="monotone" dataKey="score" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} name="Recovery Score" />
                  <Line type="monotone" dataKey="hemoglobin" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Hemoglobin (g/dL)" yAxisId="right" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Donation Frequency" subtitle="Average donations per month trend">
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={donationFrequencyData} margin={{ top: 10, right: 0, left: -10, bottom: 5 }}>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148, 163, 184, 0.2)' }} />
                  <Bar dataKey="avg" fill="#f97316" radius={[10, 10, 0, 0]} name="Avg Donations" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Wellness Badges & Recognition" subtitle="Celebrate achievements and motivate donors">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {wellnessBadges.map((badge) => {
            const Icon = badge.icon;
            const isSelected = selectedBadge === badge.title;
            return (
              <motion.div
                key={badge.title}
                className={`rounded-3xl border p-5 cursor-pointer transition ${isSelected ? 'border-cyan-400/50 bg-cyan-500/15 shadow-lg shadow-cyan-500/20' : 'border-white/10 bg-white/5'}`}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleBadgeClick(badge.title)}
              >
                <div className="text-center">
                  <div className="mb-3 text-5xl">🏆</div>
                  <Icon className="mx-auto mb-3 h-6 w-6 text-cyan-300" />
                  <p className="font-semibold text-white">{badge.title}</p>
                  <p className="mt-2 text-xs text-slate-400">{badge.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </SectionCard>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                backgroundColor: ['#38bdf8', '#f97316', '#10b981', '#f43f5e'][i % 4],
              }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
                opacity: 0,
              }}
              transition={{ duration: 2, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DonorWellnessPage;
