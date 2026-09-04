import { useState, useEffect } from 'react';
import { userService } from '../../services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Table from '../../components/common/Table';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Toast from '../../components/common/Toast';
import Avatar from '../../components/common/Avatar';
import { mockUsuarios } from '../../data/mockData';

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    action: null
  });

  useEffect(() => {
    loadUsuarios();
  }, []);

  async function loadUsuarios() {
    try {
      const res = await userService.list();
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setUsuarios(res.data.data);
      } else {
        setUsuarios(mockUsuarios);
      }
    } catch (error) {
      setUsuarios(mockUsuarios);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleActivo = (user) => {
    const isActivo = user.estado === 'ACTIVO' || user.activo === 1 || user.activo === true;
    const nuevoEstado = isActivo ? 'INACTIVO' : 'ACTIVO';

    setConfirmDialog({
      isOpen: true,
      title: `${isActivo ? 'Desactivar' : 'Activar'} usuario`,
      message: `¿Estás seguro de cambiar el estado de acceso de ${user.nombre}?`,
      action: async () => {
        try {
          if (isActivo) {
            await userService.desactivar(user.id);
          } else {
            await userService.activar(user.id);
          }
          setUsuarios((prev) =>
            prev.map((u) => (u.id === user.id ? { ...u, estado: nuevoEstado, activo: !isActivo } : u))
          );
          setToast(`Usuario ${user.nombre} marcado como ${nuevoEstado.toLowerCase()}.`);
        } catch (err) {
          setUsuarios((prev) =>
            prev.map((u) => (u.id === user.id ? { ...u, estado: nuevoEstado, activo: !isActivo } : u))
          );
          setToast(`Usuario ${user.nombre} actualizado (Modo Prototipo).`);
        }
        setConfirmDialog({ isOpen: false, title: '', message: '', action: null });
      }
    });
  };

  if (loading) return <Loading fullPage={false} />;

  const columns = [
    {
      key: 'nombre',
      label: 'Usuario',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar name={row.nombre} size="sm" />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>{row.nombre}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              {row.email || row.correo}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'rol',
      label: 'Rol en Plataforma',
      render: (val) => {
        const r = String(val || '').toUpperCase();
        const v = r.includes('ADMIN') ? 'purple' : r.includes('EMPRESA') ? 'blue' : 'primary';
        return <Badge variant={v}>{r}</Badge>;
      }
    },
    {
      key: 'fecha_registro',
      label: 'Fecha Registro',
      render: (val, row) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          {val || (row.creado_en ? row.creado_en.slice(0, 10) : '2025-01-15')}
        </span>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (val, row) => {
        const isActivo = val === 'ACTIVO' || row.activo === 1 || row.activo === true;
        return (
          <Badge variant={isActivo ? 'success' : 'error'}>
            {isActivo ? 'Activo' : 'Inactivo'}
          </Badge>
        );
      }
    },
    {
      key: 'acciones',
      label: 'Acción',
      width: '120px',
      render: (_, row) => {
        const isActivo = row.estado === 'ACTIVO' || row.activo === 1 || row.activo === true;
        const isAdmin = String(row.rol).toUpperCase().includes('ADMIN');
        if (isAdmin) return <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Protegido</span>;

        return (
          <Button
            variant={isActivo ? 'ghost' : 'secondary'}
            size="sm"
            onClick={() => handleToggleActivo(row)}
            style={isActivo ? { color: 'var(--color-error)' } : {}}
          >
            {isActivo ? 'Desactivar' : 'Activar'}
          </Button>
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
            Gestión de Usuarios y Roles
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Control centralizado de cuentas de aprendices, empresas y funcionarios SENA.
          </p>
        </div>
      </div>

      <Card style={{ padding: '20px' }}>
        <Table
          columns={columns}
          data={usuarios}
          searchable
          searchPlaceholder="Buscar por nombre o correo..."
          searchKeys={['nombre', 'email', 'correo', 'rol']}
          pageSize={6}
        />
      </Card>
    </div>
  );
}
