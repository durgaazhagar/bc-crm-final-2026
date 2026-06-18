import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend, ReferenceLine } from 'recharts';
import { Download, FileText, File, BarChart3, Users, Hospital, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const sampleMonths = [
  { month: 'Jan', donations: 120, donors: 90, volunteers: 40 },
  { month: 'Feb', donations: 150, donors: 100, volunteers: 48 },
  { month: 'Mar', donations: 180, donors: 130, volunteers: 60 },
  { month: 'Apr', donations: 210, donors: 150, volunteers: 72 },
];

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#a78bfa', '#06b6d4'];

const DashboardReports: React.FC = () => {
  const [range, setRange] = useState<'3m' | '6m' | '12m' | 'ytd'>('3m');
  const [filter, setFilter] = useState('donor');
  const [drill, setDrill] = useState<any | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [toast, setToast] = useState<{msg:string,type:'success'|'error'} | null>(null);
  const [showDonations, setShowDonations] = useState(true);
  const [showDonors, setShowDonors] = useState(true);
  const [smoothing, setSmoothing] = useState(false);
  const [annotations] = useState<Array<{ month: string; label: string }>>([{ month: 'Jun', label: 'Blood Drive June 10' }]);
  const [drillPage, setDrillPage] = useState(1);
  const [drillPageSize] = useState(50);
  const navigate = useNavigate();

  const data = useMemo(() => sampleMonths, []);

  const API_BASE = import.meta.env.VITE_API_URL || '/api';

  const doToast = (msg:string, type:'success'|'error'='success') => {
    setToast({msg,type});
    setTimeout(()=>setToast(null), 3500);
  };

  const exportCSV = async (rows: any[], filename = 'report.csv') => {
    const token = localStorage.getItem('bloodconnect_token');
    const headers: Record<string,string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      setExportLoading(true);
      const res = await fetch(`${API_BASE}/api/reports/export/csv?type=${filter}`, { headers });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const link = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = link; a.download = filename; a.click(); URL.revokeObjectURL(link);
      doToast('Report exported successfully 🎉','success');
    } catch (e) {
      doToast('Export failed, please try again.','error');
    } finally { setExportLoading(false); }
  };

  const exportPDF = async () => {
    const token = localStorage.getItem('bloodconnect_token');
    const headers: Record<string,string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      setExportLoading(true);
      const res = await fetch(`${API_BASE}/api/reports/export/pdf?type=${filter}`, { headers });
      if (!res.ok) throw new Error('PDF failed');
      const blob = await res.blob();
      const link = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = link; a.download = `report.pdf`; a.click(); URL.revokeObjectURL(link);
      doToast('Report exported successfully 🎉','success');
    } catch (e) {
      doToast('Export failed, please try again.','error');
    } finally { setExportLoading(false); }
  };

  const exportExcel = async () => {
    const token = localStorage.getItem('bloodconnect_token');
    const headers: Record<string,string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      setExportLoading(true);
      const res = await fetch(`${API_BASE}/api/reports/export/xlsx?type=${filter}`, { headers });
      if (!res.ok) throw new Error('Excel failed');
      const blob = await res.blob();
      const link = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = link; a.download = `report.xlsx`; a.click(); URL.revokeObjectURL(link);
      doToast('Report exported successfully 🎉','success');
    } catch (e) {
      doToast('Export failed, please try again.','error');
    } finally { setExportLoading(false); }
  };

  const openReport = (type: string) => {
    navigate(`/dashboard/admin/reports/${type}`);
  };

  const fetchDrill = async (month: string, page = 1, pageSize = 50, q = '') => {
    const token = localStorage.getItem('bloodconnect_token');
    const headers: Record<string,string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/api/reports/drilldown?month=${encodeURIComponent(month)}&type=${filter}&page=${page}&pageSize=${pageSize}&q=${encodeURIComponent(q)}`, { headers });
    if (!res.ok) throw new Error('drill failed');
    return res.json();
  };

  const onBarClick = async (payload: any) => {
    if (!payload) return;
    // call backend drilldown
    try {
      const token = localStorage.getItem('bloodconnect_token');
      const headers: Record<string,string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const month = payload.month;
      setDrill(null);
      const res = await fetch(`${API_BASE}/api/reports/drilldown?month=${encodeURIComponent(month)}&type=${filter}&page=${drillPage}&pageSize=${drillPageSize}`, { headers });
      if (!res.ok) throw new Error('drill failed');
      const json = await res.json();
      // backend should return { rows: [], total }
      setDrill({ title: `Details for ${month}`, rows: json.rows || [], total: json.total || (json.rows||[]).length, page: 1, q: '' });
    } catch (e) {
      // fallback to payload data
      setDrill({ title: `Details for ${payload.month}`, rows: [payload], total: 1 });
    }
  };

  const onDrillPageChange = async (newPage:number) => {
    if (!drill) return;
    try {
      const json = await fetchDrill(drill.title.replace('Details for ', ''), newPage, drillPageSize, drill.q || '');
      setDrill({ ...drill, rows: json.rows || [], total: json.total || 0, page: newPage });
    } catch (err) {
      doToast('Failed to load page','error');
    }
  };

  const onDrillFilter = async (q:string) => {
    if (!drill) return;
    try {
      const json = await fetchDrill(drill.title.replace('Details for ', ''), 1, drillPageSize, q);
      setDrill({ ...drill, rows: json.rows || [], total: json.total || 0, page: 1, q });
    } catch (err) {
      doToast('Failed to apply filter','error');
    }
  };

  const trend = (a: number, b: number) => {
    const diff = b - a;
    const pct = a === 0 ? 0 : Math.round((diff / a) * 100);
    return { diff, pct };
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {toast && <div className={`fixed top-6 right-6 z-60 rounded-lg px-4 py-3 ${toast.type==='success'?'bg-emerald-400 text-black':'bg-rose-500 text-white'}`}>{toast.msg}</div>}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Analytics Hub</h2>
          <div className="text-sm text-slate-400">Multi-month interactive analytics and export</div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => exportCSV(data.map(d=>({month:d.month, donations:d.donations})), 'report.csv')} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500/10 to-violet-600/6 px-3 py-2 text-sm text-white">{exportLoading ? 'Exporting...' : <><Download className="w-4 h-4"/> CSV</>}</button>
          <button onClick={exportPDF} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500/10 to-violet-600/6 px-3 py-2 text-sm text-white">{exportLoading ? 'Exporting...' : <><FileText className="w-4 h-4"/> PDF</>}</button>
          <button onClick={exportExcel} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500/10 to-violet-600/6 px-3 py-2 text-sm text-white">{exportLoading ? 'Exporting...' : <><File className="w-4 h-4"/> Excel</>}</button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl p-4 bg-white/5 border border-white/10 backdrop-blur-md">
          <h3 className="font-semibold mb-2">Report Types</h3>
          <div className="grid gap-3">
            <button onClick={() => openReport('donors')} className="flex items-center gap-3 rounded-lg p-3 bg-gradient-to-r from-red-500/10 to-violet-600/6 hover:scale-102 transition">
              <Users className="w-6 h-6 text-rose-400" />
              <div className="text-left">
                <div className="font-semibold text-white">Donor Report</div>
                <div className="text-xs text-slate-400">Activity, retention, segments</div>
              </div>
            </button>
            <button onClick={() => openReport('hospitals')} className="flex items-center gap-3 rounded-lg p-3 bg-gradient-to-r from-red-500/10 to-violet-600/6 hover:scale-102 transition">
              <Hospital className="w-6 h-6 text-cyan-300" />
              <div className="text-left">
                <div className="font-semibold text-white">Hospital Report</div>
                <div className="text-xs text-slate-400">Demand, capacity, trends</div>
              </div>
            </button>
            <button onClick={() => openReport('campaigns')} className="flex items-center gap-3 rounded-lg p-3 bg-gradient-to-r from-red-500/10 to-violet-600/6 hover:scale-102 transition">
              <Megaphone className="w-6 h-6 text-violet-400" />
              <div className="text-left">
                <div className="font-semibold text-white">Campaign Report</div>
                <div className="text-xs text-slate-400">Performance, collections</div>
              </div>
            </button>
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-white/5 border border-white/10 backdrop-blur-md lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Donations Trend</h3>
            <div className="flex items-center gap-2">
              <select value={range} onChange={(e) => setRange(e.target.value as any)} className="rounded-full bg-white/5 px-3 py-1 text-sm text-white">
                <option value="3m">3 months</option>
                <option value="6m">6 months</option>
                <option value="12m">12 months</option>
                <option value="ytd">Year to date</option>
              </select>
              <select value={filter} onChange={(e)=>setFilter(e.target.value)} className="rounded-full bg-white/5 px-3 py-1 text-sm text-white">
                <option value="donor">Donor activity</option>
                <option value="hospital">Hospital demand</option>
                <option value="campaign">Campaign performance</option>
                <option value="volunteer">Volunteer engagement</option>
              </select>
            </div>
          </div>

          <div className="mb-3 flex items-center gap-4">
            <label className="text-xs text-slate-300">Series:</label>
            <label className="text-xs text-slate-300"><input type="checkbox" checked={showDonations} onChange={(e)=>setShowDonations(e.target.checked)} className="mr-1"/> Donations</label>
            <label className="text-xs text-slate-300"><input type="checkbox" checked={showDonors} onChange={(e)=>setShowDonors(e.target.checked)} className="mr-1"/> Donors</label>
            <label className="text-xs text-slate-300"><input type="checkbox" checked={smoothing} onChange={(e)=>setSmoothing(e.target.checked)} className="mr-1"/> Smoothing</label>
            <div className="ml-auto text-xs text-slate-400">Annotations:</div>
            <div className="text-xs text-slate-300">{annotations.map(a=>a.label).join(', ')}</div>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={data} onClick={(e:any)=>onBarClick(e.activePayload?.[0]?.payload)}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.06} />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{background:'linear-gradient(90deg,#0b1220, #10151b)', border:'none', boxShadow:'0 12px 36px rgba(167,139,250,0.08)'}}/>
                {showDonations && <Bar dataKey="donations" fill="#ef4444" />}
                {showDonors && <Bar dataKey="donors" fill="#f97316" />}
                {annotations.map((a,idx)=>(<ReferenceLine key={idx} x={a.month} stroke="#a78bfa" strokeDasharray="3 3" label={{position:'top', value:a.label, fill:'#a78bfa'}} />))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {data.slice(0,3).map((d, i) => {
              const comp = trend(data[i]?.donations ?? 0, data[i+1]?.donations ?? d.donations);
              return (
                <div key={d.month} className="rounded-lg p-3 bg-slate-900/60">
                  <div className="text-sm text-slate-300">{d.month}</div>
                  <div className="text-xl font-bold text-white">{d.donations}</div>
                  <div className={`text-xs ${comp.pct>=0? 'text-emerald-400':'text-rose-400'}`}>{comp.pct>=0? `▲ ${comp.pct}%`:`▼ ${Math.abs(comp.pct)}%`}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl p-4 bg-white/5 border border-white/10 backdrop-blur-md">
          <h4 className="font-semibold mb-2">AI Insights</h4>
          <div className="text-sm text-slate-300">Top donor engagement this month: <span className="font-semibold text-white">Murugan Selvam</span></div>
          <div className="mt-2 text-sm text-slate-300">Predicted blood demand next quarter: <span className="font-semibold text-white">+12%</span></div>
        </div>

        <div className="rounded-2xl p-4 bg-white/5 border border-white/10 backdrop-blur-md lg:col-span-2">
          <h4 className="font-semibold mb-2">Donor Segment</h4>
          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={[{name:'Active',value:60},{name:'Lapsed',value:25},{name:'New',value:15}]} dataKey="value" nameKey="name" outerRadius={60} label>
                  <Cell fill={COLORS[0]} />
                  <Cell fill={COLORS[1]} />
                  <Cell fill={COLORS[2]} />
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {drill && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <motion.div initial={{ scale: 0.98 }} animate={{ scale: 1 }} exit={{ scale: 0.98 }} className="w-full max-w-3xl rounded-2xl bg-slate-900/95 p-4 border border-white/6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-white">{drill.title}</h4>
                <div className="flex items-center gap-3">
                  <input placeholder="Filter" defaultValue={drill.q||''} onBlur={(e)=>onDrillFilter(e.target.value)} className="rounded-md bg-white/5 px-2 py-1 text-sm text-white" />
                  <button onClick={()=>{ /* export drilldown */ const token=localStorage.getItem('bloodconnect_token'); const headers:Record<string,string>={}; if(token) headers['Authorization']=`Bearer ${token}`; setExportLoading(true); fetch(`${API_BASE}/api/reports/export/csv?type=${filter}&month=${drill.title.replace('Details for ','')}`,{headers}).then(async r=>{if(!r.ok) throw new Error('export'); const blob=await r.blob(); const link=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=link; a.download='drilldown.csv'; a.click(); URL.revokeObjectURL(link); doToast('Report exported successfully 🎉','success')}).catch(()=>doToast('Export failed, please try again.','error')).finally(()=>setExportLoading(false)); }} className="rounded-full bg-white/6 px-3 py-1 text-sm">Export</button>
                  <button onClick={() => setDrill(null)} className="text-sm text-slate-300">Close</button>
                </div>
              </div>
              <div className="mt-3">
                <table className="w-full text-sm">
                  <thead className="text-slate-400 text-left"><tr><th>Donor</th><th>Amount</th><th>Date</th></tr></thead>
                  <tbody>
                    {drill.rows.map((r:any, idx:number)=> (
                      <tr key={idx} className="border-t border-white/6"><td className="py-2">{r.donor || r.name || '—'}</td><td>{r.amount || r.donations || '—'}</td><td>{r.date || r.lastDonationDate || r.month}</td></tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-slate-400">Showing {(drill.page||1)} of {Math.max(1, Math.ceil((drill.total||0)/drillPageSize))} pages</div>
                  <div className="flex items-center gap-2">
                    <button disabled={(drill.page||1)<=1} onClick={()=>onDrillPageChange((drill.page||1)-1)} className="rounded px-3 py-1 bg-white/5 text-sm">Prev</button>
                    <button disabled={(drill.page||1)>=Math.max(1, Math.ceil((drill.total||0)/drillPageSize))} onClick={()=>onDrillPageChange((drill.page||1)+1)} className="rounded px-3 py-1 bg-white/5 text-sm">Next</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DashboardReports;
