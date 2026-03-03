import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    // Si no hay usuario, redirigir al home
    if (!currentUser) {
      navigate('/');
      return;
    }

    // Si se requiere un rol específico, verificar
    if (requiredRole && requiredRole.length > 0) {
      if (!requiredRole.includes(currentUser.role)) {
        navigate('/colaborador/dashboard');
      }
    }
  }, [currentUser, navigate, requiredRole]);

  // Si no hay usuario, no renderizar nada
  if (!currentUser) {
    return null;
  }

  // Si hay rol requerido y el usuario no lo tiene, no renderizar
  if (requiredRole && requiredRole.length > 0 && !requiredRole.includes(currentUser.role)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
