import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { empresaService } from '../../services';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';
import FormSection from '../../components/common/FormSection';
import Select from '../../components/common/Select';
import { mockEmpresas } from '../../data/mockData';

export default function PerfilEmpresa() {
  const { user, updateUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await empresaService.miEmpresa();
        if (res.data?.success && res.data.data) {
          setData(res.data.data);
        } else {
          setData(mockEmpresas[0]);
        }
      } catch (error) {
        setData(mockEmpresas[0]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.target);
    const updateData = Object.fromEntries(formData);

    try {
      if (data?.id) {
        await empresaService.update(data.id, updateData);
      }
      setData((prev) => ({ ...prev, ...updateData }));
      setToast('Perfil empresarial actualizado correctamente.');
      if (updateData.razon_social) {
        updateUser({ nombre: updateData.razon_social });
      }
    } catch (error) {
      setData((prev) => ({ ...prev, ...updateData }));
      setToast('Perfil empresarial actualizado (Modo Prototipo).');
      if (updateData.razon_social) {
        updateUser({ nombre: updateData.razon_social });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading fullPage={false} />;
  const emp = data || mockEmpresas[0];

  return (
    <div className="animate-fade">
      {toast && (
        <div className="toast-container">
          <Toast message={toast} type="success" onClose={() => setToast(null)} />
        </div>
      )}

      <div className="page-header mb-6">
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-navy)' }}>
          Perfil de la Organización
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Configura los datos corporativos, canales de contacto y descripción de la empresa.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        <div style={{ gridColumn: 'span 4' }} className="empresa-profile-side">
          <Card style={{ position: 'sticky', top: '90px' }}>
            <div className="card-body flex flex-col items-center text-center p-6">
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: 'var(--color-navy)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.75rem',
                  marginBottom: '16px'
                }}
              >
                {emp.razon_social ? emp.razon_social.charAt(0) : 'E'}
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-navy)' }}>
                {emp.razon_social}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                NIT: {emp.nit || '901.345.678-9'}
              </p>

              <div className="mt-4 w-full text-left">
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                  Estado de Habilitación
                </span>
                <Badge
                  variant={emp.estado === 'APROBADA' ? 'success' : emp.estado === 'PENDIENTE' ? 'warning' : 'error'}
                  className="w-full justify-center py-2"
                >
                  {emp.estado || 'APROBADA'}
                </Badge>
              </div>

              <div className="divider w-full" style={{ margin: '20px 0' }}></div>

              <div style={{ width: '100%', textAlign: 'left', fontSize: '0.85rem' }}>
                <div style={{ marginBottom: '10px' }}>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>
                    Sector Económico
                  </span>
                  <strong>{emp.sector_economico || emp.sector || 'Tecnología y Software'}</strong>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>
                    Ciudad
                  </span>
                  <strong>{emp.ciudad || 'Bogotá D.C.'}</strong>
                </div>
                {emp.sitio_web && (
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>
                      Página Web
                    </span>
                    <a
                      href={emp.sitio_web}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--color-primary)', wordBreak: 'break-all' }}
                    >
                      {emp.sitio_web}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div style={{ gridColumn: 'span 8' }} className="empresa-profile-main">
          <Card>
            <div className="card-body" style={{ padding: '32px' }}>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <FormSection
                  title="Identificación Legal"
                  description="Datos constitutivos y razón social de la entidad."
                >
                  <div className="form-row mb-4">
                    <Input
                      label="Razón Social"
                      name="razon_social"
                      defaultValue={emp.razon_social}
                      required
                    />
                    <Input
                      label="Número de Identificación Tributaria (NIT)"
                      name="nit"
                      value={emp.nit}
                      disabled
                      hint="Para modificar el NIT contacta con administración."
                    />
                  </div>

                  <div className="form-row">
                    <Input
                      label="Sector o Actividad Económica"
                      name="sector_economico"
                      defaultValue={emp.sector_economico || emp.sector || 'Tecnología y Software'}
                    />
                    <Select
                      label="Tamaño de la Organización"
                      name="tamano_empresa"
                      defaultValue={emp.tamano_empresa || 'Mediana (51-200 empleados)'}
                      options={[
                        'Microempresa (1-10 empleados)',
                        'Pequeña (11-50 empleados)',
                        'Mediana (51-200 empleados)',
                        'Grande (más de 200 empleados)'
                      ]}
                    />
                  </div>
                </FormSection>

                <FormSection
                  title="Contacto y Ubicación"
                  description="Canales para comunicación directa con el área de talento humano."
                >
                  <div className="form-row mb-4">
                    <Input
                      label="Ciudad Principal"
                      name="ciudad"
                      defaultValue={emp.ciudad || 'Bogotá D.C.'}
                      required
                    />
                    <Input
                      label="Dirección de la Sede"
                      name="direccion"
                      defaultValue={emp.direccion || 'Cra 15 # 93-60 Of. 402'}
                    />
                  </div>

                  <div className="form-row mb-4">
                    <Input
                      label="Teléfono Corporativo"
                      name="telefono_contacto"
                      defaultValue={emp.telefono_contacto || emp.telefono || '6017894561'}
                      required
                    />
                    <Input
                      label="Correo de Contacto para Aprendices"
                      name="email_contacto"
                      type="email"
                      defaultValue={emp.email_contacto || emp.correo_empresa || 'talento@empresa.com'}
                    />
                  </div>

                  <Input
                    label="Página Web Corporativa"
                    name="sitio_web"
                    type="url"
                    defaultValue={emp.sitio_web || 'https://empresa.com'}
                    placeholder="https://empresa.com"
                  />
                </FormSection>

                <FormSection
                  title="Presentación Institucional"
                  description="Breve reseña sobre los proyectos, propósito y entorno de aprendizaje que ofrece la empresa."
                >
                  <Input
                    label="Descripción de la Empresa"
                    name="descripcion"
                    type="textarea"
                    rows={4}
                    defaultValue={
                      emp.descripcion ||
                      'Empresa líder en desarrollo de soluciones digitales y consultoría tecnológica aliada con el SENA para impulsar el talento joven colombiano.'
                    }
                  />
                </FormSection>

                <div className="flex justify-end mt-2">
                  <Button type="submit" variant="primary" size="lg" loading={saving}>
                    Guardar datos de la empresa
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
