import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Award,
  BarChart3,
  ChartBar,
  Globe,
  Heart,
  Hospital,
  LucideIcon,
  MapPin,
  Megaphone,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import SectionCard from '../components/SectionCard';

const impactMetrics = [
  { label: 'Total Lives Saved', value: '1,284', icon: Heart, gradient: 'from-rose-500 to-pink-500', note: 'Across campaigns this year' },
  { label: 'Communities Reached', value: '38', icon: Globe, gradient: 'from-sky-500 to-cyan-500', note: 'Cities and towns supported' },
  { label: 'Hospitals Supported', value: '27', icon: Hospital, gradient: 'from-violet-500 to-indigo-500', note: 'Partner healthcare centers' },
  { label: 'Campaigns Completed', value: '512', icon: Megaphone, gradient: 'from-amber-500 to-orange-500', note: 'Successful outreach programs' },
  { label: 'Volunteers Engaged', value: '1,820', icon: Users, gradient: 'from-emerald-500 to-teal-500', note: 'Active volunteer heroes' },
];

const storyHighlights = [
  {
    title: 'Donor Hero: Kavya’s Journey',
    category: 'Donor Hero',
    summary: 'Kavya inspired 4 families by organizing a local blood collection drive that saved critical surgery cases.',
    icon: Star,
    tag: 'Inspiration',
  },
  {
    title: 'Hospital Success: City Care',
    category: 'Hospital Impact',
    summary: 'City Care reduced emergency wait time by 22% after partner donations reached their blood stock target.',
    icon: Hospital,
    tag: 'Collaboration',
  },
  {
    title: 'Community Event: Salem Drive',
    category: 'Outreach Event',
    summary: 'A weekend outreach event brought 180 donors and raised awareness in rural neighborhoods.',
    icon: Globe,
    tag: 'Community',
  },
];

const lifeSavedByMonth = [
  { month: 'Jan', value: 82 },
  { month: 'Feb', value: 94 },
  { month: 'Mar', value: 108 },
  { month: 'Apr', value: 121 },
  { month: 'May', value: 136 },
  { month: 'Jun', value: 149 },
  { month: 'Jul', value: 162 },
  { month: 'Aug', value: 175 },
  { month: 'Sep', value: 188 },
  { month: 'Oct', value: 198 },
  { month: 'Nov', value: 212 },
  { month: 'Dec', value: 226 },
];

const volunteerTrends = [
  { month: 'Jan', participants: 120 },
  { month: 'Feb', participants: 135 },
  { month: 'Mar', participants: 148 },
  { month: 'Apr', participants: 162 },
  { month: 'May', participants: 178 },
  { month: 'Jun', participants: 192 },
  { month: 'Jul', participants: 205 },
  { month: 'Aug', participants: 218 },
  { month: 'Sep', participants: 232 },
  { month: 'Oct', participants: 246 },
  { month: 'Nov', participants: 258 },
  { month: 'Dec', participants: 271 },
];

const campaignSuccess = [
  { name: 'Health Drives', rate: 94 },
  { name: 'School Outreach', rate: 88 },
  { name: 'Mobile Camps', rate: 91 },
];

const regionMarkers = [
  { name: 'Chennai', position: [13.0827, 80.2707], impact: '160 lives saved' },
  { name: 'Salem', position: [11.6643, 78.1460], impact: '94 lives saved' },
  { name: 'Madurai', position: [9.9252, 78.1198], impact: '110 lives saved' },
  { name: 'Tiruppur', position: [11.1080, 77.3411], impact: '75 lives saved' },
];

const badges = [
  { title: 'Community Builder', icon: Award, description: 'Top donor engagement for local drives.' },
  { title: 'Lifetime Hero', icon: Heart, description: 'Recognized for long-term lifesaving contributions.' },
  { title: 'Event Champion', icon: Sparkles, description: 'Led outreach efforts with outstanding volunteer turnout.' },
];

const milestones = [
  { label: '1000 lives saved', emoji: '🎯', detail: 'A major milestone for community health.' },
  { label: '500 campaigns completed', emoji: '📢', detail: 'Half a thousand successful outreach programs.' },
  { label: '75 partner hospitals', emoji: '🏥', detail: 'Trusted healthcare collaborators.' },
];

const impactIconClass = 'h-6 w-6 text-white';

