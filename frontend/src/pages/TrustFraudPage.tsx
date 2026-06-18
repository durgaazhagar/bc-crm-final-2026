import SectionCard from '../components/SectionCard';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

const trustMetrics = [
  { label: 'Platform Trust Score', value: '91%', delta: '+4%', tone: 'emerald' },
  { label: 'Verified Donors', value: '1,842', delta: '+2.1%', tone: 'emerald' },
  { label: 'Verified Hospitals', value: '126', delta: '+1.8%', tone: 'emerald' },
  { label: 'Active Security Checks', value: '312', delta: '+7%', tone: 'amber' },
  { label: 'Fraud Cases Prevented', value: '48', delta: '+12%', tone: 'emerald' },
];

const blockedAccounts = [
  { name: 'Arjun Kumar', type: 'Donor', reason: 'Duplicate Registration', risk: 'High', status: 'Blocked', date: '2026-06-12' },
  { name: 'Apollo Care', type: 'Hospital', reason: 'Fake Phone Number', risk: 'High', status: 'Under Review', date: '2026-06-11' },
  { name: 'Nisha Rao', type: 'Donor', reason: 'Multiple Accounts', risk: 'Medium', status: 'Under Review', date: '2026-06-10' },
  { name: 'Metro Health', type: 'Hospital', reason: 'Suspicious Blood Requests', risk: 'High', status: 'Blocked', date: '2026-06-09' },
  { name: 'Ravi S.', type: 'Donor', reason: 'Invalid Donor Information', risk: 'Medium', status: 'Cleared', date: '2026-06-08' },
];

const detectionItems = [
  { title: 'Duplicate donor accounts', value: '98%', status: 'Live' },
  { title: 'Same phone across multiple accounts', value: '82%', status: 'Live' },
  { title: 'Suspicious emergency requests', value: '75%', status: 'Watch' },
  { title: 'Fake hospital registrations', value: '88%', status: 'Live' },
  { title: 'Unusual donation patterns', value: '67%', status: 'Monitor' },
  { title: 'Multiple login attempts', value: '93%', status: 'Live' },
];

const verificationItems = [
  { title: 'Verified Donors', value: '1,842', icon: '✅', tone: 'emerald' },
  { title: 'Verified Hospitals', value: '126', icon: '🏥', tone: 'emerald' },
  { title: 'Pending Verification Requests', value: '24', icon: '⏳', tone: 'amber' },
  { title: 'Approval Queue', value: '8', icon: '🧾', tone: 'amber' },
];

const recommendations = [
  { title: 'Review Hospital ID #203', label: 'Urgent Review' },
  { title: 'Verify Donor Phone Number', label: 'Verification' },
  { title: 'Investigate Duplicate Registration', label: 'Investigation' },
  { title: 'Approve Verified Donor', label: 'Action' },
];

const blacklistSummary = [
  { label: 'Total Blocked Accounts', value: '321', tone: 'red' },
  { label: 'High Risk Users', value: '74', tone: 'red' },
  { label: 'Recently Blocked', value: '18', tone: 'amber' },
  { label: 'Fraud Trends', value: 'Stable', tone: 'emerald' },
];

// AI Fraud Detection Data
const fraudDetectionModules = [
  {
    id: 'suspicious-activity',
    title: 'Suspicious Activity',
    icon: '🔍',
    status: 'Risk analysis active',
    severity: 'High',
    description: 'Monitoring unusual account behavior patterns',
    detectionCount: 12,
  },
  {
    id: 'duplicate-donors',
    title: 'Duplicate Donor Accounts',
    icon: '👥',
    status: 'Risk analysis active',
    severity: 'High',
    description: 'Cross-referencing donor profiles for duplicates',
    detectionCount: 8,
  },
  {
    id: 'suspicious-registrations',
    title: 'Suspicious Registrations',
    icon: '📝',
    status: 'Risk analysis active',
    severity: 'Medium',
    description: 'Analyzing new registration patterns',
    detectionCount: 5,
  },
  {
    id: 'fake-phones',
    title: 'Fake Phone Numbers',
    icon: '📱',
    status: 'Risk analysis active',
    severity: 'High',
    description: 'Validating phone numbers against known fraudsters',
    detectionCount: 14,
  },
  {
    id: 'unusual-requests',
    title: 'Unusual Hospital Request Patterns',
    icon: '🏥',
    status: 'Risk analysis active',
    severity: 'High',
    description: 'Detecting abnormal blood request volumes',
    detectionCount: 6,
  },
];

