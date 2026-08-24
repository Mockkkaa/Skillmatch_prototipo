import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Redirect authenticated users away from public-only pages (login, register)
export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={getDashboardPath(user?.rol)} replace />;
  }
  return children;
}

// Protect routes by requiring authentication + optional role
export function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user?.rol)) {
    return <Navigate to="/acceso-denegado" replace />;
  }

  return children;
}

function getDashboardPath(rol) {
  switch (rol) {
    case 'ADMINISTRADOR': return '/admin';
    case 'FUNCIONARIO': return '/admin';
    case 'EMPRESA': return '/empresa';
    default: return '/dashboard';
  }
}
