import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Droplet, Edit2, Trash2, Plus, Filter, Trophy, Star, Award, Zap } from 'lucide-react';

const campaignsData = [
  { id: 1, title: "Chennai Blood Heroes Drive", location: "Chennai", district: "Chennai", date: "2026-07-10", status: "Active", volunteers: 45, target: 200, collected: 156, organizer: "Murugan Selvam" },
  { id: 2, title: "Coimbatore Life Savers Camp", location: "Coimbatore", district: "Coimbatore", date: "2026-07-15", status: "Active", volunteers: 32, target: 150, collected: 98, organizer: "Kavitha Rajan" },
  { id: 3, title: "Madurai Emergency Blood Drive", location: "Madurai", district: "Madurai", date: "2026-07-20", status: "Planned", volunteers: 28, target: 180, collected: 0, organizer: "Senthil Kumar" },
  { id: 4, title: "Salem Donor Awareness Camp", location: "Salem", district: "Salem", date: "2026-06-25", status: "Active", volunteers: 20, target: 100, collected: 67, organizer: "Arun Prakash" },
  { id: 5, title: "Trichy Community Blood Fest", location: "Tiruchirappalli", district: "Tiruchirappalli", date: "2026-08-01", status: "Planned", volunteers: 15, target: 120, collected: 0, organizer: "Karthik Raja" },
  { id: 6, title: "Vellore CMC Blood Camp", location: "Vellore", district: "Vellore", date: "2026-05-20", status: "Completed", volunteers: 60, target: 250, collected: 243, organizer: "Sangeetha Mohan" },
  { id: 7, title: "Tirunelveli Youth Donors Meet", location: "Tirunelveli", district: "Tirunelveli", date: "2026-08-15", status: "Planned", volunteers: 18, target: 90, collected: 0, organizer: "Deepa Sundaram" },
  { id: 8, title: "Erode Annual Blood Donation", location: "Erode", district: "Erode", date: "2026-04-10", status: "Completed", volunteers: 75, target: 300, collected: 289, organizer: "Vijay Anand" }
];

const volunteerRewards = [
  { name: "Vijay Anand", donations: 289, badge: "🏆 Champion" },
  { name: "Sangeetha Mohan", donations: 243, badge: "⭐ Star Donor" },
  { name: "Murugan Selvam", donations: 156, badge: "🎖️ Regular Hero" },
];

const CampaignPage = () => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  const districts = useMemo(() => [...new Set(campaignsData.map((c) => c.district))], []);

  const filteredCampaigns = useMemo(() => {
    return campaignsData.filter((campaign) => {
      const statusMatch = filterStatus === 'All' || campaign.status === filterStatus;
      const districtMatch = !filterDistrict || campaign.district === filterDistrict;
      return statusMatch && districtMatch;
    });
  }, [filterStatus, filterDistrict]);

  const totals = useMemo(() => {
    return {
      total: campaignsData.length,
      active: campaignsData.filter((c) => c.status === 'Active').length,
      planned: campaignsData.filter((c) => c.status === 'Planned').length,
      completed: campaignsData.filter((c) => c.status === 'Completed').length,
    };
  }, []);

  const topCampaigns = useMemo(() => {
    return [...campaignsData].sort((a, b) => b.collected - a.collected).slice(0, 3);
  }, []);

  const statusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30';
      case 'Planned':
        return 'bg-blue-500/20 text-blue-200 border-blue-500/30';
      case 'Completed':
        return 'bg-slate-500/20 text-slate-200 border-slate-500/30';
      default:
        return 'bg-slate-500/20 text-slate-200';
    }
  };

  const getMedalEmoji = (index: number) => {
    const medals = ['🥇', '🥈', '🥉'];
    return medals[index] || '';
  };

  const handleView = (id: number) => console.log('View campaign', id);
  const handleEdit = (id: number) => console.log('Edit campaign', id);
  const handleDelete = (id: number) => console.log('Delete campaign', id);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Campaign Management</h2>
          <p className="text-sm text-slate-400">Plan and track outreach performance across Tamil Nadu.</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 px-6 py-3 font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-red-500/20 transition flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          New Campaign
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0 }} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">🎯 Total Campaigns</p>
          <p className="mt-3 text-3xl font-semibold text-white">{totals.total}</p>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">✅ Active</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-200">{totals.active}</p>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-blue-400">📅 Planned</p>
          <p className="mt-3 text-3xl font-semibold text-blue-200">{totals.planned}</p>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">✔️ Completed</p>
          <p className="mt-3 text-3xl font-semibold text-slate-200">{totals.completed}</p>
        </motion.div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <Filter className="h-5 w-5 text-slate-400" />
          <div className="flex gap-2">
            {['All', 'Active', 'Planned', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  filterStatus === status
                    ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="ml-auto rounded-2xl border border-white/10 bg-slate-950/80 py-2 px-4 text-sm text-white focus:border-slate-400 focus:outline-none"
          >
            <option value="">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCampaigns.map((campaign, idx) => {
          const progress = (campaign.collected / campaign.target) * 100;
          return (
            <motion.div
              key={campaign.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm hover:border-white/20 hover:bg-white/8 transition"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{campaign.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">by {campaign.organizer}</p>
                </div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold border ${statusColor(campaign.status)} whitespace-nowrap`}>
                  {campaign.status}
                </span>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  {campaign.location}
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  {new Date(campaign.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Users className="h-4 w-4 text-slate-500" />
                  {campaign.volunteers} volunteers
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Droplet className="h-4 w-4 text-red-400" />
                    {campaign.collected}/{campaign.target} units
                  </div>
                  <span className="text-xs font-semibold text-slate-300">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.05 + 0.2 }}
                    className="h-full bg-gradient-to-r from-red-500 to-rose-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleView(campaign.id)}
                  className="flex-1 rounded-2xl bg-slate-700/50 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-600 transition"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleEdit(campaign.id)}
                  className="rounded-2xl bg-cyan-500/15 p-2 text-cyan-200 hover:bg-cyan-500/25 transition"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(campaign.id)}
                  className="rounded-2xl bg-red-500/15 p-2 text-red-200 hover:bg-red-500/25 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-12 text-center text-slate-400">
          No campaigns found. Try adjusting your filters.
        </div>
      )}

      {/* Top Campaign Leaderboard */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-amber-400" />
          Top Campaigns by Collections
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topCampaigns.map((campaign, idx) => (
            <motion.div
              key={campaign.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{getMedalEmoji(idx)}</span>
                <div>
                  <p className="font-semibold text-white">{campaign.title}</p>
                  <p className="text-xs text-slate-400">{campaign.location}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-3 text-center">
                <p className="text-2xl font-bold text-rose-200">{campaign.collected}</p>
                <p className="text-xs text-slate-400">units collected</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Gamification Rewards */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Zap className="h-6 w-6 text-yellow-400" />
          Top Volunteers & Rewards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {volunteerRewards.map((reward, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 text-center hover:border-white/20 transition"
            >
              <div className="text-4xl mb-3">{reward.badge}</div>
              <p className="font-semibold text-white">{reward.name}</p>
              <p className="text-sm text-slate-400 mt-1">{reward.donations} units donated</p>
              <div className="mt-3 rounded-full bg-white/10 px-3 py-1 text-xs text-amber-200 inline-block">
                {reward.badge.split(' ')[1]}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CampaignPage;

