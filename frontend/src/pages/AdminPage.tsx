import { useEffect, useState } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../services/adminService';
import { petService } from '../services/petService';
import { campaignService } from '../services/campaignService';
import { reportService } from '../services/reportService';
import type { Pet, Campaign, Report } from '../types';

export default function AdminPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [tab, setTab] = useState<'dashboard' | 'pets' | 'campaigns' | 'reports' | 'users'>('dashboard');
  const [pets, setPets] = useState<Pet[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      setLoading(true);
      Promise.all([
        adminService.getDashboardStats(),
        petService.getAll(),
        campaignService.getAll(),
        reportService.getAll(),
      ]).then(([s, p, c, r]) => {
        setStats(s);
        setPets(p.filter((pet: Pet) => pet.status !== 'adoptado'));
        setCampaigns(c);
        setReports(r.filter((rep: Report) => rep.status === 'reportado' || rep.status === 'en_revision'));
      }).finally(() => setLoading(false));
    }
  }, [user]);

  if (user?.role !== 'ADMIN') {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">
          <h1 className="h3">🚫 Acceso denegado</h1>
          <p className="mb-0">No tienes permisos para acceder a esta página</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Breadcrumbs items={[{ label: 'Administración' }]} />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0">📊 Panel de administración</h1>
        <small className="text-muted">Sesión como: <strong>{user.email}</strong></small>
      </div>

      {/* Statistics Row */}
      {stats && (
        <div className="row g-3 mb-4">
          <div className="col-md-6 col-lg-3">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">Usuarios</p>
                  <h3 className="h4 mb-0">{stats?.totalUsers || 0}</h3>
                </div>
                <i className="bi bi-people fs-4 text-primary opacity-50" />
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">Mascotas en adopción</p>
                  <h3 className="h4 mb-0">{stats?.totalPets || 0}</h3>
                </div>
                <i className="bi bi-paw fs-4 text-success opacity-50" />
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">Campañas activas</p>
                  <h3 className="h4 mb-0">{stats?.activeCampaigns || 0}</h3>
                </div>
                <i className="bi bi-cash-stack fs-4 text-info opacity-50" />
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">Reportes activos</p>
                  <h3 className="h4 mb-0">{stats?.pendingReports || 0}</h3>
                </div>
                <i className="bi bi-exclamation-circle fs-4 text-warning opacity-50" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="nav nav-tabs mb-4 border-bottom">
        <button
          className={`nav-link ${tab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`nav-link ${tab === 'pets' ? 'active' : ''}`}
          onClick={() => setTab('pets')}
        >
          Mascotas ({pets.length})
        </button>
        <button
          className={`nav-link ${tab === 'campaigns' ? 'active' : ''}`}
          onClick={() => setTab('campaigns')}
        >
          Campañas ({campaigns.length})
        </button>
        <button
          className={`nav-link ${tab === 'reports' ? 'active' : ''}`}
          onClick={() => setTab('reports')}
        >
          Reportes ({reports.length})
        </button>
      </div>

      {/* Dashboard Tab */}
      {tab === 'dashboard' && (
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">🔍 Moderación</h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-exclamation-circle me-2" />
                    Revisar {pets.filter(p => p.status === 'pendiente').length} mascotas pendientes
                  </button>
                  <button className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-cash-stack me-2" />
                    Revisar {campaigns.filter(c => c.status === 'pendiente').length} campañas pendientes
                  </button>
                  <button className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-map me-2" />
                    Revisar {reports.length} reportes de emergencia
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">⚙️ Gestión</h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-success btn-sm">
                    <i className="bi bi-people me-2" />
                    Gestionar usuarios ({stats?.totalUsers || 0})
                  </button>
                  <button className="btn btn-outline-success btn-sm">
                    <i className="bi bi-building me-2" />
                    Gestionar fundaciones
                  </button>
                  <button className="btn btn-outline-danger btn-sm">
                    <i className="bi bi-clock-history me-2" />
                    Ver logs de auditoría
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pets Tab */}
      {tab === 'pets' && (
        <div className="card border-0 shadow-sm">
          <div className="card-header">
            <h5 className="mb-0">Mascotas registradas ({pets.length})</h5>
          </div>
          <div className="card-body">
            {pets.length === 0 ? (
              <p className="text-muted">No hay mascotas pendientes de revisión</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Especie</th>
                      <th>Raza</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pets.map((pet) => (
                      <tr key={pet.id}>
                        <td><strong>{pet.name}</strong></td>
                        <td>{pet.species}</td>
                        <td>{pet.breed}</td>
                        <td>
                          <span className={`badge bg-${pet.status === 'disponible' ? 'success' : 'warning'}`}>
                            {pet.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary">Ver</button>
                          <button className="btn btn-sm btn-outline-danger">Eliminar</button>
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
            <h5 className="mb-0">Campañas de crowdfunding ({campaigns.length})</h5>
          </div>
          <div className="card-body">
            {campaigns.length === 0 ? (
              <p className="text-muted">No hay campañas registradas</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Organizador</th>
                      <th>Recaudado</th>
                      <th>Meta</th>
                      <th>Progreso</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => {
                      const progress = (campaign.raisedAmount / campaign.goalAmount) * 100;
                      return (
                        <tr key={campaign.id}>
                          <td><strong>{campaign.title}</strong></td>
                          <td>{campaign.userId}</td>
                          <td>${campaign.raisedAmount}</td>
                          <td>${campaign.goalAmount}</td>
                          <td>
                            <div className="progress" style={{ height: '20px' }}>
                              <div
                                className="progress-bar bg-success"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              >
                                {Math.round(progress)}%
                              </div>
                            </div>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary">Ver</button>
                            <button className="btn btn-sm btn-outline-danger">Cerrar</button>
                          </td>
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

      {/* Reports Tab */}
      {tab === 'reports' && (
        <div className="card border-0 shadow-sm">
          <div className="card-header">
            <h5 className="mb-0">Reportes de emergencia ({reports.length})</h5>
          </div>
          <div className="card-body">
            {reports.length === 0 ? (
              <p className="text-muted">No hay reportes pendientes</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Urgencia</th>
                      <th>Descripción</th>
                      <th>Ubicación</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report.id}>
                        <td><strong>{report.type}</strong></td>
                        <td>
                          <span className={`badge bg-${
                            report.urgency === 'critico' ? 'danger' : 
                            report.urgency === 'alto' ? 'warning' : 
                            report.urgency === 'medio' ? 'info' : 
                            'success'
                          }`}>
                            {report.urgency}
                          </span>
                        </td>
                        <td>{report.description?.substring(0, 40)}...</td>
                        <td>{report.address || 'Sin especificar'}</td>
                        <td>{new Date(report.createdAt).toLocaleDateString('es-CL')}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary">Ver</button>
                          <button className="btn btn-sm btn-outline-success">Resolver</button>
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
    </div>
  );
}
