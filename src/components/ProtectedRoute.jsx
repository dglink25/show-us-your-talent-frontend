import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Vérification des permissions...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading, initialized, hasRole, hasAnyRole } = useAuth();
  const location = useLocation();

  // Debug détaillé
  useEffect(() => {
    console.log('🔐 ProtectedRoute DEBUG:', {
      path: location.pathname,
      loading,
      initialized,
      user: user ? {
        id: user.id,
        email: user.email,
        type_compte: user.type_compte,
        roles: user.roles,
        fullUser: user
      } : 'No user',
      requiredRoles: roles,
      hasRoleAdmin: hasRole('admin'),
      hasRolePromoteur: hasRole('promoteur'),
      hasRoleCandidat: hasRole('candidat'),
      token: localStorage.getItem('token') ? 'Exists' : 'None'
    });
  }, [user, loading, initialized, location.pathname, roles, hasRole]);

  // Afficher le spinner pendant le chargement
  if (loading || !initialized) {
    console.log('🔄 ProtectedRoute: Still loading...');
    return <LoadingSpinner />;
  }

  // Si pas d'utilisateur
  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to login');
    console.log('   Redirecting from:', location.pathname);
    return <Navigate 
      to="/login" 
      replace 
      state={{ from: location.pathname }} 
    />;
  }

  // Vérifier les rôles si spécifiés
  if (roles.length > 0) {
    const hasRequiredRole = hasAnyRole(roles);
    
    console.log('🔍 Role check:', {
      requiredRoles: roles,
      userRoles: user.roles,
      userTypeCompte: user.type_compte,
      hasRequiredRole,
      hasRolePromoteur: hasRole('promoteur'),
      hasRoleAdmin: hasRole('admin'),
      hasRoleCandidat: hasRole('candidat')
    });
    
    if (!hasRequiredRole) {
      console.log('🚫 ProtectedRoute: User lacks required roles');
      console.log('   User roles:', user.roles);
      console.log('   Required roles:', roles);
      console.log('   User type_compte:', user.type_compte);
      
      // Rediriger vers une page accessible selon le rôle
      if (hasRole('admin')) {
        console.log('   Redirecting to /admin');
        return <Navigate to="/admin" replace />;
      } else if (hasRole('promoteur')) {
        console.log('   Redirecting to /promoteur');
        return <Navigate to="/promoteur" replace />;
      } else if (hasRole('candidat')) {
        console.log('   Redirecting to /candidat');
        return <Navigate to="/candidat" replace />;
      } else {
        console.log('   Redirecting to /dashboard');
        return <Navigate to="/dashboard" replace />;
      }
    }
    
    console.log('✅ ProtectedRoute: User has required roles');
  }

  console.log('✅ ProtectedRoute: Access granted to', location.pathname);
  return children;
};

export default ProtectedRoute;