import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { petService } from '../../services/petService';
import { CHILE_REGIONS } from '../../utils/constants';
import type { PetAge, PetSex, PetSize, PetSpecies } from '../../types';

export default function PublishPetPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', species: 'perro' as PetSpecies, breed: '', sex: 'macho' as PetSex,
    age: 'adulto' as PetAge, ageYears: 2, size: 'mediano' as PetSize, color: '',
    description: '', healthStatus: '', vaccinated: true, sterilized: false,
    region: '', commune: '', contactInfo: '', adoptionRequirements: '',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const pet = await petService.create({
        ...form,
        images: [form.imageUrl],
        ownerId: user.id,
        foundationId: user.foundationId,
      });
      showToast('Mascota publicada. Pendiente de moderación.', 'success');
      navigate(`/mascotas/${pet.id}`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al publicar', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <Breadcrumbs items={[{ label: 'Publicar mascota' }]} />
      <h1 className="h2 mb-4">Publicar mascota en adopción</h1>
      <form onSubmit={handleSubmit} className="card border-0 shadow-sm p-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nombre *</label>
            <input className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Especie *</label>
            <select className="form-select" value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value as PetSpecies })}>
              <option value="perro">Perro</option>
              <option value="gato">Gato</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Raza *</label>
            <input className="form-control" required value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Sexo *</label>
            <select className="form-select" value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value as PetSex })}>
              <option value="macho">Macho</option>
              <option value="hembra">Hembra</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Edad (años) *</label>
            <input type="number" min={0} className="form-control" required value={form.ageYears} onChange={(e) => setForm({ ...form, ageYears: Number(e.target.value) })} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Categoría edad *</label>
            <select className="form-select" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value as PetAge })}>
              <option value="cachorro">Cachorro</option>
              <option value="adulto">Adulto</option>
              <option value="senior">Senior</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Tamaño *</label>
            <select className="form-select" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value as PetSize })}>
              <option value="pequeño">Pequeño</option>
              <option value="mediano">Mediano</option>
              <option value="grande">Grande</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Color *</label>
            <input className="form-control" required value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
          </div>
          <div className="col-12">
            <label className="form-label">Descripción *</label>
            <textarea className="form-control" rows={3} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Estado de salud *</label>
            <input className="form-control" required value={form.healthStatus} onChange={(e) => setForm({ ...form, healthStatus: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">URL imagen principal</label>
            <input className="form-control" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Región *</label>
            <select className="form-select" required value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
              <option value="">Seleccionar...</option>
              {CHILE_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Comuna *</label>
            <input className="form-control" required value={form.commune} onChange={(e) => setForm({ ...form, commune: e.target.value })} />
          </div>
          <div className="col-12">
            <label className="form-label">Requisitos para adopción *</label>
            <textarea className="form-control" rows={2} required value={form.adoptionRequirements} onChange={(e) => setForm({ ...form, adoptionRequirements: e.target.value })} />
          </div>
          <div className="col-12">
            <div className="form-check form-check-inline">
              <input type="checkbox" className="form-check-input" id="vac" checked={form.vaccinated} onChange={(e) => setForm({ ...form, vaccinated: e.target.checked })} />
              <label className="form-check-label" htmlFor="vac">Vacunado</label>
            </div>
            <div className="form-check form-check-inline">
              <input type="checkbox" className="form-check-input" id="ster" checked={form.sterilized} onChange={(e) => setForm({ ...form, sterilized: e.target.checked })} />
              <label className="form-check-label" htmlFor="ster">Esterilizado</label>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
          {loading ? 'Publicando...' : 'Publicar mascota'}
        </button>
      </form>
    </div>
  );
}
