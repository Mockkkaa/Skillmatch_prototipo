import { useState } from 'react';
import { useForm } from 'react-form-hook';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

export default function Login() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
        
        // Redirect to origin or dashboard based on role
        const from = location.state?.from?.pathname;
        if (from && from !== '/login') {
          navigate(from, { replace: true });
        } else {
          const role = response.data.user.rol;
          if (role === 'ADMINISTRADOR' || role === 'FUNCIONARIO') navigate('/admin');
          else if (role === 'EMPRESA') navigate('/empresa');
          else navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && <Alert variant="error" className="mb-6">{error}</Alert>}
      
      <form onSubmit={handleSubmit}>
        <Input 
          label="Correo electrónico" 
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
      
      <div className="auth-links">
        <p>¿No tienes una cuenta?</p>
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
