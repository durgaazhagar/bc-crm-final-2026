import React from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import AdminLayout from './layouts/AdminLayout';
import DashboardDonors from './pages/DashboardDonors';
import DonorMapPage from './pages/DonorMapPage';
import DashboardHospitals from './pages/DashboardHospitals';
import DashboardCampaigns from './pages/DashboardCampaigns';
import VolunteerManagementPage from './pages/VolunteerManagementPage';
import DashboardReports from './pages/DashboardReports';
import DonorReport from './pages/reports/DonorReport';
import HospitalReport from './pages/reports/HospitalReport';
import CampaignReport from './pages/reports/CampaignReport';
import VolunteerReport from './pages/reports/VolunteerReport';
import BloodBankDashboardPage from './pages/BloodBankDashboardPage';
import VolunteerDashboardPage from './pages/VolunteerDashboardPage';
import DonorManagementPage from './pages/DonorManagementPage';
import HospitalManagement from './pages/HospitalManagement';
import HospitalPage from './pages/HospitalPage';
import EmergencyPage from './pages/EmergencyPage';
import AIInsightsPage from './pages/AIInsightsPage';
import CampaignPage from './pages/CampaignPage';
import VolunteerLanding from './pages/VolunteerLanding';
import VolunteerProfiles from './pages/VolunteerProfiles';
import VolunteerRewards from './pages/VolunteerRewards';
import VolunteerRewardsHistory from './pages/VolunteerRewardsHistory';
import VolunteerEvents from './pages/VolunteerEvents';
import RewardsHistoryPage from './pages/RewardsHistoryPage';
import VolunteerMetrics from './pages/VolunteerMetrics';
import VolunteerComm from './pages/VolunteerComm';
import VolunteerAI from './pages/VolunteerAI';
import AnalyticsPage from './pages/AnalyticsPage';
import CommunicationPage from './pages/CommunicationPage';
import SettingsPage from './pages/SettingsPage';
import RewardsPage from './pages/RewardsPage';
import UserAdminPage from './pages/UserAdminPage';
import InventoryPage from './pages/InventoryPage';
import RequestsPage from './pages/RequestsPage';
import ChatbotPage from './pages/ChatbotPage';
import DemandMeterPage from './pages/DemandMeterPage';
import RegionalActivityPage from './pages/RegionalActivityPage';
import DonorProfilePage from './pages/DonorProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ActivityLogPage from './pages/ActivityLogPage';
import CampaignDetailsPage from './pages/CampaignDetailsPage';
import HospitalCommandCenter from './pages/HospitalCommandCenter';
import TrustFraudPage from './pages/TrustFraudPage';
import LoyaltyTrustPage from './pages/LoyaltyTrustPage';
import EmergencyDispatchPage from './pages/EmergencyDispatchPage';
import DonorWellnessPage from './pages/DonorWellnessPage';
import SocialImpactPage from './pages/SocialImpactPage';
import GamificationPage from './pages/GamificationPage';
import CommunicationHubPage from './pages/CommunicationHubPage';
import AIPredictionHubPage from './pages/AIPredictionHubPage';

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
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/dashboard/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="donors" element={<ProtectedRoute><DashboardDonors /></ProtectedRoute>} />
        <Route path="donor-map" element={<ProtectedRoute><DonorMapPage /></ProtectedRoute>} />
        <Route path="hospitals" element={<ProtectedRoute><HospitalManagement /></ProtectedRoute>} />
        <Route path="requests" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />
        <Route path="inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
        <Route path="chatbot" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
        <Route path="campaigns" element={<ProtectedRoute><DashboardCampaigns /></ProtectedRoute>} />
        <Route path="volunteers" element={<ProtectedRoute><VolunteerManagementPage /></ProtectedRoute>} />
        <Route path="rewards" element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
        <Route path="rewards-history" element={<ProtectedRoute><RewardsHistoryPage /></ProtectedRoute>} />
        <Route path="reports" element={<ProtectedRoute><DashboardReports /></ProtectedRoute>} />
        <Route path="reports/donors" element={<ProtectedRoute><DonorReport /></ProtectedRoute>} />
        <Route path="reports/hospitals" element={<ProtectedRoute><HospitalReport /></ProtectedRoute>} />
        <Route path="reports/campaigns" element={<ProtectedRoute><CampaignReport /></ProtectedRoute>} />
        <Route path="reports/volunteers" element={<ProtectedRoute><VolunteerReport /></ProtectedRoute>} />
        <Route path="fraud" element={<ProtectedRoute><TrustFraudPage /></ProtectedRoute>} />
        <Route path="trust" element={<ProtectedRoute><LoyaltyTrustPage /></ProtectedRoute>} />
        <Route path="dispatch" element={<ProtectedRoute><EmergencyDispatchPage /></ProtectedRoute>} />
        <Route path="wellness" element={<ProtectedRoute><DonorWellnessPage /></ProtectedRoute>} />
        <Route path="impact" element={<ProtectedRoute><SocialImpactPage /></ProtectedRoute>} />
        <Route path="gamification" element={<ProtectedRoute><GamificationPage /></ProtectedRoute>} />
        <Route path="communication" element={<ProtectedRoute><CommunicationHubPage /></ProtectedRoute>} />
        <Route path="prediction" element={<ProtectedRoute><AIPredictionHubPage /></ProtectedRoute>} />
      </Route>
      <Route path="/dashboard/hospital" element={<ProtectedRoute><HospitalPage /></ProtectedRoute>} />
      <Route path="/dashboard/bloodbank" element={<ProtectedRoute><BloodBankDashboardPage /></ProtectedRoute>} />
      <Route path="/dashboard/volunteer" element={<ProtectedRoute><VolunteerDashboardPage /></ProtectedRoute>} />
      <Route path="/app" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="donors" element={<ProtectedRoute><DonorManagementPage /></ProtectedRoute>} />
        <Route path="hospitals" element={<ProtectedRoute><HospitalPage /></ProtectedRoute>} />
        <Route path="patients" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="campaigns" element={<ProtectedRoute><CampaignPage /></ProtectedRoute>} />
        <Route path="trust" element={<ProtectedRoute><LoyaltyTrustPage /></ProtectedRoute>} />
        <Route path="volunteers" element={<ProtectedRoute><VolunteerLanding /></ProtectedRoute>} />
        <Route path="volunteers/profiles" element={<ProtectedRoute><VolunteerProfiles /></ProtectedRoute>} />
        <Route path="volunteers/rewards" element={<ProtectedRoute><VolunteerRewards /></ProtectedRoute>} />
        <Route path="volunteers/rewards/history" element={<ProtectedRoute><VolunteerRewardsHistory /></ProtectedRoute>} />
        <Route path="volunteers/events" element={<ProtectedRoute><VolunteerEvents /></ProtectedRoute>} />
        <Route path="volunteers/metrics" element={<ProtectedRoute><VolunteerMetrics /></ProtectedRoute>} />
        <Route path="volunteers/comm" element={<ProtectedRoute><VolunteerComm /></ProtectedRoute>} />
        <Route path="volunteers/ai" element={<ProtectedRoute><VolunteerAI /></ProtectedRoute>} />
        <Route path="communication" element={<ProtectedRoute><CommunicationPage /></ProtectedRoute>} />
        <Route path="ai" element={<ProtectedRoute><AIInsightsPage /></ProtectedRoute>} />
        <Route path="analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="users" element={<ProtectedRoute><UserAdminPage /></ProtectedRoute>} />
        <Route path="inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
        <Route path="demand" element={<ProtectedRoute><DemandMeterPage /></ProtectedRoute>} />
        <Route path="regional" element={<ProtectedRoute><RegionalActivityPage /></ProtectedRoute>} />
        <Route path="donors/profile" element={<ProtectedRoute><DonorProfilePage /></ProtectedRoute>} />
        <Route path="leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        <Route path="activity" element={<ProtectedRoute><ActivityLogPage /></ProtectedRoute>} />
        <Route path="campaigns/details" element={<ProtectedRoute><CampaignDetailsPage /></ProtectedRoute>} />
        <Route path="emergency" element={<ProtectedRoute><HospitalCommandCenter /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </div>
);
};

export default App;
