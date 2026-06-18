import React, { useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hospital, Search, Phone, Copy, X, Star, Calendar, AlertCircle, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const hospitals = [
  { id: 1, name: 'Apollo Hospital', address: 'Mount Road, Chennai', city: 'Chennai', district: 'Chennai', phone: '9841001234', specialization: 'Multi-Specialty', units: 245, hours: '24/7', emergency: true, rating: 5, bloodNeeded: 'A+', status: 'Critical', beds: 450, lat: 13.0569, lng: 80.2425, responseScore: 4.8, lastRequest: '2 hours ago' },
  { id: 2, name: 'Kumaran Hospital', address: 'Race Course Road, Coimbatore', city: 'Coimbatore', district: 'Coimbatore', phone: '9842002345', specialization: 'General', units: 120, hours: '24/7', emergency: true, rating: 4, bloodNeeded: 'B+', status: 'Active', beds: 280, lat: 11.0168, lng: 76.9558, responseScore: 4.5, lastRequest: '4 hours ago' },
  { id: 3, name: 'Meenakshi Mission Hospital', address: 'Gandhi Nagar, Madurai', city: 'Madurai', district: 'Madurai', phone: '9843003456', specialization: 'Multi-Specialty', units: 189, hours: '24/7', emergency: true, rating: 5, bloodNeeded: 'O+', status: 'Active', beds: 350, lat: 9.9252, lng: 78.1198, responseScore: 4.2, lastRequest: '1 hour ago' },
  { id: 4, name: 'Sri Ramakrishna Hospital', address: 'Avinashi Road, Coimbatore', city: 'Coimbatore', district: 'Coimbatore', phone: '9844004567', specialization: 'Cardiac', units: 98, hours: '24/7', emergency: true, rating: 4, bloodNeeded: 'AB+', status: 'Active', beds: 320, lat: 11.0200, lng: 76.9800, responseScore: 4.6, lastRequest: '30 mins ago' },
  { id: 5, name: 'Thanjavur Medical College', address: 'Pazhaya Kottai Road, Thanjavur', city: 'Thanjavur', district: 'Thanjavur', phone: '9845005678', specialization: 'Government', units: 312, hours: '24/7', emergency: true, rating: 4, bloodNeeded: 'O-', status: 'Critical', beds: 500, lat: 10.7870, lng: 79.1378, responseScore: 3.9, lastRequest: '5 hours ago' },
  { id: 6, name: 'Tirunelveli Medical College', address: 'Nellai, Tirunelveli', city: 'Tirunelveli', district: 'Tirunelveli', phone: '9846006789', specialization: 'Government', units: 178, hours: '24/7', emergency: true, rating: 3, bloodNeeded: 'A-', status: 'Active', beds: 400, lat: 8.7139, lng: 77.7567, responseScore: 4.3, lastRequest: '3 hours ago' },
  { id: 7, name: 'PSG Hospital', address: 'Peelamedu, Coimbatore', city: 'Coimbatore', district: 'Coimbatore', phone: '9847007890', specialization: 'Multi-Specialty', units: 145, hours: '8AM-10PM', emergency: false, rating: 4, bloodNeeded: 'B-', status: 'Active', beds: 260, lat: 11.0300, lng: 76.9700, responseScore: 4.7, lastRequest: '1 hour ago' },
  { id: 8, name: 'Kauvery Hospital', address: 'Salem Bypass Road, Salem', city: 'Salem', district: 'Salem', phone: '9848008901', specialization: 'Cardiac', units: 67, hours: '24/7', emergency: true, rating: 5, bloodNeeded: 'A+', status: 'Critical', beds: 300, lat: 11.6643, lng: 78.1460, responseScore: 4.4, lastRequest: '45 mins ago' },
  { id: 9, name: 'Vellore CMC Hospital', address: 'Velappanchavadi, Vellore', city: 'Vellore', district: 'Vellore', phone: '9849009012', specialization: 'Multi-Specialty', units: 423, hours: '24/7', emergency: true, rating: 5, bloodNeeded: 'O+', status: 'Active', beds: 600, lat: 12.9165, lng: 79.1325, responseScore: 4.9, lastRequest: '20 mins ago' },
  { id: 10, name: 'Rajiv Gandhi Government Hospital', address: 'Poonamallee High Road, Chennai', city: 'Chennai', district: 'Chennai', phone: '9840010123', specialization: 'Government', units: 567, hours: '24/7', emergency: true, rating: 4, bloodNeeded: 'B+', status: 'Active', beds: 1200, lat: 13.0827, lng: 80.2707, responseScore: 4.1, lastRequest: '6 hours ago' },
  { id: 11, name: 'GH Erode', address: 'Perundurai Road, Erode', city: 'Erode', district: 'Erode', phone: '9841011234', specialization: 'Government', units: 134, hours: '24/7', emergency: true, rating: 3, bloodNeeded: 'AB-', status: 'Active', beds: 350, lat: 11.3410, lng: 77.7172, responseScore: 4.0, lastRequest: '8 hours ago' },
  { id: 12, name: 'Trichy SRM Hospital', address: 'Chinna Seeragapadi, Tiruchirappalli', city: 'Tiruchirappalli', district: 'Tiruchirappalli', phone: '9842012345', specialization: 'Multi-Specialty', units: 89, hours: '24/7', emergency: true, rating: 4, bloodNeeded: 'A+', status: 'Critical', beds: 280, lat: 10.7905, lng: 78.7047, responseScore: 3.8, lastRequest: '10 hours ago' },
  { id: 13, name: 'Narayana Hospital', address: 'Perungudi, Chennai', city: 'Chennai', district: 'Chennai', phone: '9843013456', specialization: 'Cardiac', units: 201, hours: '24/7', emergency: true, rating: 5, bloodNeeded: 'O+', status: 'Active', beds: 380, lat: 13.0100, lng: 80.2200, responseScore: 4.5, lastRequest: '2 hours ago' },
  { id: 14, name: 'GH Tiruppur', address: 'Avinashi Road, Tiruppur', city: 'Tiruppur', district: 'Tiruppur', phone: '9844014567', specialization: 'Government', units: 78, hours: '8AM-8PM', emergency: false, rating: 3, bloodNeeded: 'B+', status: 'Active', beds: 220, lat: 11.1085, lng: 77.3411, responseScore: 4.2, lastRequest: '7 hours ago' },
  { id: 15, name: 'Karpaga Vinayaga Hospital', address: 'Padappai Road, Kanchipuram', city: 'Kanchipuram', district: 'Kanchipuram', phone: '9845015678', specialization: 'General', units: 56, hours: '8AM-10PM', emergency: false, rating: 3, bloodNeeded: 'A-', status: 'Active', beds: 190, lat: 12.8342, lng: 79.7036, responseScore: 4.6, lastRequest: '3 hours ago' },
];

const recentRequests = [
  { hospitalName: 'Apollo Hospital', bloodType: 'O+', timeAgo: '15 mins ago' },
  { hospitalName: 'Vellore CMC Hospital', bloodType: 'B-', timeAgo: '45 mins ago' },
  { hospitalName: 'PSG Hospital', bloodType: 'A+', timeAgo: '1 hour ago' },
  { hospitalName: 'Kauvery Hospital', bloodType: 'AB+', timeAgo: '2 hours ago' },
  { hospitalName: 'Narayana Hospital', bloodType: 'O-', timeAgo: '3 hours ago' },
];

const bloodNeedStatus = (hospital: typeof hospitals[0]) => {
  if (hospital.status === 'Critical') return 'critical';
  if (['O-', 'O+', 'A-'].includes(hospital.bloodNeeded)) return 'moderate';
  return 'sufficient';
};

const MapUpdater = ({ targetLocation }: { targetLocation: { lat: number; lng: number } | null }) => {
  const map = useMap();

  useEffect(() => {
    if (targetLocation) {
      map.flyTo([targetLocation.lat, targetLocation.lng], 13, {
        duration: 1.5,
      });
    }
  }, [targetLocation, map]);

  return null;
};

interface Toast {
  id: number;
  message: string;
}

const DashboardHospitals = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<typeof hospitals[0] | null>(null);
  const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedBloodType, setSelectedBloodType] = useState('O+');
  const [urgencyLevel, setUrgencyLevel] = useState('Critical');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterBloodType, setFilterBloodType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [toastMessage, setToastMessage] = useState<Toast | null>(null);
  const toastIdRef = useRef(0);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const districts = useMemo(() => [...new Set(hospitals.map((h) => h.district))], []);

  const filteredHospitals = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return hospitals.filter((hospital) => {
      const matchesSearch = !query || hospital.name.toLowerCase().includes(query) || hospital.district.toLowerCase().includes(query);
      const matchesDistrict = !filterDistrict || hospital.district === filterDistrict;
      const matchesBloodType = !filterBloodType || hospital.bloodNeeded === filterBloodType;
      const matchesStatus = !filterStatus || hospital.status === filterStatus;
      return matchesSearch && matchesDistrict && matchesBloodType && matchesStatus;
    });
  }, [searchQuery, filterDistrict, filterBloodType, filterStatus]);

  const totals = useMemo(() => {
    const critical = hospitals.filter((hospital) => hospital.status === 'Critical').length;
    const active = hospitals.filter((hospital) => hospital.status === 'Active').length;
    const districtCount = new Set(hospitals.map((hospital) => hospital.district)).size;
    return { total: hospitals.length, critical, active, districts: districtCount };
  }, []);

  const showToast = (message: string) => {
    const id = ++toastIdRef.current;
    setToastMessage({ id, message });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    showToast(`Copied: ${phone}`);
  };

  const handlePhoneLinkClick = (phone: string) => {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod|Windows Phone|webOS/i.test(navigator.userAgent);
    if (!isMobile) {
      showToast('Calling...');
    }
  };

  const handleRequestBlood = () => {
    if (selectedHospital) {
      showToast(`Blood request sent to ${selectedHospital.name} (${selectedBloodType}, ${urgencyLevel})`);
      setShowRequestModal(false);
    }
  };

  const handleRowClick = (hospital: typeof hospitals[0]) => {
    setSelectedHospital(hospital);
    setMapLocation({ lat: hospital.lat, lng: hospital.lng });
  };

  const clearFilters = () => {
    setFilterDistrict('');
    setFilterBloodType('');
    setFilterStatus('');
  };

  const statusBadge = (status: string) =>
    status === 'Critical'
      ? 'bg-red-500/10 text-red-200'
      : 'bg-emerald-500/10 text-emerald-200';

  const bloodBadge = (bloodNeeded: string) => {
    switch (bloodNeeded) {
      case 'A+':
        return 'bg-red-500/15 text-red-200';
      case 'B+':
        return 'bg-blue-500/15 text-blue-200';
      case 'O+':
        return 'bg-emerald-500/15 text-emerald-200';
      case 'AB+':
        return 'bg-violet-500/15 text-violet-200';
      case 'A-':
      case 'B-':
      case 'O-':
      case 'AB-':
        return 'bg-slate-500/15 text-slate-200';
      default:
        return 'bg-slate-500/15 text-slate-200';
    }
  };

  const markerColor = (needStatus: string) => {
    switch (needStatus) {
      case 'critical':
        return '#ef4444';
      case 'moderate':
        return '#f59e0b';
      case 'sufficient':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const renderStars = (score: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(score) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-500'}`}
      />
    ));
  };

  const handleView = (id: number) => {
    console.log('View hospital', id);
  };

  const handleEdit = (id: number) => {
    console.log('Edit hospital', id);
  };

  const handleDelete = (id: number) => {
    console.log('Delete hospital', id);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl px-4 py-3 text-sm text-emerald-200"
          >
            {toastMessage.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Hospital Management</h2>
          <p className="text-sm text-slate-400">Track hospital needs and blood demand across Tamil Nadu.</p>
        </div>
      </div>

      {/* Stats Cards */}
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

      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-slate-400">District</label>
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="w-full mt-2 rounded-2xl border border-white/10 bg-slate-950/80 py-2 px-3 text-sm text-white focus:border-slate-400 focus:outline-none"
            >
              <option value="">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-slate-400">Blood Type</label>
            <select
              value={filterBloodType}
              onChange={(e) => setFilterBloodType(e.target.value)}
              className="w-full mt-2 rounded-2xl border border-white/10 bg-slate-950/80 py-2 px-3 text-sm text-white focus:border-slate-400 focus:outline-none"
            >
              <option value="">All Types</option>
              {bloodTypes.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-slate-400">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full mt-2 rounded-2xl border border-white/10 bg-slate-950/80 py-2 px-3 text-sm text-white focus:border-slate-400 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="Critical">Critical</option>
              <option value="Active">Active</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full rounded-2xl bg-slate-700/50 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-600"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Hospital Directory</h3>
            <p className="text-sm text-slate-400">Search by hospital name or district.</p>
          </div>

          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospitals or districts"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Content - Table and Map */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.8fr_1fr] gap-4">
        {/* Hospital Table */}
        <div className="rounded-3xl border border-white/10 bg-white/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead className="bg-slate-950/95 text-slate-400">
                <tr>
                  <th className="px-4 py-4 uppercase tracking-[0.12em]">Hospital</th>
                  <th className="px-4 py-4 uppercase tracking-[0.12em]">District</th>
                  <th className="px-4 py-4 uppercase tracking-[0.12em]">Specialization</th>
                  <th className="px-4 py-4 uppercase tracking-[0.12em]">Units Available</th>
                  <th className="px-4 py-4 uppercase tracking-[0.12em]">Hours</th>
                  <th className="px-4 py-4 uppercase tracking-[0.12em]">Emergency</th>
                  <th className="px-4 py-4 uppercase tracking-[0.12em]">Blood</th>
                  <th className="px-4 py-4 uppercase tracking-[0.12em]">Status</th>
                  <th className="px-4 py-4 uppercase tracking-[0.12em]">Rating</th>
                  <th className="px-4 py-4 uppercase tracking-[0.12em]">📞 Phone</th>
                  <th className="px-4 py-4 uppercase tracking-[0.12em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredHospitals.length ? (
                  filteredHospitals.map((hospital) => (
                    <tr
                      key={hospital.id}
                      className={`hover:bg-white/5 cursor-pointer transition ${selectedHospital?.id === hospital.id ? 'bg-cyan-500/10' : ''}`}
                      onClick={() => handleRowClick(hospital)}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800">
                            <Hospital className="h-4 w-4 text-slate-200" />
                          </span>
                          <div>
                            <div className="font-semibold text-white text-sm">{hospital.name}</div>
                            <div className="text-xs text-slate-500">{hospital.city}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs">{hospital.district}</td>
                      <td className="px-4 py-4 text-xs text-slate-200">{hospital.specialization}</td>
                      <td className="px-4 py-4 text-xs text-slate-200">{hospital.units}</td>
                      <td className="px-4 py-4 text-xs text-slate-200">{hospital.hours}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${hospital.emergency ? 'bg-emerald-500/10 text-emerald-200' : 'bg-slate-500/10 text-slate-300'}`}>
                          {hospital.emergency ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${bloodBadge(hospital.bloodNeeded)}`}>
                          {hospital.bloodNeeded}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusBadge(hospital.status)}`}>
                          {hospital.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs">
                        <div className="flex items-center gap-1">{renderStars(hospital.rating)}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sky-400">
                          <span className="text-base">📞</span>
                          <a
                            href={`tel:+91${hospital.phone}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePhoneLinkClick(hospital.phone);
                            }}
                            className="text-sky-400 hover:underline"
                          >
                            {hospital.phone}
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedHospital(hospital);
                            }}
                            className="inline-flex items-center justify-center rounded-2xl bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10 transition"
                          >
                            View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyPhone(hospital.phone);
                            }}
                            className="inline-flex items-center justify-center rounded-2xl bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-200 hover:bg-sky-500/20 transition"
                          >
                            📞 Call {hospital.phone}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedHospital(hospital);
                              setShowRequestModal(true);
                            }}
                            className="inline-flex items-center justify-center rounded-2xl bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/20 transition"
                          >
                            Request Blood
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="px-4 py-8 text-center text-slate-400">
                      No hospitals match your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Interactive Map</h3>
          {selectedHospital && (
            <div className="mb-3 p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
              <p className="text-sm text-cyan-200">
                <strong>Selected:</strong> {selectedHospital.name}
              </p>
            </div>
          )}
          <div className="h-[520px] overflow-hidden rounded-3xl border border-white/10">
            <MapContainer
              center={[11.1271, 78.6569]}
              zoom={7}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapUpdater targetLocation={mapLocation} />
              {hospitals.map((hospital) => {
                const needStatus = bloodNeedStatus(hospital);
                const isSelected = selectedHospital?.id === hospital.id;
                const color = isSelected ? '#dc2626' : markerColor(needStatus);
                const icon = L.divIcon({
                  html: `
                    <div style="
                      background-color: ${color};
                      width: ${isSelected ? '42px' : '32px'};
                      height: ${isSelected ? '42px' : '32px'};
                      border-radius: 50%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      border: ${isSelected ? '3px solid #ffffff' : '2px solid white'};
                      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                      font-size: ${isSelected ? '18px' : '14px'};
                    ">🏥</div>
                  `,
                  iconSize: [isSelected ? 42 : 32, isSelected ? 42 : 32],
                });

                return (
                  <Marker
                    key={hospital.id}
                    position={[hospital.lat, hospital.lng]}
                    icon={icon}
                    eventHandlers={{ click: () => handleRowClick(hospital) }}
                  />
                );
              })}
              {selectedHospital && (
                <Popup
                  position={[selectedHospital.lat, selectedHospital.lng]}
                  closeButton={false}
                  closeOnClick={false}
                  autoPan={true}
                >
                  <div style={{ minWidth: '180px', fontSize: '12px' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>{selectedHospital.name}</p>
                    <p style={{ marginBottom: '4px' }}>{selectedHospital.city}</p>
                    <p style={{ marginBottom: '2px' }}>Blood: {selectedHospital.bloodNeeded}</p>
                    <p>Status: {selectedHospital.status}</p>
                  </div>
                </Popup>
              )}
            </MapContainer>
          </div>
          <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-300 mb-3">Blood Need Heatmap Legend</p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-red-500"></div>
                <span className="text-sm text-slate-300">🔴 Critical Need</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-amber-400"></div>
                <span className="text-sm text-slate-300">🟡 Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-slate-300">🟢 Sufficient</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Last Requests Timeline */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm">
        <h3 className="font-semibold mb-4">Last 5 Blood Requests</h3>
        <div className="space-y-3">
          {recentRequests.map((req, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5">
              <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{req.hospitalName}</p>
                <p className="text-xs text-slate-400">Blood Type: {req.bloodType}</p>
              </div>
              <span className="text-xs text-slate-500 whitespace-nowrap">{req.timeAgo}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hospital Details Side Panel */}
      <AnimatePresence>
        {selectedHospital && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed right-0 top-0 h-screen w-96 bg-gradient-to-b from-slate-900 to-slate-950 border-l border-white/10 shadow-2xl z-40 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Hospital Details</h3>
                <button
                  onClick={() => setSelectedHospital(null)}
                  className="rounded-lg bg-white/10 p-2 hover:bg-white/20 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Hospital Name</p>
                  <p className="mt-2 text-lg font-semibold text-white">{selectedHospital.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-400">City</p>
                    <p className="mt-2 font-semibold text-white">{selectedHospital.city}</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-400">District</p>
                    <p className="mt-2 font-semibold text-white">{selectedHospital.district}</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Phone</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="font-semibold text-white">{selectedHospital.phone}</p>
                    <button
                      onClick={() => handleCopyPhone(selectedHospital.phone)}
                      className="rounded-lg bg-cyan-500/20 p-2 hover:bg-cyan-500/30 transition"
                    >
                      <Copy className="h-4 w-4 text-cyan-300" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-400">Blood Needed</p>
                    <span className={`inline-flex mt-2 rounded-full px-3 py-1 text-xs font-semibold ${bloodBadge(selectedHospital.bloodNeeded)}`}>
                      {selectedHospital.bloodNeeded}
                    </span>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-400">Beds</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{selectedHospital.beds}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Address</p>
                  <p className="mt-2 font-semibold text-white">{selectedHospital.address}</p>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Status</p>
                  <span className={`inline-flex mt-2 rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(selectedHospital.status)}`}>
                    {selectedHospital.status}
                  </span>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Response Score</p>
                  <div className="mt-2 flex gap-1">{renderStars(selectedHospital.responseScore)}</div>
                  <p className="mt-1 text-sm text-slate-300">{selectedHospital.responseScore.toFixed(1)}/5.0</p>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Last Request</p>
                  <p className="mt-2 font-semibold text-white flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {selectedHospital.lastRequest}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blood Request Modal */}
      <AnimatePresence>
        {showRequestModal && selectedHospital && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowRequestModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 w-full max-w-md shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Emergency Blood Request</h3>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="rounded-lg bg-white/10 p-2 hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-sm text-slate-300">{selectedHospital.name}</p>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Select Blood Type</label>
                <select
                  value={selectedBloodType}
                  onChange={(e) => setSelectedBloodType(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 py-3 px-4 text-white focus:border-slate-400 focus:outline-none"
                >
                  {bloodTypes.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Urgency Level</label>
                <div className="space-y-2">
                  {['Critical', 'Urgent', 'Normal'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setUrgencyLevel(level)}
                      className={`w-full rounded-2xl px-4 py-3 font-semibold transition ${
                        urgencyLevel === level
                          ? level === 'Critical'
                            ? 'bg-red-500/30 border border-red-500/50 text-red-200 animate-pulse'
                            : level === 'Urgent'
                            ? 'bg-amber-500/30 border border-amber-500/50 text-amber-200'
                            : 'bg-emerald-500/30 border border-emerald-500/50 text-emerald-200'
                          : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {level === 'Critical' && '🚨'} {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 rounded-2xl bg-white/10 px-4 py-3 font-semibold text-white hover:bg-white/20 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestBlood}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 px-4 py-3 font-semibold text-white hover:shadow-lg hover:shadow-red-500/20 transition"
                >
                  Send Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DashboardHospitals;
