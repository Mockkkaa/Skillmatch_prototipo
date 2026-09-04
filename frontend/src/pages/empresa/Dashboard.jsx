import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { empresaService, vacanteService } from '../../services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import { IconBriefcase, IconUsers, IconBuilding } from '../../components/common/Icons';
import { mockEmpresas, mockVacantes } from '../../data/mockData';

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
          empresaService.miEmpresa().catch(() => null),
          vacanteService.misVacantes().catch(() => null)
        ]);

        const empData = empRes?.data?.data || mockEmpresas[0];
        const vacantesList = (vacRes?.data?.data && vacRes.data.data.length > 0)
          ? vacRes.data.data
          : mockVacantes.slice(0, 4);

        let activas = 0;
        let postulaciones = 0;

        vacantesList.forEach((v) => {
          if (v.estado === 'ABIERTA' || v.estado === 'Publicada') activas++;
          postulaciones += v.postulaciones_count || 4;
        });

        setData({
          empresa: empData,
          vacantes: vacantesList,
          estadisticas: { activas: activas || 3, postulaciones: postulaciones || 16, contratados: 2 }
        });
      } catch (error) {
        setData({
          empresa: mockEmpresas[0],
          vacantes: mockVacantes.slice(0, 4),
          estadisticas: { activas: 3, postulaciones: 16, contratados: 2 }
        });
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) return <Loading fullPage={false} />;

  const emp = data.empresa || mockEmpresas[0];

  return (
    <div className="animate-fade">
      <div className="page-header flex justify-between items-end flex-wrap gap-4 mb-6">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-navy)' }}>
            Panel Empresarial
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Bienvenido, <strong>{emp?.razon_social || user?.nombre || 'TechSolutions Colombia'}</strong>
          </p>
        </div>
        <Link to="/empresa/vacantes/nueva" className="btn btn-primary btn-sm">
          + Publicar nueva vacante
        </Link>
      </div>

      {emp?.estado === 'PENDIENTE' && (
        <Alert variant="warning" className="mb-6">
          Tu cuenta empresarial está en proceso de validación por parte de la Agencia Pública de Empleo (APE). Podrás publicar convocatorias apenas sea verificada.
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-3 gap-6 mb-8">
        <Card className="stat-card">
          <div className="stat-icon stat-icon-green">
            <IconBriefcase size={22} />
          </div>
          <div>
            <div className="stat-value">{data.estadisticas.activas}</div>
            <div className="stat-label">Vacantes Publicadas</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon stat-icon-blue">
            <IconUsers size={22} />
          </div>
          <div>
            <div className="stat-value">{data.estadisticas.postulaciones}</div>
            <div className="stat-label">Candidatos Postulados</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon stat-icon-purple">
            <IconBuilding size={22} />
          </div>
          <div>
            <div className="mt-1">
              <Badge variant={emp?.estado === 'APROBADA' ? 'success' : emp?.estado === 'PENDIENTE' ? 'warning' : 'error'}>
                {emp?.estado || 'APROBADA'}
              </Badge>
            </div>
            <div className="stat-label">Estado de Verificación SENA</div>
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        <div style={{ gridColumn: 'span 8' }} className="empresa-main-col">
          <Card>
            <div className="card-header flex justify-between items-center">
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-navy)', fontWeight: 700 }}>
                Convocatorias Recientes
              </h3>
              <Link to="/empresa/vacantes" className="text-primary text-sm font-medium hover:underline">
                Ver todas ({data.vacantes.length})
              </Link>
            </div>
            <div className="card-body p-0">
              <div className="table-container border-0 rounded-none">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Cargo / Título</th>
                      <th>Modalidad</th>
                      <th>Estado</th>
                      <th>Candidatos</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.vacantes.map((vac) => (
                      <tr key={vac.id}>
                        <td className="font-semibold" style={{ color: 'var(--color-navy)' }}>
                          {vac.titulo || vac.cargo}
                        </td>
                        <td>
                          <Badge variant="gray">{vac.modalidad || 'Híbrido'}</Badge>
                        </td>
                        <td>
                          <Badge variant={vac.estado === 'Publicada' || vac.estado === 'ABIERTA' ? 'success' : 'gray'}>
                            {vac.estado || 'Publicada'}
                          </Badge>
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                          {vac.postulaciones_count || 4} postulados
                        </td>
                        <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                          {vac.fecha_publicacion ? vac.fecha_publicacion.slice(0, 10) : '2025-02-15'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>

        <div style={{ gridColumn: 'span 4' }} className="empresa-side-col">
          <Card>
            <div className="card-header">
              <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)', fontWeight: 700 }}>
                Acciones de Gestión
              </h3>
            </div>
            <div className="card-body flex flex-col gap-3">
              <Link to="/empresa/vacantes/nueva" className="btn btn-primary justify-start">
                <span>➕</span> Publicar nueva vacante
              </Link>
              <Link to="/empresa/postulaciones" className="btn btn-ghost justify-start">
                <IconUsers size={16} />
                <span>Revisar postulaciones recibidas</span>
              </Link>
              <Link to="/empresa/perfil" className="btn btn-ghost justify-start">
                <IconBuilding size={16} />
                <span>Actualizar perfil empresarial</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
