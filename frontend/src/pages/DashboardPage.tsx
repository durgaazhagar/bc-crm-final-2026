import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Bell, AlertTriangle, Activity, TrendingUp, Droplet, Heart, Hospital, Megaphone, Clock, Edit2, Trash2, BarChart3, Users } from 'lucide-react';

const COLORS = ['#ef4444', '#f59e0b', '#06b6d4', '#7c3aed'];

const sampleMonthly = [
  { month: 'Jan', donations: 120 },
  { month: 'Feb', donations: 90 },
  { month: 'Mar', donations: 150 },
  { month: 'Apr', donations: 170 },
  { month: 'May', donations: 130 },
  { month: 'Jun', donations: 190 },
  { month: 'Jul', donations: 210 },
  { month: 'Aug', donations: 160 },
  { month: 'Sep', donations: 140 },
  { month: 'Oct', donations: 180 },
  { month: 'Nov', donations: 200 },
  { month: 'Dec', donations: 220 },
];

const sampleRequests = [
  { name: 'Fulfilled', value: 420 },
  { name: 'Pending', value: 85 },
];

const sampleVolunteers = [
  { date: '01', engaged: 5 },
  { date: '02', engaged: 8 },
  { date: '03', engaged: 7 },
  { date: '04', engaged: 12 },
  { date: '05', engaged: 9 },
  { date: '06', engaged: 14 },
  { date: '07', engaged: 11 },
];

const emergencyAlertsData = [
  { id: 1, title: 'O− critical shortage', description: 'Only 4 units available across all hospitals.', icon: <AlertTriangle className="h-5 w-5 text-red-100" /> },
  { id: 2, title: 'B+ demand spike', description: 'Urgent requests from 3 nearby blood banks.', icon: <AlertTriangle className="h-5 w-5 text-red-100" /> },
  { id: 3, title: 'AB− low inventory', description: 'Less than 10 units remain in central reserve.', icon: <AlertTriangle className="h-5 w-5 text-red-100" /> },
];

const priorityNotificationsData = [
  { id: 1, message: 'Emergency request from City Hospital pending approval.' },
  { id: 2, message: 'ICU patient needs O+ compatibility match within 2 hours.' },
  { id: 3, message: 'Donor mobilization alert: 15 volunteers ready near North Clinic.' },
];

const aiPredictionsData = [
  { id: 1, label: 'Donor availability', value: '82%', trend: 'steady', icon: <Activity className="h-5 w-5 text-cyan-200" /> },
  { id: 2, label: 'Blood demand next 7 days', value: '+24%', trend: 'rising', icon: <TrendingUp className="h-5 w-5 text-amber-200" /> },
];

const bloodStockLevels = [
  { type: 'A+', level: 78, color: 'from-red-500 to-rose-500' },
  { type: 'A-', level: 56, color: 'from-rose-500 to-fuchsia-500' },
  { type: 'B+', level: 64, color: 'from-orange-500 to-red-500' },
  { type: 'B-', level: 42, color: 'from-amber-500 to-orange-500' },
  { type: 'O+', level: 88, color: 'from-emerald-500 to-teal-500' },
  { type: 'O-', level: 51, color: 'from-sky-500 to-cyan-500' },
  { type: 'AB+', level: 35, color: 'from-violet-500 to-indigo-500' },
  { type: 'AB-', level: 26, color: 'from-pink-500 to-purple-500' },
];

// New data for additional dashboard widgets
const demandLevel = 73; // percent

const tamilNaduDistrictPins = [
  { id: 'chennai', name: 'Chennai', lat: 13.0827, lon: 80.2707, status: 'active' },
  { id: 'madurai', name: 'Madurai', lat: 9.9252, lon: 78.1198, status: 'critical' },
  { id: 'coimbatore', name: 'Coimbatore', lat: 11.0168, lon: 76.9558, status: 'low' },
  { id: 'salem', name: 'Salem', lat: 11.6643, lon: 78.1460, status: 'active' },
];

const topDonorsThisMonth = [
  { id: 1, name: 'Murugan Selvam', blood: 'A+', donations: 8 },
  { id: 2, name: 'Kavitha Rajan', blood: 'B+', donations: 6 },
  { id: 3, name: 'Senthil Kumar', blood: 'O+', donations: 5 },
  { id: 4, name: 'Rajesh Pandian', blood: 'B+', donations: 4 },
  { id: 5, name: 'Nithya Krishnan', blood: 'A+', donations: 3 },
];

