import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Globe,
  HeartPulse,
  Hospital,
  Map,
  MapPin,
  ShieldCheck,
  Truck,
  Users,
  Zap,
  TrendingUp,
  Flag,
  Bed,
} from 'lucide-react';
import IconBadge from '../components/IconBadge';

type HospitalType = 'Government' | 'Private' | 'Trauma Center' | 'Multi-Speciality';

interface HospitalProfile {
  id: string;
  name: string;
  city: string;
  location: string;
  type: HospitalType;
  mapQuery: string;
  readiness: number;
  occupancy: number;
  bedsAvailable: number;
  score: number;
  weather: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
  weatherMessage: string;
}

interface RequestRow {
  id: string;
  patient: string;
  bloodGroup: string;
  timeSince: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Matched' | 'In Progress' | 'Awaiting Donor';
  escalation: string;
}

interface DonorRecord {
  name: string;
  bloodGroup: string;
  status: 'Accepted' | 'Pending' | 'Rejected';
  contacted: string;
  reliability: string;
  distance: string;
  eta: string;
}

interface BloodStock {
  group: string;
  stock: number;
  threshold: number;
}

interface EmergencyAlert {
  caseId: string;
  type: string;
  raised: string;
  escalation: string;
  assigned: number;
  status: string;
}

const hospitalProfiles: HospitalProfile[] = [
  {
    id: 'H-102',
    name: 'Apollo Hospital',
    city: 'Chennai',
    location: 'Greams Road, Chennai',
    type: 'Multi-Speciality',
    mapQuery: 'Apollo Hospital Chennai',
    readiness: 91,
    occupancy: 84,
    bedsAvailable: 21,
    score: 92,
    weather: 'ORANGE',
    weatherMessage: 'A+ and B- stocks expected to fall below safe threshold in 6 hours.',
  },
  {
    id: 'H-215',
    name: 'Government Rajaji Hospital',
    city: 'Madurai',
    location: 'Alagarkoil Road, Madurai',
    type: 'Government',
    mapQuery: 'Government Rajaji Hospital Madurai',
    readiness: 78,
    occupancy: 91,
    bedsAvailable: 12,
    score: 84,
    weather: 'RED',
    weatherMessage: 'B+ and O- inventories critical. Declare urgent donor mobilization.',
  },
  {
    id: 'H-329',
    name: 'Kauvery Hospital',
    city: 'Tiruchirappalli',
    location: 'Srirangam Road, Tiruchirappalli',
    type: 'Private',
    mapQuery: 'Kauvery Hospital Trichy',
    readiness: 86,
    occupancy: 77,
    bedsAvailable: 19,
    score: 88,
    weather: 'YELLOW',
    weatherMessage: 'Demand rising for AB+ and O+ within the next 8 hours.',
  },
  {
    id: 'H-441',
    name: 'Coimbatore Medical College',
    city: 'Coimbatore',
    location: 'Avinashi Road, Coimbatore',
    type: 'Government',
    mapQuery: 'Coimbatore Medical College Hospital',
    readiness: 81,
    occupancy: 88,
    bedsAvailable: 16,
    score: 85,
    weather: 'ORANGE',
    weatherMessage: 'O- supply under pressure with incoming trauma cases.',
  },
];

const hospitalRequests: RequestRow[] = [
  { id: 'REQ-301', patient: 'Anitha', bloodGroup: 'O+', timeSince: '18m', priority: 'Critical', status: 'Pending', escalation: 'Level 3' },
  { id: 'REQ-302', patient: 'Suresh', bloodGroup: 'B-', timeSince: '24m', priority: 'High', status: 'Matched', escalation: 'Level 2' },
  { id: 'REQ-303', patient: 'Priya', bloodGroup: 'A+', timeSince: '31m', priority: 'Medium', status: 'Awaiting Donor', escalation: 'Level 2' },
  { id: 'REQ-304', patient: 'Rahul', bloodGroup: 'AB-', timeSince: '45m', priority: 'Critical', status: 'In Progress', escalation: 'Level 3' },
];

const donorSwarm: DonorRecord[] = [
  { name: 'Gopi', bloodGroup: 'O+', status: 'Accepted', contacted: '2m ago', reliability: '96%', distance: '3.4 km', eta: '8m' },
  { name: 'Durga', bloodGroup: 'A+', status: 'Pending', contacted: '5m ago', reliability: '94%', distance: '4.1 km', eta: '11m' },
  { name: 'Nina', bloodGroup: 'B+', status: 'Rejected', contacted: '12m ago', reliability: '89%', distance: '5.2 km', eta: '14m' },
  { name: 'Praveen', bloodGroup: 'B-', status: 'Accepted', contacted: '14m ago', reliability: '91%', distance: '6.0 km', eta: '16m' },
  { name: 'Meena', bloodGroup: 'AB-', status: 'Accepted', contacted: '3m ago', reliability: '93%', distance: '2.9 km', eta: '7m' },
];

