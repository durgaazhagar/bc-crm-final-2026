import React from 'react';
import { Calendar, Zap } from 'lucide-react';

const events = [
  { id: 1, type: 'blood_drive', title: 'Chennai Blood Drive', date: '2026-07-10', icon: '🩸' },
  { id: 2, type: 'awareness', title: 'Donor Awareness', date: '2026-07-18', icon: '📣' },
  { id: 3, type: 'training', title: 'Volunteer Training', date: '2026-08-02', icon: '🎓' },
];

const VolunteerEvents: React.FC = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="mb-4 flex items-center gap-3">
        <Calendar className="w-6 h-6 text-white" />
        <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {Array.from({ length: 28 }).map((_, idx) => {
          const day = idx + 1;
          const dayEvents = events.filter(ev => new Date(ev.date).getDate() === day);
          return (
            <div key={idx} className="rounded-lg border border-white/6 bg-slate-900/40 p-2 min-h-[78px]">
              <div className="text-xs text-slate-300">{day}</div>
              <div className="mt-1 space-y-1">
                {dayEvents.map(ev => (
                  <button key={ev.id} onClick={()=>window.alert(`${ev.title} — ${ev.date}`)} className="w-full text-left rounded-md bg-white/3 px-2 py-1 text-sm text-white hover:bg-white/6 transition">
                    <span className="mr-2">{ev.icon}</span>{ev.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
          <div key={e.id} className="rounded-2xl border border-white/6 bg-slate-900/50 p-4 flex items-center gap-3">
            <div className="text-3xl">{e.icon}</div>
            <div>
              <div className="font-semibold text-white">{e.title}</div>
              <div className="text-xs text-slate-300">{e.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VolunteerEvents;
