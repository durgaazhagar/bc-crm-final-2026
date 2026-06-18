import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Zap, Shield, BarChart3, Globe, Users } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const FeaturesPage = () => {
  const features = [
    {
      id: 'donor-management',
      icon: <Heart className="w-8 h-8" />,
      title: 'Donor Relationship Management',
      description: 'Deep donor insights, engagement scoring, and retention analytics. Track donor history, preferences, and engagement patterns.',
      benefits: ['Engagement scoring', 'Donor history tracking', 'Retention analytics', 'Donor communication tools'],
    },
    {
      id: 'blood-locator',
      icon: <Zap className="w-8 h-8" />,
      title: 'Blood Locator AI',
      description: 'Real-time AI-powered blood availability search across all connected hospitals and blood banks. Find the exact blood type in seconds.',
      benefits: ['Real-time availability', 'Multi-facility search', 'Optimal routing', 'Emergency prioritization'],
    },
    {
      id: 'fraud-detection',
      icon: <Shield className="w-8 h-8" />,
      title: 'Trust & Fraud Detection',
      description: 'Advanced ML algorithms to identify and prevent fraudulent donor activities. Ensure network integrity and donor safety.',
      benefits: ['Fraud detection', 'Pattern analysis', 'Risk scoring', 'Security alerts'],
    },
    {
      id: 'forecasting',
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'AI Blood Forecasting',
      description: 'Predict blood demand patterns and optimize inventory management. Stay ahead of demand surges.',
      benefits: ['Demand prediction', 'Inventory optimization', 'Trend analysis', 'Surge alerts'],
    },
    {
      id: 'heat-maps',
      icon: <Globe className="w-8 h-8" />,
      title: 'District Heat Maps',
      description: 'Visualize donor distribution, demand hotspots, and emergency zones. Geographic insights for strategic planning.',
      benefits: ['Geographic visualization', 'Demand mapping', 'Resource allocation', 'Coverage analysis'],
    },
    {
      id: 'analytics',
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Analytics Dashboard',
      description: 'Real-time KPIs, trends, and comprehensive performance metrics. Data-driven decision making.',
      benefits: ['Real-time KPIs', 'Trend analysis', 'Performance metrics', 'Custom reports'],
    },
  ];

  return (
    <PageTransition>
      <div className="bg-gradient-to-br from-[#0b0f14] via-[#0d1117] to-[#161b22] text-white overflow-hidden">
        {/* Background elements */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        </div>

        {/* Hero Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold">
              Powerful Features for Blood Management
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Everything you need to manage donors, hospitals, blood banks, and emergency responses in one unified platform.
            </p>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 p-8 backdrop-blur-md hover:border-red-500/50 hover:bg-white/8 transition group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500/20 to-red-500/5 flex items-center justify-center text-red-400 mb-4 group-hover:scale-110 transition">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-red-500/30 bg-gradient-to-r from-red-500/20 to-rose-500/10 backdrop-blur-md p-12 md:p-20 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Transform Your Blood Management?</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Get started today and experience the future of healthcare blood management.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/app/register'}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 rounded-full font-semibold text-white text-lg flex items-center justify-center gap-2 mx-auto hover:shadow-lg transition"
            >
              🚀 Get Started Now
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </section>
      </div>
    </PageTransition>
  );
};

export default FeaturesPage;
