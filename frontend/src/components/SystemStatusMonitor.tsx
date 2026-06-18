import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertCircle, CheckCircle, Zap, Server, Wifi, Clock, BarChart3 } from 'lucide-react';

interface StatusMetric {
  id: string;
  label: string;
  status: 'operational' | 'degraded' | 'critical' | 'healthy' | 'online' | 'down';
  value?: string | number;
  icon: React.ReactNode;
  lastUpdated?: string;
}

interface SystemStatusMonitorProps {
  metrics?: StatusMetric[];
  title?: string;
  showAnimation?: boolean;
  variant?: 'compact' | 'detailed' | 'grid';
}

const getGradientClasses = (status: string) => {
  switch (status) {
    case 'operational':
    case 'healthy':
    case 'online':
      return {
        gradient: 'from-emerald-300 via-green-400 to-green-700',
        gradientSecondary: 'from-emerald-400 to-green-600',
        glowColor: 'emerald',
        textClass: 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-400 to-green-700 drop-shadow-lg',
        statusText: 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-green-600 font-bold',
        boxGlow: 'shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/70 border-emerald-500/30',
        badgeGlow: 'border-emerald-400/60 bg-emerald-900/20 shadow-lg shadow-emerald-500/30',
      };
    case 'degraded':
      return {
        gradient: 'from-amber-300 via-orange-400 to-orange-700',
        gradientSecondary: 'from-amber-400 to-orange-600',
        glowColor: 'amber',
        textClass: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-orange-700 drop-shadow-lg',
        statusText: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-600 font-bold',
        boxGlow: 'shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/70 border-amber-500/30 animate-pulse',
        badgeGlow: 'border-amber-400/60 bg-amber-900/20 shadow-lg shadow-amber-500/40 animate-pulse',
      };
    case 'critical':
    case 'down':
      return {
        gradient: 'from-rose-300 via-red-400 to-red-700',
        gradientSecondary: 'from-rose-400 to-red-600',
        glowColor: 'red',
        textClass: 'text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-red-400 to-red-700 drop-shadow-lg',
        statusText: 'text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-red-600 font-bold',
        boxGlow: 'shadow-2xl shadow-red-500/50 hover:shadow-red-500/80 border-red-500/30 animate-pulse',
        badgeGlow: 'border-red-400/60 bg-red-900/20 shadow-lg shadow-red-500/50 animate-pulse',
      };
    default:
      return {
        gradient: 'from-slate-300 via-slate-400 to-slate-700',
        gradientSecondary: 'from-slate-400 to-slate-600',
        glowColor: 'slate',
        textClass: 'text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-700 drop-shadow-lg',
        statusText: 'text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-600 font-bold',
        boxGlow: 'shadow-lg shadow-slate-500/20 border-slate-500/20',
        badgeGlow: 'border-slate-400/40 bg-slate-900/10 shadow-lg shadow-slate-500/20',
      };
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'operational':
    case 'healthy':
    case 'online':
      return <CheckCircle className="w-5 h-5" />;
    case 'degraded':
      return <AlertCircle className="w-5 h-5" />;
    case 'critical':
    case 'down':
      return <AlertCircle className="w-5 h-5" />;
    default:
      return <Activity className="w-5 h-5" />;
  }
};

