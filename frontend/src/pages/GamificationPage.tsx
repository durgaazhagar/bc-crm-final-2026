import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Gamepad,
  Trophy,
  Sparkles,
  BarChart3,
  Heart,
  Users,
  ShieldCheck,
  Sparkles as SparklesIcon,
  ArrowUpRight,
  Gift,
  TrendingUp,
  Medal,
  Activity,
  Globe,
} from 'lucide-react';

const levels = [
  { tier: 'Bronze', min: 0, max: 499, color: 'from-amber-500 to-orange-500' },
  { tier: 'Silver', min: 500, max: 1199, color: 'from-slate-400 to-sky-500' },
  { tier: 'Gold', min: 1200, max: 2199, color: 'from-yellow-300 to-amber-500' },
  { tier: 'Platinum', min: 2200, max: 9999, color: 'from-cyan-400 to-violet-500' },
];

const badges = [
  { id: 'hero', title: 'Lifetime Hero', emoji: '🏆', subtitle: '100 donations', unlocked: true, color: 'from-yellow-400 to-orange-500' },
  { id: 'builder', title: 'Community Builder', emoji: '🤝', subtitle: '50 referrals', unlocked: true, color: 'from-pink-500 to-fuchsia-500' },
  { id: 'hydration', title: 'Hydration Hero', emoji: '💧', subtitle: 'Support 10 plasma drives', unlocked: false, color: 'from-cyan-400 to-blue-600' },
  { id: 'nutrition', title: 'Nutrition Star', emoji: '🍎', subtitle: 'Run 5 wellness events', unlocked: false, color: 'from-emerald-400 to-lime-500' },
];

const challenges = [
  { title: 'Refer 1 donor today', reward: '50 points', progress: 80, status: 'In progress' },
  { title: 'Complete 1 campaign shift', reward: '80 points', progress: 35, status: 'Pending' },
  { title: 'Share a wellness tip', reward: '30 points', progress: 100, status: 'Done' },
];

const leaderboardData = [
  { category: 'donors', name: 'Durga', points: 1240, activity: '22 donations', tier: 'Platinum' },
  { category: 'donors', name: 'Gopi', points: 1120, activity: '20 donations', tier: 'Gold' },
  { category: 'donors', name: 'Ganesh', points: 980, activity: '18 donations', tier: 'Gold' },
  { category: 'hospitals', name: 'City Care', points: 870, activity: '18 events', tier: 'Silver' },
  { category: 'hospitals', name: 'Grace Hospital', points: 760, activity: '15 drives', tier: 'Silver' },
  { category: 'volunteers', name: 'Anjali', points: 680, activity: '12 shifts', tier: 'Silver' },
  { category: 'volunteers', name: 'Rajan', points: 610, activity: '10 referrals', tier: 'Silver' },
];

const rewards = [
  { id: 'wellness-kit', name: 'Wellness Kit', emoji: '🎁', cost: 500 },
  { id: 'coffee-voucher', name: 'Coffee Voucher', emoji: '☕', cost: 200 },
  { id: 'fitness-band', name: 'Fitness Band', emoji: '⌚', cost: 1200 },
  { id: 'medal-engraving', name: 'Engraved Medal', emoji: '🏅', cost: 900 },
];

const quotePool = [
  'Every donation is a heartbeat of hope. ❤️',
  'Great work! Your kindness grows stronger every day. 🌱',
  'A single referral multiplies lives. Keep going! 💪',
  'Milestones are earned through steady generosity. ✨',
];

