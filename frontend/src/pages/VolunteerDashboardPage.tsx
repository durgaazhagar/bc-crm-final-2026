import { motion } from 'framer-motion';
import { Heart, Users, Activity, Gift, BarChart3, Clock3, Sparkles, Rocket, Target, Clipboard, ClipboardList, ClipboardCheck, AlertTriangle, CircleDot, CheckCircle2, Star, Trophy } from 'lucide-react';
import IconBadge from '../components/IconBadge';

const VolunteerDashboardPage = () => {
  const keyMetrics = [
    { label: 'Response Probability', value: '89%', icon: Target, color: 'from-red-500 via-fuchsia-500 to-cyan-500' },
    { label: 'High Priority Cases', value: 12, icon: AlertTriangle, color: 'from-red-500 to-orange-500' },
    { label: 'Pending Requests', value: 16, icon: CircleDot, color: 'from-slate-500 to-blue-500' },
    { label: 'Resolved Today', value: 27, icon: CheckCircle2, color: 'from-emerald-500 to-teal-500' },
    { label: 'Avg Resolution Time', value: '34m', icon: Clock3, color: 'from-violet-500 to-indigo-500' },
  ];

  const campaignCards = [
    { title: 'A+ Donor Drive', progress: '72%', note: '2 days left', badge: 'Active', icon: Gift, color: 'from-fuchsia-500 to-pink-500' },
    { title: 'Emergency Plasma Push', progress: '54%', note: '1 day left', badge: 'Urgent', icon: Target, color: 'from-red-500 to-orange-500' },
  ];

  const taskList = [
    { label: 'Tasks Assigned', status: 'Due soon', icon: ClipboardList, color: 'from-cyan-500 to-sky-500' },
    { label: 'Confirm volunteer roster', status: 'Completed', icon: ClipboardCheck, color: 'from-emerald-500 to-teal-500' },
    { label: 'Coordinate donor transport', status: 'In progress', icon: Clipboard, color: 'from-violet-500 to-fuchsia-500' },
  ];

  const volunteerHighlights = [
    { title: 'Active Campaigns', value: '8', icon: Target, accent: 'text-cyan-300' },
    { title: 'Engagement Score', value: '96%', icon: Star, accent: 'text-amber-300' },
    { title: 'Rewards', value: '12', icon: Trophy, accent: 'text-fuchsia-300' },
  ];

  return (
    <div className="min-h-screen bg-[#090f1a] p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 rounded-[32px] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl"
        >
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-fuchsia-300">Volunteer Dashboard</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Drive campaigns, tasks, and engagement</h1>
              <p className="mt-4 max-w-2xl text-slate-400">Coordinate volunteers, donor campaigns, and mission response from one central place.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-5 text-slate-200 shadow-lg shadow-black/10">
              <div className="flex items-center gap-3">
                <Gift className="h-8 w-8 text-fuchsia-400" />
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Community impact</p>
                  <p className="text-lg font-semibold text-white">Mobilise every mission</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {keyMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-5 shadow-lg shadow-black/20 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{metric.label}</p>
                      <p className="mt-4 text-3xl font-semibold text-white">{metric.value}</p>
                    </div>
                    <div className={`flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${metric.color} text-white shadow-lg shadow-black/20`}>
                      <metric.icon className="h-6 w-6" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-lg shadow-black/20 backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 mb-5">
                <Users className="h-6 w-6 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">Campaign engagement</h2>
              </div>
              <div className="space-y-4">
                {campaignCards.map((campaign, index) => (
                  <motion.div
                    key={campaign.title}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 + index * 0.05 }}
                    className="rounded-3xl border border-white/10 bg-slate-900/80 p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <IconBadge Icon={campaign.icon} size={22} title={campaign.title} />
                        <div>
                          <p className="text-sm text-slate-400">{campaign.title}</p>
                          <p className="mt-2 text-2xl font-semibold text-white">{campaign.progress}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300">{campaign.badge}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">{campaign.note}</p>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                      <div className="h-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500" style={{ width: campaign.progress }} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-lg shadow-black/20 backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 mb-5">
                <Rocket className="h-6 w-6 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">Volunteer impact</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {volunteerHighlights.map((item) => (
                  <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                      <div className="flex items-center gap-3">
                        <IconBadge Icon={item.icon} />
                        <div>
                          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{item.title}</p>
                          <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                        </div>
                      </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25 }}
            className="space-y-4"
          >
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-lg shadow-black/20 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-5">
                <Sparkles className="h-6 w-6 text-emerald-400" />
                <h2 className="text-xl font-semibold text-white">Tasks & engagement</h2>
              </div>
              <div className="space-y-4">
                {taskList.map((task, index) => (
                  <motion.div
                    key={task.label}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 + index * 0.05 }}
                    className="rounded-3xl border border-white/10 bg-slate-900/80 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <IconBadge Icon={task.icon} size={18} title={task.label} />
                        <p className="text-sm font-semibold text-white">{task.label}</p>
                      </div>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300">{task.status}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-lg shadow-black/20 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-5">
                <Heart className="h-6 w-6 text-rose-400" />
                <h2 className="text-xl font-semibold text-white">Engagement insights</h2>
              </div>
              <p className="text-slate-300 mb-4">Track volunteer participation and campaign support with confidence.</p>
              <div className="grid gap-3">
                <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10">
                  <p className="text-sm text-slate-400">Volunteer satisfaction</p>
                  <p className="mt-2 text-2xl font-semibold text-white">95%</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10">
                  <p className="text-sm text-slate-400">Active campaign reach</p>
                  <p className="mt-2 text-2xl font-semibold text-white">4,860 contacts</p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboardPage;
