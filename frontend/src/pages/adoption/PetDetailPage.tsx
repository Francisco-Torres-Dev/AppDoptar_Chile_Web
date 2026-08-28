import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { ShareButtons } from '../../components/common/ShareButtons';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useFavorite } from '../../hooks/useFavorite';
import { petService } from '../../services/petService';
import { userService } from '../../services/userService';
import { adoptionService } from '../../services/adoptionService';
import type { Pet, User } from '../../types';

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { isFavorite, toggle } = useFavorite('pet', id || '');
  const [pet, setPet] = useState<Pet | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(searchParams.get('action') === 'interest');
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [form, setForm] = useState({
    personalInfo: '', experience: '', housing: '', reason: '', availableTime: '', additionalInfo: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    petService.getById(id).then(async (p) => {
      setPet(p);
      if (p) {
        const o = await userService.getById(p.ownerId);
        setOwner(o);
      }
    }).finally(() => setLoading(false));
  }, [id]);

  const handleAdopt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !pet) {
      showToast('Debes iniciar sesión para solicitar adopción', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      await adoptionService.createRequest({
        petId: pet.id,
        userId: user.id,
        ...form,
      });
      showToast('¡Solicitud enviada correctamente!', 'success');
      setShowModal(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al enviar solicitud', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Cargando mascota..." />;
  if (!pet) return <div className="container py-5 text-center"><h1>Mascota no encontrada</h1><Link to="/adopciones" className="btn btn-primary">Volver</Link></div>;

  const pageUrl = `${window.location.origin}/mascotas/${pet.id}`;

  return (
    <div className="container py-4">
      <Breadcrumbs items={[{ label: 'Adopciones', to: '/adopciones' }, { label: pet.name }]} />
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm overflow-hidden mb-3">
            <img src={pet.images[activeImage]} alt={pet.name} className="w-100 pet-detail-main-img" />
          </div>
          {pet.images.length > 1 && (
            <div className="d-flex gap-2 flex-wrap">
              {pet.images.map((img, i) => (
                <button key={img} type="button" className={`pet-thumb-btn ${i === activeImage ? 'active' : ''}`} onClick={() => setActiveImage(i)}>
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="col-lg-5">
          <h1 className="h2">{pet.name}</h1>
          <p className="text-muted">{pet.breed} · {pet.species} · {pet.sex} · {pet.ageYears} años</p>
          <div className="d-flex gap-2 mb-3 flex-wrap">
            <span className="badge bg-primary">{pet.size}</span>
            {pet.vaccinated && <span className="badge bg-success">Vacunado</span>}
            {pet.sterilized && <span className="badge bg-info text-dark">Esterilizado</span>}
            {pet.isDemo && <span className="badge bg-warning text-dark">Demo</span>}
          </div>
          <p><i className="bi bi-geo-alt me-1" /> {pet.commune}, {pet.region}</p>
          <hr />
          <h2 className="h5">Historia</h2>
          <p>{pet.description}</p>
          <h2 className="h5">Salud</h2>
          <p>{pet.healthStatus}</p>
          <h2 className="h5">Requisitos</h2>
          <p>{pet.adoptionRequirements}</p>
          {owner && (
            <>
              <h2 className="h5">Responsable</h2>
              <p>{owner.firstName} {owner.lastName} · {owner.commune}</p>
            </>
          )}
          <div className="d-flex flex-wrap gap-2 mt-4">
            <button type="button" className="btn btn-primary" onClick={() => user ? setShowModal(true) : showToast('Inicia sesión para adoptar', 'warning')}>
              Quiero adoptar
            </button>
            <button type="button" className={`btn btn-outline-danger ${isFavorite ? 'active' : ''}`} onClick={toggle}>
              <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`} /> Guardar
            </button>
          </div>
          <div className="mt-3">
            <ShareButtons title={`Adopta a ${pet.name}`} url={pageUrl} />
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex={-1} role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title h5">Solicitud de adopción — {pet.name}</h2>
                <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleAdopt}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Información personal</label>
                    <textarea className="form-control" rows={2} required value={form.personalInfo} onChange={(e) => setForm({ ...form, personalInfo: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Experiencia con mascotas</label>
                    <textarea className="form-control" rows={2} required value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Vivienda</label>
                    <textarea className="form-control" rows={2} required value={form.housing} onChange={(e) => setForm({ ...form, housing: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Motivo de adopción</label>
                    <textarea className="form-control" rows={2} required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Tiempo disponible</label>
                    <input className="form-control" required value={form.availableTime} onChange={(e) => setForm({ ...form, availableTime: e.target.value })} />
                  </div>
                  <div className="mb-0">
                    <label className="form-label">Información adicional</label>
                    <textarea className="form-control" rows={2} value={form.additionalInfo} onChange={(e) => setForm({ ...form, additionalInfo: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Enviando...' : 'Enviar solicitud'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="modal-backdrop show" onClick={() => setShowModal(false)} />
        </div>
      )}
    </div>
  );
}