const recentActivities = [
  { id: 1, icon: '🩸', text: 'Murugan Selvam donated A+ at Chennai', time: '2m' },
  { id: 2, icon: '🏥', text: 'Apollo Hospital requested O- blood', time: '5m' },
  { id: 3, icon: '✅', text: 'Request #1042 fulfilled successfully', time: '12m' },
  { id: 4, icon: '👤', text: 'New donor Priya Lakshmi registered', time: '25m' },
  { id: 5, icon: '🚨', text: 'Critical alert: AB- shortage in Madurai', time: '1h' },
  { id: 6, icon: '🎉', text: "Chennai Blood Drive reached 80% target", time: '2h' },
];

const campaignProgressData = [
  { id: 1, name: 'Chennai Blood Heroes Drive', current: 156, goal: 200 },
  { id: 2, name: 'Coimbatore Life Savers', current: 98, goal: 150 },
  { id: 3, name: 'Salem Donor Camp', current: 67, goal: 100 },
];

const initialUsers = [
  { id: 1, name: 'Aisha Khan', email: 'aisha@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Ravi Sharma', email: 'ravi@example.com', role: 'Hospital', status: 'Active' },
  { id: 3, name: 'Maya Iyer', email: 'maya@example.com', role: 'Volunteer', status: 'Pending' },
  { id: 4, name: 'Karan Patel', email: 'karan@example.com', role: 'Blood Bank', status: 'Active' },
];

const StatCard = ({ title, value, icon, onClick }: { title: string; value: string | number; icon: React.ReactNode; onClick?: () => void }) => (
  <motion.button
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    onClick={onClick}
    className="rounded-2xl p-5 bg-white/5 border border-white/10 backdrop-blur-md shadow-lg hover:shadow-2xl transform-gpu hover:-translate-y-1 transition cursor-pointer"
    title="View Details"
  >
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="rounded-xl p-3 bg-gradient-to-br from-red-400 to-violet-600 text-white shadow-lg">
          {icon}
        </div>
        <div>
          <div className="text-sm text-slate-300">{title}</div>
          <div className="mt-1 text-2xl font-bold">{value}</div>
        </div>
      </div>
      <div className="text-xs text-slate-400">Today</div>
    </div>
  </motion.button>
);

