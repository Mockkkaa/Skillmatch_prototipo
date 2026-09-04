import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { aprendizService, hojaVidaService, postulacionService, vacanteService } from '../../services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import Avatar from '../../components/common/Avatar';
import { IconBriefcase, IconResume, IconUser, IconPostulacion } from '../../components/common/Icons';
import { mockAprendices, mockPostulaciones, mockVacantes } from '../../data/mockData';

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
        const aprendizId = user?.aprendiz_id || 1;
        const [hvRes, postRes, vacRes] = await Promise.all([
          hojaVidaService.getByAprendiz(aprendizId).catch(() => null),
          postulacionService.list().catch(() => null),
          vacanteService.list({ limite: 3 }).catch(() => null)
        ]);

        const hvData = hvRes?.data?.data || mockAprendices[0];
        const postData = (postRes?.data?.data && postRes.data.data.length > 0)
          ? postRes.data.data.slice(0, 3)
          : mockPostulaciones.slice(0, 3);
        const vacData = (vacRes?.data?.data && vacRes.data.data.length > 0)
          ? vacRes.data.data.slice(0, 3)
          : mockVacantes.slice(0, 3);

        setData({
          aprendiz: hvData,
          hojaVida: hvData,
          postulaciones: postData,
          recomendadas: vacData
        });
      } catch (error) {
        // Safe fallback to mock data
        setData({
          aprendiz: mockAprendices[0],
          hojaVida: mockAprendices[0],
          postulaciones: mockPostulaciones.slice(0, 3),
          recomendadas: mockVacantes.slice(0, 3)
        });
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  if (loading) return <Loading fullPage={false} />;

  const pct = data.hojaVida?.porcentaje_completado || 85;
  const aprendizNombre = data.aprendiz?.nombre_completo || user?.nombre || 'Juan Camilo Pérez';

  const getBadgeForEstado = (estado) => {
    const map = {
      ENVIADA: 'blue',
      EN_REVISION: 'warning',
      PRESELECCIONADO: 'purple',
      RECHAZADO: 'error',
      FINALIZADO: 'success'
    };
    return map[estado] || 'gray';
  };

  return (
    <div className="animate-fade">
      {/* Page Header */}
      <div className="page-header flex justify-between items-end flex-wrap gap-4 mb-6">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-navy)' }}>
            Panel del Aprendiz
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Bienvenido a tu espacio de empleabilidad, <strong>{aprendizNombre}</strong>
          </p>
        </div>
        <Link to="/ofertas" className="btn btn-primary btn-sm">
          <IconBriefcase size={16} />
          <span>Explorar nuevas vacantes</span>
        </Link>
      </div>

      {/* Top Overview Grid */}
      <div className="grid grid-3 gap-6 mb-8">
        {/* Progress Card */}
        <Card>
          <div className="card-body flex flex-col h-full justify-between" style={{ padding: '24px' }}>
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-navy)' }}>
                  Completitud de Hoja de Vida
                </h3>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {pct}%
                </span>
              </div>
              <div className="progress-bar" style={{ height: '10px', marginTop: '8px' }}>
                <div className="progress-fill" style={{ width: `${pct}%` }}></div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '16px' }}>
              {pct >= 100
                ? '¡Excelente! Tu hoja de vida cuenta con todos los datos necesarios para postularte.'
                : 'Completa tu formación, experiencia y habilidades para aumentar tu visibilidad ante empresas.'}
            </p>

            <Link to="/hoja-de-vida" className="btn btn-ghost btn-sm mt-4 inline-flex items-center gap-2">
              <IconResume size={14} />
              <span>Ver y actualizar CV</span>
            </Link>
          </div>
        </Card>

        {/* Profile Summary Card */}
        <Card>
          <div className="card-body flex flex-col items-center text-center" style={{ padding: '24px' }}>
            <Avatar
              name={aprendizNombre}
              size="lg"
              className="mb-3"
              style={{ width: '64px', height: '64px', fontSize: '1.25rem' }}
            />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-navy)' }}>
              {aprendizNombre}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              {data.aprendiz?.programa_formacion || data.aprendiz?.programa || 'Análisis y Desarrollo de Software (ADSO)'}
            </p>
            <div style={{ marginTop: '10px' }}>
              <Badge variant="primary">
                {data.aprendiz?.estado_formacion || 'Etapa Productiva'}
              </Badge>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
              Ficha SENA: {data.aprendiz?.ficha_sena || '2670145'}
            </p>
          </div>
        </Card>

        {/* Quick Links Card */}
        <Card>
          <div className="card-body" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '16px' }}>
              Gestión Rápida
            </h3>
            <div className="flex flex-col gap-2">
              <Link to="/perfil" className="btn btn-ghost btn-sm justify-start">
                <IconUser size={16} />
                <span>Datos personales y contacto</span>
              </Link>
              <Link to="/formacion" className="btn btn-ghost btn-sm justify-start">
                <span>🎓 Registrar títulos y cursos</span>
              </Link>
              <Link to="/experiencia" className="btn btn-ghost btn-sm justify-start">
                <span>🏢 Experiencia y proyectos</span>
              </Link>
              <Link to="/postulaciones" className="btn btn-ghost btn-sm justify-start">
                <IconPostulacion size={16} />
                <span>Historial de postulaciones</span>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Two Column Section: Recent Applications & Recommended Vacancies */}
      <div className="grid grid-2 gap-8">
        {/* Recent Applications */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy)' }}>
              Mis Postulaciones Recientes
            </h2>
            <Link to="/postulaciones" className="text-primary font-medium hover:underline text-sm">
              Ver todas ({data.postulaciones.length})
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {data.postulaciones.length === 0 ? (
              <Card>
                <div className="card-body text-center py-8">
                  <p className="text-secondary mb-4">Aún no registras postulaciones activas.</p>
                  <Link to="/ofertas" className="btn btn-primary btn-sm">
                    Buscar vacantes disponibles
                  </Link>
                </div>
              </Card>
            ) : (
              data.postulaciones.map((post) => {
                const cargo = post.vacante_titulo || post.cargo;
                const empresa = post.empresa_nombre || post.empresa;
                return (
                  <Card key={post.id} className="card-interactive">
                    <div className="card-body p-4 flex gap-4 items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'var(--color-surface-2)',
                            color: 'var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            flexShrink: 0
                          }}
                        >
                          🏢
                        </div>
                        <div className="min-w-0">
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-navy)' }} className="truncate">
                            {cargo}
                          </h4>
                          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }} className="truncate">
                            {empresa} • {post.fecha_postulacion || 'Reciente'}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getBadgeForEstado(post.estado)}>
                        {String(post.estado || '').replace('_', ' ')}
                      </Badge>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </section>

        {/* Recommended Vacancies */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy)' }}>
              Ofertas Recomendadas
            </h2>
            <Link to="/ofertas" className="text-primary font-medium hover:underline text-sm">
              Ver catálogo completo
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {data.recomendadas.map((vac) => {
              const cargo = vac.titulo || vac.cargo;
              const empresa = vac.empresa_nombre || vac.empresa;
              return (
                <Card key={vac.id} className="card-interactive">
                  <Link to={`/ofertas/${vac.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="card-body p-4 flex gap-4 items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                          <Badge variant="primary">{vac.modalidad || 'Híbrido'}</Badge>
                          <Badge variant="gray">{vac.tipo_contrato || 'Contrato Aprendizaje'}</Badge>
                        </div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-navy)' }} className="truncate">
                          {cargo}
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                          {empresa} • 📍 {vac.ubicacion}
                        </p>
                      </div>
                      <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.1rem' }}>
                        ➔
                      </span>
                    </div>
                  </Link>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
