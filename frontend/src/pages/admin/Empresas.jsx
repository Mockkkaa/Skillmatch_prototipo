import { useState, useEffect } from 'react';
import { empresaService } from '../../services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';

export default function EmpresasAdmin() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadEmpresas();
  }, []);

  async function loadEmpresas() {
    try {
      const res = await empresaService.list();
      setEmpresas(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleAprobar = async (id, razonSocial) => {
    if (!window.confirm(`¿Aprobar empresa ${razonSocial}?`)) return;
    try {
      await empresaService.aprobar(id);
      setMessage({ type: 'success', text: `Empresa ${razonSocial} aprobada correctamente.` });
      loadEmpresas();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al aprobar empresa.' });
    }
  };

  const handleRechazar = async (id, razonSocial) => {
    const motivo = window.prompt(`Motivo de rechazo para ${razonSocial}:`);
    if (motivo === null) return;
    
    try {
      await empresaService.rechazar(id, { observaciones: motivo });
      setMessage({ type: 'success', text: `Empresa ${razonSocial} rechazada.` });
      loadEmpresas();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al rechazar empresa.' });
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-header">
        <h1>Gestión de Empresas</h1>
        <p>Aprobar, rechazar o administrar empresas registradas en la plataforma.</p>
      </div>

      {message && <Alert variant={message.type} className="mb-6">{message.text}</Alert>}

      <Card>
        <Card.Body className="p-0">
          <div className="table-container border-0 rounded-none">
            <table className="table">
              <thead>
                <tr>
                  <th>Razón Social</th>
                  <th>NIT</th>
                  <th>Contacto</th>
                  <th>Estado</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empresas.map(emp => (
                  <tr key={emp.id}>
                    <td>
                      <p className="font-bold">{emp.razon_social}</p>
                      <p className="text-xs text-secondary">{emp.sector || 'Sin sector'}</p>
                    </td>
                    <td>{emp.nit}</td>
                    <td>
                      <p className="text-sm">{emp.correo_empresa || emp.correo}</p>
                      <p className="text-xs text-secondary">{emp.telefono}</p>
                    </td>
                    <td>
                      <Badge variant={emp.estado === 'APROBADA' ? 'success' : emp.estado === 'PENDIENTE' ? 'warning' : 'error'}>
                        {emp.estado}
                      </Badge>
                    </td>
                    <td className="text-right">
                      {emp.estado === 'PENDIENTE' && (
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" onClick={() => handleAprobar(emp.id, emp.razon_social)}>Aprobar</Button>
                          <Button size="sm" variant="danger" onClick={() => handleRechazar(emp.id, emp.razon_social)}>Rechazar</Button>
                        </div>
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
