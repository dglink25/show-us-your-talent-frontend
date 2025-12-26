// hooks/useRedirectAfterLogin.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useRedirectAfterLogin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      // Petite pause pour permettre à l'UI de se mettre à jour
      const timer = setTimeout(() => {
        // Déterminer la redirection basée sur les rôles
        if (user.roles && Array.isArray(user.roles)) {
          if (user.roles.includes('admin')) {
            navigate('/admin');
          } else if (user.roles.includes('promoteur')) {
            navigate('/promoteur');
          } else if (user.roles.includes('candidat')) {
            navigate('/candidat');
          } else {
            navigate('/dashboard');
          }
        } else {
          // Par défaut, rediriger vers le dashboard
          navigate('/dashboard');
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);
};