const buildMarkerIcon = (color: string) =>
  L.divIcon({
    className: 'custom-impact-marker',
    html: `<div style="background:${color};border:2px solid rgba(255,255,255,0.85);border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;box-shadow:0 8px 20px rgba(0,0,0,0.3);">•</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

const SocialImpactPage = () => {
  const campaignSuccessRate = useMemo(
    () => Math.round(campaignSuccess.reduce((acc, item) => acc + item.rate, 0) / campaignSuccess.length),
    []
  );

  return (
    <div className="min-h-screen p-6 text-white">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-black/40">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full bg-rose-500/10 px-3 py-1 text-sm font-semibold text-rose-300">
                <Heart className="mr-2 h-4 w-4" /> Social Impact
              </div>
              <h1 className="mt-4 text-4xl font-semibold text-white">BloodConnect Impact Dashboard</h1>
              <p className="mt-3 max-w-2xl text-slate-400">Track lives saved, communities reached, volunteer momentum and campaign success with friendly social impact metrics.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center shadow-sm">
              <div className="text-sm uppercase tracking-[0.24em] text-slate-400">Future-ready insight</div>
              <div className="mt-3 text-3xl font-semibold text-white">AI impact forecasts soon</div>
              <p className="mt-2 text-sm text-slate-400">Extendable for predicting social reach and outreach ROI.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {impactMetrics.map((metric) => {
            const Icon = metric.icon as LucideIcon;
            return (
              <div key={metric.label} className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{metric.label}</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{metric.value}</p>
                  </div>
                  <div className={`rounded-3xl bg-gradient-to-br ${metric.gradient} p-4 shadow-xl shadow-${metric.gradient.split(' ')[1]}20`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-400">{metric.note}</p>
              </div>
            );
          })}
        </div>
      </div>

      <section className="mt-6 grid gap-6 xl:grid-cols-3">
        {storyHighlights.map((story) => {
          const Icon = story.icon as LucideIcon;
          return (
            <SectionCard key={story.title} title={story.title} subtitle={story.category} className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-3xl bg-cyan-500/10 p-3 text-cyan-300">
                  <Icon className={impactIconClass} />
                </div>
                <div>
                  <p className="text-sm text-slate-400">{story.summary}</p>
                </div>
              </div>
              <div className="mt-5 inline-flex items-center rounded-full bg-white/5 px-3 py-2 text-xs text-slate-300">{story.tag}</div>
            </SectionCard>
          );
        })}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Analytics & Tracking" subtitle="Monthly lives saved, volunteer growth and campaign success" className="xl:col-span-1">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Lives Saved</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">Per month</h3>
                </div>
                <BarChart3 className="h-5 w-5 text-cyan-300" />
              </div>
              <div className="mt-5 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lifeSavedByMonth} margin={{ top: 10, right: 0, left: -10, bottom: 5 }}>
                    <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148, 163, 184, 0.2)' }} />
                    <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Volunteer Trends</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">Participation growth</h3>
                </div>
                <TrendingUp className="h-5 w-5 text-emerald-300" />
              </div>
              <div className="mt-5 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volunteerTrends} margin={{ top: 10, right: 0, left: -10, bottom: 5 }}>
                    <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148, 163, 184, 0.2)' }} />
                    <Bar dataKey="participants" fill="#f97316" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Campaign success</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">Success rate</h3>
                </div>
                <span className="rounded-3xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{campaignSuccessRate}% avg</span>
              </div>
              <div className="mt-5 space-y-3">
                {campaignSuccess.map((item) => (
                  <div key={item.name} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-xs text-slate-400">Completion rate</p>
                      </div>
                      <div className="text-lg font-semibold text-slate-100">{item.rate}%</div>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${item.rate}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Regions impacted</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">Impact map</h3>
                </div>
                <MapPin className="h-5 w-5 text-cyan-300" />
              </div>
              <div className="mt-5 h-72 overflow-hidden rounded-3xl border border-white/10">
                <MapContainer center={[11.1271, 78.6569]} zoom={6} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                  <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {regionMarkers.map((region, index) => (
                    <Marker key={region.name} position={region.position as [number, number]} icon={buildMarkerIcon(index % 2 === 0 ? '#38bdf8' : '#9d7aed')}>
                      <Popup>
                        <div className="text-sm font-semibold text-slate-900">{region.name}</div>
                        <div className="text-xs text-slate-700">{region.impact}</div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Recognition & Motivation" subtitle="Badges, milestones, and celebration" className="space-y-6">
          <div className="grid gap-4">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-5 shadow-xl shadow-black/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.15),_transparent_35%)]" />
              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">New milestone</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">1000 lives saved</h3>
                  </div>
                  <div className="rounded-full bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-200">Unlocked</div>
                </div>
                <p className="mt-4 text-sm text-slate-300">Your community has crossed the 1000 lives saved threshold with continued donor and hospital support.</p>
                <div className="mt-6 grid grid-cols-4 gap-2">
                  {[...Array(8)].map((_, index) => (
                    <motion.div
                      key={index}
                      className="h-2 rounded-full bg-cyan-400/80"
                      initial={{ y: 0, opacity: 0 }}
                      animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.2, delay: index * 0.08, repeat: Infinity }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {badges.map((badge) => {
                const Icon = badge.icon as LucideIcon;
                return (
                  <div key={badge.title} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="rounded-3xl bg-slate-900/80 p-3 text-cyan-300">
                        <Icon className={impactIconClass} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{badge.title}</p>
                        <p className="text-sm text-slate-400">{badge.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-4">
              {milestones.map((milestone) => (
                <div key={milestone.label} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{milestone.emoji}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{milestone.label}</p>
                    </div>
                    <Sparkles className="h-6 w-6 text-amber-400" />
                  </div>
                  <p className="mt-4 text-sm text-slate-400">{milestone.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default SocialImpactPage;
