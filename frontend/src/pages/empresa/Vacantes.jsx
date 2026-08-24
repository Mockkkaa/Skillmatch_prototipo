import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { vacanteService } from '../../services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

export default function Vacantes() {
  const { user } = useAuth();
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadVacantes();
  }, []);

  async function loadVacantes() {
    try {
      const res = await vacanteService.misVacantes();
      setVacantes(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleEstado = async (id, estadoActual) => {
    if (!window.confirm(`¿Seguro que deseas ${estadoActual === 'ABIERTA' ? 'cerrar' : 'abrir'} esta vacante?`)) return;
    
    try {
      const nuevoEstado = estadoActual === 'ABIERTA' ? 'CERRADA' : 'ABIERTA';
      await vacanteService.update(id, { estado: nuevoEstado });
      setMessage({ type: 'success', text: `Vacante ${nuevoEstado.toLowerCase()} correctamente.` });
      loadVacantes();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al cambiar el estado de la vacante.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta vacante de forma permanente?')) return;
    
    try {
      await vacanteService.delete(id);
      setMessage({ type: 'success', text: 'Vacante eliminada correctamente.' });
      loadVacantes();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al eliminar la vacante. Es posible que ya tenga postulaciones.' });
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Mis Vacantes</h1>
          <p>Gestiona las ofertas laborales de tu empresa</p>
        </div>
        <Link to="/empresa/vacantes/nueva">
          <Button>+ Publicar Vacante</Button>
        </Link>
      </div>

      {message && <Alert variant={message.type} className="mb-6">{message.text}</Alert>}

      {vacantes.length === 0 ? (
        <EmptyState 
          icon="💼"
          title="No tienes vacantes publicadas"
          description="Publica tu primera vacante para empezar a recibir postulaciones de aprendices SENA."
          action={<Link to="/empresa/vacantes/nueva" className="btn btn-primary">Publicar Vacante</Link>}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {vacantes.map(vac => (
            <Card key={vac.id}>
              <Card.Body className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-blue">{vac.cargo}</h3>
                      <Badge variant={vac.estado === 'ABIERTA' ? 'success' : 'gray'}>
                        {vac.estado}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-secondary mb-4">
                      <span>📍 {vac.ubicacion}</span>
                      <span>•</span>
                      <span>📅 {new Date(vac.fecha_publicacion).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>👥 {vac.postulaciones_count || 0} postulados</span>
                    </div>

                    <div className="flex gap-2">
                      <Badge variant="blue">{vac.modalidad}</Badge>
                      <Badge variant="purple">{vac.tipo_contrato.replace('_', ' ')}</Badge>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center gap-2 min-w-[160px]">
                    <Link to={`/empresa/vacantes/${vac.id}`}>
                      <Button variant="ghost" size="sm" fullWidth>✏️ Editar</Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      fullWidth 
                      onClick={() => handleToggleEstado(vac.id, vac.estado)}
                    >
                      {vac.estado === 'ABIERTA' ? '🔒 Cerrar Vacante' : '🔓 Abrir Vacante'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      fullWidth 
                      className="text-error"
                      onClick={() => handleDelete(vac.id)}
                    >
                      🗑️ Eliminar
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
