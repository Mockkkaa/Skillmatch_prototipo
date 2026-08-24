import { useState, useEffect } from 'react';
import { userService } from '../../services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadUsuarios();
  }, []);

  async function loadUsuarios() {
    try {
      const res = await userService.list();
      setUsuarios(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleActivo = async (id, isActivo) => {
    if (!window.confirm(`¿${isActivo ? 'Desactivar' : 'Activar'} este usuario?`)) return;
    try {
      if (isActivo) {
        await userService.desactivar(id);
      } else {
        await userService.activar(id);
      }
      setMessage({ type: 'success', text: `Usuario ${isActivo ? 'desactivado' : 'activado'} correctamente.` });
      loadUsuarios();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al cambiar el estado del usuario.' });
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-header">
        <h1>Gestión de Usuarios</h1>
        <p>Administración general de usuarios del sistema</p>
      </div>

      {message && <Alert variant={message.type} className="mb-6">{message.text}</Alert>}

      <Card>
        <Card.Body className="p-0">
          <div className="table-container border-0 rounded-none">
            <table className="table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Registro</th>
                  <th>Estado</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id}>
                    <td>
                      <p className="font-bold">{u.nombre} {u.apellido || ''}</p>
                      <p className="text-sm text-secondary">{u.correo}</p>
                    </td>
                    <td>
                      <Badge variant={u.rol === 'ADMINISTRADOR' ? 'purple' : u.rol === 'EMPRESA' ? 'blue' : 'gray'}>
                        {u.rol}
                      </Badge>
                    </td>
                    <td>{new Date(u.creado_en).toLocaleDateString()}</td>
                    <td>
                      <Badge variant={u.activo ? 'success' : 'error'}>
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="text-right">
                      {u.rol !== 'ADMINISTRADOR' && (
                        <Button 
                          variant={u.activo ? 'ghost' : 'secondary'} 
                          size="sm" 
                          onClick={() => handleToggleActivo(u.id, u.activo)}
                        >
                          {u.activo ? 'Desactivar' : 'Activar'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
