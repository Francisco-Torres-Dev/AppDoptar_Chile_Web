import { useEffect, useState } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PetCard } from '../components/cards/PetCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { petService } from '../services/petService';
import { campaignService } from '../services/campaignService';
import { foundationService } from '../services/foundationService';
import type { Pet, Campaign, Foundation } from '../types';

export default function FavoritesPage() {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      petService.getAll(),
      campaignService.getAll(),
    ]).then(([p, c]) => {
      setPets(p);
      setCampaigns(c);
    }).finally(() => setLoading(false));
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container py-4">
      <Breadcrumbs items={[{ label: 'Favoritos' }]} />
      <h1 className="h2 mb-4">Mis favoritos</h1>

      <div className="mb-5">
        <h2 className="h4 mb-3">Mascotas guardadas ({pets.length})</h2>
        {pets.length === 0 ? (
          <div className="alert alert-info">No tienes mascotas guardadas</div>
        ) : (
          <div className="row g-4">
            {pets.map((pet) => (
              <div key={pet.id} className="col-sm-6 col-xl-4">
                <PetCard pet={pet} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="h4 mb-3">Campañas guardadas ({campaigns.length})</h2>
        {campaigns.length === 0 ? (
          <div className="alert alert-info">No tienes campañas guardadas</div>
        ) : (
          <div className="row g-4">
            {campaigns.map((c) => (
              <div key={c.id} className="col-sm-6 col-xl-4">
                <div className="card border-0 shadow-sm h-100">
                  <img src={c.image} alt={c.title} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                  <div className="card-body">
                    <h3 className="h5">{c.title}</h3>
                    <p className="text-muted small">{c.description.substring(0, 60)}...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
