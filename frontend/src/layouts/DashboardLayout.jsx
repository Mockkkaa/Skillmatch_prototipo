import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BrandLogo,
  IconDashboard,
  IconBriefcase,
  IconPostulacion,
  IconUser,
  IconResume,
  IconGraduation,
  IconBuilding,
  IconUsers,
  IconChart,
  IconLogout
} from '../components/common/Icons';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import NotificationDropdown from '../components/common/NotificationDropdown';
import './DashboardLayout.css';

export default function DashboardLayout({ children }) {
  const { user, logout, isAprendiz, isEmpresa, isAdmin, isFuncionario } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ to, icon, label }) => {
    const active =
      location.pathname === to ||
      (to !== '/dashboard' && to !== '/admin' && to !== '/empresa' && location.pathname.startsWith(to));

    return (
      <Link to={to} className={`nav-item ${active ? 'active' : ''}`}>
        <span className="nav-icon">{icon}</span>
        <span className="nav-label">{label}</span>
      </Link>
    );
  };

  // Get current section name for breadcrumb
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Panel del Aprendiz';
    if (path.startsWith('/perfil')) return 'Información Personal';
    if (path.startsWith('/hoja-de-vida')) return 'Hoja de Vida';
    if (path.startsWith('/formacion')) return 'Formación Académica';
    if (path.startsWith('/experiencia')) return 'Experiencia Laboral';
    if (path.startsWith('/postulaciones')) return 'Mis Postulaciones';
    if (path.startsWith('/ofertas')) return 'Ofertas Laborales';
    if (path === '/empresa') return 'Panel de Empresa';
    if (path.startsWith('/empresa/vacantes')) return 'Gestión de Vacantes';
    if (path.startsWith('/empresa/postulaciones')) return 'Postulaciones Recibidas';
    if (path.startsWith('/empresa/perfil')) return 'Perfil Empresarial';
    if (path === '/admin') return 'Panel de Administración';
    if (path.startsWith('/admin/usuarios')) return 'Usuarios y Roles';
    if (path.startsWith('/admin/empresas')) return 'Aprobación de Empresas';
    if (path.startsWith('/admin/vacantes')) return 'Supervisión de Vacantes';
    if (path.startsWith('/admin/reportes')) return 'Reportes y Métricas';
    return 'SkillMatch';
  };

  const getRoleLabel = () => {
    if (isAprendiz()) return 'Aprendiz SENA';
    if (isEmpresa()) return 'Empresa Aliada';
    if (isAdmin()) return 'Administrador';
    if (isFuncionario()) return 'Funcionario SENA';
    return user?.rol || 'Usuario';
  };

  return (
    <div className="dashboard-layout">
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Dark Navy Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand-link">
            <BrandLogo size={32} textClass="sidebar-brand-text" />
          </Link>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú">
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {isAprendiz() && (
            <>
              <div className="nav-section">Principal</div>
              <NavItem to="/dashboard" icon={<IconDashboard />} label="Dashboard" />
              <NavItem to="/ofertas" icon={<IconBriefcase />} label="Buscar Ofertas" />
              <NavItem to="/postulaciones" icon={<IconPostulacion />} label="Mis Postulaciones" />

              <div className="nav-section mt-4">Mi Hoja de Vida</div>
              <NavItem to="/perfil" icon={<IconUser />} label="Información Personal" />
              <NavItem to="/hoja-de-vida" icon={<IconResume />} label="Vista Previa CV" />
              <NavItem to="/formacion" icon={<IconGraduation />} label="Formación Académica" />
              <NavItem to="/experiencia" icon={<IconBuilding />} label="Experiencia Laboral" />
            </>
          )}

          {isEmpresa() && (
            <>
              <div className="nav-section">Principal</div>
              <NavItem to="/empresa" icon={<IconDashboard />} label="Dashboard" />
              <NavItem to="/empresa/vacantes" icon={<IconBriefcase />} label="Mis Vacantes" />
              <NavItem to="/empresa/postulaciones" icon={<IconUsers />} label="Postulaciones" />

              <div className="nav-section mt-4">Organización</div>
              <NavItem to="/empresa/perfil" icon={<IconBuilding />} label="Perfil Empresarial" />
            </>
          )}

          {(isAdmin() || isFuncionario()) && (
            <>
              <div className="nav-section">Administración</div>
              <NavItem to="/admin" icon={<IconDashboard />} label="Dashboard General" />
              <NavItem to="/admin/reportes" icon={<IconChart />} label="Reportes" />

              <div className="nav-section mt-4">Gestión de Plataforma</div>
              {isAdmin() && <NavItem to="/admin/usuarios" icon={<IconUsers />} label="Usuarios y Roles" />}
              <NavItem to="/admin/empresas" icon={<IconBuilding />} label="Aprobación Empresas" />
              <NavItem to="/admin/vacantes" icon={<IconBriefcase />} label="Todas las Vacantes" />
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-mini-profile">
            <Avatar
              name={user?.nombre || 'Usuario'}
              size="sm"
            />
            <div className="user-mini-info">
              <span className="user-mini-name">{user?.nombre || 'Usuario'}</span>
              <span className="user-mini-role">{getRoleLabel()}</span>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout} title="Cerrar sesión">
            <IconLogout size={16} />
            <span className="nav-label">Salir</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir navegación"
            >
              <span></span><span></span><span></span>
            </button>
            <div className="header-breadcrumb">
              <span className="breadcrumb-root">Plataforma</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{getPageTitle()}</span>
            </div>
          </div>

          <div className="header-right">
            <NotificationDropdown />
            <Badge variant="primary" className="header-role-badge">
              {getRoleLabel()}
            </Badge>
            <div className="user-profile-header">
              <Avatar name={user?.nombre || 'U'} size="sm" />
              <span className="user-greeting-name">{user?.nombre?.split(' ')[0]}</span>
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
