import { useState } from 'react';
import SectionCard from '../components/SectionCard';

const patientProfile = {
  name: 'Ananya Sharma',
  age: 29,
  gender: 'Female',
  bloodGroup: 'A+',
  phone: '+91 90000 12345',
  district: 'Chennai',
  status: 'Critical',
  hospital: 'City Hospital',
  hospitalAddress: 'Anna Nagar, Chennai',
  bedAvailability: 4,
  icuReadiness: 88,
  loyaltyPoints: 180
};

const nearestDonors = [
  { name: 'Rahul', group: 'A+', distance: 1.2, lastSeen: '3m ago' },
  { name: 'Saira', group: 'O+', distance: 1.8, lastSeen: '6m ago' },
  { name: 'Veena', group: 'A+', distance: 2.4, lastSeen: '8m ago' }
];

const bloodBanks = [
  { name: 'Red Cross Bank', distance: 2.1, inventory: { 'A+': 14, 'O+': 22, 'B+': 12 } },
  { name: 'Hope Group Bank', distance: 2.8, inventory: { 'A+': 10, 'O+': 16, 'AB+': 7 } }
];

const aiSuggestions = [
  { title: 'Schedule donor reminders', description: 'Send a follow-up reminder to nearby A+ donors.', status: 'Recommended' },
  { title: 'Activate urgent connect', description: 'Mobilize donors for the patient’s critical need.', status: 'High priority' },
  { title: 'Track loyalty uplift', description: 'Reward responders with loyalty points for future drives.', status: 'Insight' }
];

