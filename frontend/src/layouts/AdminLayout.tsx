import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SharedNavbar from '../components/SharedNavbar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(2,6,13,0.8),transparent_30%)] text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0">
        <SharedNavbar isLoggedIn={true} />
        <main className="flex-1 min-h-0 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
