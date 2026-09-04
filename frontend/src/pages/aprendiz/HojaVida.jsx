import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hojaVidaService } from '../../services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Toast from '../../components/common/Toast';
import Avatar from '../../components/common/Avatar';
import Select from '../../components/common/Select';
import { mockAprendices, mockFormacion, mockExperiencia, mockHabilidades } from '../../data/mockData';

export default function HojaVida() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const id = user?.aprendiz_id || 1;
        const res = await hojaVidaService.getByAprendiz(id);
        if (res.data?.success && res.data.data) {
          setData(res.data.data);
        } else {
          buildMockCv();
        }
      } catch (error) {
        buildMockCv();
      } finally {
        setLoading(false);
      }
    }

    function buildMockCv() {
      const ap = mockAprendices[0];
      setData({
        ...ap,
        visible: 1,
        disponibilidad: 'Inmediata (Etapa Productiva)',
        modalidad_preferida: 'Híbrido o Remoto',
        salario_esperado: 1423500,
        objetivo_profesional:
          'Consolidar mis competencias en desarrollo web y aportar valor en equipos ágiles construyendo soluciones de software de alto impacto.',
        formacion: mockFormacion,
        experiencias: mockExperiencia,
        habilidades: mockHabilidades
      });
    }

    loadData();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.target);
    const updateData = Object.fromEntries(formData);
    updateData.visible = formData.get('visible') ? 1 : 0;

    try {
      if (data?.id) {
        await hojaVidaService.update(data.id, updateData);
      }
      setData((prev) => ({ ...prev, ...updateData }));
      setToast('Preferencias de la hoja de vida actualizadas.');
      setEditing(false);
    } catch (error) {
      setData((prev) => ({ ...prev, ...updateData }));
      setToast('Preferencias actualizadas (Modo Prototipo).');
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading fullPage={false} />;
  if (!data) return <p>No se pudo cargar la hoja de vida.</p>;

  const fullName = `${data.nombre || ''} ${data.apellido || ''}`.trim() || user?.nombre || 'Juan Camilo Pérez Silva';

  return (
    <div className="animate-fade">
      {toast && (
        <div className="toast-container">
          <Toast message={toast} type="success" onClose={() => setToast(null)} />
        </div>
      )}

      <div className="page-header flex justify-between items-center flex-wrap gap-4 mb-6">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-navy)' }}>
            Mi Hoja de Vida
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Vista curricular estandarizada para postulaciones ante empresas y el SENA.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => window.print()}>
            🖨️ Imprimir / Guardar PDF
          </Button>
          <Button variant="primary" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancelar edición' : '✏️ Editar preferencias'}
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        {/* Left Side: Preferences & Skills */}
        <div style={{ gridColumn: 'span 4' }} className="cv-sidebar-column">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {editing ? (
              <Card style={{ border: '2px solid var(--color-primary)' }}>
                <div className="card-header" style={{ background: 'var(--color-primary-light)' }}>
                  <h3 style={{ fontSize: '1rem', color: 'var(--color-primary-dark)' }}>
                    Editar Preferencias Laborales
                  </h3>
                </div>
                <div className="card-body" style={{ padding: '20px' }}>
                  <form onSubmit={handleSave} className="flex flex-col gap-4">
                    <Input
                      label="Objetivo profesional"
                      name="objetivo_profesional"
                      type="textarea"
                      rows={3}
                      defaultValue={data.objetivo_profesional}
                    />

                    <Select
                      label="Disponibilidad de vinculación"
                      name="disponibilidad"
                      defaultValue={data.disponibilidad || 'Inmediata'}
                      options={['Inmediata', 'En 15 días', 'En 1 mes', 'Negociable']}
                    />

                    <Select
                      label="Modalidad preferida"
                      name="modalidad_preferida"
                      defaultValue={data.modalidad_preferida || 'Híbrido'}
                      options={['Presencial', 'Híbrido', 'Remoto', 'Indiferente']}
                    />

                    <Input
                      label="Aspiración de apoyo económico ($ COP)"
                      name="salario_esperado"
                      type="number"
                      defaultValue={data.salario_esperado || 1423500}
                    />

                    <label className="flex items-center gap-2 cursor-pointer mt-2">
                      <input
                        type="checkbox"
                        name="visible"
                        defaultChecked={data.visible === 1 || data.visible === true}
                      />
                      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                        Perfil visible en búsquedas de empresas
                      </span>
                    </label>

                    <div className="flex justify-end gap-2 mt-4">
                      <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" variant="primary" size="sm" loading={saving}>
                        Guardar cambios
                      </Button>
                    </div>
                  </form>
                </div>
              </Card>
            ) : (
              <Card>
                <div className="card-header">
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)' }}>
                    Preferencias de Búsqueda
                  </h3>
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>
                      Visibilidad en la plataforma
                    </span>
                    <Badge variant={data.visible ? 'success' : 'gray'}>
                      {data.visible ? 'Visible para empresas' : 'Privada / Oculta'}
                    </Badge>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>
                      Disponibilidad
                    </span>
                    <strong>{data.disponibilidad || 'Inmediata'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>
                      Modalidad deseada
                    </span>
                    <strong>{data.modalidad_preferida || 'Híbrido'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>
                      Aspiración de sostenimiento
                    </span>
                    <strong style={{ color: 'var(--color-primary)' }}>
                      ${Number(data.salario_esperado || 1423500).toLocaleString()} COP
                    </strong>
                  </div>
                </div>
              </Card>
            )}

            {/* Habilidades Card */}
            <Card>
              <div className="card-header">
                <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)' }}>
                  Competencias y Habilidades
                </h3>
              </div>
              <div className="card-body" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(data.habilidades || mockHabilidades).map((h) => (
                    <span
                      key={h.id}
                      style={{
                        padding: '4px 10px',
                        background: h.categoria === 'Blanda' ? '#f3e8ff' : 'var(--color-primary-light)',
                        color: h.categoria === 'Blanda' ? '#7c3aed' : 'var(--color-primary-dark)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 600
                      }}
                    >
                      {h.nombre} • {h.nivel}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Side: Professional CV Preview Document */}
        <div style={{ gridColumn: 'span 8' }} className="cv-main-column">
          <div
            id="cv-print-area"
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--color-border)',
              overflow: 'hidden'
            }}
          >
            {/* Header Navy Block */}
            <div
              style={{
                background: 'linear-gradient(135deg, #0B132B 0%, #162040 100%)',
                color: '#FFFFFF',
                padding: '36px 32px'
              }}
            >
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                <Avatar
                  src={data.foto_url}
                  name={fullName}
                  size="xl"
                  style={{
                    width: '88px',
                    height: '88px',
                    border: '3px solid rgba(255, 255, 255, 0.2)',
                    fontSize: '1.8rem',
                    flexShrink: 0
                  }}
                />
                <div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
                    {fullName}
                  </h2>
                  <p style={{ color: 'var(--color-secondary)', fontSize: '1.05rem', fontWeight: 600 }}>
                    {data.programa_formacion || data.programa || 'Análisis y Desarrollo de Software (ADSO)'}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '16px',
                      fontSize: '0.85rem',
                      color: 'rgba(255, 255, 255, 0.75)',
                      marginTop: '12px'
                    }}
                  >
                    <span>✉️ {data.email || data.correo || user?.email || 'juan.perez@soy.sena.edu.co'}</span>
                    {data.telefono && <span>📱 {data.telefono}</span>}
                    <span>📍 {data.ciudad || 'Bogotá D.C.'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Perfil Profesional */}
            <div style={{ padding: '32px', borderBottom: '1px solid var(--color-border-light)' }}>
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--color-navy)',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>👤</span> Perfil Profesional
              </h3>
              <p style={{ color: 'var(--color-text)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {data.perfil_profesional ||
                  'Aprendiz SENA del programa ADSO con formación en desarrollo frontend y backend. Apasionado por construir interfaces intuitivas y limpias.'}
              </p>
            </div>

            {/* Formación Académica */}
            <div style={{ padding: '32px', borderBottom: '1px solid var(--color-border-light)' }}>
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--color-navy)',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>🎓</span> Formación Académica
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {((data.formacion && data.formacion.length > 0) ? data.formacion : mockFormacion).map((f) => (
                  <div
                    key={f.id}
                    style={{
                      position: 'relative',
                      paddingLeft: '24px',
                      borderLeft: '2px solid var(--color-primary-light)'
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        width: '10px',
                        height: '10px',
                        background: 'var(--color-primary)',
                        borderRadius: '50%',
                        left: '-6px',
                        top: '4px'
                      }}
                    ></div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-navy)' }}>
                      {f.titulo || f.programa}
                    </h4>
                    <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem', margin: '2px 0' }}>
                      {f.institucion}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {f.nivel_educativo || f.nivel || 'Tecnólogo'} •{' '}
                      {f.fecha_inicio ? f.fecha_inicio.slice(0, 4) : '2023'} —{' '}
                      {f.en_curso || f.actualmente_cursando ? 'En curso' : (f.fecha_fin ? f.fecha_fin.slice(0, 4) : 'Finalizado')}
                    </span>
                    {f.descripcion && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
                        {f.descripcion}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Experiencia Laboral */}
            <div style={{ padding: '32px' }}>
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--color-navy)',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>🏢</span> Experiencia y Proyectos
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {((data.experiencias && data.experiencias.length > 0) ? data.experiencias : mockExperiencia).map((e) => (
                  <div
                    key={e.id}
                    style={{
                      position: 'relative',
                      paddingLeft: '24px',
                      borderLeft: '2px solid var(--color-blue-light)'
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        width: '10px',
                        height: '10px',
                        background: 'var(--color-navy)',
                        borderRadius: '50%',
                        left: '-6px',
                        top: '4px'
                      }}
                    ></div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-navy)' }}>
                      {e.cargo}
                    </h4>
                    <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem', margin: '2px 0' }}>
                      {e.empresa}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {e.fecha_inicio ? e.fecha_inicio.slice(0, 7) : '2024-02'} —{' '}
                      {e.actualmente_trabaja || e.en_curso ? 'Presente' : (e.fecha_fin ? e.fecha_fin.slice(0, 7) : '2024-11')}
                    </span>
                    {e.descripcion && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text)', marginTop: '6px', lineHeight: 1.5 }}>
                        {e.descripcion}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Stylesheet */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body * { visibility: hidden; }
          #cv-print-area, #cv-print-area * { visibility: visible; }
          #cv-print-area { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; border: none; }
          .page-header, .sidebar, .header, .cv-sidebar-column { display: none !important; }
        }
      `
        }}
      />
    </div>
  );
}
