import { Link } from 'react-router-dom';
import type { Campaign } from '../../types';
import { calculateProgress, formatCurrency } from '../../utils/formatters';

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = calculateProgress(campaign.raisedAmount, campaign.goalAmount);

  return (
    <article className="card campaign-card h-100 border-0 shadow-sm">
      <div className="campaign-card-img-wrapper position-relative" style={{ height: '180px', overflow: 'hidden' }}>
        <img 
          src={campaign.image} 
          alt={campaign.title} 
          className="card-img-top" 
          loading="lazy" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }} 
        />
        {campaign.isDemo && (
          <span className="badge demo-badge position-absolute top-0 end-0 m-2">Demo</span>
        )}
        <div className="position-absolute bottom-0 start-0 end-0 p-3" style={{ 
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' 
        }}>
          <span className="badge bg-light text-dark fw-semibold">
            <i className="bi bi-tag-fill me-1"></i>
            {campaign.category}
          </span>
        </div>
      </div>
      <div className="card-body d-flex flex-column">
        <h3 className="h5 card-title fw-bold mb-2">{campaign.title}</h3>
        <p className="text-muted small flex-grow-1 mb-3" style={{ lineHeight: '1.6' }}>
          {campaign.description.slice(0, 100)}...
        </p>
        
        <div className="mb-3">
          <div className="d-flex justify-content-between small mb-1">
            <span className="fw-semibold" style={{ color: 'var(--success)' }}>
              <i className="bi bi-cash-stack me-1"></i>
              {formatCurrency(campaign.raisedAmount)}
            </span>
            <span className="text-muted">
              Meta: {formatCurrency(campaign.goalAmount)}
            </span>
          </div>
          <div className="progress" style={{ height: '8px', borderRadius: 'var(--radius-full)' }}>
            <div 
              className="progress-bar" 
              style={{ 
                width: `${progress}%`, 
                background: 'var(--gradient-secondary)',
                borderRadius: 'var(--radius-full)'
              }} 
              role="progressbar" 
              aria-valuenow={progress} 
              aria-valuemin={0} 
              aria-valuemax={100} 
            />
          </div>
          <div className="text-center small mt-1">
            <span className="fw-bold" style={{ color: 'var(--primary)' }}>{progress}%</span> completado
          </div>
        </div>
        
        <Link 
          to={`/crowdfunding/${campaign.id}`} 
          className="btn btn-primary btn-sm mt-auto"
        >
          Ver campaña
        </Link>
      </div>
    </article>
  );
}
