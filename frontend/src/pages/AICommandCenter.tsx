import React, { useState } from 'react';
import SectionCard from '../components/SectionCard';
import { motion } from 'framer-motion';

const AICommandCenter = () => {
  const [simulation, setSimulation] = useState<'none' | 'campaign' | 'activation'>('none');

  const aiConfidence = {
    level: '96%',
    sources: 24,
    accuracy: '94%',
    updated: 'Live'
  };

  const riskLevels = ['Low', 'Moderate', 'High', 'Critical'];
  const currentRisk = 'Critical';

  const bloodImpact = [
    { group: 'O-', status: 'Critical', value: 12 },
    { group: 'AB-', status: 'High', value: 28 },
    { group: 'B-', status: 'Moderate', value: 54 },
    { group: 'O+', status: 'Stable', value: 86 },
  ];

  const districts = [
    { name: 'Chennai', active: 12, donors: 142, risk: 'Critical' },
    { name: 'Vellore', active: 7, donors: 98, risk: 'High' },
    { name: 'Madurai', active: 6, donors: 110, risk: 'High' },
  ];

  const predictions = [
    { horizon: 'Next 6 Hours', change: '+12%' },
    { horizon: 'Next 12 Hours', change: '+18%' },
    { horizon: 'Next 24 Hours', change: '+25%' },
  ];

  const donorIntel = {
    available: 148,
    expected: 82,
    rate: '91%',
    top: ['Durga', 'Gopi', 'Ganesh']
  };

  const fraud = { suspicious: 2, duplicates: 1, trustScore: 98, security: 'Protected' };

  const execSummary = "AI analysis indicates a significant increase in emergency blood demand across Chennai and Vellore. O- inventory is approaching critical levels. Immediate donor activation is recommended to prevent shortages.";

  const simulate = (mode: 'none' | 'campaign' | 'activation') => setSimulation(mode);

  const simulatedRisk = () => {
    switch (simulation) {
      case 'none': return '92%';
      case 'campaign': return '48%';
      case 'activation': return '32%';
      default: return '92%';
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-400">AI Intelligence Command Center</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Advanced AI Intelligence</h1>
          <p className="mt-1 text-sm text-slate-300">Enterprise-grade AI insights, forecasts, and recommended actions for emergency operations.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="AI Confidence Score" subtitle="Model trust & telemetry" className="lg:col-span-1">
          <div className="space-y-3">
            <div className="text-sm text-slate-400">Confidence Level</div>
            <div className="text-4xl font-semibold text-white">{aiConfidence.level}</div>
            <div className="grid grid-cols-3 gap-2 text-xs text-slate-400 mt-2">
              <div>Sources: <span className="text-white font-semibold">{aiConfidence.sources}</span></div>
              <div>Accuracy: <span className="text-white font-semibold">{aiConfidence.accuracy}</span></div>
              <div>Updated: <span className="text-white font-semibold">{aiConfidence.updated}</span></div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Emergency Risk Meter" subtitle="Current threat level" className="lg:col-span-1">
          <div className="flex flex-col items-center gap-4">
            <div className="w-full flex items-center justify-center">
              {/* Simple animated gauge */}
              <svg width="160" height="80" viewBox="0 0 200 100">
                <defs>
                  <linearGradient id="g1" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#fb7185" />
                  </linearGradient>
                </defs>
                <path d="M20 80 A80 80 0 0 1 180 80" fill="none" stroke="#0f172a" strokeWidth="18" strokeOpacity="0.3" />
                <path d="M20 80 A80 80 0 0 1 180 80" fill="none" stroke="url(#g1)" strokeWidth="18" strokeDasharray="250" strokeDashoffset="50" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
                <text x="100" y="60" textAnchor="middle" fill="#fff" fontSize="18" fontWeight={700}>{currentRisk}</text>
              </svg>
            </div>
            <div className="text-sm text-slate-400">Status: <span className="text-white font-semibold">{currentRisk}</span></div>
            <div className="w-full grid grid-cols-4 gap-2 text-xs text-center">
              {riskLevels.map((r) => (
                <div key={r} className={`rounded-full px-2 py-1 ${r === 'Critical' ? 'bg-red-600/10 text-red-300' : r === 'High' ? 'bg-amber-600/10 text-amber-300' : r === 'Moderate' ? 'bg-amber-400/6 text-amber-200' : 'bg-emerald-500/10 text-emerald-200'}`}>{r}</div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Blood Group Impact Analysis" subtitle="Who is affected" className="lg:col-span-1">
          <div className="space-y-3">
            {bloodImpact.map((b) => (
              <div key={b.group} className="space-y-1">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <div className="flex items-center gap-3"><div className="font-semibold text-white">{b.group}</div><div className="text-xs text-slate-400">{b.status}</div></div>
                  <div className="text-sm font-semibold text-white">{b.value}%</div>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10">
                  <div className={`h-full rounded-full ${b.status === 'Critical' ? 'bg-red-500' : b.status === 'High' ? 'bg-amber-500' : b.status === 'Moderate' ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${b.value}%`, transition: 'width 0.8s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="District Impact Map" subtitle="Regional risk & capacity" className="lg:col-span-2">
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              {districts.map((d) => (
                <div key={d.name} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white">{d.name}</div>
                      <div className="text-xs text-slate-400">Risk: {d.risk}</div>
                    </div>
                    <div className="text-right text-sm text-slate-200">
                      <div>Requests: <span className="font-semibold">{d.active}</span></div>
                      <div>Donors: <span className="font-semibold">{d.donors}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="AI Predicted Future Events" subtitle="Short-term forecasts">
          <div className="space-y-3">
            {predictions.map((p) => (
              <div key={p.horizon} className="rounded-3xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
                <div className="text-sm text-slate-400">{p.horizon}</div>
                <div className="text-lg font-semibold text-white">{p.change}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Recommended Actions Center" subtitle="AI priority tasks" className="lg:col-span-2">
          <div className="space-y-3">
            {[
              { title: 'Activate O- emergency donors', priority: 1 },
              { title: 'Notify nearby hospitals', priority: 2 },
              { title: 'Launch donor campaign', priority: 3 },
              { title: 'Monitor shortage zones', priority: 4 },
            ].map((a) => (
              <div key={a.title} className="rounded-3xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">{a.title}</div>
                  <div className="text-xs text-slate-400">Priority {a.priority}</div>
                </div>
                <div>
                  <button onClick={() => alert(`Execute: ${a.title}`)} className="rounded-2xl bg-red-600/10 px-4 py-2 text-red-200">Execute</button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Donor Response Intelligence" subtitle="Availability & engagement">
          <div className="space-y-3 text-sm text-slate-300">
            <div>Available Donors: <span className="text-white font-semibold">{donorIntel.available}</span></div>
            <div>Expected Responses: <span className="text-white font-semibold">{donorIntel.expected}</span></div>
            <div>Response Rate: <span className="text-white font-semibold">{donorIntel.rate}</span></div>
            <div className="mt-2">Top Responders:</div>
            <ul className="mt-1 list-disc list-inside text-white">
              {donorIntel.top.map((n) => <li key={n}>{n}</li>)}
            </ul>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="AI Simulation Engine" subtitle="What-if scenarios" className="lg:col-span-2">
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-sm text-slate-400">If no action taken</div>
                <div className="mt-2 text-3xl font-semibold text-white">Risk {simulation === 'none' ? '92%' : simulatedRisk()}</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-sm text-slate-400">If emergency campaign launched</div>
                <div className="mt-2 text-3xl font-semibold text-white">Risk 48%</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-sm text-slate-400">If donor activation started</div>
                <div className="mt-2 text-3xl font-semibold text-white">Risk 32%</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => simulate('none')} className="rounded-2xl bg-white/5 px-4 py-2">No Action</button>
              <button onClick={() => simulate('campaign')} className="rounded-2xl bg-amber-500/10 px-4 py-2">Launch Campaign</button>
              <button onClick={() => simulate('activation')} className="rounded-2xl bg-emerald-500/10 px-4 py-2">Activate Donors</button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Fraud & Trust Intelligence" subtitle="Security metrics">
          <div className="space-y-2 text-sm text-slate-300">
            <div>Suspicious Requests: <span className="text-white font-semibold">{fraud.suspicious}</span></div>
            <div>Duplicate Accounts: <span className="text-white font-semibold">{fraud.duplicates}</span></div>
            <div>Trust Score: <span className="text-white font-semibold">{fraud.trustScore}%</span></div>
            <div>AI Security Status: <span className="text-white font-semibold">{fraud.security}</span></div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Executive Summary" subtitle="AI-generated briefing">
        <div className="text-slate-200">
          <p className="text-lg font-semibold text-white">Executive Summary</p>
          <p className="mt-3">{execSummary}</p>
        </div>
      </SectionCard>
    </div>
  );
};

export default AICommandCenter;
