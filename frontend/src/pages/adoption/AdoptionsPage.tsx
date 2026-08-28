import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PetCard } from '../../components/cards/PetCard';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { EmptyState, LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useDebounce } from '../../hooks/useDebounce';
import { petService, type PetFilters } from '../../services/petService';
import { CHILE_REGIONS } from '../../utils/constants';
import type { Pet } from '../../types';

export default function AdoptionsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PetFilters>({ sort: 'newest' });
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    setLoading(true);
    petService.getAll({ ...filters, search: debouncedSearch })
      .then(setPets)
      .finally(() => setLoading(false));
  }, [filters, debouncedSearch]);

  const updateFilter = <K extends keyof PetFilters>(key: K, value: PetFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  };

  return (
    <div className="container py-4">
      <Breadcrumbs items={[{ label: 'Adopciones' }]} />
      
      {/* Header Section */}
      <div className="mb-5">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <h1 className="display-5 fw-bold gradient-text mb-2">Mascotas en adopción</h1>
            <p className="text-muted lead">Encuentra a tu compañero perfecto entre nuestros amigos buscando hogar</p>
          </div>
          <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
            <Link to="/match" className="btn btn-lg" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', color: 'white', border: 'none' }}>
              <i className="bi bi-heart-half me-2"></i>
              Match de adopción
            </Link>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Filters Sidebar */}
        <aside className="col-lg-3">
          <div className="card border-0 shadow p-4 sticky-top animate-scale-in" style={{ top: 80, borderRadius: 'var(--radius-lg)' }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h2 className="h5 fw-bold mb-0">
                <i className="bi bi-funnel-fill me-2" style={{ color: 'var(--primary)' }}></i>
                Filtros
              </h2>
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={() => setFilters({ sort: 'newest' })}
              >
                <i className="bi bi-x-circle"></i>
              </button>
            </div>
            
            <div className="mb-4">
              <label className="form-label fw-semibold">Buscar</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input 
                  type="search" 
                  className="form-control" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  placeholder="Nombre, raza..." 
                  aria-label="Buscar mascotas" 
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Especie</label>
              <select 
                className="form-select" 
                value={filters.species || ''} 
                onChange={(e) => updateFilter('species', e.target.value as PetFilters['species'])}
              >
                <option value="">Todas</option>
                <option value="perro">🐕 Perro</option>
                <option value="gato">🐱 Gato</option>
                <option value="otro">🐾 Otros</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Sexo</label>
              <select 
                className="form-select" 
                value={filters.sex || ''} 
                onChange={(e) => updateFilter('sex', e.target.value as PetFilters['sex'])}
              >
                <option value="">Todos</option>
                <option value="macho">♂ Macho</option>
                <option value="hembra">♀ Hembra</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Edad</label>
              <select 
                className="form-select" 
                value={filters.age || ''} 
                onChange={(e) => updateFilter('age', e.target.value as PetFilters['age'])}
              >
                <option value="">Todas</option>
                <option value="cachorro">🍼 Cachorro</option>
                <option value="adulto">🐕 Adulto</option>
                <option value="senior">👴 Senior</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Tamaño</label>
              <select 
                className="form-select" 
                value={filters.size || ''} 
                onChange={(e) => updateFilter('size', e.target.value as PetFilters['size'])}
              >
                <option value="">Todos</option>
                <option value="pequeño">📏 Pequeño</option>
                <option value="mediano">📐 Mediano</option>
                <option value="grande">🏢 Grande</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Región</label>
              <select 
                className="form-select" 
                value={filters.region || ''} 
                onChange={(e) => updateFilter('region', e.target.value)}
              >
                <option value="">Todas</option>
                {CHILE_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold mb-2">Características</label>
              <div className="form-check mb-2">
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  id="sterilized" 
                  checked={filters.sterilized === true} 
                  onChange={(e) => updateFilter('sterilized', e.target.checked ? true : undefined)} 
                />
                <label className="form-check-label" htmlFor="sterilized">
                  <i className="bi bi-check-circle-fill me-1" style={{ color: 'var(--success)' }}></i>
                  Esterilizado
                </label>
              </div>
              <div className="form-check mb-3">
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  id="vaccinated" 
                  checked={filters.vaccinated === true} 
                  onChange={(e) => updateFilter('vaccinated', e.target.checked ? true : undefined)} 
                />
                <label className="form-check-label" htmlFor="vaccinated">
                  <i className="bi bi-shield-check-fill me-1" style={{ color: 'var(--success)' }}></i>
                  Vacunado
                </label>
              </div>
            </div>

            <div className="mb-0">
              <label className="form-label fw-semibold">Ordenar</label>
              <select 
                className="form-select" 
                value={filters.sort || 'newest'} 
                onChange={(e) => updateFilter('sort', e.target.value as PetFilters['sort'])}
              >
                <option value="newest">🕐 Más recientes</option>
                <option value="oldest">📅 Más antiguos</option>
                <option value="name">🔤 Nombre A-Z</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Results Grid */}
        <div className="col-lg-9">
          {loading ? (
            <LoadingSpinner text="Buscando mascotas..." />
          ) : pets.length === 0 ? (
            <EmptyState 
              icon="bi-search" 
              title="No se encontraron mascotas" 
              description="Intenta ajustar los filtros de búsqueda para encontrar tu compañero perfecto." 
            />
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <p className="text-muted mb-0">
                  <i className="bi bi-info-circle me-1"></i>
                  Se encontraron <strong>{pets.length}</strong> mascotas
                </p>
              </div>
              <div className="row g-4">
                {pets.map((pet, index) => (
                  <div key={pet.id} className="col-sm-6 col-xl-4 animate-slide-in" style={{ animationDelay: `${0.05 * index}s` }}>
                    <PetCard pet={pet} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
