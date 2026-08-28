import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { foundationService } from '../services/foundationService';
import type { Foundation } from '../types';

export default function FoundationsPage() {
  const [foundations, setFoundations] = useState<Foundation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    foundationService.getAll().then(setFoundations).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Cargando fundaciones..." />;

  return (
    <div className="container py-5">
      <Breadcrumbs items={[{ label: 'Fundaciones' }]} />
      
      {/* Header Section */}
      <div className="mb-5">
        <h1 className="display-5 fw-bold gradient-text mb-2">Fundaciones de mascotas</h1>
        <p className="text-muted lead">
          Conecta con organizaciones dedicadas a proteger y ayudar a animales en Chile
        </p>
      </div>

      {/* Stats Section */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '1rem', background: 'linear-gradient(135deg, #F0F4FF 0%, #FFFFFF 100%)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏢</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#6366F1', marginBottom: '0.25rem' }}>
              {foundations.length}
            </div>
            <div className="text-muted small">Fundaciones activas</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '1rem', background: 'linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 100%)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🇨🇱</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10B981', marginBottom: '0.25rem' }}>
              {new Set(foundations.map(f => f.region)).size}
            </div>
            <div className="text-muted small">Regiones cubiertas</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '1rem', background: 'linear-gradient(135deg, #FFFBEB 0%, #FFFFFF 100%)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🐾</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#F59E0B', marginBottom: '0.25rem' }}>
              +500
            </div>
            <div className="text-muted small">Mascotas ayudadas</div>
          </div>
        </div>
      </div>

      {foundations.length === 0 ? (
        <div className="card border-0 shadow-lg p-5 text-center" style={{ borderRadius: '1rem', background: 'linear-gradient(135deg, #F0F4FF 0%, #FFFFFF 100%)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏢</div>
          <h2 className="display-6 fw-bold mb-3">No hay fundaciones registradas</h2>
          <p className="lead mb-4 text-muted">
            Sé la primera organización en unirse a nuestra plataforma y ayudar a más mascotas.
          </p>
          <Link to="/registro" className="btn btn-lg" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', color: 'white', border: 'none' }}>
            <i className="bi bi-plus-circle me-2"></i>
            Registrar fundación
          </Link>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <p className="text-muted mb-0">
              <i className="bi bi-info-circle me-1"></i>
              Se encontraron <strong>{foundations.length}</strong> fundaciones
            </p>
          </div>
          <div className="row g-4">
            {foundations.map((f, index) => (
              <div key={f.id} className="col-md-6 col-lg-4 animate-slide-in" style={{ animationDelay: `${0.05 * index}s` }}>
                <Link to={`/fundaciones/${f.id}`} className="text-decoration-none">
                  <div className="card border-0 shadow h-100 hover-lift" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                    {f.logo ? (
                      <img 
                        src={f.logo} 
                        alt={f.name} 
                        className="card-img-top" 
                        style={{ height: '180px', objectFit: 'cover' }} 
                      />
                    ) : (
                      <div 
                        className="card-img-top d-flex align-items-center justify-content-center" 
                        style={{ 
                          height: '180px', 
                          background: 'linear-gradient(135deg, #F0F4FF 0%, #E0E7FF 100%)',
                          fontSize: '3rem'
                        }}
                      >
                        🏢
                      </div>
                    )}
                    <div className="card-body">
                      <div className="mb-2">
                        <span className="badge fw-semibold" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', color: 'white' }}>
                          Verificada
                        </span>
                      </div>
                      <h3 className="h5 fw-bold mb-2">{f.name}</h3>
                      <p className="text-muted small mb-3" style={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {f.description}
                      </p>
                      <div className="d-flex align-items-center gap-2 text-muted small">
                        <i className="bi bi-geo-alt-fill" style={{ color: '#6366F1' }} />
                        <span>{f.commune}, {f.region}</span>
                      </div>
                    </div>
                    <div className="card-footer bg-white border-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="small text-muted">
                          <i className="bi bi-people-fill me-1"></i>
                          Voluntariado disponible
                        </span>
                        <span className="fw-semibold" style={{ color: '#6366F1' }}>
                          Ver más <i className="bi bi-arrow-right"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
