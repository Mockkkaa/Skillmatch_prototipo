import { Link } from 'react-router-dom';
import './AuthLayout.css';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="auth-layout">
      <div className="auth-container animate-fade">
        <div className="auth-header">
          <Link to="/" className="brand justify-center">
            <span className="brand-icon">⚡</span>
            <span className="brand-name">SkillMatch</span>
          </Link>
          {title && <h1 className="auth-title mt-6">{title}</h1>}
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        </div>
        
        <div className="auth-content">
          {children}
        </div>
      </div>
    </div>
  );
}
