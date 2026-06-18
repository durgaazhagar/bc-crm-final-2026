import { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
}

const SectionCard = ({ title, subtitle, className = '', children }: SectionCardProps) => (
  <div className={`rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl ${className}`}>
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
      </div>
    </div>
    {children}
  </div>
);

export default SectionCard;
