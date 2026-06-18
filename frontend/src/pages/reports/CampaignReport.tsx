import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const data = [ { name: 'Successful', value: 60 }, { name: 'Partial', value: 25 }, { name: 'Failed', value: 15 } ];

const CampaignReport: React.FC = () => {
  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Campaign Report</h2>
      <div className="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
                {data.map((_, i) => (<Cell key={i} fill={["#ef4444","#f97316","#a78bfa"][i]} />))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CampaignReport;
