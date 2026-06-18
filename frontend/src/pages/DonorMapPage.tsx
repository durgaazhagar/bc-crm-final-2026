import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Heart, Users, TrendingUp, Trophy, Filter } from 'lucide-react';

interface District {
  id: string;
  name: string;
  donors: number;
  activeDonors: number;
  totalDonations: number;
  bloodGroups: { [key: string]: number };
  topDonor?: string;
}

const districtData: District[] = [
  {
    id: 'chennai',
    name: 'Chennai',
    donors: 45,
    activeDonors: 42,
    totalDonations: 320,
    bloodGroups: { 'A+': 12, 'B+': 15, 'O+': 18 },
    topDonor: 'Murugan Selvam - 15 donations',
  },
  {
    id: 'madurai',
    name: 'Madurai',
    donors: 38,
    activeDonors: 35,
    totalDonations: 210,
    bloodGroups: { 'A+': 10, 'B+': 14, 'O+': 14 },
    topDonor: 'Kavitha Rajan - 12 donations',
  },
  {
    id: 'coimbatore',
    name: 'Coimbatore',
    donors: 52,
    activeDonors: 50,
    totalDonations: 380,
    bloodGroups: { 'A+': 16, 'B+': 18, 'O+': 18 },
    topDonor: 'Senthil Kumar - 18 donations',
  },
  {
    id: 'salem',
    name: 'Salem',
    donors: 35,
    activeDonors: 33,
    totalDonations: 185,
    bloodGroups: { 'A+': 10, 'B+': 12, 'O+': 13 },
    topDonor: 'Priya Lakshmi - 14 donations',
  },
  {
    id: 'trichy',
    name: 'Trichy',
    donors: 42,
    activeDonors: 40,
    totalDonations: 268,
    bloodGroups: { 'A+': 13, 'B+': 14, 'O+': 15 },
    topDonor: 'Anand Sivakumar - 13 donations',
  },
  {
    id: 'vellore',
    name: 'Vellore',
    donors: 38,
    activeDonors: 36,
    totalDonations: 220,
    bloodGroups: { 'A+': 11, 'B+': 13, 'O+': 14 },
    topDonor: 'Nithya Krishnan - 14 donations',
  },
  {
    id: 'erode',
    name: 'Erode',
    donors: 32,
    activeDonors: 30,
    totalDonations: 165,
    bloodGroups: { 'A+': 9, 'B+': 11, 'O+': 12 },
    topDonor: 'Vanitha Venkatesan - 10 donations',
  },
  {
    id: 'thanjavur',
    name: 'Thanjavur',
    donors: 28,
    activeDonors: 26,
    totalDonations: 148,
    bloodGroups: { 'A+': 8, 'B+': 10, 'O+': 10 },
    topDonor: 'Karthik Ravi - 12 donations',
  },
  {
    id: 'kanchipuram',
    name: 'Kanchipuram',
    donors: 30,
    activeDonors: 28,
    totalDonations: 155,
    bloodGroups: { 'A+': 9, 'B+': 10, 'O+': 11 },
    topDonor: 'Radha Srinivasan - 11 donations',
  },
  {
    id: 'tenkasi',
    name: 'Tenkasi',
    donors: 25,
    activeDonors: 23,
    totalDonations: 128,
    bloodGroups: { 'A+': 7, 'B+': 8, 'O+': 10 },
    topDonor: 'Deepa Devi - 10 donations',
  },
];

