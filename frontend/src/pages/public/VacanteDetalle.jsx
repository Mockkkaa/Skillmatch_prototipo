import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { vacanteService, postulacionService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';

export default function VacanteDetalle() {
  const { id } = useParams();
  const { user, isAprendiz } = useAuth();
  const navigate = useNavigate();
  const [vacante, setVacante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postulando, setPostulando] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function loadVacante() {
      try {
        const res = await vacanteService.get(id);
        setVacante(res.data.data);
      } catch (error) {
        setMessage({ type: 'error', text: 'Error al cargar la vacante o no existe.' });
      } finally {
        setLoading(false);
      }
    }
    loadVacante();
  }, [id]);

  const handlePostular = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/ofertas/${id}` } });
      return;
    }

    if (!isAprendiz()) {
      setMessage({ type: 'warning', text: 'Solo los aprendices pueden postularse a vacantes.' });
      return;
    }

    if (!window.confirm('¿Deseas postularte a esta vacante? La empresa podrá ver tu hoja de vida.')) return;

    setPostulando(true);
    setMessage(null);

    try {
      await postulacionService.create({ vacante_id: id });
      setMessage({ type: 'success', text: '¡Postulación enviada con éxito! Puedes hacer seguimiento desde tu dashboard.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error al postularse. Es posible que ya te hayas postulado o debas completar tu hoja de vida al 100%.' });
    } finally {
      setPostulando(false);
    }
  };

  if (loading) return <Loading fullPage />;
  if (!vacante) return <div className="container py-12"><Alert variant="error">{message?.text}</Alert><Link to="/ofertas" className="btn btn-primary mt-4">Volver a Ofertas</Link></div>;

  return (
    <div className="container py-8 animate-fade">
      <Link to="/ofertas" className="text-primary hover:underline mb-6 inline-block">← Volver a todas las ofertas</Link>
      
      {message && <Alert variant={message.type} className="mb-6">{message.text}</Alert>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <Card.Body className="p-8">
              <div className="flex gap-6 mb-8 border-b border-border-light pb-8">
                <div className="avatar avatar-xl bg-surface-2 hidden sm:flex">
                  🏢
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-blue mb-2">{vacante.cargo}</h1>
                  <p className="text-xl text-primary font-bold">{vacante.empresa}</p>
                  <p className="text-secondary mt-1">📍 {vacante.ubicacion} • 📅 Publicado: {new Date(vacante.fecha_publicacion).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4">Descripción de la vacante</h3>
                <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {vacante.descripcion}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Requisitos</h3>
                <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {vacante.requisitos}
                </p>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card className="border-primary-light border-2">
            <Card.Body className="text-center p-8 bg-surface-2">
              <h3 className="mb-4">¿Te interesa esta oportunidad?</h3>
              {vacante.estado === 'ABIERTA' ? (
                <Button 
                  size="lg" 
                  fullWidth 
                  onClick={handlePostular} 
                  isLoading={postulando}
                  disabled={message?.type === 'success'}
                >
                  {message?.type === 'success' ? '✓ Postulado' : 'Postularme ahora'}
                </Button>
              ) : (
                <Alert variant="warning">Esta vacante ya no recibe postulaciones.</Alert>
              )}
              {!user && (
                <p className="text-xs text-secondary mt-4">
                  Debes <Link to="/login" className="text-primary hover:underline">iniciar sesión</Link> como aprendiz para postularte.
                </p>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h3>Detalles del cargo</h3>
            </Card.Header>
            <Card.Body className="flex flex-col gap-4 text-sm">
              <div>
                <span className="text-secondary block mb-1">Modalidad</span>
                <p className="font-bold flex items-center gap-2">🏠 {vacante.modalidad}</p>
              </div>
              <div>
                <span className="text-secondary block mb-1">Tipo de Contrato</span>
                <p className="font-bold flex items-center gap-2">📄 {vacante.tipo_contrato.replace('_', ' ')}</p>
              </div>
              <div>
                <span className="text-secondary block mb-1">Experiencia Requerida</span>
                <p className="font-bold flex items-center gap-2">⏳ {vacante.experiencia_requerida > 0 ? `${vacante.experiencia_requerida} meses` : 'Sin experiencia'}</p>
              </div>
              {vacante.salario && (
                <div>
                  <span className="text-secondary block mb-1">Salario Ofrecido</span>
                  <p className="font-bold text-lg text-primary flex items-center gap-2">💰 ${Number(vacante.salario).toLocaleString()}</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
