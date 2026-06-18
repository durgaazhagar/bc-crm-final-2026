import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [ { month: 'Jan', value: 120 }, { month: 'Feb', value: 150 }, { month: 'Mar', value: 180 } ];

const DonorReport: React.FC = () => {
  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Donor Report</h2>
      <div className="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.06} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line dataKey="value" stroke="#ef4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DonorReport;
