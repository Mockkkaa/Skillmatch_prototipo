import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { vacanteService, postulacionService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Toast from '../../components/common/Toast';
import { mockVacantes } from '../../data/mockData';

export default function VacanteDetalle() {
  const { id } = useParams();
  const { user, isAprendiz } = useAuth();
  const navigate = useNavigate();

  const [vacante, setVacante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postulando, setPostulando] = useState(false);
  const [message, setMessage] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function loadVacante() {
      try {
        const res = await vacanteService.get(id);
        if (res.data?.success && res.data.data) {
          setVacante(res.data.data);
        } else {
          // Fallback to mock
          const found = mockVacantes.find((v) => String(v.id) === String(id)) || mockVacantes[0];
          setVacante(found);
        }
      } catch (error) {
        // Fallback to mock
        const found = mockVacantes.find((v) => String(v.id) === String(id)) || mockVacantes[0];
        setVacante(found);
      } finally {
        setLoading(false);
      }
    }
    loadVacante();
  }, [id]);

  const handleOpenConfirm = () => {
    if (!user) {
      navigate('/login', { state: { from: `/ofertas/${id}` } });
      return;
    }

    if (!isAprendiz()) {
      setMessage({ type: 'warning', text: 'Solo los aprendices pueden postularse a vacantes laborales.' });
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmPostular = async () => {
    setShowConfirm(false);
    setPostulando(true);
    setMessage(null);

    try {
      await postulacionService.create({ vacante_id: id });
      setToast('¡Postulación enviada exitosamente! La empresa revisará tu hoja de vida.');
      setMessage({ type: 'success', text: '¡Te has postulado exitosamente a esta vacante!' });
    } catch (error) {
      // Mock success fallback for prototype
      setToast('¡Postulación registrada en el prototipo! Puedes verla en "Mis Postulaciones".');
      setMessage({ type: 'success', text: '¡Te has postulado exitosamente a esta vacante!' });
    } finally {
      setPostulando(false);
    }
  };

  if (loading) return <Loading fullPage />;
  if (!vacante) {
    return (
      <div className="container py-12">
        <Alert variant="error">La vacante no existe o no se pudo cargar.</Alert>
        <Link to="/ofertas" className="btn btn-primary mt-4">
          Volver a Ofertas
        </Link>
      </div>
    );
  }

  const title = vacante.titulo || vacante.cargo;
  const company = vacante.empresa_nombre || vacante.empresa;

  return (
    <div className="container py-8 animate-fade">
      {toast && (
        <div className="toast-container">
          <Toast message={toast} type="success" onClose={() => setToast(null)} />
        </div>
      )}

      <ConfirmDialog
        isOpen={showConfirm}
        title="Confirmar postulación"
        message={`¿Deseas postularte a la vacante "${title}" en ${company}? La empresa podrá revisar tu información académica y competencias registradas.`}
        confirmText="Sí, postularme"
        cancelText="Cancelar"
        type="primary"
        onConfirm={handleConfirmPostular}
        onCancel={() => setShowConfirm(false)}
        isLoading={postulando}
      />

      <Link to="/ofertas" className="btn btn-ghost btn-sm mb-6 inline-flex items-center gap-2">
        ← Volver a todas las ofertas
      </Link>

      {message && <Alert variant={message.type} className="mb-6">{message.text}</Alert>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        {/* Main Details */}
        <div style={{ gridColumn: 'span 8' }} className="vacancy-main-column">
          <Card>
            <div className="card-body" style={{ padding: '32px' }}>
              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'flex-start',
                  paddingBottom: '24px',
                  borderBottom: '1px solid var(--color-border-light)',
                  marginBottom: '24px'
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'var(--color-navy)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.5rem',
                    flexShrink: 0
                  }}
                >
                  {company ? company.charAt(0) : 'E'}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <Badge variant="primary">{vacante.modalidad || 'Híbrido'}</Badge>
                    <Badge variant="gray">{vacante.tipo_contrato || 'Contrato de Aprendizaje'}</Badge>
                  </div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '4px' }}>
                    {title}
                  </h1>
                  <p style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.1rem' }}>
                    {company}
                  </p>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '6px' }}>
                    📍 {vacante.ubicacion} • 📅 Convocatoria activa hasta{' '}
                    {vacante.fecha_cierre
                      ? new Date(vacante.fecha_cierre).toLocaleDateString()
                      : 'Cierre de cupos'}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-navy)', marginBottom: '12px' }}>
                  Descripción de la oportunidad
                </h3>
                <p style={{ color: 'var(--color-text)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {vacante.descripcion}
                </p>
              </div>

              {vacante.requisitos && (
                <div style={{ marginBottom: '28px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--color-navy)', marginBottom: '12px' }}>
                    Perfil y requisitos esperados
                  </h3>
                  <p style={{ color: 'var(--color-text)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {vacante.requisitos}
                  </p>
                </div>
              )}

              {vacante.beneficios && (
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--color-navy)', marginBottom: '12px' }}>
                    Beneficios para el aprendiz
                  </h3>
                  <p style={{ color: 'var(--color-text)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {vacante.beneficios}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Action Sidebar */}
        <div style={{ gridColumn: 'span 4' }} className="vacancy-side-column">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '90px' }}>
            <Card style={{ border: '2px solid var(--color-primary-light)' }}>
              <div className="card-body" style={{ textAlign: 'center', padding: '28px' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-navy)', marginBottom: '12px' }}>
                  ¿Cumples con el perfil?
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
                  Postúlate con tu perfil y hoja de vida SENA con un solo clic.
                </p>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleOpenConfirm}
                  loading={postulando}
                  disabled={message?.type === 'success'}
                >
                  {message?.type === 'success' ? '✓ Postulado con éxito' : 'Postularme ahora'}
                </Button>

                {!user && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '12px' }}>
                    Debes <Link to="/login" style={{ color: 'var(--color-primary)' }}>iniciar sesión</Link> como aprendiz para poder postularte.
                  </p>
                )}
              </div>
            </Card>

            <Card>
              <div className="card-header">
                <h3 style={{ fontSize: '1rem', color: 'var(--color-navy)' }}>Resumen de la oferta</h3>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.875rem' }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>
                    Modalidad
                  </span>
                  <strong>{vacante.modalidad || 'Híbrido'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>
                    Tipo de vinculación
                  </span>
                  <strong>{vacante.tipo_contrato || 'Contrato de Aprendizaje'}</strong>
                </div>
                {vacante.salario && (
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>
                      Apoyo de sostenimiento
                    </span>
                    <strong style={{ color: 'var(--color-primary)', fontSize: '1.05rem' }}>
                      {vacante.salario}
                    </strong>
                  </div>
                )}
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>
                    Ubicación
                  </span>
                  <strong>{vacante.ubicacion}</strong>
                </div>
                {vacante.cupos && (
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>
                      Cupos disponibles
                    </span>
                    <strong>{vacante.cupos} vacante(s)</strong>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
