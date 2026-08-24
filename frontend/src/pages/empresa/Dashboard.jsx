import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { empresaService, vacanteService } from '../../services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';

export default function DashboardEmpresa() {
  const { user } = useAuth();
  const [data, setData] = useState({
    empresa: null,
    vacantes: [],
    estadisticas: { activas: 0, postulaciones: 0, contratados: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [empRes, vacRes] = await Promise.all([
          empresaService.miEmpresa(),
          vacanteService.misVacantes()
        ]);
        
        const vacantes = vacRes.data.data || [];
        
        // Calcular estadísticas básicas
        let activas = 0;
        let postulaciones = 0;
        
        vacantes.forEach(v => {
          if (v.estado === 'ABIERTA') activas++;
          postulaciones += (v.postulaciones_count || 0);
        });

        setData({
          empresa: empRes.data.data,
          vacantes: vacantes.slice(0, 5), // Show 5 recent
          estadisticas: { activas, postulaciones, contratados: 0 }
        });
      } catch (error) {
        console.error("Error loading dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) return <Loading fullPage={false} />;

  const emp = data.empresa;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard Empresarial</h1>
        <p>Bienvenido, {emp?.razon_social || user?.nombre}</p>
      </div>

      {emp?.estado === 'PENDIENTE' && (
        <Alert variant="warning" className="mb-6">
          Tu cuenta de empresa está en revisión por parte de la Agencia Pública de Empleo (APE). No podrás publicar vacantes hasta que sea aprobada.
        </Alert>
      )}

      {emp?.estado === 'RECHAZADA' && (
        <Alert variant="error" className="mb-6">
          Tu registro de empresa ha sido rechazado. Por favor contacta a la APE para más información.
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-t-4 border-t-primary">
          <Card.Body>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-secondary text-sm font-bold uppercase tracking-wider mb-1">Vacantes Activas</p>
                <h3 className="text-3xl font-extrabold">{data.estadisticas.activas}</h3>
              </div>
              <div className="text-3xl">💼</div>
            </div>
          </Card.Body>
        </Card>

        <Card className="border-t-4 border-t-blue">
          <Card.Body>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-secondary text-sm font-bold uppercase tracking-wider mb-1">Postulaciones</p>
                <h3 className="text-3xl font-extrabold">{data.estadisticas.postulaciones}</h3>
              </div>
              <div className="text-3xl">👥</div>
            </div>
          </Card.Body>
        </Card>
        
        <Card className="border-t-4 border-t-purple">
          <Card.Body>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-secondary text-sm font-bold uppercase tracking-wider mb-1">Perfil Empresa</p>
                <div className="mt-2">
                  <Badge variant={emp?.estado === 'APROBADA' ? 'success' : emp?.estado === 'PENDIENTE' ? 'warning' : 'error'}>
                    {emp?.estado}
                  </Badge>
                </div>
              </div>
              <div className="text-3xl">🏢</div>
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <Card.Header className="flex justify-between items-center">
              <h3 className="font-bold">Tus Vacantes Recientes</h3>
              <Link to="/empresa/vacantes" className="text-primary text-sm font-medium hover:underline">Ver todas</Link>
            </Card.Header>
            <Card.Body className="p-0">
              {data.vacantes.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-secondary mb-4">Aún no has publicado ninguna vacante.</p>
                  <Link to="/empresa/vacantes/nueva">
                    <Button disabled={emp?.estado !== 'APROBADA'}>Publicar mi primera vacante</Button>
                  </Link>
                </div>
              ) : (
                <div className="table-container border-0 rounded-none">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Cargo</th>
                        <th>Estado</th>
                        <th>Postulados</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.vacantes.map(vac => (
                        <tr key={vac.id}>
                          <td className="font-medium text-blue">{vac.cargo}</td>
                          <td>
                            <Badge variant={vac.estado === 'ABIERTA' ? 'success' : 'gray'}>
                              {vac.estado}
                            </Badge>
                          </td>
                          <td className="text-center font-bold">{vac.postulaciones_count || 0}</td>
                          <td>{new Date(vac.fecha_publicacion).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <Card.Header>
              <h3 className="font-bold">Accesos Rápidos</h3>
            </Card.Header>
            <Card.Body className="flex flex-col gap-3">
              <Link to="/empresa/vacantes/nueva" className="btn btn-primary justify-start">
                <span>➕</span> Publicar Nueva Vacante
              </Link>
              <Link to="/empresa/postulaciones" className="btn btn-ghost border border-border justify-start">
                <span>👥</span> Revisar Postulaciones
              </Link>
              <Link to="/empresa/perfil" className="btn btn-ghost border border-border justify-start">
                <span>🏢</span> Actualizar Perfil Empresarial
              </Link>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
