import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import SectionCard from '../components/SectionCard';
import { RewardIntelligenceModule } from '../components/RewardIntelligenceModule';

interface DonorProfile {
  id: string;
  name: string;
  tier: string;
  donations: number;
  points: number;
  referrals: number;
  hero: boolean;
  communityBuilder: boolean;
  donationHistory: Array<{ date: string; description: string; points: number }>;
  rewardsEarned: string[];
}

const donors: DonorProfile[] = [
  {
    id: 'durga',
    name: 'Durga',
    tier: 'Platinum',
    donations: 22,
    points: 1240,
    referrals: 18,
    hero: true,
    communityBuilder: true,
    donationHistory: [
      { date: '2026-06-07', description: 'Premium recognition kit', points: 220 },
      { date: '2026-05-28', description: 'Coffee Voucher redemption', points: 60 },
      { date: '2026-05-12', description: 'T-Shirt reward', points: 120 },
    ],
    rewardsEarned: ['VIP donor badge', 'Hospital access pass', 'Community champion pin'],
  },
  {
    id: 'gopi',
    name: 'Gopi',
    tier: 'Gold',
    donations: 20,
    points: 1120,
    referrals: 12,
    hero: false,
    communityBuilder: true,
    donationHistory: [
      { date: '2026-06-01', description: 'Campaign reward voucher', points: 100 },
      { date: '2026-05-18', description: 'Priority recognition badge', points: 80 },
    ],
    rewardsEarned: ['Gold supporter pin', 'Referral achiever ribbon'],
  },
  {
    id: 'ganesh',
    name: 'Ganesh',
    tier: 'Gold',
    donations: 18,
    points: 980,
    referrals: 11,
    hero: false,
    communityBuilder: true,
    donationHistory: [
      { date: '2026-05-24', description: 'Community builder kit', points: 85 },
      { date: '2026-05-10', description: 'Bronze appreciation badge', points: 55 },
    ],
    rewardsEarned: ['Referral ambassador certificate'],
  },
  {
    id: 'dinesh',
    name: 'Dinesh',
    tier: 'Silver',
    donations: 15,
    points: 860,
    referrals: 7,
    hero: false,
    communityBuilder: false,
    donationHistory: [
      { date: '2026-05-30', description: 'Recognition pin', points: 70 },
      { date: '2026-05-14', description: 'Special thanks badge', points: 45 },
    ],
    rewardsEarned: ['Silver donor medal'],
  },
  {
    id: 'praveen',
    name: 'Praveen',
    tier: 'Silver',
    donations: 12,
    points: 720,
    referrals: 10,
    hero: false,
    communityBuilder: true,
    donationHistory: [
      { date: '2026-05-26', description: 'Wellness reward pack', points: 60 },
    ],
    rewardsEarned: ['Referral champion badge'],
  },
];

const redemptions = [
  { item: 'T-Shirt', donor: 'Durga', points: 120, accent: 'from-red-500 to-pink-500' },
  { item: 'Coffee Voucher', donor: 'Gopi', points: 60, accent: 'from-amber-500 to-yellow-400' },
  { item: 'Hospital VIP Pass', donor: 'Durga', points: 220, accent: 'from-cyan-500 to-blue-500' },
];

const retentionSignals = [
  {
    id: 1,
    donor: 'Meena',
    risk: 82,
    status: 'At-Risk',
    nextAction: 'Send donation reminder and reward offer',
    lastDonation: '132 days ago',
  },
  {
    id: 2,
    donor: 'Suresh',
    risk: 58,
    status: 'At-Risk',
    nextAction: 'Offer loyalty points and thank-you message',
    lastDonation: '95 days ago',
  },
  {
    id: 3,
    donor: 'Neha',
    risk: 24,
    status: 'Safe',
    nextAction: 'Encourage peer referrals with recognition badge',
    lastDonation: '12 days ago',
  },
];

