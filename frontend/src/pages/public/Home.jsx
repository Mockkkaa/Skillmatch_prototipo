import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconBriefcase } from '../../components/common/Icons';
import { vacanteService } from '../../services';
import { mockVacantes } from '../../data/mockData';
import '../../styles/home.css';

// Programas de formación SENA destacados
const PROGRAMAS_SENA = [
  { id: 1, nombre: 'Análisis y Desarrollo de Software (ADSO)', icono: '💻', area: 'Tecnología', vacantes: '+50' },
  { id: 2, nombre: 'Gestión Empresarial y Administrativa', icono: '📊', area: 'Administración', vacantes: '+35' },
  { id: 3, nombre: 'Redes y Telecomunicaciones', icono: '🌐', area: 'Infraestructura', vacantes: '+25' },
  { id: 4, nombre: 'Diseño Gráfico & Multimedia', icono: '🎨', area: 'Diseño', vacantes: '+20' },
  { id: 5, nombre: 'Contabilidad y Finanzas', icono: '📈', area: 'Finanzas', vacantes: '+18' },
  { id: 6, nombre: 'Marketing Digital y Comercio', icono: '🚀', area: 'Comercio', vacantes: '+15' }
];

// Preguntas frecuentes
const FAQS = [

  
  {
    pregunta: '¿Tiene algún costo registrarse o postularse en SKILLMATCH?',
    respuesta: 'No. SKILLMATCH es una plataforma oficial y completamente gratuita tanto para aprendices del SENA como para las empresas aliadas.'
  },
  {
    pregunta: '¿Cómo se valida mi condición de aprendiz SENA?',
    respuesta: 'Durante el registro validas tu correo institucional (@soy.sena.edu.co o @misena.edu.co) y número de ficha. El sistema verifica tu programa y estado de formación (lectiva o productiva).'
  },
  {
    pregunta: '¿Qué tipo de vinculación laboral ofrecen las empresas?',
    respuesta: 'Principalmente contratos de aprendizaje para etapa productiva con remuneración de sostenimiento oficial, así como vacantes de empleo formal para egresados SENA.'
  },
  {
    pregunta: '¿Cómo calcula la plataforma el porcentaje de compatibilidad (Match)?',
    respuesta: 'Comparamos las habilidades técnicas, blandas y programas de formación requeridos por la vacante con los registrados en la hoja de vida del aprendiz.'
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [vacantesDestacadas, setVacantesDestacadas] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    async function loadVacantes() {
      try {
        const res = await vacanteService.list();
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setVacantesDestacadas(res.data.data.slice(0, 3));
        } else {
          setVacantesDestacadas(mockVacantes.slice(0, 3));
        }
      } catch (err) {
        setVacantesDestacadas(mockVacantes.slice(0, 3));
      }
    }
    loadVacantes();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/ofertas?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/ofertas');
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="home-page animate-fade">
      {/* 1. SECCIÓN HERO */}
      <section className="home-hero-section">
        <div className="container text-center">
          <div className="home-hero-badge">
            <span style={{ fontSize: '1.1rem' }}>🇨🇴</span> Plataforma Oficial de Empleabilidad SENA
          </div>

          <h1 className="home-hero-title">
            Conecta tu talento con <span className="home-hero-highlight">oportunidades reales</span>
          </h1>

          <p className="home-hero-description">
            Organiza tu hoja de vida por competencias, postula a convocatorias verificadas de
            empresas aliadas y haz el seguimiento de tu etapa productiva con un solo clic.
          </p>

          {/* Buscador Interactivo en el Hero */}
          <form className="home-search-bar" onSubmit={handleSearch}>
            <span style={{ color: 'var(--color-primary)', fontSize: '1.2rem', marginLeft: '4px' }}>🔍</span>
            <input
              type="text"
              className="home-search-input"
              placeholder="Busca por cargo, habilidad (ej. React, Contabilidad) o ciudad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-md">
              Buscar vacantes
            </button>
          </form>

          {/* Acciones Rápidas */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '44px' }}>
            <Link to="/ofertas" className="btn btn-secondary btn-lg">
              <IconBriefcase size={18} />
              <span>Ver todas las ofertas</span>
            </Link>
            <Link to="/register" className="btn btn-primary btn-lg">
              <span>Registrar mi perfil de aprendiz</span>
            </Link>
          </div>

          {/* Métricas / Barra de Credibilidad */}
          <div className="home-metrics-bar">
            <div>
              <div className="home-metric-val">+1.400</div>
              <div className="home-metric-label">Aprendices Registrados</div>
            </div>
            <div>
              <div className="home-metric-val home-metric-val-primary">+180</div>
              <div className="home-metric-label">Empresas Verificadas</div>
            </div>
            <div>
              <div className="home-metric-val">64</div>
              <div className="home-metric-label">Vacantes Activas</div>
            </div>
            <div>
              <div className="home-metric-val home-metric-val-primary">100%</div>
              <div className="home-metric-label">Gratuito y Oficial</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN OFERTAS DESTACADAS */}
      <section id="ofertas-destacadas" className="home-featured-section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Convocatorias Recientes
              </span>
              <h2 style={{ fontSize: '2rem', color: 'var(--color-navy)', marginTop: '6px' }}>
                Ofertas laborales destacadas
              </h2>
            </div>
            <Link to="/ofertas" className="btn btn-ghost btn-sm">
              Ver todas las convocatorias →
            </Link>
          </div>

          <div className="home-featured-grid">
            {vacantesDestacadas.map((vacante, idx) => {
              // Simular o calcular compatibilidad match para la demo
              const matchPercent = [95, 88, 92][idx] || 85;
              return (
                <div key={vacante.id} className="home-vacante-card">
                  <div>
                    <div className="home-vacante-header">
                      <div>
                        <h3 className="home-vacante-title">{vacante.titulo || vacante.cargo}</h3>
                        <div className="home-vacante-empresa">
                          🏢 {vacante.empresa_nombre || vacante.empresa || 'Empresa Aliada'}
                        </div>
                      </div>
                      <div className="home-vacante-match">
                        ⚡ {matchPercent}% Match
                      </div>
                    </div>

                    <div className="home-vacante-badges">
                      <span className="home-vacante-tag home-vacante-tag-primary">
                        📍 {vacante.ubicacion || 'Colombia'}
                      </span>
                      <span className="home-vacante-tag">
                        💼 {vacante.modalidad || 'Híbrido'}
                      </span>
                      <span className="home-vacante-tag">
                        📄 {vacante.tipo_contrato || 'Contrato de Aprendizaje'}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {vacante.descripcion}
                    </p>
                  </div>

                  <div className="home-vacante-footer">
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      Publicada recientemente
                    </span>
                    <Link to={`/ofertas/${vacante.id}`} className="btn btn-primary btn-sm">
                      Ver detalle
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN PROGRAMAS / ÁREAS DE FORMACIÓN */}
      <section id="programas" className="home-programs-section">
        <div className="container">
          <div className="text-center">
            <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Especialidades
            </span>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--color-navy)', marginTop: '8px' }}>
              Explora por programa de formación SENA
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '10px auto 0' }}>
              Encuentra vacantes alineadas directamente a las competencias de tu ficha y programa técnico o tecnológico.
            </p>
          </div>

          <div className="home-programs-grid">
            {PROGRAMAS_SENA.map((prog) => (
              <Link
                key={prog.id}
                to={`/ofertas?query=${encodeURIComponent(prog.area)}`}
                className="home-program-card"
              >
                <div className="home-program-icon">{prog.icono}</div>
                <div className="home-program-info">
                  <h4>{prog.nombre}</h4>
                  <span>{prog.vacantes} vacantes activas</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN CÓMO FUNCIONA */}
      <section id="como-funciona" className="home-steps-section">
        <div className="container">
          <div className="text-center">
            <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Paso a paso
            </span>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--color-navy)', marginTop: '8px' }}>
              ¿Cómo funciona SKILLMATCH?
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '12px auto 0' }}>
              Una ruta sencilla para que aprendices y empresas sincronicen habilidades y oportunidades.
            </p>
          </div>

          <div className="home-steps-grid">
            <div className="home-step-card">
              <div className="home-step-num">1</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '10px', color: 'var(--color-navy)' }}>
                Crea tu perfil laboral
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Regístrate con tu correo SENA y ficha institucional para validar tu estado de formación.
              </p>
            </div>

            <div className="home-step-card">
              <div className="home-step-num">2</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '10px', color: 'var(--color-navy)' }}>
                Completa tu hoja de vida
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Agrega proyectos formativos, competencias técnicas y blandas para potenciar tu porcentaje de Match.
              </p>
            </div>

            <div className="home-step-card">
              <div className="home-step-num">3</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '10px', color: 'var(--color-navy)' }}>
                Encuentra oportunidades
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Filtra por modalidad, tipo de contrato y ciudad según tus preferencias laborales.
              </p>
            </div>

            <div className="home-step-card">
              <div className="home-step-num">4</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '10px', color: 'var(--color-navy)' }}>
                Postúlate y da seguimiento
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Aplica con un solo clic y monitorea en tiempo real las respuestas de las empresas interesadas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BANNER PARA EMPRESAS */}
      <section id="para-empresas" className="home-empresa-section">
        <div className="container">
          <div className="home-empresa-banner">
            <div style={{ maxWidth: '600px' }}>
              <span
                style={{
                  background: 'rgba(46, 139, 87, 0.3)',
                  color: 'var(--color-secondary)',
                  padding: '4px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Vinculación Empresarial
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                  color: '#FFFFFF',
                  margin: '16px 0',
                  fontWeight: 800
                }}
              >
                ¿Tu empresa busca aprendices en etapa productiva?
              </h2>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  marginBottom: '24px'
                }}
              >
                Publica tus convocatorias laborales, accede a perfiles verificados con competencias
                certificadas por el SENA y gestiona a tus candidatos de forma ágil y transparente.
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  flexWrap: 'wrap',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.875rem',
                  marginBottom: '28px'
                }}
              >
                <div>✓ Contratos de aprendizaje</div>
                <div>✓ Validación institucional</div>
                <div>✓ Panel de seguimiento</div>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link to="/register-empresa" className="btn btn-primary btn-lg">
                  Registrar mi empresa
                </Link>
                <Link
                  to="/login"
                  className="btn btn-ghost btn-lg"
                  style={{ color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.3)' }}
                >
                  Ingreso para empresas
                </Link>
              </div>
            </div>

            <div
              style={{
                flex: '1 1 300px',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '32px',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h4 style={{ color: '#FFFFFF', marginBottom: '16px', fontSize: '1.1rem' }}>
                Beneficios clave para empresas:
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', gap: '10px', color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>✓</span>
                  Cumplimiento de cuota de aprendices según normatividad legal colombiana.
                </li>
                <li style={{ display: 'flex', gap: '10px', color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>✓</span>
                  Filtro directo por nivel formativo (Técnico / Tecnólogo).
                </li>
                <li style={{ display: 'flex', gap: '10px', color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>✓</span>
                  Acceso a proyectos formativos reales desarrollados en el SENA.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECCIÓN PREGUNTAS FRECUENTES (FAQS) */}
      <section id="faq" className="home-faq-section">
        <div className="container">
          <div className="text-center">
            <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Resuelve tus dudas
            </span>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--color-navy)', marginTop: '8px' }}>
              Preguntas Frecuentes
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '10px auto 0' }}>
              Todo lo que necesitas saber sobre el uso de la plataforma SKILLMATCH y los contratos de aprendizaje.
            </p>
          </div>

          <div className="home-faq-container">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="home-faq-item">
                  <button
                    className="home-faq-question"
                    onClick={() => toggleFaq(index)}
                    type="button"
                  >
                    <span>{faq.pregunta}</span>
                    <span className={`home-faq-icon ${isOpen ? 'open' : ''}`}>+</span>
                  </button>
                  {isOpen && (
                    <div className="home-faq-answer">
                      {faq.respuesta}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
