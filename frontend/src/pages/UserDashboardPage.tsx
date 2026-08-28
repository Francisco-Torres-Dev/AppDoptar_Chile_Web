import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { petService } from '../services/petService';
import { campaignService } from '../services/campaignService';
import { adoptionService } from '../services/adoptionService';
import { donationService } from '../services/donationService';
import type { Pet, Campaign, AdoptionRequest, Donation } from '../types';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'overview' | 'pets' | 'requests' | 'campaigns' | 'donations' | 'profile'>('overview');
  const [stats, setStats] = useState({ pets: 0, adoptions: 0, campaigns: 0, donations: 0 });
  const [pets, setPets] = useState<Pet[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      petService.getAll({ ownerId: user.id }).catch(() => []),
      campaignService.getAll({ userId: user.id }).catch(() => []),
      adoptionService.getRequests({ userId: user.id }).catch(() => []),
      donationService.getAll({ userId: user.id }).catch(() => []),
    ]).then(([p, c, r, d]) => {
      setPets(p);
      setCampaigns(c);
      setRequests(r);
      setDonations(d);
      setStats({
        pets: p.length,
        adoptions: r.filter((x: AdoptionRequest) => x.status === 'aprobada').length,
        campaigns: c.length,
        donations: d.reduce((sum: number, d: Donation) => sum + (d.amount || 0), 0),
      });
    }).finally(() => setLoading(false));
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container py-4">
      <Breadcrumbs items={[{ label: 'Mi Dashboard' }]} />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0">¡Bienvenido, {user?.firstName}! 👋</h1>
        <small className="text-muted">{user?.email}</small>
      </div>

      {/* Statistics Cards */}
      {tab === 'overview' && (
        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-lg-3">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">Mis mascotas</p>
                  <h3 className="h4 mb-0">{stats.pets}</h3>
                </div>
                <i className="bi bi-paw fs-4 text-primary opacity-50" />
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">Adopciones aprobadas</p>
                  <h3 className="h4 mb-0">{stats.adoptions}</h3>
                </div>
                <i className="bi bi-heart-fill fs-4 text-danger opacity-50" />
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">Campañas activas</p>
                  <h3 className="h4 mb-0">{stats.campaigns}</h3>
                </div>
                <i className="bi bi-cash-stack fs-4 text-success opacity-50" />
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">Total donado</p>
                  <h3 className="h4 mb-0">${stats.donations.toLocaleString('es-CL')}</h3>
                </div>
                <i className="bi bi-gift fs-4 text-warning opacity-50" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="nav nav-tabs mb-4 border-bottom">
        <button className={`nav-link ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>
          Resumen
        </button>
        <button className={`nav-link ${tab === 'pets' ? 'active' : ''}`} onClick={() => setTab('pets')}>
          Mis mascotas ({pets.length})
        </button>
        <button className={`nav-link ${tab === 'requests' ? 'active' : ''}`} onClick={() => setTab('requests')}>
          Solicitudes ({requests.length})
        </button>
        <button className={`nav-link ${tab === 'campaigns' ? 'active' : ''}`} onClick={() => setTab('campaigns')}>
          Campañas ({campaigns.length})
        </button>
        <button className={`nav-link ${tab === 'donations' ? 'active' : ''}`} onClick={() => setTab('donations')}>
          Donaciones ({donations.length})
        </button>
        <button className={`nav-link ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
          Perfil
        </button>
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Acciones rápidas</h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <Link to="/publicar-mascota" className="btn btn-outline-primary">
                    <i className="bi bi-plus-circle me-2" />
                    Publicar mascota
                  </Link>
                  <Link to="/crowdfunding/crear" className="btn btn-outline-success">
                    <i className="bi bi-cash-coin me-2" />
                    Crear campaña
                  </Link>
                  <Link to="/reportar" className="btn btn-outline-danger">
                    <i className="bi bi-exclamation-triangle me-2" />
                    Reportar emergencia
                  </Link>
                  <Link to="/favoritos" className="btn btn-outline-warning">
                    <i className="bi bi-heart me-2" />
                    Ver favoritos
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Actividad reciente</h5>
              </div>
              <div className="card-body">
                {requests.length > 0 || pets.length > 0 || campaigns.length > 0 ? (
                  <ul className="list-unstyled">
                    {requests.slice(0, 3).map((r) => (
                      <li key={r.id} className="mb-3 pb-3 border-bottom small">
                        <i className="bi bi-heart-fill text-danger me-2" />
                        <strong>Solicitud de adopción</strong>
                        <br />
                        <small className="text-muted">Estado: {r.status}</small>
                      </li>
                    ))}
                    {pets.slice(0, 3).map((p) => (
                      <li key={p.id} className="mb-3 pb-3 border-bottom small">
                        <i className="bi bi-paw text-primary me-2" />
                        <strong>{p.name}</strong> publicado
                        <br />
                        <small className="text-muted">Estado: {p.status}</small>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">Sin actividad reciente</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pets Tab */}
      {tab === 'pets' && (
        <div className="card border-0 shadow-sm">
          <div className="card-header">
            <h5 className="mb-0">Mis mascotas publicadas</h5>
          </div>
          <div className="card-body">
            {pets.length === 0 ? (
              <div className="alert alert-info">
                <p className="mb-0">No tienes mascotas publicadas aún. <Link to="/publicar-mascota">Publicar mascota</Link></p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Especie</th>
                      <th>Estado</th>
                      <th>Edad</th>
                      <th>Ubicación</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pets.map((p) => (
                      <tr key={p.id}>
                        <td><strong>{p.name}</strong></td>
                        <td>{p.species}</td>
                        <td><span className={`badge bg-${p.status === 'disponible' ? 'success' : p.status === 'adoptado' ? 'secondary' : 'warning'}`}>{p.status}</span></td>
                        <td>{p.age}</td>
                        <td>{p.region}</td>
                        <td>
                          <Link to={`/mascotas/${p.id}`} className="btn btn-sm btn-outline-primary">Ver</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Requests Tab */}
      {tab === 'requests' && (
        <div className="card border-0 shadow-sm">
          <div className="card-header">
            <h5 className="mb-0">Solicitudes de adopción recibidas</h5>
          </div>
          <div className="card-body">
            {requests.length === 0 ? (
              <p className="text-muted">No tienes solicitudes de adopción</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Mascota</th>
                      <th>Solicitante</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((r) => (
                      <tr key={r.id}>
                        <td><strong>{r.petId}</strong></td>
                        <td>{r.userId}</td>
                        <td><span className={`badge bg-${r.status === 'aprobada' ? 'success' : r.status === 'rechazada' ? 'danger' : 'warning'}`}>{r.status}</span></td>
                        <td>{new Date(r.createdAt).toLocaleDateString('es-CL')}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-success me-1">Aprobar</button>
                          <button className="btn btn-sm btn-outline-danger">Rechazar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {tab === 'campaigns' && (
        <div className="card border-0 shadow-sm">
          <div className="card-header">
            <h5 className="mb-0">Mis campañas de crowdfunding</h5>
          </div>
          <div className="card-body">
            {campaigns.length === 0 ? (
              <div className="alert alert-info">
                <p className="mb-0">No tienes campañas activas. <Link to="/crowdfunding/crear">Crear campaña</Link></p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Recaudado</th>
                      <th>Meta</th>
                      <th>Progreso</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((c) => {
                      const progress = (c.raisedAmount / c.goalAmount) * 100;
                      return (
                        <tr key={c.id}>
                          <td><strong>{c.title}</strong></td>
                          <td>${c.raisedAmount.toLocaleString('es-CL')}</td>
                          <td>${c.goalAmount.toLocaleString('es-CL')}</td>
                          <td>
                            <div className="progress" style={{ height: '20px' }}>
                              <div className="progress-bar" style={{ width: `${Math.min(progress, 100)}%` }}>
                                {Math.round(progress)}%
                              </div>
                            </div>
                          </td>
                          <td><span className={`badge bg-${c.status === 'activa' ? 'success' : 'secondary'}`}>{c.status}</span></td>
                          <td><Link to={`/crowdfunding/${c.id}`} className="btn btn-sm btn-outline-primary">Ver</Link></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Donations Tab */}
      {tab === 'donations' && (
        <div className="card border-0 shadow-sm">
          <div className="card-header">
            <h5 className="mb-0">Mi historial de donaciones</h5>
          </div>
          <div className="card-body">
            {donations.length === 0 ? (
              <div className="alert alert-info">
                <p className="mb-0">No tienes donaciones registradas. <Link to="/crowdfunding">Explorar campañas</Link></p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Campaña</th>
                      <th>Monto</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((d) => (
                      <tr key={d.id}>
                        <td><strong>{d.campaignId}</strong></td>
                        <td>${d.amount.toLocaleString('es-CL')}</td>
                        <td>{new Date(d.createdAt).toLocaleDateString('es-CL')}</td>
                        <td><span className="badge bg-success">Completada</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Información personal</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label text-muted small">Nombre</label>
                  <p className="mb-2">{user?.firstName} {user?.lastName}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted small">Correo</label>
                  <p className="mb-2">{user?.email}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted small">Teléfono</label>
                  <p className="mb-2">{user?.phone || 'No especificado'}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted small">Rol</label>
                  <p className="mb-0"><span className="badge bg-info">{user?.role}</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Acciones de cuenta</h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-primary">
                    <i className="bi bi-pencil me-2" />
                    Editar perfil
                  </button>
                  <button className="btn btn-outline-warning">
                    <i className="bi bi-key me-2" />
                    Cambiar contraseña
                  </button>
                  <button className="btn btn-outline-danger">
                    <i className="bi bi-lock me-2" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