const GradientText = ({ children, status }: { children: React.ReactNode; status: string }) => {
  const classes = getGradientClasses(status);
  const isAnimated = status === 'degraded' || status === 'critical' || status === 'down';

  return (
    <motion.span
      className={`${classes.textClass} font-black text-lg transition-all duration-300`}
      animate={isAnimated ? { 
        opacity: [1, 0.85, 1],
        filter: ['brightness(1)', 'brightness(1.1)', 'brightness(1)']
      } : {}}
      transition={isAnimated ? { duration: 2.5, repeat: Infinity } : {}}
    >
      {children}
    </motion.span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const classes = getGradientClasses(status);
  const isAnimated = status === 'degraded' || status === 'critical' || status === 'down';

  return (
    <motion.div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 backdrop-blur-lg ${classes.badgeGlow} transition-all duration-300`}
      animate={isAnimated ? { 
        boxShadow: [
          `0 0 10px 2px rgba(${
            status === 'degraded'
              ? '217, 119, 6' // amber-700 rgb
              : '220, 38, 38' // red-700 rgb
          }, 0.3)`,
          `0 0 20px 4px rgba(${
            status === 'degraded'
              ? '217, 119, 6'
              : '220, 38, 38'
          }, 0.6)`,
          `0 0 10px 2px rgba(${
            status === 'degraded'
              ? '217, 119, 6'
              : '220, 38, 38'
          }, 0.3)`,
        ]
      } : {}}
      transition={isAnimated ? { duration: 2, repeat: Infinity } : {}}
    >
      {/* Animated dot indicator */}
      <motion.div
        className={`w-2 h-2 rounded-full ${
          status === 'operational' || status === 'healthy' || status === 'online'
            ? 'bg-emerald-400'
            : status === 'degraded'
            ? 'bg-amber-400'
            : 'bg-red-400'
        }`}
        animate={isAnimated ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={isAnimated ? { duration: 2, repeat: Infinity } : {}}
      />
      <span className={`${classes.statusText} text-xs tracking-wider`}>
        {status.toUpperCase()}
      </span>
    </motion.div>
  );
};

const CompactMetric = ({ metric }: { metric: StatusMetric }) => {
  const classes = getGradientClasses(metric.status);
  const isAnimated = metric.status === 'degraded' || metric.status === 'critical' || metric.status === 'down';

  return (
    <motion.div
      className={`p-5 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-xl border-2 ${classes.boxGlow} transition-all duration-300 relative overflow-hidden group`}
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {isAnimated && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${classes.gradient} opacity-0 rounded-2xl`}
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <motion.div
            className={`${classes.textClass}`}
            animate={isAnimated ? {
              scale: [1, 1.1, 1],
              filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
            } : {}}
            transition={isAnimated ? { duration: 2.5, repeat: Infinity } : {}}
          >
            {metric.icon}
          </motion.div>
          <StatusBadge status={metric.status} />
        </div>
        <p className="text-slate-300 text-sm font-semibold mb-2">{metric.label}</p>
        {metric.value && (
          <motion.div
            className={`${classes.textClass} text-2xl font-black`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {metric.value}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const DetailedMetric = ({ metric }: { metric: StatusMetric }) => {
  const classes = getGradientClasses(metric.status);
  const isAnimated = metric.status === 'degraded' || metric.status === 'critical' || metric.status === 'down';

  return (
    <motion.div
      className={`p-6 rounded-2xl bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-xl border-2 ${classes.boxGlow} transition-all duration-300 overflow-hidden relative group`}
      whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.3)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Animated gradient background for degraded/critical */}
      {isAnimated && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${classes.gradient} opacity-0 rounded-2xl`}
          animate={{ opacity: [0, 0.08, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className={`p-3 rounded-lg bg-gradient-to-br ${classes.gradientSecondary} backdrop-blur-sm text-white/90`}
              whileHover={{ scale: 1.1 }}
              animate={isAnimated ? { 
                scale: [1, 1.05, 1],
                filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
              } : {}}
              transition={isAnimated ? { duration: 2.5, repeat: Infinity } : {}}
            >
              {metric.icon}
            </motion.div>
            <div>
              <h3 className="text-white font-bold text-lg">{metric.label}</h3>
              {metric.lastUpdated && (
                <p className="text-slate-400 text-xs mt-1">{metric.lastUpdated}</p>
              )}
            </div>
          </div>
          <StatusBadge status={metric.status} />
        </div>

        {metric.value && (
          <motion.div
            className={`${classes.textClass} text-4xl font-black mb-4 line-clamp-2`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {metric.value}
          </motion.div>
        )}

        {/* Animated gradient bar */}
        <div className="h-1.5 bg-slate-700/40 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${classes.gradient} shadow-lg`}
            style={{
              boxShadow: `0 0 20px ${
                metric.status === 'operational' || metric.status === 'healthy' || metric.status === 'online'
                  ? 'rgba(16, 185, 129, 0.5)'
                  : metric.status === 'degraded'
                  ? 'rgba(217, 119, 6, 0.5)'
                  : 'rgba(220, 38, 38, 0.5)'
              }`
            }}
            animate={{ width: ['0%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
};


const GridMetric = ({ metric }: { metric: StatusMetric }) => {
  const classes = getGradientClasses(metric.status);
  const isAnimated = metric.status === 'degraded' || metric.status === 'critical' || metric.status === 'down';

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-xl border-2 p-6 ${classes.boxGlow} transition-all duration-300 group`}
      whileHover={{ scale: 1.05 }}
    >
      {/* Animated background gradient */}
      {isAnimated && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${classes.gradient} opacity-0 rounded-2xl`}
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className={`${classes.textClass}`}
            animate={isAnimated ? {
              scale: [1, 1.1, 1],
              filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
            } : {}}
            transition={isAnimated ? { duration: 2.5, repeat: Infinity } : {}}
          >
            {metric.icon}
          </motion.div>
          <StatusBadge status={metric.status} />
        </div>

        <p className="text-slate-300 text-sm font-semibold truncate mb-3">{metric.label}</p>

        {metric.value && (
          <motion.div
            className={`${classes.textClass} text-3xl font-black break-all`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {metric.value}
          </motion.div>
        )}

        {/* Glow line at bottom for active metrics */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${classes.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          animate={isAnimated ? { opacity: [0.5, 1, 0.5] } : {}}
          transition={isAnimated ? { duration: 2, repeat: Infinity } : {}}
        />
      </div>
    </motion.div>
  );
};

const SystemStatusMonitor: React.FC<SystemStatusMonitorProps> = ({
  metrics,
  title = 'System Status Monitor',
  showAnimation = true,
  variant = 'detailed',
}) => {
  const [activeMetrics, setActiveMetrics] = useState<StatusMetric[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const defaultMetrics: StatusMetric[] = [
    {
      id: 'database',
      label: 'Database Connection',
      status: 'online',
      value: '✓ Connected',
      icon: <Server className="w-5 h-5" />,
      lastUpdated: 'Updated 1m ago',
    },
    {
      id: 'api',
      label: 'API Gateway',
      status: 'operational',
      value: '< 150ms',
      icon: <Zap className="w-5 h-5" />,
      lastUpdated: 'Updated now',
    },
    {
      id: 'network',
      label: 'Network Latency',
      status: 'degraded',
      value: '342ms',
      icon: <Wifi className="w-5 h-5" />,
      lastUpdated: 'Updated 2m ago',
    },
    {
      id: 'cache',
      label: 'Cache Server',
      status: 'healthy',
      value: '98.5% Hit Rate',
      icon: <Clock className="w-5 h-5" />,
      lastUpdated: 'Updated now',
    },
    {
      id: 'analytics',
      label: 'Analytics Engine',
      status: 'operational',
      value: '12.4K Queries/min',
      icon: <BarChart3 className="w-5 h-5" />,
      lastUpdated: 'Updated 30s ago',
    },
    {
      id: 'ai',
      label: 'AI Processing',
      status: 'healthy',
      value: '99.2% Accuracy',
      icon: <Activity className="w-5 h-5" />,
      lastUpdated: 'Updated now',
    },
  ];

  useEffect(() => {
    setActiveMetrics(metrics || defaultMetrics);
    setLastUpdate(new Date().toLocaleTimeString());
  }, [metrics]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <motion.h2
            className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 mb-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {title}
          </motion.h2>
          <motion.p
            className="text-slate-400 text-sm font-semibold"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Last update: {lastUpdate}
          </motion.p>
        </div>
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-600 drop-shadow-lg"
        >
          <Activity className="w-8 h-8" />
        </motion.div>
      </motion.div>

      {/* Status Overview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {[
          { 
            label: 'Operational Services', 
            count: activeMetrics.filter(m => m.status === 'operational' || m.status === 'healthy' || m.status === 'online').length,
            gradient: 'from-emerald-500/40 to-green-600/30',
            border: 'border-emerald-500/40',
            textGradient: 'from-emerald-300 to-green-600'
          },
          { 
            label: 'Degraded Services', 
            count: activeMetrics.filter(m => m.status === 'degraded').length,
            gradient: 'from-amber-500/40 to-orange-600/30',
            border: 'border-amber-500/40',
            textGradient: 'from-amber-300 to-orange-600'
          },
          { 
            label: 'Critical Services', 
            count: activeMetrics.filter(m => m.status === 'critical' || m.status === 'down').length,
            gradient: 'from-red-500/40 to-rose-600/30',
            border: 'border-red-500/40',
            textGradient: 'from-red-300 to-rose-600'
          },
        ].map((overview, idx) => (
          <motion.div
            key={idx}
            className={`p-6 rounded-2xl bg-gradient-to-br ${overview.gradient} backdrop-blur-xl border-2 ${overview.border} shadow-lg transition-all duration-300`}
            whileHover={{ scale: 1.03, borderColor: 'rgba(255,255,255,0.5)' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <p className="text-slate-300 text-sm font-bold mb-3 uppercase tracking-wider">{overview.label}</p>
            <div className="flex items-baseline gap-2">
              <motion.p
                className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${overview.textGradient}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                {overview.count}
              </motion.p>
              <span className="text-xl text-slate-400 font-bold">/ {activeMetrics.length}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        className={
          variant === 'compact'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : variant === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, staggerChildren: 0.1 }}
      >
        {activeMetrics.map((metric, idx) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            {variant === 'compact' && <CompactMetric metric={metric} />}
            {variant === 'detailed' && <DetailedMetric metric={metric} />}
            {variant === 'grid' && <GridMetric metric={metric} />}
          </motion.div>
        ))}
      </motion.div>

      {/* Footer Info */}
      <motion.div
        className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-xl border-2 border-slate-700/50 flex items-center justify-between text-sm font-semibold shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.span
          className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600 flex items-center gap-2"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.span
            className="w-2.5 h-2.5 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          All systems operational
        </motion.span>
        <span className="text-slate-400">⟳ Refresh rate: 30 seconds</span>
      </motion.div>
    </div>
  );
};

export default SystemStatusMonitor;
