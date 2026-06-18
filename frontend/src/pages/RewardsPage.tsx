import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, Crown, Gift, Heart, Medal, Star, Sparkles, Trophy, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const hallOfFame = [
  { rank: '🥇', name: 'Murugan Selvam', group: 'A+', donations: 24, city: 'Chennai', highlight: true },
  { rank: '🥈', name: 'Kavitha Rajan', group: 'B+', donations: 18, city: 'Coimbatore' },
  { rank: '🥉', name: 'Senthil Kumar', group: 'O+', donations: 15, city: 'Madurai' },
];

const badges = [
  { icon: '🩸', title: 'First Drop', description: 'First time donor' },
  { icon: '⭐', title: 'Star Donor', description: '5+ donations' },
  { icon: '🔥', title: 'On Fire', description: '3 donations in a month' },
  { icon: '💎', title: 'Diamond Hero', description: '20+ donations' },
  { icon: '🛡️', title: 'Life Guardian', description: 'Rare blood type donor' },
  { icon: '🚀', title: 'Super Donor', description: '10+ donations' },
  { icon: '❤️', title: 'Heart Warrior', description: 'Emergency donor' },
  { icon: '🌟', title: 'Legend', description: '50+ donations' },
];

const rewards = [
  { icon: '🎽', title: 'BloodConnect T-Shirt', cost: 500 },
  { icon: '📜', title: 'Certificate of Honor', cost: 200 },
  { icon: '🍕', title: 'Free Meal Voucher', cost: 300 },
  { icon: '🏅', title: 'Gold Medal Badge', cost: 1000 },
];

const celebrations = [
  '🎉 Murugan Selvam just earned Diamond Hero badge!',
  '🥇 Kavitha Rajan reached 18 donations!',
  '🚨 Senthil Kumar saved a life in emergency!',
  '⭐ Priya Lakshmi earned Star Donor badge!',
];

const events = [
  { title: 'Blood Donation Day Special', date: 'July 10, 2026' },
  { title: 'Volunteer Appreciation Night', date: 'July 25, 2026' },
  { title: 'Annual Heroes Awards', date: 'August 15, 2026' },
];

const useCountUp = (target: number, duration = 1400) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = Math.round(duration / 30);
    const easeOutQuad = (t: number) => t * (2 - t);
    const tick = () => {
      frame += 1;
      const progress = easeOutQuad(frame / totalFrames);
      const value = Math.round(target * progress);
      setCount(value);
      if (frame < totalFrames) requestAnimationFrame(tick);
    };
    tick();
  }, [target, duration]);

  return count;
};

