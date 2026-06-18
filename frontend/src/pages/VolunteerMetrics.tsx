import React, { useMemo, useState } from 'react';
import { BarChart2, PieChart } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { useNavigate } from 'react-router-dom';

const VolunteerMetrics: React.FC = () => {
  const navigate = useNavigate();
  const [showHours, setShowHours] = useState(true);
  const [showEngagement, setShowEngagement] = useState(true);
  const [smoothing, setSmoothing] = useState(false);
  const [annotations] = useState([{ date: '05', label: 'Volunteer Rally' }]);

  const data = useMemo(() => [
    { date: '01', hours: 40, engaged: 5 },
    { date: '02', hours: 55, engaged: 8 },
    { date: '03', hours: 48, engaged: 7 },
    { date: '04', hours: 70, engaged: 12 },
    { date: '05', hours: 65, engaged: 9 },
    { date: '06', hours: 80, engaged: 14 },
    { date: '07', hours: 75, engaged: 11 },
  ], []);

  const handlePointClick = (payload: any) => {
    if (!payload) return;
    // drill into reports for this date
    const month = 'Feb';
    navigate('/app/analytics');
    const apiBase = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL || '/api';
    try { window.open(`${apiBase}/reports/drilldown?month=${month}&type=volunteer`); } catch (e) {}
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mb-4 flex items-center gap-3">
        <BarChart2 className="w-6 h-6 text-white" />
        <h2 className="text-2xl font-bold text-white">Engagement Metrics</h2>
      </div>

      <div className="mb-4 flex items-center gap-3 text-sm text-slate-300">
        <label><input type="checkbox" checked={showHours} onChange={(e)=>setShowHours(e.target.checked)} className="mr-1"/> Hours</label>
        <label className="ml-3"><input type="checkbox" checked={showEngagement} onChange={(e)=>setShowEngagement(e.target.checked)} className="mr-1"/> Volunteers</label>
        <label className="ml-3"><input type="checkbox" checked={smoothing} onChange={(e)=>setSmoothing(e.target.checked)} className="mr-1"/> Smoothing</label>
      </div>

      <div className="rounded-2xl border border-white/6 bg-slate-900/50 p-4">
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data} onClick={(e:any)=>handlePointClick(e.activePayload?.[0]?.payload)}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.06} />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{background:'rgba(255,255,255,0.04)', border:'none'}} />
              {showHours && <Line type={smoothing ? 'monotone' : 'linear'} dataKey="hours" stroke="#06b6d4" strokeWidth={3} dot={{ r:4 }} />}
              {showEngagement && <Line type={smoothing ? 'monotone' : 'linear'} dataKey="engaged" stroke="#a78bfa" strokeWidth={3} dot={{ r:4 }} />}
              {annotations.map((a,idx)=>(<ReferenceLine key={idx} x={a.date} label={{ position: 'top', value: a.label, fill: '#a78bfa' }} stroke='#a78bfa' strokeDasharray='3 3' />))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default VolunteerMetrics;
