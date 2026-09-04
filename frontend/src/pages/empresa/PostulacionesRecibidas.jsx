import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { postulacionService } from '../../services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import Avatar from '../../components/common/Avatar';
import Toast from '../../components/common/Toast';
import { mockPostulaciones } from '../../data/mockData';

export default function PostulacionesRecibidas() {
  const { user } = useAuth();
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadPostulaciones();
  }, []);

  async function loadPostulaciones() {
    try {
      const res = await postulacionService.list({ empresa_id: user?.empresa_id || 1 });
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

  const handleUpdateEstado = async (id, nuevoEstado) => {
    try {
      await postulacionService.updateEstado(id, { estado: nuevoEstado });
      setPostulaciones((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
      );
      setToast(`Estado de postulación cambiado a ${nuevoEstado.replace('_', ' ')}.`);
    } catch (error) {
      setPostulaciones((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
      );
      setToast(`Estado actualizado a ${nuevoEstado.replace('_', ' ')} (Modo Prototipo).`);
    }
  };

  if (loading) return <Loading fullPage={false} />;

  const getBadgeVariant = (estado) => {
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
      {toast && (
        <div className="toast-container">
          <Toast message={toast} type="success" onClose={() => setToast(null)} />
        </div>
      )}

      <div className="page-header mb-6">
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-navy)' }}>
          Candidatos y Postulaciones Recibidas
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Evalúa las hojas de vida de los aprendices que han aplicado a tus convocatorias laborales.
        </p>
      </div>

      {postulaciones.length === 0 ? (
        <EmptyState
          icon="👥"
          title="Sin postulaciones recibidas aún"
          description="Tus vacantes activas aparecerán en el catálogo de ofertas del SENA para recibir aspirantes."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {postulaciones.map((post) => {
            const nombre = post.aprendiz_nombre || `${post.aprendiz_nombre || ''} ${post.aprendiz_apellido || ''}`.trim() || 'Aprendiz SENA';
            const cargo = post.vacante_titulo || post.cargo || 'Desarrollador Junior';
            const email = post.aprendiz_correo || 'juan.perez@soy.sena.edu.co';
            const programa = post.programa_formacion || 'Análisis y Desarrollo de Software (ADSO)';

            return (
              <Card key={post.id} className="card-interactive" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                  <div style={{ display: 'flex', gap: '16px', flex: 1, minWidth: '300px' }}>
                    <Avatar
                      name={nombre}
                      size="lg"
                      style={{ width: '56px', height: '56px', fontSize: '1.15rem', flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-navy)' }}>
                          {nombre}
                        </h3>
                        <Badge variant={getBadgeVariant(post.estado)}>
                          {String(post.estado || '').replace('_', ' ')}
                        </Badge>
                      </div>

                      <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>
                        Vacante: <strong>{cargo}</strong>
                      </p>

                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
                        Programa formativo: {programa}
                      </p>

                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                        <span>✉️ {email}</span>
                        <span>📅 Postulación: {post.fecha_postulacion ? post.fecha_postulacion.slice(0, 10) : '2025-02-16'}</span>
                      </div>

                      {post.mensaje && (
                        <p
                          style={{
                            marginTop: '12px',
                            padding: '10px 14px',
                            background: 'var(--color-surface-2)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.85rem',
                            color: 'var(--color-text)',
                            fontStyle: 'italic'
                          }}
                        >
                          "{post.mensaje}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      minWidth: '200px',
                      paddingLeft: '20px',
                      borderLeft: '1px solid var(--color-border-light)'
                    }}
                  >
                    <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>
                      Estado del Candidato
                    </span>

                    <select
                      className="form-select"
                      style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                      value={post.estado || 'ENVIADA'}
                      onChange={(e) => handleUpdateEstado(post.id, e.target.value)}
                    >
                      <option value="ENVIADA">Enviada (No leída)</option>
                      <option value="EN_REVISION">En Revisión</option>
                      <option value="PRESELECCIONADO">Preseleccionado</option>
                      <option value="FINALIZADO">Contratado / Finalizado</option>
                      <option value="RECHAZADO">No seleccionado</option>
                    </select>

                    <a
                      href={`mailto:${email}?subject=Proceso%20de%20Selecci%C3%B3n%20-%20${encodeURIComponent(cargo)}`}
                      className="btn btn-ghost btn-sm"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      ✉️ Enviar correo
                    </a>
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
