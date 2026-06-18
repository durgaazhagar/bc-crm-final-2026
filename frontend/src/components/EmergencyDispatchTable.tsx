import React, { useEffect, useMemo, useState } from 'react';
import { Search, Hospital, Zap, Trash2, Eye, Clock } from 'lucide-react';

type Status = 'Pending' | 'Active' | 'Completed';

type DispatchSummary = {
  totalAll: number;
  pending: number;
  active: number;
  completed: number;
};

interface DispatchRow {
  id: string;
  patient: string;
  hospital: string;
  blood: string;
  qty: number;
  status: Status;
  etaMinutes: number | null; // ETA in minutes
  createdAt: string;
}

interface EmergencyDispatchTableProps {
  onSummary?: (summary: DispatchSummary) => void;
}

const STATUS_CLASS: Record<Status, string> = {
  Pending: 'bg-gradient-to-r from-amber-500 to-amber-400 text-amber-900',
  Active: 'bg-gradient-to-r from-rose-500 to-red-500 text-white',
  Completed: 'bg-gradient-to-r from-emerald-400 to-green-500 text-white',
};

const STORAGE_KEY = 'bc_dispatch_counter_v1';

const genDispatchId = (): string => {
  const year = new Date().getFullYear();
  let counter = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  counter = counter + 1;
  localStorage.setItem(STORAGE_KEY, String(counter));
  const padded = String(counter).padStart(3, '0');
  return `DISP-${year}-${padded}`;
};

const sampleInitial = (): DispatchRow[] => [
  { id: genDispatchId(), patient: 'Ravi Kumar', hospital: 'City Care Hospital', blood: 'A+', qty: 2, status: 'Pending', etaMinutes: 25, createdAt: new Date().toISOString() },
  { id: genDispatchId(), patient: 'Meena Iyer', hospital: 'St. Marys Medical', blood: 'O-', qty: 1, status: 'Active', etaMinutes: 8, createdAt: new Date().toISOString() },
  { id: genDispatchId(), patient: 'Suresh N', hospital: 'Central Clinic', blood: 'B+', qty: 3, status: 'Completed', etaMinutes: null, createdAt: new Date().toISOString() },
];

const formatETA = (mins: number | null) => (mins === null ? '—' : `${mins}m`);

const EmergencyDispatchTable: React.FC<EmergencyDispatchTableProps> = ({ onSummary }) => {
  const [rows, setRows] = useState<DispatchRow[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (rows.length === 0) setRows(sampleInitial());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = () => {
    const newRow: DispatchRow = {
      id: genDispatchId(),
      patient: `New Patient ${Math.floor(Math.random() * 900 + 100)}`,
      hospital: 'Nearest Hospital',
      blood: ['A+', 'A-', 'B+', 'O+', 'O-'][Math.floor(Math.random() * 5)],
      qty: Math.floor(Math.random() * 3) + 1,
      status: 'Pending',
      etaMinutes: 30,
      createdAt: new Date().toISOString(),
    };
    setRows((s) => [newRow, ...s]);
  };

  const handleActivate = (id: string) => {
    setRows((s) => s.map(r => r.id === id ? { ...r, status: 'Active', etaMinutes: Math.max(5, (r.etaMinutes || 10) - 5) } : r));
  };

  const handleComplete = (id: string) => {
    setRows((s) => s.map(r => r.id === id ? { ...r, status: 'Completed', etaMinutes: null } : r));
  };

  const handleDelete = (id: string) => {
    setRows((s) => s.filter(r => r.id !== id));
  };

  const handleView = (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (row) {
      alert(`Dispatch ${row.id}\nPatient: ${row.patient}\nHospital: ${row.hospital}\nBlood: ${row.blood}\nQty: ${row.qty}\nStatus: ${row.status}\nETA: ${formatETA(row.etaMinutes)}`);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r =>
      r.id.toLowerCase().includes(q) ||
      r.patient.toLowerCase().includes(q) ||
      r.hospital.toLowerCase().includes(q) ||
      r.blood.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q)
    );
  }, [rows, query]);

  const summary = useMemo(() => ({
    totalAll: rows.length,
    pending: rows.filter((r) => r.status === 'Pending').length,
    active: rows.filter((r) => r.status === 'Active').length,
    completed: rows.filter((r) => r.status === 'Completed').length,
  }), [rows]);

  useEffect(() => {
    if (onSummary) onSummary(summary);
  }, [onSummary, summary]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-1/2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID, patient, hospital, blood..."
              className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-10 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleCreate} className="rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:brightness-105 transition">+ New Dispatch</button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-[20px] border border-white/10 bg-slate-900/80 overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-950/80 text-slate-300">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Hospital</th>
              <th className="px-4 py-3">Blood</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">ETA</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.id} className="border-t border-white/5 hover:bg-white/3 transition cursor-pointer">
                <td className="px-4 py-3 font-mono text-xs text-slate-200">{row.id}</td>
                <td className="px-4 py-3 text-white">{row.patient}</td>
                <td className="px-4 py-3 flex items-center gap-2 text-slate-300"><Hospital className="w-4 h-4 text-cyan-300" />{row.hospital}</td>
                <td className="px-4 py-3">{row.blood}</td>
                <td className="px-4 py-3">{row.qty}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASS[row.status as Status]}`}>
                    {row.status === 'Pending' && '⏳'}
                    {row.status === 'Active' && '🚑'}
                    {row.status === 'Completed' && '✅'}
                    <span>{row.status}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">{formatETA(row.etaMinutes)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => alert(`Viewing ${row.id}`)} className="p-2 rounded-md text-slate-300 hover:bg-white/5"><Eye className="w-4 h-4" /></button>
                    {row.status !== 'Active' && row.status !== 'Completed' && (
                      <button onClick={() => handleActivate(row.id)} className="p-2 rounded-md text-rose-400 hover:bg-white/5"><Zap className="w-4 h-4" /></button>
                    )}
                    {row.status !== 'Completed' && (
                      <button onClick={() => handleComplete(row.id)} className="p-2 rounded-md text-emerald-400 hover:bg-white/5"><Clock className="w-4 h-4" /></button>
                    )}
                    <button onClick={() => handleDelete(row.id)} className="p-2 rounded-md text-rose-500 hover:bg-white/5"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 text-center text-slate-400">No dispatches match your search.</div>
        ) : (
          filtered.map(row => (
            <div key={row.id} className="group rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-400/30">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-xs text-slate-200">{row.id}</div>
                    <div className="text-sm font-semibold text-white">{row.patient}</div>
                  </div>
                  <div className="mt-2 text-xs text-slate-300 flex items-center gap-2"><Hospital className="w-4 h-4 text-cyan-300" />{row.hospital}</div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASS[row.status as Status]}`}>
                    {row.status === 'Pending' && '⏳'}
                    {row.status === 'Active' && '🚑'}
                    {row.status === 'Completed' && '✅'}
                    <span>{row.status}</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-300">ETA: {formatETA(row.etaMinutes)}</div>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button onClick={() => handleView(row.id)} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10">View Details</button>
                <button onClick={() => handleActivate(row.id)} className="rounded-2xl bg-gradient-to-r from-rose-500 to-fuchsia-500 px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110">Activate</button>
                {row.status !== 'Completed' && (
                  <button onClick={() => handleComplete(row.id)} className="rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110">Complete</button>
                )}
                <button onClick={() => handleDelete(row.id)} className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20">Remove</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmergencyDispatchTable;
