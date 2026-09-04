import { useState, useEffect } from 'react';
import { vacanteService } from '../../services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Toast from '../../components/common/Toast';
import { mockVacantes } from '../../data/mockData';

export default function VacantesAdmin() {
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    loadVacantes();
  }, []);

  async function loadVacantes() {
    try {
      const res = await vacanteService.list({});
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

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await vacanteService.delete(deleteTarget.id);
      setVacantes((prev) => prev.filter((v) => v.id !== deleteTarget.id));
      setToast(`Vacante "${deleteTarget.titulo || deleteTarget.cargo}" eliminada.`);
    } catch (error) {
      setVacantes((prev) => prev.filter((v) => v.id !== deleteTarget.id));
      setToast(`Vacante eliminada (Modo Prototipo).`);
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) return <Loading fullPage={false} />;

  const columns = [
    {
      key: 'cargo',
      label: 'Cargo & Ubicación',
      render: (_, row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>
            {row.titulo || row.cargo}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            📍 {row.ubicacion} • Modalidad: {row.modalidad || 'Híbrido'}
          </div>
        </div>
      )
    },
    {
      key: 'empresa',
      label: 'Empresa Publicadora',
      render: (_, row) => (
        <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
          {row.empresa_nombre || row.empresa}
        </span>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (val) => {
        const isPublicada = val === 'Publicada' || val === 'ABIERTA';
        return (
          <Badge variant={isPublicada ? 'success' : 'gray'}>
            {isPublicada ? 'Publicada' : 'Cerrada'}
          </Badge>
        );
      }
    },
    {
      key: 'postulaciones_count',
      label: 'Postulaciones',
      render: (val) => (
        <span style={{ fontWeight: 700 }}>
          {val !== undefined ? `${val} postulados` : '4 postulados'}
        </span>
      )
    },
    {
      key: 'fecha_publicacion',
      label: 'Fecha Pub.',
      render: (val) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          {val ? val.slice(0, 10) : '2025-02-15'}
        </span>
      )
    },
    {
      key: 'acciones',
      label: 'Moderación',
      width: '100px',
      render: (_, row) => (
        <Button
          variant="ghost"
          size="sm"
          style={{ color: 'var(--color-error)' }}
          onClick={() => setDeleteTarget(row)}
        >
          Eliminar
        </Button>
      )
    }
  ];

  return (
    <div className="animate-fade">
      {toast && (
        <div className="toast-container">
          <Toast message={toast} type="success" onClose={() => setToast(null)} />
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Eliminar vacante de la plataforma"
        message={`¿Estás seguro de eliminar la convocatoria "${deleteTarget?.titulo || deleteTarget?.cargo}"? Esta acción cancelará las postulaciones activas asociadas.`}
        confirmText="Eliminar permanentemente"
        cancelText="Cancelar"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="page-header flex justify-between items-center flex-wrap gap-4 mb-6">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-navy)' }}>
            Supervisión y Control de Vacantes
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Revisión integral de convocatorias de aprendizaje publicadas por las empresas registradas.
          </p>
        </div>
      </div>

      <Card style={{ padding: '20px' }}>
        <Table
          columns={columns}
          data={vacantes}
          searchable
          searchPlaceholder="Buscar por cargo, empresa o ubicación..."
          searchKeys={['titulo', 'cargo', 'empresa_nombre', 'empresa', 'ubicacion']}
          pageSize={6}
        />
      </Card>
    </div>
  );
}
