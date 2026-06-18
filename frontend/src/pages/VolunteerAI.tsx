import React from 'react';
import { Zap } from 'lucide-react';

const suggestions = [
  'Invite top contributors to lead a community drive.',
  'Send personalized re-engagement SMS next week.',
  'Offer a mentor session for new volunteers.'
];

const VolunteerAI: React.FC = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="mb-4 flex items-center gap-3">
        <Zap className="w-6 h-6 text-white" />
        <h2 className="text-2xl font-bold text-white">AI Suggestions</h2>
      </div>
      <div className="grid gap-3">
        {suggestions.map((s, i) => (
          <div key={i} className="rounded-2xl border border-white/6 bg-slate-900/50 p-4">
            <div className="text-sm text-slate-300">{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VolunteerAI;