const DonorMapPage = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [filterType, setFilterType] = useState('all');

  const sortedDistricts = [...districtData].sort((a, b) => b.totalDonations - a.totalDonations);

  const getDistrictColor = (index: number) => {
    const colors = [
      'from-red-600 to-red-500',
      'from-red-700 to-red-600',
      'from-red-800 to-red-700',
      'from-orange-600 to-orange-500',
      'from-orange-700 to-orange-600',
      'from-amber-600 to-amber-500',
      'from-amber-700 to-amber-600',
      'from-yellow-600 to-yellow-500',
      'from-yellow-700 to-yellow-600',
      'from-orange-800 to-orange-700',
    ];
    return colors[index] || colors[colors.length - 1];
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">🗺 Donor Map Tamil Nadu</h1>
        <p className="text-slate-400">Interactive donor distribution across Tamil Nadu districts</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-4 rounded-lg bg-gradient-to-br from-red-600/30 to-rose-600/30 border border-red-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Total Donors</p>
              <p className="text-3xl font-bold">{districtData.reduce((sum, d) => sum + d.donors, 0)}</p>
            </div>
            <Users className="w-10 h-10 text-red-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-lg bg-gradient-to-br from-green-600/30 to-emerald-600/30 border border-green-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Active Donors</p>
              <p className="text-3xl font-bold">{districtData.reduce((sum, d) => sum + d.activeDonors, 0)}</p>
            </div>
            <Heart className="w-10 h-10 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-lg bg-gradient-to-br from-blue-600/30 to-cyan-600/30 border border-blue-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Total Donations</p>
              <p className="text-3xl font-bold">{districtData.reduce((sum, d) => sum + d.totalDonations, 0)}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-lg bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Districts</p>
              <p className="text-3xl font-bold">{districtData.length}</p>
            </div>
            <MapPin className="w-10 h-10 text-purple-400" />
          </div>
        </motion.div>
      </div>

      {/* District Cards */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">District-wise Ranking</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedDistricts.map((district, idx) => (
            <motion.div
              key={district.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedDistrict(district)}
              className={`p-4 rounded-lg cursor-pointer transition transform hover:scale-105 bg-gradient-to-r ${getDistrictColor(idx)} border border-white/10 hover:border-white/30`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">#{idx + 1}</span>
                    <h3 className="text-xl font-semibold">{district.name}</h3>
                  </div>
                </div>
                {idx === 0 && <Trophy className="w-6 h-6 text-yellow-300" />}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-white/70">Total Donors</p>
                  <p className="text-lg font-bold">{district.donors}</p>
                </div>
                <div>
                  <p className="text-xs text-white/70">Active</p>
                  <p className="text-lg font-bold">{district.activeDonors}</p>
                </div>
                <div>
                  <p className="text-xs text-white/70">Donations</p>
                  <p className="text-lg font-bold">{district.totalDonations}</p>
                </div>
                <div>
                  <p className="text-xs text-white/70">Avg/Donor</p>
                  <p className="text-lg font-bold">{(district.totalDonations / district.donors).toFixed(1)}</p>
                </div>
              </div>

              {/* Blood Group Distribution */}
              <div className="flex gap-2 text-xs">
                {Object.entries(district.bloodGroups).map(([group, count]) => (
                  <span key={group} className="px-2 py-1 bg-black/30 rounded">
                    {group}: <span className="font-bold">{count}</span>
                  </span>
                ))}
              </div>

              {district.topDonor && (
                <div className="mt-3 pt-3 border-t border-white/20 text-xs text-white/80">
                  🌟 Top: {district.topDonor}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detailed View */}
      {selectedDistrict && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-6 rounded-lg bg-gradient-to-r from-slate-800 to-slate-900 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="w-6 h-6 text-red-400" />
              {selectedDistrict.name} - Detailed View
            </h3>
            <button
              onClick={() => setSelectedDistrict(null)}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-slate-400 text-sm">Total Donors</p>
              <p className="text-3xl font-bold text-red-400">{selectedDistrict.donors}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Active Donors</p>
              <p className="text-3xl font-bold text-green-400">{selectedDistrict.activeDonors}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Donations</p>
              <p className="text-3xl font-bold text-blue-400">{selectedDistrict.totalDonations}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Average per Donor</p>
              <p className="text-3xl font-bold text-purple-400">
                {(selectedDistrict.totalDonations / selectedDistrict.donors).toFixed(1)}
              </p>
            </div>
          </div>

          {/* Blood Group Breakdown */}
          <div>
            <h4 className="font-semibold mb-3">Blood Group Distribution 🩸</h4>
            <div className="space-y-2">
              {Object.entries(selectedDistrict.bloodGroups).map(([group, count]) => (
                <div key={group}>
                  <div className="flex justify-between mb-1">
                    <span>{group}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / 20) * 100}%` }}
                      className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer Info */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 rounded-lg bg-blue-600/20 border border-blue-500/30 text-sm text-slate-300"
      >
        <p>
          📊 <strong>Data Insights:</strong> Coimbatore leads with {sortedDistricts[0].totalDonations} total donations. The top donor in each district has been highlighted. Click on any district for detailed analytics.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default DonorMapPage;
