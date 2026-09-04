import { Link } from 'react-router-dom';
import { BrandLogo } from '../components/common/Icons';
import './AuthLayout.css';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="auth-layout">
      <div className="auth-container animate-fade">
        <div className="auth-header">
          <Link to="/" className="brand-link justify-center">
            <BrandLogo size={36} />
          </Link>
          {title && <h1 className="auth-title mt-4">{title}</h1>}
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        </div>

        <div className="auth-content">{children}</div>
      </div>
    </div>
  );
}
