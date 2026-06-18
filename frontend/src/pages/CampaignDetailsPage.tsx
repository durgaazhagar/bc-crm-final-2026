import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

const CampaignDetailsPage: React.FC = () => {
  const params = useParams();
  return (
    <div className="min-h-screen p-6 text-white">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-semibold mb-4">Campaign Details {params.id || ''}</motion.h1>
      <div className="rounded-2xl p-6 bg-white/5 border border-white/10">Progress bars, volunteer stats and targets. Placeholder.</div>
    </div>
  );
};

export default CampaignDetailsPage;
