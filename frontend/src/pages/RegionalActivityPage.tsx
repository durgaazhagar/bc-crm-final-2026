import React from 'react';
import { motion } from 'framer-motion';

const RegionalActivityPage: React.FC = () => (
  <div className="min-h-screen p-6 text-white">
    <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-semibold mb-4">Regional Activity - Tamil Nadu</motion.h1>
    <div className="rounded-2xl p-6 bg-white/5 border border-white/10">District-wise donor heatmap and activity. Placeholder.</div>
  </div>
);

export default RegionalActivityPage;
