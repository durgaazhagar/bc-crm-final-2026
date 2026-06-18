import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CalendarDays,
  Copy,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Users,
  Zap,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import SectionCard from '../components/SectionCard';
import api from '../services/api';

type Donor = {
  id: string;
  name: string;
  phone: string;
  bloodGroup: string;
  district: string;
  availability: 'available' | 'busy' | 'unavailable';
};

type ChatMessage = {
  id: string;
  role: 'user' | 'ai';
  text: string;
  donors?: Donor[];
};

type InboxItem = {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  category: 'hospital' | 'donor' | 'campaign' | 'alert';
};

const donors: Donor[] = [
  { id: 'D001', name: 'Gopi', phone: '9000012345', bloodGroup: 'O+', district: 'Chennai', availability: 'available' },
  { id: 'D002', name: 'Dinesh', phone: '9000012346', bloodGroup: 'A+', district: 'Salem', availability: 'busy' },
  { id: 'D003', name: 'Malathika', phone: '9000012347', bloodGroup: 'B+', district: 'Madurai', availability: 'available' },
  { id: 'D004', name: 'Ganesh', phone: '9000012348', bloodGroup: 'O-', district: 'Tirunelveli', availability: 'available' },
  { id: 'D005', name: 'Devatamil', phone: '9000012349', bloodGroup: 'AB+', district: 'Salem', availability: 'unavailable' },
];

const inbox: InboxItem[] = [
  { id: 'm1', sender: 'City Care Hospital', subject: 'Need urgent O+ donors', preview: 'We need 5 O+ donors for emergency surgery tonight.', time: '2m ago', unread: true, category: 'hospital' },
  { id: 'm2', sender: 'Dr. Priya', subject: 'Inventory update', preview: 'A- stock is running low for the next shift.', time: '12m ago', unread: true, category: 'hospital' },
  { id: 'm3', sender: 'Rahul', subject: 'Donation campaign ready', preview: 'Flyers and volunteers are prepared for the drive.', time: '1h ago', unread: false, category: 'campaign' },
  { id: 'm4', sender: 'Volunteer Team', subject: 'Group coordination', preview: 'Schedule a quick briefing for the awareness event.', time: '3h ago', unread: false, category: 'donor' },
  { id: 'm5', sender: 'Emergency Alert', subject: 'Hotspot detected', preview: 'High request volume in Central zone. Dispatch team.', time: '5h ago', unread: false, category: 'alert' },
];

const announcements = [
  { title: 'New hospital communication protocol released', time: 'Today • 08:00' },
  { title: 'Campaign flyer templates uploaded', time: 'Yesterday • 17:30' },
  { title: 'Volunteer coordination meeting set for Monday', time: 'Yesterday • 11:20' },
];

const sharedDocs = [
  { name: 'Campaign Flyer.pdf', type: 'PDF' },
  { name: 'Donor Guidelines.docx', type: 'DOCX' },
  { name: 'Volunteer Roster.xlsx', type: 'XLSX' },
];

const reminders = [
  { label: 'Blood Drive', detail: 'Saturday • 09:00 AM • Chennai', status: 'Upcoming' },
  { label: 'Awareness Program', detail: 'Tuesday • 04:00 PM • Salem', status: 'Today' },
  { label: 'Volunteer Training', detail: 'Friday • 11:00 AM • Vellore', status: 'Planned' },
];

const volunteers = [
  { name: 'Anjali', task: 'Confirm transport', status: 'In progress' },
  { name: 'Rajan', task: 'Finalize posters', status: 'Pending' },
  { name: 'Meera', task: 'Coordinate hospital team', status: 'Completed' },
];

const responseRateData = [
  { period: 'Mon', rate: 76 },
  { period: 'Tue', rate: 82 },
  { period: 'Wed', rate: 88 },
  { period: 'Thu', rate: 79 },
  { period: 'Fri', rate: 91 },
  { period: 'Sat', rate: 83 },
];

const topHospitalsData = [
  { name: 'City Care', activity: 42 },
  { name: 'Grace', activity: 35 },
  { name: 'LifeLine', activity: 29 },
  { name: 'Hope Health', activity: 21 },
];

const engagementTrendsData = [
  { day: 'Mon', donors: 45 },
  { day: 'Tue', donors: 52 },
  { day: 'Wed', donors: 60 },
  { day: 'Thu', donors: 55 },
  { day: 'Fri', donors: 68 },
  { day: 'Sat', donors: 73 },
];

const alertResponseTimeData = [
  { type: 'Central', time: 18 },
  { type: 'North', time: 12 },
  { type: 'East', time: 14 },
  { type: 'South', time: 10 },
  { type: 'West', time: 16 },
];

const quickActionReplies = [
  { label: 'Approve', emoji: '✔', value: 'approve request' },
  { label: 'Reject', emoji: '✖', value: 'reject request' },
  { label: 'Forward', emoji: '🔗', value: 'forward to team' },
];

