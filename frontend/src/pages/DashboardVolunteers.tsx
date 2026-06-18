import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users, Medal, ClipboardCheck, MessageCircle, CalendarDays, HeartHandshake } from 'lucide-react';

const topVolunteers = [
  { id: 1, name: 'Meena Kumari', role: 'Field Coordinator', matches: 28, status: 'Active' },
  { id: 2, name: 'Arjun Rao', role: 'Donation Outreach', matches: 22, status: 'Active' },
  { id: 3, name: 'Nisha Patel', role: 'Emergency Responder', matches: 18, status: 'Pending' },
];

const prompts = [
  'Send a volunteer alert for urgent O- donors near Chennai.',
  'Show volunteers available for hospital collection shifts this week.',
  'Recommend rewards for top volunteer performers.',
  'List volunteers who can support the next blood drive.',
];

const features = [
  { icon: <Users className="h-5 w-5" />, title: 'Volunteer directory', description: 'Browse active volunteers, availability, and roles.' },
  { icon: <ClipboardCheck className="h-5 w-5" />, title: 'Shift scheduling', description: 'Plan events, reserve volunteer slots, and track participation.' },
  { icon: <Medal className="h-5 w-5" />, title: 'Rewards tracking', description: 'Recognize engagement with badges, points, and incentives.' },
  { icon: <MessageCircle className="h-5 w-5" />, title: 'AI prompts', description: 'Use guided prompts to manage urgent requests and campaigns.' },
];

const DashboardVolunteers = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold">Volunteer Management</h2>
          <p className="mt-2 text-slate-400 max-w-2xl">Track volunteer engagement, assign urgent response tasks, and surface prompts for faster coordination.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/15">
            <Sparkles className="h-4 w-4" /> Request Volunteer Support
          </button>
          <button className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-rose-500 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:brightness-105">
            <CalendarDays className="h-4 w-4" /> Schedule Shift
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-lg">
          <div className="flex items-center gap-4 text-rose-400">
            <Users className="h-6 w-6" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Active Volunteers</p>
              <p className="mt-2 text-3xl font-semibold text-white">134</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-400">Volunteers ready for urgent donor mobilization and hospital support.</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-lg">
          <div className="flex items-center gap-4 text-cyan-400">
            <HeartHandshake className="h-6 w-6" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Matches Completed</p>
              <p className="mt-2 text-3xl font-semibold text-white">482</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-400">Confirmed donor pairings and successful mission responses this month.</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-lg">
          <div className="flex items-center gap-4 text-amber-400">
            <Medal className="h-6 w-6" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Rewarded Volunteers</p>
              <p className="mt-2 text-3xl font-semibold text-white">18</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-400">Volunteers recognized for top performance, reliability, and emergency response.</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.65fr_0.35fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-lg">
          <h3 className="text-xl font-semibold">Volunteer prompts</h3>
          <p className="mt-2 text-slate-400">Use these prompts to keep your team focused on urgent needs and community outreach.</p>
          <div className="mt-5 space-y-3">
            {prompts.map((text) => (
              <div key={text} className="rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-500/30 hover:bg-white/10">
                <p className="text-sm text-slate-200">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-lg">
          <h3 className="text-xl font-semibold">Features</h3>
          <p className="mt-2 text-slate-400">Volunteer management capabilities available in the BloodConnect admin console.</p>
          <ul className="mt-5 space-y-4">
            {features.map((item) => (
              <li key={item.title} className="flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-200">{item.icon}</div>
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-sm text-slate-400">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">Top volunteers</h3>
            <p className="mt-2 text-slate-400">High-impact volunteers who contributed to the latest blood drives.</p>
          </div>
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-400">Live data</span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {topVolunteers.map((volunteer) => (
            <div key={volunteer.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{volunteer.name}</p>
                  <p className="text-sm text-slate-400">{volunteer.role}</p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">{volunteer.status}</span>
              </div>
              <div className="mt-4 text-sm text-slate-400">Successful matches: <span className="font-semibold text-white">{volunteer.matches}</span></div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardVolunteers;
