import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hojaVidaService } from '../../services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function HojaVida() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        if (!user?.aprendiz_id) return;
        const res = await hojaVidaService.getByAprendiz(user.aprendiz_id);
        setData(res.data.data);
      } catch (error) {
        console.error("Error loading CV", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.target);
    const updateData = Object.fromEntries(formData);
    
    // Checkbox mapping
    updateData.visible = formData.get('visible') ? 1 : 0;

    try {
      await hojaVidaService.update(data.id, updateData);
      setData({ ...data, ...updateData });
      setEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (!data) return <p>Error al cargar la hoja de vida.</p>;

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Mi Hoja de Vida</h1>
          <p>Vista completa de tu perfil profesional</p>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => window.print()}>🖨️ Imprimir / PDF</Button>
          <Button onClick={() => setEditing(!editing)}>{editing ? 'Cancelar' : '✏️ Editar Preferencias'}</Button>
        </div>
      </div>

      <div className="grid grid-3 gap-8">
        <div className="col-span-1 flex flex-col gap-6">
          {/* Card de Configuración de CV */}
          {editing ? (
            <Card className="border-primary">
              <Card.Header className="bg-primary-light">
                <h3 className="text-primary-dark">Editar Preferencias</h3>
              </Card.Header>
              <Card.Body>
                <form onSubmit={handleSave} className="flex flex-col gap-4">
                  <Input label="Objetivo Profesional" name="objetivo_profesional" type="textarea" defaultValue={data.objetivo_profesional} />
                  <Input label="Disponibilidad" name="disponibilidad" type="select" defaultValue={data.disponibilidad}>
                    <option value="INMEDIATA">Inmediata</option>
                    <option value="EN_15_DIAS">En 15 días</option>
                    <option value="EN_1_MES">En 1 mes</option>
                    <option value="NEGOCIABLE">Negociable</option>
                  </Input>
                  <Input label="Modalidad Preferida" name="modalidad_preferida" type="select" defaultValue={data.modalidad_preferida}>
                    <option value="INDIFERENTE">Indiferente</option>
                    <option value="PRESENCIAL">Presencial</option>
                    <option value="REMOTO">Remoto</option>
                    <option value="HIBRIDO">Híbrido</option>
                  </Input>
                  <Input label="Salario Esperado" name="salario_esperado" type="number" defaultValue={data.salario_esperado} />
                  
                  <label className="flex items-center gap-2 mt-2">
                    <input type="checkbox" name="visible" defaultChecked={data.visible === 1} />
                    <span className="text-sm font-medium">Hoja de vida visible para empresas</span>
                  </label>

                  <div className="flex justify-end mt-4">
                    <Button type="submit" isLoading={saving} size="sm">Guardar Preferencias</Button>
                  </div>
                </form>
              </Card.Body>
            </Card>
          ) : (
            <Card>
              <Card.Header>
                <h3>Preferencias de Búsqueda</h3>
              </Card.Header>
              <Card.Body>
                <div className="flex flex-col gap-4 text-sm">
                  <div>
                    <span className="text-secondary block mb-1">Visibilidad</span>
                    <Badge variant={data.visible ? 'success' : 'gray'}>{data.visible ? 'Pública' : 'Oculta'}</Badge>
                  </div>
                  <div>
                    <span className="text-secondary block mb-1">Disponibilidad</span>
                    <p className="font-medium">{data.disponibilidad?.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <span className="text-secondary block mb-1">Modalidad Preferida</span>
                    <p className="font-medium">{data.modalidad_preferida}</p>
                  </div>
                  {data.salario_esperado && (
                    <div>
                      <span className="text-secondary block mb-1">Aspiración Salarial</span>
                      <p className="font-medium">${Number(data.salario_esperado).toLocaleString()}</p>
                    </div>
                  )}
                  {data.objetivo_profesional && (
                    <div>
                      <span className="text-secondary block mb-1">Objetivo Profesional</span>
                      <p className="italic">"{data.objetivo_profesional}"</p>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Habilidades Card */}
          <Card>
            <Card.Header>
              <h3>Habilidades</h3>
            </Card.Header>
            <Card.Body>
              {data.habilidades?.length === 0 ? (
                <p className="text-sm text-secondary">Aún no has agregado habilidades.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {data.habilidades?.map(h => (
                    <Badge key={h.id} variant={h.tipo === 'BLANDA' ? 'purple' : h.tipo === 'TECNICA' ? 'blue' : 'gray'}>
                      {h.nombre} ({h.nivel.substring(0,3)})
                    </Badge>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* Vista previa principal de la Hoja de Vida */}
        <div className="col-span-2" style={{ gridColumn: 'span 2' }}>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden" id="cv-print-area">
            {/* Header del CV */}
            <div className="bg-blue text-white p-8">
              <div className="flex gap-6 items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-white/20 border-2 border-white flex-shrink-0 flex items-center justify-center text-3xl">
                  {data.foto_perfil ? (
                    <img src={`http://localhost:3001${data.foto_perfil}`} alt={data.nombre} className="w-full h-full object-cover" />
                  ) : (
                    data.nombre?.charAt(0)
                  )}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{data.nombre} {data.apellido}</h2>
                  <p className="text-blue-light text-lg mb-2">{data.programa || 'Aprendiz SENA'}</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mt-4 text-blue-light">
                    <span className="flex items-center gap-1">✉️ {data.correo}</span>
                    {data.telefono && <span className="flex items-center gap-1">📱 {data.telefono}</span>}
                    {data.ciudad && <span className="flex items-center gap-1">📍 {data.ciudad}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Perfil Profesional */}
            {data.perfil_profesional && (
              <div className="p-8 border-b border-gray-100">
                <h3 className="text-lg font-bold text-blue mb-4 flex items-center gap-2">
                  <span>👤</span> Perfil Profesional
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.perfil_profesional}</p>
              </div>
            )}

            {/* Formación */}
            <div className="p-8 border-b border-gray-100">
              <h3 className="text-lg font-bold text-blue mb-4 flex items-center gap-2">
                <span>🎓</span> Formación Académica
              </h3>
              
              {data.formacion?.length === 0 ? (
                <p className="text-gray-500 italic">No hay formación registrada.</p>
              ) : (
                <div className="flex flex-col gap-6">
                  {data.formacion?.map(f => (
                    <div key={f.id} className="relative pl-6 border-l-2 border-primary-light">
                      <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1"></div>
                      <h4 className="font-bold text-gray-900">{f.programa}</h4>
                      <p className="text-primary font-medium text-sm my-1">{f.institucion}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{f.nivel} • {f.estado.replace('_', ' ')}</span>
                        <span>{new Date(f.fecha_inicio).getFullYear()} - {f.fecha_fin ? new Date(f.fecha_fin).getFullYear() : 'Actual'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Experiencia */}
            <div className="p-8">
              <h3 className="text-lg font-bold text-blue mb-4 flex items-center gap-2">
                <span>💼</span> Experiencia Laboral
              </h3>
              
              {data.experiencias?.length === 0 ? (
                <p className="text-gray-500 italic">No hay experiencia laboral registrada.</p>
              ) : (
                <div className="flex flex-col gap-6">
                  {data.experiencias?.map(e => (
                    <div key={e.id} className="relative pl-6 border-l-2 border-blue-light">
                      <div className="absolute w-3 h-3 bg-blue rounded-full -left-[7px] top-1"></div>
                      <h4 className="font-bold text-gray-900">{e.cargo}</h4>
                      <p className="text-blue font-medium text-sm my-1">{e.empresa}</p>
                      <div className="text-sm text-gray-500 mb-2">
                        {new Date(e.fecha_inicio).toLocaleDateString()} - {e.actualmente_trabaja ? 'Presente' : e.fecha_fin ? new Date(e.fecha_fin).toLocaleDateString() : ''}
                      </div>
                      {e.descripcion && <p className="text-gray-700 text-sm whitespace-pre-line">{e.descripcion}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #cv-print-area, #cv-print-area * { visibility: visible; }
          #cv-print-area { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; border: none; }
          .page-header, .sidebar, .header { display: none !important; }
        }
      `}} />
    </div>
  );
}
