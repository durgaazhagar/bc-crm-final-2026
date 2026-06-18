import React from 'react';
import { Phone, MessageSquare, Mail } from 'lucide-react';

const contacts = [
  { id: 1, name: 'Murugan Selvam', phone: '+91 98765 43210' },
  { id: 2, name: 'Kavitha Rajan', phone: '+91 91234 56789' },
];

const VolunteerComm: React.FC = () => {
  const openWhatsApp = (phone: string) => {
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}`,'_blank');
  };

  const openSMS = (phone: string) => {
    window.open(`sms:${phone}`,'_blank');
  };

  const openEmail = (name: string) => {
    window.open(`mailto:volunteer+${name.replace(/\s/g,'').toLowerCase()}@example.org`,'_blank');
  };

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Communication Hub</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {contacts.map((c) => (
          <div key={c.id} className="rounded-2xl border border-white/6 bg-slate-900/50 p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">{c.name}</div>
              <div className="text-xs text-slate-300">{c.phone}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openWhatsApp(c.phone)} className="rounded-full bg-green-500/80 p-2 text-white"><Phone className="w-4 h-4" /></button>
              <button onClick={() => openSMS(c.phone)} className="rounded-full bg-amber-500/80 p-2 text-white"><MessageSquare className="w-4 h-4" /></button>
              <button onClick={() => openEmail(c.name)} className="rounded-full bg-sky-500/80 p-2 text-white"><Mail className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VolunteerComm;
