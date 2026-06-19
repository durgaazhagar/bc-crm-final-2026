import React from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import BloodBankDashboardPage from './pages/BloodBankDashboardPage';
import VolunteerDashboardPage from './pages/VolunteerDashboardPage';
import DonorManagementPage from './pages/DonorManagementPage';
import HospitalPage from './pages/HospitalPage';
import EmergencyPage from './pages/EmergencyPage';
import AIInsightsPage from './pages/AIInsightsPage';
import CampaignPage from './pages/CampaignPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CommunicationPage from './pages/CommunicationPage';
import SettingsPage from './pages/SettingsPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('bloodconnect_token');
  const user = localStorage.getItem('bloodconnect_user');
  const location = useLocation();

  if (!token) return <Navigate to="/app/register" replace />;

  // If path is /dashboard/<role>, ensure user role matches
  try {
    const parsed = JSON.parse(user || '{}');
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts[0] === 'dashboard' && parts[1]) {
      const reqRole = parts[1];
      const userRole = parsed.role || parsed?.user?.role;
      // Accept 'bloodbank' and 'blood_bank' equivalence
      const normalize = (r: string) => (r ? r.replace('_', '').toLowerCase() : '');
      if (normalize(reqRole) !== normalize(userRole)) {
        return <Navigate to="/app/register" replace />;
      }
    }
  } catch (e) {
    return <Navigate to="/app/register" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // On app load, if a token exists, redirect to the role-based dashboard
  React.useEffect(() => {
    try {
      const token = localStorage.getItem('bloodconnect_token');
      if (!token) return;
      // If already on a dashboard route, do nothing
      if (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/app')) return;
      const raw = localStorage.getItem('bloodconnect_user');
      const parsed = raw ? JSON.parse(raw) : {};
      const role = parsed?.role || parsed?.user?.role || 'admin';
      const roleRouteMap: Record<string, string> = {
        admin: '/dashboard/admin',
        hospital: '/dashboard/hospital',
        blood_bank: '/dashboard/bloodbank',
        bloodbank: '/dashboard/bloodbank',
        volunteer: '/dashboard/volunteer',
      };
      navigate(roleRouteMap[role] || '/dashboard/admin', { replace: true });
    } catch (e) {
      // ignore JSON parse errors and do not redirect
    }
  }, [navigate, location]);

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#0b0f14] via-[#0d1117] to-[#161b22]" data-theme="avatar">
    <div id="holo-particles" className="fixed inset-0 pointer-events-none z-0 opacity-10" />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app/register" element={<RegisterPage />} />
      <Route path="/dashboard/admin" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/dashboard/hospital" element={<ProtectedRoute><HospitalPage /></ProtectedRoute>} />
      <Route path="/dashboard/bloodbank" element={<ProtectedRoute><BloodBankDashboardPage /></ProtectedRoute>} />
      <Route path="/dashboard/volunteer" element={<ProtectedRoute><VolunteerDashboardPage /></ProtectedRoute>} />
      <Route path="/app" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="donors" element={<ProtectedRoute><DonorManagementPage /></ProtectedRoute>} />
        <Route path="hospitals" element={<ProtectedRoute><HospitalPage /></ProtectedRoute>} />
        <Route path="patients" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="campaigns" element={<ProtectedRoute><CampaignPage /></ProtectedRoute>} />
        <Route path="communication" element={<ProtectedRoute><CommunicationPage /></ProtectedRoute>} />
        <Route path="ai" element={<ProtectedRoute><AIInsightsPage /></ProtectedRoute>} />
        <Route path="analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </div>
);
};

export default App;
