interface StatCardProps {
  label: string;
  value: string;
  accent?: string;
}

const StatCard = ({ label, value, accent = 'bg-red-500' }: StatCardProps) => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glass">
    <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white ${accent}`}>{label}</div>
    <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
  </div>
);

export default StatCard;
