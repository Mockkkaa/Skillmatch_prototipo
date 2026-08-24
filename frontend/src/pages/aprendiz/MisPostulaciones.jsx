import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postulacionService } from '../../services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';

export default function MisPostulaciones() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPostulaciones() {
      try {
        const res = await postulacionService.list();
        setPostulaciones(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadPostulaciones();
  }, []);

  if (loading) return <Loading />;

  const getBadgeForEstado = (estado) => {
    const map = {
      'ENVIADA': 'blue',
      'EN_REVISION': 'warning',
      'PRESELECCIONADO': 'purple',
      'RECHAZADO': 'error',
      'FINALIZADO': 'success'
    };
    return map[estado] || 'gray';
  };

  const getEstadoDescription = (estado) => {
    const map = {
      'ENVIADA': 'La empresa ha recibido tu hoja de vida.',
      'EN_REVISION': 'La empresa está evaluando tu perfil profesional.',
      'PRESELECCIONADO': '¡Felicidades! La empresa se comunicará contigo pronto.',
      'RECHAZADO': 'Tu perfil no fue seleccionado en esta ocasión. ¡Sigue intentando!',
      'FINALIZADO': 'El proceso de selección para esta vacante ha concluido.'
    };
    return map[estado] || '';
  };

  return (
    <div>
      <div className="page-header">
        <h1>Mis Postulaciones</h1>
        <p>Haz seguimiento al estado de tus procesos de selección activos</p>
      </div>

      {postulaciones.length === 0 ? (
        <EmptyState 
          icon="📝"
          title="Aún no te has postulado"
          description="Explora las vacantes disponibles y postúlate a las que mejor se adapten a tu perfil."
          action={<Link to="/ofertas" className="btn btn-primary">Ver Ofertas Laborales</Link>}
        />
      ) : (
        <div className="flex flex-col gap-6">
          {postulaciones.map(post => (
            <Card key={post.id}>
              <Card.Body className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-blue">{post.cargo}</h3>
                      <span className="text-sm text-secondary">
                        Postulado el {new Date(post.fecha_postulacion).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-lg text-primary font-medium mb-4">{post.empresa}</p>
                    
                    <div className="bg-surface-2 p-4 rounded-lg flex flex-col sm:flex-row items-center gap-4 mt-4">
                      <div className="flex-shrink-0">
                        <Badge variant={getBadgeForEstado(post.estado)} className="text-sm py-1 px-3">
                          {post.estado.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="text-sm text-secondary">
                        {getEstadoDescription(post.estado)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center items-end gap-3 min-w-[150px]">
                    <Link to={`/ofertas/${post.vacante_id}`}>
                      <Button variant="secondary" size="sm" fullWidth>Ver Vacante</Button>
                    </Link>
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
