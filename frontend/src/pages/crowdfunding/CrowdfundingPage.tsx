import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CampaignCard } from '../../components/cards/CampaignCard';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { EmptyState, LoadingSpinner } from '../../components/common/LoadingSpinner';
import { campaignService } from '../../services/campaignService';
import type { Campaign } from '../../types';

export default function CrowdfundingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    campaignService.getAll({ status: 'activa' }).then(setCampaigns).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-5">
      <Breadcrumbs items={[{ label: 'Crowdfunding' }]} />
      
      {/* Header Section */}
      <div className="mb-5">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <h1 className="display-5 fw-bold gradient-text mb-2">Campañas de crowdfunding</h1>
            <p className="text-muted lead">Apoya causas que transforman vidas de mascotas necesitadas</p>
          </div>
          <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
            <Link to="/crear-campana" className="btn btn-lg" style={{ background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)', color: 'white', border: 'none' }}>
              <i className="bi bi-plus-circle me-2"></i>
              Crear campaña
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '1rem', background: 'linear-gradient(135deg, #F0F4FF 0%, #FFFFFF 100%)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💰</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--forest)', marginBottom: '0.25rem' }}>
              ${campaigns.reduce((sum, c) => sum + c.raisedAmount, 0).toLocaleString()}
            </div>
            <div className="text-muted small">Recaudado total</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '1rem', background: 'linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 100%)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎯</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10B981', marginBottom: '0.25rem' }}>
              {campaigns.length}
            </div>
            <div className="text-muted small">Campañas activas</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '1rem', background: 'linear-gradient(135deg, #FFFBEB 0%, #FFFFFF 100%)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>❤️</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#F59E0B', marginBottom: '0.25rem' }}>
              {campaigns.reduce((sum, c) => sum + c.donorCount, 0)}
            </div>
            <div className="text-muted small">Donantes</div>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Cargando campañas..." />
      ) : campaigns.length === 0 ? (
        <EmptyState 
          icon="bi-cash-coin" 
          title="No hay campañas activas" 
          description="Sé el primero en crear una campaña y empezar a recaudar fondos para ayudar a mascotas." 
          action={<Link to="/crear-campana" className="btn btn-lg" style={{ background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)', color: 'white', border: 'none' }}>Crear campaña</Link>} 
        />
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <p className="text-muted mb-0">
              <i className="bi bi-info-circle me-1"></i>
              Se encontraron <strong>{campaigns.length}</strong> campañas activas
            </p>
          </div>
          <div className="row g-4">
            {campaigns.map((c, index) => (
              <div key={c.id} className="col-md-6 col-lg-4 animate-slide-in" style={{ animationDelay: `${0.05 * index}s` }}>
                <CampaignCard campaign={c} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
