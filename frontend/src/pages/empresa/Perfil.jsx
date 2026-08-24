import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { empresaService } from '../../services';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';

export default function Perfil() {
  const { user, updateUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await empresaService.miEmpresa();
        setData(res.data.data);
      } catch (error) {
        console.error("Error loading profile", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    const formData = new FormData(e.target);
    const updateData = Object.fromEntries(formData);
    
    try {
      await empresaService.update(data.id, updateData);
      setMessage({ type: 'success', text: 'Perfil empresarial actualizado correctamente.' });
      
      if (updateData.razon_social !== user.nombre) {
        updateUser({ nombre: updateData.razon_social });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error al actualizar perfil.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (!data) return <Alert variant="error">Error al cargar datos del perfil empresarial.</Alert>;

  return (
    <div>
      <div className="page-header">
        <h1>Perfil Empresarial</h1>
        <p>Administra la información pública de tu empresa</p>
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
              <div className="avatar avatar-xl mb-4 bg-primary-light text-primary">
                🏢
              </div>
              <h3 className="font-bold">{data.razon_social}</h3>
              <p className="text-sm text-secondary">NIT: {data.nit}</p>
              
              <div className="mt-4 w-full">
                <div className="text-sm text-secondary text-left mb-1">Estado en SkillMatch</div>
                <Badge variant={data.estado === 'APROBADA' ? 'success' : data.estado === 'PENDIENTE' ? 'warning' : 'error'} className="w-full justify-center py-2 text-sm">
                  {data.estado}
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="col-span-2" style={{ gridColumn: 'span 2' }}>
          <Card>
            <Card.Header>
              <h3>Información de la Empresa</h3>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="form-row">
                  <Input label="Razón Social" name="razon_social" defaultValue={data.razon_social} required />
                  <Input label="NIT" value={data.nit} disabled hint="Para cambiar el NIT contacta a soporte" />
                </div>
                
                <div className="form-row">
                  <Input label="Sector / Industria" name="sector" defaultValue={data.sector} />
                  <Input label="Ciudad Principal" name="ciudad" defaultValue={data.ciudad} required />
                </div>

                <div className="form-row">
                  <Input label="Teléfono de Contacto" name="telefono" defaultValue={data.telefono} required />
                  <Input label="Correo Corporativo" name="correo_empresa" type="email" defaultValue={data.correo_empresa} />
                </div>
                
                <Input label="Sitio Web" name="sitio_web" type="url" defaultValue={data.sitio_web} placeholder="https://www.empresa.com" />

                <Input 
                  label="Descripción de la Empresa" 
                  name="descripcion" 
                  type="textarea" 
                  defaultValue={data.descripcion} 
                  hint="Describe a qué se dedica tu empresa, su cultura y por qué es un buen lugar para trabajar." 
                />

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
