import React, { useMemo, useState, useEffect } from 'react';
import SectionCard from '../components/SectionCard';
import { Zap, Activity, HeartPulse, Hospital, TrendingUp, MapPin, ShieldCheck } from 'lucide-react';

type Hospital = {
  id: string;
  name: string;
  district: string;
  specialties: string[];
  lat: number;
  lng: number;
  readiness: number;
  icuOccupancy: number;
  bedsAvailable: number;
  performance: number;
  distance: string;
};

type Donor = {
  name: string;
  group: string;
  distance: number;
  phone: string;
  lastSeen: string;
  district: string;
};

type BloodBank = {
  name: string;
  distance: string;
  inventory: Record<string, number>;
};

const hospitalsSeed: Hospital[] = [
  {
    id: 'H001',
    name: 'City Hospital',
    district: 'Chennai',
    specialties: ['Trauma', 'Cardiology', 'Pediatrics'],
    lat: 13.0827,
    lng: 80.2707,
    readiness: 78,
    icuOccupancy: 64,
    bedsAvailable: 12,
    performance: 82,
    distance: '2 km'
  },
  {
    id: 'H002',
    name: 'Apollo Care',
    district: 'Chennai',
    specialties: ['Neurology', 'Orthopedics', 'ICU'],
    lat: 13.05,
    lng: 80.2236,
    readiness: 54,
    icuOccupancy: 82,
    bedsAvailable: 4,
    performance: 61,
    distance: '4 km'
  },
  {
    id: 'H003',
    name: 'Rajaji Medical',
    district: 'Chennai',
    specialties: ['Surgery', 'Emergency', 'ICU'],
    lat: 13.075,
    lng: 80.259,
    readiness: 88,
    icuOccupancy: 49,
    bedsAvailable: 18,
    performance: 89,
    distance: '5 km'
  }
];

const donorsSeed: Donor[] = [
  { name: 'Gopi', group: 'O+', distance: 1.1, phone: '9000012345', lastSeen: '2m ago', district: 'Chennai' },
  { name: 'Durga', group: 'A+', distance: 1.8, phone: '9000012352', lastSeen: '5m ago', district: 'Chennai' },
  { name: 'Ganesh', group: 'B+', distance: 2.3, phone: '9000012348', lastSeen: '7m ago', district: 'Chennai' },
  { name: 'Malathika', group: 'AB+', distance: 3.1, phone: '9000012347', lastSeen: '9m ago', district: 'Coimbatore' }
];

const bloodBanks: BloodBank[] = [
  { name: 'Red Cross Bank', distance: '2.1 km', inventory: { 'O+': 26, 'A+': 14, 'B+': 12 } },
  { name: 'Hope Group Bank', distance: '2.8 km', inventory: { 'A+': 10, 'O+': 16, 'AB+': 7 } }
];

const predictiveAlerts = [
  { title: 'O+ shortage forecast', message: 'O+ supply may drop 35% in 24h', tone: 'text-red-300' },
  { title: 'Trauma support alert', message: 'High trauma intake expected in 2h', tone: 'text-amber-300' }
];

const surgeTrend = [
  { label: 'Now', value: 48 },
  { label: '6h', value: 52 },
  { label: '12h', value: 61 },
  { label: '18h', value: 71 },
  { label: '24h', value: 67 }
];

const colorForReadiness = (r: number) => {
  if (r >= 80) return 'emerald';
  if (r >= 60) return 'amber';
  return 'red';
};

