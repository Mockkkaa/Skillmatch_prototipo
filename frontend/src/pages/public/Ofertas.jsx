import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vacanteService } from '../../services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';

export default function Ofertas() {
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ query: '', ubicacion: '', modalidad: '', tipo_contrato: '' });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // Debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    async function loadVacantes() {
      setLoading(true);
      try {
        const res = await vacanteService.list(debouncedFilters);
        setVacantes(res.data.data);
      } catch (error) {
        console.error("Error loading vacantes", error);
      } finally {
        setLoading(false);
      }
    }
    loadVacantes();
  }, [debouncedFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => setFilters({ query: '', ubicacion: '', modalidad: '', tipo_contrato: '' });

  return (
    <div className="container py-8 animate-fade">
      <div className="page-header text-center mb-10">
        <h1 className="text-3xl font-bold">Ofertas Laborales</h1>
        <p className="text-secondary max-w-2xl mx-auto mt-4">
          Encuentra las mejores oportunidades para iniciar o continuar tu carrera profesional con empresas aliadas al SENA.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <Card.Header>
              <h3 className="flex items-center gap-2">🔍 Filtros</h3>
            </Card.Header>
            <Card.Body className="flex flex-col gap-4">
              <Input 
                label="Buscar por cargo o empresa" 
                name="query" 
                value={filters.query} 
                onChange={handleFilterChange} 
                placeholder="Ej: Desarrollador..." 
              />
              <Input 
                label="Ubicación" 
                name="ubicacion" 
                value={filters.ubicacion} 
                onChange={handleFilterChange} 
                placeholder="Ej: Bogotá" 
              />
              <Input 
                label="Modalidad" 
                name="modalidad" 
                type="select" 
                value={filters.modalidad} 
                onChange={handleFilterChange}
              >
                <option value="">Todas</option>
                <option value="PRESENCIAL">Presencial</option>
                <option value="REMOTO">Remoto</option>
                <option value="HIBRIDO">Híbrido</option>
              </Input>
              <Input 
                label="Tipo de Contrato" 
                name="tipo_contrato" 
                type="select" 
                value={filters.tipo_contrato} 
                onChange={handleFilterChange}
              >
                <option value="">Todos</option>
                <option value="APRENDIZAJE">Contrato de Aprendizaje</option>
                <option value="INDEFINIDO">Término Indefinido</option>
                <option value="FIJO">Término Fijo</option>
                <option value="PRESTACION_SERVICIOS">Prestación de Servicios</option>
                <option value="OBRA_LABOR">Obra o Labor</option>
              </Input>
              
              <Button variant="ghost" onClick={clearFilters} className="mt-2">
                Limpiar Filtros
              </Button>
            </Card.Body>
          </Card>
        </div>

        {/* Results List */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex justify-between items-center text-sm text-secondary">
            <span>{loading ? 'Buscando...' : `${vacantes.length} resultados encontrados`}</span>
          </div>

          {loading ? (
            <Loading />
          ) : vacantes.length === 0 ? (
            <EmptyState 
              icon="🔍"
              title="No se encontraron vacantes"
              description="Intenta ajustando los filtros de búsqueda para ver más resultados."
              action={<Button onClick={clearFilters}>Ver todas las ofertas</Button>}
            />
          ) : (
            <div className="flex flex-col gap-4">
              {vacantes.map(vac => (
                <Card key={vac.id} interactive className="hover:border-primary transition-colors">
                  <Link to={`/ofertas/${vac.id}`} className="block text-inherit">
                    <Card.Body className="p-6">
                      <div className="flex justify-between items-start gap-4 flex-wrap mb-4">
                        <div className="flex gap-4">
                          <div className="avatar avatar-lg bg-surface-2 hidden sm:flex">
                            🏢
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-blue mb-1">{vac.cargo}</h2>
                            <p className="text-lg text-primary font-medium">{vac.empresa}</p>
                            <div className="flex items-center gap-2 text-sm text-secondary mt-1">
                              <span>📍 {vac.ubicacion}</span>
                              <span>•</span>
                              <span>📅 Publicado: {new Date(vac.fecha_publicacion).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {vac.salario && <span className="font-bold text-lg">${Number(vac.salario).toLocaleString()}</span>}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="blue">{vac.modalidad}</Badge>
                        <Badge variant="purple">{vac.tipo_contrato.replace('_', ' ')}</Badge>
                        {vac.experiencia_requerida > 0 ? (
                          <Badge variant="gray">{vac.experiencia_requerida} meses de exp.</Badge>
                        ) : (
                          <Badge variant="success">Sin experiencia</Badge>
                        )}
                      </div>
                      
                      <p className="text-secondary line-clamp-2">
                        {vac.descripcion}
                      </p>
                    </Card.Body>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
