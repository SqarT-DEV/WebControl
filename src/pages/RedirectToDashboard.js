import { Navigate } from 'react-router-dom';

const RedirectToDashboard = () => {
  const stored = localStorage.getItem('auth');
  const auth = stored ? JSON.parse(stored) : null;

  return auth?.token
    ? <Navigate to="/dashboard" replace />
    : <Navigate to="/login" replace />;
};

export default RedirectToDashboard;