const HospitalCommandCenter = () => {
  const [hospitals] = useState<Hospital[]>(hospitalsSeed);
  const [activeHospital, setActiveHospital] = useState<Hospital>(hospitalsSeed[0]);
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'Risk' | 'Demand' | 'Surge' | 'Utilization'>('Risk');
  const [reservedBeds, setReservedBeds] = useState(0);
  const [toastMessage, setToastMessage] = useState('');

  const nearestDonors = useMemo(
    () => donorsSeed.filter((donor) => donor.district === activeHospital.district).sort((a, b) => a.distance - b.distance),
    [activeHospital]
  );

  const ambulanceTrackers = [
    { id: 'AMB-04', label: 'Ambulance 04', lat: activeHospital.lat + 0.02, lng: activeHospital.lng + 0.01, distance: '6 km' },
    { id: 'AMB-11', label: 'Ambulance 11', lat: activeHospital.lat - 0.01, lng: activeHospital.lng - 0.02, distance: '3 km' }
  ];

  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  const [mapSrc, setMapSrc] = useState(`https://www.google.com/maps?q=${activeHospital.lat},${activeHospital.lng}&z=13&output=embed`);

  useEffect(() => {
    if (activeMarker === 'apollo') {
      setMapSrc(`https://www.google.com/maps?q=${encodeURIComponent('Apollo Hospital Chennai')}&z=15&output=embed`);
      return;
    }
    if (activeMarker === 'donor') {
      setMapSrc(`https://www.google.com/maps?q=${encodeURIComponent('Blood Donor Chennai')}&z=13&output=embed`);
      return;
    }
    const amb = ambulanceTrackers.find((a) => a.id === activeMarker);
    if (amb) {
      setMapSrc(`https://www.google.com/maps?q=${amb.lat},${amb.lng}&z=14&output=embed`);
      return;
    }
    // default center on active hospital
    setMapSrc(`https://www.google.com/maps?q=${activeHospital.lat},${activeHospital.lng}&z=13&output=embed`);
  }, [activeMarker, activeHospital]);

  const navigateTo = (label: string, lat?: number, lng?: number) => {
    const url = lat && lng ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}` : `https://www.google.com/maps?q=${encodeURIComponent(label)}`;
    window.open(url, '_blank');
  };

  const riskLevel = activeHospital.readiness >= 80 ? 'Low' : activeHospital.readiness >= 60 ? 'Medium' : 'High';
  const riskTone = riskLevel === 'Low' ? 'bg-emerald-500/10 text-emerald-200' : riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-200' : 'bg-red-500/10 text-red-200';

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(''), 3000);
  };

  const openRoute = (h: Hospital) => {
    if (!navigator.geolocation) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(h.name)}`;
      window.open(url, '_blank');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${h.lat},${h.lng}&travelmode=driving`;
        window.open(url, '_blank');
      },
      () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(h.name)}`;
        window.open(url, '_blank');
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const activateDonors = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Activate donors for ${activeHospital.name} immediately.`)}`, '_blank');
    showToast('Donor activation sent to network.');
  };

  const reserveBeds = () => {
    setReservedBeds((current) => current + 2);
    showToast('Reserve beds workflow started.');
  };

  const notifyDonor = (donor: Donor) => {
    window.open(`https://wa.me/91${donor.phone}?text=${encodeURIComponent(`Requesting ${donor.group} blood for patient at ${activeHospital.name}.`)}`, '_blank');
    showToast(`Request sent to ${donor.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Hospital Command Center</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Real-time Emergency Coordination</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-300">Hospital readiness, ICU status, beds and donor response—all in one professional operations hub.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {hospitals.map((hospital) => (
            <button
              key={hospital.id}
              onClick={() => setActiveHospital(hospital)}
              className={`interactive-button glow-button ${activeHospital.id === hospital.id ? 'bg-cyan-600/10 text-cyan-200' : 'bg-white/5 text-slate-300'}`}
            >
              {hospital.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <div className="space-y-6">
          <SectionCard title="Hospital Snapshot" subtitle="Live operations and location view">
            <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
              <div className="space-y-4">
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_18px_45px_-25px_rgba(56,189,248,0.7)]">
                      <span className="text-2xl font-bold">{activeHospital.name.split(' ').map((word) => word[0]).join('')}</span>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{activeHospital.district}</p>
                      <h2 className="text-2xl font-semibold text-white truncate" title={activeHospital.name}>{activeHospital.name}</h2>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {activeHospital.specialties.map((tag) => (
                          <span key={tag} className="badge-pill">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {[
                      { label: 'Readiness', value: `${activeHospital.readiness}%`, icon: <Activity className="h-4 w-4" />, accent: 'text-cyan-300', tooltip: 'Overall readiness score' },
                      { label: 'ICU Occupancy', value: `${activeHospital.icuOccupancy}%`, icon: <HeartPulse className="h-4 w-4" />, accent: 'text-amber-300', tooltip: 'Current ICU utilization' },
                      { label: 'Beds Available', value: `${activeHospital.bedsAvailable}`, icon: <Hospital className="h-4 w-4" />, accent: 'text-emerald-300', tooltip: 'Available ward beds' },
                      { label: 'Performance', value: `${activeHospital.performance}%`, icon: <TrendingUp className="h-4 w-4" />, accent: 'text-white', tooltip: 'Operational quality index' }
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-3xl bg-white/5 p-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl bg-slate-900/80 p-2 text-slate-200">{stat.icon}</div>
                          <div>
                            <p className="text-xs text-slate-400">{stat.label}</p>
                            <p className={`mt-2 text-2xl font-semibold ${stat.accent} truncate`} title={stat.tooltip}>{stat.value}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Assigned hospital</p>
                      <p className="mt-2 text-lg font-semibold text-white">{activeHospital.name}</p>
                    </div>
                    <span className="badge-pill bg-cyan-500/10 text-cyan-200">{activeHospital.distance}</span>
                  </div>
                  <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    <p className="font-semibold text-white">Live location & routing</p>
                    <p className="mt-2 text-slate-400">Track hospital status and open navigation to the facility directly.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden border border-white/10 bg-slate-950/80">
                <iframe
                  title="Hospital location"
                  className="h-full min-h-[320px] w-full"
                  src={`https://www.google.com/maps?q=${activeHospital.lat},${activeHospital.lng}&z=15&output=embed`}
                  loading="lazy"
                />
                <div className="border-t border-white/10 bg-slate-950/80 p-4">
                  <button onClick={() => openRoute(activeHospital)} className="interactive-button glow-button w-full bg-cyan-600/10 text-cyan-200">Navigate</button>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Nearby Hospitals & Blood Banks" subtitle="Distance, stock, and live coordination">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">Nearby hospitals</p>
                  <span className="badge-pill bg-cyan-500/10 text-cyan-200">Live</span>
                </div>
                <div className="mt-4 space-y-3">
                  {hospitals.map((hospital) => (
                    <div key={hospital.id} className="rounded-3xl bg-white/5 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate" title={hospital.name}>{hospital.name}</p>
                          <p className="text-xs text-slate-400">{hospital.district} • {hospital.distance}</p>
                        </div>
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${colorForReadiness(hospital.readiness) === 'emerald' ? 'bg-emerald-500/15 text-emerald-300' : colorForReadiness(hospital.readiness) === 'amber' ? 'bg-amber-500/15 text-amber-300' : 'bg-red-500/15 text-red-300'}`}>Ready {hospital.readiness}%</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <button onClick={() => openRoute(hospital)} className="rounded-2xl bg-white/5 px-3 py-2 text-xs text-slate-200 hover:bg-white/10">Directions</button>
                        <button onClick={() => { setActiveHospital(hospital); showToast(`Switched focus to ${hospital.name}`); }} className="rounded-2xl bg-cyan-600/10 px-3 py-2 text-xs text-cyan-200 hover:bg-cyan-500/15">Switch</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">Blood bank markers</p>
                  <span className="badge-pill bg-emerald-500/10 text-emerald-200">Stock</span>
                </div>
                <div className="mt-4 space-y-3">
                  {bloodBanks.map((bank) => (
                    <div key={bank.name} className="rounded-3xl bg-white/5 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">{bank.name}</p>
                          <p className="text-xs text-slate-400">{bank.distance}</p>
                        </div>
                        <button onClick={() => showToast(`Reserve request sent to ${bank.name}`)} className="rounded-full bg-cyan-500/10 px-3 py-2 text-xs text-cyan-200 hover:bg-cyan-500/15">Reserve Unit</button>
                      </div>
                      <div className="mt-4 grid gap-2">
                        {Object.entries(bank.inventory).map(([group, units]) => (
                          <div key={group} className="flex items-center justify-between rounded-3xl bg-slate-950/80 px-4 py-2 text-sm text-slate-300">
                            <span>{group}</span>
                            <span className="font-semibold text-white">{units} units</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="AI Copilot Actions" subtitle="Predictive alerts with one-click workflows">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
              <button
                type="button"
                onClick={() => setAccordionOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-3xl bg-white/5 px-4 py-3 text-left text-white transition hover:bg-white/10"
              >
                <div>
                  <p className="text-sm font-semibold">Predictive alert center</p>
                  <p className="text-xs text-slate-400">Expand for AI recommendations</p>
                </div>
                <span className="text-slate-300">{accordionOpen ? 'Hide' : 'Show'}</span>
              </button>
              {accordionOpen && (
                <div className="mt-4 space-y-3">
                  {predictiveAlerts.map((alert) => (
                    <div key={alert.title} className="rounded-3xl bg-white/5 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">{alert.title}</p>
                          <p className={`mt-2 text-sm ${alert.tone}`}>{alert.message}</p>
                        </div>
                        <Zap className={`h-5 w-5 ${alert.tone}`} />
                      </div>
                    </div>
                  ))}
                  <div className="grid gap-3">
                    <button onClick={activateDonors} className="interactive-button glow-button rounded-3xl bg-red-600/10 px-4 py-3 text-sm text-red-200">Activate Donors</button>
                    <button onClick={reserveBeds} className="interactive-button glow-button rounded-3xl bg-amber-500/10 px-4 py-3 text-sm text-amber-200">Reserve Beds</button>
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard title="National Response Map" subtitle="Live hospital, donor swarm and ambulance locations">
            <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
              <div className="rounded-3xl overflow-hidden border border-white/10 bg-slate-950/80">
                <iframe
                  title="National response map"
                  className="h-full min-h-[320px] w-full"
                  src={mapSrc}
                  loading="lazy"
                />
                <div className="border-t border-white/10 bg-slate-950/80 p-4">
                  <p className="text-sm text-slate-300">Map centered on {activeHospital.name}. Click markers on the right to navigate.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="badge-pill bg-white/5 text-slate-200">Hospitals: <strong className="ml-2">4</strong></span>
                    <span className="badge-pill bg-white/5 text-slate-200">Donors: <strong className="ml-2">23</strong></span>
                    <span className="badge-pill bg-white/5 text-slate-200">Ambulances: <strong className="ml-2">3</strong></span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">Markers</p>
                    <span className="badge-pill bg-cyan-500/10 text-cyan-200">Interactive</span>
                  </div>
                  <div className="mt-3 grid gap-3">
                    <button
                      onMouseEnter={() => setActiveMarker('apollo')}
                      onMouseLeave={() => setActiveMarker(null)}
                      onClick={() => { setActiveMarker('apollo'); navigateTo('Apollo Hospital Chennai'); }}
                      title={`Apollo Hospital — ${hospitalsSeed[1].distance} — Readiness ${hospitalsSeed[1].readiness}%`}
                      className={`rounded-2xl p-3 text-left flex items-center justify-between transition ${activeMarker === 'apollo' ? 'shadow-[0_10px_30px_rgba(34,211,238,0.08)] bg-cyan-500/5' : 'bg-white/5'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🏥</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">Apollo Hospital</p>
                          <p className="text-xs text-slate-400">{hospitalsSeed[1].district} • {hospitalsSeed[1].distance}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-300">{hospitalsSeed[1].readiness}%</span>
                        <button onClick={(e) => { e.stopPropagation(); setActiveMarker('apollo'); navigateTo('Apollo Hospital Chennai'); }} className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">Navigate</button>
                      </div>
                    </button>

                    <button
                      onMouseEnter={() => setActiveMarker('donor')}
                      onMouseLeave={() => setActiveMarker(null)}
                      onClick={() => { setActiveMarker('donor'); navigateTo('Blood Donor Chennai'); }}
                      title={`Donor swarm — ${nearestDonors.length} nearby`}
                      className={`rounded-2xl p-3 text-left flex items-center justify-between transition ${activeMarker === 'donor' ? 'shadow-[0_10px_30px_rgba(239,68,68,0.06)] bg-red-500/5' : 'bg-white/5'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">❤️</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-white">Donor Swarm</p>
                          <p className="text-xs text-slate-400">{nearestDonors.length} donors • nearest {nearestDonors[0] ? `${nearestDonors[0].distance} km` : '—'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); setActiveMarker('donor'); navigateTo('Blood Donor Chennai'); }} className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">Navigate</button>
                      </div>
                    </button>

                    {ambulanceTrackers.map((amb) => (
                      <button
                        key={amb.id}
                        onMouseEnter={() => setActiveMarker(amb.id)}
                        onMouseLeave={() => setActiveMarker(null)}
                        onClick={() => { setActiveMarker(amb.id); navigateTo(amb.label, amb.lat, amb.lng); }}
                        title={`${amb.label} — ${amb.distance}`}
                        className={`rounded-2xl p-3 text-left flex items-center justify-between transition ${activeMarker === amb.id ? 'shadow-[0_10px_30px_rgba(249,115,22,0.06)] bg-amber-500/5' : 'bg-white/5'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🚑</span>
                          <div className="min-w-0">
                            <p className="font-semibold text-white truncate">{amb.label}</p>
                            <p className="text-xs text-slate-400">{amb.distance} • live</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={(e) => { e.stopPropagation(); setActiveMarker(amb.id); navigateTo(amb.label, amb.lat, amb.lng); }} className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-200">Navigate</button>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-sm text-slate-300">
                  <p className="font-semibold text-white">Map tips</p>
                  <ul className="mt-2 space-y-1">
                    <li>Click a marker to open navigation in a new tab.</li>
                    <li>Hover a marker to highlight its location on the map.</li>
                  </ul>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Predictive Health Scoreboard" subtitle="Tabbed risk, demand, surge and utilization">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {['Risk', 'Demand', 'Surge', 'Utilization'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab as 'Risk' | 'Demand' | 'Surge' | 'Utilization')}
                    className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${activeTab === tab ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200' : 'border-white/10 bg-white/5 text-slate-300 hover:border-cyan-500/20 hover:bg-white/10'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                {activeTab === 'Risk' && (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-400">Risk zone score shows how urgent hospital support is.</p>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Critical exposure</span>
                      <span>73%</span>
                    </div>
                    <div className="mt-2 h-3 rounded-full bg-slate-900">
                      <div className="h-full rounded-full bg-red-500" style={{ width: '73%' }} />
                    </div>
                  </div>
                )}
                {activeTab === 'Demand' && (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-400">Demand forecast for key blood groups.</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {['O+', 'A+', 'B+'].map((group, index) => (
                        <div key={group} className="rounded-3xl bg-white/5 p-4">
                          <p className="text-xs text-slate-400">{group}</p>
                          <p className="mt-2 text-xl font-semibold text-white">{[82, 68, 54][index]}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'Surge' && (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-400">Surge trend over the next 24 hours.</p>
                    <div className="grid gap-2">
                      {surgeTrend.map((item) => (
                        <div key={item.label} className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>{item.label}</span>
                            <span>{item.value}%</span>
                          </div>
                          <div className="trend-bar">
                            <div className={`trend-segment ${item.value >= 70 ? 'bg-red-400' : item.value >= 55 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${item.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'Utilization' && (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-400">ICU utilization and readiness.</p>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>ICU occupancy</span>
                      <span>{activeHospital.icuOccupancy}%</span>
                    </div>
                    <div className="mt-2 h-3 rounded-full bg-slate-900">
                      <div className="h-full rounded-full bg-cyan-400" style={{ width: `${activeHospital.icuOccupancy}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Patient–Donor Connect" subtitle="Nearest donors and response readiness">
            <div className="space-y-4">
              {nearestDonors.map((donor) => (
                <div key={donor.phone} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{donor.name}</p>
                      <p className="mt-1 text-xs text-slate-400 truncate" title={`${donor.group} • ${donor.distance} km away`}>{donor.group} • {donor.distance} km away</p>
                      <p className="mt-2 text-xs text-slate-500">Last active: {donor.lastSeen}</p>
                    </div>
                    <span className="badge-pill bg-emerald-500/10 text-emerald-200">Nearby</span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <button onClick={() => notifyDonor(donor)} className="interactive-button glow-button rounded-3xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">Request Blood</button>
                    <button onClick={() => showToast(`Loyalty points enabled for ${donor.name}`)} className="interactive-button glow-button rounded-3xl bg-white/5 px-4 py-3 text-sm text-slate-200">Award Loyalty</button>
                  </div>
                </div>
              ))}
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                <p className="text-sm text-slate-400">Live donor map</p>
                <div className="mt-4 h-64 overflow-hidden rounded-3xl border border-white/10">
                  <iframe
                    title="Donor live location"
                    className="h-full w-full"
                    src={`https://www.google.com/maps?q=${activeHospital.lat},${activeHospital.lng}&z=13&output=embed`}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-3xl border border-white/10 bg-slate-950/95 px-5 py-3 text-sm text-white shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default HospitalCommandCenter;
