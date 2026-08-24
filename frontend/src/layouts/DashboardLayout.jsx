import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

export default function DashboardLayout({ children }) {
  const { user, logout, isAprendiz, isEmpresa, isAdmin, isFuncionario } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close sidebar on navigation on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ to, icon, label }) => {
    const active = location.pathname.startsWith(to) && 
                   (to !== '/dashboard' || location.pathname === '/dashboard') &&
                   (to !== '/admin' || location.pathname === '/admin') &&
                   (to !== '/empresa' || location.pathname === '/empresa');
    return (
      <Link to={to} className={`nav-item ${active ? 'active' : ''}`}>
        <span className="nav-icon">{icon}</span>
        <span className="nav-label">{label}</span>
      </Link>
    );
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="brand">
            <span className="brand-icon">⚡</span>
            <span className="sidebar-brand-text">SkillMatch</span>
          </Link>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {isAprendiz() && (
            <>
              <div className="nav-section">Principal</div>
              <NavItem to="/dashboard" icon="📊" label="Dashboard" />
              <NavItem to="/ofertas" icon="💼" label="Buscar Ofertas" />
              <NavItem to="/postulaciones" icon="📝" label="Mis Postulaciones" />
              
              <div className="nav-section mt-4">Mi Perfil</div>
              <NavItem to="/perfil" icon="👤" label="Información Personal" />
              <NavItem to="/hoja-de-vida" icon="📄" label="Hoja de Vida" />
              <NavItem to="/formacion" icon="🎓" label="Formación" />
              <NavItem to="/experiencia" icon="🏢" label="Experiencia" />
            </>
          )}

          {isEmpresa() && (
            <>
              <div className="nav-section">Principal</div>
              <NavItem to="/empresa" icon="📊" label="Dashboard" />
              <NavItem to="/empresa/vacantes" icon="💼" label="Mis Vacantes" />
              <NavItem to="/empresa/postulaciones" icon="👥" label="Postulaciones" />
              
              <div className="nav-section mt-4">Empresa</div>
              <NavItem to="/empresa/perfil" icon="🏢" label="Perfil Empresarial" />
            </>
          )}

          {(isAdmin() || isFuncionario()) && (
            <>
              <div className="nav-section">Administración</div>
              <NavItem to="/admin" icon="📊" label="Dashboard" />
              <NavItem to="/admin/reportes" icon="📈" label="Reportes" />
              
              <div className="nav-section mt-4">Gestión</div>
              {isAdmin() && <NavItem to="/admin/usuarios" icon="👥" label="Usuarios" />}
              <NavItem to="/admin/empresas" icon="🏢" label="Empresas" />
              <NavItem to="/admin/vacantes" icon="💼" label="Vacantes" />
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-mini-profile">
            <div className="avatar avatar-sm">
              {user?.foto_perfil ? (
                <img src={`http://localhost:3001${user.foto_perfil}`} alt={user.nombre} />
              ) : (
                user?.nombre?.charAt(0)
              )}
            </div>
            <div className="user-mini-info">
              <span className="user-mini-name">{user?.nombre}</span>
              <span className="user-mini-role">{user?.rol}</span>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout} title="Cerrar sesión">
            🚪 <span className="nav-label">Salir</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <button 
            className="mobile-menu-btn" 
            onClick={() => setSidebarOpen(true)}
            style={{ display: 'flex' }}
          >
            <span></span><span></span><span></span>
          </button>
          
          <div className="header-right">
            {/* Header elements like notifications could go here */}
            <div className="user-menu">
              <span className="user-greeting">Hola, {user?.nombre}</span>
            </div>
          </div>
        </header>

        <main className="content-area">
          <div className="container animate-fade">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
