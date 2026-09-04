import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BrandLogo } from '../components/common/Icons';
import './PublicLayout.css';

export default function PublicLayout({ children }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <div className="public-layout">
      <header className={`public-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="public-header-inner">
            <Link to="/" className="brand-link">
              <BrandLogo size={32} />
            </Link>

            <nav className={`public-nav ${mobileOpen ? 'open' : ''}`}>
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                Inicio
              </Link>
              <Link to="/ofertas" className={`nav-link ${location.pathname.startsWith('/ofertas') ? 'active' : ''}`}>
                Ofertas Laborales
              </Link>
              <a href="/#como-funciona" className="nav-link">
                Cómo Funciona
              </a>
              <a href="/#para-empresas" className="nav-link">
                Para Empresas
              </a>

              {/* Mobile Only Actions inside drawer */}
              <div className="mobile-nav-actions">
                <Link to="/login" className="btn btn-ghost btn-sm btn-full">
                  Iniciar sesión
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm btn-full">
                  Crear perfil
                </Link>
              </div>
            </nav>

            <div className="public-header-actions">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Iniciar sesión
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Crear perfil
              </Link>
            </div>

            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Abrir menú"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="public-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo-wrapper">
                <BrandLogo size={32} textClass="text-white" />
              </div>
              <p className="footer-desc">
                Plataforma oficial de empleabilidad orientada a conectar el talento de los
                aprendices del SENA con oportunidades laborales reales en empresas verificadas.
              </p>
              <div className="footer-badges">
                <span className="footer-sena-pill">SENA • Servicio Nacional de Aprendizaje</span>
              </div>
            </div>

            <div className="footer-links">
              <h4>Aprendices</h4>
              <Link to="/ofertas">Buscar ofertas</Link>
              <Link to="/register">Crear perfil laboral</Link>
              <Link to="/login">Acceso a mi panel</Link>
            </div>

            <div className="footer-links">
              <h4>Empresas</h4>
              <Link to="/register-empresa">Registro empresarial</Link>
              <Link to="/login">Publicar vacantes</Link>
              <a href="#para-empresas">Beneficios de vinculación</a>
            </div>

            <div className="footer-links">
              <h4>Contacto y Soporte</h4>
              <span>soporte@skillmatch.sena.edu.co</span>
              <span>Bogotá D.C., Colombia</span>
              <span>Línea nacional de atención SENA</span>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} SKILLMATCH. Prototipo Académico SENA. Todos los derechos reservados.</span>
            <span>Centro de Servicios y Gestión Empresarial</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