const bloodInventory: BloodStock[] = [
  { group: 'A+', stock: 12, threshold: 18 },
  { group: 'A-', stock: 4, threshold: 10 },
  { group: 'B+', stock: 9, threshold: 15 },
  { group: 'B-', stock: 3, threshold: 8 },
  { group: 'O+', stock: 20, threshold: 20 },
  { group: 'O-', stock: 6, threshold: 12 },
];

const ambulanceTrackers = [
  { id: 'AMB-04', status: 'En route', eta: '12m', route: 'Chennai → Apollo', traffic: 'Moderate' },
  { id: 'AMB-11', status: 'Loading donor', eta: '8m', route: 'Madurai → Rajaji', traffic: 'Low' },
  { id: 'AMB-22', status: 'Traffic hold', eta: '18m', route: 'Trichy → Kauvery', traffic: 'Heavy' },
];

const emergencyAlerts: EmergencyAlert[] = [
  { caseId: 'EC-205', type: 'Accident', raised: '12m ago', escalation: 'Level 3', assigned: 3, status: 'Critical' },
  { caseId: 'EC-206', type: 'Surgery', raised: '28m ago', escalation: 'Level 2', assigned: 2, status: 'Active' },
  { caseId: 'EC-207', type: 'Trauma', raised: '41m ago', escalation: 'Level 1', assigned: 1, status: 'Monitoring' },
];

