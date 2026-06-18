import React from 'react';

type Props = {
  q: string;
  status: string;
  hospital: string;
  onChange: (s: any) => void;
};

const DispatchFilters: React.FC<Props> = ({ q, status, hospital, onChange }) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
      <div className="flex-1">
        <label className="block text-sm text-slate-300">Search</label>
        <input
          value={q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Patient, hospital or blood group"
          className="mt-1 w-full rounded-md bg-slate-800 border border-white/6 px-3 py-2 text-sm text-white"
        />
      </div>

      <div className="w-48">
        <label className="block text-sm text-slate-300">Status</label>
        <select
          value={status}
          onChange={(e) => onChange({ status: e.target.value })}
          className="mt-1 w-full rounded-md bg-slate-800 border border-white/6 px-3 py-2 text-sm text-white"
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="w-48">
        <label className="block text-sm text-slate-300">Hospital</label>
        <input
          value={hospital}
          onChange={(e) => onChange({ hospital: e.target.value })}
          placeholder="Filter by hospital"
          className="mt-1 w-full rounded-md bg-slate-800 border border-white/6 px-3 py-2 text-sm text-white"
        />
      </div>
    </div>
  );
};

export default DispatchFilters;
