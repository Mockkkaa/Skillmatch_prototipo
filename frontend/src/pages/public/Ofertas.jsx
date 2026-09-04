import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { vacanteService } from '../../services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Select from '../../components/common/Select';
import { IconBriefcase } from '../../components/common/Icons';
import { mockVacantes } from '../../data/mockData';

export default function Ofertas() {
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    query: '',
    ubicacion: '',
    modalidad: '',
    tipo_contrato: ''
  });

  useEffect(() => {
    async function loadVacantes() {
      setLoading(true);
      try {
        const res = await vacanteService.list(filters);
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setVacantes(res.data.data);
        } else {
          setVacantes(mockVacantes);
        }
      } catch (error) {
        // Fallback to rich mock data
        setVacantes(mockVacantes);
      } finally {
        setLoading(false);
      }
    }
    loadVacantes();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () =>
    setFilters({ query: '', ubicacion: '', modalidad: '', tipo_contrato: '' });

  // Client-side filtering for immediate snappy responsiveness
  const filteredVacantes = useMemo(() => {
    return vacantes.filter(v => {
      const cargo = (v.titulo || v.cargo || '').toLowerCase();
      const empresa = (v.empresa_nombre || v.empresa || '').toLowerCase();
      const desc = (v.descripcion || '').toLowerCase();
      const q = filters.query.toLowerCase().trim();

      if (q && !cargo.includes(q) && !empresa.includes(q) && !desc.includes(q)) {
        return false;
      }
      if (filters.modalidad && (v.modalidad || '').toLowerCase() !== filters.modalidad.toLowerCase()) {
        return false;
      }
      if (filters.tipo_contrato && (v.tipo_contrato || '').toLowerCase() !== filters.tipo_contrato.toLowerCase()) {
        return false;
      }
      if (filters.ubicacion) {
        const u = filters.ubicacion.toLowerCase();
        if (!(v.ubicacion || '').toLowerCase().includes(u)) return false;
      }
      return true;
    });
  }, [vacantes, filters]);

  return (
    <div className="container py-8 animate-fade">
      {/* Header */}
      <div className="page-header text-center mb-8">
        <span
          style={{
            display: 'inline-block',
            color: 'var(--color-primary)',
            fontWeight: 700,
            fontSize: 'var(--font-size-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '8px'
          }}
        >
          Convocatorias Vigentes
        </span>
        <h1 style={{ color: 'var(--color-navy)', fontSize: '2.25rem', fontWeight: 800 }}>
          Ofertas Laborales para Aprendices
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '640px', margin: '8px auto 0' }}>
          Oportunidades verificadas en etapa productiva y contratos de aprendizaje con empresas aliadas al SENA.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        {/* Filters Sidebar */}
        <div style={{ gridColumn: 'span 4' }} className="filters-column">
          <Card style={{ position: 'sticky', top: '90px' }}>
            <div className="card-header">
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-navy)' }}>Filtros de búsqueda</h3>
              {(filters.query || filters.ubicacion || filters.modalidad || filters.tipo_contrato) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    fontSize: 'var(--font-size-xs)',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Limpiar
                </button>
              )}
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Cargo o palabra clave</label>
                <input
                  type="text"
                  name="query"
                  placeholder="Ej: React, Desarrollador, ADSO..."
                  value={filters.query}
                  onChange={handleFilterChange}
                  className="form-input"
                />
              </div>

              <Select
                label="Modalidad de trabajo"
                name="modalidad"
                value={filters.modalidad}
                onChange={handleFilterChange}
                placeholder="Todas las modalidades"
                options={['Presencial', 'Híbrido', 'Remoto']}
              />

              <Select
                label="Tipo de vinculación"
                name="tipo_contrato"
                value={filters.tipo_contrato}
                onChange={handleFilterChange}
                placeholder="Todos los tipos"
                options={[
                  { value: 'Contrato de Aprendizaje', label: 'Contrato de Aprendizaje' },
                  { value: 'Pasantía / Práctica', label: 'Pasantía / Práctica' },
                  { value: 'Término Fijo', label: 'Término Fijo' }
                ]}
              />

              <Select
                label="Ubicación"
                name="ubicacion"
                value={filters.ubicacion}
                onChange={handleFilterChange}
                placeholder="Todas las ciudades"
                options={[
                  { value: 'Bogotá', label: 'Bogotá D.C.' },
                  { value: 'Medellín', label: 'Medellín, Antioquia' },
                  { value: 'Cali', label: 'Cali, Valle del Cauca' },
                  { value: 'Remoto', label: 'Nacional (Remoto)' }
                ]}
              />
            </div>
          </Card>
        </div>

        {/* Vacantes List */}
        <div style={{ gridColumn: 'span 8' }} className="results-column">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              Mostrando <strong>{filteredVacantes.length}</strong> {filteredVacantes.length === 1 ? 'vacante' : 'vacantes'}
            </span>
          </div>

          {loading ? (
            <Loading fullPage={false} />
          ) : filteredVacantes.length === 0 ? (
            <EmptyState
              title="No encontramos vacantes"
              description="Prueba ajustando o limpiando los filtros para ver más oportunidades disponibles."
              action={
                <Button variant="secondary" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              }
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredVacantes.map((v) => {
                const title = v.titulo || v.cargo;
                const company = v.empresa_nombre || v.empresa;
                return (
                  <Card key={v.id} className="card-interactive" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '260px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <Badge variant="primary">{v.modalidad || 'Presencial'}</Badge>
                          <Badge variant="gray">{v.tipo_contrato || 'Contrato de Aprendizaje'}</Badge>
                        </div>

                        <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: '4px' }}>
                          <Link to={`/ofertas/${v.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {title}
                          </Link>
                        </h3>

                        <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '8px' }}>
                          {company}
                        </p>

                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {v.descripcion}
                        </p>

                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          <span>📍 {v.ubicacion}</span>
                          {v.salario && <span>💰 {v.salario}</span>}
                          {v.fecha_publicacion && (
                            <span>📅 Publicado: {new Date(v.fecha_publicacion).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <Link to={`/ofertas/${v.id}`} className="btn btn-primary btn-sm">
                          Ver detalle y postular
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
