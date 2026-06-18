import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const badges = [
  { id: 'community', title: 'Community Builder', desc: 'Organized 3 drives' },
  { id: 'lifesaver', title: 'Lifesaver', desc: 'Donated 10+ times' },
  { id: 'mentor', title: 'Mentor', desc: 'Trained 5 volunteers' },
];

const rewards = [
  { id: 'tshirt', name: 'T-Shirt', emoji: '🎽', points: 500, desc: 'Comfort fit BloodConnect tee.' },
  { id: 'cert', name: 'Certificate', emoji: '📜', points: 300, desc: 'Official appreciation certificate.' },
  { id: 'meal', name: 'Meal Voucher', emoji: '🍕', points: 150, desc: 'Dinner voucher at partner cafes.' },
  { id: 'medal', name: 'Gold Medal', emoji: '🏅', points: 1000, desc: 'Prestige medal for milestones.' },
];

const Confetti = () => (
  <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
    <div className="confetti" />
    <style>{`
      .confetti {position:absolute;inset:0;}
      .confetti::before{content:'';position:absolute;left:10%;top:0;width:8px;height:8px;background:#ff6b6b;box-shadow:0 100px #ffd166,50px 200px #6b5bff,120px 350px #6ee7b7;animation:fall 1.6s linear infinite}
      .confetti::after{content:'';position:absolute;left:30%;top:0;width:8px;height:8px;background:#60a5fa;box-shadow:30px 200px #34d399,120px 350px #a78bfa;animation:fall2 1.8s linear infinite}
      @keyframes fall{0%{transform:translateY(-10vh)}100%{transform:translateY(110vh)}}
      @keyframes fall2{0%{transform:translateY(-5vh)}100%{transform:translateY(110vh)}}
    `}</style>
  </div>
);

const Toast: React.FC<{ message: string; type?: 'success' | 'error' }> = ({ message, type = 'success' }) => (
  <div className={`fixed right-4 top-6 z-60 rounded-lg px-4 py-3 text-sm font-medium ${type === 'success' ? 'bg-emerald-500/90 text-black' : 'bg-rose-500/90 text-white'}`}>
    {message}
  </div>
);

