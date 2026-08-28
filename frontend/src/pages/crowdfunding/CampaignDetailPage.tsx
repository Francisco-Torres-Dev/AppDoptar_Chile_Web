import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { ShareButtons } from '../../components/common/ShareButtons';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { campaignService } from '../../services/campaignService';
import { petService } from '../../services/petService';
import { calculateProgress, formatCurrency, formatDate } from '../../utils/formatters';
import type { Campaign, Pet } from '../../types';

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    campaignService.getById(id).then(async (c) => {
      setCampaign(c);
      if (c?.petId) {
        const p = await petService.getById(c.petId);
        setPet(p);
      }
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!campaign) return <div className="container py-5 text-center"><h1>Campaña no encontrada</h1></div>;

  const progress = calculateProgress(campaign.raisedAmount, campaign.goalAmount);
  const pageUrl = `${window.location.origin}/crowdfunding/${campaign.id}`;

  return (
    <div className="container py-4">
      <Breadcrumbs items={[{ label: 'Crowdfunding', to: '/crowdfunding' }, { label: campaign.title }]} />
      <div className="row g-4">
        <div className="col-lg-8">
          <img src={campaign.image} alt={campaign.title} className="w-100 rounded-3 shadow-sm mb-4 campaign-detail-img" />
          <h1 className="h2">{campaign.title}</h1>
          {campaign.isDemo && <span className="badge bg-warning text-dark mb-3">Demo</span>}
          <p className="lead">{campaign.description}</p>
          <h2 className="h5 mt-4">Historia del caso</h2>
          <p>{campaign.story}</p>
          {campaign.vetInfo && (
            <>
              <h2 className="h5">Información veterinaria</h2>
              <p>{campaign.vetInfo}</p>
            </>
          )}
          {pet && (
            <div className="alert alert-light">
              Mascota asociada: <Link to={`/mascotas/${pet.id}`}>{pet.name}</Link>
            </div>
          )}
          {campaign.updates.length > 0 && (
            <>
              <h2 className="h5 mt-4">Actualizaciones</h2>
              {campaign.updates.map((u) => (
                <div key={u.id} className="card border-0 shadow-sm mb-2 p-3">
                  <strong>{u.title}</strong>
                  <small className="text-muted d-block">{formatDate(u.createdAt)}</small>
                  <p className="mb-0 mt-1">{u.content}</p>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 sticky-top" style={{ top: 80 }}>
            <div className="progress mb-3" style={{ height: 12 }}>
              <div className="progress-bar bg-success" style={{ width: `${progress}%` }} />
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="h4 text-success mb-0">{formatCurrency(campaign.raisedAmount)}</span>
              <span className="text-muted">de {formatCurrency(campaign.goalAmount)}</span>
            </div>
            <p className="text-muted small">{progress}% · {campaign.donorCount} donantes</p>
            <p className="small text-muted">Finaliza: {formatDate(campaign.deadline)}</p>
            <Link to={`/donaciones?campaign=${campaign.id}`} className="btn btn-success w-100 mb-3">
              Donar
            </Link>
            <ShareButtons title={campaign.title} url={pageUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
