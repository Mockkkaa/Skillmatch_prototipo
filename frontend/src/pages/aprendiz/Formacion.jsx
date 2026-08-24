import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { formacionService } from '../../services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Alert from '../../components/common/Alert';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';

export default function Formacion() {
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
      const res = await formacionService.list(user.aprendiz_id);
      setData(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (item = null) => {
    setEditingId(item?.id || null);
    setFormData(item || { actualmente_cursando: false, estado: 'EN_CURSO', nivel: 'TECNICO' });
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
        await formacionService.update(editingId, payload);
        setMessage({ type: 'success', text: 'Formación actualizada.' });
      } else {
        await formacionService.create(payload);
        setMessage({ type: 'success', text: 'Formación agregada.' });
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
    if (!window.confirm('¿Seguro que deseas eliminar este registro?')) return;
    try {
      await formacionService.delete(id);
      setMessage({ type: 'success', text: 'Registro eliminado.' });
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
          <h1>Formación Académica</h1>
          <p>Registra tus estudios, cursos y programas del SENA</p>
        </div>
        <Button onClick={() => handleOpenModal()}>+ Agregar Formación</Button>
      </div>

      {message && <Alert variant={message.type} className="mb-6">{message.text}</Alert>}

      {data.length === 0 ? (
        <EmptyState 
          icon="🎓"
          title="No hay formación registrada"
          description="Agrega tus estudios secundarios, programas del SENA o cursos relevantes para mejorar tu perfil."
          action={<Button onClick={() => handleOpenModal()}>Agregar Formación</Button>}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {data.map(item => (
            <Card key={item.id} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
              <Card.Body className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold mb-1">{item.programa}</h3>
                  <p className="text-lg text-primary font-medium mb-2">{item.institucion}</p>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-secondary">
                    <span className="flex items-center gap-1">🏷️ {item.nivel.replace(/_/g, ' ')}</span>
                    <span className="flex items-center gap-1">
                      📅 {new Date(item.fecha_inicio).toLocaleDateString()} - {item.actualmente_cursando ? 'Actualidad' : (item.fecha_fin ? new Date(item.fecha_fin).toLocaleDateString() : '')}
                    </span>
                    <span className="flex items-center gap-1">📌 {item.estado.replace('_', ' ')}</span>
                  </div>
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
              <h3>{editingId ? 'Editar Formación' : 'Agregar Formación'}</h3>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body flex flex-col gap-4">
                <Input label="Institución Educativa" name="institucion" required value={formData.institucion || ''} onChange={handleInputChange} />
                <Input label="Programa / Título" name="programa" required value={formData.programa || ''} onChange={handleInputChange} />
                
                <Input label="Nivel Académico" name="nivel" type="select" required value={formData.nivel || ''} onChange={handleInputChange}>
                  <option value="BACHILLERATO">Bachillerato</option>
                  <option value="TECNICO">Técnico</option>
                  <option value="TECNOLOGO">Tecnólogo</option>
                  <option value="PROFESIONAL">Profesional</option>
                  <option value="ESPECIALIZACION">Especialización</option>
                  <option value="MAESTRIA">Maestría</option>
                  <option value="CURSO">Curso Corto</option>
                  <option value="OTRO">Otro</option>
                </Input>

                <div className="form-row">
                  <Input label="Fecha de Inicio" name="fecha_inicio" type="date" required value={formData.fecha_inicio?.split('T')[0] || ''} onChange={handleInputChange} />
                  <Input 
                    label="Fecha de Fin" 
                    name="fecha_fin" 
                    type="date" 
                    value={formData.fecha_fin?.split('T')[0] || ''} 
                    onChange={handleInputChange} 
                    disabled={formData.actualmente_cursando}
                    required={!formData.actualmente_cursando}
                  />
                </div>

                <div className="form-row items-center">
                  <label className="flex items-center gap-2 mt-4 cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="actualmente_cursando" 
                      checked={formData.actualmente_cursando || false}
                      onChange={handleInputChange} 
                    />
                    <span className="text-sm font-medium">Actualmente cursando</span>
                  </label>
                  
                  <Input label="Estado" name="estado" type="select" required value={formData.estado || ''} onChange={handleInputChange}>
                    <option value="EN_CURSO">En Curso</option>
                    <option value="GRADUADO">Graduado/Finalizado</option>
                    <option value="INCOMPLETO">Incompleto / Aplazado</option>
                  </Input>
                </div>
              </div>
              <div className="modal-footer">
                <Button variant="ghost" onClick={handleCloseModal}>Cancelar</Button>
                <Button type="submit" isLoading={saving}>Guardar Formación</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
