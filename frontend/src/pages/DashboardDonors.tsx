import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, AlertCircle, Trophy, MapPin } from 'lucide-react';

// Donor dataset representing Tamil Nadu districts
const tamilDonors = [
  { id: 1, name: 'Murugan Selvam', blood: 'A+', district: 'Chennai', city: 'Chennai', donations: 12, badges: ['verified', 'donorOfDistrict'], lifetimeDonations: 12 },
  { id: 2, name: 'Kavitha Rajan', blood: 'B+', district: 'Madurai', city: 'Madurai', donations: 8, badges: ['verified'], lifetimeDonations: 8 },
  { id: 3, name: 'Senthil Kumar', blood: 'O+', district: 'Coimbatore', city: 'Coimbatore', donations: 15, badges: ['verified', 'emergencyHero', 'donorOfDistrict'], lifetimeDonations: 15 },
  { id: 4, name: 'Priya Lakshmi', blood: 'A+', district: 'Salem', city: 'Salem', donations: 10, badges: ['verified'], lifetimeDonations: 10 },
  { id: 5, name: 'Rajesh Pandian', blood: 'B+', district: 'Tirunelveli', city: 'Tirunelveli', donations: 9, badges: ['verified', 'donorOfDistrict'], lifetimeDonations: 9 },
  { id: 6, name: 'Nithya Krishnan', blood: 'O+', district: 'Vellore', city: 'Vellore', donations: 14, badges: ['verified', 'emergencyHero'], lifetimeDonations: 14 },
  { id: 7, name: 'Anandh Sivakumar', blood: 'A+', district: 'Trichy', city: 'Trichy', donations: 11, badges: ['verified'], lifetimeDonations: 11 },
  { id: 8, name: 'Vanitha Venkatesh', blood: 'B+', district: 'Erode', city: 'Erode', donations: 7, badges: ['emergencyHero'], lifetimeDonations: 7 },
  { id: 9, name: 'Karthik Ravi', blood: 'O+', district: 'Thanjavur', city: 'Thanjavur', donations: 13, badges: ['verified', 'donorOfDistrict'], lifetimeDonations: 13 },
  { id: 10, name: 'Radha Srinivasan', blood: 'A+', district: 'Kanchipuram', city: 'Kanchipuram', donations: 9, badges: ['verified'], lifetimeDonations: 9 },
  { id: 11, name: 'Suresh Ram', blood: 'B+', district: 'Dharmapuri', city: 'Dharmapuri', donations: 10, badges: ['verified'], lifetimeDonations: 10 },
  { id: 12, name: 'Meera Sandhiya', blood: 'O+', district: 'Villupuram', city: 'Villupuram', donations: 8, badges: ['emergencyHero'], lifetimeDonations: 8 },
  { id: 13, name: 'Arjun Sundaram', blood: 'A+', district: 'Ranipet', city: 'Ranipet', donations: 6, badges: ['verified'], lifetimeDonations: 6 },
  { id: 14, name: 'Deepa Devi', blood: 'B+', district: 'Tenkasi', city: 'Tenkasi', donations: 11, badges: ['verified', 'donorOfDistrict'], lifetimeDonations: 11 },
  { id: 15, name: 'Vijay Ram', blood: 'O+', district: 'Nagercoil', city: 'Nagercoil', donations: 9, badges: ['verified'], lifetimeDonations: 9 },
  { id: 16, name: 'Aruni Prabhu', blood: 'A+', district: 'Sivakasi', city: 'Sivakasi', donations: 12, badges: ['emergencyHero'], lifetimeDonations: 12 },
  { id: 17, name: 'Nalini Saravanan', blood: 'B+', district: 'Karaikudi', city: 'Karaikudi', donations: 7, badges: ['verified'], lifetimeDonations: 7 },
  { id: 18, name: 'Mohan Gund', blood: 'O+', district: 'Pollachi', city: 'Pollachi', donations: 14, badges: ['verified', 'emergencyHero', 'donorOfDistrict'], lifetimeDonations: 14 },
  { id: 19, name: 'Keerthana Jayan', blood: 'A+', district: 'Udhagamandalam', city: 'Udhagamandalam', donations: 10, badges: ['verified'], lifetimeDonations: 10 },
  { id: 20, name: 'Pranav Balu', blood: 'B+', district: 'Ooty', city: 'Ooty', donations: 8, badges: ['donorOfDistrict'], lifetimeDonations: 8 },
  { id: 21, name: 'Samyuktha Balaji', blood: 'O+', district: 'Chidambaram', city: 'Chidambaram', donations: 13, badges: ['verified', 'emergencyHero'], lifetimeDonations: 13 },
  { id: 22, name: 'Vazhipadu Tamil', blood: 'A+', district: 'Kanyakumari', city: 'Kanyakumari', donations: 11, badges: ['verified'], lifetimeDonations: 11 },
  { id: 23, name: 'Kiran Nath', blood: 'B+', district: 'Ramanathapuram', city: 'Ramanathapuram', donations: 9, badges: ['verified', 'donorOfDistrict'], lifetimeDonations: 9 },
  { id: 24, name: 'Sameera Gopi', blood: 'O+', district: 'Pudukkottai', city: 'Pudukkottai', donations: 15, badges: ['verified', 'emergencyHero'], lifetimeDonations: 15 },
];