const VolunteerRewards: React.FC = () => {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('unlockedBadges');
      return raw ? JSON.parse(raw) : ['lifesaver'];
    } catch {
      return ['lifesaver'];
    }
  });

  const [points, setPoints] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('donorPoints');
      return raw ? Number(raw) : 1420;
    } catch {
      return 1420;
    }
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [modalReward, setModalReward] = useState<any | null>(null);
  const [toast, setToast] = useState<{ msg: string; type?: 'success' | 'error' } | null>(null);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(t);
  }, [toast]);

  const openRedeem = (r: any) => {
    setModalReward(r);
  };

  const confirmRedeem = () => {
    (async () => {
      if (!modalReward) return;
      const cost = modalReward.points;
      if (points < cost) {
        setToast({ msg: `❌ Not enough points. Need ${cost - points} more.`, type: 'error' });
        setModalReward(null);
        return;
      }
      setRedeeming(true);

      // determine donor id from localStorage user
      let donorId: string | null = null;
      try {
        const raw = localStorage.getItem('bloodconnect_user');
        const parsed = raw ? JSON.parse(raw) : {};
        donorId = parsed?.id || parsed?._id || null;
      } catch {
        donorId = null;
      }
      const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:5012';

      try {
        // 1) POST /api/rewards/redeem
        const token = localStorage.getItem('bloodconnect_token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const postResp = await fetch(`${API_BASE}/api/rewards/redeem`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ donorId, rewardId: modalReward.id }),
        });

        if (!postResp.ok) throw new Error('Redeem API failed');

        const postResult = await postResp.json();

        // If server returns updated points/badges, use them; otherwise PATCH as fallback
        const serverPoints = postResult?.points;
        const serverBadges = postResult?.badges;

        if (typeof serverPoints === 'number') {
          setPoints(serverPoints);
          localStorage.setItem('donorPoints', String(serverPoints));
        } else {
          // PATCH /api/donors/:id/points
          if (donorId) {
            await fetch(`${API_BASE}/api/donors/${donorId}/points`, {
              method: 'PATCH',
              headers,
              body: JSON.stringify({ points: points - cost }),
            });
            setPoints((p) => p - cost);
            localStorage.setItem('donorPoints', String(points - cost));
          } else {
            setPoints((p) => p - cost);
            localStorage.setItem('donorPoints', String(points - cost));
          }
        }

        if (Array.isArray(serverBadges)) {
          setUnlocked(serverBadges);
          localStorage.setItem('unlockedBadges', JSON.stringify(serverBadges));
        } else {
          const newUnlocked = unlocked.includes(modalReward.id) ? unlocked : [...unlocked, modalReward.id];
          setUnlocked(newUnlocked);
          localStorage.setItem('unlockedBadges', JSON.stringify(newUnlocked));
          // PATCH donor badges too -> /api/donors/:id/badges
          if (donorId) {
            await fetch(`${API_BASE}/api/donors/${donorId}/badges`, {
              method: 'PATCH',
              headers,
              body: JSON.stringify({ badgeId: modalReward.id }),
            });
          }
        }

        // record redemption in local history if server did not persist
        try {
          const raw = localStorage.getItem('redeemedRewards');
          const arr = raw ? JSON.parse(raw) : [];
          arr.unshift({ id: modalReward.id, name: modalReward.name, points: modalReward.points, redeemedAt: new Date().toISOString() });
          localStorage.setItem('redeemedRewards', JSON.stringify(arr));
        } catch {}

        setToast({ msg: `🎉 Reward redeemed: ${modalReward.name}`, type: 'success' });
        setShowConfetti(true);
        setModalReward(null);
        setRedeeming(false);
        setTimeout(() => setShowConfetti(false), 1600);
        setTimeout(() => navigate('/app/volunteers/rewards/history'), 900);
      } catch (err) {
        // Fallback: apply locally and notify error
        const newPoints = points - modalReward.points;
        setPoints(newPoints);
        const newUnlocked = unlocked.includes(modalReward.id) ? unlocked : [...unlocked, modalReward.id];
        setUnlocked(newUnlocked);
        try {
          localStorage.setItem('donorPoints', String(newPoints));
          localStorage.setItem('unlockedBadges', JSON.stringify(newUnlocked));
        } catch {}
        setToast({ msg: `🎉 Reward redeemed locally (offline): ${modalReward.name}`, type: 'success' });
        setShowConfetti(true);
        setModalReward(null);
        setRedeeming(false);
        setTimeout(() => setShowConfetti(false), 1600);
        setTimeout(() => navigate('/app/volunteers/rewards/history'), 900);
      }
    })();
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white">Reward Program</h2>
        <p className="text-slate-300">Your points motivate lives — keep going!</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2">
        {rewards.map((r) => (
          <motion.div
            key={r.id}
            whileHover={{ scale: 1.02 }}
            className={`group relative rounded-2xl border border-white/6 bg-gradient-to-br from-white/3 to-white/5 p-4 backdrop-blur-md transition ${unlocked.includes(r.id) ? 'ring-2 ring-amber-400' : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className="rounded-xl p-3 text-2xl shadow-md bg-gradient-to-br from-rose-400 to-violet-600 text-white transform-gpu transition-all group-hover:scale-105 group-hover:shadow-[0_12px_40px_rgba(139,92,246,0.24)]">
                <span className="group-hover:animate-pulse" role="img" aria-label={r.name}>{r.emoji}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-white font-semibold">{r.name}</div>
                  <div className="ml-auto text-sm text-slate-300">{r.points} pts</div>
                </div>
                <div className="mt-2 text-xs text-slate-400">{r.desc}</div>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => openRedeem(r)}
                    className="rounded-full bg-gradient-to-r from-rose-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-[0_8px_30px_rgba(139,92,246,0.24)] transition"
                  >
                    Redeem Now
                  </button>
                  <div className="text-xs text-slate-400">{unlocked.includes(r.id) ? 'Unlocked' : 'Locked'}</div>
                </div>
              </div>
            </div>
            {unlocked.includes(r.id) && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }} className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-amber-400/90 px-2 py-1 text-xs font-semibold text-black">
                <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>
                Unlocked
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-white/6 bg-slate-900/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-300">Your Points</div>
            <div className="text-2xl font-bold text-white">{points} pts</div>
          </div>
          <div className="text-sm text-slate-300">AI Suggestion: Next reward available at <span className="font-semibold text-white">{Math.max(0, Math.min(...rewards.map(r => r.points)) - points)}</span> more points</div>
        </div>
      </div>

      <AnimatePresence>
        {modalReward && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} className="w-full max-w-2xl rounded-3xl bg-slate-900/95 p-6 border border-white/6">
              <div className="flex items-start gap-4">
                <div className="text-5xl">{modalReward.emoji}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">{modalReward.name}</h3>
                  <p className="text-sm text-slate-300 mt-2">{modalReward.desc}</p>

                  <div className="mt-4">
                    <div className="text-xs text-slate-400">Confirm redemption</div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="w-full">
                        <div className="h-3 w-full rounded-full bg-white/5">
                          <motion.div className="h-3 rounded-full bg-gradient-to-r from-rose-500 to-violet-500" style={{ width: `${Math.max(0, (points / (points + modalReward.points)) * 100)}%` }} layout />
                        </div>
                        <div className="mt-2 text-xs text-slate-300">Before: {points} pts</div>
                      </div>
                      <div className="w-48 text-right text-xs text-slate-300">After: {Math.max(0, points - modalReward.points)} pts</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setModalReward(null)} className="rounded-2xl bg-white/5 px-4 py-2 text-sm text-white">Cancel</button>
                <button onClick={confirmRedeem} disabled={redeeming} className="rounded-2xl bg-gradient-to-r from-rose-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">{redeeming ? 'Processing...' : 'Confirm'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{showConfetti && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Confetti /></motion.div>}</AnimatePresence>

      {toast && <Toast message={toast.msg} type={toast.type} />}
    </div>
  );
};

export default VolunteerRewards;
