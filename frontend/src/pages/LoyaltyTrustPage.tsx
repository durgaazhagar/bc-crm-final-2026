import { useMemo } from 'react';
import { motion } from 'framer-motion';
import SectionCard from '../components/SectionCard';
import { Award, ShieldCheck, Star, Heart, Sparkles, Trophy, Medal, TrendingUp } from 'lucide-react';

const donorRewards = [
  { name: 'Murugan Selvam', bloodGroup: 'A+', donations: 24, trustScore: 98, points: 2320, badge: '⭐ Platinum Donor' },
  { name: 'Kavitha Rajan', bloodGroup: 'B+', donations: 18, trustScore: 94, points: 1820, badge: '🏅 Trusted Donor' },
  { name: 'Senthil Kumar', bloodGroup: 'O+', donations: 15, trustScore: 92, points: 1540, badge: '🏅 Trusted Donor' },
  { name: 'Priya Lakshmi', bloodGroup: 'A-', donations: 10, trustScore: 90, points: 1230, badge: '⭐ Platinum Donor' },
];

const badgeSets = [
  { icon: '🏅', title: 'Trusted Donor', description: 'Verified + 3+ donations', gradient: 'from-amber-400 via-orange-300 to-amber-500' },
  { icon: '⭐', title: 'Platinum Donor', description: '10+ donations', gradient: 'from-sky-400 via-cyan-300 to-sky-500' },
  { icon: '🛡', title: 'Safe Partner', description: '100% verified hospital requests', gradient: 'from-emerald-400 via-teal-300 to-emerald-500' },
];

const loyaltySteps = [
  { title: 'First donation', value: 120, max: 500, color: 'from-rose-500 to-pink-500' },
  { title: 'Verified donor status', value: 340, max: 500, color: 'from-amber-400 to-orange-400' },
  { title: 'Platinum tier', value: 820, max: 1000, color: 'from-indigo-500 to-violet-500' },
];

const trustHistory = [
  { label: 'Verified IDs', value: 1240 },
  { label: 'Hospital feedback score', value: 94 },
  { label: 'Verified requests', value: 100 },
  { label: 'Trust retention', value: 88 },
];

const loyaltyEvents = [
  { label: 'Donation reward applied', value: '+120 points' },
  { label: 'Verified donor badge unlocked', value: 'Trusted Donor' },
  { label: 'Hospital feedback boost', value: '+4 trust' },
  { label: 'Platinum tier attained', value: '10 donations' },
];

const progressClass = (color: string) => `h-3 rounded-full bg-gradient-to-r ${color}`;

