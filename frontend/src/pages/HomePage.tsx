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
import heroImg from '../assets/Hero1.png';

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
      <section className="hero-banner" aria-label="Inicio AppDoptar Chile">
        <div className="hero-banner-frame">
          <img src={heroImg} alt="Ellos te están esperando. Conecta, adopta y cambia una vida." className="hero-banner-img" />
          <Link to="/adopciones" className="hero-hotspot hero-hotspot-adopt" aria-label="Ver mascotas en adopción" />
          <Link to="/match" className="hero-hotspot hero-hotspot-how" aria-label="¿Cómo adoptar?" />
          <Link to="/adopciones" className="hero-hotspot hero-hotspot-adopciones" aria-label="Adopciones seguras" />
          <Link to="/donaciones" className="hero-hotspot hero-hotspot-bienestar" aria-label="Comprometidos con su bienestar" />
          <Link to="/fundaciones" className="hero-hotspot hero-hotspot-comunidad" aria-label="Comunidad que hace la diferencia" />
          <Link to="/adopciones" className="hero-hotspot hero-hotspot-cta-banner" aria-label="Cada adopción es una nueva historia" />
        </div>
        <div className="hero-actions-mobile">
          <Link to="/adopciones" className="btn btn-primary">Ver mascotas en adopción</Link>
          <Link to="/match" className="btn btn-outline-primary">¿Cómo adoptar?</Link>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {[
              { to: '/adopciones', icon: '🏠', title: 'Adopción', desc: 'Encuentra un compañero y dale un hogar.', bg: '#e8f1fb' },
              { to: '/crowdfunding', icon: '💚', title: 'Crowdfunding', desc: 'Apoya tratamientos, rescates y fundaciones.', bg: '#fde8ea' },
              { to: '/mapa', icon: '🗺️', title: 'Mapa Animal', desc: 'Reporta y ayuda a animales que necesitan asistencia.', bg: '#eaf6fc' },
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
              <p className="text-muted mb-0">Perfiles de demostración listos para adoptar.</p>
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
              <p className="text-muted mb-0">Apoya tratamientos, rescates y fundaciones.</p>
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