const RecognitionRewardsPage = () => {
  const [selectedDonor, setSelectedDonor] = useState<DonorProfile | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [confettiActive, setConfettiActive] = useState(false);

  const lifetimeHeroes = donors.filter((donor) => donor.hero);
  const communityBuilders = donors.filter((donor) => donor.communityBuilder);
  const topReferences = donors.filter((donor) => ['Durga', 'Gopi', 'Ganesh', 'Dinesh', 'Praveen'].includes(donor.name));

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timer = window.setTimeout(() => setToastMessage(''), 3000);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    if (!confettiActive) return undefined;
    const timer = window.setTimeout(() => setConfettiActive(false), 1400);
    return () => window.clearTimeout(timer);
  }, [confettiActive]);

  const openProfile = (donor: DonorProfile) => {
    setSelectedDonor(donor);
    setProfileOpen(true);
    setToastMessage('Recognition updated successfully 🎉');
    if (donor.hero) {
      setConfettiActive(true);
    }
  };

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Recognition + Rewards</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Badges & Achievements</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">Celebrate the donors who lead through loyalty, referrals, and community recognition.</p>
          </div>
          <div className="rounded-3xl bg-gradient-to-r from-red-500 to-blue-600 px-5 py-3 text-white shadow-[0_20px_70px_-35px_rgba(59,130,246,0.6)]">
            <div className="text-sm uppercase tracking-[0.24em] text-slate-100/80">Recognition score</div>
            <div className="mt-1 text-2xl font-semibold">Mission-critical</div>
          </div>
        </div>
      </div>

      {/* Reward Intelligence Module */}
      <RewardIntelligenceModule currentPoints={1240} />

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard title="Lifetime Hero 🏆" subtitle="Top 1% donors" className="min-h-[300px]">
          <div className="space-y-4">
            {lifetimeHeroes.map((donor) => (
              <motion.button
                key={donor.id}
                type="button"
                onClick={() => openProfile(donor)}
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500/10 via-white/10 to-blue-500/10 p-[1px] shadow-lg transition hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]"
              >
                <div className="rounded-3xl bg-gray-950/85 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-r from-red-500 to-blue-600 text-2xl text-white shadow-glow-red">
                      🏆
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-lg font-semibold text-white">{donor.name}</div>
                      <div className="mt-1 text-sm text-slate-400">{donor.points} points • {donor.donations} donations</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">Hero</div>
                    <div className="text-sm text-slate-300">Top 1% contributor</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Community Builder 👥" subtitle="Referrals and network growth" className="min-h-[300px]">
          <div className="space-y-4">
            <div className="rounded-3xl bg-gradient-to-br from-red-500/10 via-white/10 to-blue-500/10 p-4 text-slate-200 shadow-lg">
              <div className="text-sm font-semibold text-white">You built our donor family!</div>
              <p className="mt-2 text-sm text-slate-300">These advocates brought new members into the community while amplifying recognition across the network.</p>
            </div>
            {communityBuilders.map((donor) => (
              <div key={donor.id} className="dashboard-card overflow-hidden rounded-xl border border-white/20 bg-gray-900/80 p-4 shadow-lg transition hover:shadow-[0_0_24px_rgba(59,130,246,0.24)]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-lg text-white">👥</span>
                    <div>
                      <div className="text-base font-semibold text-white">{donor.name}</div>
                      <div className="text-sm text-slate-400">Referred {donor.referrals} people</div>
                    </div>
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-slate-200">{donor.referrals}/20</div>
                </div>
                <div className="mt-4 text-sm text-slate-300">Referral progress</div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" style={{ width: `${Math.min((donor.referrals / 20) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard title="Future Retention Forecast 🔮" subtitle="AI donor risk prediction" className="min-h-[320px]">
          <div className="space-y-4">
            {retentionSignals.map((signal) => (
              <div key={signal.id} className="rounded-3xl border border-white/10 bg-gray-900/80 p-4 shadow-lg transition hover:shadow-[0_0_30px_rgba(59,130,246,0.35)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-white">{signal.donor}</div>
                    <div className="mt-1 text-sm text-slate-400">Last donation {signal.lastDonation}</div>
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl ${signal.status === 'At-Risk' ? 'bg-red-500/15 text-red-300' : 'bg-emerald-500/15 text-emerald-300'}`}>
                    {signal.status === 'At-Risk' ? '⚠️' : '✅'}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className={`rounded-full px-3 py-1 text-sm font-semibold ${signal.status === 'At-Risk' ? 'bg-red-500/15 text-red-200' : 'bg-emerald-500/15 text-emerald-200'}`}>
                    {signal.status}
                  </div>
                  <div className="text-sm font-semibold text-white">{signal.risk}% risk</div>
                </div>
                <p className="mt-4 text-sm text-slate-300">Suggested next action: {signal.nextAction}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Rewards Redemption 🎁" subtitle="Recent donor reward claims" className="min-h-[320px]">
          <div className="space-y-3">
            {redemptions.map((redemption) => (
              <div key={redemption.item} className="dashboard-card flex items-center justify-between gap-4 overflow-hidden rounded-xl border border-white/20 bg-gray-900/80 p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎁</span>
                  <div>
                    <div className="font-semibold text-white">{redemption.item}</div>
                    <div className="text-sm italic text-slate-500">{redemption.donor}</div>
                  </div>
                </div>
                <span className={`badge-gradient rounded-full px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r ${redemption.accent}`}>
                  {redemption.points} pts
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Top Donor References ⭐" subtitle="Our heroes leading the way!" className="min-h-[320px]">
          <div className="space-y-4">
            <div className="rounded-3xl bg-white/5 p-4 text-sm text-slate-300">
              These donors are setting the pace for the CRM program with donations, referrals, and recognition milestones.
            </div>
            <div className="grid gap-3">
              {topReferences.map((donor) => (
                <button
                  key={donor.id}
                  type="button"
                  onClick={() => openProfile(donor)}
                  className="dashboard-card flex w-full items-center justify-between gap-3 overflow-hidden rounded-xl border border-white/20 bg-gray-900/80 p-4 shadow-lg transition hover:scale-[1.01]"
                >
                  <div>
                    <div className="text-base font-semibold text-white">{donor.name}</div>
                    <div className="text-sm text-slate-400">{donor.tier} tier</div>
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-slate-200">View</div>
                </button>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      <AnimatePresence>
        {profileOpen && selectedDonor && (
          <motion.div
            className="reward-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setProfileOpen(false)}
          >
            <motion.div
              className="reward-modal-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.32em] text-slate-400">Donor profile</div>
                  <div className="mt-2 flex items-center gap-3 text-3xl font-semibold text-white">
                    <span>👤</span>
                    <span>{selectedDonor.name}</span>
                  </div>
                  <div className="mt-1 text-sm text-slate-400">{selectedDonor.tier} tier • {selectedDonor.points} pts</div>
                </div>
                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  Close
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/5 p-4 text-sm text-slate-300">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Donation history</div>
                  <ul className="mt-3 space-y-3">
                    {selectedDonor.donationHistory.map((record) => (
                      <li key={record.date} className="rounded-2xl bg-slate-950/80 p-3">
                        <div className="font-semibold text-white">{record.description}</div>
                        <div className="mt-1 flex items-center justify-between text-sm text-slate-400">
                          <span>{record.date}</span>
                          <span>{record.points} pts</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl bg-white/5 p-4 text-sm text-slate-300">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Rewards earned</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedDonor.rewardsEarned.map((reward) => (
                      <span key={reward} className="rounded-full bg-gradient-to-r from-red-500 to-blue-600 px-3 py-1 text-sm font-semibold text-white shadow-lg">
                        {reward}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-300">Update donor recognition status and award an appreciation badge.</p>
                <button
                  type="button"
                  onClick={() => {
                    setToastMessage('Recognition updated successfully 🎉');
                    setConfettiActive(true);
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_-25px_rgba(236,72,153,0.8)] transition hover:scale-105"
                >
                  Award badge
                </button>
              </div>

              {confettiActive && (
                <div className="confetti-wrapper">
                  {Array.from({ length: 20 }).map((_, index) => (
                    <span
                      key={index}
                      className="confetti-piece"
                      style={{
                        left: `${4 + index * 4.5}%`,
                        animationDelay: `${index * 0.05}s`,
                        backgroundColor: ['#ef4444', '#3b82f6', '#facc15', '#ffffff'][index % 4],
                        transform: `rotate(${index * 18}deg)`,
                        '--drift': `${(index % 6) * 10 - 30}px`,
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

export default RecognitionRewardsPage;
