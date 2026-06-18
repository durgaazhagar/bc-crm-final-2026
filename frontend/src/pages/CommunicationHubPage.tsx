import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Megaphone,
  Heart,
  Target,
  AlertTriangle,
  Send,
  CheckCircle,
  XCircle,
  Share2,
  Users,
  FileText,
  Clock,
  TrendingUp,
  BarChart3,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Paperclip,
  Smile,
  Bell,
  Hospital,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Message {
  id: number;
  sender: string;
  senderType: 'hospital' | 'donor' | 'system';
  subject: string;
  message: string;
  timestamp: string;
  unread: boolean;
  avatar: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  type: 'drive' | 'awareness' | 'training';
  priority: 'high' | 'medium' | 'low';
}

interface VolunteerTask {
  id: number;
  volunteer: string;
  task: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
}

const CommunicationHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'inbox' | 'compose' | 'collaboration' | 'analytics'>('overview');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'Apollo Hospital',
      senderType: 'hospital',
      subject: 'Emergency O+ Request',
      message: 'Urgent request for 5 units of O+ blood for ICU patient.',
      timestamp: '5m ago',
      unread: true,
      avatar: '🏥',
    },
    {
      id: 2,
      sender: 'Rajesh Kumar',
      senderType: 'donor',
      subject: 'Donation Confirmation',
      message: 'I want to donate on Saturday. Please confirm the timing.',
      timestamp: '15m ago',
      unread: true,
      avatar: '❤️',
    },
    {
      id: 3,
      sender: 'Campaign Manager',
      senderType: 'system',
      subject: 'Blood Drive Update',
      message: 'Monthly blood drive scheduled for next week.',
      timestamp: '1h ago',
      unread: false,
      avatar: '🎯',
    },
  ]);

  const [composeOpen, setComposeOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [composeContent, setComposeContent] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'unread'>('newest');
  const [groupChat, setGroupChat] = useState(false);

  // Dashboard Overview Data
  const dashboardStats = [
    {
      id: 1,
      icon: '📢',
      label: 'Recent Announcements',
      count: 12,
      trend: '+5',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      id: 2,
      icon: '🏥',
      label: 'Hospital Messages',
      count: 8,
      trend: '+2',
      color: 'from-green-600 to-emerald-600',
    },
    {
      id: 3,
      icon: '❤️',
      label: 'Donor Notifications',
      count: 24,
      trend: '+8',
      color: 'from-red-600 to-pink-600',
    },
    {
      id: 4,
      icon: '🎯',
      label: 'Campaign Updates',
      count: 5,
      trend: '+1',
      color: 'from-purple-600 to-violet-600',
    },
    {
      id: 5,
      icon: '🚨',
      label: 'Emergency Alerts',
      count: 2,
      trend: '-1',
      color: 'from-orange-600 to-red-600',
    },
  ];

  // Analytics Data
  const messageResponseData = [
    { day: 'Mon', rate: 85 },
    { day: 'Tue', rate: 88 },
    { day: 'Wed', rate: 92 },
    { day: 'Thu', rate: 78 },
    { day: 'Fri', rate: 95 },
    { day: 'Sat', rate: 82 },
    { day: 'Sun', rate: 70 },
  ];

  const hospitalActivityData = [
    { hospital: 'Apollo', messages: 45 },
    { hospital: 'Max', messages: 38 },
    { hospital: 'Fortis', messages: 32 },
    { hospital: 'Medanta', messages: 28 },
    { hospital: 'Others', messages: 57 },
  ];

  const donorEngagementData = [
    { name: 'Highly Engaged', value: 45 },
    { name: 'Moderately Engaged', value: 35 },
    { name: 'Low Engagement', value: 20 },
  ];

  const emergencyResponseData = [
    { category: '0-15 min', time: 12 },
    { category: '15-30 min', time: 8 },
    { category: '30-60 min', time: 5 },
    { category: '60+ min', time: 2 },
  ];

  // Collaboration Data
  const events: Event[] = [
    {
      id: 1,
      title: 'Monthly Blood Drive - Downtown',
      date: '2024-07-15',
      type: 'drive',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Health Awareness Program',
      date: '2024-07-20',
      type: 'awareness',
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Volunteer Training Session',
      date: '2024-07-25',
      type: 'training',
      priority: 'medium',
    },
  ];

  const volunteerTasks: VolunteerTask[] = [
    {
      id: 1,
      volunteer: 'Priya Sharma',
      task: 'Organize blood drive registration',
      status: 'in-progress',
      dueDate: '2024-07-15',
    },
    {
      id: 2,
      volunteer: 'Amit Patel',
      task: 'Coordinate with hospitals',
      status: 'pending',
      dueDate: '2024-07-18',
    },
    {
      id: 3,
      volunteer: 'Sarah Khan',
      task: 'Update donor guidelines document',
      status: 'completed',
      dueDate: '2024-07-10',
    },
  ];

  const unreadCount = messages.filter((m) => m.unread).length;

  const sortedMessages = React.useMemo(() => {
    const copy = [...messages];
    if (sortBy === 'unread') return copy.sort((a, b) => Number(b.unread) - Number(a.unread));
    return copy.sort((a, b) => (sortBy === 'newest' ? b.id - a.id : a.id - b.id));
  }, [messages, sortBy]);

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 p-3">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Communication Hub</h1>
              <p className="mt-1 text-slate-400">Centralized messaging & collaboration platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-lg bg-slate-700/40 px-3 py-2 text-slate-200 hover:bg-slate-600">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setComposeOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all"
            >
              <Plus className="h-5 w-5" />
              New Message
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-2 overflow-x-auto">
        {['overview', 'inbox', 'compose', 'collaboration', 'analytics'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 font-medium transition-all ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Dashboard Stats */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {dashboardStats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-xl border border-white/10 bg-gradient-to-br ${stat.color} p-6 text-white shadow-xl`}
              >
                <div className="mb-3 text-4xl">{stat.icon}</div>
                <p className="text-sm opacity-90">{stat.label}</p>
                <div className="mt-3 flex items-end justify-between">
                  <p className="text-3xl font-bold">{stat.count}</p>
                  <p className="text-sm font-semibold text-green-200">{stat.trend}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Recent Messages</h2>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <div className="space-y-3">
              {messages.slice(0, 3).map((msg) => (
                <motion.div
                  key={msg.id}
                  whileHover={{ x: 5 }}
                  className={`cursor-pointer rounded-lg border border-white/10 p-4 transition-all ${
                    msg.unread ? 'bg-blue-600/20' : 'bg-white/5'
                  } hover:bg-white/10`}
                  onClick={() => setSelectedMessage(msg)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1 text-2xl">{msg.avatar}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{msg.sender}</p>
                        <p className="text-sm text-slate-400">{msg.subject}</p>
                        <p className="mt-1 line-clamp-1 text-sm text-slate-300">{msg.message}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">{msg.timestamp}</p>
                      {msg.unread && <div className="mt-2 h-2 w-2 rounded-full bg-blue-500" />}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* INBOX TAB */}
      {activeTab === 'inbox' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full rounded-lg border border-white/10 bg-slate-700/50 py-2 pl-10 pr-4 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-white/10 bg-slate-700/50 px-4 py-2 text-slate-300 hover:bg-slate-600"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="unread">Sort: Unread</option>
            </select>
            <button className="rounded-lg border border-white/10 bg-slate-700/50 px-4 py-2 text-slate-300 hover:bg-slate-600">
              <Filter className="h-5 w-5" />
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl divide-y divide-white/10">
            {sortedMessages.map((msg) => (
              <motion.div
                key={msg.id}
                whileHover={{ x: 5 }}
                className="cursor-pointer p-4 hover:bg-white/10 transition-all"
                onClick={() => setSelectedMessage(msg)}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{msg.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-white">{msg.sender}</p>
                      <span className="text-xs text-slate-400">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm text-slate-300">{msg.subject}</p>
                    <p className="line-clamp-1 mt-1 text-sm text-slate-400">{msg.message}</p>
                  </div>
                  {msg.unread && <div className="h-3 w-3 rounded-full bg-blue-500 flex-shrink-0" />}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message Details */}
          {selectedMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Message Details</h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-400">From</p>
                  <p className="text-white">{selectedMessage.sender}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Subject</p>
                  <p className="text-white">{selectedMessage.subject}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Message</p>
                  <p className="mt-2 text-slate-200">{selectedMessage.message}</p>
                </div>
                <div className="flex gap-2 pt-4">
                  <button className="flex items-center gap-2 rounded-lg bg-green-600/20 px-4 py-2 text-green-300 hover:bg-green-600/30">
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </button>
                  <button className="flex items-center gap-2 rounded-lg bg-red-600/20 px-4 py-2 text-red-300 hover:bg-red-600/30">
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                  <button className="flex items-center gap-2 rounded-lg bg-blue-600/20 px-4 py-2 text-blue-300 hover:bg-blue-600/30">
                    <Share2 className="h-4 w-4" />
                    Forward
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* COMPOSE TAB */}
      {activeTab === 'compose' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">Compose Message ✉️</h2>

            <div className="space-y-4">
              {/* Recipient */}
              <div>
                <label className="block text-sm font-medium text-slate-300">Send to</label>
                <select className="mt-2 w-full rounded-lg border border-white/10 bg-slate-700/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none">
                  <option>Individual Donor</option>
                  <option>All Donors</option>
                  <option>Hospital</option>
                  <option>Volunteer Group</option>
                </select>
                <div className="mt-2 flex items-center gap-2">
                  <input id="groupChat" type="checkbox" checked={groupChat} onChange={(e) => setGroupChat(e.target.checked)} className="h-4 w-4 rounded bg-slate-600" />
                  <label htmlFor="groupChat" className="text-sm text-slate-300">Enable Group Chat (Hospital + Donor coordination)</label>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-slate-300">Subject</label>
                <input
                  type="text"
                  placeholder="Enter message subject"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-slate-700/50 px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Rich Text Editor */}
              <div>
                <label className="block text-sm font-medium text-slate-300">Message</label>
                <div className="mt-2 rounded-lg border border-white/10 bg-slate-700/30 p-3">
                  <div className="mb-3 flex gap-2 border-b border-white/10 pb-3">
                    <button className="rounded px-3 py-1 hover:bg-white/10 text-slate-300">
                      <strong>B</strong>
                    </button>
                    <button className="rounded px-3 py-1 hover:bg-white/10 text-slate-300">
                      <em>I</em>
                    </button>
                    <button className="rounded px-3 py-1 hover:bg-white/10 text-slate-300">
                      <u>U</u>
                    </button>
                    <div className="flex-1" />
                    <Smile className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="mt-2">
                    <ReactQuill
                      value={composeContent}
                      onChange={(val) => setComposeContent(val)}
                      theme="snow"
                      modules={{ toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link', 'image']] }}
                      className="bg-white text-black rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className="flex gap-2">
                <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-700/50 px-4 py-2 text-slate-300 hover:bg-slate-600">
                  <Paperclip className="h-4 w-4" />
                  Attach Files
                </button>
              </div>

              {/* Send Button */}
              <div className="flex gap-3 pt-4">
                <button className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2">
                  <Send className="h-5 w-5" />
                  Send Message
                </button>
                <button className="rounded-lg border border-white/10 bg-slate-700/50 px-6 py-3 font-semibold text-slate-300 hover:bg-slate-600">
                  Save as Draft
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* COLLABORATION TAB */}
      {activeTab === 'collaboration' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid gap-6 lg:grid-cols-2"
        >
          {/* Shared Documents */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">📂 Shared Documents</h3>
            </div>
            <div className="space-y-2">
              {['Campaign Flyers 2024', 'Donor Guidelines', 'Hospital Protocols', 'Volunteer Handbook'].map((doc) => (
                <motion.button
                  key={doc}
                  whileHover={{ x: 5 }}
                  className="w-full rounded-lg border border-white/10 bg-slate-700/30 p-3 text-left text-slate-300 hover:bg-slate-600/30 hover:text-white transition-all flex items-center justify-between"
                >
                  <span>{doc}</span>
                  <span className="text-slate-500">→</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Event Reminders */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-6 w-6 text-orange-400" />
              <h3 className="text-xl font-bold text-white">⏰ Event Reminders</h3>
            </div>
            <div className="space-y-2">
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  whileHover={{ x: 5 }}
                  className={`rounded-lg border border-white/10 p-3 ${
                    event.priority === 'high' ? 'bg-red-600/20' : 'bg-slate-700/30'
                  }`}
                >
                  <p className="font-medium text-white">{event.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{event.date}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Volunteer Coordination */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">👤 Volunteer Coordination</h3>
            </div>
            <div className="space-y-2">
              {volunteerTasks.map((task) => (
                <motion.div
                  key={task.id}
                  whileHover={{ x: 5 }}
                  className="rounded-lg border border-white/10 bg-slate-700/30 p-4 flex items-start justify-between hover:bg-slate-600/30 transition-all"
                >
                  <div>
                    <p className="font-medium text-white">{task.volunteer}</p>
                    <p className="text-sm text-slate-400">{task.task}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        task.status === 'completed'
                          ? 'bg-green-600/30 text-green-300'
                          : task.status === 'in-progress'
                          ? 'bg-blue-600/30 text-blue-300'
                          : 'bg-yellow-600/30 text-yellow-300'
                      }`}
                    >
                      {task.status}
                    </span>
                    <span className="text-xs text-slate-400">{task.dueDate}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid gap-6"
        >
          {/* Message Response Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
          >
            <h3 className="mb-4 text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-400" />
              📊 Message Response Rate
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={messageResponseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Hospitals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
            >
              <h3 className="mb-4 text-xl font-bold text-white flex items-center gap-2">
                <Hospital className="h-6 w-6 text-green-400" />
                🏥 Top Hospitals by Activity
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hospitalActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="hospital" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="messages" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Donor Engagement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
            >
              <h3 className="mb-4 text-xl font-bold text-white flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-400" />
                ❤️ Donor Engagement Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={donorEngagementData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                    {donorEngagementData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Emergency Response Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 lg:col-span-2"
            >
              <h3 className="mb-4 text-xl font-bold text-white flex items-center gap-2">
                <Zap className="h-6 w-6 text-yellow-400" />
                ⏱ Emergency Alert Response Time
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={emergencyResponseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="category" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="time" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Compose Modal */}
      {composeOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-end justify-end bg-black/50 p-4"
        >
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-800 backdrop-blur-xl p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">New Message ✉️</h2>
              <button onClick={() => setComposeOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="To"
                className="w-full rounded-lg border border-white/10 bg-slate-700/50 px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full rounded-lg border border-white/10 bg-slate-700/50 px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
              <textarea
                placeholder="Message..."
                rows={4}
                className="w-full rounded-lg border border-white/10 bg-slate-700/50 px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none resize-none"
              />
              <div className="flex gap-2 pt-4">
                <button className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
                  Send
                </button>
                <button
                  onClick={() => setComposeOpen(false)}
                  className="flex-1 rounded-lg border border-white/10 bg-slate-700/50 px-4 py-2 font-semibold text-slate-300 hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CommunicationHubPage;
