import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { petService } from '../services/petService';
import { campaignService } from '../services/campaignService';
import { adoptionService } from '../services/adoptionService';
import { reportService } from '../services/reportService';
import type { AdoptionRequest, Campaign, Pet, Report } from '../types';

export default function FoundationDashboardPage() {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      petService.getAll({ ownerId: user.id }),
      campaignService.getAll({ userId: user.id }),
      adoptionService.getRequests({ ownerId: user.id }),
      reportService.getAll(),
    ]).then(([p, c, r, rep]) => {
      setPets(p);
      setCampaigns(c);
      setRequests(r);
      setReports(rep.slice(0, 5));
    }).finally(() => setLoading(false));
  }, [user]);

  if (loading) return <LoadingSpinner text="Cargando panel..." />;

  return (
    <div className="container py-4">
      <Breadcrumbs items={[{ label: 'Panel de fundación' }]} />
      <h1 className="h2 mb-4">Panel de fundación</h1>
      <div className="row g-3 mb-4">
        {[
          { label: 'Mascotas', value: pets.length },
          { label: 'Solicitudes', value: requests.length },
          { label: 'Campañas', value: campaigns.length },
          { label: 'Reportes recientes', value: reports.length },
        ].map((s) => (
          <div className="col-6 col-lg-3" key={s.label}>
            <div className="stat-tile">
              <span className="small text-muted">{s.label}</span>
              <strong>{s.value}</strong>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex flex-wrap gap-2 mb-4">
        <Link to="/publicar-mascota" className="btn btn-primary">Publicar mascota</Link>
        <Link to="/crear-campana" className="btn btn-accent">Crear campaña</Link>
        <Link to="/mapa" className="btn btn-ghost">Ver reportes</Link>
      </div>
      <div className="card p-4">
        <h2 className="h5">Solicitudes de adopción</h2>
        {requests.length === 0 ? (
          <p className="text-muted mb-0">Aún no hay solicitudes.</p>
        ) : (
          <ul className="list-unstyled mb-0">
            {requests.map((r) => (
              <li key={r.id} className="d-flex justify-content-between border-bottom py-2">
                <span>Mascota {r.petId} · {r.status}</span>
                <span className="text-muted small">{new Date(r.createdAt).toLocaleDateString('es-CL')}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
