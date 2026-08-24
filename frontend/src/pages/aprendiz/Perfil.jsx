import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { aprendizService, userService } from '../../services';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';

export default function Perfil() {
  const { user, updateUser } = useAuth();
  const [data, setData] = useState(null);
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        if (!user?.aprendiz_id) return;
        const [apRes, progRes] = await Promise.all([
          aprendizService.get(user.aprendiz_id),
          userService.getProgramas()
        ]);
        setData(apRes.data.data);
        setProgramas(progRes.data.data);
      } catch (error) {
        console.error("Error loading profile", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    const formData = new FormData(e.target);
    const updateData = Object.fromEntries(formData);
    
    try {
      await aprendizService.update(user.aprendiz_id, updateData);
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente.' });
      
      // Update local user context if name changed
      if (updateData.nombre !== user.nombre || updateData.apellido !== user.apellido) {
        updateUser({ nombre: updateData.nombre, apellido: updateData.apellido });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error al actualizar perfil.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('foto', file);

    try {
      const res = await aprendizService.uploadFoto(user.aprendiz_id, formData);
      setData({ ...data, foto_perfil: res.data.foto_perfil });
      updateUser({ foto_perfil: res.data.foto_perfil });
      setMessage({ type: 'success', text: 'Foto actualizada correctamente.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error al subir la foto.' });
    }
  };

  if (loading) return <Loading />;
  if (!data) return <Alert variant="error">Error al cargar datos del perfil.</Alert>;

  return (
    <div>
      <div className="page-header">
        <h1>Mi Perfil</h1>
        <p>Administra tu información personal y académica</p>
      </div>

      {message && (
        <Alert variant={message.type} className="mb-6">
          {message.text}
        </Alert>
      )}

      <div className="grid grid-3 gap-8">
        <div className="col-span-1">
          <Card>
            <Card.Body className="flex flex-col items-center text-center">
              <div className="avatar avatar-xl mb-4 relative group">
                {data.foto_perfil ? (
                  <img src={`http://localhost:3001${data.foto_perfil}`} alt={data.nombre} />
                ) : (
                  data.nombre?.charAt(0)
                )}
                
                <div 
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-white"
                  onClick={() => fileInputRef.current?.click()}
                >
                  📷
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
              />
              <h3 className="font-bold">{data.nombre} {data.apellido}</h3>
              <p className="text-sm text-secondary">{data.correo}</p>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-4"
                onClick={() => fileInputRef.current?.click()}
              >
                Cambiar foto
              </Button>
            </Card.Body>
          </Card>
        </div>

        <div className="col-span-2" style={{ gridColumn: 'span 2' }}>
          <Card>
            <Card.Header>
              <h3>Información Personal</h3>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="form-row">
                  <Input label="Nombre" name="nombre" defaultValue={data.nombre} required />
                  <Input label="Apellido" name="apellido" defaultValue={data.apellido} required />
                </div>
                
                <div className="form-row">
                  <Input label="Documento" value={data.documento} disabled hint="No se puede cambiar" />
                  <Input label="Correo" value={data.correo} disabled hint="No se puede cambiar" />
                </div>

                <div className="form-row">
                  <Input label="Teléfono" name="telefono" defaultValue={data.telefono} />
                  <Input label="Ciudad" name="ciudad" defaultValue={data.ciudad} />
                </div>

                <div className="divider"></div>
                <h4 className="font-bold text-lg mb-2">Información SENA</h4>

                <Input label="Programa de Formación" name="programa_formacion_id" type="select" defaultValue={data.programa_id || ''}>
                  <option value="">Selecciona tu programa...</option>
                  {programas.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre} ({p.nivel})</option>
                  ))}
                </Input>

                <div className="form-row">
                  <Input label="Número de Ficha" name="numero_ficha" defaultValue={data.numero_ficha} />
                  <Input label="Nivel de Formación" name="nivel_formacion" type="select" defaultValue={data.nivel_formacion || ''}>
                    <option value="">Seleccionar...</option>
                    <option value="TECNICO">Técnico</option>
                    <option value="TECNOLOGO">Tecnólogo</option>
                    <option value="ESPECIALIZACION_TECNOLOGICA">Especialización Tecnológica</option>
                    <option value="OPERARIO">Operario</option>
                    <option value="AUXILIAR">Auxiliar</option>
                  </Input>
                </div>

                <div className="form-row">
                  <Input label="Fecha de Inicio" name="fecha_inicio_formacion" type="date" defaultValue={data.fecha_inicio_formacion?.split('T')[0]} />
                  <Input label="Fecha de Fin Estimada" name="fecha_fin_formacion" type="date" defaultValue={data.fecha_fin_formacion?.split('T')[0]} />
                </div>

                <Input label="Perfil Profesional / Resumen" name="perfil_profesional" type="textarea" defaultValue={data.perfil_profesional} hint="Escribe un breve resumen sobre ti, tus intereses y lo que buscas (Max. 500 caracteres)." />

                <div className="flex justify-end mt-4">
                  <Button type="submit" isLoading={saving}>Guardar Cambios</Button>
                </div>
              </form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
