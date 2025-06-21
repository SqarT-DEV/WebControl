import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleRoute = ({ allowedRoles, children }) => {
  const { user, token } = useSelector(state => state.auth);

  const stored = localStorage.getItem('auth');
  const localData = stored ? JSON.parse(stored) : null;
  const currentUser = user || localData?.user;
  const currentToken = token || localData?.token;

  if (!currentToken) return <Navigate to="/" replace />;

  if (!allowedRoles.includes(currentUser?.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleRoute;
