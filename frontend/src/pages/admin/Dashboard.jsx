import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { reporteService } from '../../services';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';

export default function DashboardAdmin() {
  const { user } = useAuth();
  const [reportes, setReportes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReportes() {
      try {
        const res = await reporteService.get();
        setReportes(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadReportes();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-header">
        <h1>Panel de Administración APE</h1>
        <p>Hola, {user.nombre} ({user.rol}). Visualiza y gestiona las estadísticas de la plataforma.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-t-4 border-t-primary">
          <Card.Body>
            <p className="text-secondary text-sm font-bold uppercase tracking-wider mb-1">Aprendices</p>
            <h3 className="text-4xl font-extrabold">{reportes?.total_aprendices || 0}</h3>
          </Card.Body>
        </Card>

        <Card className="border-t-4 border-t-blue">
          <Card.Body>
            <p className="text-secondary text-sm font-bold uppercase tracking-wider mb-1">Empresas Aprobadas</p>
            <h3 className="text-4xl font-extrabold">{reportes?.total_empresas || 0}</h3>
          </Card.Body>
        </Card>
        
        <Card className="border-t-4 border-t-purple">
          <Card.Body>
            <p className="text-secondary text-sm font-bold uppercase tracking-wider mb-1">Vacantes Activas</p>
            <h3 className="text-4xl font-extrabold">{reportes?.vacantes_activas || 0}</h3>
          </Card.Body>
        </Card>

        <Card className="border-t-4 border-t-warning">
          <Card.Body>
            <p className="text-secondary text-sm font-bold uppercase tracking-wider mb-1">Total Postulaciones</p>
            <h3 className="text-4xl font-extrabold">{reportes?.total_postulaciones || 0}</h3>
          </Card.Body>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <Card.Header>
            <h3 className="font-bold">Accesos de Gestión</h3>
          </Card.Header>
          <Card.Body className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/admin/usuarios" className="btn btn-ghost border border-border h-24 flex flex-col justify-center gap-2 text-center">
              <span className="text-2xl">👥</span>
              <span>Usuarios</span>
            </Link>
            <Link to="/admin/empresas" className="btn btn-ghost border border-border h-24 flex flex-col justify-center gap-2 text-center">
              <span className="text-2xl">🏢</span>
              <span>Empresas</span>
            </Link>
            <Link to="/admin/vacantes" className="btn btn-ghost border border-border h-24 flex flex-col justify-center gap-2 text-center">
              <span className="text-2xl">💼</span>
              <span>Vacantes</span>
            </Link>
            <Link to="/admin/reportes" className="btn btn-primary h-24 flex flex-col justify-center gap-2 text-center">
              <span className="text-2xl">📈</span>
              <span>Ver Reportes</span>
            </Link>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="font-bold">Información del Sistema</h3>
          </Card.Header>
          <Card.Body>
            <ul className="flex flex-col gap-4">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <div>
                  <p className="font-medium">API Server</p>
                  <p className="text-xs text-secondary">En línea - v1.0.0</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <div>
                  <p className="font-medium">Base de Datos MySQL</p>
                  <p className="text-xs text-secondary">En línea - Conectada</p>
                </div>
              </li>
            </ul>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
