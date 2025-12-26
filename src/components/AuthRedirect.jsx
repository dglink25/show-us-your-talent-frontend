import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthRedirect = () => {
  const { user, hasRole } = useAuth();
  const location = useLocation();
  const { from } = location.state || { from: '/' };

  useEffect(() => {
    console.log('AuthRedirect - User:', user);
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Rediriger vers la page demandée si elle existe
  if (from && from !== '/') {
    return <Navigate to={from} replace />;
  }

  // Redirection basée sur le rôle
  if (hasRole('admin')) {
    return <Navigate to="/admin" replace />;
  } else if (hasRole('promoteur')) {
    return <Navigate to="/promoteur" replace />;
  } else if (hasRole('candidat')) {
    return <Navigate to="/candidat" replace />;
  } else {
    // Fallback vers le dashboard général
    return <Navigate to="/dashboard" replace />;
  }
};

export default AuthRedirect;