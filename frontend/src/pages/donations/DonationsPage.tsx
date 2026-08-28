import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { campaignService } from '../../services/campaignService';
import { donationService } from '../../services/donationService';
import { formatCurrency } from '../../utils/formatters';
import { isValidEmail } from '../../utils/validation';
import type { Campaign } from '../../types';

export default function DonationsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [params] = useSearchParams();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [form, setForm] = useState({
    campaignId: params.get('campaign') || '',
    amount: 5000,
    donorName: user ? `${user.firstName} ${user.lastName}` : '',
    donorEmail: user?.email || '',
    anonymous: false,
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    campaignService.getAll({ status: 'activa' }).then(setCampaigns);
  }, []);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        donorName: `${user.firstName} ${user.lastName}`,
        donorEmail: user.email,
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.campaignId) {
      showToast('Selecciona una campaña', 'warning');
      return;
    }
    if (!isValidEmail(form.donorEmail)) {
      showToast('Email inválido', 'error');
      return;
    }
    if (form.amount < 1000) {
      showToast('Monto mínimo: $1.000 CLP', 'error');
      return;
    }
    setLoading(true);
    try {
      await donationService.donate({
        ...form,
        userId: user?.id,
      });
      setSuccess(true);
      showToast('¡Donación realizada correctamente! (simulada)', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al donar', 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectedCampaign = campaigns.find((c) => c.id === form.campaignId);

  return (
    <div className="container py-5">
      <Breadcrumbs items={[{ label: 'Donaciones' }]} />
      
      {/* Header Section */}
      <div className="mb-5">
        <h1 className="display-5 fw-bold gradient-text mb-2">Realizar una donación</h1>
        <p className="text-muted lead">
          Tu aporte marca la diferencia en la vida de muchas mascotas. Las donaciones son simuladas en esta versión MVP.
        </p>
      </div>

      {success ? (
        <div className="card border-0 shadow-lg p-5 text-center" style={{ borderRadius: '1rem', background: 'linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 100%)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2 className="display-6 fw-bold mb-3" style={{ color: '#10B981' }}>¡Gracias por tu donación!</h2>
          <p className="lead mb-4">Tu aporte de <strong>{formatCurrency(form.amount)}</strong> fue registrado correctamente.</p>
          <button 
            type="button" 
            className="btn btn-lg" 
            style={{ background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)', color: 'white', border: 'none' }}
            onClick={() => setSuccess(false)}
          >
            <i className="bi bi-arrow-repeat me-2"></i>
            Hacer otra donación
          </button>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-7">
            <form onSubmit={handleSubmit} className="card border-0 shadow-lg p-4" style={{ borderRadius: '1rem' }}>
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  <i className="bi bi-heart-fill me-2" style={{ color: '#10B981' }}></i>
                  Selecciona una campaña *
                </label>
                <select 
                  className="form-select form-select-lg" 
                  required 
                  value={form.campaignId} 
                  onChange={(e) => setForm({ ...form, campaignId: e.target.value })}
                >
                  <option value="">Seleccionar campaña...</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  <i className="bi bi-cash-coin me-2" style={{ color: '#F59E0B' }}></i>
                  Monto a donar (CLP) *
                </label>
                <input 
                  type="number" 
                  min={1000} 
                  step={1000} 
                  className="form-control form-control-lg" 
                  required 
                  value={form.amount} 
                  onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} 
                  placeholder="Monto mínimo: $1.000"
                />
                <div className="d-flex gap-2 mt-3 flex-wrap">
                  {[5000, 10000, 25000, 50000].map((a) => (
                    <button 
                      key={a} 
                      type="button" 
                      className="btn btn-outline-secondary"
                      style={{ borderColor: '#6366F1', color: '#6366F1' }}
                      onClick={() => setForm({ ...form, amount: a })}
                    >
                      {formatCurrency(a)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  <i className="bi bi-person-fill me-2" style={{ color: '#6366F1' }}></i>
                  Tu nombre *
                </label>
                <input 
                  className="form-control form-control-lg" 
                  required 
                  value={form.donorName} 
                  onChange={(e) => setForm({ ...form, donorName: e.target.value })} 
                  disabled={form.anonymous} 
                  placeholder="Nombre completo"
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  <i className="bi bi-envelope-fill me-2" style={{ color: '#6366F1' }}></i>
                  Correo electrónico *
                </label>
                <input 
                  type="email" 
                  className="form-control form-control-lg" 
                  required 
                  value={form.donorEmail} 
                  onChange={(e) => setForm({ ...form, donorEmail: e.target.value })} 
                  placeholder="tu@email.com"
                />
              </div>

              <div className="form-check mb-4 p-3" style={{ background: '#F0F4FF', borderRadius: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  id="anon" 
                  checked={form.anonymous} 
                  onChange={(e) => setForm({ ...form, anonymous: e.target.checked })} 
                />
                <label className="form-check-label fw-semibold" htmlFor="anon">
                  <i className="bi bi-incognito me-2"></i>
                  Donación anónima
                </label>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  <i className="bi bi-chat-text-fill me-2" style={{ color: '#8B5CF6' }}></i>
                  Mensaje de apoyo (opcional)
                </label>
                <textarea 
                  className="form-control" 
                  rows={3} 
                  value={form.message} 
                  onChange={(e) => setForm({ ...form, message: e.target.value })} 
                  placeholder="Deja un mensaje de aliento..."
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-lg w-100 fw-bold" 
                style={{ background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)', color: 'white', border: 'none' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Procesando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-heart-fill me-2"></i>
                    Donar ahora
                  </>
                )}
              </button>
            </form>
          </div>
          
          {selectedCampaign && (
            <div className="col-lg-5">
              <div className="card border-0 shadow-lg p-4" style={{ borderRadius: '1rem', position: 'sticky', top: '100px' }}>
                <img 
                  src={selectedCampaign.image} 
                  alt="" 
                  className="w-100 rounded mb-3" 
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="mb-3">
                  <span className="badge fw-semibold" style={{ background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)', color: 'white' }}>
                    {selectedCampaign.status}
                  </span>
                </div>
                <h3 className="h4 fw-bold mb-2">{selectedCampaign.title}</h3>
                <p className="text-muted mb-3">{selectedCampaign.description}</p>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="fw-semibold">Progreso</span>
                    <span className="fw-bold" style={{ color: 'var(--forest)' }}>
                      {Math.round((selectedCampaign.raisedAmount / selectedCampaign.goalAmount) * 100)}%
                    </span>
                  </div>
                  <div className="progress" style={{ height: '10px' }}>
                    <div 
                      className="progress-bar" 
                      style={{ 
                        width: `${(selectedCampaign.raisedAmount / selectedCampaign.goalAmount) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between mt-2 small text-muted">
                    <span>{formatCurrency(selectedCampaign.raisedAmount)} recaudado</span>
                    <span>Meta: {formatCurrency(selectedCampaign.goalAmount)}</span>
                  </div>
                </div>

                <div className="d-flex gap-2 text-muted small">
                  <span><i className="bi bi-people-fill me-1"></i>{selectedCampaign.donorCount} donantes</span>
                  <span><i className="bi bi-calendar-fill me-1"></i>{new Date(selectedCampaign.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
