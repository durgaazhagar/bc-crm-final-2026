import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  Globe2,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../services/api';
import SharedNavbar from '../components/SharedNavbar';

// Custom Icon Components with 3D styling and gradients
const SmartDonorIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="bloodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#dc2626" />
      </linearGradient>
      <radialGradient id="glowDonor" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ff6b6b" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#ff6b6b" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Glow effect */}
    <circle cx="32" cy="32" r="30" fill="url(#glowDonor)" />
    {/* Blood drop */}
    <path d="M32 10C32 10 22 20 22 28C22 34.627 26.477 40 32 40C37.523 40 42 34.627 42 28C42 20 32 10 32 10Z" fill="url(#bloodGrad)" />
    {/* Magnifying glass */}
    <circle cx="45" cy="45" r="8" fill="none" stroke="#60a5fa" strokeWidth="2" />
    <line x1="51" y1="51" x2="56" y2="56" stroke="#60a5fa" strokeWidth="2" />
    {/* A+ symbol */}
    <text x="32" y="35" fontSize="10" fontWeight="bold" fill="#fbbf24" textAnchor="middle">A+</text>
  </svg>
);

const EmergencyAlertsIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="sirenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="50%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1e40af" />
      </linearGradient>
      <radialGradient id="sirenGlow" cx="50%" cy="30%" r="60%">
        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Light rays */}
    <circle cx="32" cy="32" r="28" fill="url(#sirenGlow)" />
    {/* Siren base */}
    <circle cx="32" cy="38" r="12" fill="url(#sirenGrad)" />
    {/* Light beams */}
    <line x1="32" y1="12" x2="32" y2="6" stroke="#fbbf24" strokeWidth="2" />
    <line x1="48" y1="18" x2="53" y2="13" stroke="#fbbf24" strokeWidth="2" />
    <line x1="16" y1="18" x2="11" y2="13" stroke="#fbbf24" strokeWidth="2" />
  </svg>
);

const AIInsightsIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="robotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
      <radialGradient id="brainGlow" cx="50%" cy="40%" r="40%">
        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Brain glow */}
    <circle cx="32" cy="28" r="14" fill="url(#brainGlow)" />
    {/* Robot head */}
    <rect x="20" y="16" width="24" height="24" rx="4" fill="url(#robotGrad)" />
    {/* Eyes */}
    <circle cx="26" cy="24" r="2" fill="#10b981" />
    <circle cx="38" cy="24" r="2" fill="#10b981" />
    {/* Brain symbol */}
    <circle cx="32" cy="28" r="4" fill="#fbbf24" />
    <circle cx="28" cy="25" r="2" fill="#fbbf24" opacity="0.7" />
    <circle cx="36" cy="25" r="2" fill="#fbbf24" opacity="0.7" />
    {/* Mouth */}
    <path d="M28 36 Q32 38 36 36" stroke="#60a5fa" strokeWidth="1.5" fill="none" />
  </svg>
);

const SecureLoginIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e40af" />
        <stop offset="100%" stopColor="#0c4a6e" />
      </linearGradient>
      <filter id="shieldGlow">
        <feGaussianBlur stdDeviation="2" />
      </filter>
    </defs>
    {/* Shield glow */}
    <path d="M32 12L20 18V32C20 42 32 52 32 52C32 52 44 42 44 32V18L32 12Z" fill="url(#shieldGrad)" filter="url(#shieldGlow)" opacity="0.3" />
    {/* Shield */}
    <path d="M32 12L20 18V32C20 42 32 52 32 52C32 52 44 42 44 32V18L32 12Z" fill="url(#shieldGrad)" stroke="#0ea5e9" strokeWidth="1.5" />
    {/* Checkmark */}
    <path d="M28 35L31 38L39 28" stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {/* Padlock */}
    <circle cx="32" cy="46" r="2" fill="#fbbf24" />
  </svg>
);

const FraudDetectionIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="fraudShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#2dd4bf" />
      </linearGradient>
      <radialGradient id="fraudGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="28" fill="url(#fraudGlow)" />
    <path d="M32 12L20 18V32C20 42 32 52 32 52C32 52 44 42 44 32V18L32 12Z" fill="url(#fraudShieldGrad)" stroke="#e0f2fe" strokeWidth="1.5" />
    <path d="M30 24L34 28M34 24L30 28" stroke="#fde68a" strokeWidth="3" strokeLinecap="round" />
    <circle cx="32" cy="40" r="4" fill="#fde68a" />
    <path d="M48 48L56 56" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" />
    <circle cx="56" cy="56" r="4" fill="#0ea5e9" />
  </svg>
);

const RewardsAchievementsIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="rewardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f43f5e" />
      </linearGradient>
      <radialGradient id="trophyGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fde68a" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="28" fill="url(#trophyGlow)" />
    <path d="M24 24H40V34C40 39.523 35.523 44 30 44H26C20.477 44 16 39.523 16 34V24H24Z" fill="url(#rewardGrad)" />
    <path d="M22 24V18H42V24" stroke="#ffffff" strokeWidth="2" />
    <path d="M30 44V52" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
    <path d="M22 52H38" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
    <path d="M44 28L52 20" stroke="#fef3c7" strokeWidth="3" strokeLinecap="round" />
    <path d="M44 20L52 28" stroke="#fef3c7" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const AnalyticsInsightsIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="analyticsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
      <radialGradient id="robotChartGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#c7d2fe" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="28" fill="url(#robotChartGlow)" />
    <rect x="16" y="32" width="10" height="16" rx="2" fill="#fff" opacity="0.9" />
    <rect x="28" y="26" width="10" height="22" rx="2" fill="#fff" opacity="0.85" />
    <rect x="40" y="20" width="10" height="28" rx="2" fill="#fff" opacity="0.8" />
    <path d="M20 22C20 18.6863 22.6863 16 26 16H38C41.3137 16 44 18.6863 44 22V26H20V22Z" fill="url(#analyticsGrad)" />
    <circle cx="28" cy="20" r="2" fill="#0f172a" />
    <circle cx="36" cy="20" r="2" fill="#0f172a" />
    <path d="M26 22H38" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const featureItems = [
  {
    title: 'Smart Donor Matching',
    description: 'Automatically connect the right donor with critical blood requests in seconds.',
    icon: SmartDonorIcon,
    accent: 'from-pink-500 to-blue-500',
  },
  {
    title: 'Emergency Alerts',
    description: 'Real-time siren alerts with instant notifications to mobilize your network.',
    icon: EmergencyAlertsIcon,
    accent: 'from-red-500 to-orange-500',
  },
  {
    title: 'AI Fraud Detection',
    description: 'Detect suspicious activity instantly with smart validation and fraud alerts.',
    icon: FraudDetectionIcon,
    accent: 'from-violet-500 to-teal-400',
  },
  {
    title: 'Rewards & Achievements',
    description: 'Motivate donors and hospitals with badges, rewards, and milestone recognition.',
    icon: RewardsAchievementsIcon,
    accent: 'from-amber-400 to-rose-500',
  },
  {
    title: 'Secure Login',
    description: 'Bank-grade security with multi-layer protection for your data.',
    icon: SecureLoginIcon,
    accent: 'from-cyan-400 to-blue-500',
  },
  {
    title: 'Analytics & Insights',
    description: 'See performance trends, inventory forecasts, and AI-powered insights.',
    icon: AnalyticsInsightsIcon,
    accent: 'from-sky-500 to-fuchsia-500',
  },
];

const steps = [
  { title: 'Register', description: 'Sign up hospitals, donors and blood banks with a secure profile.' },
  { title: 'Activate', description: 'Use AI to verify compatibility and prioritize urgent needs.' },
  { title: 'Respond', description: 'Notify donors, route blood carriers, and update status in real time.' },
];

const testimonials = [
  {
    quote: 'BloodConnect transformed our emergency response times and donor coordination.',
    name: 'Dr. Priya Menon',
    role: 'Hospital Admin',
  },
  {
    quote: 'The CRM insights helped us retain donors and keep lifesaving stock available.',
    name: 'Rohan Patel',
    role: 'Blood Bank Director',
  },
  {
    quote: 'The AI recommendations are precise and the network visibility is unmatched.',
    name: 'Amina Rahman',
    role: 'Emergency Coordinator',
  },
];

