import React, { useMemo, useState } from 'react';
import { Hospital, Search, Eye, Edit2, Trash2, MapPin } from 'lucide-react';

const hospitals = [
  { id: 1, name: 'Apollo Hospital', city: 'Chennai', district: 'Chennai', phone: '9841001234', bloodNeeded: 'A+', status: 'Critical', beds: 450 },
  { id: 2, name: 'Kumaran Hospital', city: 'Coimbatore', district: 'Coimbatore', phone: '9842002345', bloodNeeded: 'B+', status: 'Active', beds: 280 },
  { id: 3, name: 'Meenakshi Mission Hospital', city: 'Madurai', district: 'Madurai', phone: '9843003456', bloodNeeded: 'O+', status: 'Active', beds: 350 },
  { id: 4, name: 'Sri Ramakrishna Hospital', city: 'Coimbatore', district: 'Coimbatore', phone: '9844004567', bloodNeeded: 'AB+', status: 'Active', beds: 320 },
  { id: 5, name: 'Thanjavur Medical College', city: 'Thanjavur', district: 'Thanjavur', phone: '9845005678', bloodNeeded: 'O-', status: 'Critical', beds: 500 },
  { id: 6, name: 'Tirunelveli Medical College', city: 'Tirunelveli', district: 'Tirunelveli', phone: '9846006789', bloodNeeded: 'A-', status: 'Active', beds: 400 },
  { id: 7, name: 'PSG Hospital', city: 'Coimbatore', district: 'Coimbatore', phone: '9847007890', bloodNeeded: 'B-', status: 'Active', beds: 260 },
  { id: 8, name: 'Kauvery Hospital', city: 'Salem', district: 'Salem', phone: '9848008901', bloodNeeded: 'A+', status: 'Critical', beds: 300 },
  { id: 9, name: 'Vellore CMC Hospital', city: 'Vellore', district: 'Vellore', phone: '9849009012', bloodNeeded: 'O+', status: 'Active', beds: 600 },
  { id: 10, name: 'Rajiv Gandhi Government Hospital', city: 'Chennai', district: 'Chennai', phone: '9840010123', bloodNeeded: 'B+', status: 'Active', beds: 1200 },
  { id: 11, name: 'GH Erode', city: 'Erode', district: 'Erode', phone: '9841011234', bloodNeeded: 'AB-', status: 'Active', beds: 350 },
  { id: 12, name: 'Trichy SRM Hospital', city: 'Tiruchirappalli', district: 'Tiruchirappalli', phone: '9842012345', bloodNeeded: 'A+', status: 'Critical', beds: 280 },
  { id: 13, name: 'Narayana Hospital', city: 'Chennai', district: 'Chennai', phone: '9843013456', bloodNeeded: 'O+', status: 'Active', beds: 380 },
  { id: 14, name: 'GH Tiruppur', city: 'Tiruppur', district: 'Tiruppur', phone: '9844014567', bloodNeeded: 'B+', status: 'Active', beds: 220 },
  { id: 15, name: 'Karpaga Vinayaga Hospital', city: 'Kanchipuram', district: 'Kanchipuram', phone: '9845015678', bloodNeeded: 'A-', status: 'Active', beds: 190 },
];

const statusBadge = (status: string) =>
  status === 'Critical'
    ? 'bg-red-500/15 text-red-200 border border-red-500/25'
    : 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/25';

const bloodBadge = (bloodNeeded: string) => {
  switch (bloodNeeded) {
    case 'A+':
    case 'A-':
      return 'bg-red-500/15 text-red-200 border border-red-500/25';
    case 'B+':
    case 'B-':
      return 'bg-amber-500/15 text-amber-200 border border-amber-500/25';
    case 'O+':
    case 'O-':
      return 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/25';
    case 'AB+':
    case 'AB-':
      return 'bg-violet-500/15 text-violet-200 border border-violet-500/25';
    default:
      return 'bg-slate-500/15 text-slate-200 border border-slate-500/25';
  }
};

export default function HospitalManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHospitals = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return hospitals.filter((hospital) => {
      return (
        hospital.name.toLowerCase().includes(query) ||
        hospital.district.toLowerCase().includes(query)
      );
    });
  }, [searchTerm]);

  const totals = useMemo(() => {
    const critical = hospitals.filter((hospital) => hospital.status === 'Critical').length;
    const active = hospitals.filter((hospital) => hospital.status === 'Active').length;
    const districts = new Set(hospitals.map((hospital) => hospital.district)).size;
    return { total: hospitals.length, critical, active, districts };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hospital Management</h1>
        <p className="mt-2 text-slate-400">Monitor hospital networks, blood needs, and contact details across Tamil Nadu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Total Hospitals</p>
          <p className="mt-3 text-3xl font-semibold text-white">{totals.total}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Critical</p>
          <p className="mt-3 text-3xl font-semibold text-red-200">{totals.critical}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Active</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-200">{totals.active}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Districts Covered</p>
          <p className="mt-3 text-3xl font-semibold text-white">{totals.districts}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Hospital Directory</h2>
          <p className="text-sm text-slate-400">Search by name or district.</p>
        </div>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search hospitals or districts"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-slate-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead className="bg-slate-950/95 text-slate-400">
                <tr>
                  <th className="px-4 py-4 uppercase tracking-[0.12em]">Hospital Name</th>
                  <th className="px-4 py-4 uppercase tracking-[0.12em]">District</th>
                  <th className="px-4 py-4 uppercase tracking-[0.12em]">Phone</th>
                  <th className="px-4 py-4 uppercase tracking-[0.12em]">Blood Needed</th>
                  <th className="px-4 py-4 uppercase tracking-[0.12em]">Status</th>
                  <th className="px-4 py-4 uppercase tracking-[0.12em]">Total Beds</th>
                  <th className="px-4 py-4 uppercase tracking-[0.12em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredHospitals.map((hospital) => (
                  <tr key={hospital.id} className="hover:bg-white/5 transition">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-200">
                          <Hospital className="h-4 w-4" />
                        </span>
                        <div>
                          <div className="font-semibold text-white">{hospital.name}</div>
                          <div className="text-xs text-slate-500">{hospital.city}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-300">{hospital.district}</td>
                    <td className="px-4 py-4 text-xs text-slate-300">{hospital.phone}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${bloodBadge(hospital.bloodNeeded)}`}>
                        {hospital.bloodNeeded}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(hospital.status)}`}>
                        {hospital.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-300">{hospital.beds}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button className="rounded-2xl border border-white/10 bg-slate-800/70 px-3 py-2 text-xs text-slate-200 hover:bg-slate-700 transition">
                          <Eye className="inline-block h-3.5 w-3.5" /> View
                        </button>
                        <button className="rounded-2xl border border-white/10 bg-blue-500/10 px-3 py-2 text-xs text-blue-200 hover:bg-blue-500/20 transition">
                          <Edit2 className="inline-block h-3.5 w-3.5" /> Edit
                        </button>
                        <button className="rounded-2xl border border-white/10 bg-red-500/10 px-3 py-2 text-xs text-red-200 hover:bg-red-500/20 transition">
                          <Trash2 className="inline-block h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredHospitals.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                      No hospitals found for your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-slate-300" />
            <h2 className="text-lg font-semibold text-white">OpenStreetMap View</h2>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <iframe
              title="Tamil Nadu hospitals map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=76.0%2C8.0%2C80.8%2C13.8&layer=mapnik"
              className="h-[520px] w-full border-0"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
}
