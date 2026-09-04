import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { experienciaService } from '../../services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Toast from '../../components/common/Toast';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import { mockExperiencia } from '../../data/mockData';

export default function Experiencia() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    loadData();
  }, [user]);

  async function loadData() {
    try {
      const id = user?.aprendiz_id || 1;
      const res = await experienciaService.list(id);
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setData(res.data.data);
      } else {
        setData(mockExperiencia);
      }
    } catch (error) {
      setData(mockExperiencia);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (item = null) => {
    setEditingId(item?.id || null);
    setFormData(
      item || {
        empresa: '',
        cargo: '',
        tipo_experiencia: 'Practicante / Aprendiz',
        fecha_inicio: '',
        fecha_fin: '',
        actualmente_trabaja: false,
        en_curso: false,
        descripcion: ''
      }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({});
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...formData,
      aprendiz_id: user?.aprendiz_id || 1
    };

    try {
      if (editingId) {
        await experienciaService.update(editingId, payload);
        setData((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...payload } : item)));
        setToast('Experiencia laboral actualizada.');
      } else {
        const newId = Date.now();
        await experienciaService.create(payload);
        setData((prev) => [{ ...payload, id: newId }, ...prev]);
        setToast('Experiencia agregada correctamente.');
      }
      handleCloseModal();
    } catch (error) {
      // Mock fallback
      if (editingId) {
        setData((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...payload } : item)));
        setToast('Experiencia actualizada (Modo Prototipo).');
      } else {
        const newId = Date.now();
        setData((prev) => [{ ...payload, id: newId }, ...prev]);
        setToast('Experiencia agregada (Modo Prototipo).');
      }
      handleCloseModal();
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await experienciaService.delete(deleteTargetId);
      setData((prev) => prev.filter((item) => item.id !== deleteTargetId));
      setToast('Experiencia laboral eliminada.');
    } catch (error) {
      setData((prev) => prev.filter((item) => item.id !== deleteTargetId));
      setToast('Experiencia eliminada (Modo Prototipo).');
    } finally {
      setDeleteTargetId(null);
    }
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
        isOpen={!!deleteTargetId}
        title="Eliminar experiencia laboral"
        message="¿Estás seguro de que deseas eliminar este registro de experiencia laboral de tu perfil?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      <div className="page-header flex justify-between items-center flex-wrap gap-4 mb-6">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-navy)' }}>
            Experiencia Laboral y Proyectos
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Registra tus prácticas formativas, proyectos académicos destacados o empleos previos.
          </p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          + Agregar experiencia
        </Button>
      </div>

      {data.length === 0 ? (
        <EmptyState
          icon="🏢"
          title="Sin experiencia laboral registrada"
          description="Si no cuentas con experiencia previa en empresas, puedes registrar tus proyectos formativos del SENA."
          action={
            <Button variant="primary" onClick={() => handleOpenModal()}>
              Registrar proyecto o práctica
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {data.map((item) => (
            <Card
              key={item.id}
              className="card-interactive"
              style={{
                borderLeft: '4px solid var(--color-navy)',
                padding: '24px'
              }}
            >
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 700,
                        background: 'var(--color-surface-2)',
                        color: 'var(--color-navy)',
                        padding: '2px 10px',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      {item.tipo_experiencia || 'Práctica / Proyecto SENA'}
                    </span>
                    {(item.actualmente_trabaja || item.en_curso) && (
                      <span
                        style={{
                          fontSize: 'var(--font-size-xs)',
                          fontWeight: 700,
                          background: 'var(--color-primary-light)',
                          color: 'var(--color-primary-dark)',
                          padding: '2px 10px',
                          borderRadius: 'var(--radius-full)'
                        }}
                      >
                        Actualmente activo
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '4px' }}>
                    {item.cargo}
                  </h3>
                  <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '8px' }}>
                    {item.empresa}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    <span>
                      📅 {item.fecha_inicio ? item.fecha_inicio.slice(0, 10) : '2024'} —{' '}
                      {item.actualmente_trabaja || item.en_curso
                        ? 'Actualidad'
                        : item.fecha_fin
                        ? item.fecha_fin.slice(0, 10)
                        : 'Finalizado'}
                    </span>
                  </div>

                  {item.descripcion && (
                    <p style={{ color: 'var(--color-text)', fontSize: '0.875rem', marginTop: '12px', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                      {item.descripcion}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenModal(item)}>
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTargetId(item.id)}
                    style={{ color: 'var(--color-error)' }}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Reusable Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar experiencia laboral' : 'Registrar nueva experiencia'}
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit} loading={saving}>
              Guardar experiencia
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Empresa o proyecto formativo"
            name="empresa"
            required
            placeholder="Ej: Proyectos Académicos SENA / Tech Corp"
            value={formData.empresa || ''}
            onChange={handleInputChange}
          />

          <Input
            label="Cargo o rol desempeñado"
            name="cargo"
            required
            placeholder="Ej: Desarrollador Web Junior (Proyecto Formativo)"
            value={formData.cargo || ''}
            onChange={handleInputChange}
          />

          <div className="form-row">
            <Input
              label="Fecha de inicio"
              name="fecha_inicio"
              type="date"
              value={formData.fecha_inicio ? formData.fecha_inicio.slice(0, 10) : ''}
              onChange={handleInputChange}
            />
            <Input
              label="Fecha de fin"
              name="fecha_fin"
              type="date"
              disabled={formData.actualmente_trabaja || formData.en_curso}
              value={formData.fecha_fin ? formData.fecha_fin.slice(0, 10) : ''}
              onChange={handleInputChange}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer" style={{ marginTop: '-4px' }}>
            <input
              type="checkbox"
              name="actualmente_trabaja"
              checked={formData.actualmente_trabaja || formData.en_curso || false}
              onChange={handleInputChange}
            />
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--color-text)' }}>
              Actualmente participo en esta experiencia o proyecto
            </span>
          </label>

          <Input
            label="Funciones, logros o responsabilidades"
            name="descripcion"
            type="textarea"
            rows={4}
            placeholder="Describe las tareas realizadas, herramientas empleadas y logros alcanzados."
            value={formData.descripcion || ''}
            onChange={handleInputChange}
          />
        </form>
      </Modal>
    </div>
  );
}
