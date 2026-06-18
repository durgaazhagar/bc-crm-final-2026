import React from 'react';

const DispatchMap: React.FC<{ items: any[] }> = ({ items }) => {
  // Placeholder map. Replace with react-leaflet or Mapbox integration for live tracking.
  return (
    <div className="rounded-2xl bg-slate-900/60 p-4 border border-white/6 h-64 flex items-center justify-center text-slate-400">
      <div>
        <div className="text-sm text-slate-300">Live Ambulance Tracking</div>
        <div className="mt-3 h-44 w-96 rounded-lg bg-white/5 flex items-center justify-center">Map placeholder</div>
      </div>
    </div>
  );
};

export default DispatchMap;
