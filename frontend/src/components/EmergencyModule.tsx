import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, Phone, Mail, Users, Hospital, RotateCcw, Loader } from 'lucide-react';

interface NotificationCounter {
  label: string;
  count: number;
  status: 'success' | 'partial' | 'failed';
  icon: React.ReactNode;
}

interface EmergencyModuleProps {
  onActivityLog?: (entry: any) => void;
}

const EmergencyModule: React.FC<EmergencyModuleProps> = ({ onActivityLog }) => {
  // State management
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [activationError, setActivationError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Notification counters with auto-update
  const [notificationCounters, setNotificationCounters] = useState<NotificationCounter[]>([
    { label: 'Donors Notified', count: 0, status: 'success', icon: <Users className="w-5 h-5" /> },
    { label: 'Hospitals Notified', count: 0, status: 'success', icon: <Hospital className="w-5 h-5" /> },
    { label: 'SMS Alerts', count: 0, status: 'success', icon: <Phone className="w-5 h-5" /> },
    { label: 'Email Alerts', count: 0, status: 'success', icon: <Mail className="w-5 h-5" /> },
  ]);

  // Simulate auto-updating counters
  useEffect(() => {
    if (!emergencyActive) return;

    const updateCounters = () => {
      setNotificationCounters((prev) =>
        prev.map((counter) => {
          const newCount = Math.min(counter.count + Math.floor(Math.random() * 3) + 1, 1000);
          return {
            ...counter,
            count: newCount,
            status: newCount > 80 ? 'success' : newCount > 40 ? 'partial' : 'success',
          };
        })
      );
    };

    const interval = setInterval(updateCounters, 2000);
    return () => clearInterval(interval);
  }, [emergencyActive]);

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Activate emergency workflow
  const handleActivateEmergency = async () => {
    setIsActivating(true);
    setActivationError(null);

    try {
      // Simulate backend API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate notification dispatch
      const simulatedResult = {
        donorsNotified: 342,
        hospitalsNotified: 18,
        smsAlerts: 342,
        emailAlerts: 287,
      };

      // Update counters with initial values
      setNotificationCounters((prev) =>
        prev.map((counter) => {
          if (counter.label === 'Donors Notified') return { ...counter, count: simulatedResult.donorsNotified };
          if (counter.label === 'Hospitals Notified') return { ...counter, count: simulatedResult.hospitalsNotified };
          if (counter.label === 'SMS Alerts') return { ...counter, count: simulatedResult.smsAlerts };
          if (counter.label === 'Email Alerts') return { ...counter, count: simulatedResult.emailAlerts };
          return counter;
        })
      );

      setEmergencyActive(true);
      showToast('🚨 Emergency request activated successfully.', 'success');

      // Log to Recent Activity feed
      if (onActivityLog) {
        onActivityLog({
          icon: '🚨',
          label: 'Emergency Mode Activated',
          timestamp: new Date(),
          status: 'alert',
        });
      }
    } catch (error) {
      setActivationError('Failed to activate emergency. Please try again.');
      showToast('❌ Failed to activate emergency. Please retry.', 'error');
    } finally {
      setIsActivating(false);
    }
  };

  // Retry failed activation
  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await handleActivateEmergency();
    } finally {
      setIsRetrying(false);
    }
  };

  // Deactivate emergency
  const handleDeactivateEmergency = () => {
    setEmergencyActive(false);
    setNotificationCounters((prev) =>
      prev.map((counter) => ({
        ...counter,
        count: 0,
      }))
    );
    showToast('🔄 Emergency mode disabled.', 'success');

    if (onActivityLog) {
      onActivityLog({
        icon: '✓',
        label: 'Emergency Mode Disabled',
        timestamp: new Date(),
        status: 'resolved',
      });
    }
  };

  // Reset to default state
  const handleReset = () => {
    setEmergencyActive(false);
    setActivationError(null);
    setNotificationCounters((prev) =>
      prev.map((counter) => ({
        ...counter,
        count: 0,
        status: 'success',
      }))
    );
    showToast('🔄 Emergency module reset to default.', 'success');
  };

  // Get gradient classes based on status
  const getGradientClasses = (status: 'success' | 'partial' | 'failed') => {
    switch (status) {
      case 'success':
        return {
          gradient: 'from-emerald-300 via-green-400 to-green-700',
          textClass: 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-600',
          badgeClass: 'border-emerald-500/50 bg-emerald-900/30 shadow-lg shadow-emerald-500/30',
          badgeText: 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-600',
          dotColor: 'bg-emerald-500',
        };
      case 'partial':
        return {
          gradient: 'from-amber-300 via-orange-400 to-orange-700',
          textClass: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-600',
          badgeClass: 'border-amber-500/50 bg-amber-900/30 shadow-lg shadow-amber-500/30',
          badgeText: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-600',
          dotColor: 'bg-amber-500',
        };
      case 'failed':
        return {
          gradient: 'from-red-300 via-rose-400 to-red-700',
          textClass: 'text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-red-600',
          badgeClass: 'border-red-500/50 bg-red-900/30 shadow-lg shadow-red-500/40',
          badgeText: 'text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-red-600',
          dotColor: 'bg-red-500',
        };
      default:
        return {
          gradient: 'from-emerald-300 via-green-400 to-green-700',
          textClass: 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-600',
          badgeClass: 'border-emerald-500/50 bg-emerald-900/30 shadow-lg shadow-emerald-500/30',
          badgeText: 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-600',
          dotColor: 'bg-emerald-500',
        };
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Main Emergency Card - Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent p-6"
      >
        {/* Glow effect background */}
        {emergencyActive && (
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(239, 68, 68, 0.1)',
                '0 0 40px rgba(239, 68, 68, 0.2)',
                '0 0 20px rgba(239, 68, 68, 0.1)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
          />
        )}

        {/* Header with status */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              animate={emergencyActive ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertTriangle className={`w-8 h-8 ${emergencyActive ? 'text-red-400' : 'text-amber-400'}`} />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-white">Emergency Control Center</h2>
              <p className="text-sm text-slate-400">Manage emergency response and notifications</p>
            </div>
          </div>

          {/* Status Badge */}
          {emergencyActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                boxShadow: [
                  `0 0 10px 2px rgba(220, 38, 38, 0.3)`,
                  `0 0 20px 4px rgba(220, 38, 38, 0.6)`,
                  `0 0 10px 2px rgba(220, 38, 38, 0.3)`,
                ],
              }}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-full border-2 backdrop-blur-lg transition-all duration-300 ${getGradientClasses('failed').badgeClass}`}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2.5 h-2.5 rounded-full bg-red-500"
              />
              <span className={`text-sm font-black tracking-wider ${getGradientClasses('failed').badgeText}`}>
                🚨 ACTIVE
              </span>
            </motion.div>
          )}
        </div>

        {/* Main Action Button */}
        <div className="relative z-10 mb-6">
          {!emergencyActive && !activationError && (
            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleActivateEmergency}
              disabled={isActivating}
              className={`
                w-full py-4 px-6 rounded-xl font-bold text-white
                relative overflow-hidden group transition-all duration-300
                ${
                  isActivating
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg shadow-amber-500/50 cursor-wait'
                    : 'bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:shadow-2xl hover:shadow-red-500/60 hover:from-red-400 hover:to-red-600'
                }
              `}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
                animate={{ x: isActivating ? ['-100%', '100%'] : '0%' }}
                transition={{ duration: 1.5, repeat: isActivating ? Infinity : 0 }}
              />
              <div className="relative flex items-center justify-center gap-3">
                {isActivating ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span className="text-lg tracking-wider">Sending Emergency Alert...</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-6 h-6" />
                    <span className="text-lg tracking-wider">🚨 Activate Emergency Mode</span>
                  </>
                )}
              </div>
            </motion.button>
          )}

          {emergencyActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <motion.button
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDeactivateEmergency}
                className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-700 hover:shadow-2xl hover:shadow-emerald-500/60 transition-all duration-300 flex items-center justify-center gap-3 text-lg tracking-wider"
              >
                <CheckCircle className="w-6 h-6" />
                <span>✅ Emergency Active</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.01, translateY: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-slate-700/60 to-slate-800/40 hover:from-slate-600/80 hover:to-slate-700/60 border-2 border-slate-600/50 hover:border-slate-500/70 transition-all duration-300 flex items-center justify-center gap-2 tracking-wider"
              >
                <RotateCcw className="w-5 h-5" />
                <span>🔄 Reset</span>
              </motion.button>
            </motion.div>
          )}

          {activationError && (
            <motion.button
              onClick={handleRetry}
              disabled={isRetrying}
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:shadow-2xl hover:shadow-red-500/60 transition-all duration-300 flex items-center justify-center gap-3 text-lg tracking-wider disabled:opacity-60"
            >
              {isRetrying ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Retrying...</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-6 h-6" />
                  <span>❌ Retry Emergency Activation</span>
                </>
              )}
            </motion.button>
          )}
        </div>

        {/* Status Indicators with Gradient Text */}
        {emergencyActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 grid grid-cols-2 gap-4 md:grid-cols-4 mb-6"
          >
            {notificationCounters.map((counter, idx) => {
              const statusGradient = getGradientClasses(counter.status);
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`rounded-xl border-2 backdrop-blur-lg p-5 transition-all duration-300 group hover:scale-105 ${statusGradient.badgeClass}`}
                >
                  <div className="flex items-center gap-2 mb-3 text-slate-300">
                    <motion.div
                      className={`${statusGradient.textClass}`}
                      animate={{
                        scale: [1, 1.1, 1],
                        filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
                      }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      {counter.icon}
                    </motion.div>
                    <p className="text-xs font-bold uppercase tracking-widest">{counter.label}</p>
                  </div>

                  {/* Gradient number with animation */}
                  <motion.div
                    key={`${idx}-${counter.count}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    className={`text-4xl font-black ${statusGradient.textClass} drop-shadow-lg`}
                  >
                    {counter.count}
                  </motion.div>

                  {/* Status indicator with gradient text */}
                  <motion.div
                    className="text-xs mt-3 font-bold uppercase tracking-wider"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {counter.status === 'success' && (
                      <span className={statusGradient.badgeText}>✓ All Sent</span>
                    )}
                    {counter.status === 'partial' && (
                      <span className={statusGradient.badgeText}>⚠ Partial</span>
                    )}
                    {counter.status === 'failed' && (
                      <span className={statusGradient.badgeText}>✗ Failed</span>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Emergency Status Text - Gradient with Pulse */}
        {emergencyActive && (
          <motion.div
            animate={{
              textShadow: [
                '0 0 15px rgba(220, 38, 38, 0.5), 0 0 30px rgba(239, 68, 68, 0.3)',
                '0 0 25px rgba(220, 38, 38, 0.8), 0 0 40px rgba(239, 68, 68, 0.5)',
                '0 0 15px rgba(220, 38, 38, 0.5), 0 0 30px rgba(239, 68, 68, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative z-10 text-center p-5 rounded-xl bg-gradient-to-r from-red-900/20 to-rose-900/20 border-2 border-red-500/30 backdrop-blur-sm"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2">Emergency Status</p>
            <motion.p
              className="text-2xl font-black bg-gradient-to-r from-red-300 via-rose-400 to-red-600 bg-clip-text text-transparent drop-shadow-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              🚨 EMERGENCY ACTIVE
            </motion.p>
            <p className="text-xs text-slate-400 mt-2 font-semibold">
              {new Date().toLocaleTimeString()} • All systems notifying
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Info Cards Grid - Responsive */}
      {emergencyActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {[
            { title: 'Last Activated', value: new Date().toLocaleTimeString(), icon: '⏱️', gradient: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30' },
            { title: 'Active Channels', value: '4 (SMS, Email, Push, Call)', icon: '📡', gradient: 'from-purple-500/20 to-pink-500/20 border-purple-500/30' },
            { title: 'Response Rate', value: '94.2%', icon: '📊', gradient: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-xl border-2 bg-gradient-to-br ${item.gradient} p-5 backdrop-blur-lg transition-all duration-300 hover:scale-105 group`}
            >
              <motion.p
                className="text-3xl mb-2 group-hover:scale-110 transition-transform"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: idx * 0.3 }}
              >
                {item.icon}
              </motion.p>
              <p className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-2">{item.title}</p>
              <p className="text-lg font-bold text-white">{item.value}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className={`
              fixed top-6 right-6 px-7 py-4 rounded-xl font-bold text-white z-50
              backdrop-blur-xl border-2 shadow-2xl
              ${toastType === 'success' 
                ? 'bg-gradient-to-r from-emerald-500/90 to-green-600/90 border-emerald-400/60 shadow-emerald-500/40' 
                : 'bg-gradient-to-r from-red-500/90 to-rose-600/90 border-red-400/60 shadow-red-500/40'}
              flex items-center gap-3
            `}
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {toastType === 'success' ? '✅' : '❌'}
            </motion.span>
            <span className="text-lg tracking-wider">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmergencyModule;
