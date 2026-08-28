import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PetCard } from '../components/cards/PetCard';
import { CampaignCard } from '../components/cards/CampaignCard';
import { ReportCard } from '../components/cards/ReportCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { petService } from '../services/petService';
import { campaignService } from '../services/campaignService';
import { reportService } from '../services/reportService';
import { userService } from '../services/userService';
import { formatCurrency } from '../utils/formatters';
import type { Campaign, Pet, PlatformStats, Report } from '../types';

export default function HomePage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      userService.getStats(),
      petService.getAll({ sort: 'newest' }),
      campaignService.getAll({ status: 'activa' }),
      reportService.getAll(),
    ]).then(([s, p, c, r]) => {
      setStats(s);
      setPets(p.slice(0, 4));
      setCampaigns(c.slice(0, 3));
      setReports(r.slice(0, 3));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Cargando AppDoptar..." />;

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <p className="text-uppercase fw-bold small mb-3" style={{ color: 'var(--clay)', letterSpacing: '0.12em' }}>
                Chile · adopción y rescate
              </p>
              <h1>Conecta, ayuda y cambia una vida.</h1>
              <p className="lead mt-3">
                AppDoptar Chile une mascotas que necesitan un hogar con personas dispuestas a darles una segunda oportunidad.
              </p>
              <div className="d-flex flex-wrap gap-2 mt-4">
                <Link to="/adopciones" className="btn btn-primary btn-lg">Adoptar una mascota</Link>
                <Link to="/reportar" className="btn btn-ghost btn-lg">Reportar emergencia</Link>
                <Link to="/donaciones" className="btn btn-accent btn-lg">Ayudar ahora</Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="hero-panel">
                <img
                  className="hero-photo mb-3"
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=500&fit=crop"
                  alt="Perros jugando al aire libre"
                />
                <div className="d-flex justify-content-between">
                  <div>
                    <strong className="d-block">{stats?.petsAvailable ?? 0} mascotas</strong>
                    <span className="small text-muted">esperando hogar</span>
                  </div>
                  <div className="text-end">
                    <strong className="d-block">{stats?.activeCampaigns ?? 0} campañas</strong>
                    <span className="small text-muted">activas ahora</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {[
              { to: '/adopciones', icon: '🏠', title: 'Adopción', desc: 'Encuentra un compañero y dale un hogar.', bg: '#e8f3ec' },
              { to: '/crowdfunding', icon: '💚', title: 'Crowdfunding', desc: 'Apoya tratamientos, rescates y fundaciones.', bg: '#f8eae4' },
              { to: '/mapa', icon: '🗺️', title: 'Mapa Animal', desc: 'Reporta y ayuda a animales que necesitan asistencia.', bg: '#efe8d8' },
            ].map((m) => (
              <div className="col-md-4" key={m.title}>
                <Link to={m.to} className="text-dark">
                  <article className="module-card hover-card">
                    <div className="module-icon" style={{ background: m.bg }}>{m.icon}</div>
                    <h3 className="h4">{m.title}</h3>
                    <p className="text-muted mb-0">{m.desc}</p>
                  </article>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {stats && (
        <section className="pb-5">
          <div className="container">
            <div className="row g-3">
              {[
                { v: stats.petsAvailable, l: 'En adopción' },
                { v: stats.petsAdopted, l: 'Adoptadas' },
                { v: stats.activeCampaigns, l: 'Campañas' },
                { v: formatCurrency(stats.totalRaised), l: 'Recaudado' },
                { v: stats.reportsResolved, l: 'Reportes atendidos' },
                { v: stats.foundationsRegistered, l: 'Fundaciones' },
              ].map((s) => (
                <div className="col-6 col-md-4 col-lg-2" key={s.l}>
                  <div className="stat-tile">
                    <strong>{s.v}</strong>
                    <span className="small text-muted">{s.l}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-5 section-muted">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="h3 mb-1">Mascotas destacadas</h2>
              <p className="text-muted mb-0">Perfiles reales de demostración listos para adoptar.</p>
            </div>
            <Link to="/adopciones" className="btn btn-ghost">Ver todas</Link>
          </div>
          <div className="row g-4">
            {pets.map((pet) => (
              <div className="col-sm-6 col-lg-3" key={pet.id}>
                <PetCard pet={pet} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="h3 mb-1">Campañas activas</h2>
              <p className="text-muted mb-0">Tu aporte simulado ayuda a mostrar el flujo completo.</p>
            </div>
            <Link to="/crowdfunding" className="btn btn-ghost">Ver campañas</Link>
          </div>
          <div className="row g-4">
            {campaigns.map((c) => (
              <div className="col-md-4" key={c.id}>
                <CampaignCard campaign={c} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 section-muted">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="h3 mb-1">Reportes recientes</h2>
              <p className="text-muted mb-0">Datos de prueba identificados como Demo.</p>
            </div>
            <Link to="/mapa" className="btn btn-ghost">Abrir mapa</Link>
          </div>
          <div className="row g-3">
            {reports.map((r) => (
              <div className="col-md-4" key={r.id}>
                <ReportCard report={r} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