const RewardsPage = () => {
  const donationsThisMonth = useCountUp(1247);
  const activeVolunteers = useCountUp(342);
  const livesSaved = useCountUp(856);
  const campaignRate = useCountUp(94);

  const navigate = useNavigate();

  const [points, setPoints] = useState<number>(() => {
    try { const raw = localStorage.getItem('donorPoints'); return raw ? Number(raw) : 1420; } catch { return 1420; }
  });
  const [modalReward, setModalReward] = useState<any | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type?: 'success'|'error'} | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => { if (!toast) return; const t = window.setTimeout(() => setToast(null), 3200); return () => window.clearTimeout(t); }, [toast]);

  const openRedeem = (reward: any) => setModalReward(reward);

  const confirmRedeem = async () => {
    if (!modalReward) return;
    const cost = modalReward.cost || modalReward.points || 0;
    if (points < cost) { setToast({ msg: `❌ Not enough points. Need ${cost - points} more.`, type: 'error' }); setModalReward(null); return; }
    setRedeeming(true);

    let donorId: string | null = null;
    try { const raw = localStorage.getItem('bloodconnect_user'); const parsed = raw ? JSON.parse(raw) : {}; donorId = parsed?.id || parsed?._id || null; } catch {}
    const API_BASE = (import.meta as any).env?.VITE_API_BASE || (import.meta as any).env?.VITE_API_URL || 'http://localhost:5012';

    try {
      const token = localStorage.getItem('bloodconnect_token');
      const headers: Record<string,string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const resp = await fetch(`${API_BASE}/api/rewards/redeem`, { method: 'POST', headers, body: JSON.stringify({ donorId, rewardId: modalReward.id || modalReward.title }) });
      if (!resp.ok) throw new Error('Redeem API failed');
      const json = await resp.json();
      const serverPoints = json?.points;
      if (typeof serverPoints === 'number') { setPoints(serverPoints); localStorage.setItem('donorPoints', String(serverPoints)); } else { setPoints(p => { const np = p - cost; localStorage.setItem('donorPoints', String(np)); return np; }); }

      // persist history locally as fallback
      try { const raw = localStorage.getItem('redeemedRewards'); const arr = raw ? JSON.parse(raw) : []; arr.unshift({ id: modalReward.id || modalReward.title, name: modalReward.title || modalReward.name, points: cost, redeemedAt: new Date().toISOString() }); localStorage.setItem('redeemedRewards', JSON.stringify(arr)); } catch {}

      setToast({ msg: 'Reward redeemed successfully 🎉', type: 'success' });
      setShowConfetti(true);
      setModalReward(null);
      setRedeeming(false);
      setTimeout(() => setShowConfetti(false), 1600);
      setTimeout(() => navigate('/dashboard/rewards-history'), 900);
    } catch (err) {
      // fallback local
      setPoints(p => { const np = p - cost; try { localStorage.setItem('donorPoints', String(np)); const raw = localStorage.getItem('redeemedRewards'); const arr = raw ? JSON.parse(raw) : []; arr.unshift({ id: modalReward.id || modalReward.title, name: modalReward.title || modalReward.name, points: cost, redeemedAt: new Date().toISOString() }); localStorage.setItem('redeemedRewards', JSON.stringify(arr)); } catch {} return np; });
      setToast({ msg: 'Reward redeemed locally 🎉', type: 'success' });
      setShowConfetti(true);
      setModalReward(null);
      setRedeeming(false);
      setTimeout(() => setShowConfetti(false), 1600);
      setTimeout(() => navigate('/dashboard/rewards-history'), 900);
    }
  };

  const Toast: React.FC<{ message: string; type?: 'success'|'error' }> = ({ message, type = 'success' }) => (
    <div className={`fixed right-4 top-6 z-60 rounded-lg px-4 py-3 text-sm font-medium ${type === 'success' ? 'bg-emerald-500/90 text-black' : 'bg-rose-500/90 text-white'}`}>{message}</div>
  );

  const Confetti = () => (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden"><div className="confetti" /><style>{`.confetti{position:absolute;inset:0}.confetti::before{content:'';position:absolute;left:10%;top:0;width:8px;height:8px;background:#ff6b6b;box-shadow:0 100px #ffd166,50px 200px #6b5bff,120px 350px #6ee7b7;animation:fall 1.6s linear infinite}.confetti::after{content:'';position:absolute;left:30%;top:0;width:8px;height:8px;background:#60a5fa;box-shadow:30px 200px #34d399,120px 350px #a78bfa;animation:fall2 1.8s linear infinite}@keyframes fall{0%{transform:translateY(-10vh)}100%{transform:translateY(110vh)}}@keyframes fall2{0%{transform:translateY(-5vh)}100%{transform:translateY(110vh)}}`}</style></div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-10"
    >
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-fuchsia-500/10">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          {[...Array(12)].map((_, index) => (
            <motion.span
              key={`confetti-${index}`}
              initial={{ opacity: 0, y: -40, rotate: 0 }}
              animate={{ opacity: [0.2, 0.8, 0.2], y: [0, 120, 0], rotate: [0, 360] }}
              transition={{ duration: 5 + index * 0.2, repeat: Infinity, ease: 'linear', delay: index * 0.08 }}
              className="absolute h-2 w-2 rounded-full bg-pink-400/90"
              style={{
                left: `${10 + index * 7}%`,
                top: `${index * 6}%`,
                backgroundColor: ['#f472b6', '#fb7185', '#f59e0b', '#38bdf8', '#a78bfa'][index % 5],
              }}
            />
          ))}
        </div>

        <div className="relative z-10 grid gap-6">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-200 ring-1 ring-rose-400/20">
              🎉 Celebration Spotlight
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Celebrate Our Blood Heroes! 🩸❤️
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-300">
              Every drop counts. Every hero matters.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-rose-500/10">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Hero Spotlight</p>
              <p className="mt-3 text-2xl font-semibold text-white">Murugan Selvam</p>
              <p className="mt-2 text-sm text-slate-300">Champion of Chennai with 24 donations and rising.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-center shadow-lg shadow-cyan-500/10">
              <Sparkles className="mx-auto h-8 w-8 text-cyan-300" />
              <p className="mt-4 text-sm uppercase tracking-[0.3em] text-slate-400">Impact Pulse</p>
              <p className="mt-3 text-3xl font-semibold text-white">24%</p>
              <p className="mt-2 text-sm text-slate-400">More heroes this month</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-center shadow-lg shadow-amber-500/10">
              <Trophy className="mx-auto h-8 w-8 text-amber-300" />
              <p className="mt-4 text-sm uppercase tracking-[0.3em] text-slate-400">Rewards Streak</p>
              <p className="mt-3 text-3xl font-semibold text-white">4</p>
              <p className="mt-2 text-sm text-slate-400">New badges this week</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-300/80">Hall of Fame</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Top Donor Podium</h2>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 ring-1 ring-rose-400/20">
            <Award className="h-4 w-4" /> Verified Heroes
          </span>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {hallOfFame.map((hero, index) => (
            <motion.div
              key={hero.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-[2rem] border border-white/10 p-6 shadow-lg ${
                hero.highlight ? 'bg-gradient-to-br from-amber-500/15 via-amber-500/10 to-slate-950 text-white shadow-amber-500/20' : 'bg-slate-950/80 text-slate-200'
              }`}
            >
              {hero.highlight && (
                <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm text-amber-200 shadow-sm shadow-amber-500/10 backdrop-blur">
                  <Crown className="h-4 w-4" /> First Place
                </span>
              )}
              <div className="flex items-center gap-3">
                <div className="rounded-3xl bg-white/10 px-4 py-3 text-2xl">{hero.rank}</div>
                <div>
                  <p className="text-sm uppercase tracking-[0.34em] text-slate-400">{hero.city}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{hero.name}</p>
                </div>
              </div>
              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <p className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full bg-rose-400" /> Blood Group: {hero.group}</p>
                <p className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full bg-cyan-400" /> Donations: {hero.donations}</p>
                <p className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full bg-violet-400" /> City: {hero.city}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Donor Achievement Badges</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Badge Gallery</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {badges.map((badge) => (
            <motion.div
              key={badge.title}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm transition"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-2xl">{badge.icon}</div>
              <h3 className="mt-4 text-xl font-semibold text-white">{badge.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: 'Total Donations This Month', value: donationsThisMonth, icon: '🩸', tone: 'from-rose-500 to-rose-400' },
            { label: 'Active Volunteers', value: activeVolunteers, icon: '👥', tone: 'from-cyan-500 to-sky-500' },
            { label: 'Lives Saved', value: livesSaved, icon: '🏥', tone: 'from-emerald-500 to-teal-500' },
            { label: 'Campaign Success Rate', value: campaignRate, icon: '🎯', tone: 'from-violet-500 to-fuchsia-500', suffix: '%' },
          ].map((item) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-lg shadow-slate-900/40">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
                  <p className="mt-4 text-3xl font-semibold text-white">{item.value}{item.suffix || ''}</p>
                </div>
                <div className={`rounded-3xl bg-gradient-to-br ${item.tone} p-4 text-white shadow-lg shadow-slate-950/40`}>
                  <span className="text-2xl">{item.icon}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Redeem Your Points</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Rewards Redemption</h2>
          </div>
          <div className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300">Points earned by donors are ready to redeem.</div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {rewards.map((reward) => (
            <motion.div key={reward.title} whileHover={{ scale: 1.02 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-rose-500/10 text-3xl">{reward.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{reward.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{reward.cost} points</p>
                </div>
              </div>
              <button className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-rose-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:shadow-rose-500/30">
                Redeem Now
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid gap-6">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-lg shadow-slate-900/40">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Recent Celebrations</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Celebration Feed</h2>
            </div>
            <div className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300">Live recognition ticker</div>
          </div>
          <div className="mt-6 overflow-hidden rounded-3xl bg-slate-950/70 p-4 ring-1 ring-white/5">
            <motion.div
              className="flex gap-6 whitespace-nowrap text-sm text-slate-200"
              animate={{ x: ['100%', '-100%'] }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            >
              {celebrations.map((item) => (
                <span key={item} className="inline-flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 shadow-sm shadow-black/20">
                  {item}
                </span>
              ))}
              {celebrations.map((item) => (
                <span key={`repeat-${item}`} className="inline-flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 shadow-sm shadow-black/20">
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {events.map((event) => (
            <motion.div
              key={event.title}
              whileHover={{ y: -4 }}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-sm"
            >
              <div className="flex items-center gap-3 text-rose-300">
                <Calendar className="h-5 w-5" />
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Upcoming</p>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">{event.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{event.date}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default RewardsPage;
