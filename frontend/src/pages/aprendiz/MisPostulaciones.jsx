import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postulacionService } from '../../services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import { mockPostulaciones } from '../../data/mockData';

export default function MisPostulaciones() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPostulaciones() {
      try {
        const res = await postulacionService.list();
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setPostulaciones(res.data.data);
        } else {
          setPostulaciones(mockPostulaciones);
        }
      } catch (error) {
        setPostulaciones(mockPostulaciones);
      } finally {
        setLoading(false);
      }
    }
    loadPostulaciones();
  }, []);

  if (loading) return <Loading fullPage={false} />;

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

  const getEstadoDescription = (estado) => {
    const map = {
      ENVIADA: 'Tu hoja de vida fue enviada exitosamente a la empresa.',
      EN_REVISION: 'El equipo de recursos humanos está evaluando tus competencias y perfil.',
      PRESELECCIONADO: '¡Felicidades! Has sido preseleccionado para la siguiente etapa de entrevistas.',
      RECHAZADO: 'La empresa seleccionó otro candidato para este proceso.',
      FINALIZADO: 'La vacante concluyó satisfactoriamente el proceso de contratación.'
    };
    return map[estado] || '';
  };

  const getTimelineStep = (estado) => {
    if (estado === 'ENVIADA') return 1;
    if (estado === 'EN_REVISION') return 2;
    if (estado === 'PRESELECCIONADO') return 3;
    if (estado === 'FINALIZADO' || estado === 'RECHAZADO') return 4;
    return 1;
  };

  return (
    <div className="animate-fade">
      <div className="page-header flex justify-between items-center flex-wrap gap-4 mb-6">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-navy)' }}>
            Mis Postulaciones Laborales
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Haz seguimiento al estado y avance de tus procesos de selección con empresas aliadas.
          </p>
        </div>
        <Link to="/ofertas" className="btn btn-primary btn-sm">
          + Explorar más ofertas
        </Link>
      </div>

      {postulaciones.length === 0 ? (
        <EmptyState
          icon="📝"
          title="Aún no tienes postulaciones"
          description="Explora las vacantes disponibles y postúlate a las que mejor se adapten a tu perfil formativo."
          action={
            <Link to="/ofertas" className="btn btn-primary">
              Ver ofertas laborales
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-6">
          {postulaciones.map((post) => {
            const cargo = post.vacante_titulo || post.cargo;
            const empresa = post.empresa_nombre || post.empresa;
            const currentStep = getTimelineStep(post.estado);
            const isRechazado = post.estado === 'RECHAZADO';

            return (
              <Card key={post.id} className="card-interactive" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Badge variant={getBadgeForEstado(post.estado)}>
                          {String(post.estado || '').replace('_', ' ')}
                        </Badge>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          • Postulado el {post.fecha_postulacion || 'Reciente'}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy)' }}>
                        {cargo}
                      </h3>
                      <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
                        {empresa} {post.ubicacion ? `• 📍 ${post.ubicacion}` : ''}
                      </p>
                    </div>

                    <Link to={`/ofertas/${post.vacante_id || 1}`} className="btn btn-ghost btn-sm">
                      Ver detalle de la vacante
                    </Link>
                  </div>

                  {/* Status Banner */}
                  <div
                    style={{
                      background: 'var(--color-surface-2)',
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      color: 'var(--color-text)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
                    <span>{getEstadoDescription(post.estado)}</span>
                  </div>

                  {/* Visual Progress Steps */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '4px' }}>
                    {['1. Enviada', '2. En Revisión', '3. Preselección', isRechazado ? '4. No seleccionado' : '4. Finalizado'].map((stepName, sIdx) => {
                      const stepNum = sIdx + 1;
                      const isComplete = stepNum <= currentStep;
                      return (
                        <div key={sIdx} style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              height: '6px',
                              borderRadius: '3px',
                              background: isComplete
                                ? (isRechazado && stepNum === 4 ? 'var(--color-error)' : 'var(--color-primary)')
                                : 'var(--color-border)',
                              marginBottom: '6px',
                              transition: 'background 0.3s'
                            }}
                          ></div>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: isComplete ? 700 : 500,
                              color: isComplete ? 'var(--color-navy)' : 'var(--color-text-muted)'
                            }}
                          >
                            {stepName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
