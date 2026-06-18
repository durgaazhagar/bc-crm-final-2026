import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, Check, X, AlertTriangle, ClipboardList, ShieldAlert } from 'lucide-react';
import requestsData, { RequestItem, RequestStatus } from '../data/requests';

const statusClasses: Record<RequestStatus, string> = {
  Pending: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  Fulfilled: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  Emergency: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
};

const statusLabel: Record<RequestStatus, string> = {
  Pending: '⏳ Pending',
  Fulfilled: '✅ Fulfilled',
  Emergency: '🚨 Emergency',
};

const bloodGroups = Array.from(new Set(requestsData.map((item: RequestItem) => item.bloodGroup))).sort();

const RequestsPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RequestStatus>('all');
  const [groupFilter, setGroupFilter] = useState<'all' | string>('all');
  const [sortColumn, setSortColumn] = useState<keyof RequestItem>('requestId');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredRequests = useMemo(() => {
    return requestsData
      .filter((request: RequestItem) => {
        const query = searchValue.trim().toLowerCase();
        const matchesSearch =
          request.requestId.toLowerCase().includes(query) ||
          request.hospitalName.toLowerCase().includes(query) ||
          request.bloodGroup.toLowerCase().includes(query);

        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
        const matchesGroup = groupFilter === 'all' || request.bloodGroup === groupFilter;

        return matchesSearch && matchesStatus && matchesGroup;
      })
      .sort((a: RequestItem, b: RequestItem) => {
        if (sortColumn === 'quantity') {
          return sortDirection === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity;
        }

        return sortDirection === 'asc'
          ? String(a[sortColumn]).localeCompare(String(b[sortColumn]))
          : String(b[sortColumn]).localeCompare(String(a[sortColumn]));
      });
  }, [searchValue, statusFilter, groupFilter, sortColumn, sortDirection]);

  const totals = useMemo(() => {
    return {
      total: requestsData.length,
      pending: requestsData.filter((request: RequestItem) => request.status === 'Pending').length,
      fulfilled: requestsData.filter((request: RequestItem) => request.status === 'Fulfilled').length,
      emergency: requestsData.filter((request: RequestItem) => request.status === 'Emergency').length,
    };
  }, []);

  const handleSort = (column: keyof RequestItem) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      return;
    }
    setSortColumn(column);
    setSortDirection('asc');
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-6 rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950/80 to-slate-900/70 p-6 shadow-2xl shadow-slate-950/40"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.36em] text-cyan-300/70">Requests Management</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Hospital Blood Requests</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Manage incoming hospital requests, prioritize emergencies, and keep fulfilment on track.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 w-full lg:w-auto">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm">
              <div className="flex items-center gap-3 text-slate-300">
                <ClipboardList className="h-5 w-5 text-cyan-300" />
                <span className="text-xs uppercase tracking-[0.32em]">Total Requests</span>
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{totals.total}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm">
              <div className="flex items-center gap-3 text-amber-300">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-xs uppercase tracking-[0.32em]">Pending</span>
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{totals.pending}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm">
              <div className="flex items-center gap-3 text-emerald-300">
                <Check className="h-5 w-5" />
                <span className="text-xs uppercase tracking-[0.32em]">Fulfilled</span>
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{totals.fulfilled}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm">
              <div className="flex items-center gap-3 text-rose-300">
                <ShieldAlert className="h-5 w-5" />
                <span className="text-xs uppercase tracking-[0.32em]">Emergency</span>
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{totals.emergency}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45 }}
        className="rounded-[32px] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/30"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by request ID, hospital, or blood group..."
              className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-12 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 w-full lg:w-auto">
            <label className="block">
              <span className="sr-only">Filter status</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | RequestStatus)}
                className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              >
                <option value="all">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Fulfilled">Fulfilled</option>
                <option value="Emergency">Emergency</option>
              </select>
            </label>
            <label className="block">
              <span className="sr-only">Filter blood group</span>
              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value as 'all' | string)}
                className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              >
                <option value="all">All blood groups</option>
                {bloodGroups.map((group: string) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => {
                setSearchValue('');
                setStatusFilter('all');
                setGroupFilter('all');
              }}
              className="inline-flex items-center justify-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:border-cyan-400 hover:text-cyan-200"
            >
              <Filter className="h-4 w-4" />
              Reset filters
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/90 text-slate-400">
                <tr>
                  <th className="px-5 py-4 uppercase tracking-[0.18em] cursor-pointer" onClick={() => handleSort('requestId')}>
                    Request ID
                  </th>
                  <th className="px-5 py-4 uppercase tracking-[0.18em] cursor-pointer" onClick={() => handleSort('hospitalName')}>
                    Hospital Name
                  </th>
                  <th className="px-5 py-4 uppercase tracking-[0.18em] cursor-pointer" onClick={() => handleSort('bloodGroup')}>
                    Blood Group
                  </th>
                  <th className="px-5 py-4 uppercase tracking-[0.18em] cursor-pointer" onClick={() => handleSort('quantity')}>
                    Quantity
                  </th>
                  <th className="px-5 py-4 uppercase tracking-[0.18em]">Status</th>
                  <th className="px-5 py-4 uppercase tracking-[0.18em]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                      No requests match your current search or filters.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request: RequestItem) => (
                    <tr key={request.id} className={`border-t border-white/5 transition ${request.status === 'Emergency' ? 'bg-rose-500/5 hover:bg-rose-500/10' : 'hover:bg-white/5'}`}>
                      <td className="px-5 py-4 font-semibold text-white">{request.requestId}</td>
                      <td className="px-5 py-4">{request.hospitalName}</td>
                      <td className="px-5 py-4">{request.bloodGroup}</td>
                      <td className="px-5 py-4">{request.quantity}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses[request.status]}`}>
                          {statusLabel[request.status]}
                        </span>
                      </td>
                      <td className="px-5 py-4 space-x-2">
                        <button type="button" className="inline-flex items-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-cyan-200 transition hover:border-cyan-400 hover:text-cyan-100">
                          <Eye className="h-4 w-4" /> View
                        </button>
                        <button type="button" className="inline-flex items-center gap-2 rounded-3xl border border-white/10 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200 transition hover:border-emerald-400 hover:text-emerald-100">
                          <Check className="h-4 w-4" /> Approve
                        </button>
                        <button type="button" className="inline-flex items-center gap-2 rounded-3xl border border-white/10 bg-rose-500/10 px-3 py-2 text-sm text-rose-200 transition hover:border-rose-400 hover:text-rose-100">
                          <X className="h-4 w-4" /> Reject
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RequestsPage;