const DashboardDonors = () => {
  const [query, setQuery] = useState('');
  
  const filtered = useMemo(() => 
    tamilDonors.filter((d) => 
      d.name.toLowerCase().includes(query.toLowerCase()) || 
      d.district.toLowerCase().includes(query.toLowerCase()) ||
      d.city.toLowerCase().includes(query.toLowerCase())
    ), 
    [query]
  );

  const getBadgeEmoji = (badge: string): string => {
    const badges: Record<string, string> = {
      verified: '✅',
      emergencyHero: '🚑',
      donorOfDistrict: '🏅',
    };
    return badges[badge] || '';
  };

  const getLoyaltyColor = (donations: number): string => {
    if (donations >= 15) return 'text-yellow-400'; // Gold
    if (donations >= 10) return 'text-slate-300'; // Silver
    if (donations >= 8) return 'text-orange-400'; // Bronze
    return 'text-slate-500'; // Regular
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Tamil Nadu Donor List</h2>
          <p className="text-sm text-slate-400 mt-1">Loyalty Points — Donor Trust & Rewards</p>
        </div>
        <input 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Search by name or district..." 
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10"
        />
      </div>

      <div className="rounded-2xl p-4 bg-white/5 border border-white/10 backdrop-blur-md shadow-lg overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead className="text-slate-300 text-sm border-b border-white/10">
            <tr>
              <th className="py-3 px-3">Name</th>
              <th className="py-3 px-3">Blood Group</th>
              <th className="py-3 px-3">District</th>
              <th className="py-3 px-3">Lifetime Donations</th>
              <th className="py-3 px-3">Badges</th>
              <th className="py-3 px-3">Loyalty Points</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, idx) => (
              <motion.tr 
                key={d.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-white/6 hover:bg-white/2 transition"
              >
                <td className="py-3 px-3 font-medium">{d.name}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-1 rounded-md bg-rose-500/20 text-rose-300 text-sm font-semibold">
                    {d.blood}
                  </span>
                </td>
                <td className="py-3 px-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-400" />
                  {d.district}
                </td>
                <td className="py-3 px-3">
                  <span className={`font-bold ${getLoyaltyColor(d.lifetimeDonations)}`}>
                    {d.lifetimeDonations}
                  </span>
                </td>
                <td className="py-3 px-3 flex items-center gap-2">
                  {d.badges.map((badge) => (
                    <span key={badge} title={badge} className="text-lg">
                      {getBadgeEmoji(badge)}
                    </span>
                  ))}
                  {d.badges.length === 0 && <span className="text-slate-500">—</span>}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1">
                    <Trophy className={`w-4 h-4 ${getLoyaltyColor(d.lifetimeDonations)}`} />
                    <span className="text-sm">{d.lifetimeDonations * 10}</span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <motion.div className="p-4 rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600 border border-white/10">
          <div className="text-xl mb-1">🏆</div>
          <div className="text-sm text-slate-300">Platinum Donors</div>
          <div className="text-2xl font-bold">{tamilDonors.filter(d => d.donations >= 15).length}</div>
        </motion.div>
        <motion.div className="p-4 rounded-lg bg-gradient-to-r from-slate-600 to-gray-600 border border-white/10">
          <div className="text-xl mb-1">🥈</div>
          <div className="text-sm text-slate-300">Silver Donors</div>
          <div className="text-2xl font-bold">{tamilDonors.filter(d => d.donations >= 10 && d.donations < 15).length}</div>
        </motion.div>
        <motion.div className="p-4 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 border border-white/10">
          <div className="text-xl mb-1">🥉</div>
          <div className="text-sm text-slate-300">Bronze Donors</div>
          <div className="text-2xl font-bold">{tamilDonors.filter(d => d.donations < 10).length}</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardDonors;
