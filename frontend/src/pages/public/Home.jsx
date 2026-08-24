import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <div className="hero-content text-center py-20 animate-slide">
            <h1 className="text-4xl font-extrabold mb-6">Conecta tu talento con nuevas oportunidades</h1>
            <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
              SkillMatch ayuda a los aprendices del SENA a organizar su perfil profesional, crear su hoja de vida y encontrar las mejores oportunidades laborales.
            </p>
            <div className="hero-buttons flex justify-center gap-4">
              <Link to="/register" className="btn btn-primary btn-xl">Crear mi perfil</Link>
              <Link to="/ofertas" className="btn btn-ghost btn-xl">Ver ofertas</Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="benefits bg-surface-2 py-16" id="como-funciona">
        <div className="container">
          <h2 className="section-title justify-center mb-10">¿Cómo funciona?</h2>
          <div className="grid grid-3 gap-8">
            <div className="card text-center">
              <div className="card-body">
                <div className="text-4xl mb-4">📄</div>
                <h3 className="mb-2">Crea tu hoja de vida</h3>
                <p className="text-secondary">Organiza tu información académica, experiencia y habilidades en un perfil profesional.</p>
              </div>
            </div>
            <div className="card text-center">
              <div className="card-body">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="mb-2">Encuentra oportunidades</h3>
                <p className="text-secondary">Explora vacantes exclusivas para aprendices publicadas por empresas aliadas.</p>
              </div>
            </div>
            <div className="card text-center">
              <div className="card-body">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="mb-2">Postúlate fácilmente</h3>
                <p className="text-secondary">Aplica a las ofertas y haz seguimiento en tiempo real al estado de tus postulaciones.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="empresas py-16" id="para-empresas">
        <div className="container">
          <div className="card bg-primary-light border-primary-light">
            <div className="card-body flex items-center justify-between flex-wrap gap-8 p-10">
              <div>
                <h2 className="text-primary-dark mb-4">¿Eres una empresa?</h2>
                <p className="text-secondary max-w-md">
                  Encuentra el mejor talento del SENA. Publica tus vacantes, gestiona las postulaciones y contrata a los próximos profesionales.
                </p>
              </div>
              <Link to="/register-empresa" className="btn btn-primary btn-xl">Registrar mi empresa</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
