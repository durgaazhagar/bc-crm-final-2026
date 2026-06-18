import React from 'react';
import { motion } from 'framer-motion';

const DemandMeterPage: React.FC = () => (
  <div className="min-h-screen p-6 text-white">
    <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-semibold mb-4">Real-time Demand Meter</motion.h1>
    <div className="rounded-2xl p-6 bg-white/5 border border-white/10">Historical and predictive demand visualization. Placeholder.</div>
  </div>
);

export default DemandMeterPage;
