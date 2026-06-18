import { FormEvent, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Users,
  Droplet,
  Edit2,
  Trash2,
  Plus,
  Filter,
  Trophy,
  Award,
  Search,
  User,
  CheckCircle2,
} from 'lucide-react';

const initialCampaigns = [
  {
    id: 1,
    title: 'Chennai Blood Heroes Drive',
    location: 'Chennai',
    district: 'Chennai',
    date: '2026-07-10',
    status: 'Active',
    volunteers: 45,
    target: 200,
    collected: 156,
    organizer: 'Murugan Selvam',
    bloodType: 'A+',
    description: 'Annual blood donation drive at Chennai city center',
  },
  {
    id: 2,
    title: 'Coimbatore Life Savers Camp',
    location: 'Coimbatore',
    district: 'Coimbatore',
    date: '2026-07-15',
    status: 'Active',
    volunteers: 32,
    target: 150,
    collected: 98,
    organizer: 'Kavitha Rajan',
    bloodType: 'B+',
    description: 'Community blood camp organized by PSG college',
  },
  {
    id: 3,
    title: 'Madurai Emergency Blood Drive',
    location: 'Madurai',
    district: 'Madurai',
    date: '2026-07-20',
    status: 'Planned',
    volunteers: 28,
    target: 180,
    collected: 0,
    organizer: 'Senthil Kumar',
    bloodType: 'O+',
    description: 'Emergency drive for Meenakshi Mission Hospital',
  },
  {
    id: 4,
    title: 'Salem Donor Awareness Camp',
    location: 'Salem',
    district: 'Salem',
    date: '2026-06-25',
    status: 'Active',
    volunteers: 20,
    target: 100,
    collected: 67,
    organizer: 'Arun Prakash',
    bloodType: 'B-',
    description: 'Awareness camp for rare blood type donors',
  },
  {
    id: 5,
    title: 'Trichy Community Blood Fest',
    location: 'Tiruchirappalli',
    district: 'Tiruchirappalli',
    date: '2026-08-01',
    status: 'Planned',
    volunteers: 15,
    target: 120,
    collected: 0,
    organizer: 'Karthik Raja',
    bloodType: 'AB+',
    description: 'Festive blood donation event at Trichy',
  },
  {
    id: 6,
    title: 'Vellore CMC Blood Camp',
    location: 'Vellore',
    district: 'Vellore',
    date: '2026-05-20',
    status: 'Completed',
    volunteers: 60,
    target: 250,
    collected: 243,
    organizer: 'Sangeetha Mohan',
    bloodType: 'O-',
    description: 'Highly successful CMC hospital blood camp',
  },
  {
    id: 7,
    title: 'Tirunelveli Youth Donors Meet',
    location: 'Tirunelveli',
    district: 'Tirunelveli',
    date: '2026-08-15',
    status: 'Planned',
    volunteers: 18,
    target: 90,
    collected: 0,
    organizer: 'Deepa Sundaram',
    bloodType: 'A-',
    description: 'Youth focused blood donation awareness event',
  },
  {
    id: 8,
    title: 'Erode Annual Blood Donation',
    location: 'Erode',
    district: 'Erode',
    date: '2026-04-10',
    status: 'Completed',
    volunteers: 75,
    target: 300,
    collected: 289,
    organizer: 'Vijay Anand',
    bloodType: 'A+',
    description: 'Largest annual blood donation event in Erode',
  },
];

const volunteerHeroes = [
  { name: 'Murugan Selvam', donations: 156, badge: 'Champion' },
  { name: 'Kavitha Rajan', donations: 98, badge: 'Star Donor' },
  { name: 'Vijay Anand', donations: 289, badge: 'Hero' },
];

const statusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30';
    case 'Planned':
      return 'bg-blue-500/15 text-blue-200 border border-blue-500/30';
    case 'Completed':
      return 'bg-slate-500/15 text-slate-200 border border-slate-500/30';
    default:
      return 'bg-slate-500/15 text-slate-200 border border-slate-500/30';
  }
};