const whyItems = [
  { title: 'Unified Healthcare CRM', description: 'One platform to manage donors, hospitals, emergencies, and outreach.' },
  { title: 'AI + Predictive Insights', description: 'Anticipate demand and optimize blood distribution with advanced analytics.' },
  { title: 'Glass-Safe Operations', description: 'Secure, compliant workflows with transparent collaboration between partners.' },
];

const LandingPage = () => {
  const [stats, setStats] = useState<any | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mapError, setMapError] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const handleExploreClick = (e: any) => {
    e.preventDefault();
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await api.get('/analytics/overview');
        setStats(data);
      } catch {
        setStats(null);
      }
    };
    loadStats();
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, []);

  const handleMapLoad = () => {
    setMapLoading(false);
    setMapError(false);
  };

  const handleMapError = () => {
    setMapLoading(false);
    setMapError(true);
  };

  const statItems = useMemo(
    () => [
      { label: 'Donors connected', value: stats?.totalDonors ?? '34k+' },
      { label: 'Hospitals onboarded', value: stats?.connectedHospitals ?? '1.2k+' },
      { label: 'Blood banks linked', value: stats?.bloodBanks ?? '480+' },
    ],
    [stats],
  );

  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(248,113,113,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),_transparent_28%),linear-gradient(180deg,#02060d_0%,#0f172a_100%)] text-slate-100">
      <SharedNavbar isLoggedIn={false} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.25),transparent_30%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.18),transparent_32%)]" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-6 sm:px-8 lg:px-10">
        <main id="home" className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-cyan-100 ring-1 ring-white/10">
              <Sparkles className="h-4 w-4 text-cyan-200" />
              Premium AI-driven blood network for modern healthcare.
            </div>
            <div className="space-y-6">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                AI-powered blood logistics for every emergency, hospital, and blood bank.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                BloodConnect CRM turns blood donor management into a fast, secure, and connected experience with live network visibility, predictive inventory, and emergency dispatch support.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/app/register"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-red-500 via-red-600 to-slate-900 px-8 py-4 text-base font-semibold text-white shadow-[0_20px_60px_-35px_rgba(239,68,68,0.8)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_-35px_rgba(239,68,68,0.95)]"
              >
                Request Demo
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
              <a
                href="#features"
                onClick={handleExploreClick}
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Explore features
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {statItems.map((item) => (
                <div key={item.label} className="glassmorphism p-5 text-center">
                  <p className="text-3xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl"
          >
            <div className="absolute -left-12 top-8 h-24 w-24 rounded-full bg-red-500/10 blur-2xl" />
            <div className="absolute -right-12 top-20 h-28 w-28 rounded-full bg-cyan-400/10 blur-2xl" />
            <div className="flex flex-col gap-6">
              <div className="rounded-[32px] bg-slate-950/85 p-6 text-slate-100 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
                <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/90">Overview</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-900/80 p-4">
                    <p className="text-3xl font-semibold">98%</p>
                    <p className="mt-2 text-sm text-slate-400">On-time emergency dispatch</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/80 p-4">
                    <p className="text-3xl font-semibold">4.9/5</p>
                    <p className="mt-2 text-sm text-slate-400">User satisfaction score</p>
                  </div>
                </div>
              </div>

              {/* Dashboard Preview Cards */}
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.32em] text-cyan-300 font-semibold">Dashboard Preview</p>
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {/* Donors Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ 
                      y: -4,
                      boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)'
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="group relative rounded-2xl bg-gradient-to-br from-red-600/20 to-rose-600/10 border border-red-500/30 p-5 sm:p-6 overflow-hidden hover:border-red-400/50 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-400/0 group-hover:from-red-500/5 group-hover:to-red-400/5 transition-all duration-300" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs sm:text-sm uppercase tracking-widest text-red-200 font-semibold">Donors</p>
                        <span className="text-2xl">🩸</span>
                      </div>
                      <p className="text-3xl sm:text-4xl font-bold text-white">120</p>
                      <p className="mt-2 text-xs sm:text-sm text-red-300">Active donors</p>
                    </div>
                  </motion.div>

                  {/* Hospitals Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ 
                      y: -4,
                      boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)'
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="group relative rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-600/10 border border-blue-500/30 p-5 sm:p-6 overflow-hidden hover:border-blue-400/50 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-400/0 group-hover:from-blue-500/5 group-hover:to-blue-400/5 transition-all duration-300" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs sm:text-sm uppercase tracking-widest text-blue-200 font-semibold">Hospitals</p>
                        <span className="text-2xl">🏥</span>
                      </div>
                      <p className="text-3xl sm:text-4xl font-bold text-white">15</p>
                      <p className="mt-2 text-xs sm:text-sm text-blue-300">Connected</p>
                    </div>
                  </motion.div>

                  {/* Campaigns Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ 
                      y: -4,
                      boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)'
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="group relative rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/30 p-5 sm:p-6 overflow-hidden hover:border-purple-400/50 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-400/0 group-hover:from-purple-500/5 group-hover:to-purple-400/5 transition-all duration-300" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs sm:text-sm uppercase tracking-widest text-purple-200 font-semibold">Campaigns</p>
                        <span className="text-2xl">🎯</span>
                      </div>
                      <p className="text-3xl sm:text-4xl font-bold text-white">3</p>
                      <p className="mt-2 text-xs sm:text-sm text-purple-300">Active</p>
                    </div>
                  </motion.div>

                  {/* Alerts Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ 
                      y: -4,
                      boxShadow: '0 0 30px rgba(249, 115, 22, 0.3)'
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="group relative rounded-2xl bg-gradient-to-br from-orange-600/20 to-amber-600/10 border border-orange-500/30 p-5 sm:p-6 overflow-hidden hover:border-orange-400/50 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-400/0 group-hover:from-orange-500/5 group-hover:to-orange-400/5 transition-all duration-300" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs sm:text-sm uppercase tracking-widest text-orange-200 font-semibold">Alerts</p>
                        <span className="text-2xl">🚨</span>
                      </div>
                      <p className="text-3xl sm:text-4xl font-bold text-white">5</p>
                      <p className="mt-2 text-xs sm:text-sm text-orange-300">Pending</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>

        <section id="features" className="mt-24 space-y-10">
          <div className="relative rounded-[40px] bg-gradient-to-br from-[#ff7eb3] via-[#8b5cf6] to-[#22d3ee] px-8 py-16 overflow-hidden shadow-[0_24px_80px_-30px_rgba(96,165,250,0.25)]">
            <div className="absolute -top-24 -left-24 h-44 w-44 rounded-full bg-pink-400/25 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-44 w-44 rounded-full bg-teal-300/25 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.12),transparent_20%)]" />
            <div className="relative z-10 mx-auto max-w-3xl space-y-4 text-center">
              <p className="text-sm uppercase tracking-[0.4em] text-white/80 font-semibold">Features</p>
              <h2 className="text-4xl font-bold text-white sm:text-5xl">Discover what makes BloodConnect work faster.</h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-100/90">
                Six modern capabilities designed to speed donor matching, protect your network, and visualize every mission-critical metric.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {featureItems.map(({ title, description, icon: Icon, accent }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group glass-card relative overflow-hidden p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_30px_90px_-30px_rgba(59,130,246,0.35)]"
              >
                <div className="absolute inset-x-6 top-0 h-1/2 rounded-b-[32px] bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative z-10 space-y-6">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className={`inline-flex items-center justify-center rounded-3xl p-5 text-white shadow-lg shadow-slate-950/20 bg-gradient-to-br ${accent} transition-all duration-300`}
                  >
                    <div className="feature-icon relative">
                      <Icon />
                    </div>
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-cyan-200">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300 transition-colors duration-300 group-hover:text-slate-100">{description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="about" className="mt-24 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-100">
              <Bell className="h-4 w-4" />
              How it works
            </span>
            <h2 className="text-4xl font-semibold text-white">From donor registration to emergency fulfillment.</h2>
            <p className="max-w-xl text-base leading-7 text-slate-300">
              Our step-by-step system simplifies coordination between donors, blood banks and hospitals so urgent needs are met faster.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.title} className="glassmorphism p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-850 text-white">{index + 1}</div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-slate-950/80 p-6 shadow-glass">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(248,113,113,0.18),transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),transparent_26%)]" />
            <div className="relative space-y-6">
              <div className="glassmorphism p-6">
                <p className="text-sm uppercase tracking-[0.32em] text-cyan-400">Emergency Network</p>
                <h3 className="mt-4 text-3xl font-semibold text-white">Emergency Network</h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Quickly locate and respond to urgent blood requests.</p>
              </div>
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                <div className="h-[260px] md:h-[400px] w-full overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-900/50 to-slate-800/50 flex items-center justify-center">
                  <iframe
                    title="Hospitals near Chennai - OpenStreetMap"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=80.1,12.9,80.3,13.1&layer=mapnik&marker=13.0827,80.2707"
                    width="100%"
                    height="400"
                    style={{ border: 'none', borderRadius: 12 }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="grid gap-3 sm:grid-cols-2 flex-1">
                  <div className="glassmorphism p-5">
                    <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Live alerts</p>
                    <p className="mt-3 text-xl font-semibold text-white">216 urgent cases</p>
                  </div>
                  <div className="glassmorphism p-5">
                    <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Network reach</p>
                    <p className="mt-3 text-xl font-semibold text-white">92 cities</p>
                  </div>
                </div>
                <a
                  href="https://www.google.com/maps/search/Hospitals+near+Chennai"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-red-500 via-red-600 to-blue-500 px-6 py-3 text-base font-semibold text-white shadow-[0_20px_50px_-30px_rgba(59,130,246,0.75)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(59,130,246,0.55)]"
                >
                  View Map
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24 space-y-10">
          <div className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-cyan-200">Testimonials</p>
            <h2 className="text-4xl font-semibold text-white">Trusted by healthcare leaders.</h2>
          </div>
          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-8 shadow-glass">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 text-center"
              >
                <p className="mx-auto max-w-3xl text-xl leading-8 text-slate-200">“{testimonials[activeTestimonial].quote}”</p>
                <div className="mt-4">
                  <p className="text-lg font-semibold text-white">{testimonials[activeTestimonial].name}</p>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{testimonials[activeTestimonial].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="mt-8 flex items-center justify-center gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-3 w-3 rounded-full transition ${
                    activeTestimonial === index ? 'bg-cyan-300' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-24 space-y-10" id="contact">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.4em] text-cyan-200">Why BloodConnect</p>
              <h2 className="text-4xl font-semibold text-white">Your premium blood CRM for mission-critical outcomes.</h2>
              <p className="max-w-xl text-base leading-7 text-slate-300">
                BloodConnect blends deep healthcare intelligence with elegant coordination tools so teams can act fast, stay compliant, and save more lives.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {whyItems.map((item) => (
                <div key={item.title} className="glassmorphism p-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-blue-500/10 text-blue-300">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[36px] border border-white/10 bg-gradient-to-r from-red-600/15 via-white/10 to-blue-500/15 p-1 shadow-glass">
            <div className="glassmorphism flex flex-col gap-6 p-10 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-cyan-200">Ready to upgrade healthcare response?</p>
                <h3 className="mt-4 text-3xl font-semibold text-white">Launch your BloodConnect network today.</h3>
              </div>
              <Link
                to="/app/register"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-red-500 via-red-600 to-blue-500 px-8 py-4 text-base font-semibold text-white shadow-[0_18px_60px_-30px_rgba(59,130,246,0.75)] transition hover:-translate-y-0.5"
              >
                Get started now
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-24 space-y-10">
          <div className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-cyan-200 font-semibold">Get in Touch</p>
            <h2 className="text-4xl font-bold text-white">Contact BloodConnect</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-300">
              Have questions? We're here to help. Reach out anytime and we'll respond within 12 hours.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Email Card */}
            <motion.a
              href="mailto:support@bloodconnect.ai"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ 
                y: -4,
                boxShadow: '0 0 30px rgba(236, 72, 153, 0.3)'
              }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group relative rounded-2xl bg-gradient-to-br from-pink-600/20 to-rose-600/10 border border-pink-500/30 p-6 overflow-hidden hover:border-pink-400/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-pink-400/0 group-hover:from-pink-500/5 group-hover:to-pink-400/5 transition-all duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">📧</span>
                  <motion.div
                    animate={{ 
                      boxShadow: ['0 0 0px rgba(236, 72, 153, 0)', '0 0 20px rgba(236, 72, 153, 0.3)']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="rounded-full w-2 h-2 bg-pink-400"
                  />
                </div>
                <p className="text-sm uppercase tracking-widest text-pink-200 font-semibold mb-2">Email</p>
                <p className="text-lg font-bold text-white hover:text-pink-200 transition-colors">support@bloodconnect.ai</p>
                <p className="mt-3 text-xs text-pink-300">Click to send email</p>
              </div>
            </motion.a>

            {/* Phone Card */}
            <motion.a
              href="tel:+918072971296"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ 
                y: -4,
                boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)'
              }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group relative rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-600/10 border border-blue-500/30 p-6 overflow-hidden hover:border-blue-400/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-400/0 group-hover:from-blue-500/5 group-hover:to-blue-400/5 transition-all duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">📞</span>
                  <motion.div
                    animate={{ 
                      boxShadow: ['0 0 0px rgba(59, 130, 246, 0)', '0 0 20px rgba(59, 130, 246, 0.3)']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="rounded-full w-2 h-2 bg-blue-400"
                  />
                </div>
                <p className="text-sm uppercase tracking-widest text-blue-200 font-semibold mb-2">Phone</p>
                <p className="text-lg font-bold text-white hover:text-blue-200 transition-colors">+91 8072971296</p>
                <p className="mt-3 text-xs text-blue-300">Click to call</p>
              </div>
            </motion.a>

            {/* Address Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ 
                y: -4,
                boxShadow: '0 0 30px rgba(34, 197, 255, 0.3)'
              }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group relative rounded-2xl bg-gradient-to-br from-cyan-600/20 to-teal-600/10 border border-cyan-500/30 p-6 overflow-hidden hover:border-cyan-400/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-400/0 group-hover:from-cyan-500/5 group-hover:to-cyan-400/5 transition-all duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">📍</span>
                  <motion.div
                    animate={{ 
                      boxShadow: ['0 0 0px rgba(34, 197, 255, 0)', '0 0 20px rgba(34, 197, 255, 0.3)']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="rounded-full w-2 h-2 bg-cyan-400"
                  />
                </div>
                <p className="text-sm uppercase tracking-widest text-cyan-200 font-semibold mb-2">Address</p>
                <p className="text-lg font-bold text-white">SKP Engineering College</p>
                <p className="mt-2 text-sm text-cyan-300">Tiruvannamalai</p>
              </div>
            </motion.div>

            {/* Response Time Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ 
                y: -4,
                boxShadow: '0 0 30px rgba(251, 191, 36, 0.3)'
              }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group relative rounded-2xl bg-gradient-to-br from-amber-600/20 to-yellow-600/10 border border-amber-500/30 p-6 overflow-hidden hover:border-amber-400/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-400/0 group-hover:from-amber-500/5 group-hover:to-amber-400/5 transition-all duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">⏱</span>
                  <motion.div
                    animate={{ 
                      boxShadow: ['0 0 0px rgba(251, 191, 36, 0)', '0 0 20px rgba(251, 191, 36, 0.3)']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="rounded-full w-2 h-2 bg-amber-400"
                  />
                </div>
                <p className="text-sm uppercase tracking-widest text-amber-200 font-semibold mb-2">Response Time</p>
                <p className="text-lg font-bold text-white">Within 12 hours</p>
                <p className="mt-3 text-xs text-amber-300">Mon-Sun availability</p>
              </div>
            </motion.div>
          </div>
        </section>

        <footer className="mt-24 border-t border-white/10 pt-10 pb-6 text-slate-400">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-lg font-semibold text-white">BloodConnect</p>
              <p className="mt-3 max-w-md text-sm text-slate-400">A premium CRM built for blood network operations, emergency logistics, and secure collaboration.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <a href="#features" className="transition hover:text-white">Features</a>
              <a href="#about" className="transition hover:text-white">How it works</a>
              <a href="#contact" className="transition hover:text-white">Contact</a>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row">
            <p>© 2026 BloodConnect. All rights reserved.</p>
            <div className="flex items-center gap-4 text-slate-300">
              <a href="#" className="transition hover:text-white">LinkedIn</a>
              <a href="#" className="transition hover:text-white">Twitter</a>
              <a href="#" className="transition hover:text-white">Github</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
