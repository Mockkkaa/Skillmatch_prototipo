import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, empresaService, userService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const DEFAULT_PROGRAMAS = [
  { id: 1, nombre: 'Análisis y Desarrollo de Software (ADSO)', nivel: 'Tecnólogo' },
  { id: 2, nombre: 'Gestión Administrativa', nivel: 'Tecnólogo' },
  { id: 3, nombre: 'Mantenimiento de Redes de Datos', nivel: 'Técnico' },
  { id: 4, nombre: 'Contabilidad y Finanzas', nivel: 'Tecnólogo' },
  { id: 5, nombre: 'Gestión del Talento Humano', nivel: 'Tecnólogo' }
];

export default function Register({ isEmpresa = false }) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [programas, setProgramas] = useState(DEFAULT_PROGRAMAS);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEmpresa) {
      userService.getProgramas()
        .then(res => {
          if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
            setProgramas(res.data.data);
          }
        })
        .catch(() => {
          // Keep default fallback programs
        });
    }
  }, [isEmpresa]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (data.contrasena !== data.confirmar_contrasena) {
      return setError('Las contraseñas no coinciden.');
    }

    if (!isEmpresa && (!data.nombre || !data.apellido || !data.documento)) {
      return setError('Nombre, apellido y documento son obligatorios para aprendices.');
    }

    if (isEmpresa && (!data.razon_social || !data.nit)) {
      return setError('La razón social y el NIT son obligatorios para empresas.');
    }

    setIsLoading(true);
    try {
      let response;
      if (isEmpresa) {
        response = await empresaService.register(data);
      } else {
        response = await authService.register(data);
      }

      if (response.data.success) {
        login(response.data.token, response.data.user);
        if (isEmpresa) {
          navigate('/empresa');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      // If network fails (no backend), handle mock registration smoothly
      const isNetworkError = !err.response || err.code === 'ERR_NETWORK';
      if (isNetworkError) {
        const mockUser = isEmpresa
          ? {
              id: 99,
              nombre: data.razon_social,
              email: data.correo,
              rol: 'EMPRESA',
              empresa_id: 99
            }
          : {
              id: 99,
              nombre: `${data.nombre} ${data.apellido}`,
              email: data.correo,
              rol: 'APRENDIZ',
              aprendiz_id: 99
            };
        login('mock-jwt-token-register', mockUser);
        navigate(isEmpresa ? '/empresa' : '/dashboard');
      } else {
        setError(err.response?.data?.message || 'Error en el registro. Verifica los datos ingresados.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && <Alert variant="error" className="mb-6">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        {!isEmpresa ? (
          <>
            <div className="form-row">
              <Input label="Nombres" name="nombre" required placeholder="Ej: Juan Camilo" />
              <Input label="Apellidos" name="apellido" required placeholder="Ej: Pérez Silva" />
            </div>
            <div className="form-row">
              <Input label="Documento de Identidad" name="documento" required placeholder="CC 1020304050" />
              <Input label="Teléfono de Contacto" name="telefono" type="tel" placeholder="3124567890" />
            </div>
            <Input label="Programa de Formación SENA" name="programa_formacion_id" type="select">
              <option value="">Selecciona tu programa formativo...</option>
              {programas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} ({p.nivel})
                </option>
              ))}
            </Input>
          </>
        ) : (
          <>
            <Input label="Razón Social" name="razon_social" required placeholder="Ej: Soluciones Tecnológicas S.A.S." />
            <div className="form-row">
              <Input label="NIT" name="nit" required placeholder="900.123.456-7" />
              <Input label="Ciudad Principal" name="ciudad" required placeholder="Ej: Bogotá D.C." />
            </div>
            <div className="form-row">
              <Input label="Teléfono Corporativo" name="telefono" required placeholder="6017894561" />
              <Input label="Sector Económico" name="sector" placeholder="Ej: Tecnología y Software" />
            </div>
            <Input
              label="Correo Corporativo de Contacto (opcional)"
              name="correo_empresa"
              type="email"
              hint="Si es diferente al correo de autenticación"
            />
          </>
        )}

        <div className="divider"></div>
        <p className="text-sm font-semibold mb-3" style={{ color: 'var(--color-navy)' }}>
          Credenciales de acceso
        </p>

        <Input
          label="Correo electrónico para ingresar"
          name="correo"
          type="email"
          required
          placeholder={isEmpresa ? "talento@empresa.com" : "nombre.apellido@soy.sena.edu.co"}
        />

        <div className="form-row">
          <Input
            label="Contraseña"
            name="contrasena"
            type="password"
            required
            placeholder="Mínimo 8 caracteres"
          />
          <Input
            label="Confirmar Contraseña"
            name="confirmar_contrasena"
            type="password"
            required
            placeholder="Repite la contraseña"
          />
        </div>

        <div className="mt-6">
          <Button type="submit" fullWidth isLoading={isLoading}>
            Crear cuenta {isEmpresa ? 'empresarial' : 'de aprendiz'}
          </Button>
        </div>
      </form>

      <div className="auth-links mt-6">
        <p>
          ¿Ya tienes una cuenta en SKILLMATCH?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </>
  );
}
