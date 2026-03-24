import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HeatmapPage from './pages/public/HeatmapPage';
import AboutPage from './pages/public/AboutPage';
import DonorDashboard from './pages/donor/DonorDashboard';
import PostFoodPage from './pages/donor/PostFoodPage';
import MyPostsPage from './pages/donor/MyPostsPage';
import ImpactPage from './pages/donor/ImpactPage';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import FoodMapPage from './pages/volunteer/FoodMapPage';
import BatchRoutePage from './pages/volunteer/BatchRoutePage';
import VolunteerProfilePage from './pages/volunteer/VolunteerProfilePage';
import VolunteerLayout from './components/volunteer/VolunteerLayout';
import DonorLayout from './components/donor/DonorLayout';

// NGO
import NgoLayout from './components/ngo/NgoLayout';
import NgoDashboard from './pages/ngo/NgoDashboard';
import HungerSpotsPage from './pages/ngo/HungerSpotsPage';
import NgoVolunteersPage from './pages/ngo/NgoVolunteersPage';
import NgoReportsPage from './pages/ngo/NgoReportsPage';
import NgoProfilePage from './pages/ngo/NgoProfilePage';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import UserVerificationPage from './pages/admin/UserVerificationPage';
import PostsModerationPage from './pages/admin/PostsModerationPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import EmergencyConsolePage from './pages/admin/EmergencyConsolePage';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/heatmap" element={<HeatmapPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Donor Routes */}
        <Route path="/donor/*" element={
          <ProtectedRoute role="DONOR">
            <DonorLayout>
              <Routes>
                <Route path="dashboard" element={<DonorDashboard />} />
                <Route path="post" element={<PostFoodPage />} />
                <Route path="posts" element={<MyPostsPage />} />
                <Route path="impact" element={<ImpactPage />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </DonorLayout>
          </ProtectedRoute>
        } />

        {/* Volunteer Routes */}
        <Route path="/volunteer/*" element={
          <ProtectedRoute role="VOLUNTEER">
            <VolunteerLayout>
              <Routes>
                <Route path="dashboard" element={<VolunteerDashboard />} />
                <Route path="map" element={<FoodMapPage />} />
                <Route path="route/:id" element={<BatchRoutePage />} />
                <Route path="profile" element={<VolunteerProfilePage />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </VolunteerLayout>
          </ProtectedRoute>
        } />

        {/* NGO Routes */}
        <Route path="/ngo/*" element={
          <ProtectedRoute role="NGO">
            <NgoLayout>
              <Routes>
                <Route path="dashboard"  element={<NgoDashboard />} />
                <Route path="spots"      element={<HungerSpotsPage />} />
                <Route path="volunteers" element={<NgoVolunteersPage />} />
                <Route path="reports"    element={<NgoReportsPage />} />
                <Route path="profile"    element={<NgoProfilePage />} />
                <Route path="*"          element={<Navigate to="dashboard" replace />} />
              </Routes>
            </NgoLayout>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users"     element={<ProtectedRoute role="ADMIN"><UserVerificationPage /></ProtectedRoute>} />
        <Route path="/admin/posts"     element={<ProtectedRoute role="ADMIN"><PostsModerationPage /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute role="ADMIN"><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/admin/emergency" element={<ProtectedRoute role="ADMIN"><EmergencyConsolePage /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
