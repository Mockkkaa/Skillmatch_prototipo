import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { postulacionService } from '../../services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

export default function PostulacionesRecibidas() {
  const { user } = useAuth();
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadPostulaciones();
  }, []);

  async function loadPostulaciones() {
    try {
      const res = await postulacionService.list({ empresa_id: user.empresa_id });
      setPostulaciones(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateEstado = async (id, nuevoEstado) => {
    try {
      await postulacionService.updateEstado(id, { estado: nuevoEstado });
      setMessage({ type: 'success', text: `Estado actualizado a ${nuevoEstado.replace('_', ' ')}` });
      loadPostulaciones();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al actualizar el estado.' });
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-header">
        <h1>Postulaciones Recibidas</h1>
        <p>Gestiona los candidatos que han aplicado a tus vacantes</p>
      </div>

      {message && <Alert variant={message.type} className="mb-6">{message.text}</Alert>}

      {postulaciones.length === 0 ? (
        <EmptyState 
          icon="👥"
          title="Sin postulaciones"
          description="Aún no has recibido postulaciones. Asegúrate de tener vacantes activas y bien descritas."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {postulaciones.map(post => (
            <Card key={post.id}>
              <Card.Body className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  
                  <div className="flex-1 flex gap-4">
                    <div className="avatar avatar-lg hidden sm:flex">
                      {post.aprendiz_foto ? (
                        <img src={`http://localhost:3001${post.aprendiz_foto}`} alt={post.aprendiz_nombre} />
                      ) : (
                        post.aprendiz_nombre?.charAt(0)
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold">{post.aprendiz_nombre} {post.aprendiz_apellido}</h3>
                        <Badge variant={
                          post.estado === 'PRESELECCIONADO' ? 'purple' : 
                          post.estado === 'RECHAZADO' ? 'error' : 
                          post.estado === 'FINALIZADO' ? 'success' : 'warning'
                        }>
                          {post.estado.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="text-blue font-medium mb-2">Aplica para: {post.cargo}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-secondary mb-3">
                        <span>📧 {post.aprendiz_correo}</span>
                        {post.aprendiz_telefono && <span>📱 {post.aprendiz_telefono}</span>}
                        <span>📅 Postulado: {new Date(post.fecha_postulacion).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center gap-2 min-w-[200px] border-t md:border-t-0 md:border-l border-border-light pt-4 md:pt-0 md:pl-6">
                    <p className="text-xs font-bold text-secondary uppercase mb-1">Acciones</p>
                    
                    <a href={`mailto:${post.aprendiz_correo}`} className="btn btn-secondary btn-sm w-full">
                      Contactar
                    </a>
                    
                    <select 
                      className="form-select text-sm py-1 mt-2" 
                      value={post.estado}
                      onChange={(e) => handleUpdateEstado(post.id, e.target.value)}
                    >
                      <option value="ENVIADA">Enviada (No leída)</option>
                      <option value="EN_REVISION">En Revisión</option>
                      <option value="PRESELECCIONADO">Preseleccionado</option>
                      <option value="RECHAZADO">Rechazado</option>
                      <option value="FINALIZADO">Contratado / Finalizado</option>
                    </select>
                  </div>

                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