const statusClass = (status: string) => {
  switch (status) {
    case 'Blocked':
      return 'bg-red-500/15 text-red-200 border-red-500/20';
    case 'Under Review':
      return 'bg-amber-500/15 text-amber-200 border-amber-500/20';
    case 'Cleared':
      return 'bg-emerald-500/15 text-emerald-200 border-emerald-500/20';
    default:
      return 'bg-slate-700/40 text-slate-200 border-white/10';
  }
};

const toneClass = (tone: string) => {
  switch (tone) {
    case 'emerald':
      return 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20';
    case 'amber':
      return 'bg-amber-500/10 text-amber-200 border-amber-500/20';
    case 'red':
      return 'bg-red-500/10 text-red-200 border-red-500/20';
    default:
      return 'bg-slate-900/50 text-slate-200 border-white/10';
  }
};

// Gradient status classes
const getSeverityGradient = (severity: string) => {
  switch (severity) {
    case 'High':
      return {
        textClass: 'text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-red-400 to-red-700',
        badgeClass: 'border-red-500/50 bg-red-900/30 shadow-lg shadow-red-500/40',
        badgeText: 'text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-red-600',
        dotColor: 'bg-red-500',
        hasAnimation: true,
        icon: '🔴',
      };
    case 'Medium':
      return {
        textClass: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-orange-700',
        badgeClass: 'border-amber-500/50 bg-amber-900/30 shadow-lg shadow-amber-500/30',
        badgeText: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-600',
        dotColor: 'bg-amber-500',
        hasAnimation: false,
        icon: '🟠',
      };
    case 'Low':
      return {
        textClass: 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-400 to-green-700',
        badgeClass: 'border-emerald-500/50 bg-emerald-900/30 shadow-lg shadow-emerald-500/30',
        badgeText: 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-600',
        dotColor: 'bg-emerald-500',
        hasAnimation: false,
        icon: '🟢',
      };
    default:
      return {
        textClass: 'text-slate-300',
        badgeClass: 'border-slate-500/30 bg-slate-900/20',
        badgeText: 'text-slate-300',
        dotColor: 'bg-slate-500',
        hasAnimation: false,
        icon: '⚪',
      };
  }
};

const getStatusGradient = () => {
  return {
    textClass: 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-400 to-green-700',
    badgeClass: 'border-emerald-500/40 bg-emerald-900/20 shadow-lg shadow-emerald-500/20',
    icon: '🟢',
  };
};

