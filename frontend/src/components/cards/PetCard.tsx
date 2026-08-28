import { Link } from 'react-router-dom';
import type { Pet } from '../../types';

interface PetCardProps {
  pet: Pet;
}

export function PetCard({ pet }: PetCardProps) {
  return (
    <article className="card pet-card h-100 border-0 shadow-sm">
      <div className="pet-card-img-wrapper">
        <img 
          src={pet.images[0]} 
          alt={pet.name} 
          className="card-img-top pet-card-img" 
          loading="lazy" 
        />
        {pet.isDemo && <span className="badge demo-badge">Demo</span>}
        <span className="badge species-badge">
          {pet.species === 'perro' ? '🐕 Perro' : pet.species === 'gato' ? '🐱 Gato' : '🐾 Otro'}
        </span>
      </div>
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h3 className="h5 card-title mb-0 fw-bold">{pet.name}</h3>
          <span className="badge bg-light text-dark border">
            {pet.ageYears} {pet.ageYears === 1 ? 'año' : 'años'}
          </span>
        </div>
        
        <p className="text-muted small mb-2">
          <strong>{pet.breed}</strong> · {pet.sex === 'macho' ? '♂' : '♀'} {pet.sex}
        </p>
        
        <p className="small mb-3 text-muted">
          <i className="bi bi-geo-alt-fill me-1" style={{ color: 'var(--primary)' }} />
          {pet.commune}, {pet.region}
        </p>
        
        <div className="d-flex gap-1 mb-3 flex-wrap">
          {pet.vaccinated && (
            <span className="badge bg-light text-dark border">
              <i className="bi bi-shield-check-fill me-1" style={{ color: 'var(--success)' }}></i>
              Vacunado
            </span>
          )}
          {pet.sterilized && (
            <span className="badge bg-light text-dark border">
              <i className="bi bi-check-circle-fill me-1" style={{ color: 'var(--success)' }}></i>
              Esterilizado
            </span>
          )}
        </div>
        
        <div className="mt-auto d-flex gap-2">
          <Link 
            to={`/mascotas/${pet.id}`} 
            className="btn btn-primary btn-sm flex-grow-1"
          >
            Ver perfil
          </Link>
          <Link 
            to={`/mascotas/${pet.id}?action=interest`} 
            className="btn btn-outline-primary btn-sm"
          >
            Me interesa
          </Link>
        </div>
      </div>
    </article>
  );
}
