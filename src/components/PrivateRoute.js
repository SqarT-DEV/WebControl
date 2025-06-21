import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  // Verifica si hay token en Redux o en localStorage
  const stored = localStorage.getItem('auth');
  const localToken = stored ? JSON.parse(stored).token : null;

  const isAuthenticated = token || localToken;

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