const CommunicationPage = () => {
  const [selectedInbox, setSelectedInbox] = useState<InboxItem>(inbox[0]);
  const [composeText, setComposeText] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'ai-welcome',
      role: 'ai',
      text: '👋 Hello! I am BloodConnect Assistant. I can help you manage messages, coordinate groups, and respond to urgent alerts.',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showGroupChat, setShowGroupChat] = useState(true);

  const responseRate = useMemo(() => responseRateData, []);
  const topHospitals = useMemo(() => topHospitalsData, []);
  const engagementTrends = useMemo(() => engagementTrendsData, []);
  const alertTimes = useMemo(() => alertResponseTimeData, []);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', text };
    setChatHistory((prev) => [...prev, userMessage]);
    setComposeText('');
    setLoading(true);

    try {
      const useBackend = import.meta.env.VITE_USE_AI_BACKEND === 'true';
      let aiResponse = 'Thanks, message queued for the communication team.';

      if (useBackend) {
        const { data } = await api.post('/generate-message', { prompt: text, context: { inbox, donors } });
        aiResponse = data?.text || aiResponse;
      }

      setChatHistory((prev) => [...prev, { id: `ai-${Date.now()}`, role: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error(error);
      setChatHistory((prev) => [...prev, { id: `ai-${Date.now()}`, role: 'ai', text: 'Unable to connect to the AI assistant right now. Please try again soon.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReply = (value: string) => {
    setComposeText(value);
  };

  const selectedInboxMessages = [
    { sender: selectedInbox.sender, text: selectedInbox.preview, time: selectedInbox.time, role: 'hospital' },
    { sender: 'You', text: 'We are coordinating a response team now and will update shortly.', time: 'now', role: 'user' },
  ];

  return (
    <div className="min-h-screen space-y-6 p-6 text-white">
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-4">
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Communication Hub</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Collaborate across hospitals, donors, and volunteers.</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-400">Manage announcements, inboxes, group workflows, and emergency alerts from a single fast interface.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { label: 'Announcements', value: 12, icon: '📢' },
                  { label: 'Hospital Messages', value: 8, icon: '🏥' },
                  { label: 'Emergency Alerts', value: 3, icon: '🚨' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-3xl bg-white/5 p-4 text-center">
                    <div className="text-2xl">{stat.icon}</div>
                    <p className="mt-3 text-sm text-slate-400">{stat.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.95fr_0.9fr]">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-black/20">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Inbox</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Recent messages</h2>
                </div>
                <div className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">{inbox.filter((item) => item.unread).length} unread</div>
              </div>
              <div className="mt-5 space-y-3">
                {inbox.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`w-full rounded-3xl border p-4 text-left transition ${selectedInbox.id === item.id ? 'border-cyan-500/30 bg-cyan-500/10' : 'border-white/10 bg-white/5 hover:border-cyan-400/20 hover:bg-white/10'}`}
                    onClick={() => setSelectedInbox(item)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{item.sender}</p>
                        <p className="mt-1 text-sm text-slate-400">{item.subject}</p>
                      </div>
                      <div className="space-y-1 text-right text-xs text-slate-500">
                        <span>{item.time}</span>
                        {item.unread && <span className="inline-flex rounded-full bg-rose-500/15 px-2 py-1 text-rose-300">New</span>}
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">{item.preview}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-black/20">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Compose</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Send a new message</h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                  <Mail className="h-4 w-4" /> Fast reply
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {['Bold', 'Italic', 'Link'].map((tool) => (
                  <button
                    key={tool}
                    type="button"
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-cyan-500/10"
                    onClick={() => {
                      if (tool === 'Bold') setComposeText((prev) => `${prev} **bold** `);
                      if (tool === 'Italic') setComposeText((prev) => `${prev} _italic_ `);
                      if (tool === 'Link') setComposeText((prev) => `${prev} [link](https://) `);
                    }}
                  >
                    {tool}
                  </button>
                ))}
              </div>
              <textarea
                className="mt-4 h-40 w-full resize-none rounded-3xl border border-white/10 bg-slate-950 px-4 py-4 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/10"
                placeholder="Compose message to hospital, donor, or volunteer group..."
                value={composeText}
                onChange={(e) => setComposeText(e.target.value)}
              />
              <div className="mt-4 flex flex-wrap gap-3">
                {quickActionReplies.map((reply) => (
                  <button
                    key={reply.label}
                    type="button"
                    className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/20"
                    onClick={() => handleQuickReply(reply.value)}
                  >
                    {reply.emoji} {reply.label}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => sendMessage(composeText)}
                  disabled={!composeText.trim() || loading}
                >
                  <Send className="h-4 w-4" /> Send
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                  onClick={() => setComposeText('')}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Announcements</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Recent updates</h2>
              </div>
              <div className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">Live</div>
            </div>
            <div className="mt-5 space-y-3">
              {announcements.map((item) => (
                <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Group Chat</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Hospital + donor coordination</h2>
              </div>
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${showGroupChat ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-slate-200 hover:bg-white/10'}`}
                onClick={() => setShowGroupChat((prev) => !prev)}
              >
                {showGroupChat ? 'Hide' : 'Show'} group chat
              </button>
            </div>
            {showGroupChat && (
              <div className="mt-5 space-y-4 rounded-3xl bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-cyan-500/20 text-cyan-300 grid place-items-center">H</div>
                  <div>
                    <p className="font-semibold text-white">Hospital Ops</p>
                    <p className="text-xs text-slate-400">Group chat with donor & hospital leads</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {selectedInboxMessages.map((item) => (
                    <div key={`${item.sender}-${item.time}`} className="rounded-3xl bg-slate-950/90 p-4">
                      <div className="flex items-center justify-between gap-3 text-sm text-slate-300">
                        <span>{item.sender}</span>
                        <span>{item.time}</span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-100">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Shared Documents</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Campaign assets</h2>
              </div>
              <div className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">Docs</div>
            </div>
            <div className="mt-5 space-y-3">
              {sharedDocs.map((doc) => (
                <div key={doc.name} className="flex items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-3xl bg-slate-900 p-3 text-cyan-300">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{doc.name}</p>
                      <p className="text-xs text-slate-400">{doc.type} file</p>
                    </div>
                  </div>
                  <button className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/20">Open</button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Event reminders</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Upcoming coordination</h2>
              </div>
              <CalendarDays className="h-5 w-5 text-cyan-300" />
            </div>
            <div className="mt-5 space-y-3">
              {reminders.map((reminder) => (
                <div key={reminder.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{reminder.label}</p>
                      <p className="text-xs text-slate-400">{reminder.detail}</p>
                    </div>
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">{reminder.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Volunteer Coordination</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Task assignments</h2>
              </div>
              <Users className="h-5 w-5 text-emerald-300" />
            </div>
            <div className="mt-5 space-y-3">
              {volunteers.map((vol) => (
                <div key={vol.name} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{vol.name}</p>
                      <p className="text-xs text-slate-400">{vol.task}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      vol.status === 'Completed'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : vol.status === 'In progress'
                        ? 'bg-amber-500/15 text-amber-300'
                        : 'bg-slate-700/60 text-slate-200'
                    }`}>
                      {vol.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="grid gap-4">
          <SectionCard title="Messaging Analytics" subtitle="Performance and engagement trends">
            <div className="grid gap-4 xl:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl shadow-black/20">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Response rate</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">Conversation speed</h3>
                  </div>
                  <Zap className="h-5 w-5 text-amber-400" />
                </div>
                <div className="mt-5 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={responseRate} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                      <XAxis dataKey="period" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" domain={[60, 100]} />
                      <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148, 163, 184, 0.2)' }} />
                      <Line type="monotone" dataKey="rate" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl shadow-black/20">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Donor engagement</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">Campaign trend</h3>
                  </div>
                  <BarChart3 className="h-5 w-5 text-cyan-300" />
                </div>
                <div className="mt-5 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementTrends} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                      <XAxis dataKey="day" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148, 163, 184, 0.2)' }} />
                      <Bar dataKey="donors" fill="#f97316" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Emergency Alerts" subtitle="Response time monitoring">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl shadow-black/20">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Alert response</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">Hospital reaction time</h3>
                </div>
                <AlertTriangle className="h-5 w-5 text-rose-400" />
              </div>
              <div className="mt-5 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={alertTimes} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                    <XAxis dataKey="type" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148, 163, 184, 0.2)' }} />
                    <Bar dataKey="time" fill="#a855f7" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Alerts & Metrics" subtitle="Top hospitals and quick actions">
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl shadow-black/20">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Top hospitals</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">Communication activity</h3>
                  </div>
                  <Users className="h-5 w-5 text-emerald-300" />
                </div>
                <div className="mt-5 space-y-3">
                  {topHospitals.map((hospital) => (
                    <div key={hospital.name} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div>
                        <p className="font-semibold text-white">{hospital.name}</p>
                        <p className="text-xs text-slate-400">Message activity</p>
                      </div>
                      <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">{hospital.activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl shadow-black/20">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Forecast</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">Donor notification trends</h3>
                  </div>
                  <TrendingUp className="h-5 w-5 text-violet-400" />
                </div>
                <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-300">Estimated donor engagement will increase by 14% with the new campaign update.</p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Emergency Response" subtitle="Critical alerts and coordination">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl shadow-black/20">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Hotspot alerts</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">Action required</h3>
                </div>
                <Activity className="h-5 w-5 text-amber-300" />
              </div>
              <div className="mt-5 space-y-3">
                {['Central zone demand up 24%', 'North hospital response time improving', 'East donor notification pending'].map((item) => (
                  <div key={item} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-semibold text-white">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default CommunicationPage;
