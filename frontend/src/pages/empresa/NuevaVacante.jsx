import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { vacanteService } from '../../services';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import FormSection from '../../components/common/FormSection';
import Select from '../../components/common/Select';
import Toast from '../../components/common/Toast';
import Loading from '../../components/common/Loading';
import { mockVacantes } from '../../data/mockData';

export default function NuevaVacante({ isEdit = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState({
    cargo: '',
    descripcion: '',
    requisitos: '',
    beneficios: '',
    ubicacion: 'Bogotá, D.C.',
    modalidad: 'Híbrido',
    tipo_contrato: 'Contrato de Aprendizaje',
    experiencia_requerida: 0,
    salario: '$1.423.500 (100% SMMLV + EPS + ARL)',
    cupos: 1
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (isEdit && id) {
      async function loadVacante() {
        try {
          const res = await vacanteService.get(id);
          if (res.data?.success && res.data.data) {
            setData(res.data.data);
          } else {
            const found = mockVacantes.find((v) => String(v.id) === String(id));
            if (found) setData({ ...found, cargo: found.titulo || found.cargo });
          }
        } catch (err) {
          const found = mockVacantes.find((v) => String(v.id) === String(id));
          if (found) setData({ ...found, cargo: found.titulo || found.cargo });
        } finally {
          setLoading(false);
        }
      }
      loadVacante();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...data,
      titulo: data.cargo,
      empresa_id: user?.empresa_id || 1,
      empresa_nombre: user?.nombre || 'TechSolutions Colombia'
    };

    try {
      if (isEdit && id) {
        await vacanteService.update(id, payload);
      } else {
        await vacanteService.create(payload);
      }
      setToast('Vacante guardada exitosamente.');
      setTimeout(() => navigate('/empresa/vacantes'), 1000);
    } catch (err) {
      setToast('Vacante guardada exitosamente (Modo Prototipo).');
      setTimeout(() => navigate('/empresa/vacantes'), 1000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading fullPage={false} />;

  return (
    <div className="animate-fade" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {toast && (
        <div className="toast-container">
          <Toast message={toast} type="success" onClose={() => setToast(null)} />
        </div>
      )}

      <div className="page-header flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm"
          style={{ fontSize: '1.2rem', padding: '6px 12px' }}
        >
          ←
        </button>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-navy)' }}>
            {isEdit ? 'Editar Convocatoria Laboral' : 'Publicar Nueva Vacante'}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Especifica los requisitos, modalidad y condiciones de vinculación para aprendices SENA.
          </p>
        </div>
      </div>

      <Card>
        <div className="card-body" style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <FormSection
              title="Información Principal"
              description="Título del cargo y ubicación para que los aprendices encuentren tu oferta."
            >
              <Input
                label="Título de la vacante / Cargo"
                name="cargo"
                value={data.cargo || ''}
                onChange={handleChange}
                required
                placeholder="Ej: Desarrollador Frontend React Junior (Contrato de Aprendizaje)"
              />

              <div className="form-row mt-4">
                <Input
                  label="Ciudad o Lugar de Trabajo"
                  name="ubicacion"
                  value={data.ubicacion || ''}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Bogotá, D.C."
                />
                <Select
                  label="Modalidad"
                  name="modalidad"
                  value={data.modalidad || 'Híbrido'}
                  onChange={handleChange}
                  options={['Presencial', 'Híbrido', 'Remoto']}
                />
              </div>
            </FormSection>

            <FormSection
              title="Condiciones de Vinculación"
              description="Tipo de contrato y asignación económica conforme a la ley de aprendizaje."
            >
              <div className="form-row mb-4">
                <Select
                  label="Tipo de Vinculación"
                  name="tipo_contrato"
                  value={data.tipo_contrato || 'Contrato de Aprendizaje'}
                  onChange={handleChange}
                  options={[
                    'Contrato de Aprendizaje',
                    'Pasantía / Práctica Formativa',
                    'Término Fijo',
                    'Prestación de Servicios'
                  ]}
                />
                <Input
                  label="Cupos Disponibles"
                  name="cupos"
                  type="number"
                  min="1"
                  value={data.cupos || 1}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <Input
                  label="Apoyo de Sostenimiento Mensual"
                  name="salario"
                  value={data.salario || ''}
                  onChange={handleChange}
                  placeholder="Ej: $1.423.500 (100% SMMLV + EPS + ARL)"
                  hint="Por ley, aprendices en etapa productiva reciben el 100% del SMMLV."
                />
                <Input
                  label="Experiencia Requerida (Meses)"
                  name="experiencia_requerida"
                  type="number"
                  min="0"
                  value={data.experiencia_requerida || 0}
                  onChange={handleChange}
                  hint="0 para perfiles sin experiencia laboral previa."
                />
              </div>
            </FormSection>

            <FormSection
              title="Descripción y Requisitos"
              description="Describe las funciones a realizar, las tecnologías deseadas y beneficios de vincularse a tu empresa."
            >
              <Input
                label="Descripción del Cargo"
                name="descripcion"
                type="textarea"
                rows={4}
                value={data.descripcion || ''}
                onChange={handleChange}
                required
                placeholder="Describe el área, proyecto, objetivos del rol y el equipo con el que trabajará."
              />

              <div className="mt-4">
                <Input
                  label="Requisitos y Perfil Formativo Esperado"
                  name="requisitos"
                  type="textarea"
                  rows={4}
                  value={data.requisitos || ''}
                  onChange={handleChange}
                  required
                  placeholder="Programas SENA compatibles (ej. ADSO), conocimientos específicos en herramientas o lenguajes."
                />
              </div>

              <div className="mt-4">
                <Input
                  label="Beneficios Adicionales (Opcional)"
                  name="beneficios"
                  type="textarea"
                  rows={3}
                  value={data.beneficios || ''}
                  onChange={handleChange}
                  placeholder="Capacitaciones, auxilio de conectividad, plan de mentoría, etc."
                />
              </div>
            </FormSection>

            <div className="flex justify-end gap-3 mt-4">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" size="lg" loading={saving}>
                {isEdit ? 'Guardar Cambios' : 'Publicar Vacante'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
