import React, { useEffect, useState } from 'react';
import { dispatchService } from '../services/api';

type DispatchItem = any;

const statusColor = (s: string) => {
  if (s === 'Pending') return 'bg-yellow-400 text-slate-900';
  if (s === 'Dispatched') return 'bg-amber-500 text-white';
  if (s === 'Completed') return 'bg-emerald-500 text-white';
  return 'bg-slate-500 text-white';
};

const DispatchList: React.FC<{ filters: any; onSummary?: (s: any) => void }> = ({ filters, onSummary }) => {
  const [items, setItems] = useState<DispatchItem[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await dispatchService.list(filters);
      setItems(res.data.items || []);
      if (onSummary) onSummary(res.data.summary || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  const assign = async (id: string) => {
    const ambulanceId = prompt('Ambulance ID (e.g. AMB-101)');
    if (!ambulanceId) return;
    const driver = prompt('Driver name');
    const phone = prompt('Driver phone');
    const eta = parseInt(prompt('ETA minutes') || '10', 10);
    try {
      await dispatchService.assign(id, { ambulanceId, driver, phone, etaMinutes: eta });
      load();
      alert('Ambulance assigned');
    } catch (err) {
      console.error(err);
      alert('Failed to assign');
    }
  };

  const notify = async (id: string) => {
    try {
      await dispatchService.notify(id);
      alert('Donors notified (stub)');
    } catch (err) {
      console.error(err);
      alert('Notify failed');
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/60 p-4 border border-white/6">
      <div className="text-sm text-slate-300">Dispatches</div>
      {loading ? (
        <div className="mt-4 text-slate-400">Loading...</div>
      ) : (
        <div className="mt-3 w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-400 text-left">
              <tr>
                <th className="py-2">ID</th>
                <th>Patient</th>
                <th>Hospital</th>
                <th>Blood</th>
                <th>Qty</th>
                <th>Status</th>
                <th>ETA</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((d: DispatchItem) => (
                <tr key={d._id} className="border-t border-white/5">
                  <td className="py-3 text-slate-300">{d.dispatchId}</td>
                  <td className="text-white">{d.patientName}</td>
                  <td className="text-slate-200">{d.hospital}</td>
                  <td className="text-slate-200">{d.bloodGroup}</td>
                  <td className="text-slate-200">{d.quantity}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColor(d.status)}`}>{d.status}</span>
                  </td>
                  <td className="text-slate-200">{d.etaMinutes ? `${d.etaMinutes}m` : '-'}</td>
                  <td className="text-slate-200">
                    <button onClick={() => alert(JSON.stringify(d, null, 2))} className="mr-2 text-sky-400">View</button>
                    <button onClick={() => assign(d._id)} className="mr-2 text-amber-300">Assign</button>
                    <button onClick={() => notify(d._id)} className="text-rose-400">Notify</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DispatchList;