const DashboardPage = () => {
  const [users, setUsers] = useState(initialUsers);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ name?: string; email?: string; role?: string; status?: string }>({});

  const totals = useMemo(() => ({
    donors: 12480,
    hospitals: 312,
    campaigns: 18,
    pending: 85,
  }), []);

  const handleDelete = (id: number) => {
    setUsers((u) => u.filter((x) => x.id !== id));
  };

  const startEdit = (u: any) => {
    setEditingId(u.id);
    setEditValues({ name: u.name, email: u.email, role: u.role, status: u.status });
  };

  const saveEdit = (id: number) => {
    setUsers((list) => list.map((u) => (u.id === id ? { ...u, ...editValues } : u)));
    setEditingId(null);
    setEditValues({});
  };

  // UI state for additional widgets
  const [chatOpen, setChatOpen] = useState(false);

  const toggleChat = () => setChatOpen((v) => !v);

  const quickQuestions = [
    'Check O+ stock',
    'Emergency donors near me',
    "Today's donation count",
  ];
    // Gauge calculations
    const gaugeRadius = 48;
    const gaugeCircumference = 2 * Math.PI * gaugeRadius;
    const gaugeOffset = gaugeCircumference * (1 - demandLevel / 100);
    const gaugeColor = demandLevel >= 75 ? '#ef4444' : demandLevel >= 40 ? '#f59e0b' : '#10b981';

  const handleQuickAction = (action: string) => {
    // placeholder actions - integrate with API as needed
    // eslint-disable-next-line no-console
    console.log('Quick action:', action);
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 text-white">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Donors" value={totals.donors} icon={<Heart className="h-6 w-6 text-rose-400" />} onClick={()=>navigate('/app/donors')} />
          <StatCard title="Total Hospitals" value={totals.hospitals} icon={<Hospital className="h-6 w-6 text-sky-400" />} onClick={()=>navigate('/app/hospitals')} />
          <StatCard title="Active Campaigns" value={totals.campaigns} icon={<Megaphone className="h-6 w-6 text-violet-400" />} onClick={()=>navigate('/app/campaigns')} />
          <StatCard title="Pending Requests" value={totals.pending} icon={<Clock className="h-6 w-6 text-amber-400" />} onClick={()=>navigate('/app/emergency')} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Donations per month - Bar Chart */}
          <motion.div className="col-span-2 rounded-2xl p-4 bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
            <h2 className="text-lg font-semibold mb-3">Donations per month</h2>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={sampleMonthly}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.06} />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="donations" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Requests pie & volunteers line */}
          <div className="space-y-6">
            <motion.div className="rounded-2xl p-4 bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
              <h2 className="text-lg font-semibold mb-3">Requests fulfilled vs pending</h2>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={sampleRequests} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} paddingAngle={4}>
                      {sampleRequests.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div className="rounded-2xl p-4 bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
              <h2 className="text-lg font-semibold mb-3">Volunteer engagement</h2>
              <div style={{ width: '100%', height: 160 }}>
                <ResponsiveContainer>
                  <LineChart data={sampleVolunteers}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.06} />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Line type="monotone" dataKey="engaged" stroke="#06b6d4" strokeWidth={3} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>

        {/* User Management Table */}
        <motion.div className="rounded-2xl p-4 bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">User Management</h2>
            <button className="rounded-xl bg-gradient-to-br from-rose-500 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:shadow-2xl transition-transform transform hover:-translate-y-0.5">
              Add User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="text-slate-300 text-sm border-b border-white/10">
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">Email</th>
                  <th className="py-3 px-2">Role</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-white/6 hover:bg-white/2 transition-colors">
                    <td className="py-3 px-2">
                      {editingId === u.id ? (
                        <input className="rounded-lg bg-transparent border border-white/10 px-2 py-1" value={editValues.name} onChange={(e) => setEditValues((v) => ({ ...v, name: e.target.value }))} />
                      ) : (
                        <div className="font-medium">{u.name}</div>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {editingId === u.id ? (
                        <input className="rounded-lg bg-transparent border border-white/10 px-2 py-1" value={editValues.email} onChange={(e) => setEditValues((v) => ({ ...v, email: e.target.value }))} />
                      ) : (
                        <div className="text-slate-300">{u.email}</div>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {editingId === u.id ? (
                        <input className="rounded-lg bg-transparent border border-white/10 px-2 py-1" value={editValues.role} onChange={(e) => setEditValues((v) => ({ ...v, role: e.target.value }))} />
                      ) : (
                        <div className="text-slate-300">{u.role}</div>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {editingId === u.id ? (
                        <input className="rounded-lg bg-transparent border border-white/10 px-2 py-1" value={editValues.status} onChange={(e) => setEditValues((v) => ({ ...v, status: e.target.value }))} />
                      ) : (
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${u.status === 'Active' ? 'bg-emerald-600/20 text-emerald-300' : 'bg-amber-500/10 text-amber-300'}`}>{u.status}</div>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {editingId === u.id ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => saveEdit(u.id)} className="rounded-lg bg-emerald-600 px-3 py-1 text-sm font-semibold text-white hover:shadow-lg transition">Save</button>
                          <button onClick={() => setEditingId(null)} className="rounded-lg bg-white/5 px-3 py-1 text-sm text-slate-200">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button onClick={() => startEdit(u)} className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1 text-sm text-slate-200 hover:shadow-md transition">
                            <Edit2 className="h-4 w-4" /> Edit
                          </button>
                          <button onClick={() => handleDelete(u.id)} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:shadow-lg transition">
                            <Trash2 className="h-4 w-4" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* New dashboard sections */}
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
            <button onClick={()=>navigate('/app/analytics')} className="group flex items-center gap-4 rounded-2xl p-4 bg-gradient-to-br from-red-500/10 to-violet-700/10 border border-white/5 hover:shadow-lg transition cursor-pointer">
              <div className="rounded-full p-3 bg-gradient-to-br from-red-500 to-violet-600 text-white shadow-lg"><BarChart3 className="h-5 w-5" /></div>
              <div className="text-left">
                <div className="text-sm font-semibold">Donations per Month</div>
                <div className="text-xs text-slate-300">Monthly trends and drill-down</div>
              </div>
            </button>

            <button onClick={()=>navigate('/app/emergency')} className="group flex items-center gap-4 rounded-2xl p-4 bg-gradient-to-br from-rose-500/10 to-red-700/10 border border-white/5 hover:shadow-lg transition cursor-pointer">
              <div className="rounded-full p-3 bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg"><AlertTriangle className="h-5 w-5" /></div>
              <div className="text-left">
                <div className="text-sm font-semibold">Requests Fulfilled vs Pending</div>
                <div className="text-xs text-slate-300">Emergency requests and status</div>
              </div>
            </button>

            <button onClick={()=>navigate('/app/volunteers')} className="group flex items-center gap-4 rounded-2xl p-4 bg-gradient-to-br from-cyan-500/10 to-sky-700/10 border border-white/5 hover:shadow-lg transition cursor-pointer">
              <div className="rounded-full p-3 bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg"><Users className="h-5 w-5" /></div>
              <div className="text-left">
                <div className="text-sm font-semibold">Volunteer Engagement</div>
                <div className="text-xs text-slate-300">Profiles, metrics & rewards</div>
              </div>
            </button>

            <button onClick={()=>navigate('/app/users')} className="group flex items-center gap-4 rounded-2xl p-4 bg-gradient-to-br from-emerald-500/10 to-green-700/10 border border-white/5 hover:shadow-lg transition cursor-pointer">
              <div className="rounded-full p-3 bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-lg"><Activity className="h-5 w-5" /></div>
              <div className="text-left">
                <div className="text-sm font-semibold">User Management</div>
                <div className="text-xs text-slate-300">Add / edit / remove users</div>
              </div>
            </button>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-red-900/90 border border-red-500/20 p-6 shadow-[0_20px_80px_rgba(220,38,38,0.18)]">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-red-200/80">Emergency Alerts</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Critical shortages</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 text-red-100 shadow-[0_0_20px_rgba(248,113,113,0.35)] animate-pulse-red">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </div>
              <div className="space-y-4">
                {emergencyAlertsData.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-4 rounded-3xl border border-red-500/20 bg-white/5 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/10 text-red-200">
                      {alert.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{alert.title}</p>
                      <p className="text-sm text-slate-300">{alert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-slate-950/80 border border-white/10 p-6 shadow-glass">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">Priority Notifications</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Urgent requests</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.18)]">
                  <Bell className="h-6 w-6" />
                </div>
              </div>
              <ul className="space-y-3">
                {priorityNotificationsData.map((note) => (
                  <li key={note.id} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 transition hover:border-cyan-500/30 hover:bg-white/10">
                    {note.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl bg-white/5 border border-white/10 p-6 shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">AI Predictions</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">7-day donor outlook</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-[0_0_20px_rgba(148,163,184,0.18)]">
                  <Activity className="h-6 w-6" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {aiPredictionsData.map((prediction) => (
                  <div key={prediction.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-cyan-200">
                        {prediction.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{prediction.label}</p>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Next 7 days</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-3xl font-semibold text-white">{prediction.value}</span>
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">{prediction.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white/5 border border-white/10 p-6 shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Quick Blood Stock</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Inventory overview</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.18)]">
                  <Droplet className="h-6 w-6" />
                </div>
              </div>
              <div className="space-y-4">
                {bloodStockLevels.map((stock) => (
                  <div key={stock.type}>
                    <div className="flex items-center justify-between text-sm text-slate-300 mb-2">
                      <span>{stock.type}</span>
                      <span>{stock.level}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                      <div className={`h-3 rounded-full bg-gradient-to-r ${stock.color}`} style={{ width: `${stock.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        {/* Additional Admin widgets */}
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Demand meter */}
            <div className="rounded-3xl p-6 bg-gradient-to-br from-white/3 to-white/5 border border-white/8 shadow-lg flex flex-col items-center">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Real-time Blood Demand</p>
              <h3 className="mt-2 text-xl font-semibold">Demand Meter</h3>
              <div className="mt-4 flex items-center gap-6">
                <div className="relative flex items-center justify-center w-36 h-36 animate-pulse">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <defs>
                      <linearGradient id="gaugeGrad" x1="0%" x2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                    <g transform="translate(60,60)">
                      <circle r="48" fill="none" stroke="#0f1724" strokeWidth="12" opacity="0.12" />
                      <circle r="48" fill="none" stroke="url(#gaugeGrad)" strokeWidth="12" strokeLinecap="round" strokeDasharray={gaugeCircumference} strokeDashoffset={gaugeOffset} transform="rotate(-90)" />
                    </g>
                  </svg>
                  <div className="absolute text-center">
                    <div className="text-3xl font-bold" style={{ color: gaugeColor }}>{demandLevel}%</div>
                    <div className="text-xs text-slate-400">Overall demand</div>
                  </div>
                </div>
                <div className="text-sm text-slate-300 max-w-xs">
                  <p className="font-semibold">Demand level: <span style={{ color: gaugeColor }}>{demandLevel}%</span></p>
                  <p className="mt-2">Realtime estimate for network blood demand. When this reaches critical, triggers emergency workflows.</p>
                </div>
              </div>
            </div>

            {/* Tamil Nadu coverage map */}
            <div className="rounded-3xl p-4 bg-white/5 border border-white/10 shadow-lg">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Tamil Nadu Coverage</p>
              <h3 className="mt-2 text-xl font-semibold">District donor activity</h3>
              <div className="mt-3 rounded-lg overflow-hidden border border-white/6">
                <iframe title="Tamil Nadu map" src="https://www.openstreetmap.org/export/embed.html?bbox=76.5,8.0,80.5,13.5&layer=mapnik" style={{ width: '100%', height: 220, border: 0 }} />
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-300">
                {tamilNaduDistrictPins.map((d) => (
                  <div key={d.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`inline-block h-3 w-3 rounded-full ${d.status === 'active' ? 'bg-emerald-400' : d.status === 'critical' ? 'bg-red-500' : 'bg-amber-400'}`} />
                      <span>{d.name}</span>
                    </div>
                    <div className="text-xs text-slate-500">{d.status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Donor of the month card */}
            <div className="rounded-3xl p-4 bg-gradient-to-br from-amber-500/8 to-white/5 border border-white/10 shadow-lg">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Donor of the Month</p>
              <div className="mt-3 flex items-center gap-4">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-rose-600/20 text-white font-bold text-xl">MS</div>
                <div>
                  <div className="font-semibold text-white">Murugan Selvam</div>
                  <div className="text-sm text-slate-300">A+ • 8 donations</div>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-200">Hero of the Month 🏆</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Leaderboard */}
            <div className="rounded-3xl p-4 bg-white/5 border border-white/10 shadow-lg">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Top Donors (this month)</p>
              <ul className="mt-3 space-y-3">
                {topDonorsThisMonth.map((d, idx) => (
                  <li key={d.id} className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center font-semibold">{d.name.split(' ').map(p => p[0]).slice(0,2).join('')}</div>
                      <div>
                        <div className="font-semibold text-white">{d.name}</div>
                        <div className="text-xs text-slate-400">{d.blood} • {d.donations} donations</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-amber-300">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : ''}</div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent activity feed */}
            <div className="rounded-3xl p-4 bg-white/5 border border-white/10 shadow-lg">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Recent Activity</p>
              <ul className="mt-3 space-y-2 text-sm">
                {recentActivities.map((a) => (
                  <li key={a.id} className="flex items-start gap-3">
                    <div className="mt-1 h-8 w-8 flex items-center justify-center rounded-md bg-white/5 text-lg">{a.icon}</div>
                    <div>
                      <div className="text-sm text-white">{a.text}</div>
                      <div className="text-xs text-slate-400 mt-1">{a.time} ago</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Campaign progress tracker */}
            <div className="rounded-3xl p-4 bg-white/5 border border-white/10 shadow-lg">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Campaign Progress</p>
              <div className="mt-3 space-y-3">
                {campaignProgressData.map((c) => {
                  const pct = Math.round((c.current / c.goal) * 100);
                  return (
                    <div key={c.id}>
                      <div className="flex items-center justify-between text-sm text-slate-300 mb-1">
                        <span>{c.name}</span>
                        <span className="font-semibold text-white">{c.current}/{c.goal} ({pct}%)</span>
                      </div>
                      <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                        <div className={`h-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick actions row */}
          <div className="rounded-3xl p-3 bg-white/5 border border-white/10 shadow-sm flex flex-wrap gap-3">
            {[
              { label: '🚨 Raise Emergency Alert', action: 'raise_alert' },
              { label: '➕ Add New Donor', action: 'add_donor' },
              { label: '📋 New Blood Request', action: 'new_request' },
              { label: '📊 Generate Report', action: 'generate_report' },
            ].map((b) => (
              <button key={b.action} onClick={() => handleQuickAction(b.action)} className="rounded-2xl bg-white/3 px-4 py-2 text-sm hover:scale-105 transition transform">
                {b.label}
              </button>
            ))}
          </div>

          {/* Chatbot floating widget */}
          <div>
            <div className="fixed bottom-6 right-6 z-50">
              {chatOpen && (
                <div className="mb-3 w-80 rounded-2xl bg-white/5 border border-white/10 p-3 shadow-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">BloodConnect AI</div>
                    <button onClick={toggleChat} className="text-sm text-slate-300">Close</button>
                  </div>
                  <div className="space-y-2">
                    {quickQuestions.map((q, i) => (
                      <button key={i} onClick={() => handleQuickAction(q)} className="w-full text-left rounded-lg px-3 py-2 bg-white/6 hover:bg-white/8">{q}</button>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={toggleChat} className="h-14 w-14 rounded-full bg-cyan-500 flex items-center justify-center text-white shadow-xl">🤖</button>
            </div>
          </div>
        </div>
        </div>
      </motion.section>
    </div>
  );
};

export default DashboardPage;
