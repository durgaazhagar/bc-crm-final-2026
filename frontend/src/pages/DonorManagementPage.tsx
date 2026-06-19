import { useEffect, useMemo, useState } from 'react';
import SectionCard from '../components/SectionCard';
import api, { donorService, aiService } from '../services/api';
import { Award, Activity, Building2, AlertCircle, TrendingUp, Users, Heart, PhoneCall, MapPin, Navigation, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

const initialForm = { name: '', bloodGroup: 'A+', location: '', phone: '', donations: 0, trustScore: 70, engagementLevel: 60, responseRate: 60, status: 'active', loyalty: 0, retentionScore: 100, availability: 'available', lastDonationDate: '2026-01-01' };

const mockDonors = [
  { _id: 'D001', name: 'Gopi', bloodGroup: 'O+', district: 'Chennai', location: 'Chennai', phone: '9000012345', donations: 12, trustScore: 96, status: 'active', loyalty: 1200, retentionScore: 94, lastDonation: '2026-05-12', availability: 'available', badge: 'Platinum Guardian', priority: 'High' },
  { _id: 'D002', name: 'Dinesh', bloodGroup: 'B+', district: 'Coimbatore', location: 'Coimbatore', phone: '9000012346', donations: 8, trustScore: 89, status: 'active', loyalty: 800, retentionScore: 89, lastDonation: '2026-04-25', availability: 'busy', badge: 'Gold Donor' },
  { _id: 'D003', name: 'Malathika', bloodGroup: 'A+', district: 'Madurai', location: 'Madurai', phone: '9000012347', donations: 6, trustScore: 85, status: 'active', loyalty: 600, retentionScore: 85, lastDonation: '2026-03-18', availability: 'available', badge: 'Silver Donor' },
  { _id: 'D004', name: 'Ganesh', bloodGroup: 'O-', district: 'Tirunelveli', location: 'Tirunelveli', phone: '9000012348', donations: 10, trustScore: 92, status: 'active', loyalty: 1000, retentionScore: 90, lastDonation: '2026-06-05', availability: 'available', badge: 'Platinum Guardian', priority: 'High', rareBlood: true },
  { _id: 'D005', name: 'Devatamil', bloodGroup: 'AB+', district: 'Salem', location: 'Salem', phone: '9000012349', donations: 7, trustScore: 88, status: 'inactive', loyalty: 700, retentionScore: 88, lastDonation: '2026-04-29', availability: 'unavailable', badge: 'Gold Donor' },
  { _id: 'D006', name: 'Praveen', bloodGroup: 'B-', district: 'Erode', location: 'Erode', phone: '9000012350', donations: 9, trustScore: 91, status: 'active', loyalty: 900, retentionScore: 91, lastDonation: '2026-05-14', availability: 'available', badge: 'Platinum Guardian' },
  { _id: 'D007', name: 'Pratiksha', bloodGroup: 'A-', district: 'Thanjavur', location: 'Thanjavur', phone: '9000012351', donations: 5, trustScore: 83, status: 'active', loyalty: 500, retentionScore: 82, lastDonation: '2026-04-21', availability: 'busy', badge: 'Silver Donor' },
  { _id: 'D008', name: 'Durga', bloodGroup: 'O+', district: 'Vellore', location: 'Vellore', phone: '9000012352', donations: 11, trustScore: 94, status: 'active', loyalty: 1100, retentionScore: 93, lastDonation: '2026-06-03', availability: 'available', badge: 'Platinum Guardian', priority: 'High' },
  { _id: 'D009', name: 'Nithish', bloodGroup: 'AB-', district: 'Kanchipuram', location: 'Kanchipuram', phone: '9000012353', donations: 8, trustScore: 90, status: 'inactive', loyalty: 800, retentionScore: 90, lastDonation: '2026-05-11', availability: 'unavailable', badge: 'Gold Donor', priority: 'High', rareBlood: true },
  { _id: 'D010', name: 'Gokulan', bloodGroup: 'B+', district: 'Tiruppur', location: 'Tiruppur', phone: '9000012354', donations: 6, trustScore: 86, status: 'active', loyalty: 600, retentionScore: 86, lastDonation: '2026-04-27', availability: 'available', badge: 'Silver Donor' },
];

const hospitals = [
  { name: 'Apollo Hospital', city: 'Chennai', bloodRequests: 45, lastRequest: '2026-06-14' },
  { name: 'Government Rajaji Hospital', city: 'Madurai', bloodRequests: 32, lastRequest: '2026-06-13' },
  { name: 'Kauvery Hospital', city: 'Tiruchirappalli', bloodRequests: 28, lastRequest: '2026-06-12' },
  { name: 'Ganga Hospital', city: 'Coimbatore', bloodRequests: 38, lastRequest: '2026-06-14' },
  { name: 'Vinayaka Mission Hospital', city: 'Salem', bloodRequests: 22, lastRequest: '2026-06-11' },
];

const recentActivities = [
  { type: 'emergency', text: 'Emergency O+ request matched with Gopi', time: '2h ago' },
  { type: 'campaign', text: 'Blood donation drive created in Chennai', time: '4h ago' },
  { type: 'reward', text: 'Durga earned Gold Donor badge', time: '6h ago' },
  { type: 'hospital', text: 'Hospital request fulfilled through Ganesh', time: '8h ago' },
  { type: 'ai', text: 'AI predicted increased B+ demand in Coimbatore region', time: '1d ago' },
];

const rewards = [
  { tier: 'Silver Donor', points: 500, minDonations: 3 },
  { tier: 'Gold Donor', points: 1000, minDonations: 5 },
  { tier: 'Platinum Guardian', points: 2500, minDonations: 8 },
  { tier: 'Legend of Life', points: 5000, minDonations: 10 },
];

const DonorManagementPage = () => {
  const [donors, setDonors] = useState<any[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // UI state
  const [query, setQuery] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [addingDonor, setAddingDonor] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [alertHistory, setAlertHistory] = useState<any[]>([]);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalData, setAlertModalData] = useState<any | null>(null);
  const [alertSendingId, setAlertSendingId] = useState<string | null>(null);
  const [alertStatusMap, setAlertStatusMap] = useState<Record<string, string>>({});
  const [lastAlertTimestamps, setLastAlertTimestamps] = useState<Record<string, number>>({});
  const [trackStatus, setTrackStatus] = useState<string>('');
  const [nearestDonorResult, setNearestDonorResult] = useState<any | null>(null);
  const [eligibilityResult, setEligibilityResult] = useState<any | null>(null);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [eligibilityForm, setEligibilityForm] = useState({ age: 25, weight: 65, lastDonationDate: '2026-01-01', healthIssues: { hbLow: false, chronicIllness: false }, donations: 6, responseRate: 72, fraudSuspicion: false });

  const getAlertKey = (donor: any) => donor._id || donor.id || donor.phone || donor.name;

  const getAlertButtonText = (donor: any) => {
    const donorId = getAlertKey(donor);
    return alertStatusMap[donorId] || 'Send Alert';
  };

  const hasRecentAlert = (donor: any) => {
    const donorId = getAlertKey(donor);
    const lastTime = lastAlertTimestamps[donorId];
    return lastTime ? Date.now() - lastTime < 30000 : false;
  };

  const handleSendAlert = (donor: any) => {
    if (!donor.phone) {
      showToast('Unable to send alert. Phone number not available.');
      return;
    }

    if (hasRecentAlert(donor)) {
      showToast('Duplicate alert prevented. Please wait before retrying.');
      return;
    }

    const donorId = getAlertKey(donor);
    setAlertStatusMap((prev) => ({ ...prev, [donorId]: 'Sending...' }));
    setAlertSendingId(donorId);

    window.setTimeout(() => {
      const alertRecord = {
        donorName: donor.name,
        phone: donor.phone,
        bloodGroup: donor.bloodGroup,
        district: donor.district || donor.location || 'Unknown',
        alertTime: new Date(),
        status: 'Sent',
      };

      setAlertHistory((prev) => [alertRecord, ...prev]);
      setLastAlertTimestamps((prev) => ({ ...prev, [donorId]: Date.now() }));
      setAlertModalData(alertRecord);
      setAlertModalOpen(true);
      setAlertStatusMap((prev) => ({ ...prev, [donorId]: 'Alert Sent ✅' }));
      setAlertSendingId(null);
      showToast(`🚨 Emergency Alert Sent to ${donor.name}`);

      const whatsappUrl = `https://wa.me/${donor.phone}?text=${encodeURIComponent('Urgent Blood Donation Request')}`;
      window.open(whatsappUrl, '_blank');

      window.setTimeout(() => {
        setAlertStatusMap((prev) => ({ ...prev, [donorId]: 'Send Alert' }));
      }, 5000);
    }, 1000);
  };

  const callTop3NearestDonors = () => {
    const availableDonors = donors.filter((d) => d.availability === 'available');
    if (!availableDonors.length) {
      setToastMessage('No available donors to call.');
      return;
    }

    const topThree = availableDonors.slice(0, 3);
    const names = topThree.map((donor) => donor.name).join(', ');
    window.open(`tel:${topThree[0].phone}`);
    setToastMessage(`Calling top donors: ${names}`);
  };

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const res = await donorService.getDonors();
      const data = res?.data?.data || res?.data || mockDonors;
      setDonors(Array.isArray(data) ? data : mockDonors);
    } catch (error) {
      console.error('Donor fetch failed, using mock data', error);
      setDonors(mockDonors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();

    // load lightweight AI recommendations (non-blocking)
    (async () => {
      try {
        const r = await aiService.getDonorActivity();
        const recs = r?.data?.data?.recommended || [];
        setAiRecommendations(recs.length ? recs : mockDonors.slice(0, 2));
      } catch (e) {
        setAiRecommendations(mockDonors.slice(0, 2));
      }
    })();
  }, []);

  const normalizeText = (value: string | undefined) => value?.toString().toLowerCase().trim() || '';

  const districtAliases: Record<string, string> = {
    trichy: 'tiruchirappalli',
    tiruchy: 'tiruchirappalli',
    tirchy: 'tiruchirappalli',
  };

  const canonicalDistrict = (value: string) => {
    const normalized = normalizeText(value);
    return districtAliases[normalized] || normalized;
  };

  const computeKPIs = useMemo(() => {
    const total = donors.length;
    const active = donors.filter((d) => d.status === 'active').length;
    const eligible = donors.filter((d) => d.availability === 'available').length;
    // Retention rate = Active Donors ÷ Total Donors (NOT average of retention scores)
    const retention = total ? Math.round((active / total) * 100) : 0;
    return { total, active, eligible, retention, alertsSent: alertHistory.length };
  }, [donors, alertHistory]);

  const uniqueDistricts = useMemo(() => {
    const donorDistricts = donors.map((d) => canonicalDistrict(d.district || d.location));
    const extraDistricts = ['Chennai', 'Madurai', 'Salem', 'Coimbatore', 'Tiruchirappalli', 'Erode', 'Thanjavur', 'Vellore', 'Kanchipuram', 'Tiruppur'];
    const canonicalExtra = extraDistricts.map(canonicalDistrict);
    // Deduplicate by using a Map with canonical names as keys
    const uniqueMap = new Map([...canonicalExtra, ...donorDistricts].map(d => [d, d]));
    return Array.from(uniqueMap.values()).sort();
  }, [donors]);

  const filtered = useMemo(() => donors.filter((d) => {
    const districtText = canonicalDistrict(`${d.district || d.location}`);
    // Search across name, phone, and district (case-insensitive)
    const searchStr = `${d.name} ${d.phone} ${districtText}`.toLowerCase();
    const queryLower = query.toLowerCase().trim();
    if (queryLower && !searchStr.includes(queryLower)) return false;
    if (selectedBloodGroup && d.bloodGroup !== selectedBloodGroup) return false;
    if (filterDistrict && districtText !== canonicalDistrict(filterDistrict)) return false;
    if (filterAvailability && d.availability !== filterAvailability) return false;
    if (filterStatus && d.status !== filterStatus) return false;
    return true;
  }), [donors, query, selectedBloodGroup, filterDistrict, filterAvailability, filterStatus]);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginatedDonors = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedBloodGroup, filterDistrict, filterAvailability, filterStatus, donors]);

  const openProfile = (donor: any) => {
    setSelectedDonor(donor);
    setDrawerOpen(true);
  };

  const closeProfile = () => {
    setDrawerOpen(false);
    setSelectedDonor(null);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await donorService.updateDonor(editingId, form);
      } else {
        await donorService.createDonor(form);
      }
      setForm(initialForm);
      setEditingId(null);
      fetchDonors();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (donor: any) => {
    setEditingId(donor._id);
    setForm({ ...donor });
    openProfile(donor);
  };

  const handleDelete = async (id: string) => {
    try {
      await donorService.deleteDonor(id);
      fetchDonors();
    } catch (error) {
      console.error(error);
      setDonors((prev) => prev.filter((d) => d._id !== id));
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddDonor = async () => {
    const name = form.name.trim();
    const bloodGroup = form.bloodGroup ? form.bloodGroup.trim() : '';
    const district = form.location.trim();
    const phone = form.phone.trim();

    // Validate all required fields
    if (!name) {
      showToast('Please enter donor name');
      return;
    }
    if (!bloodGroup) {
      showToast('Please select a blood group');
      return;
    }
    if (!district) {
      showToast('Please enter city/district');
      return;
    }
    if (!phone) {
      showToast('Please enter phone number');
      return;
    }

    // Validate phone format
    if (!/^[0-9]{10}$/.test(phone)) {
      showToast('Phone must be a valid 10-digit number');
      return;
    }
    
    // Validate blood group
    const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodGroups.includes(bloodGroup)) {
      showToast('Please select a valid blood group');
      return;
    }

    setAddingDonor(true);

    window.setTimeout(async () => {
      const newDonor = {
        _id: editingId || Date.now().toString(),
        id: editingId ? editingId : Date.now(),
        name,
        bloodGroup,
        district,
        location: district,
        phone,
        donations: editingId ? form.donations : 0,
        loyalty: editingId ? form.loyalty : 0,
        retentionScore: editingId ? form.retentionScore : 100,
        availability: editingId ? form.availability : 'available',
        status: editingId ? form.status : 'active',
        trustScore: editingId ? form.trustScore : 70,
        engagementLevel: editingId ? form.engagementLevel : 60,
        responseRate: editingId ? form.responseRate : 60,
        lastDonationDate: form.lastDonationDate || '2026-01-01',
      };

      if (editingId) {
        setDonors((prev) => prev.map((donor) => (donor._id === editingId ? { ...donor, ...newDonor } : donor)));
        showToast('Donor Updated Successfully');
        try {
          await donorService.updateDonor(editingId, newDonor);
        } catch (error) {
          console.error('Failed to update donor on backend', error);
        }
      } else {
        setDonors((prev) => [newDonor, ...prev]);
        showToast('Donor Added Successfully');
        try {
          await donorService.createDonor(newDonor);
        } catch (error) {
          console.error('Failed to save donor on backend', error);
        }
      }

      setForm(initialForm);
      setEditingId(null);
      setAddingDonor(false);
    }, 1000);
  };

  const handleTrackDonor = async () => {
    if (!selectedDonor) return;
    setTrackStatus('Locating patient position…');
    setNearestDonorResult(null);

    if (!navigator.geolocation) {
      setTrackStatus('Geolocation not supported in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const patientLocation = `${position.coords.latitude},${position.coords.longitude}`;
      try {
        const response = await api.post('/ai/nearest-donor', {
          patientLocation,
          bloodGroup: selectedDonor.bloodGroup,
        });

        const data = response.data.data;
        setNearestDonorResult(data);
        setTrackStatus(`Nearest donor located: ${data.donor.name}. Distance ${data.distanceKm} km, ETA ${data.etaMinutes} min.`);
        window.open(data.routeUrl, '_blank');
      } catch (error) {
        console.error(error);
        setTrackStatus('Unable to locate nearest donor at this time.');
      }
    }, (error) => {
      setTrackStatus(`Geolocation error: ${error.message}`);
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 });
  };

  const handleTrackDonorFromList = async (donor: any) => {
    setSelectedDonor(donor);
    setDrawerOpen(true);
    setTrackStatus('Locating patient position…');
    setNearestDonorResult(null);

    if (!navigator.geolocation) {
      setTrackStatus('Geolocation not supported in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const patientLocation = `${position.coords.latitude},${position.coords.longitude}`;
      try {
        const response = await api.post('/ai/nearest-donor', {
          patientLocation,
          bloodGroup: donor.bloodGroup,
        });

        const data = response.data.data;
        setNearestDonorResult(data);
        setTrackStatus(`Nearest donor located: ${data.donor.name}. Distance ${data.distanceKm} km, ETA ${data.etaMinutes} min.`);
        window.open(data.routeUrl, '_blank');
      } catch (error) {
        console.error(error);
        setTrackStatus('Unable to locate nearest donor at this time.');
      }
    }, (error) => {
      setTrackStatus(`Geolocation error: ${error.message}`);
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 });
  };

  const handleEligibilityCheck = async () => {
    setEligibilityLoading(true);
    setEligibilityResult(null);
    try {
      const response = await api.post('/ai/check-eligibility', eligibilityForm);
      setEligibilityResult(response.data.data);
    } catch (error) {
      console.error(error);
      setEligibilityResult({ eligible: false, reason: 'Unable to evaluate eligibility at this time.', score: 0 });
    } finally {
      setEligibilityLoading(false);
    }
  };

  // Quick actions (placeholders)
  const quickCall = (phone: string) => window.open(`tel:${phone}`);
  const quickEmail = (emailOrPhone: string) => window.open(`mailto:${emailOrPhone}`);
  const quickSMS = (phone: string) => window.open(`sms:${phone}`);

  // Determine recommendation reason for AI donors
  const getRecommendationReason = (donor: any, index: number) => {
    if (donor.priority === 'High') return 'High priority match';
    if (donor.rareBlood) return 'Rare blood type';
    if (donor.trustScore >= 90) return 'Trusted donor (90%+ score)';
    if (donor.donations >= 10) return `Loyal donor (${donor.donations} donations)`;
    if (donor.availability === 'available') return 'Available now';
    return `Strong match (${Math.min(99, donor.retentionScore || 80)}% score)`;
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Donor CRM" subtitle="Enterprise donor management module">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* KPI Cards with Enhanced Visual Hierarchy */}
            <div className="lg:col-span-3 grid grid-cols-1 gap-4 md:grid-cols-5">
            {/* Total Donors - Standard */}
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-400">Total Donors</div>
                <Users className="h-4 w-4 text-slate-500" />
              </div>
              <div className="stat-value mt-2">{computeKPIs.total}</div>
            </div>
            
            {/* Active Donors - HIGHLIGHTED (Primary Color) */}
            <div className="stat-card ring-2 ring-emerald-400/30 bg-gradient-to-br from-slate-900 to-emerald-950/20">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-emerald-300">Active Donors</div>
                <Heart className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="stat-value mt-2 text-emerald-300">{computeKPIs.active}</div>
            </div>
            
            {/* Eligible Donors - Standard */}
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-400">Eligible Donors</div>
                <TrendingUp className="h-4 w-4 text-slate-500" />
              </div>
              <div className="stat-value mt-2">{computeKPIs.eligible}</div>
            </div>
            
            {/* Retention Rate with Tooltip */}
            <div className="stat-card group cursor-help" title="Retention Rate = Active Donors ÷ Total Donors. Higher % = more consistent donor participation.">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-400">Retention</div>
                <span className="inline-block text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full">?</span>
              </div>
              <div className="stat-value mt-2">{computeKPIs.retention}%</div>
              <div className="text-xs text-slate-500 mt-1 opacity-0 group-hover:opacity-100 transition">Formula: Active ÷ Total</div>
            </div>
            
            {/* Alerts Sent - HIGHLIGHTED (Alert Color) */}
            <div className="stat-card ring-2 ring-red-400/30 bg-gradient-to-br from-slate-900 to-red-950/20">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-red-300">Alerts Sent</div>
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="stat-value mt-2 text-red-300">{computeKPIs.alertsSent}</div>
            </div>
          </div>

          {/* Filters & Actions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <input placeholder="Search by name, phone, district" className="input-field flex-1" value={query} onChange={(e) => setQuery(e.target.value)} />
              <div className="flex flex-wrap gap-2">
                {['All','A+','A-','B+','B-','O+','O-','AB+','AB-'].map((group) => {
                  const isActive = group === 'All' ? selectedBloodGroup === '' : selectedBloodGroup === group;
                  const buttonValue = group === 'All' ? '' : group;
                  return (
                    <button
                      key={group}
                      type="button"
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 ${isActive ? 'border-cyan-400 bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'border-white/10 bg-white/5 text-slate-300 hover:border-cyan-300 hover:bg-white/10 hover:text-white'}`}
                      onClick={() => setSelectedBloodGroup(buttonValue)}
                    >
                      {group}
                    </button>
                  );
                })}
              </div>
              <select className="input-field w-44" value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)}>
                <option value="">All Districts</option>
                {uniqueDistricts.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="input-field w-44" value={filterAvailability} onChange={(e) => setFilterAvailability(e.target.value)}>
                <option value="">All Availability</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="unavailable">Unavailable</option>
              </select>
              <select className="input-field w-44" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">Any Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button className="button-secondary" onClick={() => { setQuery(''); setSelectedBloodGroup(''); setFilterDistrict(''); setFilterAvailability(''); setFilterStatus(''); }}>Clear</button>
              <button className="button-primary px-6 py-2 flex items-center gap-2 font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/30 text-white" onClick={callTop3NearestDonors}><PhoneCall className="h-4 w-4" />Call Top 3</button>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-3">
              {uniqueDistricts.map((district) => {
                const isActive = normalizeText(district) === normalizeText(filterDistrict);
                return (
                  <button
                    key={district}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${isActive ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'}`}
                    onClick={() => setFilterDistrict(district)}
                  >
                    {district}
                  </button>
                );
              })}
            </div>
            {filterDistrict && (
              <div className="mt-3 rounded-3xl border border-yellow-400/20 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-100">
                Active district: <span className="font-semibold text-white">{filterDistrict}</span>
              </div>
            )}

            <div className="rounded-3xl border border-white/10 bg-white/5 overflow-x-auto shadow-sm">
              <table className="min-w-[1200px] text-left text-sm text-slate-200">
                <thead className="sticky top-0 bg-slate-950/95 text-slate-400 backdrop-blur-xl">
                  <tr>
                    {['Name','Phone Number','Blood Group','District','Donations','Loyalty Points','Retention Score','Availability','Actions'].map(h => <th key={h} className="px-4 py-3 text-left uppercase tracking-[0.12em] whitespace-nowrap">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/8">
                  {loading ? (
                    <tr><td colSpan={9} className="px-4 py-6 text-center text-slate-400">Loading donors...</td></tr>
                  ) : paginatedDonors.length ? paginatedDonors.map(d => (
                    <tr key={d._id} className="hover:bg-white/5">
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <div className="font-semibold text-white">{d.name}</div>
                          <div className="text-xs text-slate-400">{d.phone}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{d.phone}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{d.bloodGroup}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{d.district || d.location}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{d.donations}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{d.loyalty ?? 0}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 group cursor-help" title="Retention Score = (Active Donors ÷ Total Donors) × 100. Shows donor loyalty consistency.">
                        <span>{d.retentionScore ?? 0}%</span>
                        <span className="inline-block text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition">ℹ</span>
                      </div>
                    </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          d.availability === 'available'
                            ? 'bg-emerald-500/10 text-emerald-300'
                            : d.availability === 'busy'
                            ? 'bg-amber-500/10 text-amber-300'
                            : 'bg-red-500/10 text-red-300'
                        }`}>
                          {d.availability === 'available' ? '🟢 Available' : d.availability === 'busy' ? '🟡 Busy' : '🔴 Unavailable'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button className="rounded-2xl bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/25" onClick={() => quickCall(d.phone)}>Call Now</button>
                          <button
                            className="rounded-2xl bg-cyan-500/15 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => handleSendAlert(d)}
                            disabled={alertSendingId === getAlertKey(d) || hasRecentAlert(d)}
                          >
                            {alertSendingId === getAlertKey(d) ? 'Sending...' : getAlertButtonText(d)}
                          </button>
                          <button className="rounded-2xl bg-violet-500/15 px-3 py-2 text-xs font-semibold text-violet-200 transition hover:bg-violet-500/25 flex items-center gap-1" onClick={() => handleTrackDonorFromList(d)}>
                            <MapPin className="h-3 w-3" /> Track
                          </button>
                          <button className="rounded-2xl bg-white/10 px-3 py-2 text-xs transition hover:bg-white/20" onClick={() => openProfile(d)}>Details</button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={9} className="px-4 py-6 text-center text-yellow-100">⚠️ {selectedBloodGroup ? `No donors available for ${selectedBloodGroup}` : 'No donors available in this district.'}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column: AI widget & quick add */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm text-slate-400 flex items-center gap-2">AI Recommended Donors <span className="text-xs text-cyan-400">Smart Match</span></h3>
              <div className="mt-3 space-y-3">
                {aiRecommendations.map((r, idx) => {
                  const reason = getRecommendationReason(r, idx);
                  return (
                    <div key={idx} className="flex items-start justify-between rounded-lg bg-white/3 p-3 hover:bg-white/5 transition">
                      <div className="flex-1">
                        <div className="font-semibold text-white flex items-center gap-2">
                          {r.name}
                          {r.priority === 'High' && <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300">Priority</span>}
                          {r.rareBlood && <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">Rare</span>}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">{r.bloodGroup} • {r.location}</div>
                        <div className="text-xs text-cyan-300 mt-2 font-medium">✓ {reason}</div>
                      </div>
                      <div className="text-right ml-2">
                        <div className="text-sm font-semibold text-cyan-200">Match {Math.min(99, (r.retentionScore||80))}%</div>
                        <button className="mt-2 rounded-2xl bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600 transition" onClick={() => quickCall(r.phone)}>Contact</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm text-slate-400">Quick Add Donor</h3>
              <div className="mt-3 space-y-2">
                <input className="input-field" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <select className="input-field" value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} required>
                  <option value="">Select blood group *</option>
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g=> <option key={g} value={g}>{g}</option>)}
                </select>
                <input className="input-field" placeholder="City / District" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
                <input className="input-field" placeholder="Phone (10 digits)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                <button
                  className="button-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleAddDonor}
                  disabled={addingDonor || !form.name || !form.bloodGroup || !form.location || !form.phone}
                >
                  {addingDonor ? (editingId ? 'Updating...' : 'Adding Donor...') : editingId ? 'Update Donor' : 'Add Donor'}
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm text-slate-400">Follow-ups & Reminders</h3>
              <div className="mt-3 text-sm text-slate-300">Manage scheduled follow-ups and reminder tasks for donors. Use AI to suggest re-engagement windows.</div>
            </div>
          </div>
        </div>
      </SectionCard>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-3xl border border-white/10 bg-slate-950/95 px-5 py-3 text-sm text-white shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
          {toastMessage}
        </div>
      )}

      {/* CRM Summary: Hospitals, Activities, Rewards */}
      <SectionCard title="CRM Summary" subtitle="Hospital partners, recent activities, and rewards">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Hospital Partners</h3>
                <p className="text-sm text-slate-400">Connected hospitals and recent requests</p>
              </div>
              <Building2 className="h-6 w-6 text-slate-300" />
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {hospitals.map((h) => (
                <li key={h.name} className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{h.name}</div>
                    <div className="text-xs text-slate-400">{h.city}</div>
                  </div>
                  <div className="text-xs text-slate-400">Requests: {h.bloodRequests}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Recent CRM Activities</h3>
                <p className="text-sm text-slate-400">Latest actions in your network</p>
              </div>
              <Activity className="h-6 w-6 text-slate-300" />
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {recentActivities.map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 h-3 w-3 rounded-full bg-red-500/80" />
                  <div>
                    <div className="font-semibold">{a.text}</div>
                    <div className="text-xs text-slate-400">{a.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Rewards System</h3>
                <p className="text-sm text-slate-400">Tiers and points</p>
              </div>
              <Award className="h-6 w-6 text-slate-300" />
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {rewards.map((r) => (
                <li key={r.tier} className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{r.tier}</div>
                    <div className="text-xs text-slate-400">Min donations: {r.minDonations}</div>
                  </div>
                  <div className="text-sm font-semibold text-amber-300">{r.points} pts</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionCard>

      {alertModalOpen && alertModalData && (
        <div className="strong-modal-overlay">
          <div className="strong-modal-card w-full max-w-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Emergency Alert Sent</h2>
                <p className="text-sm text-slate-400">Alert details for the selected donor.</p>
              </div>
              <button className="rounded-2xl bg-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/20" onClick={() => setAlertModalOpen(false)}>Close</button>
            </div>
            <div className="mt-6 grid gap-4 text-sm text-slate-200">
              <div className="rounded-3xl bg-white/5 p-4">
                <div className="text-xs uppercase text-slate-500">Donor Name</div>
                <div className="mt-1 text-base font-semibold text-white">{alertModalData.donorName}</div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/5 p-4">
                  <div className="text-xs uppercase text-slate-500">Blood Group</div>
                  <div className="mt-1 font-semibold text-white">{alertModalData.bloodGroup}</div>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <div className="text-xs uppercase text-slate-500">Phone Number</div>
                  <div className="mt-1 font-semibold text-white">{alertModalData.phone}</div>
                </div>
              </div>
              <div className="rounded-3xl bg-white/5 p-4">
                <div className="text-xs uppercase text-slate-500">District</div>
                <div className="mt-1 font-semibold text-white">{alertModalData.district}</div>
              </div>
              <div className="rounded-3xl bg-white/5 p-4">
                <div className="text-xs uppercase text-slate-500">Alert Status</div>
                <div className="mt-1 font-semibold text-emerald-300">{alertModalData.status}</div>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <a
                href={`https://wa.me/${alertModalData.phone}?text=${encodeURIComponent('Urgent Blood Donation Request')}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Open WhatsApp
              </a>
              <button
                className="rounded-3xl bg-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/20"
                onClick={() => setAlertModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Drawer */}
      <div className={`fixed top-0 right-0 h-full w-[480px] transform transition-transform ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ zIndex: 60 }}>
        <div className="h-full glass-card p-6">
          {selectedDonor ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">{selectedDonor.name}</h2>
                  <div className="text-sm text-slate-400">{selectedDonor.bloodGroup} • {selectedDonor.location}</div>
                </div>
                <div>
                  <button className="rounded-2xl bg-white/10 px-3 py-2" onClick={closeProfile}>Close</button>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-lg bg-white/5 p-3">
                  <div className="text-xs text-slate-400">Retention Score</div>
                  <div className="text-2xl font-semibold">{selectedDonor.retentionScore ?? 0}%</div>
                </div>

                <div className="rounded-lg bg-white/5 p-3">
                  <div className="text-xs text-slate-400">Loyalty Points</div>
                  <div className="text-2xl font-semibold">{selectedDonor.loyalty ?? 0}</div>
                </div>

                <div className="rounded-lg bg-white/5 p-3">
                  <div className="text-xs text-slate-400">Donation History</div>
                  <ul className="mt-2 space-y-2 text-sm text-slate-300">
                    {/* mock timeline */}
                    <li>2026-05-10 — 1 unit — Chennai Blood Bank</li>
                    <li>2025-11-03 — 1 unit — Hyderabad General</li>
                    <li>2024-08-21 — 2 units — City Hospital</li>
                  </ul>
                </div>

                <div className="rounded-lg bg-white/5 p-3">
                  <div className="text-xs text-slate-400">Communication History</div>
                  <ul className="mt-2 space-y-2 text-sm text-slate-300">
                    <li>2026-05-11 — SMS — Confirmed availability</li>
                    <li>2026-04-01 — Email — Campaign invite</li>
                    <li>2025-12-09 — Call — Post donation follow-up</li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <button className="button-primary flex-1" onClick={() => quickCall(selectedDonor.phone)}>Call</button>
                  <button className="rounded-3xl bg-white/5 px-4 py-3" onClick={() => quickSMS(selectedDonor.phone)}>SMS</button>
                </div>

                <div className="rounded-3xl border border-cyan-500/10 bg-gradient-to-br from-cyan-500/5 to-transparent p-4">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Donor Tracking</p>
                      <p className="mt-1 text-sm text-slate-400">Locate the nearest donor for the patient via Google Maps.</p>
                    </div>
                    <MapPin className="h-5 w-5 text-cyan-300" />
                  </div>
                  <button
                    className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                    onClick={handleTrackDonor}
                  >
                    <Navigation className="h-4 w-4" /> Track Donor
                  </button>
                  {trackStatus && (
                    <div className="mt-3 rounded-2xl bg-slate-950/70 p-3 text-sm text-slate-200">
                      {trackStatus}
                    </div>
                  )}
                  {nearestDonorResult && (
                    <div className="mt-3 space-y-2 rounded-2xl bg-white/5 p-3 text-sm text-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-200">{nearestDonorResult.donor.bloodGroup}</span>
                        <p>{nearestDonorResult.donor.name} • {nearestDonorResult.donor.location}</p>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="rounded-2xl bg-slate-900/80 p-3">Distance: <span className="font-semibold text-white">{nearestDonorResult.distanceKm} km</span></div>
                        <div className="rounded-2xl bg-slate-900/80 p-3">ETA: <span className="font-semibold text-white">{nearestDonorResult.etaMinutes} min</span></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-3xl border border-violet-500/10 bg-gradient-to-br from-violet-500/5 to-transparent p-4">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-violet-300">Eligibility Check</p>
                      <p className="mt-1 text-sm text-slate-400">Run donor eligibility based on age, weight, donation history, and health.</p>
                    </div>
                    <ShieldCheck className="h-5 w-5 text-violet-300" />
                  </div>
                  <div className="grid gap-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <label className="text-xs text-slate-400">Age</label>
                      <input
                        type="number"
                        value={eligibilityForm.age}
                        onChange={(e) => setEligibilityForm({ ...eligibilityForm, age: Number(e.target.value) })}
                        className="input-field"
                      />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <label className="text-xs text-slate-400">Weight (kg)</label>
                      <input
                        type="number"
                        value={eligibilityForm.weight}
                        onChange={(e) => setEligibilityForm({ ...eligibilityForm, weight: Number(e.target.value) })}
                        className="input-field"
                      />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <label className="text-xs text-slate-400">Last Donation</label>
                      <input
                        type="date"
                        value={eligibilityForm.lastDonationDate}
                        onChange={(e) => setEligibilityForm({ ...eligibilityForm, lastDonationDate: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <label className="text-xs text-slate-400">HB Low</label>
                      <select
                        value={eligibilityForm.healthIssues.hbLow ? 'yes' : 'no'}
                        onChange={(e) => setEligibilityForm({ ...eligibilityForm, healthIssues: { ...eligibilityForm.healthIssues, hbLow: e.target.value === 'yes' } })}
                        className="input-field"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <label className="text-xs text-slate-400">Chronic Illness</label>
                      <select
                        value={eligibilityForm.healthIssues.chronicIllness ? 'yes' : 'no'}
                        onChange={(e) => setEligibilityForm({ ...eligibilityForm, healthIssues: { ...eligibilityForm.healthIssues, chronicIllness: e.target.value === 'yes' } })}
                        className="input-field"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                    <button
                      className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
                      onClick={handleEligibilityCheck}
                      disabled={eligibilityLoading}
                    >
                      {eligibilityLoading ? 'Checking…' : 'Run Eligibility Check'}
                    </button>
                    {eligibilityResult && (
                      <div className="rounded-2xl bg-slate-900/80 p-4 text-sm text-slate-200">
                        <div className="flex items-center gap-2 font-semibold mb-2">
                          {eligibilityResult.eligible ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          ) : (
                            <XCircle className="h-5 w-5 text-rose-400" />
                          )}
                          <span>{eligibilityResult.eligible ? 'Eligible' : 'Not eligible'}</span>
                        </div>
                        <p className="text-slate-300">{eligibilityResult.reason}</p>
                        <p className="mt-2 text-xs text-slate-500">AI score: {eligibilityResult.score}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-400">No donor selected</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorManagementPage;
