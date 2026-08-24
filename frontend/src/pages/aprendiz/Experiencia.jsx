import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { experienciaService } from '../../services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Alert from '../../components/common/Alert';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';

export default function Experiencia() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  async function loadData() {
    try {
      const res = await experienciaService.list(user.aprendiz_id);
      setData(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (item = null) => {
    setEditingId(item?.id || null);
    setFormData(item || { actualmente_trabaja: false });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({});
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData, aprendiz_id: user.aprendiz_id };
      
      if (editingId) {
        await experienciaService.update(editingId, payload);
        setMessage({ type: 'success', text: 'Experiencia actualizada.' });
      } else {
        await experienciaService.create(payload);
        setMessage({ type: 'success', text: 'Experiencia agregada.' });
      }
      handleCloseModal();
      loadData();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error al guardar.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta experiencia?')) return;
    try {
      await experienciaService.delete(id);
      setMessage({ type: 'success', text: 'Experiencia eliminada.' });
      loadData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al eliminar.' });
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Experiencia Laboral</h1>
          <p>Registra tus empleos anteriores, prácticas o proyectos relevantes</p>
        </div>
        <Button onClick={() => handleOpenModal()}>+ Agregar Experiencia</Button>
      </div>

      {message && <Alert variant={message.type} className="mb-6">{message.text}</Alert>}

      {data.length === 0 ? (
        <EmptyState 
          icon="💼"
          title="No tienes experiencia registrada"
          description="Si has trabajado antes, hecho prácticas o proyectos freelance, agrégalos aquí. Si no tienes experiencia, no te preocupes, enfócate en tus habilidades."
          action={<Button onClick={() => handleOpenModal()}>Agregar Experiencia</Button>}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {data.map(item => (
            <Card key={item.id} className="border-l-4 border-l-blue hover:shadow-md transition-shadow">
              <Card.Body className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold mb-1">{item.cargo}</h3>
                  <p className="text-lg text-blue font-medium mb-2">{item.empresa}</p>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-secondary mb-3">
                    <span className="flex items-center gap-1">
                      📅 {new Date(item.fecha_inicio).toLocaleDateString()} - {item.actualmente_trabaja ? 'Actualidad' : (item.fecha_fin ? new Date(item.fecha_fin).toLocaleDateString() : '')}
                    </span>
                  </div>
                  
                  {item.descripcion && (
                    <p className="text-sm mt-2 whitespace-pre-line text-gray-700 max-w-3xl">
                      {item.descripcion}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenModal(item)}>Editar</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-error">Eliminar</Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Agregar/Editar */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingId ? 'Editar Experiencia' : 'Agregar Experiencia'}</h3>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body flex flex-col gap-4">
                <Input label="Empresa" name="empresa" required value={formData.empresa || ''} onChange={handleInputChange} />
                <Input label="Cargo" name="cargo" required value={formData.cargo || ''} onChange={handleInputChange} />
                
                <div className="form-row">
                  <Input label="Fecha de Inicio" name="fecha_inicio" type="date" required value={formData.fecha_inicio?.split('T')[0] || ''} onChange={handleInputChange} />
                  <Input 
                    label="Fecha de Fin" 
                    name="fecha_fin" 
                    type="date" 
                    value={formData.fecha_fin?.split('T')[0] || ''} 
                    onChange={handleInputChange} 
                    disabled={formData.actualmente_trabaja}
                    required={!formData.actualmente_trabaja}
                  />
                </div>

                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="actualmente_trabaja" 
                    checked={formData.actualmente_trabaja || false}
                    onChange={handleInputChange} 
                  />
                  <span className="text-sm font-medium">Actualmente trabajo aquí</span>
                </label>

                <Input 
                  label="Descripción de Funciones (Opcional)" 
                  name="descripcion" 
                  type="textarea" 
                  value={formData.descripcion || ''} 
                  onChange={handleInputChange}
                  hint="Describe brevemente tus responsabilidades y logros"
                />
              </div>
              <div className="modal-footer">
                <Button variant="ghost" onClick={handleCloseModal}>Cancelar</Button>
                <Button type="submit" isLoading={saving}>Guardar Experiencia</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