const LoyaltyTrustPage = () => {
  const totalTrust = useMemo(() => 92, []);
  const totalPoints = useMemo(() => 2380, []);
  const trustPercent = useMemo(() => 92, []);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard title="Loyalty & Trust Command Center" subtitle="Donor trust, badges and verification insights">
          <div className="space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-950/80 to-slate-900/70 p-6 shadow-glow-red">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Donor Trust Index</p>
                  <h2 className="mt-3 text-4xl font-semibold text-white">{totalTrust}%</h2>
                  <p className="mt-2 text-sm text-slate-400">Based on verified IDs, donations and hospital feedback.</p>
                </div>
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                  <div className="relative flex h-20 w-20 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-slate-900/80" />
                    <div className="absolute inset-0 rounded-full border border-white/10" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 via-cyan-300 to-slate-900 blur-xl opacity-50" />
                    <div className="relative z-10 text-center">
                      <p className="text-xl font-semibold text-white">{trustPercent}%</p>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">TRUST</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Loyalty Points</p>
                <p className="mt-4 text-4xl font-semibold text-white">{totalPoints}</p>
                <p className="mt-2 text-sm text-slate-400">Points collected from every verified donation.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Verified Donors</p>
                <p className="mt-4 text-4xl font-semibold text-white">1,842</p>
                <p className="mt-2 text-sm text-slate-400">Donors with verified identity and trust history.</p>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Trust Pulse" subtitle="Real-time badge & loyalty state">
          <div className="space-y-4">
            {badgeSets.map((badge) => (
              <div key={badge.title} className="rounded-[24px] border border-white/10 bg-gradient-to-r from-slate-950/80 to-slate-900/70 p-4 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{badge.title}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{badge.description}</p>
                  </div>
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br ${badge.gradient} text-white shadow-lg shadow-slate-950/30`}>
                    <span className="text-xl">{badge.icon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Trust Signals" subtitle="Verified ID and hospital feedback metrics">
          <div className="grid gap-4">
            {trustHistory.map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                  </div>
                  <Star className="h-5 w-5 text-amber-300" />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard title="Loyalty Progress Tracker" subtitle="Points to the next tier">
          <div className="space-y-4">
            {loyaltySteps.map((step) => (
              <div key={step.title} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>{step.title}</span>
                  <span>{step.value}/{step.max}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-900/80">
                  <div className={progressClass(step.color)} style={{ width: `${Math.round((step.value / step.max) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Top Loyalty Champions" subtitle="Donors driving community trust">
          <div className="space-y-4">
            {donorRewards.map((donor) => (
              <div key={donor.name} className="rounded-3xl border border-white/10 bg-white/5 p-4 hover:border-emerald-400/30 transition">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-400">{donor.name}</p>
                    <p className="mt-1 text-lg font-semibold text-white">{donor.badge}</p>
                  </div>
                  <div className="rounded-3xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{donor.trustScore}%</div>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-3 text-sm text-slate-300">
                  <div>Group: {donor.bloodGroup}</div>
                  <div>Donations: {donor.donations}</div>
                  <div>Points: {donor.points}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Loyalty Activity" subtitle="Recent trust-building events">
          <div className="space-y-3">
            {loyaltyEvents.map((event) => (
              <div key={event.label} className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-sm text-slate-300">
                <div className="flex items-center justify-between gap-4">
                  <p>{event.label}</p>
                  <span className="text-emerald-300">{event.value}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Fraud vs Trust Anomaly Chart" subtitle="Detect suspicious request spikes">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Anomaly Score</h3>
                <p className="text-sm text-slate-400">Requests spike vs trusted donor confirmations</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.32em] text-slate-300">
                <Sparkles className="h-4 w-4 text-amber-300" /> Live
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[70, 85, 58].map((value, index) => (
                <div key={index} className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Segment {index + 1}</p>
                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div className="text-3xl font-semibold text-white">{value}%</div>
                    <div className="h-2 w-24 rounded-full bg-slate-800">
                      <div className={`h-2 rounded-full bg-gradient-to-r ${value > 80 ? 'from-rose-500 to-orange-400' : value > 60 ? 'from-amber-400 to-yellow-400' : 'from-emerald-400 to-cyan-400'}`} style={{ width: `${value}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Trust Status Alerts" subtitle="Loyalty and fraud risk signals">
          <div className="space-y-4">
            {[
              { message: 'Duplicate donor profiles detected', level: 'high' },
              { message: 'Phone verification required for 12 donors', level: 'medium' },
              { message: 'Hospital request anomaly spike +28%', level: 'critical' },
            ].map((alert) => (
              <div key={alert.message} className={`rounded-3xl border border-white/10 p-5 ${alert.level === 'critical' ? 'bg-gradient-to-r from-rose-500 to-orange-500/15 ring-1 ring-rose-500/20 animate-pulse' : alert.level === 'high' ? 'bg-gradient-to-r from-orange-500 to-yellow-500/15 ring-1 ring-orange-500/20' : 'bg-gradient-to-r from-cyan-500 to-emerald-500/15 ring-1 ring-cyan-500/20'}`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-lg text-white">⚠️</div>
                  <div>
                    <p className="font-semibold text-white">{alert.message}</p>
                    <p className="text-sm text-slate-300">{alert.level === 'critical' ? 'Immediate review required' : alert.level === 'high' ? 'High risk trend detected' : 'Monitor the trust score'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default LoyaltyTrustPage;
