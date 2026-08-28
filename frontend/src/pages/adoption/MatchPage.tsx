import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { findCompatiblePets } from '../../features/adoption/matchService';
import { adoptionService } from '../../services/adoptionService';
import { petService } from '../../services/petService';
import type { AdoptionPreference, MatchResult } from '../../types';

const defaultPrefs: Omit<AdoptionPreference, 'id' | 'userId'> = {
  housingType: 'casa',
  hasYard: false,
  hasOtherPets: false,
  hasChildren: false,
  experience: 'moderada',
  availableTime: 'moderado',
  speciesPreference: ['perro'],
  sizePreference: ['mediano'],
  agePreference: ['adulto'],
};

export default function MatchPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (user) {
      adoptionService.getPreferences(user.id).then((p) => {
        if (p) setPrefs(p);
      });
    }
  }, [user]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const pets = await petService.getAll();
      const matchResults = findCompatiblePets(pets, { ...prefs, id: '', userId: user?.id || '' });
      setResults(matchResults.slice(0, 10));
      setSearched(true);
      if (user) {
        await adoptionService.savePreferences({ ...prefs, userId: user.id });
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleArray = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

  return (
    <div className="container py-4">
      <Breadcrumbs items={[{ label: 'Adopciones', to: '/adopciones' }, { label: 'Match' }]} />
      <h1 className="h2 mb-4">Match de adopción</h1>
      <p className="text-muted mb-4">Indica tus preferencias y encontraremos mascotas compatibles contigo.</p>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4">
            <div className="mb-3">
              <label className="form-label">Tipo de vivienda</label>
              <select className="form-select" value={prefs.housingType} onChange={(e) => setPrefs({ ...prefs, housingType: e.target.value as 'casa' | 'departamento' })}>
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
              </select>
            </div>
            <div className="form-check mb-2">
              <input type="checkbox" className="form-check-input" id="yard" checked={prefs.hasYard} onChange={(e) => setPrefs({ ...prefs, hasYard: e.target.checked })} />
              <label className="form-check-label" htmlFor="yard">Tiene patio</label>
            </div>
            <div className="form-check mb-2">
              <input type="checkbox" className="form-check-input" id="otherPets" checked={prefs.hasOtherPets} onChange={(e) => setPrefs({ ...prefs, hasOtherPets: e.target.checked })} />
              <label className="form-check-label" htmlFor="otherPets">Tiene otras mascotas</label>
            </div>
            <div className="form-check mb-3">
              <input type="checkbox" className="form-check-input" id="children" checked={prefs.hasChildren} onChange={(e) => setPrefs({ ...prefs, hasChildren: e.target.checked })} />
              <label className="form-check-label" htmlFor="children">Tiene niños</label>
            </div>
            <div className="mb-3">
              <label className="form-label">Experiencia</label>
              <select className="form-select" value={prefs.experience} onChange={(e) => setPrefs({ ...prefs, experience: e.target.value as AdoptionPreference['experience'] })}>
                <option value="ninguna">Ninguna</option>
                <option value="poca">Poca</option>
                <option value="moderada">Moderada</option>
                <option value="amplia">Amplia</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Tiempo disponible</label>
              <select className="form-select" value={prefs.availableTime} onChange={(e) => setPrefs({ ...prefs, availableTime: e.target.value as AdoptionPreference['availableTime'] })}>
                <option value="poco">Poco</option>
                <option value="moderado">Moderado</option>
                <option value="mucho">Mucho</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Especies preferidas</label>
              {(['perro', 'gato', 'otro'] as const).map((s) => (
                <div key={s} className="form-check">
                  <input type="checkbox" className="form-check-input" id={`sp-${s}`} checked={prefs.speciesPreference.includes(s)} onChange={() => setPrefs({ ...prefs, speciesPreference: toggleArray(prefs.speciesPreference, s) })} />
                  <label className="form-check-label" htmlFor={`sp-${s}`}>{s}</label>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-primary w-100" onClick={handleSearch} disabled={loading}>
              {loading ? 'Calculando...' : 'Buscar compatibles'}
            </button>
          </div>
        </div>
        <div className="col-lg-8">
          {loading && <LoadingSpinner />}
          {searched && !loading && results.length === 0 && (
            <div className="alert alert-info">No encontramos mascotas compatibles. Intenta ajustar tus preferencias.</div>
          )}
          {results.map(({ pet, compatibility, reasons }) => (
            <div key={pet.id} className="card border-0 shadow-sm mb-3">
              <div className="row g-0">
                <div className="col-md-4">
                  <img src={pet.images[0]} alt={pet.name} className="img-fluid rounded-start h-100 object-fit-cover" />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <h3 className="h5">{pet.name}</h3>
                      <span className="badge bg-success fs-6">{compatibility}% compatible</span>
                    </div>
                    <p className="text-muted small">{pet.breed} · {pet.commune}</p>
                    <ul className="small mb-3">
                      {reasons.map((r) => <li key={r}>{r}</li>)}
                    </ul>
                    <Link to={`/mascotas/${pet.id}`} className="btn btn-sm btn-primary">Ver perfil</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
