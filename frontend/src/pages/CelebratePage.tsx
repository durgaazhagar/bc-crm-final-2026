import { Link, useSearchParams } from 'react-router-dom';

const badgeConfig: Record<string, { emoji: string; label: string; subtitle: string; color: string }> = {
  Gold: {
    emoji: '🥇',
    label: 'Gold Donor',
    subtitle: 'Outstanding blood service excellence.',
    color: 'from-amber-500 to-orange-500',
  },
  Silver: {
    emoji: '🥈',
    label: 'Silver Donor',
    subtitle: 'Strong commitment to life-saving care.',
    color: 'from-slate-400 to-blue-400',
  },
  Platinum: {
    emoji: '🏆',
    label: 'Platinum Donor',
    subtitle: 'Elite life-saver status achieved.',
    color: 'from-violet-500 to-pink-500',
  },
  Default: {
    emoji: '🎖️',
    label: 'Donor Hero',
    subtitle: 'Your generosity made a difference.',
    color: 'from-cyan-500 to-blue-500',
  },
};

const CelebratePage = () => {
  const [searchParams] = useSearchParams();
  const donor = searchParams.get('donor') || 'Donor';
  const badge = searchParams.get('badge') || 'Gold';
  const badgeData = badgeConfig[badge] || badgeConfig.Default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f14] via-[#0d1117] to-[#161b22] text-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/80 p-8 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute left-1/4 top-10 h-28 w-28 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute right-1/3 top-16 h-24 w-24 rounded-full bg-rose-500/20 blur-3xl" />
            <div className="absolute left-10 bottom-16 h-20 w-20 rounded-full bg-cyan-400/20 blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Celebrate Achievement</p>
                <h1 className="mt-3 text-4xl font-bold text-white">Congratulations, {donor}!</h1>
              </div>
              <Link
                to="/app/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
              >
                Back to Dashboard
              </Link>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-center">
              <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 to-slate-900/70 p-8 shadow-[0_30px_80px_-35px_rgba(59,130,246,0.25)]">
                <div className={`mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br ${badgeData.color} text-6xl shadow-[0_0_40px_rgba(255,255,255,0.16)]`}> 
                  {badgeData.emoji}
                </div>
                <div className="mt-6 text-center">
                  <p className="text-xl font-semibold text-white">{badgeData.label}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{badgeData.subtitle}</p>
                </div>
              </div>

              <div className="rounded-[32px] border border-white/10 bg-slate-950/90 p-8 shadow-[0_30px_80px_-35px_rgba(0,0,0,0.6)]">
                <div className="mb-4 rounded-3xl bg-gradient-to-r from-red-600/10 via-white/10 to-blue-600/10 p-4">
                  <p className="text-sm uppercase tracking-[0.32em] text-amber-200">Lives saved</p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">Congratulations! Your donation saved lives.</h2>
                </div>
                <p className="text-slate-300 leading-7">
                  Your achievement is part of a powerful community of donors who keep BloodConnect moving. Every donation helps hospitals meet demand faster and gives patients a second chance.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
                    <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Impact</p>
                    <p className="mt-3 text-2xl font-semibold text-white">Saved 3 lives</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
                    <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Momentum</p>
                    <p className="mt-3 text-2xl font-semibold text-white">Next donor alert ready</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(circle_at_bottom,_rgba(59,130,246,0.18),_transparent_60%)]" />
        </div>
      </div>
    </div>
  );
};

export default CelebratePage;
