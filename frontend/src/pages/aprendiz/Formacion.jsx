import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { formacionService } from '../../services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Toast from '../../components/common/Toast';
import Select from '../../components/common/Select';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import { mockFormacion } from '../../data/mockData';

export default function Formacion() {
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
      const res = await formacionService.list(id);
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setData(res.data.data);
      } else {
        setData(mockFormacion);
      }
    } catch (error) {
      setData(mockFormacion);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (item = null) => {
    setEditingId(item?.id || null);
    setFormData(
      item || {
        institucion: '',
        titulo: '',
        programa: '',
        nivel_educativo: 'Tecnólogo',
        nivel: 'TECNOLOGO',
        fecha_inicio: '',
        fecha_fin: '',
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
      aprendiz_id: user?.aprendiz_id || 1,
      titulo: formData.titulo || formData.programa,
      programa: formData.titulo || formData.programa
    };

    try {
      if (editingId) {
        await formacionService.update(editingId, payload);
        setData((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...payload } : item)));
        setToast('Estudio actualizado correctamente.');
      } else {
        const newId = Date.now();
        await formacionService.create(payload);
        setData((prev) => [{ ...payload, id: newId }, ...prev]);
        setToast('Estudio agregado exitosamente.');
      }
      handleCloseModal();
    } catch (error) {
      // Mock fallback
      if (editingId) {
        setData((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...payload } : item)));
        setToast('Estudio actualizado (Modo Prototipo).');
      } else {
        const newId = Date.now();
        setData((prev) => [{ ...payload, id: newId }, ...prev]);
        setToast('Estudio agregado (Modo Prototipo).');
      }
      handleCloseModal();
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await formacionService.delete(deleteTargetId);
      setData((prev) => prev.filter((item) => item.id !== deleteTargetId));
      setToast('Registro académico eliminado.');
    } catch (error) {
      setData((prev) => prev.filter((item) => item.id !== deleteTargetId));
      setToast('Registro eliminado (Modo Prototipo).');
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

      {/* Reusable ConfirmDialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Eliminar formación académica"
        message="¿Estás seguro de que deseas eliminar este registro de tu hoja de vida? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      <div className="page-header flex justify-between items-center flex-wrap gap-4 mb-6">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-navy)' }}>
            Formación Académica
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Registra tus estudios formales, programas del SENA, cursos y certificaciones.
          </p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          + Agregar estudio
        </Button>
      </div>

      {data.length === 0 ? (
        <EmptyState
          icon="🎓"
          title="Sin formación registrada"
          description="Agrega tus programas formativos del SENA o estudios anteriores para potenciar tu perfil."
          action={
            <Button variant="primary" onClick={() => handleOpenModal()}>
              Agregar mi primer estudio
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {data.map((item) => {
            const title = item.titulo || item.programa;
            const level = item.nivel_educativo || item.nivel || 'Tecnólogo';
            return (
              <Card
                key={item.id}
                className="card-interactive"
                style={{
                  borderLeft: '4px solid var(--color-primary)',
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
                          background: 'var(--color-primary-light)',
                          color: 'var(--color-primary-dark)',
                          padding: '2px 10px',
                          borderRadius: 'var(--radius-full)'
                        }}
                      >
                        {level}
                      </span>
                      {(item.en_curso || item.actualmente_cursando) && (
                        <span
                          style={{
                            fontSize: 'var(--font-size-xs)',
                            fontWeight: 700,
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            padding: '2px 10px',
                            borderRadius: 'var(--radius-full)'
                          }}
                        >
                          En curso actualmente
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '4px' }}>
                      {title}
                    </h3>
                    <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '8px' }}>
                      {item.institucion}
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      <span>
                        📅 {item.fecha_inicio ? item.fecha_inicio.slice(0, 10) : '2023'} —{' '}
                        {item.en_curso || item.actualmente_cursando
                          ? 'Presente'
                          : item.fecha_fin
                          ? item.fecha_fin.slice(0, 10)
                          : 'Finalizado'}
                      </span>
                    </div>

                    {item.descripcion && (
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '12px', lineHeight: 1.5 }}>
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
            );
          })}
        </div>
      )}

      {/* Reusable Modal Component */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar formación académica' : 'Registrar nueva formación'}
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit} loading={saving}>
              Guardar formación
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Institución educativa"
            name="institucion"
            required
            placeholder="Ej: Servicio Nacional de Aprendizaje (SENA)"
            value={formData.institucion || ''}
            onChange={handleInputChange}
          />

          <Input
            label="Programa, carrera o título obtenido"
            name="titulo"
            required
            placeholder="Ej: Análisis y Desarrollo de Software (ADSO)"
            value={formData.titulo || formData.programa || ''}
            onChange={handleInputChange}
          />

          <Select
            label="Nivel de educación"
            name="nivel_educativo"
            value={formData.nivel_educativo || 'Tecnólogo'}
            onChange={handleInputChange}
            options={[
              'Técnico',
              'Tecnólogo',
              'Bachillerato / Media Técnica',
              'Profesional Universitario',
              'Especialización Tecnológica',
              'Curso Corto / Certificación'
            ]}
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
              label="Fecha de graduación / fin"
              name="fecha_fin"
              type="date"
              disabled={formData.en_curso}
              value={formData.fecha_fin ? formData.fecha_fin.slice(0, 10) : ''}
              onChange={handleInputChange}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer" style={{ marginTop: '-4px' }}>
            <input
              type="checkbox"
              name="en_curso"
              checked={formData.en_curso || false}
              onChange={handleInputChange}
            />
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--color-text)' }}>
              Actualmente me encuentro cursando este programa
            </span>
          </label>

          <Input
            label="Descripción o competencias adquiridas (opcional)"
            name="descripcion"
            type="textarea"
            rows={3}
            placeholder="Menciona logros, tecnologías aprendidas o enfoque del plan de estudios."
            value={formData.descripcion || ''}
            onChange={handleInputChange}
          />
        </form>
      </Modal>
    </div>
  );
}
