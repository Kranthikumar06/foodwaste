import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user } = useSelector(state => state.auth || {});

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    // Redirect to their respective dashboard
    const dashboardMap = {
      DONOR: '/donor/dashboard',
      VOLUNTEER: '/volunteer/dashboard',
      NGO: '/ngo/dashboard',
      ADMIN: '/admin/dashboard'
    };
    return <Navigate to={dashboardMap[user?.role] || '/login'} replace />;
  }

  return children;
}
