import { useMemo, useState } from 'react';
import {
  IconBell,
  IconUsers,
  IconHeart,
  IconCalendarCheck,
  IconChartPie,
  IconChevronRight,
  IconMapPin,
  IconBuildingHospital,
  IconPhone,
  IconDroplet,
} from '@tabler/icons-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const donorRoster = [
  { name: 'Anitha', city: 'Chennai', lastDonation: '2026-06-02', bloodGroup: 'A+', status: 'Eligible', online: true, initials: 'A', color: 'bg-[#FEE2E2] text-[#991B1B]' },
  { name: 'Karthik', city: 'Coimbatore', lastDonation: '2026-05-28', bloodGroup: 'B+', status: 'Eligible', online: true, initials: 'K', color: 'bg-[#DBEAFE] text-[#1D4ED8]' },
  { name: 'Meera', city: 'Madurai', lastDonation: '2026-05-22', bloodGroup: 'O+', status: 'Eligible', online: false, initials: 'M', color: 'bg-[#DCFCE7] text-[#166534]' },
  { name: 'Senthil', city: 'Salem', lastDonation: '2026-06-05', bloodGroup: 'AB+', status: 'On cooldown', online: true, initials: 'S', color: 'bg-[#E9D5FF] text-[#6D28D9]' },
  { name: 'Nandhini', city: 'Tiruchirappalli', lastDonation: '2026-05-30', bloodGroup: 'O-', status: 'Eligible', online: false, initials: 'N', color: 'bg-[#FEF3C7] text-[#B45309]' },
];

const hospitals = [
  { name: 'Apollo Hospital', city: 'Chennai', lastRequest: '2026-06-14', requests: 45, color: 'bg-[#FEE2E2] text-[#991B1B]' },
  { name: 'Rajaji Government Hospital', city: 'Madurai', lastRequest: '2026-06-13', requests: 32, color: 'bg-[#FEF3C7] text-[#B45309]' },
  { name: 'Kauvery Hospital', city: 'Tiruchirappalli', lastRequest: '2026-06-12', requests: 28, color: 'bg-[#DBEAFE] text-[#1D4ED8]' },
];

const statCards = [
  {
    label: 'Total Donors',
    value: '10',
    meta: '+2 this month',
    icon: IconUsers,
    color: 'bg-[#FEE2E2] text-[#991B1B]',
  },
  {
    label: 'Active Donors',
    value: '8',
    meta: '80% of total',
    icon: IconHeart,
    color: 'bg-[#DCFCE7] text-[#166534]',
  },
  {
    label: 'Eligible Now',
    value: '6',
    meta: '2 on cooldown',
    icon: IconCalendarCheck,
    color: 'bg-[#FEF3C7] text-[#B45309]',
  },
  {
    label: 'Retention Rate',
    value: '80%',
    meta: '+5% vs last month',
    icon: IconChartPie,
    color: 'bg-[#DBEAFE] text-[#1D4ED8]',
  },
];

const operations = [
  {
    title: 'Emergency donor alert',
    description: 'Notify 6 eligible donors now',
    iconColor: 'bg-[#FEE2E2] text-[#991B1B]',
  },
  {
    title: 'Hospital blood requests',
    description: '3 pending approvals',
    iconColor: 'bg-[#DBEAFE] text-[#1D4ED8]',
  },
  {
    title: 'Retention analysis',
    description: 'Monthly trend report',
    iconColor: 'bg-[#CFFAFE] text-[#0E7490]',
  },
];

const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Donations',
      data: [12, 16, 10, 14, 18, 20, 15],
      backgroundColor: '#A32D2D',
      borderRadius: 8,
      barPercentage: 0.65,
    },
    {
      label: 'Requests',
      data: [8, 10, 7, 9, 12, 15, 11],
      backgroundColor: '#60A5FA',
      borderRadius: 8,
      barPercentage: 0.65,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#111827',
      titleColor: '#ffffff',
      bodyColor: '#e2e8f0',
      borderColor: '#374151',
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#4b5563', font: { size: 12 } },
    },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(15, 23, 42, 0.12)' },
      ticks: { color: '#4b5563', font: { size: 12 } },
    },
  },
};