// Fraud Detection Card Component
const FraudDetectionCard = ({ module }: { module: typeof fraudDetectionModules[0] }) => {
  const statusGradient = getStatusGradient();
  const severityGradient = getSeverityGradient(module.severity);
  const isHighSeverity = module.severity === 'High';

  return (
    <motion.div
      className={`rounded-2xl border-2 backdrop-blur-xl overflow-hidden group relative ${severityGradient.badgeClass} transition-all duration-300 hover:scale-102`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, translateY: -4 }}
    >
      {/* Animated background gradient for high severity */}
      {isHighSeverity && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      <div className="relative z-10 p-6">
        {/* Header with Icon and Title */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <motion.div
              className="text-4xl p-3 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-700/40 border border-white/10 backdrop-blur-sm"
              animate={isHighSeverity ? {
                scale: [1, 1.1, 1],
                filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
              } : {}}
              transition={isHighSeverity ? { duration: 2.5, repeat: Infinity } : {}}
            >
              {module.icon}
            </motion.div>
            <div>
              <h3 className="text-white font-bold text-lg">{module.title}</h3>
              <p className="text-slate-400 text-sm mt-1">{module.description}</p>
            </div>
          </div>
          <motion.div
            className={`flex flex-col items-end gap-2`}
            animate={isHighSeverity ? {
              boxShadow: [
                `0 0 10px 2px rgba(220, 38, 38, 0.3)`,
                `0 0 20px 4px rgba(220, 38, 38, 0.6)`,
                `0 0 10px 2px rgba(220, 38, 38, 0.3)`,
              ]
            } : {}}
            transition={isHighSeverity ? { duration: 2, repeat: Infinity } : {}}
          >
            <span className="text-xs text-slate-400 font-semibold">Risk Level</span>
          </motion.div>
        </div>

        {/* Status and Severity Row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Status Badge */}
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Status</span>
            <motion.div
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 backdrop-blur-lg ${statusGradient.badgeClass} w-fit`}
              animate={{
                boxShadow: [
                  `0 0 10px 2px rgba(16, 185, 129, 0.2)`,
                  `0 0 15px 3px rgba(16, 185, 129, 0.4)`,
                  `0 0 10px 2px rgba(16, 185, 129, 0.2)`,
                ]
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <motion.div
                className={`w-2 h-2 rounded-full ${statusGradient.icon === '🟢' ? 'bg-emerald-400' : 'bg-slate-400'}`}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <span className={`${statusGradient.textClass} text-xs font-black tracking-wider`}>
                {module.status}
              </span>
            </motion.div>
          </div>

          {/* Severity Badge */}
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Severity</span>
            <motion.div
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 backdrop-blur-lg ${severityGradient.badgeClass} w-fit`}
              animate={isHighSeverity ? {
                boxShadow: [
                  `0 0 10px 2px rgba(220, 38, 38, 0.4)`,
                  `0 0 20px 4px rgba(220, 38, 38, 0.7)`,
                  `0 0 10px 2px rgba(220, 38, 38, 0.4)`,
                ]
              } : {}}
              transition={isHighSeverity ? { duration: 2, repeat: Infinity } : {}}
            >
              <motion.div
                className={`w-2 h-2 rounded-full ${severityGradient.dotColor}`}
                animate={isHighSeverity ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                transition={isHighSeverity ? { duration: 2, repeat: Infinity } : {}}
              />
              <span className={`${severityGradient.textClass} text-xs font-black tracking-wider`}>
                {module.severity.toUpperCase()} {severityGradient.icon}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Detection Count */}
        <motion.div
          className="p-4 rounded-lg bg-slate-900/50 border border-white/10 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-slate-400 font-semibold text-sm">Active Detections</span>
          <motion.span
            className={`${severityGradient.textClass} text-2xl font-black`}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            {module.detectionCount}
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
};

const TrustFraudPage = () => {
  const callsToAction = useMemo(
    () => [
      'Audit emergency request workflow',
      'Run phone verification sweep',
      'Refresh blocked hospital registry',
      'Update AI risk models',
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Trust & Fraud Intelligence Center</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Enterprise security and fraud command center</h1>
            <p className="mt-2 max-w-2xl text-slate-300">Monitor platform trust, investigate blocked accounts, and manage AI fraud detection in one secure operations hub.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {['🛡', '🚫', '✅', '⚠', '🤖', '📊'].slice(0, 4).map((icon) => (
              <div key={icon} className="rounded-3xl border border-white/10 bg-slate-950/40 px-4 py-3 text-center text-sm text-slate-200">
                {icon}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <SectionCard title="🛡 Platform Trust Score" subtitle="Overall fraud resilience" className="xl:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2">
            {trustMetrics.map((metric) => (
              <div key={metric.label} className={`rounded-3xl border ${toneClass(metric.tone)} p-5`}>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">{metric.label}</p>
                <p className="mt-3 text-4xl font-semibold text-white">{metric.value}</p>
                <p className="mt-2 text-sm text-slate-300">Change: {metric.delta}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="📊 Security Health Monitor" subtitle="Live prevention metrics" className="xl:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Security Score', value: '94%' },
              { label: 'Fraud Prevention Rate', value: '89%' },
              { label: 'Verified User %', value: '87%' },
              { label: 'AI Detection Accuracy', value: '91%' },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm uppercase tracking-[0.3em] text-slate-400">{item.label}</div>
                <div className="mt-4 text-3xl font-semibold text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard title="🚫 Fraud Blocked List" subtitle="Flagged accounts and actions" className="xl:col-span-2">
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/5 shadow-inner">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-slate-950/70 text-slate-300">
                <tr>
                  <th className="px-4 py-3 uppercase tracking-[0.28em]">Name</th>
                  <th className="px-4 py-3 uppercase tracking-[0.28em]">Type</th>
                  <th className="px-4 py-3 uppercase tracking-[0.28em]">Reason</th>
                  <th className="px-4 py-3 uppercase tracking-[0.28em]">Risk</th>
                  <th className="px-4 py-3 uppercase tracking-[0.28em]">Status</th>
                  <th className="px-4 py-3 uppercase tracking-[0.28em]">Block Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {blockedAccounts.map((account) => (
                  <tr key={account.name} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4 text-white">{account.name}</td>
                    <td className="px-4 py-4 text-slate-300">{account.type}</td>
                    <td className="px-4 py-4 text-slate-300">{account.reason}</td>
                    <td className="px-4 py-4 text-slate-300">{account.risk}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(account.status)}`}>
                        {account.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-300">{account.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="✅ Verification Center" subtitle="Trust enrollment & approvals">
          <div className="grid gap-4">
            {verificationItems.map((item) => (
              <div key={item.title} className={`rounded-3xl border ${toneClass(item.tone)} p-5`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.title}</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
                  </div>
                  <div className="text-2xl">{item.icon}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard title="🤖 AI Fraud Detection Engine" subtitle="Monitoring suspicious behavior" className="xl:col-span-2">
          <div className="grid gap-3">
            {detectionItems.map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-[0.24em]">{item.title}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
                </div>
                <div className={`rounded-full px-3 py-2 text-xs font-semibold ${item.status === 'Live' ? 'bg-emerald-500/15 text-emerald-200' : item.status === 'Watch' ? 'bg-amber-500/15 text-amber-200' : 'bg-slate-700/40 text-slate-200'}`}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="📊 Blacklist Intelligence" subtitle="Blocked accounts registry">
          <div className="grid gap-4">
            {blacklistSummary.map((item) => (
              <div key={item.label} className={`rounded-3xl border ${toneClass(item.tone)} p-5`}>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* AI Fraud Detection Module - Enhanced with Gradients */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <SectionCard title="⚠️ Advanced Fraud Detection Module" subtitle="Real-time risk analysis with gradient severity indicators">
          <div className="space-y-4">
            <motion.div
              className="p-5 rounded-xl bg-gradient-to-r from-slate-800/40 to-slate-700/30 border-2 border-slate-700/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-slate-300 text-sm leading-relaxed">
                <span className="text-emerald-400 font-bold">✨ New:</span> Double-color gradient indicators for risk status and severity levels.
                High-risk items pulse with animated glow. Green gradients show active monitoring, while red/orange indicates threat severity.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fraudDetectionModules.map((module, idx) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                >
                  <FraudDetectionCard module={module} />
                </motion.div>
              ))}
            </div>
          </div>
        </SectionCard>
      </motion.div>

      <SectionCard title="⚡ AI Recommendations" subtitle="Actions for security operations">
        <div className="grid gap-4 md:grid-cols-2">
          {recommendations.map((item) => (
            <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-white">{item.title}</p>
                <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-200">{item.label}</span>
              </div>
              <p className="mt-3 text-sm text-slate-400">Review and act on priority fraud alerts to keep the platform secure.</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Security Command Center" subtitle="Enterprise-grade fraud operations">
        <div className="grid gap-3 sm:grid-cols-2">
          {callsToAction.map((item) => (
            <div key={item} className="rounded-3xl border border-white/10 bg-slate-950/50 p-5 text-slate-300">
              {item}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default TrustFraudPage;