const GamificationPage: React.FC = () => {
  const [category, setCategory] = useState<'donors' | 'hospitals' | 'volunteers'>('donors');
  const [sortBy, setSortBy] = useState<'points' | 'activity'>('points');
  const [selectedReward, setSelectedReward] = useState(rewards[0].id);

  const userData = {
    currentPoints: 1420,
    donations: 87,
    referrals: 21,
    campaigns: 9,
    streakDays: 5,
    metrics: {
      engagement: 92,
      participation: 78,
      volunteerImpact: 83,
    },
  };

  const currentLevel = useMemo(() => {
    return levels.slice().reverse().find((level) => userData.currentPoints >= level.min) || levels[0];
  }, [userData.currentPoints]);

  const nextLevel = useMemo(() => {
    return levels.find((level) => level.min > currentLevel.min) || currentLevel;
  }, [currentLevel]);

  const progressToNext = useMemo(() => {
    if (currentLevel === nextLevel) return 100;
    const range = nextLevel.min - currentLevel.min;
    const achieved = userData.currentPoints - currentLevel.min;
    return Math.min(100, Math.round((achieved / range) * 100));
  }, [currentLevel, nextLevel, userData.currentPoints]);

  const leaderboard = useMemo(() => {
    return leaderboardData
      .filter((item) => item.category === category)
      .sort((a, b) => {
        if (sortBy === 'points') return b.points - a.points;
        return b.activity.localeCompare(a.activity);
      });
  }, [category, sortBy]);

  const nextRewardPoints = useMemo(() => {
    return Math.max(0, nextLevel.min - userData.currentPoints);
  }, [nextLevel, userData.currentPoints]);

  const randomQuote = useMemo(() => {
    return quotePool[Math.floor(Math.random() * quotePool.length)];
  }, []);

  return (
    <div className="min-h-screen p-6 text-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-3 rounded-3xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20">
            <Gamepad className="h-5 w-5" />
            Gamification Hub
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">Level up donor engagement with rewards, badges, and analytics.</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">Track points, streaks, and milestones while motivating donors and partners through gamified achievements.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 text-slate-300">
            <Sparkles className="h-5 w-5 text-amber-300" />
            <span>Achievement unlocked</span>
          </div>
          <div className="mt-3 text-xl font-semibold text-white">New tier within reach</div>
          <div className="mt-2 text-sm text-slate-400">Earn {nextRewardPoints} more points to reach {nextLevel.tier}.</div>
        </motion.div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <motion.div
              className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl shadow-slate-900/30"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Donor Points</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{userData.currentPoints} pts</p>
                </div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500 to-fuchsia-500 text-white shadow-lg shadow-rose-500/20">
                  <Trophy className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-6 rounded-3xl bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>{currentLevel.tier} tier</span>
                  <span>{progressToNext}%</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${currentLevel.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNext}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                  />
                </div>
                <p className="mt-3 text-sm text-slate-400">{currentLevel.tier} requires {currentLevel.min}–{nextLevel.min} points. You are {nextRewardPoints} pts away from {nextLevel.tier}.</p>
              </div>
            </motion.div>

            <motion.div
              className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl shadow-slate-900/30"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Streak & Challenges</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{userData.streakDays} days 🔥</p>
                </div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20">
                  <SparklesIcon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/5 p-4 text-center">
                  <p className="text-sm text-slate-400">Donations</p>
                  <p className="mt-2 text-xl font-semibold text-white">{userData.donations}</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4 text-center">
                  <p className="text-sm text-slate-400">Referrals</p>
                  <p className="mt-2 text-xl font-semibold text-white">{userData.referrals}</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl shadow-slate-900/30"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Badges</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Unlock achievements</h2>
              </div>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">4 total</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {badges.map((badge) => (
                <motion.div
                  key={badge.id}
                  whileHover={{ y: -4 }}
                  className={`rounded-3xl border p-4 shadow-lg transition ${badge.unlocked ? 'border-emerald-400/20 bg-emerald-500/10' : 'border-white/10 bg-white/5'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br ${badge.color} text-2xl shadow-xl shadow-slate-900/20`}>
                      {badge.emoji}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">{badge.title}</p>
                      <p className="text-sm text-slate-400">{badge.subtitle}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-400">
                    <span>{badge.unlocked ? 'Unlocked' : 'Locked'}</span>
                    <span>{badge.unlocked ? '⭐' : '🔒'}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl shadow-slate-900/30"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Daily Challenges</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Keep your momentum</h2>
              </div>
              <div className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">3 active</div>
            </div>
            <div className="mt-5 space-y-4">
              {challenges.map((challenge) => (
                <div key={challenge.title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{challenge.title}</p>
                      <p className="text-xs text-slate-400">Reward: {challenge.reward}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${challenge.status === 'Done' ? 'bg-emerald-500/15 text-emerald-300' : challenge.status === 'In progress' ? 'bg-amber-500/15 text-amber-300' : 'bg-slate-700/60 text-slate-200'}`}
                    >
                      {challenge.status}
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${challenge.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl shadow-slate-900/30"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Leaderboard</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Top performers</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="grid grid-cols-3 gap-2 rounded-3xl bg-white/5 p-2 text-sm text-slate-300">
                  {(['donors', 'hospitals', 'volunteers'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`rounded-2xl px-3 py-2 transition ${category === cat ? 'bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white shadow-lg shadow-rose-500/20' : 'hover:bg-white/10'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as 'points' | 'activity')}
                  className="rounded-3xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none transition hover:border-white/20"
                >
                  <option value="points">Sort by points</option>
                  <option value="activity">Sort by activity</option>
                </select>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {leaderboard.map((person, index) => (
                <div key={person.name} className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xl font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{person.name}</p>
                      <p className="text-sm text-slate-400">{person.activity}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{person.tier}</p>
                    <p className="text-lg font-semibold text-white">{person.points} pts</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl shadow-slate-900/30"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Rewards & Motivation</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Redeem points for gifts</h2>
              </div>
              <div className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">Next reward</div>
            </div>
            <div className="mt-5 space-y-4">
              {rewards.map((reward) => (
                <button
                  key={reward.id}
                  onClick={() => setSelectedReward(reward.id)}
                  className={`w-full rounded-3xl border px-4 py-4 text-left transition ${selectedReward === reward.id ? 'border-cyan-400/40 bg-cyan-500/10 text-white shadow-lg shadow-cyan-500/10' : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500 to-orange-500 text-2xl shadow-lg shadow-rose-500/20">{reward.emoji}</div>
                      <div>
                        <p className="font-semibold text-white">{reward.name}</p>
                        <p className="text-sm text-slate-400">Redeem for {reward.cost} pts</p>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-white">Redeem</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl shadow-slate-900/30"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Analytics</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Engagement trends</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                <TrendingUp className="h-4 w-4" /> Predictive insights
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/5 p-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <BarChart3 className="h-5 w-5 text-cyan-300" />
                  <span className="text-sm uppercase tracking-[0.24em]">Engagement</span>
                </div>
                <p className="mt-4 text-2xl font-semibold text-white">{userData.metrics.engagement}%</p>
                <p className="mt-2 text-sm text-slate-400">Donor activity rate over the past month.</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <Heart className="h-5 w-5 text-rose-400" />
                  <span className="text-sm uppercase tracking-[0.24em]">Hospital activity</span>
                </div>
                <p className="mt-4 text-2xl font-semibold text-white">{userData.metrics.participation}%</p>
                <p className="mt-2 text-sm text-slate-400">Partner hospital participation in drives.</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <Users className="h-5 w-5 text-emerald-300" />
                  <span className="text-sm uppercase tracking-[0.24em]">Volunteer impact</span>
                </div>
                <p className="mt-4 text-2xl font-semibold text-white">{userData.metrics.volunteerImpact}%</p>
                <p className="mt-2 text-sm text-slate-400">Volunteer contributions to donor outreach.</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <Globe className="h-5 w-5 text-sky-300" />
                  <span className="text-sm uppercase tracking-[0.24em]">Next reward</span>
                </div>
                <p className="mt-4 text-2xl font-semibold text-white">{nextRewardPoints} pts away</p>
                <p className="mt-2 text-sm text-slate-400">Prediction: tier arrival within 3 donations.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-rose-500/10 via-fuchsia-500/10 to-cyan-500/10 p-5 text-center shadow-xl shadow-rose-500/10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55 }}
          >
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-3xl">🎉</div>
            <p className="mt-4 text-lg font-semibold text-white">Milestone unlocked!</p>
            <p className="mt-2 max-w-xl mx-auto text-sm text-slate-300">You are on track for Platinum with 87 donations, 21 referrals, and strong volunteer support. Keep the streak alive.</p>
            <p className="mt-3 text-sm text-cyan-200">{randomQuote}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GamificationPage;
