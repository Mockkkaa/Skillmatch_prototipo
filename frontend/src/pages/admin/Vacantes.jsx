import { useState, useEffect } from 'react';
import { vacanteService } from '../../services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

export default function VacantesAdmin() {
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadVacantes();
  }, []);

  async function loadVacantes() {
    try {
      const res = await vacanteService.list({}); // All vacantes
      setVacantes(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta vacante de forma permanente (Administrador)?')) return;
    try {
      await vacanteService.delete(id);
      setMessage({ type: 'success', text: 'Vacante eliminada.' });
      loadVacantes();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al eliminar vacante.' });
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-header">
        <h1>Gestión Global de Vacantes</h1>
        <p>Monitorea y modera todas las ofertas publicadas en la plataforma</p>
      </div>

      {message && <Alert variant={message.type} className="mb-6">{message.text}</Alert>}

      <Card>
        <Card.Body className="p-0">
          <div className="table-container border-0 rounded-none">
            <table className="table">
              <thead>
                <tr>
                  <th>Cargo</th>
                  <th>Empresa</th>
                  <th>Estado</th>
                  <th>Fecha Pub.</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vacantes.map(vac => (
                  <tr key={vac.id}>
                    <td>
                      <p className="font-bold text-blue">{vac.cargo}</p>
                      <p className="text-xs text-secondary">{vac.ubicacion}</p>
                    </td>
                    <td>{vac.empresa}</td>
                    <td>
                      <Badge variant={vac.estado === 'ABIERTA' ? 'success' : 'gray'}>
                        {vac.estado}
                      </Badge>
                    </td>
                    <td>{new Date(vac.fecha_publicacion).toLocaleDateString()}</td>
                    <td className="text-right">
                      <Button variant="danger" size="sm" onClick={() => handleDelete(vac.id)}>Eliminar</Button>
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
