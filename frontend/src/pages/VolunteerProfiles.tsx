import React from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle2 } from 'lucide-react';

const sample = [
  { name: 'Murugan Selvam', phone: '+91 98765 43210', hours: 42, campaigns: 6, referrals: 12 },
  { name: 'Kavitha Rajan', phone: '+91 91234 56789', hours: 28, campaigns: 4, referrals: 3 },
  { name: 'Vijay Anand', phone: '+91 99887 66554', hours: 80, campaigns: 12, referrals: 25 },
];

const Avatar = ({ name }: { name: string }) => (
  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-violet-600 text-white font-bold">
    {name
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')}
  </div>
);

const VolunteerProfiles: React.FC = () => {
  const [unlocked, setUnlocked] = React.useState<string[]>([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('unlockedBadges');
      setUnlocked(raw ? JSON.parse(raw) : []);
    } catch {
      setUnlocked([]);
    }
  }, []);

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Volunteer Profiles</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sample.map((v) => (
          <motion.div key={v.name} whileHover={{ y: -6 }} className="rounded-2xl border border-white/5 bg-slate-900/60 p-4">
            <div className="flex items-center gap-4">
              <Avatar name={v.name} />
              <div>
                <div className="text-white font-semibold">{v.name}</div>
                <div className="text-xs text-slate-300">{v.phone}</div>
              </div>
              <div className="ml-auto flex items-center gap-2 text-sm">
                <div className="flex items-center gap-2">
                  {unlocked.includes('lifesaver') && <span className="rounded-full bg-amber-400 px-2 py-1 text-xs font-semibold">Lifesaver</span>}
                </div>
                <div className="text-emerald-300 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Active</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-slate-300">
              <div className="rounded-lg bg-white/3 p-2">
                <div className="text-sm font-semibold text-white">{v.hours}</div>
                <div>Hours</div>
              </div>
              <div className="rounded-lg bg-white/3 p-2">
                <div className="text-sm font-semibold text-white">{v.campaigns}</div>
                <div>Campaigns</div>
              </div>
              <div className="rounded-lg bg-white/3 p-2">
                <div className="text-sm font-semibold text-white">{v.referrals}</div>
                <div>Referrals</div>
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-300">
              <div className="font-semibold text-white mb-2">Activity Timeline</div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-rose-400 mt-2" />
                  <div>
                    <div className="text-sm text-white">Collected blood at Chennai drive</div>
                    <div className="text-xs text-slate-400">2 days ago</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-400 mt-2" />
                  <div>
                    <div className="text-sm text-white">Referred 3 donors</div>
                    <div className="text-xs text-slate-400">1 week ago</div>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VolunteerProfiles;
