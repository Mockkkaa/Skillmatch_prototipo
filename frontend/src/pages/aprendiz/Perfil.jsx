import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { aprendizService, userService } from '../../services';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import Avatar from '../../components/common/Avatar';
import Toast from '../../components/common/Toast';
import FormSection from '../../components/common/FormSection';
import Select from '../../components/common/Select';
import { mockAprendices } from '../../data/mockData';

const DEFAULT_PROGRAMAS = [
  { id: 1, nombre: 'Análisis y Desarrollo de Software (ADSO)', nivel: 'Tecnólogo' },
  { id: 2, nombre: 'Gestión Administrativa', nivel: 'Tecnólogo' },
  { id: 3, nombre: 'Mantenimiento de Redes de Datos', nivel: 'Técnico' },
  { id: 4, nombre: 'Contabilidad y Finanzas', nivel: 'Tecnólogo' },
  { id: 5, nombre: 'Gestión del Talento Humano', nivel: 'Tecnólogo' }
];

export default function Perfil() {
  const { user, updateUser } = useAuth();
  const [data, setData] = useState(null);
  const [programas, setProgramas] = useState(DEFAULT_PROGRAMAS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        const id = user?.aprendiz_id || 1;
        const [apRes, progRes] = await Promise.all([
          aprendizService.get(id).catch(() => null),
          userService.getProgramas().catch(() => null)
        ]);

        if (apRes?.data?.success && apRes.data.data) {
          setData(apRes.data.data);
        } else {
          setData(mockAprendices[0]);
        }

        if (progRes?.data?.success && Array.isArray(progRes.data.data) && progRes.data.data.length > 0) {
          setProgramas(progRes.data.data);
        }
      } catch (error) {
        setData(mockAprendices[0]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.target);
    const updateData = Object.fromEntries(formData);

    try {
      const id = user?.aprendiz_id || 1;
      await aprendizService.update(id, updateData);
      setData(prev => ({ ...prev, ...updateData }));
      setToast('Perfil actualizado correctamente.');

      if (updateData.nombre || updateData.apellido) {
        updateUser({
          nombre: `${updateData.nombre || ''} ${updateData.apellido || ''}`.trim()
        });
      }
    } catch (error) {
      // Mock update fallback
      setData(prev => ({ ...prev, ...updateData }));
      setToast('Perfil actualizado correctamente (Modo Prototipo).');
      if (updateData.nombre) {
        updateUser({ nombre: `${updateData.nombre} ${updateData.apellido || ''}`.trim() });
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local object URL for instant UI feedback
    const localUrl = URL.createObjectURL(file);
    setData(prev => ({ ...prev, foto_url: localUrl }));
    updateUser({ foto_perfil: localUrl });
    setToast('Foto de perfil actualizada.');
  };

  if (loading) return <Loading fullPage={false} />;
  if (!data) return <Alert variant="error">Error al cargar datos del perfil.</Alert>;

  const fullName = `${data.nombre || ''} ${data.apellido || ''}`.trim() || user?.nombre || 'Juan Camilo Pérez';

  return (
    <div className="animate-fade">
      {toast && (
        <div className="toast-container">
          <Toast message={toast} type="success" onClose={() => setToast(null)} />
        </div>
      )}

      <div className="page-header mb-6">
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-navy)' }}>
          Mi Información Personal
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Mantén tus datos actualizados para que las empresas aliadas te contacten oportunamente.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        {/* Left Column: Avatar & Summary */}
        <div style={{ gridColumn: 'span 4' }} className="profile-side-column">
          <Card style={{ position: 'sticky', top: '90px' }}>
            <div className="card-body flex flex-col items-center text-center p-6">
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <Avatar
                  src={data.foto_url}
                  name={fullName}
                  size="xl"
                  style={{ width: '96px', height: '96px', fontSize: '2rem' }}
                />
              </div>

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handlePhotoUpload}
              />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="mb-4"
              >
                📷 Cambiar fotografía
              </Button>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy)' }}>
                {fullName}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                {data.email || data.correo || user?.email || 'correo@soy.sena.edu.co'}
              </p>

              <div className="divider w-full" style={{ margin: '16px 0' }}></div>

              <div style={{ textAlign: 'left', width: '100%', fontSize: '0.85rem' }}>
                <div style={{ marginBottom: '10px' }}>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>
                    Documento de Identidad
                  </span>
                  <strong>{data.tipo_documento || 'CC'} {data.numero_documento || data.documento || '1020304050'}</strong>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>
                    Estado SENA
                  </span>
                  <strong style={{ color: 'var(--color-primary)' }}>
                    {data.estado_formacion || 'Etapa Productiva'}
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>
                    Ficha de Caracterización
                  </span>
                  <strong>{data.ficha_sena || data.numero_ficha || '2670145'}</strong>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Editable Profile Form */}
        <div style={{ gridColumn: 'span 8' }} className="profile-main-column">
          <Card>
            <div className="card-body" style={{ padding: '32px' }}>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <FormSection
                  title="Datos Básicos"
                  description="Información de contacto personal y ubicación residencial."
                >
                  <div className="form-row mb-4">
                    <Input
                      label="Nombres"
                      name="nombre"
                      defaultValue={data.nombre || 'Juan Camilo'}
                      required
                    />
                    <Input
                      label="Apellidos"
                      name="apellido"
                      defaultValue={data.apellido || 'Pérez Silva'}
                      required
                    />
                  </div>

                  <div className="form-row mb-4">
                    <Input
                      label="Teléfono Celular"
                      name="telefono"
                      type="tel"
                      defaultValue={data.telefono || '3124567890'}
                      placeholder="3124567890"
                    />
                    <Input
                      label="Ciudad de Residencia"
                      name="ciudad"
                      defaultValue={data.ciudad || 'Bogotá D.C.'}
                    />
                  </div>

                  <Input
                    label="Dirección de Residencia"
                    name="direccion"
                    defaultValue={data.direccion || 'Calle 45 # 28-15'}
                    placeholder="Calle, Carrera, Barrio"
                  />
                </FormSection>

                <FormSection
                  title="Formación SENA"
                  description="Datos del programa técnico o tecnológico que cursas actualmente."
                >
                  <div className="form-group mb-4">
                    <label className="form-label">Programa Formativo SENA</label>
                    <select
                      name="programa_formacion_id"
                      className="form-select"
                      defaultValue={data.programa_formacion_id || '1'}
                    >
                      {programas.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre} ({p.nivel})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row mb-4">
                    <Input
                      label="Número de Ficha"
                      name="numero_ficha"
                      defaultValue={data.ficha_sena || data.numero_ficha || '2670145'}
                    />
                    <Select
                      label="Nivel de Formación"
                      name="nivel_formacion"
                      defaultValue={data.nivel_formacion || 'Tecnólogo'}
                      options={['Técnico', 'Tecnólogo', 'Especialización Tecnológica']}
                    />
                  </div>

                  <div className="form-row">
                    <Input
                      label="Centro de Formación"
                      name="centro_formacion"
                      defaultValue={data.centro_formacion || 'Centro de Servicios y Gestión Empresarial'}
                    />
                    <Select
                      label="Estado de Formación"
                      name="estado_formacion"
                      defaultValue={data.estado_formacion || 'Etapa Productiva'}
                      options={['Etapa Lectiva', 'Etapa Productiva', 'Egresado / Graduado']}
                    />
                  </div>
                </FormSection>

                <FormSection
                  title="Perfil y Resumen Profesional"
                  description="Describe brevemente tus fortalezas, áreas de interés e impacto profesional."
                >
                  <Input
                    label="Resumen Profesional"
                    name="perfil_profesional"
                    type="textarea"
                    rows={4}
                    defaultValue={
                      data.perfil_profesional ||
                      'Aprendiz SENA del programa ADSO con sólida formación en desarrollo frontend y backend. Apasionado por construir interfaces intuitivas, responsivas y accesibles con React, JavaScript y Node.js.'
                    }
                    hint="Máximo 500 caracteres recomendados."
                  />
                </FormSection>

                <div className="flex justify-end gap-3 mt-4">
                  <Button type="submit" variant="primary" size="lg" loading={saving}>
                    Guardar cambios
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
