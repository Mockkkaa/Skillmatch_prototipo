import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { vacanteService } from '../../services';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';

export default function NuevaVacante({ isEdit = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [data, setData] = useState({
    cargo: '',
    descripcion: '',
    requisitos: '',
    ubicacion: '',
    modalidad: 'PRESENCIAL',
    tipo_contrato: 'INDEFINIDO',
    experiencia_requerida: 0,
    salario: ''
  });
  
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit && id) {
      async function loadVacante() {
        try {
          const res = await vacanteService.get(id);
          const v = res.data.data;
          setData({
            cargo: v.cargo,
            descripcion: v.descripcion,
            requisitos: v.requisitos,
            ubicacion: v.ubicacion,
            modalidad: v.modalidad,
            tipo_contrato: v.tipo_contrato,
            experiencia_requerida: v.experiencia_requerida,
            salario: v.salario || ''
          });
        } catch (err) {
          setError('Error al cargar la vacante.');
        } finally {
          setLoading(false);
        }
      }
      loadVacante();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = { ...data, empresa_id: user.empresa_id };

    try {
      if (isEdit) {
        await vacanteService.update(id, payload);
      } else {
        await vacanteService.create(payload);
      }
      navigate('/empresa/vacantes');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la vacante.');
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto animate-fade">
      <div className="page-header flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="btn btn-ghost text-2xl px-2">←</button>
        <div>
          <h1>{isEdit ? 'Editar Vacante' : 'Publicar Nueva Vacante'}</h1>
          <p>Completa los detalles de la oferta laboral para atraer aprendices.</p>
        </div>
      </div>

      {error && <Alert variant="error" className="mb-6">{error}</Alert>}

      <Card>
        <Card.Body>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="form-row">
              <Input 
                label="Título del Cargo" 
                name="cargo" 
                value={data.cargo} 
                onChange={handleChange} 
                required 
                placeholder="Ej: Desarrollador Junior React" 
              />
              <Input 
                label="Ubicación" 
                name="ubicacion" 
                value={data.ubicacion} 
                onChange={handleChange} 
                required 
                placeholder="Ej: Bogotá o Remoto" 
              />
            </div>

            <div className="form-row">
              <Input 
                label="Modalidad" 
                name="modalidad" 
                type="select" 
                value={data.modalidad} 
                onChange={handleChange} 
                required
              >
                <option value="PRESENCIAL">Presencial</option>
                <option value="REMOTO">Remoto</option>
                <option value="HIBRIDO">Híbrido</option>
              </Input>

              <Input 
                label="Tipo de Contrato" 
                name="tipo_contrato" 
                type="select" 
                value={data.tipo_contrato} 
                onChange={handleChange} 
                required
              >
                <option value="APRENDIZAJE">Contrato de Aprendizaje</option>
                <option value="INDEFINIDO">Término Indefinido</option>
                <option value="FIJO">Término Fijo</option>
                <option value="PRESTACION_SERVICIOS">Prestación de Servicios</option>
                <option value="OBRA_LABOR">Obra o Labor</option>
              </Input>
            </div>

            <div className="form-row">
              <Input 
                label="Experiencia Requerida (Meses)" 
                name="experiencia_requerida" 
                type="number" 
                value={data.experiencia_requerida} 
                onChange={handleChange} 
                min="0"
                hint="Usa 0 para vacantes que no requieren experiencia" 
              />
              <Input 
                label="Salario Ofrecido" 
                name="salario" 
                type="number" 
                value={data.salario} 
                onChange={handleChange} 
                placeholder="Ej: 1500000" 
                hint="Opcional. Deja en blanco si es confidencial." 
              />
            </div>

            <Input 
              label="Descripción de la Vacante" 
              name="descripcion" 
              type="textarea" 
              value={data.descripcion} 
              onChange={handleChange} 
              required 
              hint="Describe el propósito del cargo y las responsabilidades principales." 
            />

            <Input 
              label="Requisitos" 
              name="requisitos" 
              type="textarea" 
              value={data.requisitos} 
              onChange={handleChange} 
              required 
              hint="Lista las habilidades técnicas, blandas y conocimientos esperados." 
            />

            <div className="flex justify-end gap-4 mt-4">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancelar</Button>
              <Button type="submit" isLoading={saving}>{isEdit ? 'Guardar Cambios' : 'Publicar Vacante'}</Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
}