const bloodBadgeColor = (bloodType: string) => {
  switch (bloodType) {
    case 'A+':
    case 'A-':
      return 'bg-red-500/10 text-red-200';
    case 'B+':
    case 'B-':
      return 'bg-sky-500/10 text-sky-200';
    case 'O+':
    case 'O-':
      return 'bg-emerald-500/10 text-emerald-200';
    case 'AB+':
    case 'AB-':
      return 'bg-violet-500/10 text-violet-200';
    default:
      return 'bg-slate-500/10 text-slate-200';
  }
};

const getMedalEmoji = (index: number) => ['🥇', '🥈', '🥉'][index] || '';

const DashboardCampaigns = () => {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  const filteredCampaigns = useMemo(
    () =>
      campaigns.filter((campaign) => {
        const statusMatch = filterStatus === 'All' || campaign.status === filterStatus;
        const searchMatch = !searchQuery || campaign.title.toLowerCase().includes(searchQuery.toLowerCase());
        return statusMatch && searchMatch;
      }),
    [campaigns, filterStatus, searchQuery]
  );

  const totals = useMemo(
    () => ({
      total: campaigns.length,
      active: campaigns.filter((campaign) => campaign.status === 'Active').length,
      planned: campaigns.filter((campaign) => campaign.status === 'Planned').length,
      completed: campaigns.filter((campaign) => campaign.status === 'Completed').length,
    }),
    [campaigns]
  );

  const topCampaigns = useMemo(
    () => [...campaigns].sort((a, b) => b.collected - a.collected).slice(0, 3),
    [campaigns]
  );

  const handleView = (id: number) => console.log('View campaign', id);
  const handleEdit = (id: number) => console.log('Edit campaign', id);
  const handleDelete = (id: number) => setCampaigns((prev) => prev.filter((campaign) => campaign.id !== id));

  const handleCreateCampaign = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get('title') || '').trim();
    const location = String(form.get('location') || '').trim();
    const date = String(form.get('date') || '').trim();
    const target = Number(form.get('target') || 0);
    const bloodType = String(form.get('bloodType') || 'A+');
    const organizer = String(form.get('organizer') || '').trim();
    const description = String(form.get('description') || '').trim();

    if (!title || !location || !date || !target || !organizer) {
      return;
    }

    const newCampaign = {
      id: Date.now(),
      title,
      location,
      district: location,
      date,
      status: 'Planned',
      volunteers: 0,
      target,
      collected: 0,
      organizer,
      bloodType,
      description,
    };

    setCampaigns((prev) => [newCampaign, ...prev]);
    setShowNewModal(false);
    event.currentTarget.reset();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Campaign Management</h2>
          <p className="text-sm text-slate-400">Plan and track outreach performance across Tamil Nadu.</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-red-500 to-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-300">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="text-xs uppercase tracking-[0.28em] text-slate-400">Total Campaigns</span>
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">{totals.total}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-300">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-xs uppercase tracking-[0.28em] text-emerald-300">Active</span>
          </div>
          <p className="mt-4 text-3xl font-semibold text-emerald-200">{totals.active}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="rounded-2xl bg-yellow-500/10 p-3 text-yellow-300">
              <Calendar className="h-5 w-5" />
            </div>
            <span className="text-xs uppercase tracking-[0.28em] text-yellow-300">Planned</span>
          </div>
          <p className="mt-4 text-3xl font-semibold text-yellow-200">{totals.planned}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="rounded-2xl bg-slate-500/10 p-3 text-slate-300">
              <Trophy className="h-5 w-5" />
            </div>
            <span className="text-xs uppercase tracking-[0.28em] text-slate-300">Completed</span>
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-200">{totals.completed}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-2">
            {['All', 'Active', 'Planned', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filterStatus === status
                    ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campaign name"
              className="w-full rounded-full border border-white/10 bg-slate-900/90 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {filteredCampaigns.map((campaign, idx) => {
          const progress = Math.round((campaign.collected / campaign.target) * 100);
          return (
            <motion.div
              key={campaign.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-sm hover:border-white/20 hover:bg-slate-900/95 transition"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{campaign.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{campaign.description}</p>
                </div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusColor(campaign.status)}`}>
                  {campaign.status}
                </span>
              </div>

              <div className="space-y-3 text-sm text-slate-300 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  {campaign.location}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  {campaign.date}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Droplet className="h-4 w-4 text-red-400" />
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${bloodBadgeColor(campaign.bloodType)}`}>
                    {campaign.bloodType}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-500" />
                  {campaign.volunteers} volunteers
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-500" />
                  Organized by {campaign.organizer}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>{campaign.collected}/{campaign.target} units</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.05 + 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleView(campaign.id)}
                  className="flex-1 rounded-2xl bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10 transition"
                >
                  👁️ View
                </button>
                <button
                  onClick={() => handleEdit(campaign.id)}
                  className="rounded-2xl bg-cyan-500/15 px-3 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/25 transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(campaign.id)}
                  className="rounded-2xl bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/25 transition"
                >
                  🗑️ Delete
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/80 p-12 text-center text-slate-400">
          No campaigns found. Try adjusting your filters.
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <Trophy className="h-6 w-6 text-amber-400" />
            <h3 className="text-xl font-semibold text-white">Top Campaigns by Collections</h3>
          </div>
          <div className="grid gap-4">
            {topCampaigns.map((campaign, idx) => (
              <motion.div
                key={campaign.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.08 }}
                className="rounded-3xl border border-white/10 bg-slate-900/80 p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">{getMedalEmoji(idx)}</div>
                  <div>
                    <p className="font-semibold text-white">{campaign.title}</p>
                    <p className="text-sm text-slate-400">{campaign.location}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-white/5 p-4 text-center">
                  <p className="text-3xl font-bold text-rose-200">{campaign.collected}</p>
                  <p className="text-xs text-slate-400">units collected</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <Award className="h-6 w-6 text-fuchsia-400" />
            <h3 className="text-xl font-semibold text-white">Volunteer Heroes</h3>
          </div>
          <div className="grid gap-4">
            {volunteerHeroes.map((hero, idx) => (
              <motion.div
                key={hero.name}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.08 }}
                className="rounded-3xl border border-white/10 bg-slate-900/80 p-4"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15 text-white text-lg font-bold">
                    {hero.name
                      .split(' ')
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{hero.name}</p>
                    <p className="text-sm text-slate-400">{hero.badge}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4 text-sm text-slate-300">
                  <span>Donation Count</span>
                  <span className="font-semibold text-white">{hero.donations}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showNewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950/95 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-semibold text-white">Create New Campaign</h3>
                  <p className="text-sm text-slate-400">Add a new campaign and align your field team instantly.</p>
                </div>
                <button
                  onClick={() => setShowNewModal(false)}
                  className="rounded-2xl bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 transition"
                >
                  Cancel
                </button>
              </div>
              <form onSubmit={handleCreateCampaign} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-slate-300">
                    Campaign Title
                    <input name="title" required className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm text-white focus:border-slate-400 focus:outline-none" />
                  </label>
                  <label className="block text-sm text-slate-300">
                    Location
                    <input name="location" required className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm text-white focus:border-slate-400 focus:outline-none" />
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-slate-300">
                    Date
                    <input name="date" type="date" required className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm text-white focus:border-slate-400 focus:outline-none" />
                  </label>
                  <label className="block text-sm text-slate-300">
                    Target Donations
                    <input name="target" type="number" min="1" required className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm text-white focus:border-slate-400 focus:outline-none" />
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-slate-300">
                    Blood Type Needed
                    <select name="bloodType" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm text-white focus:border-slate-400 focus:outline-none">
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm text-slate-300">
                    Organizer Name
                    <input name="organizer" required className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm text-white focus:border-slate-400 focus:outline-none" />
                  </label>
                </div>
                <label className="block text-sm text-slate-300">
                  Description
                  <textarea name="description" rows={4} className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm text-white focus:border-slate-400 focus:outline-none" placeholder="Describe campaign goals and focus area" />
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button type="button" onClick={() => setShowNewModal(false)} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10 transition">
                    Cancel
                  </button>
                  <button type="submit" className="rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 px-5 py-3 text-sm font-semibold text-white hover:brightness-110 transition">
                    Create Campaign
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DashboardCampaigns;
