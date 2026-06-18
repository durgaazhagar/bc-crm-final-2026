import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SystemStatusMonitor from '../components/SystemStatusMonitor';
import { Activity, AlertCircle, CheckCircle, Zap, Server, Wifi, Clock, BarChart3, Gauge, Cloud, Database } from 'lucide-react';

interface SystemMetric {
  id: string;
  label: string;
  status: 'operational' | 'degraded' | 'critical' | 'healthy' | 'online' | 'down';
  value?: string | number;
  icon: React.ReactNode;
  lastUpdated?: string;
  details?: string;
}

const SystemStatusPage: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [viewMode, setViewMode] = useState<'detailed' | 'compact' | 'grid'>('detailed');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const bloodBankMetrics: SystemMetric[] = [
    {
      id: 'donor-db',
      label: 'Donor Database',
      status: 'online',
      value: '✓ Connected',
      icon: <Database className="w-5 h-5" />,
      lastUpdated: 'Updated 1m ago',
      details: '12,450 donor records synced',
    },
    {
      id: 'blood-inventory',
      label: 'Blood Inventory System',
      status: 'operational',
      value: 'A+: 125 | O-: 89 | AB+: 45',
      icon: <Server className="w-5 h-5" />,
      lastUpdated: 'Updated now',
      details: 'Real-time inventory tracking',
    },
    {
      id: 'emergency-network',
      label: 'Emergency Response Network',
      status: 'degraded',
      value: '342ms latency',
      icon: <AlertCircle className="w-5 h-5" />,
      lastUpdated: 'Updated 2m ago',
      details: '8 hospitals connected, 2 slow connections',
    },
    {
      id: 'ai-matching',
      label: 'AI Donor Matching Engine',
      status: 'healthy',
      value: '99.2% Accuracy',
      icon: <Zap className="w-5 h-5" />,
      lastUpdated: 'Updated now',
      details: '42 active matches in progress',
    },
    {
      id: 'api-gateway',
      label: 'API Gateway',
      status: 'operational',
      value: '< 120ms Response',
      icon: <Clock className="w-5 h-5" />,
      lastUpdated: 'Updated 30s ago',
      details: '1,250 requests/min processed',
    },
    {
      id: 'notification-service',
      label: 'Notification Service',
      status: 'healthy',
      value: '98.7% Delivery Rate',
      icon: <Activity className="w-5 h-5" />,
      lastUpdated: 'Updated now',
      details: '3,421 SMS sent, 512 emails queued',
    },
    {
      id: 'cache-server',
      label: 'Cache & Memory Layer',
      status: 'online',
      value: '94.2% Hit Rate',
      icon: <Gauge className="w-5 h-5" />,
      lastUpdated: 'Updated now',
      details: 'Redis cluster: 8.5GB / 16GB used',
    },
    {
      id: 'cloud-storage',
      label: 'Cloud Storage & Backup',
      status: 'operational',
      value: '847.3 GB / 1 TB',
      icon: <Cloud className="w-5 h-5" />,
      lastUpdated: 'Updated 5m ago',
      details: 'Last backup: 2 hours ago',
    },
    {
      id: 'network-latency',
      label: 'Network Latency',
      status: 'healthy',
      value: '28ms Avg',
      icon: <Wifi className="w-5 h-5" />,
      lastUpdated: 'Updated now',
      details: 'Packet loss: 0.02%',
    },
    {
      id: 'analytics-engine',
      label: 'Analytics & Reporting',
      status: 'operational',
      value: '14.2K Queries/min',
      icon: <BarChart3 className="w-5 h-5" />,
      lastUpdated: 'Updated 1m ago',
      details: 'Processing 8 concurrent reports',
    },
  ];

  useEffect(() => {
    setMetrics(bloodBankMetrics);

    // Simulate auto-refresh
    if (autoRefresh) {
      const interval = setInterval(() => {
        setMetrics(prev =>
          prev.map(m => ({
            ...m,
            lastUpdated: 'Updated now',
            // Randomly simulate status changes for demo
            status:
              Math.random() > 0.95
                ? m.status === 'operational'
                  ? 'degraded'
                  : 'operational'
                : m.status,
          }))
        );
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 p-6 md:p-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Page Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <motion.h1
                className="text-5xl md:text-6xl font-black mb-3"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <span className="text-white">System </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-400 to-green-700 drop-shadow-lg">Status</span>
                <span className="text-white"> Monitor</span>
              </motion.h1>
              <motion.p
                className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Blood Bank CRM Infrastructure Health Dashboard
              </motion.p>
            </div>
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.15, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-600 drop-shadow-lg"
            >
              <Activity className="w-10 h-10" />
            </motion.div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-2 bg-gradient-to-r from-slate-800/60 to-slate-700/40 backdrop-blur-xl rounded-xl p-1.5 border-2 border-slate-700/50 shadow-lg">
              {(['detailed', 'compact', 'grid'] as const).map(mode => (
                <motion.button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${
                    viewMode === mode
                      ? 'bg-gradient-to-r from-emerald-500/40 to-green-600/30 text-emerald-300 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/30'
                      : 'text-slate-300 hover:text-white border-2 border-transparent hover:border-slate-600/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </motion.button>
              ))}
            </div>

            <label className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-slate-800/60 to-slate-700/40 backdrop-blur-xl rounded-xl border-2 border-slate-700/50 cursor-pointer hover:border-slate-600/70 transition-all shadow-lg group">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={e => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer accent-emerald-500"
              />
              <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">Auto-refresh (30s)</span>
            </label>
          </div>
        </motion.div>

        {/* Main Status Monitor Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SystemStatusMonitor
            metrics={metrics}
            title="Infrastructure Health"
            variant={viewMode}
            showAnimation={true}
          />
        </motion.div>

        {/* Emergency Status Alert */}
        <motion.div
          className="mt-10 p-7 rounded-2xl bg-gradient-to-br from-orange-900/30 via-amber-900/20 to-orange-900/30 border-2 border-orange-500/40 backdrop-blur-xl shadow-2xl shadow-orange-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-start gap-4">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-600 flex-shrink-0"
            >
              <AlertCircle className="w-6 h-6" />
            </motion.div>
            <div className="flex-1">
              <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-600 font-black text-lg mb-2">
                ⚠️ Emergency Network Latency Detected
              </h3>
              <p className="text-amber-100/90 text-sm mb-4 leading-relaxed">
                Network latency to Central Hospital increased to <span className="font-bold text-orange-300">342ms</span>. 
                This may impact emergency response times. <strong className="text-orange-300">Investigating connection degradation.</strong>
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500/40 to-amber-600/40 hover:from-orange-500/60 hover:to-amber-600/60 text-orange-300 font-bold rounded-lg text-sm border-2 border-orange-500/40 transition-all shadow-lg"
                >
                  View Details
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-slate-600/20 hover:bg-slate-600/40 text-slate-300 font-semibold rounded-lg text-sm border-2 border-slate-600/40 transition-all"
                >
                  Dismiss
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metrics Legend */}
        <motion.div
          className="mt-10 p-8 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-xl border-2 border-slate-700/50 shadow-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.h3
            className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            ✨ Gradient Status Indicators
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                status: 'Operational',
                gradient: 'from-emerald-300 via-green-400 to-green-700',
                textGradient: 'from-emerald-300 to-green-700',
                description: 'All systems online',
                badge: '🟢 HEALTHY',
              },
              {
                status: 'Operational',
                gradient: 'from-emerald-300 via-green-400 to-green-700',
                textGradient: 'from-emerald-300 to-green-700',
                description: 'Full functionality',
                badge: '🟢 ONLINE',
              },
              {
                status: 'Degraded',
                gradient: 'from-amber-300 via-orange-400 to-orange-700',
                textGradient: 'from-amber-300 to-orange-700',
                description: 'Reduced performance',
                badge: '🟠 DEGRADED',
                hasAnimation: true,
              },
              {
                status: 'Critical',
                gradient: 'from-rose-300 via-red-400 to-red-700',
                textGradient: 'from-rose-300 to-red-700',
                description: 'Service disrupted',
                badge: '🔴 CRITICAL',
                hasAnimation: true,
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className={`p-5 rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border-2 ${
                  item.hasAnimation
                    ? `border-${item.status === 'Critical' ? 'red' : 'amber'}-500/40 shadow-lg shadow-${item.status === 'Critical' ? 'red' : 'amber'}-500/30 animate-pulse`
                    : 'border-slate-700/50'
                } backdrop-blur-sm transition-all duration-300 hover:scale-105`}
                whileHover={{ translateY: -4 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className={`h-3 rounded-full bg-gradient-to-r ${item.gradient} mb-4 shadow-lg`}/>
                <p className={`text-transparent bg-clip-text bg-gradient-to-r ${item.textGradient} text-xl font-black mb-2`}>
                  {item.badge}
                </p>
                <p className="text-white text-sm font-semibold">{item.status}</p>
                <p className="text-slate-400 text-xs mt-1">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Feature Description */}
          <motion.div
            className="mt-8 p-6 rounded-lg bg-slate-800/40 border border-slate-700/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h4 className="text-white font-bold mb-3">Features:</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>✨ <span className="text-emerald-400 font-semibold">Double-color gradient typography</span> - Light to dark transitions</li>
              <li>🌟 <span className="text-amber-400 font-semibold">Subtle pulse animations</span> - For degraded/critical states</li>
              <li>💫 <span className="text-rose-400 font-semibold">Enhanced glow effects</span> - Bold shadows and highlights</li>
              <li>🎯 <span className="text-slate-300 font-semibold">Dark background optimization</span> - Maximum readability</li>
              <li>⚡ <span className="text-green-400 font-semibold">Smooth animations</span> - Professional motion design</li>
            </ul>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SystemStatusPage;
