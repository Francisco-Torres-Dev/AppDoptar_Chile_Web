import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { campaignService } from '../../services/campaignService';
import type { CampaignCategory } from '../../types';

export default function CreateCampaignPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=600&h=400&fit=crop',
    category: 'tratamiento' as CampaignCategory, goalAmount: 100000, deadline: '',
    story: '', vetInfo: '', additionalInfo: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const campaign = await campaignService.create({
        ...form,
        userId: user.id,
        foundationId: user.foundationId,
        evidence: [],
      });
      showToast('Campaña creada. Pendiente de aprobación.', 'success');
      navigate(`/crowdfunding/${campaign.id}`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <Breadcrumbs items={[{ label: 'Crowdfunding', to: '/crowdfunding' }, { label: 'Crear campaña' }]} />
      <h1 className="h2 mb-4">Crear campaña</h1>
      <form onSubmit={handleSubmit} className="card border-0 shadow-sm p-4">
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label">Título *</label>
            <input className="form-control" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="col-12">
            <label className="form-label">Descripción *</label>
            <textarea className="form-control" rows={2} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Categoría *</label>
            <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as CampaignCategory })}>
              <option value="tratamiento">Tratamiento</option>
              <option value="operacion">Operación</option>
              <option value="medicamentos">Medicamentos</option>
              <option value="alimentacion">Alimentación</option>
              <option value="rescate">Rescate</option>
              <option value="refugio">Refugio</option>
              <option value="fundacion">Fundación</option>
              <option value="emergencia">Emergencia</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Meta (CLP) *</label>
            <input type="number" min={1000} className="form-control" required value={form.goalAmount} onChange={(e) => setForm({ ...form, goalAmount: Number(e.target.value) })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Fecha límite *</label>
            <input type="date" className="form-control" required value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">URL imagen</label>
            <input className="form-control" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </div>
          <div className="col-12">
            <label className="form-label">Historia del caso *</label>
            <textarea className="form-control" rows={4} required value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} />
          </div>
          <div className="col-12">
            <label className="form-label">Información veterinaria</label>
            <input className="form-control" value={form.vetInfo} onChange={(e) => setForm({ ...form, vetInfo: e.target.value })} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
          {loading ? 'Creando...' : 'Crear campaña'}
        </button>
      </form>
    </div>
  );
}
