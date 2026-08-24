import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, empresaService, userService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

export default function Register({ isEmpresa = false }) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [programas, setProgramas] = useState([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEmpresa) {
      userService.getProgramas()
        .then(res => { if (res.data.success) setProgramas(res.data.data); })
        .catch(console.error);
    }
  }, [isEmpresa]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Basic validation
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
      setError(err.response?.data?.message || 'Error en el registro. Verifica los datos.');
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
              <Input label="Nombre" name="nombre" required placeholder="Ej: Juan" />
              <Input label="Apellido" name="apellido" required placeholder="Ej: Pérez" />
            </div>
            <div className="form-row">
              <Input label="Tipo y Número de Documento" name="documento" required placeholder="CC 123456789" />
              <Input label="Teléfono" name="telefono" type="tel" placeholder="Opcional" />
            </div>
            <Input label="Programa de Formación SENA" name="programa_formacion_id" type="select">
              <option value="">Selecciona tu programa...</option>
              {programas.map(p => (
                <option key={p.id} value={p.id}>{p.nombre} ({p.nivel})</option>
              ))}
            </Input>
          </>
        ) : (
          <>
            <Input label="Razón Social" name="razon_social" required placeholder="Nombre legal de la empresa" />
            <div className="form-row">
              <Input label="NIT" name="nit" required placeholder="123456789-0" />
              <Input label="Ciudad" name="ciudad" required placeholder="Ej: Bogotá" />
            </div>
            <div className="form-row">
              <Input label="Teléfono" name="telefono" required />
              <Input label="Sector" name="sector" placeholder="Ej: Tecnología" />
            </div>
            <Input label="Correo Corporativo (opcional)" name="correo_empresa" type="email" hint="Si es diferente al correo de inicio de sesión" />
          </>
        )}

        <div className="divider"></div>
        <p className="text-sm font-semibold mb-2">Datos de acceso</p>

        <Input 
          label="Correo electrónico para login" 
          name="correo" 
          type="email" 
          required 
          placeholder={isEmpresa ? "contacto@empresa.com" : "correo@misena.edu.co"}
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
          />
        </div>
        
        <div className="mt-6">
          <Button type="submit" fullWidth isLoading={isLoading}>
            Crear cuenta {isEmpresa ? 'empresarial' : 'de aprendiz'}
          </Button>
        </div>
      </form>
      
      <div className="auth-links mt-6">
        <p>¿Ya tienes una cuenta? <Link to="/login" className="text-primary font-medium hover:underline">Inicia sesión aquí</Link></p>
      </div>
    </>
  );
}
