import React from 'react';
import type { LucideIcon } from 'lucide-react';

type Props = {
  Icon: LucideIcon;
  size?: number;
  title?: string;
};

const IconBadge: React.FC<Props> = ({ Icon, size = 20, title }) => {
  return (
    <span className="group inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 via-fuchsia-500 to-cyan-500 text-white shadow-[0_10px_30px_rgba(59,130,246,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(59,130,246,0.32)]">
      <Icon aria-hidden className="h-full w-full p-1" style={{ width: size, height: size }} />
      {title ? <span className="sr-only">{title}</span> : null}
    </span>
  );
};

export default IconBadge;
