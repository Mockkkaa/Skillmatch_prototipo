import { useState, useEffect } from 'react';
import { empresaService } from '../../services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Table from '../../components/common/Table';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Toast from '../../components/common/Toast';
import { mockEmpresas } from '../../data/mockData';

export default function EmpresasAdmin() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [approveDialog, setApproveDialog] = useState({
    isOpen: false,
    empresa: null
  });

  const [rejectDialog, setRejectDialog] = useState({
    isOpen: false,
    empresa: null
  });

  useEffect(() => {
    loadEmpresas();
  }, []);

  async function loadEmpresas() {
    try {
      const res = await empresaService.list();
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setEmpresas(res.data.data);
      } else {
        setEmpresas(mockEmpresas);
      }
    } catch (error) {
      setEmpresas(mockEmpresas);
    } finally {
      setLoading(false);
    }
  }

  const handleConfirmAprobar = async () => {
    const emp = approveDialog.empresa;
    if (!emp) return;

    try {
      await empresaService.aprobar(emp.id);
      setEmpresas((prev) =>
        prev.map((e) => (e.id === emp.id ? { ...e, estado: 'APROBADA' } : e))
      );
      setToast(`Empresa "${emp.razon_social}" aprobada y autorizada para publicar vacantes.`);
    } catch (err) {
      setEmpresas((prev) =>
        prev.map((e) => (e.id === emp.id ? { ...e, estado: 'APROBADA' } : e))
      );
      setToast(`Empresa "${emp.razon_social}" aprobada (Modo Prototipo).`);
    } finally {
      setApproveDialog({ isOpen: false, empresa: null });
    }
  };

  const handleConfirmRechazar = async (motivo) => {
    const emp = rejectDialog.empresa;
    if (!emp) return;

    try {
      await empresaService.rechazar(emp.id, { observaciones: motivo });
      setEmpresas((prev) =>
        prev.map((e) => (e.id === emp.id ? { ...e, estado: 'RECHAZADA' } : e))
      );
      setToast(`Empresa "${emp.razon_social}" rechazada. Notificación enviada.`);
    } catch (err) {
      setEmpresas((prev) =>
        prev.map((e) => (e.id === emp.id ? { ...e, estado: 'RECHAZADA' } : e))
      );
      setToast(`Empresa "${emp.razon_social}" rechazada con motivo: "${motivo}" (Modo Prototipo).`);
    } finally {
      setRejectDialog({ isOpen: false, empresa: null });
    }
  };

  if (loading) return <Loading fullPage={false} />;

  const columns = [
    {
      key: 'razon_social',
      label: 'Razón Social & NIT',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>{val}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            NIT: {row.nit} • Sector: {row.sector_economico || row.sector || 'General'}
          </div>
        </div>
      )
    },
    {
      key: 'ciudad',
      label: 'Ciudad',
      render: (val) => val || 'Bogotá D.C.'
    },
    {
      key: 'contacto',
      label: 'Canales de Contacto',
      render: (_, row) => (
        <div style={{ fontSize: '0.8rem' }}>
          <div>{row.email_contacto || row.correo_empresa || row.email}</div>
          <div style={{ color: 'var(--color-text-muted)' }}>{row.telefono_contacto || row.telefono}</div>
        </div>
      )
    },
    {
      key: 'estado',
      label: 'Estado SENA',
      render: (val) => {
        const isAprobada = val === 'APROBADA';
        const isPendiente = val === 'PENDIENTE';
        return (
          <Badge variant={isAprobada ? 'success' : isPendiente ? 'warning' : 'error'}>
            {val}
          </Badge>
        );
      }
    },
    {
      key: 'acciones',
      label: 'Decisión APE',
      width: '180px',
      render: (_, row) => {
        if (row.estado === 'PENDIENTE') {
          return (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setApproveDialog({ isOpen: true, empresa: row })}
              >
                Aprobar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setRejectDialog({ isOpen: true, empresa: row })}
              >
                Rechazar
              </Button>
            </div>
          );
        }
        return (
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {row.estado === 'APROBADA' ? '✓ Habilitada' : '✗ No autorizada'}
          </span>
        );
      }
    }
  ];

  return (
    <div className="animate-fade">
      {toast && (
        <div className="toast-container">
          <Toast message={toast} type="success" onClose={() => setToast(null)} />
        </div>
      )}

      {/* Approve Dialog */}
      <ConfirmDialog
        isOpen={approveDialog.isOpen}
        title="Aprobar vinculación empresarial"
        message={`¿Deseas autorizar formalmente a "${approveDialog.empresa?.razon_social}" en SKILLMATCH? Podrán publicar vacantes y contactar aprendices.`}
        confirmText="Aprobar empresa"
        cancelText="Cancelar"
        type="primary"
        onConfirm={handleConfirmAprobar}
        onCancel={() => setApproveDialog({ isOpen: false, empresa: null })}
      />

      {/* Reject Dialog with required Motivo input (replaces window.prompt) */}
      <ConfirmDialog
        isOpen={rejectDialog.isOpen}
        title="Rechazar solicitud de empresa"
        message={`Indica el motivo de rechazo para ${rejectDialog.empresa?.razon_social}. Este mensaje será remitido al correo del solicitante:`}
        confirmText="Confirmar rechazo"
        cancelText="Cancelar"
        type="danger"
        withInput={true}
        inputLabel="Motivo u observaciones técnicas"
        inputPlaceholder="Ej: Inconsistencia en certificado de existencia y representación legal / NIT no verificable en RUES..."
        onConfirm={handleConfirmRechazar}
        onCancel={() => setRejectDialog({ isOpen: false, empresa: null })}
      />

      <div className="page-header flex justify-between items-center flex-wrap gap-4 mb-6">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-navy)' }}>
            Aprobación y Verificación de Empresas
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Validación de requisitos legales e intermediación según normatividad APE SENA.
          </p>
        </div>
      </div>

      <Card style={{ padding: '20px' }}>
        <Table
          columns={columns}
          data={empresas}
          searchable
          searchPlaceholder="Buscar por nombre, NIT o sector..."
          searchKeys={['razon_social', 'nit', 'sector_economico', 'sector']}
          pageSize={6}
        />
      </Card>
    </div>
  );
}
