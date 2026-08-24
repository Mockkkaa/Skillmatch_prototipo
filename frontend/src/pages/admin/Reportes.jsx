import { useState, useEffect } from 'react';
import { reporteService } from '../../services';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';

export default function ReportesAdmin() {
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
        <h1>Reportes y Estadísticas</h1>
        <p>Métricas detalladas sobre el uso de la plataforma SkillMatch</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <Card.Header>
            <h3 className="font-bold">Métricas Principales</h3>
          </Card.Header>
          <Card.Body>
            <ul className="flex flex-col gap-4">
              <li className="flex justify-between items-center py-2 border-b border-border-light">
                <span className="text-secondary">Total Aprendices Registrados</span>
                <span className="font-bold text-xl">{reportes?.total_aprendices || 0}</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-border-light">
                <span className="text-secondary">Total Empresas Aprobadas</span>
                <span className="font-bold text-xl">{reportes?.total_empresas || 0}</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-border-light">
                <span className="text-secondary">Vacantes Activas</span>
                <span className="font-bold text-xl text-primary">{reportes?.vacantes_activas || 0}</span>
              </li>
              <li className="flex justify-between items-center py-2">
                <span className="text-secondary">Total de Postulaciones</span>
                <span className="font-bold text-xl text-blue">{reportes?.total_postulaciones || 0}</span>
              </li>
            </ul>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="font-bold">Rendimiento</h3>
          </Card.Header>
          <Card.Body className="flex flex-col items-center justify-center h-full min-h-[200px]">
            <div className="text-center">
              <p className="text-sm text-secondary mb-2">Promedio de Postulaciones por Vacante</p>
              <h2 className="text-5xl font-extrabold text-purple">
                {reportes?.vacantes_activas ? (reportes.total_postulaciones / reportes.vacantes_activas).toFixed(1) : 0}
              </h2>
            </div>
            
            <div className="w-full mt-8 flex flex-col gap-2">
              <p className="text-xs font-bold text-secondary uppercase tracking-wider">Estado del Sistema</p>
              <div className="bg-surface-2 p-4 rounded-lg flex items-center justify-between">
                <span>Base de Datos</span>
                <span className="text-success font-bold flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-success"></div> Saludable</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
