import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { foundationService } from '../services/foundationService';
import type { Foundation } from '../types';

export default function FoundationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [foundation, setFoundation] = useState<Foundation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    foundationService.getById(id).then(setFoundation).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!foundation) return <div className="container py-5 text-center"><h1>Fundación no encontrada</h1></div>;

  return (
    <div className="container py-4">
      <Breadcrumbs items={[{ label: 'Fundaciones', to: '/fundaciones' }, { label: foundation.name }]} />
      
      <div className="row g-4">
        <div className="col-lg-4">
          {foundation.logo && (
            <img src={foundation.logo} alt={foundation.name} className="w-100 rounded-3 shadow-sm mb-3" />
          )}
          <div className="card border-0 shadow-sm p-3">
            <p className="text-muted small mb-2">Ubicación</p>
            <p className="mb-3">
              <i className="bi bi-geo-alt me-2" />
              {foundation.commune}, {foundation.region}
            </p>
            
            {foundation.website && (
              <>
                <p className="text-muted small mb-2">Sitio Web</p>
                <p className="mb-3">
                  <a href={foundation.website} target="_blank" rel="noopener noreferrer">
                    {foundation.website}
                  </a>
                </p>
              </>
            )}

            {foundation.socialMedia && (
              <>
                <p className="text-muted small mb-2">Redes Sociales</p>
                <div className="d-flex gap-2">
                  {foundation.socialMedia.facebook && (
                    <a href={foundation.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                      <i className="bi bi-facebook" />
                    </a>
                  )}
                  {foundation.socialMedia.instagram && (
                    <a href={foundation.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-danger">
                      <i className="bi bi-instagram" />
                    </a>
                  )}
                  {foundation.socialMedia.twitter && (
                    <a href={foundation.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-info">
                      <i className="bi bi-twitter" />
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="col-lg-8">
          <h1 className="h2 mb-3">{foundation.name}</h1>
          <p className="lead">{foundation.description}</p>
          {foundation.verified && (
            <span className="badge bg-success mb-3">Fundación verificada</span>
          )}
        </div>
      </div>
    </div>
  );
}
