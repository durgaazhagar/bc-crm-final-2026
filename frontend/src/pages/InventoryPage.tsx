import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronsUpDown,
  Archive,
  Clock3,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

type InventoryItem = {
  id: string;
  itemName: string;
  category: string;
  quantity: number;
  expiryDate: string | null;
  status: StockStatus;
};

const initialInventory: InventoryItem[] = [
  { id: '1', itemName: 'A+ Blood Bags', category: 'Blood Bags', quantity: 42, expiryDate: '2026-07-14', status: 'in_stock' },
  { id: '2', itemName: 'O- Blood Bags', category: 'Blood Bags', quantity: 8, expiryDate: '2026-06-22', status: 'low_stock' },
  { id: '3', itemName: 'B+ Blood Bags', category: 'Blood Bags', quantity: 0, expiryDate: '2026-07-02', status: 'out_of_stock' },
  { id: '4', itemName: 'Emergency Medical Kits', category: 'Medical Kits', quantity: 18, expiryDate: null, status: 'in_stock' },
  { id: '5', itemName: 'IV Fluid Sets', category: 'Equipment', quantity: 5, expiryDate: null, status: 'low_stock' },
  { id: '6', itemName: 'Portable Oxygen Cylinders', category: 'Equipment', quantity: 2, expiryDate: null, status: 'low_stock' },
  { id: '7', itemName: 'Plasma Blood Bags', category: 'Blood Bags', quantity: 12, expiryDate: '2026-06-19', status: 'low_stock' },
  { id: '8', itemName: 'Rapid Response Trauma Kits', category: 'Medical Kits', quantity: 0, expiryDate: null, status: 'out_of_stock' },
  { id: '9', itemName: 'Sterile Syringe Packs', category: 'Medical Kits', quantity: 54, expiryDate: '2027-01-12', status: 'in_stock' },
  { id: '10', itemName: 'Blood Collection Trays', category: 'Equipment', quantity: 26, expiryDate: null, status: 'in_stock' },
];

const statusLabels: Record<StockStatus, string> = {
  in_stock: '✅ In Stock',
  low_stock: '⚠️ Low Stock',
  out_of_stock: '❌ Out of Stock',
};

const statusClasses: Record<StockStatus, string> = {
  in_stock: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  low_stock: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  out_of_stock: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
};

const InventoryPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | StockStatus>('all');
  const [expiryFilter, setExpiryFilter] = useState(false);
  const [sortColumn, setSortColumn] = useState<keyof InventoryItem>('itemName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const today = useMemo(() => new Date(), []);
  const soonDate = useMemo(() => {
    const next = new Date(today);
    next.setDate(next.getDate() + 10);
    return next;
  }, [today]);

  const formattedDate = (value: string | null) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const filteredInventory = useMemo(() => {
    return initialInventory
      .filter((item) => {
        const searchText = searchValue.trim().toLowerCase();
        const matchesSearch =
          item.itemName.toLowerCase().includes(searchText) ||
          item.category.toLowerCase().includes(searchText);

        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

        const expiresSoon = item.expiryDate
          ? new Date(item.expiryDate) <= soonDate && new Date(item.expiryDate) >= today
          : false;

        return matchesSearch && matchesStatus && (!expiryFilter || expiresSoon);
      })
      .sort((a, b) => {
        const valueA = a[sortColumn] as string | number | null;
        const valueB = b[sortColumn] as string | number | null;

        if (valueA === null || valueB === null) return 0;
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        }

        return sortDirection === 'asc'
          ? String(valueA).localeCompare(String(valueB))
          : String(valueB).localeCompare(String(valueA));
      });
  }, [searchValue, statusFilter, expiryFilter, sortColumn, sortDirection, soonDate, today]);

  const totalItems = initialInventory.length;
  const lowStockCount = initialInventory.filter((item) => item.status === 'low_stock').length;
  const expiredCount = initialInventory.filter((item) => item.expiryDate && new Date(item.expiryDate) < today).length;

  const handleSort = (column: keyof InventoryItem) => {
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
        transition={{ duration: 0.5 }}
        className="mb-6 rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950/80 to-slate-900/70 p-6 shadow-2xl shadow-slate-950/40"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.36em] text-cyan-300/70">Inventory Management</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Supply & Stock Control</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              View real-time inventory with expiry monitoring, status filtering, and fast item search.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 w-full md:w-auto">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm">
              <div className="flex items-center gap-3 text-cyan-200">
                <Archive className="h-5 w-5" />
                <span className="text-xs uppercase tracking-[0.32em]">Total items</span>
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{totalItems}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm">
              <div className="flex items-center gap-3 text-amber-300">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-xs uppercase tracking-[0.32em]">Low stock</span>
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{lowStockCount}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm">
              <div className="flex items-center gap-3 text-rose-300">
                <Clock3 className="h-5 w-5" />
                <span className="text-xs uppercase tracking-[0.32em]">Expired</span>
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{expiredCount}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/30"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search items or categories..."
              className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-12 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 w-full lg:w-auto">
            <label className="block">
              <span className="sr-only">Filter status</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | StockStatus)}
                className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              >
                <option value="all">All stock statuses</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </label>
            <button
              type="button"
              onClick={() => setExpiryFilter((prev) => !prev)}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-3xl border px-4 py-3 text-sm font-medium transition ${expiryFilter ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200' : 'border-white/10 bg-slate-950/80 text-white hover:border-cyan-400 hover:text-cyan-200'}`}
            >
              <Filter className="h-4 w-4" />
              {expiryFilter ? 'Showing expiring soon' : 'Filter expiring soon'}
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-slate-950/80 text-slate-300">
                <tr>
                  <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">Item Name</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">Category</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">Quantity</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">Expiry Date</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                      No inventory items match the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item) => {
                    const expiryClass =
                      item.expiryDate && new Date(item.expiryDate) < today
                        ? 'text-rose-300'
                        : item.expiryDate && new Date(item.expiryDate) <= soonDate
                        ? 'text-amber-300'
                        : 'text-slate-200';

                    return (
                      <tr key={item.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-white">{item.itemName}</div>
                        </td>
                        <td className="px-5 py-4 text-slate-300">{item.category}</td>
                        <td className="px-5 py-4 text-slate-200">{item.quantity}</td>
                        <td className={`px-5 py-4 ${expiryClass}`}>{formattedDate(item.expiryDate)}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses[item.status]}`}>
                            {statusLabels[item.status]}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
            <div className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              <p className="text-xs uppercase tracking-[0.28em]">Visible items</p>
            </div>
            <p className="mt-3 text-3xl font-semibold text-white">{filteredInventory.length}</p>
            <p className="mt-2 text-sm text-slate-400">Showing items after search and filters</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
            <div className="flex items-center gap-3 text-amber-300">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-xs uppercase tracking-[0.28em]">Expiring soon</p>
            </div>
            <p className="mt-3 text-3xl font-semibold text-white">{initialInventory.filter((item) => item.expiryDate && new Date(item.expiryDate) <= soonDate && new Date(item.expiryDate) >= today).length}</p>
            <p className="mt-2 text-sm text-slate-400">Items requiring expiry review</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
            <div className="flex items-center gap-3 text-cyan-200">
              <ShieldCheck className="h-5 w-5" />
              <p className="text-xs uppercase tracking-[0.28em]">Healthy stock</p>
            </div>
            <p className="mt-3 text-3xl font-semibold text-white">{initialInventory.filter((item) => item.status === 'in_stock').length}</p>
            <p className="mt-2 text-sm text-slate-400">Items ready for immediate dispatch</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InventoryPage;
