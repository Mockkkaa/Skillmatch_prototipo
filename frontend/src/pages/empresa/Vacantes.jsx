import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { vacanteService } from '../../services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Toast from '../../components/common/Toast';
import { mockVacantes } from '../../data/mockData';

export default function Vacantes() {
  const { user } = useAuth();
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    action: null
  });

  useEffect(() => {
    loadVacantes();
  }, []);

  async function loadVacantes() {
    try {
      const res = await vacanteService.misVacantes();
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setVacantes(res.data.data);
      } else {
        setVacantes(mockVacantes);
      }
    } catch (error) {
      setVacantes(mockVacantes);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleEstado = (id, estadoActual) => {
    const isAbierta = estadoActual === 'ABIERTA' || estadoActual === 'Publicada';
    const nuevoEstado = isAbierta ? 'Cerrada' : 'Publicada';

    setConfirmDialog({
      isOpen: true,
      title: `${isAbierta ? 'Cerrar' : 'Reabrir'} vacante`,
      message: `¿Deseas cambiar el estado de esta vacante a "${nuevoEstado}"?`,
      action: async () => {
        try {
          await vacanteService.update(id, { estado: nuevoEstado });
          setVacantes((prev) =>
            prev.map((v) => (v.id === id ? { ...v, estado: nuevoEstado } : v))
          );
          setToast(`Vacante marcada como ${nuevoEstado.toLowerCase()}.`);
        } catch (err) {
          setVacantes((prev) =>
            prev.map((v) => (v.id === id ? { ...v, estado: nuevoEstado } : v))
          );
          setToast(`Vacante ${nuevoEstado.toLowerCase()} (Modo Prototipo).`);
        }
        setConfirmDialog({ isOpen: false, title: '', message: '', action: null });
      }
    });
  };

  const handleDelete = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar convocatoria',
      message: '¿Estás seguro de eliminar permanentemente esta vacante? Esta acción no se puede deshacer.',
      action: async () => {
        try {
          await vacanteService.delete(id);
          setVacantes((prev) => prev.filter((v) => v.id !== id));
          setToast('Vacante eliminada exitosamente.');
        } catch (err) {
          setVacantes((prev) => prev.filter((v) => v.id !== id));
          setToast('Vacante eliminada (Modo Prototipo).');
        }
        setConfirmDialog({ isOpen: false, title: '', message: '', action: null });
      }
    });
  };

  if (loading) return <Loading fullPage={false} />;

  return (
    <div className="animate-fade">
      {toast && (
        <div className="toast-container">
          <Toast message={toast} type="success" onClose={() => setToast(null)} />
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={() => confirmDialog.action && confirmDialog.action()}
        onCancel={() => setConfirmDialog({ isOpen: false, title: '', message: '', action: null })}
      />

      <div className="page-header flex justify-between items-center flex-wrap gap-4 mb-6">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-navy)' }}>
            Convocatorias Publicadas
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Gestiona las ofertas laborales activas y candidatos de tu empresa.
          </p>
        </div>
        <Link to="/empresa/vacantes/nueva" className="btn btn-primary btn-sm">
          + Publicar nueva vacante
        </Link>
      </div>

      {vacantes.length === 0 ? (
        <EmptyState
          icon="💼"
          title="No tienes vacantes activas"
          description="Publica una convocatoria laboral para que los aprendices SENA comiencen a postularse."
          action={
            <Link to="/empresa/vacantes/nueva" className="btn btn-primary">
              Publicar mi primera vacante
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {vacantes.map((vac) => {
            const isAbierta = vac.estado === 'ABIERTA' || vac.estado === 'Publicada';
            const title = vac.titulo || vac.cargo;
            return (
              <Card key={vac.id} className="card-interactive" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <Badge variant={isAbierta ? 'success' : 'gray'}>
                        {isAbierta ? 'Publicada' : 'Cerrada'}
                      </Badge>
                      <Badge variant="primary">{vac.modalidad || 'Híbrido'}</Badge>
                      <Badge variant="gray">{vac.tipo_contrato || 'Contrato de Aprendizaje'}</Badge>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '4px' }}>
                      {title}
                    </h3>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                      <span>📍 {vac.ubicacion}</span>
                      <span>📅 Publicado: {vac.fecha_publicacion ? vac.fecha_publicacion.slice(0, 10) : '2025-02-15'}</span>
                      <strong style={{ color: 'var(--color-primary)' }}>
                        👥 {vac.postulaciones_count || 4} candidato(s) postulados
                      </strong>
                    </div>

                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {vac.descripcion}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <Link to={`/empresa/postulaciones`} className="btn btn-ghost btn-sm">
                      Ver candidatos
                    </Link>
                    <Link to={`/empresa/vacantes/${vac.id}`} className="btn btn-ghost btn-sm">
                      Editar
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleEstado(vac.id, vac.estado)}
                    >
                      {isAbierta ? 'Cerrar' : 'Reabrir'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      style={{ color: 'var(--color-error)' }}
                      onClick={() => handleDelete(vac.id)}
                    >
                      Eliminar
                    </Button>
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