const PatientsPage = () => {
  const [selectedDonor, setSelectedDonor] = useState(nearestDonors[0]);
  const [alert, setAlert] = useState('');

  const requestBlood = (donorName: string) => {
    setAlert(`Blood request sent to ${donorName}. Loyalty points will be credited after response.`);
    window.setTimeout(() => setAlert(''), 3000);
  };

  const reserveUnit = (bankName: string) => {
    setAlert(`Reservation created for ${bankName}. Coordinating hospital transfer.`);
    window.setTimeout(() => setAlert(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Patient Overview" subtitle="Current dashboard for patient coordination">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_0.6fr]">
            <div className="space-y-6">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500/10 text-3xl text-cyan-200">AS</div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{patientProfile.name}</h2>
                    <p className="text-sm text-slate-400">{patientProfile.district} • {patientProfile.gender}, {patientProfile.age} yrs</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Blood Group</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{patientProfile.bloodGroup}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Contact</p>
                    <p className="mt-2 text-base font-semibold text-white">{patientProfile.phone}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Health Status</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{patientProfile.status}</h3>
                  </div>
                  <span className="badge-pill bg-red-500/10 text-red-200">{patientProfile.status}</span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="text-xs text-slate-500">Assigned hospital</p>
                    <p className="mt-2 text-white">{patientProfile.hospital}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="text-xs text-slate-500">Bed availability</p>
                    <p className="mt-2 text-white">{patientProfile.bedAvailability} beds</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="text-xs text-slate-500">ICU readiness</p>
                    <p className="mt-2 text-white">{patientProfile.icuReadiness}%</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="text-xs text-slate-500">Loyalty points</p>
                    <p className="mt-2 text-white">{patientProfile.loyaltyPoints}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Hospital Location</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">{patientProfile.hospital}</h3>
                </div>
                <span className="badge-pill bg-cyan-500/10 text-cyan-200">Live</span>
              </div>
              <div className="mt-4 h-72 overflow-hidden rounded-3xl border border-white/10">
                <iframe
                  title="Assigned hospital map"
                  className="h-full w-full"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(patientProfile.hospitalAddress)}&z=14&output=embed`}
                  loading="lazy"
                />
              </div>
              <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <p><span className="font-semibold text-white">Address:</span> {patientProfile.hospitalAddress}</p>
                <p className="mt-2"><span className="font-semibold text-white">Beds available:</span> {patientProfile.bedAvailability}</p>
                <p className="mt-2"><span className="font-semibold text-white">ICU readiness:</span> {patientProfile.icuReadiness}%</p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Patient–Donor Connect" subtitle="Nearest donors with live engagement and notifications">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_0.85fr]">
            <div className="space-y-5">
              <div className="space-y-4 rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-glass backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Nearest donors</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">Live response network</h3>
                  </div>
                  <span className="badge-pill bg-cyan-500/10 text-cyan-200">Ready</span>
                </div>
                <div className="space-y-3">
                  {nearestDonors.map((donor) => (
                    <div key={donor.name} className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">{donor.name}</p>
                          <p className="mt-1 text-xs text-slate-400">{donor.group} • {donor.distance} km away</p>
                          <p className="mt-2 text-xs text-slate-500">Last active: {donor.lastSeen}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => requestBlood(donor.name)}
                          className="interactive-button glow-button rounded-3xl bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200"
                        >
                          Request Blood
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-5 shadow-glass backdrop-blur-xl">
                <p className="text-sm text-slate-400">Live map</p>
                <div className="mt-4 h-72 overflow-hidden rounded-3xl border border-white/10">
                  <iframe
                    title="Nearest donors map"
                    className="h-full w-full"
                    src="https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=13.0827,80.2707&zoom=12"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-glass backdrop-blur-xl">
              <p className="text-sm text-slate-400">Loyalty points</p>
              <div className="mt-4 rounded-3xl bg-slate-950/80 p-4">
                <p className="text-sm text-slate-400">Responding donors earn points for future priority invites.</p>
                <p className="mt-3 text-3xl font-semibold text-white">+{patientProfile.loyaltyPoints}</p>
                <p className="mt-2 text-sm text-slate-300">Assigned to patient response workflow.</p>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Blood Bank Link" subtitle="Reserve units and coordinate hospital stock">
          <div className="space-y-5">
            {bloodBanks.map((bank) => (
              <div key={bank.name} className="rounded-[28px] border border-white/10 bg-slate-950/80 p-5 shadow-glass backdrop-blur-xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{bank.name}</h3>
                    <p className="mt-1 text-sm text-slate-400">{bank.distance} km away</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => reserveUnit(bank.name)}
                    className="interactive-button glow-button rounded-3xl bg-amber-500/10 px-4 py-2 text-sm text-amber-200"
                  >
                    Reserve Unit
                  </button>
                </div>
                <div className="mt-4 grid gap-3">
                  {Object.entries(bank.inventory).map(([group, units]) => (
                    <div key={group} className="flex items-center justify-between rounded-3xl bg-white/5 px-4 py-3 text-sm text-slate-300">
                      <span>{group}</span>
                      <span className="font-semibold text-white">{units} units</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="AI Copilot Suggestions" subtitle="Predictive guidance for the patient response journey">
        <div className="grid gap-4 xl:grid-cols-3">
          {aiSuggestions.map((suggestion) => (
            <div key={suggestion.title} className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-glass backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{suggestion.title}</p>
                  <p className="mt-2 text-sm text-slate-400">{suggestion.description}</p>
                </div>
                <span className="badge-pill bg-slate-900/70 text-slate-200">{suggestion.status}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-5 shadow-glass backdrop-blur-xl">
            <p className="text-sm text-slate-400">Next best action</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Activate donor reminders</h3>
            <p className="mt-3 text-sm text-slate-300">Recommended for faster response and better engagement for the critical patient need.</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-5 shadow-glass backdrop-blur-xl">
            <p className="text-sm text-slate-400">Engagement uplift</p>
            <p className="mt-2 text-4xl font-semibold text-white">+18%</p>
            <p className="mt-3 text-sm text-slate-300">Predicted increase in donor response after the next campaign activation.</p>
          </div>
        </div>
      </SectionCard>

      {alert && (
        <div className="rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">{alert}</div>
      )}
    </div>
  );
};

export default PatientsPage;
