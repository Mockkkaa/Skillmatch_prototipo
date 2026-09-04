import { Link } from 'react-router-dom';
import {
  IconBriefcase,
  IconResume,
  IconGraduation,
  IconBuilding,
  IconUsers,
  IconPostulacion
} from '../../components/common/Icons';

export default function Home() {
  return (
    <div className="home-page animate-fade">
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FB 100%)',
          padding: '80px 0 60px',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div className="container text-center">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              background: 'var(--color-primary-light)',
              color: 'var(--color-primary-dark)',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '24px'
            }}
          >
            Plataforma de Empleabilidad SENA
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: 'var(--color-navy)',
              maxWidth: '850px',
              margin: '0 auto 20px'
            }}
          >
            Conecta tu talento con <span style={{ color: 'var(--color-primary)' }}>nuevas oportunidades</span>
          </h1>

          <p
            style={{
              fontSize: '1.125rem',
              color: 'var(--color-text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 36px',
              lineHeight: 1.6
            }}
          >
            SKILLMATCH facilita la gestión de la información profesional del aprendiz SENA,
            organiza su hoja de vida por competencias y conecta sus perfiles directamente con
            empresas aliadas en busca de talento calificado.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              marginBottom: '48px'
            }}
          >
            <Link to="/ofertas" className="btn btn-primary btn-xl">
              <IconBriefcase size={20} />
              <span>Explorar ofertas laborales</span>
            </Link>
            <Link to="/register" className="btn btn-ghost btn-xl">
              <span>Crear mi perfil de aprendiz</span>
            </Link>
          </div>

          {/* Key Metrics / Credibility bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '24px',
              maxWidth: '960px',
              margin: '0 auto',
              padding: '24px 32px',
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--color-border)'
            }}
          >
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                +1.400
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Aprendices Registrados
              </div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                +180
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Empresas Verificadas
              </div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                64
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Vacantes Activas
              </div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                100%
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Gratuito y Oficial
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo Funciona Section */}
      <section id="como-funciona" style={{ padding: '80px 0', background: 'var(--color-white)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '56px' }}>
            <span
              style={{
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Paso a paso
            </span>
            <h2 style={{ fontSize: '2.25rem', color: 'var(--color-navy)', marginTop: '8px' }}>
              ¿Cómo funciona SKILLMATCH?
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '12px auto 0' }}>
              Una ruta sencilla para que aprendices y empresas sincronicen habilidades y oportunidades.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px'
            }}
          >
            {/* Step 1 */}
            <div className="card" style={{ padding: '32px 24px', textAlign: 'left' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  marginBottom: '20px'
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '10px', color: 'var(--color-navy)' }}>
                Crea tu perfil laboral
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Regístrate con tu correo SENA y ficha institucional para validar tu estado de formación.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ padding: '32px 24px', textAlign: 'left' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  marginBottom: '20px'
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '10px', color: 'var(--color-navy)' }}>
                Completa tu hoja de vida
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Agrega tu formación académica, proyectos formativos, habilidades técnicas y blandas.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ padding: '32px 24px', textAlign: 'left' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  marginBottom: '20px'
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '10px', color: 'var(--color-navy)' }}>
                Encuentra oportunidades
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Filtra por modalidad, tipo de contrato y ubicación geográfica según tus preferencias.
              </p>
            </div>

            {/* Step 4 */}
            <div className="card" style={{ padding: '32px 24px', textAlign: 'left' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  marginBottom: '20px'
                }}
              >
                4
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '10px', color: 'var(--color-navy)' }}>
                Postúlate y da seguimiento
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Aplica con un solo clic y monitorea el estado de tu proceso en tiempo real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Empresas Banner Section */}
      <section id="para-empresas" style={{ padding: '60px 0 90px' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, #0B132B 0%, #1C2541 100%)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'clamp(32px, 6vw, 64px)',
              color: '#FFFFFF',
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '40px',
              flexWrap: 'wrap'
            }}
          >
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
                  margin: '16px 0 16px',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--color-secondary)' }}>✓</span> Contratos de aprendizaje
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--color-secondary)' }}>✓</span> Validación institucional
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--color-secondary)' }}>✓</span> Panel de seguimiento
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link to="/register-empresa" className="btn btn-primary btn-lg">
                  Registrar mi empresa
                </Link>
                <Link to="/login" className="btn btn-ghost btn-lg" style={{ color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.3)' }}>
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
                Programas con mayor demanda:
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem' }}>
                  <span>Análisis y Desarrollo de Software (ADSO)</span>
                  <strong style={{ color: 'var(--color-secondary)' }}>+50 vacantes</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem' }}>
                  <span>Gestión Administrativa y Documental</span>
                  <strong style={{ color: 'var(--color-secondary)' }}>+35 vacantes</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem' }}>
                  <span>Redes, Soporte y Telecomunicaciones</span>
                  <strong style={{ color: 'var(--color-secondary)' }}>+25 vacantes</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem' }}>
                  <span>Contabilidad y Finanzas</span>
                  <strong style={{ color: 'var(--color-secondary)' }}>+20 vacantes</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
