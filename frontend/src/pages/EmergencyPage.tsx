import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Droplets,
  HeartPulse,
  MapPin,
  PieChart,
  ShieldAlert,
  ShieldCheck,
  Star,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import SectionCard from '../components/SectionCard';
import api, { aiService } from '../services/api';

const inventoryLevels = [
  { group: 'O+', level: 78, tint: 'from-red-500 to-rose-500' },
  { group: 'A+', level: 68, tint: 'from-orange-400 to-amber-400' },
  { group: 'B+', level: 59, tint: 'from-amber-400 to-yellow-400' },
  { group: 'AB+', level: 52, tint: 'from-indigo-500 to-violet-500' },
  { group: 'O-', level: 33, tint: 'from-cyan-400 to-blue-400' },
  { group: 'A-', level: 28, tint: 'from-sky-400 to-cyan-500' },
  { group: 'B-', level: 24, tint: 'from-fuchsia-500 to-pink-500' },
  { group: 'AB-', level: 19, tint: 'from-emerald-400 to-teal-400' },
];

const campaignRoadmap = [
  { title: 'Citywide Donation Drive', date: 'Jun 24', progress: 84, icon: Calendar },
  { title: 'Volunteer Rally', date: 'Jun 28', progress: 67, icon: Users },
  { title: 'AI Match Workshop', date: 'Jul 02', progress: 52, icon: Star },
];

const suspiciousAlerts = [
  { title: 'Unusual donor location pattern', risk: 'Medium', icon: ShieldAlert },
  { title: 'Delayed hospital fulfillment event', risk: 'High', icon: AlertTriangle },
  { title: 'Multiple rapid emergency requests', risk: 'Critical', icon: Bell },
];

const EmergencyPage = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [form, setForm] = useState({ bloodGroup: 'A+', location: '', urgencyLevel: 'critical', description: '', hospitalLoad: 50, unitsNeeded: 2 });
  const [matches, setMatches] = useState<any[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);
  const [emergencyPriorities, setEmergencyPriorities] = useState<any>({});
  const [loadingPriorities, setLoadingPriorities] = useState(false);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/emergency');
      setRequests(data);
      setLoadingPriorities(true);
      const prioritiesMap: any = {};

      for (const req of data) {
        try {
          const response = await aiService.classifyEmergencyPriority({
            bloodGroup: req.bloodGroup,
            urgency: req.urgencyLevel,
            hospitalLoad: req.hospitalLoad ?? 50,
            unitsNeeded: req.unitsNeeded ?? 2,
          });
          prioritiesMap[req._id] = response.data.data;
        } catch (error) {
          console.error('Error fetching priority for emergency:', error);
        }
      }

      setEmergencyPriorities(prioritiesMap);
      setLoadingPriorities(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const createRequest = async () => {
    try {
      const { data } = await api.post('/emergency', form);
      setMatches(data.matched);
      fetchRequests();
      try {
        const priorityResponse = await aiService.classifyEmergencyPriority({
          bloodGroup: form.bloodGroup,
          urgency: form.urgencyLevel,
          hospitalLoad: form.hospitalLoad,
          unitsNeeded: form.unitsNeeded,
        });
        setEmergencyPriorities((prev: any) => ({
          ...prev,
          [data.emergency._id]: priorityResponse.data.data,
        }));
      } catch (error) {
        console.error('Error fetching priority:', error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFindDonors = async () => {
    setMatchError(null);
    setLoadingMatches(true);
    try {
      const response = await aiService.matchDonors({
        bloodGroup: form.bloodGroup,
        location: form.location,
        urgencyLevel: form.urgencyLevel,
      });
      setMatches(response.data?.data || []);
    } catch (error) {
      console.error('Error finding donors:', error);
      setMatchError('Unable to find donor matches right now. Try again later.');
    } finally {
      setLoadingMatches(false);
    }
  };

  const sortedRequests = useMemo(() => {
    const priorityOrder: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return [...requests].sort((a, b) => {
      const aPriority = emergencyPriorities[a._id]?.priority || 'Low';
      const bPriority = emergencyPriorities[b._id]?.priority || 'Low';
      return (priorityOrder[aPriority] || 999) - (priorityOrder[bPriority] || 999);
    });
  }, [requests, emergencyPriorities]);

  const summaryStats = useMemo(() => {
    const critical = sortedRequests.filter((request) => emergencyPriorities[request._id]?.priority === 'Critical').length;
    const high = sortedRequests.filter((request) => emergencyPriorities[request._id]?.priority === 'High').length;
    return {
      activeRequests: requests.length,
      criticalRequests: critical,
      highRequests: high,
      matchedDonors: matches.length,
      aiReadiness: Math.max(78, Math.min(98, requests.length * 8 + 48)),
    };
  }, [requests, matches, sortedRequests, emergencyPriorities]);

  const priorityStyle = (priority: string) => {
    const map: Record<string, string> = {
      Critical: 'text-rose-300 bg-rose-500/10 border border-rose-500/20',
      High: 'text-orange-300 bg-orange-500/10 border border-orange-500/20',
      Medium: 'text-amber-300 bg-amber-500/10 border border-amber-500/20',
      Low: 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/20',
    };
    return map[priority] || map.Low;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.75fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-[36px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        >
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200">
                <AlertTriangle className="w-4 h-4" /> Emergency Command Center
              </div>
              <h1 className="mt-5 text-4xl font-semibold text-white">Blood Connect AI Operations</h1>
              <p className="mt-3 text-slate-400 sm:text-lg">
                One unified command panel for urgent alerts, donor readiness, inventory health and predictive match intelligence.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Active alerts</p>
                <p className="mt-4 text-4xl font-bold text-white">{summaryStats.activeRequests}</p>
                <div className="mt-3 flex items-center gap-2 text-slate-400 text-sm">
                  <Bell className="w-4 h-4 text-cyan-300" /> Real-time emergency tracking
                </div>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">AI readiness</p>
                <p className="mt-4 text-4xl font-bold text-white">{summaryStats.aiReadiness}%</p>
                <div className="mt-3 flex items-center gap-2 text-slate-400 text-sm">
                  <Zap className="w-4 h-4 text-emerald-300" /> Predictive routing engaged
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Matched donors</p>
              <p className="mt-4 text-3xl font-semibold text-white">{summaryStats.matchedDonors}</p>
              <p className="mt-2 text-sm text-slate-400">AI score and response window</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Critical cases</p>
              <p className="mt-4 text-3xl font-semibold text-white">{summaryStats.criticalRequests}</p>
              <p className="mt-2 text-sm text-slate-400">Highest priority response required</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">High priority</p>
              <p className="mt-4 text-3xl font-semibold text-white">{summaryStats.highRequests}</p>
              <p className="mt-2 text-sm text-slate-400">Hospital and blood demand alerts</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          <SectionCard title="Emergency Alerts" subtitle="Priority warnings with instant red alert visibility">
            <div className="space-y-4">
              <motion.div
                animate={{ opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="rounded-[28px] border border-red-500/20 bg-red-500/10 p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-red-200">Active danger zones</p>
                    <p className="mt-3 text-2xl font-semibold text-white">{summaryStats.criticalRequests} Critical / {summaryStats.highRequests} High</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-300" />
                </div>
                <p className="mt-4 text-sm text-slate-300">Emergency zones are continuously monitored. Responders receive automatic route optimization and donor match feeds.</p>
              </motion.div>

              <div className="grid gap-4">
                <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Real-time broadcast</p>
                      <p className="mt-2 text-xl font-semibold text-white">Priority notification system</p>
                    </div>
                    <Bell className="w-6 h-6 text-cyan-300" />
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-slate-400">
                    <p>Instant donor alert distribution</p>
                    <p>Hospital commitment tracking</p>
                    <p>AI-assigned urgency scores</p>
                  </div>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Live incident charts</p>
                      <p className="mt-2 text-xl font-semibold text-white">Dynamic red-zone map feed</p>
                    </div>
                    <MapPin className="w-6 h-6 text-rose-400" />
                  </div>
                  <div className="mt-4 flex items-center gap-3 text-sm text-slate-400">
                    <div className="rounded-full bg-white/5 px-3 py-1">Updated 46s ago</div>
                    <div className="rounded-full bg-white/5 px-3 py-1">5 zones live</div>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="AI Donor Eligibility Test" subtitle="Health-driven screening for rapid readiness">
            <div className="space-y-4 text-slate-300">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Health pulse</p>
                  <p className="mt-3 text-3xl font-semibold text-white">94%</p>
                  <p className="mt-2 text-sm text-slate-400">AI eligibility confidence</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Donor match rate</p>
                  <p className="mt-3 text-3xl font-semibold text-white">87%</p>
                  <p className="mt-2 text-sm text-slate-400">Rapid availability prediction</p>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <HeartPulse className="w-5 h-5 text-rose-300" />
                  <p className="text-sm text-slate-300">AI risk assessment flags donors who can respond safely within 24 hours.</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-sm text-slate-500">Recovery Window</p>
                  <p className="mt-2 text-2xl font-semibold text-white">24 hrs</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-sm text-slate-500">Fresh Blood Readiness</p>
                  <p className="mt-2 text-2xl font-semibold text-white">82%</p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="grid gap-6">
          <SectionCard title="Blood Inventory" subtitle="Stock levels by type with expiry warnings">
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {inventoryLevels.map((item) => (
                  <div key={item.group} className="rounded-[28px] border border-white/10 bg-slate-900/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-400">{item.group}</p>
                        <p className="mt-2 text-2xl font-semibold text-white">{item.level}%</p>
                      </div>
                      <Droplets className="w-6 h-6 text-cyan-300" />
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.level}%` }}
                        transition={{ duration: 1.2 }}
                        className={`h-full rounded-full bg-gradient-to-r ${item.tint}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-[28px] border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
                <span className="font-semibold">Expiry alert:</span> O- and A- are trending low and require urgent replenishment in the next 48 hours.
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Requests & Fulfillment" subtitle="Hospital requests dashboard with emergency prioritization">
            <div className="space-y-4">
              {sortedRequests.slice(0, 5).map((request) => {
                const priority = emergencyPriorities[request._id];
                if (!priority) return null;
                return (
                  <div key={request._id} className="rounded-[28px] border border-white/10 bg-slate-900/70 p-4 hover:border-white/20 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-400">{request.location} • {request.bloodGroup}</p>
                        <h3 className="mt-2 text-lg font-semibold text-white">{request.description || 'Blood request incoming'}</h3>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                          <span className={priorityStyle(priority.priority)}> {priority.priority} priority </span>
                          <span className="rounded-full bg-white/5 px-2 py-1">{request.unitsNeeded} units</span>
                          <span className="rounded-full bg-white/5 px-2 py-1">ETA {priority.eta}</span>
                        </div>
                      </div>
                      <div className="text-right text-slate-400">
                        <span className="block text-sm">Hospital load</span>
                        <span className="mt-2 text-2xl font-semibold text-white">{request.hospitalLoad}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-6">
          <SectionCard title="Campaigns & Events" subtitle="Upcoming drives, volunteers and reward momentum">
            <div className="space-y-4">
              {campaignRoadmap.map((campaign) => {
                const Icon = campaign.icon;
                return (
                  <div key={campaign.title} className="rounded-[28px] border border-white/10 bg-slate-900/70 p-4 hover:border-white/20 transition-all">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-400">{campaign.date}</p>
                        <h3 className="mt-2 text-lg font-semibold text-white">{campaign.title}</h3>
                      </div>
                      <Icon className="w-6 h-6 text-cyan-300" />
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full w-[calc(50%+10%)] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{ width: `${campaign.progress}%` }} />
                    </div>
                    <p className="mt-2 text-sm text-slate-400">Progress: {campaign.progress}%</p>
                  </div>
                );
              })}
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <div className="flex items-center gap-2 text-cyan-300">
                  <Trophy className="w-4 h-4" /> Gamified reward system with badges, stars and donor recognition.
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Fraud Detection" subtitle="AI anomaly alerts and suspicious activity monitoring">
            <div className="space-y-4">
              {suspiciousAlerts.map((alert) => {
                const Icon = alert.icon;
                return (
                  <div key={alert.title} className="rounded-[28px] border border-white/10 bg-slate-900/70 p-4 flex items-start gap-4">
                    <div className="rounded-3xl bg-red-500/10 p-3 text-red-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-300 font-semibold">{alert.title}</p>
                      <p className="mt-1 text-xs text-slate-500">Risk level: {alert.risk}</p>
                    </div>
                  </div>
                );
              })}
              <div className="rounded-[28px] border border-slate-700/50 bg-white/5 p-4 text-sm text-slate-400">
                AI scoring is monitoring requests, donor behavior and hospital load to prevent fraud before dispatch.
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Tracking & Navigation" subtitle="Map-aware logistics and route optimization">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-4 overflow-hidden">
              <div className="relative h-56 overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.18),transparent_35%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(14,165,233,0.12),transparent_28%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(239,68,68,0.12),transparent_20%)]" />
                <div className="absolute left-6 top-8 rounded-full bg-white/10 p-3 shadow-lg shadow-slate-950/40">
                  <MapPin className="w-6 h-6 text-cyan-300" />
                </div>
                <div className="absolute right-8 bottom-12 rounded-full bg-white/10 p-3 shadow-lg shadow-slate-950/40">
                  <Compass className="w-6 h-6 text-rose-300" />
                </div>
                <div className="absolute left-6 bottom-6 rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white backdrop-blur-sm">
                  Route optimizer active · 8 min fastest ETA
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-300" /> Live ambulance corridor
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-300" /> High-priority delivery routes
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" /> AI suggested alternate route
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      <SectionCard title="Analytics & Reports" subtitle="Demand, supply and predictive insights in one place">
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-[0.3em]">Demand vs supply</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Inventory stress index</h2>
              </div>
              <PieChart className="w-6 h-6 text-cyan-300" />
            </div>
            <div className="mt-6 space-y-4 text-slate-300 text-sm">
              <div className="rounded-[24px] bg-white/5 p-4">
                <p className="text-slate-400">A+ demand is outpacing donations by</p>
                <p className="mt-2 text-xl font-semibold text-white">+18%</p>
              </div>
              <div className="rounded-[24px] bg-white/5 p-4">
                <p className="text-slate-400">Projected O- shortfall in</p>
                <p className="mt-2 text-xl font-semibold text-white">2 days</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-[0.3em]">Predictive analytics</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">AI readiness forecast</h2>
              </div>
              <BarChart3 className="w-6 h-6 text-emerald-300" />
            </div>
            <div className="mt-6 space-y-4 text-slate-300 text-sm">
              <div className="rounded-[24px] bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3 text-white">
                  <span>Donor availability trend</span>
                  <span className="font-semibold text-cyan-300">+12%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                </div>
              </div>
              <div className="rounded-[24px] bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3 text-white">
                  <span>Predicted fulfillment rate</span>
                  <span className="font-semibold text-emerald-300">91%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div className="h-full w-[91%] rounded-full bg-gradient-to-r from-emerald-400 to-lime-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default EmergencyPage;
