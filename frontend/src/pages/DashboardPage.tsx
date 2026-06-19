import { motion } from 'framer-motion';

const DashboardPage = () => {
  return (
    <div className="min-h-screen p-6 text-white">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-white/10 bg-slate-950/90 p-8 shadow-2xl shadow-black/30"
      >
        <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
        <p className="mt-4 text-slate-300">
          Welcome to BloodConnect CRM. Select a dashboard section from the sidebar to continue.
        </p>
      </motion.section>
    </div>
  );
};

export default DashboardPage;
