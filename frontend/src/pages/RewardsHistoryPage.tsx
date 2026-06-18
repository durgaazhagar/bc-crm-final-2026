import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const RewardsHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const rawUser = localStorage.getItem('bloodconnect_user');
        const parsed = rawUser ? JSON.parse(rawUser) : {};
        const donorId = parsed?.id || parsed?._id || null;
        const API_BASE = import.meta.env.VITE_API_URL || '/api';
        const token = localStorage.getItem('bloodconnect_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        if (donorId) {
          const resp = await fetch(`${API_BASE}/api/rewards/history/${donorId}`, { headers });
          if (resp.ok) {
            const data = await resp.json();
            setHistory(data || []);
            return;
          }
        }
      } catch (e) {
        // fall through to localStorage
      }

      try {
        const raw = localStorage.getItem('redeemedRewards');
        setHistory(raw ? JSON.parse(raw) : []);
      } catch {
        setHistory([]);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Rewards History</h2>
      {history.length === 0 ? (
        <div className="text-slate-400">No redeemed rewards yet.</div>
      ) : (
        <div className="grid gap-3">
          {history.map((h, idx) => (
            <motion.div key={h.redeemedAt + idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-white/6 bg-slate-900/50 p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">{h.name}</div>
                <div className="text-xs text-slate-300">Redeemed {new Date(h.redeemedAt).toLocaleString()}</div>
              </div>
              <div className="text-sm text-slate-300">-{h.points} pts</div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RewardsHistoryPage;
