import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { postulacionService } from '../../services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import Avatar from '../../components/common/Avatar';
import Toast from '../../components/common/Toast';
import Button from '../../components/common/Button';
import { mockPostulaciones } from '../../data/mockData';

const KANBAN_COLUMNS = [
  { id: 'ENVIADA', titulo: 'Nuevos Postulados', color: 'var(--color-navy)' },
  { id: 'EN_REVISION', titulo: 'En Revisión CV', color: '#F59E0B' },
  { id: 'PRESELECCIONADO', titulo: 'Preseleccionados', color: '#8B5CF6' },
  { id: 'FINALIZADO', titulo: 'Contratados / Vinculados', color: 'var(--color-primary)' }
];

export default function PostulacionesRecibidas() {
  const { user } = useAuth();
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [vistaKanban, setVistaKanban] = useState(true);

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
      setToast(`Candidato movido a: ${nuevoEstado.replace('_', ' ')}.`);
    } catch (error) {
      setPostulaciones((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
      );
      setToast(`Candidato actualizado a: ${nuevoEstado.replace('_', ' ')}.`);
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

      <div className="page-header flex justify-between items-center flex-wrap gap-4 mb-6">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-navy)' }}>
            Selección y Proceso de Candidatos
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Gestiona el proceso de selección de aprendices SENA postulados a tus vacantes.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={vistaKanban ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setVistaKanban(true)}
          >
            📋 Tablero Kanban
          </Button>
          <Button
            variant={!vistaKanban ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setVistaKanban(false)}
          >
            📜 Lista detallada
          </Button>
        </div>
      </div>

      {postulaciones.length === 0 ? (
        <EmptyState
          icon="👥"
          title="Sin postulaciones recibidas aún"
          description="Tus vacantes activas aparecerán en el catálogo de ofertas del SENA para recibir aspirantes."
        />
      ) : vistaKanban ? (
        /* VISTA KANBAN PIPELINE */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '18px',
            alignItems: 'start'
          }}
        >
          {KANBAN_COLUMNS.map((col) => {
            const items = postulaciones.filter((p) => p.estado === col.id);
            return (
              <div
                key={col.id}
                style={{
                  background: 'var(--color-surface-2)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '14px',
                    paddingBottom: '10px',
                    borderBottom: `2px solid ${col.color}`
                  }}
                >
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>
                    {col.titulo}
                  </h3>
                  <span
                    style={{
                      background: 'var(--color-white)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: col.color
                    }}
                  >
                    {items.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '120px' }}>
                  {items.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8rem', padding: '24px 0' }}>
                      Sin candidatos en esta fase
                    </div>
                  ) : (
                    items.map((post) => {
                      const nombre = post.aprendiz_nombre || `${post.aprendiz_nombre || ''} ${post.aprendiz_apellido || ''}`.trim() || 'Aprendiz SENA';
                      const cargo = post.vacante_titulo || post.cargo || 'Desarrollador Junior';
                      const email = post.aprendiz_correo || 'juan.perez@soy.sena.edu.co';

                      return (
                        <Card key={post.id} style={{ padding: '14px', border: '1px solid var(--color-border)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <Avatar name={nombre} size="sm" />
                            <div style={{ minWidth: 0 }}>
                              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--color-navy)' }} className="truncate">
                                {nombre}
                              </h4>
                              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                {cargo}
                              </span>
                            </div>
                          </div>

                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                            ✉️ {email}
                          </div>

                          {/* Selector rápido de fase */}
                          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                            <select
                              value={post.estado}
                              onChange={(e) => handleUpdateEstado(post.id, e.target.value)}
                              style={{
                                width: '100%',
                                fontSize: '0.75rem',
                                padding: '4px 6px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-background)'
                              }}
                            >
                              <option value="ENVIADA">Mover a: Nuevo</option>
                              <option value="EN_REVISION">Mover a: En Revisión</option>
                              <option value="PRESELECCIONADO">Mover a: Preseleccionado</option>
                              <option value="FINALIZADO">Mover a: Vinculado</option>
                              <option value="RECHAZADO">Mover a: Rechazado</option>
                            </select>
                          </div>
                        </Card>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VISTA LISTA DETALLADA */
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