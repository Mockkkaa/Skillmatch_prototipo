import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { mockUsuarios } from '../../data/mockData';

export default function Login() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDemoLogin = async (role) => {
    setError('');
    setIsLoading(true);

    const creds = {
      aprendiz: { correo: 'santiago.r@misena.edu.co', contrasena: 'Aprendiz2024!' },
      empresa: { correo: 'contacto@techcorp.co', contrasena: 'Empresa2024!' },
      admin: { correo: 'admin@skillmatch.co', contrasena: 'Admin2024!' }
    };

    try {
      const targetCreds = creds[role];
      const response = await authService.login(targetCreds);
      if (response.data.success) {
        login(response.data.token, response.data.user);
        if (role === 'admin') navigate('/admin');
        else if (role === 'empresa') navigate('/empresa');
        else navigate('/dashboard');
        return;
      }
    } catch (err) {
      // Offline fallback if API or DB is unreachable
      let demoUser;
      if (role === 'aprendiz') {
        demoUser = {
          id: 5,
          nombre: 'Santiago Ramírez',
          email: 'santiago.r@misena.edu.co',
          rol: 'APRENDIZ',
          aprendiz_id: 1
        };
        login('mock-jwt-token-aprendiz', demoUser);
        navigate('/dashboard');
      } else if (role === 'empresa') {
        demoUser = {
          id: 10,
          nombre: 'TechCorp Colombia SAS',
          email: 'contacto@techcorp.co',
          rol: 'EMPRESA',
          empresa_id: 1
        };
        login('mock-jwt-token-empresa', demoUser);
        navigate('/empresa');
      } else if (role === 'admin') {
        demoUser = {
          id: 1,
          nombre: 'Carlos Mendoza',
          email: 'admin@skillmatch.co',
          rol: 'ADMINISTRADOR'
        };
        login('mock-jwt-token-admin', demoUser);
        navigate('/admin');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (!data.correo || !data.contrasena) {
      setError('Por favor completa todos los campos.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.login(data);
      if (response.data.success) {
        login(response.data.token, response.data.user);

        const from = location.state?.from?.pathname;
        if (from && from !== '/login') {
          navigate(from, { replace: true });
        } else {
          const role = response.data.user.rol?.toUpperCase();
          if (role === 'ADMINISTRADOR' || role === 'ADMIN' || role === 'FUNCIONARIO') navigate('/admin');
          else if (role === 'EMPRESA') navigate('/empresa');
          else navigate('/dashboard');
        }
      }
    } catch (err) {
      // If backend is not running or failed, inform user and allow demo login
      const isConnectionError = !err.response || err.code === 'ERR_NETWORK';
      if (isConnectionError) {
        setError('El servidor backend no está respondiendo. Puedes usar los accesos rápidos de demostración abajo.');
      } else {
        setError(err.response?.data?.message || 'Credenciales incorrectas. Intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && <Alert variant="error" className="mb-6">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Input
          label="Correo electrónico institucional o corporativo"
          id="correo"
          name="correo"
          type="email"
          placeholder="tu@correo.com"
          required
        />

        <Input
          label="Contraseña"
          id="contrasena"
          name="contrasena"
          type="password"
          placeholder="••••••••"
          required
        />

        <div className="mt-4">
          <Button type="submit" fullWidth isLoading={isLoading}>
            Iniciar sesión
          </Button>
        </div>
      </form>

      {/* Quick Demo Access for evaluation */}
      <div
        style={{
          marginTop: '24px',
          padding: '16px',
          background: 'var(--color-surface-2)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--color-border)'
        }}
      >
        <p
          style={{
            fontSize: 'var(--font-size-xs)',
            fontWeight: 700,
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          Acceso Rápido de Prueba (Modo Prototipo)
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => handleDemoLogin('aprendiz')}
            style={{ fontSize: '11px', padding: '6px 4px' }}
          >
            👨‍🎓 Aprendiz
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => handleDemoLogin('empresa')}
            style={{ fontSize: '11px', padding: '6px 4px' }}
          >
            🏢 Empresa
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => handleDemoLogin('admin')}
            style={{ fontSize: '11px', padding: '6px 4px' }}
          >
            ⚙️ Admin
          </button>
        </div>
      </div>

      <div className="auth-links">
        <p>¿Aún no tienes cuenta en SKILLMATCH?</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link to="/register" className="text-primary font-medium hover:underline">
            Soy Aprendiz
          </Link>
          <span className="text-muted">|</span>
          <Link to="/register-empresa" className="text-primary font-medium hover:underline">
            Soy Empresa
          </Link>
        </div>
      </div>
    </>
  );
}
