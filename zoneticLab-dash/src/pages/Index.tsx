import { Navigate } from 'react-router-dom';

// Redirect root to dashboard (handled by DashboardLayout)
export default function Index() {
  return <Navigate to="/" replace />;
}
