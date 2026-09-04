import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('skillmatch_user');
    const token = localStorage.getItem('skillmatch_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('skillmatch_token', token);
    localStorage.setItem('skillmatch_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('skillmatch_token');
    localStorage.removeItem('skillmatch_user');
    setUser(null);
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    localStorage.setItem('skillmatch_user', JSON.stringify(updated));
    setUser(updated);
  };

  const isAuthenticated = !!user;
  const isRole = (role) => user?.rol?.toUpperCase() === role?.toUpperCase();
  const isAdmin = () => isRole('ADMINISTRADOR') || isRole('ADMIN');
  const isAprendiz = () => isRole('APRENDIZ');
  const isEmpresa = () => isRole('EMPRESA');
  const isFuncionario = () => isRole('FUNCIONARIO');

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, isAuthenticated, isRole, isAdmin, isAprendiz, isEmpresa, isFuncionario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
