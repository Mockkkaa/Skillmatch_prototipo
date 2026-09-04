import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={getDashboardPath(user?.rol)} replace />;
  }
  return children;
}

export function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0) {
    const userRole = (user?.rol || '').toUpperCase();
    const normalizedRoles = roles.map((r) => r.toUpperCase());
    const hasRole =
      normalizedRoles.includes(userRole) ||
      (normalizedRoles.includes('ADMINISTRADOR') && userRole === 'ADMIN') ||
      (normalizedRoles.includes('ADMIN') && userRole === 'ADMINISTRADOR');

    if (!hasRole) {
      return <Navigate to="/acceso-denegado" replace />;
    }
  }

  return children;
}

function getDashboardPath(rol) {
  const r = (rol || '').toUpperCase();
  if (r === 'ADMINISTRADOR' || r === 'ADMIN' || r === 'FUNCIONARIO') return '/admin';
  if (r === 'EMPRESA') return '/empresa';
  return '/dashboard';
}