const HospitalPage = () => {
  const [selectedHospitalIndex, setSelectedHospitalIndex] = useState(0);
  const hospital = hospitalProfiles[selectedHospitalIndex];

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.mapQuery)}`;

  const weatherTone = useMemo(() => {
    if (hospital.weather === 'GREEN') return 'text-emerald-300 bg-emerald-500/10';
    if (hospital.weather === 'YELLOW') return 'text-yellow-300 bg-yellow-500/10';
    if (hospital.weather === 'ORANGE') return 'text-orange-300 bg-orange-500/10';
    return 'text-red-300 bg-red-500/10';
  }, [hospital.weather]);

  const donorStats = useMemo(
    () => ({
      accepted: donorSwarm.filter((item) => item.status === 'Accepted').length,
      pending: donorSwarm.filter((item) => item.status === 'Pending').length,
      rejected: donorSwarm.filter((item) => item.status === 'Rejected').length,
    }),
    [],
  );

  const criticalStockCount = useMemo(
    () => bloodInventory.filter((item) => item.stock <= item.threshold * 0.5).length,
    [],
  );

  return (
    <div className="min-h-screen bg-[#060b13] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.12),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(248,113,113,0.1),_transparent_20%)] pointer-events-none" />
      <div className="relative mx-auto max-w-[1640px] px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card relative overflow-hidden border border-white/10 bg-slate-950/80 p-8 shadow-[0_0_80px_rgba(16,24,40,0.25)] backdrop-blur-xl"
          >
            <div className="absolute right-6 top-6 h-24 w-24 rounded-full bg-gradient-to-br from-cyan-400/20 to-violet-500/10 blur-3xl" />
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-3 rounded-full bg-slate-900/70 px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-400 shadow-[0_0_20px_rgba(255,255,255,0.03)]">
                  <Flag className="h-4 w-4 text-cyan-300" /> Hospital Command Center
                </div>
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
                  <div>
                    <h1 className="text-4xl font-semibold tracking-tight text-white">Tamil Nadu Healthcare Command</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                      Futuristic hospital intelligence for emergency response, blood logistics, ambulance operations and pandemic-level healthcare coordination.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-right">
                    <p className="text-xs uppercase tracking-[0.32em] text-cyan-200">AI Hospital Copilot</p>
                    <p className="mt-2 text-3xl font-semibold text-white">ACTIVE</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
                <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-600 to-violet-600 text-2xl font-bold text-white shadow-[0_20px_50px_rgba(56,189,248,0.18)]">
                        {hospital.name
                          .split(' ')
                          .map((part) => part[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Smart Hospital Profile</p>
                        <h2 className="mt-2 text-3xl font-semibold text-white">{hospital.name}</h2>
                        <p className="mt-1 text-sm text-slate-400">{hospital.type} • {hospital.city}</p>
                      </div>
                    </div>
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/15"
                    >
                      <MapPin className="h-4 w-4" /> Open Maps
                    </a>
                  </div>

                  <div className="mt-6 grid gap-4 grid-cols-2 md:grid-cols-3">
                    {/* Hospital metrics: responsive 2x3 grid */}
                    <div className="metric-card relative rounded-2xl p-4 bg-slate-950/90 border border-white/5 backdrop-blur-xl ring-1 ring-white/5 hover:shadow-[0_10px_40px_rgba(56,189,248,0.08)] transition transform hover:-translate-y-0.5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Readiness</p>
                          <p title={`Readiness: ${hospital.readiness}%`} className="mt-2 text-2xl font-semibold text-white truncate">{hospital.readiness}%</p>
                          <p className="text-xs text-slate-500">Emergency readiness score</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <IconBadge Icon={hospital.readiness >= 85 ? CheckCircle2 : Activity} size={20} title="Readiness" />
                        </div>
                      </div>
                    </div>

                    <div className="metric-card relative rounded-2xl p-4 bg-slate-950/90 border border-white/5 backdrop-blur-xl ring-1 ring-white/5 hover:shadow-[0_10px_40px_rgba(99,102,241,0.08)] transition transform hover:-translate-y-0.5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">ICU Occupancy</p>
                          <p title={`ICU occupancy ${hospital.occupancy}%`} className="mt-2 text-2xl font-semibold text-white truncate">{hospital.occupancy}%</p>
                          <p className="text-xs text-slate-500">Current ICU utilization</p>
                        </div>
                        <IconBadge Icon={Hospital} size={20} title="ICU Occupancy" />
                      </div>
                    </div>

                    <div className="metric-card relative rounded-2xl p-4 bg-slate-950/90 border border-white/5 backdrop-blur-xl ring-1 ring-white/5 hover:shadow-[0_10px_40px_rgba(236,72,153,0.06)] transition transform hover:-translate-y-0.5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Bed Availability</p>
                          <p title={`Beds available: ${hospital.bedsAvailable}`} className="mt-2 text-2xl font-semibold text-white truncate">{hospital.bedsAvailable}</p>
                          <p className="text-xs text-slate-500">Beds available now</p>
                        </div>
                        <IconBadge Icon={Bed} size={20} title="Bed Availability" />
                      </div>
                    </div>

                    <div className="metric-card relative rounded-2xl p-4 bg-slate-950/90 border border-white/5 backdrop-blur-xl ring-1 ring-white/5 hover:shadow-[0_10px_40px_rgba(34,197,94,0.06)] transition transform hover:-translate-y-0.5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Performance</p>
                          <p title={`Performance score ${hospital.score}%`} className="mt-2 text-2xl font-semibold text-white truncate">{hospital.score}%</p>
                          <p className="text-xs text-slate-500">Hospital performance</p>
                        </div>
                        <IconBadge Icon={TrendingUp} size={20} title="Performance" />
                      </div>
                    </div>

                    <div className="metric-card relative rounded-2xl p-4 bg-slate-950/90 border border-white/5 backdrop-blur-xl ring-1 ring-white/5 hover:shadow-[0_10px_40px_rgba(255,99,72,0.06)] transition transform hover:-translate-y-0.5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Emergency Status</p>
                          <p title={`Emergency: ${hospital.weatherMessage}`} className="mt-2 text-2xl font-semibold text-white truncate">{hospital.weather === 'RED' ? 'Critical' : hospital.weather === 'ORANGE' ? 'Orange / Critical' : hospital.weather}</p>
                          <p className="text-xs text-slate-500">Alert level</p>
                        </div>
                        <IconBadge Icon={AlertTriangle} size={20} title="Emergency Status" />
                      </div>
                    </div>

                    <div className="metric-card relative rounded-2xl p-4 bg-slate-950/90 border border-white/5 backdrop-blur-xl ring-1 ring-white/5 hover:shadow-[0_10px_40px_rgba(250,204,21,0.06)] transition transform hover:-translate-y-0.5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Shortage Window</p>
                          <p title="Expected shortage window" className="mt-2 text-2xl font-semibold text-white truncate">4h</p>
                          <p className="text-xs text-slate-500">Estimated time until shortage</p>
                        </div>
                        <IconBadge Icon={Clock3} size={20} title="Shortage Window" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Today's Blood Weather</p>
                      <p className={`mt-3 inline-flex rounded-full px-3 py-2 text-sm font-semibold ${weatherTone}`}>{hospital.weather}</p>
                      <p className="mt-3 text-sm text-slate-400">{hospital.weatherMessage}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Live Location Badge</p>
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-slate-200">
                        <Map className="h-4 w-4 text-cyan-300" /> {hospital.location}
                      </div>
                      <p className="mt-3 text-sm text-slate-400">Click map for navigation</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/70 to-slate-900/70 p-6 shadow-[0_0_40px_rgba(56,189,248,0.08)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">AI Command Assistant</p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">AI Hospital Copilot</h3>
                    </div>
                    <div className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cyan-200">Active</div>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="rounded-3xl border border-cyan-500/10 bg-slate-950/80 p-4">
                      <p className="text-sm text-slate-400">Recommended action</p>
                      <p className="mt-3 text-sm text-slate-100">AI recommends activating 12 O+ donors within 10 km radius. Expected shortage in 4 hours.</p>
                    </div>
                    <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                      {[
                        { label: 'Emergency status', value: 'CRITICAL', accent: 'text-red-300' },
                        { label: 'Shortage window', value: '4h', accent: 'text-yellow-300' },
                      ].map((item) => (
                        <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{item.label}</p>
                          <p className={`mt-2 text-2xl font-semibold ${item.accent}`}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass-card border border-white/10 bg-slate-950/80 p-6 shadow-[0_0_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.36em] text-slate-400">AI Hospital Intelligence</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Predictive Health Scoreboard</h2>
                  </div>
                  <Zap className="h-6 w-6 text-amber-400" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: 'AI Risk Level', value: 'High', hint: 'Hospital alert index', tone: 'text-orange-300' },
                    { label: 'Blood Demand (24h)', value: '198 units', hint: 'Projected need', tone: 'text-cyan-300' },
                    { label: 'Surge Forecast', value: '+22%', hint: 'Emergency rise', tone: 'text-red-300' },
                    { label: 'Resource Utilization', value: '73%', hint: 'Capacity efficiency', tone: 'text-emerald-300' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{item.label}</p>
                      <p className={`mt-3 text-3xl font-semibold ${item.tone}`}>{item.value}</p>
                      <p className="mt-2 text-sm text-slate-500">{item.hint}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">AI Recommended Actions</p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-2"><CheckCircle2 className="mt-1 h-4 w-4 text-emerald-300" /> Activate blood-swarm alert for O+ donors within a 10km radius.</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="mt-1 h-4 w-4 text-emerald-300" /> Push trauma support to Apollo and Rajaji emergency wings.</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="mt-1 h-4 w-4 text-emerald-300" /> Reserve 12 ICU beds for mass-casualty response.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="glass-card border border-white/10 bg-slate-950/80 p-6 shadow-[0_0_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.36em] text-slate-400">Emergency Command Center</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Live Crisis Coordination</h2>
                </div>
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="mt-6 space-y-4">
                {emergencyAlerts.map((item) => (
                  <div key={item.caseId} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{item.caseId} · {item.type}</p>
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{item.raised} • {item.escalation}</p>
                      </div>
                      <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-red-300">{item.status}</span>
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm text-slate-400">
                      <div>Assigned units: <span className="text-white">{item.assigned}</span></div>
                      <div>Response priority: <span className="text-white">{item.escalation}</span></div>
                    </div>
                  </div>
                ))}
                <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4 text-sm text-slate-300">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Escalation Heat Level</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="inline-flex h-3 w-3 rounded-full bg-red-400 animate-pulse" />
                    <p>High impact zone across Chennai and Madurai emergency corridors.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card border border-white/10 bg-slate-950/80 p-6 shadow-[0_0_40px_rgba(0,0,0,0.18)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.36em] text-slate-400">Blood Intelligence Center</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Real-Time Stock Analytics</h2>
              </div>
              <TrendingUp className="h-6 w-6 text-cyan-300" />
            </div>
            <div className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {bloodInventory.map((item) => {
                  const fill = Math.min(100, (item.stock / item.threshold) * 100);
                  return (
                    <div key={item.group} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-slate-400">{item.group}</p>
                          <p className="mt-2 text-xl font-semibold text-white">{item.stock} / {item.threshold}</p>
                        </div>
                        <span className="text-xs uppercase tracking-[0.24em] text-slate-400">{fill}%</span>
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-900">
                        <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-red-400" style={{ width: `${fill}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <p className="uppercase tracking-[0.24em] text-slate-400">Shortage prediction</p>
                  <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs text-orange-300">Watchlist</span>
                </div>
                <p className="mt-3 text-slate-300">O- and B- are trending toward critical stock levels unless donor activation is increased within 5 hours.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass-card border border-white/10 bg-slate-950/80 p-6 shadow-[0_0_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.36em] text-slate-400">Donor Swarm Intelligence</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Nearby Donor Network</h2>
                </div>
                <Users className="h-6 w-6 text-emerald-300" />
              </div>
              <div className="mt-6 space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Available Donors</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{donorStats.accepted}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Pending Activations</p>
                    <p className="mt-3 text-3xl font-semibold text-yellow-300">{donorStats.pending}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Reliability</p>
                    <p className="mt-3 text-3xl font-semibold text-cyan-300">92%</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {donorSwarm.map((donor) => (
                    <div key={donor.name} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{donor.name}</p>
                          <p className="text-xs text-slate-400">{donor.bloodGroup} • {donor.distance} • ETA {donor.eta}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.24em] ${
                          donor.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-200' : donor.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-200' : 'bg-red-500/10 text-red-200'
                        }`}>
                          {donor.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card border border-white/10 bg-slate-950/80 p-6 shadow-[0_0_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.36em] text-slate-400">Smart Ambulance Tracking</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Live Dispatch Monitoring</h2>
                </div>
                <Truck className="h-6 w-6 text-orange-300" />
              </div>
              <div className="mt-6 space-y-3">
                {ambulanceTrackers.map((vehicle) => (
                  <div key={vehicle.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{vehicle.id}</p>
                        <p className="text-xs text-slate-400">{vehicle.route}</p>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-200">{vehicle.status}</span>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-slate-400">
                      <div>ETA: <span className="text-white">{vehicle.eta}</span></div>
                      <div>Traffic: <span className="text-white">{vehicle.traffic}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.7fr]">
          <div className="glass-card border border-white/10 bg-slate-950/80 p-6 shadow-[0_0_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.36em] text-slate-400">Live Geo Operations</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">National Response Map</h2>
              </div>
              <button className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-500/20">One-click navigation</button>
            </div>
            <div className="mt-6 h-[320px] overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/80">
              <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.15),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(248,113,113,0.12),_transparent_25%)]">
                <div className="relative h-full">
                  <button
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Apollo Hospital Chennai')}`, '_blank')}
                    title={`Apollo Hospital — Readiness: ${hospitalProfiles[0].readiness}%`}
                    className="absolute left-12 top-10 flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-cyan-200 shadow-[0_0_30px_rgba(56,189,248,0.15)] hover:scale-105 transition-transform"
                  >
                    <IconBadge Icon={MapPin} />
                    <span>Apollo</span>
                  </button>

                  <button
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('blood donors near Chennai')}`, '_blank')}
                    title={`Donor swarm — ${donorSwarm.length} donors nearby`}
                    className="absolute left-32 top-48 flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-amber-200 shadow-[0_0_30px_rgba(251,146,60,0.12)] hover:scale-105 transition-transform"
                  >
                    <IconBadge Icon={HeartPulse} />
                    <span>Donor swarm</span>
                  </button>

                  <button
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Hospital ambulance route')}`, '_blank')}
                    title={`Ambulance routes — Active: ${ambulanceTrackers.length}`}
                    className="absolute right-16 top-36 flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-3 py-2 text-red-200 shadow-[0_0_30px_rgba(248,113,113,0.12)] hover:scale-105 transition-transform"
                  >
                    <IconBadge Icon={Truck} />
                    <span>Ambulance</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Hospital markers</p>
                <p className="mt-2 text-2xl font-semibold text-white">4</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Donor markers</p>
                <p className="mt-2 text-2xl font-semibold text-emerald-300">23</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Ambulance routes</p>
                <p className="mt-2 text-2xl font-semibold text-cyan-300">3</p>
              </div>
            </div>
          </div>

          <div className="glass-card border border-white/10 bg-slate-950/80 p-6 shadow-[0_0_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.36em] text-slate-400">AI Intelligence Pulse</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Command Center Summary</h2>
              </div>
              <Globe className="h-6 w-6 text-cyan-300" />
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Advanced analytics</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    { label: 'Daily donations', value: '82' },
                    { label: 'Weekly demand', value: '+14%' },
                    { label: 'Response score', value: '94%' },
                    { label: 'AI confidence', value: '91%' },
                  ].map((metric) => (
                    <div key={metric.label} className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{metric.label}</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4 text-slate-300">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Emergency Response Timeline</p>
                <ol className="mt-4 space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                    <span>00:00 – Dispatch activated for O+ donor swarm within Chennai zone.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-300" />
                    <span>00:11 – Rajaji emergency wing received mass-casualty alert.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-red-300" />
                    <span>00:24 – Ambulance AMB-22 paused in traffic; rerouting recommended.</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalPage;
