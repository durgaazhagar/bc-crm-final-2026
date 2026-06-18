import React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Phone,
  Mail,
  Clock,
  Target,
  Star,
  Trophy,
  Medal,
  CalendarDays,
  MessageCircle,
  Sparkles,
  Heart,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const volunteers = [
  {
    id: 1,
    name: 'Meena Kumari',
    role: 'Field Coordinator',
    phone: '+91 98765 43210',
    email: 'meena.kumar@bloodconnect.org',
    campaigns: 14,
    donors: 42,
    hours: 64,
    avatar: 'MK',
    lastActivity: 'Chennai Blood Drive • 2 days ago',
  },
  {
    id: 2,
    name: 'Arjun Rao',
    role: 'Emergency Responder',
    phone: '+91 91234 56789',
    email: 'arjun.rao@bloodconnect.org',
    campaigns: 12,
    donors: 29,
    hours: 52,
    avatar: 'AR',
    lastActivity: 'O- urgent match • 5 days ago',
  },
  {
    id: 3,
    name: 'Nisha Patel',
    role: 'Donor Outreach',
    phone: '+91 99876 54321',
    email: 'nisha.patel@bloodconnect.org',
    campaigns: 9,
    donors: 34,
    hours: 48,
    avatar: 'NP',
    lastActivity: 'Volunteer training • 1 week ago',
  },
];

const hoursTrend = [
  { month: 'Jan', hours: 26 },
  { month: 'Feb', hours: 34 },
  { month: 'Mar', hours: 42 },
  { month: 'Apr', hours: 48 },
  { month: 'May', hours: 58 },
  { month: 'Jun', hours: 64 },
];

const campaignTrend = [
  { name: 'Week 1', campaigns: 3 },
  { name: 'Week 2', campaigns: 5 },
  { name: 'Week 3', campaigns: 4 },
  { name: 'Week 4', campaigns: 6 },
];

const referralMix = [
  { name: 'Donors referred', value: 42 },
  { name: 'Active volunteers', value: 134 },
];

const events = [
  { id: 1, title: 'Chennai Blood Drive', date: 'Aug 8', icon: '❤️', status: 'Open' },
  { id: 2, title: 'O- Rapid Response', date: 'Aug 12', icon: '📅', status: 'One-click signup' },
  { id: 3, title: 'Volunteer Training', date: 'Aug 18', icon: '❤️', status: 'Seats left' },
];

const badges = [
  { icon: '🏆', title: 'Campaign Champion', detail: '10+ campaigns completed', unlocked: true },
  { icon: '🎖', title: 'Hours Hero', detail: '50+ hours contributed', unlocked: true },
  { icon: '🌟', title: 'Referral Star', detail: 'Donors referred this quarter', unlocked: false },
];

const VolunteerManagementPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 px-4 py-6 sm:px-6 lg:px-8"
    >
      <style>{`
        @keyframes popConfetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-18px) rotate(18deg); opacity: 0; }
        }
      `}</style>

      <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-red-600/15 via-fuchsia-600/10 to-violet-800/10 p-6 shadow-2xl shadow-purple-900/10 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">Volunteer Command Center</p>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">Volunteer Management</h1>
            <p className="text-slate-200 sm:text-lg">Mobilize your blood network with smart profiles, gamified rewards, and AI-powered re-engagement tips.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:auto-cols-max lg:grid-flow-col">
            <button className="inline-flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-red-500 via-fuchsia-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:-translate-y-0.5 hover:shadow-2xl">
              <Sparkles className="h-4 w-4" /> Invite to next drive
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-3xl border border-white/10 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
              <ShieldCheck className="h-4 w-4" /> Review volunteer readiness
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.75fr_1fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Volunteer profiles</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Active team members</h2>
            </div>
            <div className="rounded-3xl bg-slate-950/80 px-4 py-3 text-sm text-slate-300">Verified by AI suggestions</div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {volunteers.map((volunteer) => (
              <div key={volunteer.id} className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/5 to-white/3 p-5 shadow-lg transition hover:-translate-y-1 hover:border-cyan-400/30">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-fuchsia-500 text-lg font-bold text-white shadow-xl">{volunteer.avatar}</div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-white">{volunteer.name}</h3>
                    <p className="text-sm text-slate-400">{volunteer.role}</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-3 text-slate-300">
                    <User className="h-4 w-4" />
                    <span>{volunteer.lastActivity}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Phone className="h-4 w-4" />
                    <span>{volunteer.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Mail className="h-4 w-4" />
                    <span>{volunteer.email}</span>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl bg-slate-950/70 p-3 text-center">
                    <p className="text-3xl font-semibold text-white">{volunteer.hours}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Hours</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/70 p-3 text-center">
                    <p className="text-3xl font-semibold text-white">{volunteer.campaigns}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Campaigns</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/70 p-3 text-center">
                    <p className="text-3xl font-semibold text-white">{volunteer.donors}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Referrals</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Engagement metrics</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Performance overview</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-3xl bg-fuchsia-500/10 px-3 py-2 text-sm text-fuchsia-200">Live insights</div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl bg-slate-950/80 p-4">
                <div className="mb-4 flex items-center gap-3 text-slate-200">
                  <Clock className="h-5 w-5 text-cyan-300" />
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Volunteer hours trend</p>
                    <p className="text-base font-semibold text-white">Increasing activity this quarter</p>
                  </div>
                </div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hoursTrend} margin={{ top: 5, right: 8, left: -10, bottom: 5 }}>
                      <CartesianGrid stroke="#ffffff0d" strokeDasharray="3 3" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ background: '#0f172a', borderRadius: 16, border: '1px solid #334155' }} />
                      <Line type="monotone" dataKey="hours" stroke="#f472b6" strokeWidth={4} dot={{ r: 3, fill: '#f472b6' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-950/80 p-4">
                <div className="mb-4 flex items-center gap-3 text-slate-200">
                  <Target className="h-5 w-5 text-amber-300" />
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Campaigns joined</p>
                    <p className="text-base font-semibold text-white">Participation across the month</p>
                  </div>
                </div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={campaignTrend} margin={{ top: 5, right: 8, left: -10, bottom: 5 }}>
                      <CartesianGrid stroke="#ffffff0d" strokeDasharray="3 3" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ background: '#0f172a', borderRadius: 16, border: '1px solid #334155' }} />
                      <Bar dataKey="campaigns" fill="#fb7185" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-950/80 p-4">
                <div className="mb-4 flex items-center gap-3 text-slate-200">
                  <Star className="h-5 w-5 text-emerald-300" />
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Donor referrals</p>
                    <p className="text-base font-semibold text-white">Referral impact vs active volunteers</p>
                  </div>
                </div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={referralMix} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={3}>
                        <Cell fill="#f97316" />
                        <Cell fill="#8b5cf6" />
                      </Pie>
                      <Tooltip contentStyle={{ background: '#0f172a', borderRadius: 16, border: '1px solid #334155' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Rewards & badges</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Gamified volunteer milestones</h2>
              </div>
              <div className="rounded-3xl bg-red-500/15 px-3 py-2 text-xs uppercase tracking-[0.25em] text-red-200">Keep unlocking</div>
            </div>

            <div className="space-y-4">
              {badges.map((badge) => (
                <div key={badge.title} className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-r from-white/5 to-white/10 px-5 py-5 shadow-lg">
                  <div className="absolute right-4 top-4 h-3 w-3 rounded-full bg-emerald-300 opacity-50 animate-pulse"></div>
                  <div className="flex items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-3xl ${badge.unlocked ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>
                      <span className="text-2xl">{badge.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{badge.title}</h3>
                      <p className="text-sm text-slate-400">{badge.detail}</p>
                    </div>
                    <div className="ml-auto text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{badge.unlocked ? 'Unlocked' : 'Locked'}</div>
                  </div>
                  {badge.unlocked && (
                    <div className="mt-4 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-200">Celebration unlocked!</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_0.8fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Upcoming events</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Campaign calendar</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-3xl bg-pink-500/10 px-3 py-2 text-sm text-pink-200">
              <CalendarDays className="h-4 w-4" /> 3 events
            </div>
          </div>

          <div className="grid gap-4">
            {events.map((event) => (
              <div key={event.id} className="rounded-[28px] border border-white/10 bg-slate-950/80 p-5 shadow-lg transition hover:-translate-y-1 hover:border-fuchsia-400/20">
                <div className="flex items-center gap-4 text-slate-200">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-violet-500 text-xl">{event.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{event.date} • {event.status}</p>
                  </div>
                  <button className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5">
                    Signup
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950/90 to-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-3 text-slate-200">
              <MessageCircle className="h-5 w-5 text-fuchsia-300" />
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Communication hub</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">One-click outreach</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              {[
                { label: 'WhatsApp', tone: 'from-emerald-400 to-cyan-500' },
                { label: 'SMS', tone: 'from-fuchsia-500 to-pink-500' },
                { label: 'Email', tone: 'from-sky-500 to-indigo-500' },
              ].map((channel) => (
                <button key={channel.label} className={`inline-flex w-full items-center justify-between rounded-3xl px-5 py-4 text-left text-white shadow-lg shadow-slate-900/30 transition hover:-translate-y-0.5 bg-gradient-to-r ${channel.tone}`}>
                  <div className="space-y-1">
                    <p className="text-base font-semibold">{channel.label}</p>
                    <p className="text-sm text-white/80">Contact volunteers instantly</p>
                  </div>
                  <span className="text-2xl">➜</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3 text-slate-200">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">AI suggestions</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">Smart re-engagement tips</h2>
              </div>
            </div>
            <div className="grid gap-4">
              {[
                'Invite volunteers with high availability to the next blood drive.',
                'Send a targeted message to inactive volunteers in Chennai.',
                'Reward top performers with a badge to boost retention.',
              ].map((tip) => (
                <div key={tip} className="rounded-3xl border border-white/10 bg-slate-950/75 p-4 text-slate-200 shadow-sm">
                  <p className="font-semibold text-white">💡 {tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default VolunteerManagementPage;
