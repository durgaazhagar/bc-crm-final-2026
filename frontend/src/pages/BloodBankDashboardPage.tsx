import { motion } from 'framer-motion';
import { Activity, Heart, Hospital, ShieldCheck, TrendingUp, BarChart3, Clock3, HeartPulse, Truck, MapPin, CircleDot, AlertTriangle, Sparkles } from 'lucide-react';

const BloodBankDashboardPage = () => {
  const keyMetrics = [
    { label: 'Response Probability', value: '92%', icon: Sparkles, color: 'from-red-500 via-fuchsia-500 to-cyan-500' },
    { label: 'High Priority Cases', value: 18, icon: AlertTriangle, color: 'from-red-500 to-orange-500' },
    { label: 'Pending Requests', value: 24, icon: CircleDot, color: 'from-slate-500 to-blue-500' },
    { label: 'Resolved Today', value: 42, icon: BarChart3, color: 'from-emerald-500 to-teal-500' },
    { label: 'Avg Resolution Time', value: '28m', icon: Clock3, color: 'from-violet-500 to-fuchsia-500' },
  ];

  const supplyStats = [
    { label: 'Units in Inventory', value: 582, description: 'Ready for dispatch', icon: ShieldCheck, color: 'from-cyan-500 to-sky-500' },
    { label: 'Urgent Request Rate', value: '14%', description: 'Time-sensitive demands', icon: AlertTriangle, color: 'from-red-500 to-orange-500' },
    { label: 'Hospital Connections', value: 32, description: 'Active facility partners', icon: Hospital, color: 'from-violet-500 to-fuchsia-500' },
  ];

  const analytics = [
    { title: 'Donor stock by type', value: 'O+ 220 | A+ 140', status: 'Balanced' },
    { title: 'Dispatch accuracy', value: '97%', status: 'Excellent' },
    { title: 'Request fulfillment', value: '88%', status: 'On track' },
  ];

  const forecastCards = [
    { title: 'Supply Stability', value: '94%', detail: 'Projected within safe limits', icon: TrendingUp, color: 'from-emerald-500 to-cyan-500' },
    { title: 'Dispatch Accuracy', value: '98%', detail: 'On-time delivery forecast', icon: Truck, color: 'from-sky-500 to-indigo-500' },
    { title: 'Partner Readiness', value: '88%', detail: 'Hospital readiness score', icon: MapPin, color: 'from-violet-500 to-fuchsia-500' },
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
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Blood Bank Dashboard</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Monitor donor stocks and request readiness</h1>
              <p className="mt-4 max-w-2xl text-slate-400">View blood supply metrics, urgent case response, and dispatch analytics for your hospital network.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-5 text-slate-200 shadow-lg shadow-black/10">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-cyan-400" />
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Secure operations</p>
                  <p className="text-lg font-semibold text-white">Real-time inventory status</p>
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
                <Heart className="h-6 w-6 text-red-400" />
                <h2 className="text-xl font-semibold text-white">Supply overview</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {supplyStats.map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-400">{item.label}</p>
                        <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
                      </div>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br ${item.color} text-white shadow-lg shadow-black/20`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{item.description}</p>
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
                <Hospital className="h-6 w-6 text-rose-400" />
                <h2 className="text-xl font-semibold text-white">Analytics snapshot</h2>
              </div>
              <div className="space-y-4">
                {analytics.map((item) => (
                  <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-400">{item.title}</p>
                        <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                      </div>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-lg shadow-black/20 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-5">
                <TrendingUp className="h-6 w-6 text-emerald-400" />
                <h2 className="text-xl font-semibold text-white">Request flow</h2>
              </div>
              <div className="space-y-4">
                <div className="rounded-3xl bg-slate-900/70 p-4 border border-white/10">
                  <p className="text-sm text-slate-400">Response timeline</p>
                  <p className="mt-2 text-2xl font-semibold text-white">Fastest dispatch in 8m</p>
                  <p className="mt-2 text-sm text-slate-500">Avg resolution time stays under 30 minutes across urgent requests.</p>
                </div>
                <div className="rounded-3xl bg-slate-900/70 p-4 border border-white/10">
                  <p className="text-sm text-slate-400">Priority monitoring</p>
                  <p className="mt-2 text-2xl font-semibold text-white">18 active alerts</p>
                  <p className="mt-2 text-sm text-slate-500">High priority cases are being staffed and routed to hospitals.</p>
                </div>
              </div>
            </div>

            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-lg shadow-black/20 backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 mb-5">
                <TrendingUp className="h-6 w-6 text-cyan-300" />
                <h2 className="text-xl font-semibold text-white">Operational outlook</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {forecastCards.map((item) => (
                  <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{item.title}</p>
                        <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
                      </div>
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">{item.detail}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default BloodBankDashboardPage;
