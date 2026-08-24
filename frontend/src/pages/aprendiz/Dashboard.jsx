import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { aprendizService, hojaVidaService, postulacionService, vacanteService } from '../../services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({
    aprendiz: null,
    hojaVida: null,
    postulaciones: [],
    recomendadas: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        if (!user?.aprendiz_id) return;
        
        const [hvRes, postRes, vacRes] = await Promise.all([
          hojaVidaService.getByAprendiz(user.aprendiz_id),
          postulacionService.list(),
          vacanteService.list({ limite: 3 })
        ]);
        
        setData({
          aprendiz: hvRes.data.data, // Contains merged aprendiz data
          hojaVida: hvRes.data.data,
          postulaciones: postRes.data.data.slice(0, 3), // Show 3 recent ones
          recomendadas: vacRes.data.data
        });
      } catch (error) {
        console.error("Error loading dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  if (loading) return <Loading fullPage={false} />;

  const pct = data.hojaVida?.porcentaje_completado || 0;
  
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

  return (
    <div>
      <div className="page-header flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1>Dashboard de Aprendiz</h1>
          <p>Bienvenido a tu panel de control, {user?.nombre}</p>
        </div>
      </div>

      <div className="grid grid-3 gap-6 mb-8">
        <Card>
          <Card.Body className="flex flex-col h-full justify-center">
            <h3 className="text-lg font-bold mb-2">Perfil Completado</h3>
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-extrabold text-primary">{pct}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct}%` }}></div>
            </div>
            {pct < 100 && (
              <p className="text-sm text-secondary mt-4">
                Completa tu perfil para tener más oportunidades de ser contactado.
              </p>
            )}
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="flex flex-col items-center text-center py-6">
            <div className="avatar avatar-xl mb-4">
              {user?.foto_perfil ? (
                <img src={`http://localhost:3001${user.foto_perfil}`} alt={user?.nombre} />
              ) : (
                user?.nombre?.charAt(0)
              )}
            </div>
            <h3 className="font-bold">{user?.nombre} {user?.apellido}</h3>
            <p className="text-sm text-secondary mb-1">{data.aprendiz?.programa || 'Programa no definido'}</p>
            <Badge variant="primary" className="mt-2">{data.aprendiz?.estado_formacion || 'SENA'}</Badge>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <h3 className="text-lg font-bold mb-4">Accesos Rápidos</h3>
            <div className="flex flex-col gap-3">
              <Link to="/perfil" className="btn btn-ghost justify-start">👤 Editar mi perfil</Link>
              <Link to="/hoja-de-vida" className="btn btn-ghost justify-start">📄 Ver mi hoja de vida</Link>
              <Link to="/ofertas" className="btn btn-primary justify-start">🔍 Buscar ofertas</Link>
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="grid grid-2 gap-8">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Mis Postulaciones Recientes</h2>
            <Link to="/postulaciones" className="text-primary font-medium hover:underline text-sm">Ver todas</Link>
          </div>
          
          <div className="flex flex-col gap-4">
            {data.postulaciones.length === 0 ? (
              <Card>
                <Card.Body className="text-center py-8">
                  <p className="text-secondary mb-4">Aún no te has postulado a ninguna vacante.</p>
                  <Link to="/ofertas" className="btn btn-primary btn-sm">Explorar Vacantes</Link>
                </Card.Body>
              </Card>
            ) : (
              data.postulaciones.map(post => (
                <Card key={post.id} interactive>
                  <Card.Body className="p-4 flex gap-4 items-center">
                    <div className="avatar avatar-md bg-surface-2 flex-shrink-0">
                      🏢
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold truncate">{post.cargo}</h4>
                      <p className="text-sm text-secondary truncate">{post.empresa}</p>
                    </div>
                    <Badge variant={getBadgeForEstado(post.estado)}>
                      {post.estado.replace('_', ' ')}
                    </Badge>
                  </Card.Body>
                </Card>
              ))
            )}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Ofertas Recomendadas</h2>
            <Link to="/ofertas" className="text-primary font-medium hover:underline text-sm">Ver todas</Link>
          </div>
          
          <div className="flex flex-col gap-4">
            {data.recomendadas.length === 0 ? (
              <p className="text-secondary">No hay ofertas recomendadas en este momento.</p>
            ) : (
              data.recomendadas.map(vac => (
                <Card key={vac.id} interactive>
                  <Link to={`/ofertas/${vac.id}`} className="block text-inherit">
                    <Card.Body className="p-4 flex gap-4 items-center">
                      <div className="flex-1">
                        <h4 className="font-bold mb-1 text-blue">{vac.cargo}</h4>
                        <p className="text-sm text-secondary mb-2">{vac.empresa} • {vac.ubicacion}</p>
                        <div className="flex gap-2">
                          <Badge variant="gray">{vac.modalidad}</Badge>
                          <Badge variant="gray">{vac.tipo_contrato.replace('_', ' ')}</Badge>
                        </div>
                      </div>
                      <div className="text-primary text-xl">
                        ➔
                      </div>
                    </Card.Body>
                  </Link>
                </Card>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
