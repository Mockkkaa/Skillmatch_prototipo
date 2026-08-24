import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
            <Link to="/" className="brand">
              <span className="brand-icon">⚡</span>
              <span className="brand-name">SkillMatch</span>
            </Link>

            <nav className={`public-nav ${mobileOpen ? 'open' : ''}`}>
              <Link to="/" className="nav-link">Inicio</Link>
              <Link to="/ofertas" className="nav-link">Ofertas laborales</Link>
              <a href="#como-funciona" className="nav-link">Cómo funciona</a>
              <a href="#para-empresas" className="nav-link">Para empresas</a>
            </nav>

            <div className="public-header-actions">
              <Link to="/login" className="btn btn-ghost btn-sm">Iniciar sesión</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Registrarme</Link>
            </div>

            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Abrir menú"
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="public-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="brand">
                <span className="brand-icon">⚡</span>
                <span className="brand-name">SkillMatch</span>
              </div>
              <p>Conectando el talento de los aprendices del SENA con oportunidades laborales reales.</p>
            </div>
            <div className="footer-links">
              <h4>Plataforma</h4>
              <Link to="/ofertas">Ofertas laborales</Link>
              <Link to="/register">Registrarse</Link>
              <Link to="/login">Iniciar sesión</Link>
            </div>
            <div className="footer-links">
              <h4>Empresas</h4>
              <Link to="/register-empresa">Publicar vacante</Link>
              <Link to="/register-empresa">Registro empresarial</Link>
            </div>
            <div className="footer-links">
              <h4>Contacto</h4>
              <span>info@skillmatch.co</span>
              <span>Bogotá, Colombia</span>
              <span>SENA / APE</span>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} SkillMatch. Proyecto académico SENA.</span>
            <span>Desarrollado por Aprendices SENA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