const bloodPill = (group: string) => {
  switch (group) {
    case 'A+':
      return 'bg-[#FEE2E2] text-[#991B1B]';
    case 'B+':
      return 'bg-[#DBEAFE] text-[#1D4ED8]';
    case 'O+':
      return 'bg-[#DCFCE7] text-[#166534]';
    case 'AB+':
      return 'bg-[#E9D5FF] text-[#6D28D9]';
    case 'O-':
      return 'bg-[#FEF3C7] text-[#B45309]';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

const availabilityOptions = ['Any availability', 'Available', 'On cooldown', 'Unavailable'];
const statusOptions = ['Any status', 'Eligible', 'On cooldown', 'Paused'];
const bloodGroupOptions = ['All blood groups', 'A+', 'B+', 'O+', 'AB+', 'O-'];
const districtOptions = ['All districts', 'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'];

const DonorCommandCenterPage = () => {
  const [search, setSearch] = useState('');
  const [bloodGroup, setBloodGroup] = useState('All blood groups');
  const [district, setDistrict] = useState('All districts');
  const [availability, setAvailability] = useState('Any availability');
  const [status, setStatus] = useState('Any status');

  const filteredDonors = useMemo(() => {
    return donorRoster.filter((donor) => {
      const query = search.toLowerCase().trim();
      if (query && !`${donor.name} ${donor.city}`.toLowerCase().includes(query)) return false;
      if (bloodGroup !== 'All blood groups' && donor.bloodGroup !== bloodGroup) return false;
      if (district !== 'All districts' && donor.city !== district) return false;
      if (availability !== 'Any availability') {
        if (availability === 'Available' && donor.status === 'On cooldown') return false;
        if (availability === 'On cooldown' && donor.status !== 'On cooldown') return false;
      }
      if (status !== 'Any status' && donor.status !== status) return false;
      return true;
    });
  }, [search, bloodGroup, district, availability, status]);

  return (
    <div className="blood-dashboard min-h-screen bg-[var(--bg)] text-[var(--text)] px-6 py-6 font-sans">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <header className="flex flex-col gap-4 rounded-[12px] border-[0.5px] border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm shadow-slate-200/10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#A32D2D]/10 text-[#A32D2D] shadow-sm shadow-[#A32D2D]/10">
              <IconDroplet size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#6b7280]">BloodLink Command Center</p>
              <h1 className="mt-2 text-3xl font-semibold text-[#111827]">Tamil Nadu donor network</h1>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-[12px] border-[0.5px] border-[var(--border)] bg-[var(--surface)] p-3">
            <button className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FEE2E2] text-[#991B1B]">
              <IconBell size={20} />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#DC2626] shadow-[0_0_0_4px_rgba(255,255,255,0.6)]" />
            </button>
            <div className="inline-flex items-center gap-3 rounded-2xl bg-[#F3F4F6] px-3 py-2">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#A32D2D] text-white">TN</div>
              <div>
                <p className="text-sm font-semibold text-[#111827]">Admin</p>
                <p className="text-xs text-[#6b7280]">Command center</p>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-[12px] border-[0.5px] border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm shadow-slate-200/10">
                <div className="flex items-center justify-between gap-3">
                  <div className={`grid h-11 w-11 place-items-center rounded-2xl ${card.color}`}> 
                    <Icon size={20} />
                  </div>
                  <span className="text-xs uppercase tracking-[0.35em] text-[#6b7280]">{card.label}</span>
                </div>
                <div className="mt-6 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-4xl font-semibold text-[#111827]">{card.value}</p>
                    <p className="mt-2 text-sm text-[#6b7280]">{card.meta}</p>
                  </div>
                  <div className="h-10 w-20 rounded-full bg-[#F3F4F6]" />
                </div>
              </div>
            );
          })}
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            <div className="rounded-[12px] border-[0.5px] border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm shadow-slate-200/10">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#111827]">Donor roster</h2>
                  <p className="mt-1 text-sm text-[#6b7280]">5 recent donors from Tamil Nadu</p>
                </div>
                <button className="rounded-full border border-[#D1D5DB] px-4 py-2 text-sm font-semibold text-[#374151]">View all</button>
              </div>
              <div className="space-y-4">
                {donorRoster.map((donor) => (
                  <div key={donor.name} className="flex flex-col gap-3 rounded-[12px] border-[0.5px] border-[var(--border)] bg-[#FAFAFA] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`grid h-14 w-14 place-items-center rounded-full ${donor.color}`}>{donor.initials}</div>
                        <span className={`absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-[var(--surface)] ${donor.online ? 'bg-[#10B981]' : 'bg-[#9CA3AF]'}`} />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-[#111827]">{donor.name}</p>
                        <p className="text-sm text-[#6b7280]">{donor.city} • Last donation {donor.lastDonation}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${bloodPill(donor.bloodGroup)}`}>{donor.bloodGroup}</span>
                      <span className="text-sm font-medium text-[#6b7280]">{donor.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[12px] border-[0.5px] border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm shadow-slate-200/10">
              <h2 className="text-xl font-semibold text-[#111827]">Search & filter</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Name, phone, or district"
                  className="w-full rounded-[12px] border-[0.5px] border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#A32D2D]/70 focus:ring-2 focus:ring-[#FCA5A5]/30"
                />
                <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="rounded-[12px] border-[0.5px] border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#111827] outline-none">
                  {bloodGroupOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select value={district} onChange={(e) => setDistrict(e.target.value)} className="rounded-[12px] border-[0.5px] border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#111827] outline-none">
                  {districtOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="rounded-[12px] border-[0.5px] border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#111827] outline-none">
                  {availabilityOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-[12px] border-[0.5px] border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#111827] outline-none">
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <button onClick={() => { setSearch(''); setBloodGroup('All blood groups'); setDistrict('All districts'); setAvailability('Any availability'); setStatus('Any status'); }} className="rounded-[12px] border-[0.5px] border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#F3F4F6]">
                  Reset
                </button>
              </div>
            </div>

            <div className="rounded-[12px] border-l-4 border-[#A32D2D] border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm shadow-slate-200/10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6b7280]">Retention formula</p>
                  <p className="mt-3 text-lg font-semibold text-[#111827]">Active Donors ÷ Total Donors</p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-[#6b7280]">The current retention score measures how many active donors remain connected through the Tamil Nadu network against the full roster.</p>
                </div>
                <div className="rounded-[12px] bg-[#FEE2E2] px-4 py-3 text-3xl font-semibold text-[#991B1B]">80%</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[12px] border-[0.5px] border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm shadow-slate-200/10">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6b7280]">Operations</p>
                  <h2 className="mt-2 text-xl font-semibold text-[#111827]">Call top donors</h2>
                </div>
                <button className="rounded-[12px] bg-[#A32D2D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#8C2525]">
                  Call top donors
                </button>
              </div>
              <div className="space-y-3">
                {operations.map((item) => (
                  <div key={item.title} className="flex items-center justify-between gap-4 rounded-[12px] border-[0.5px] border-[#E5E7EB] bg-[#F8FAFC] p-4">
                    <div className="flex items-center gap-4">
                      <div className={`${item.iconColor} grid h-10 w-10 place-items-center rounded-[8px]`}>
                        <IconPhone size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-[#111827]">{item.title}</p>
                        <p className="text-sm text-[#6b7280]">{item.description}</p>
                      </div>
                    </div>
                    <IconChevronRight size={20} className="text-[#6b7280]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[12px] border-[0.5px] border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm shadow-slate-200/10">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6b7280]">Hospital demand</p>
                  <h2 className="mt-2 text-xl font-semibold text-[#111827]">Priority requests</h2>
                </div>
                <IconBuildingHospital size={24} className="text-[#A32D2D]" />
              </div>
              <div className="space-y-4">
                {hospitals.map((hospital) => (
                  <div key={hospital.name} className="flex items-center justify-between gap-4 rounded-[12px] border-[0.5px] border-[#E5E7EB] bg-[#F8FAFC] p-4">
                    <div className="flex items-center gap-3">
                      <div className={`${hospital.color} grid h-10 w-10 place-items-center rounded-[10px]`}>
                        <IconMapPin size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-[#111827]">{hospital.name}</p>
                        <p className="text-sm text-[#6b7280] flex items-center gap-1"><IconMapPin size={12} />{hospital.city}</p>
                        <p className="text-xs text-[#6b7280]">Last request {hospital.lastRequest}</p>
                      </div>
                    </div>
                    <div className="rounded-full bg-[#F3F4F6] px-4 py-2 text-sm font-semibold text-[#111827]">{hospital.requests}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[12px] border-[0.5px] border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm shadow-slate-200/10">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6b7280]">Weekly donations</p>
                  <h2 className="mt-2 text-xl font-semibold text-[#111827]">Mon–Sun activity</h2>
                </div>
              </div>
              <div className="mb-4 flex items-center gap-4 text-sm text-[#6b7280]">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#A32D2D]" /> Donations
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#60A5FA]" /> Requests
                </span>
              </div>
              <div className="h-[140px]">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorCommandCenterPage;
