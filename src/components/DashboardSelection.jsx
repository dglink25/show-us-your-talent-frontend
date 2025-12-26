import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardSelection = () => {
  const { user, hasRole, loading } = useAuth();

  useEffect(() => {
    console.log('DashboardSelection - User data:', {
      user,
      hasRoleAdmin: hasRole('admin'),
      hasRolePromoteur: hasRole('promoteur'),
      hasRoleCandidat: hasRole('candidat')
    });
  }, [user, hasRole]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirection basée sur les rôles
  if (hasRole('admin')) {
    console.log('Redirecting admin to /admin');
    return <Navigate to="/admin" replace />;
  } else if (hasRole('promoteur')) {
    console.log('Redirecting promoteur to /promoteur');
    return <Navigate to="/promoteur" replace />;
  } else if (hasRole('candidat')) {
    console.log('Redirecting candidat to /candidat');
    return <Navigate to="/candidat" replace />;
  }

  // Fallback - page de sélection si plusieurs rôles
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Sélectionnez votre espace
        </h1>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {hasRole('admin') && (
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👑</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Administration</h3>
                <p className="text-gray-600 mb-4">Gestion complète de la plateforme</p>
                <a 
                  href="/admin" 
                  className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Accéder
                </a>
              </div>
            </div>
          )}
          
          {hasRole('promoteur') && (
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎪</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Espace Promoteur</h3>
                <p className="text-gray-600 mb-4">Gérez vos éditions et candidatures</p>
                <a 
                  href="/promoteur" 
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Accéder
                </a>
              </div>
            </div>
          )}
          
          {hasRole('candidat') && (
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎤</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Espace Candidat</h3>
                <p className="text-gray-600 mb-4">Gérez vos candidatures et votes</p>
                <a 
                  href="/candidat" 
                  className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Accéder
                </a>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="/profile" 
            className="text-yellow-600 hover:text-yellow-700 font-medium"
          >
            Voir mon profil →
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardSelection;