import type { AdoptionPreference, MatchResult, Pet } from '../types';

export function calculateCompatibility(pet: Pet, prefs: AdoptionPreference): MatchResult {
  let score = 50;
  const reasons: string[] = [];

  if (prefs.speciesPreference.includes(pet.species)) {
    score += 15;
    reasons.push(`Coincide con tu preferencia de ${pet.species}`);
  } else if (prefs.speciesPreference.length > 0) {
    score -= 10;
  }

  if (prefs.sizePreference.includes(pet.size)) {
    score += 12;
    reasons.push(`Tamaño ${pet.size} compatible con tu preferencia`);
  }

  if (prefs.agePreference.includes(pet.age)) {
    score += 12;
    reasons.push(`Edad ${pet.age} acorde a lo que buscas`);
  }

  if (prefs.hasOtherPets && pet.species === 'perro') {
    score += 5;
    reasons.push('Experiencia con otras mascotas es un plus');
  }

  if (prefs.hasChildren && pet.age === 'adulto') {
    score += 8;
    reasons.push('Mascota adulta, generalmente más tranquila con niños');
  }

  if (prefs.hasYard && pet.size !== 'pequeño') {
    score += 10;
    reasons.push('Tienes patio, ideal para mascotas activas');
  } else if (!prefs.hasYard && pet.size === 'grande') {
    score -= 8;
    reasons.push('Mascota grande puede necesitar más espacio');
  }

  if (prefs.housingType === 'departamento' && pet.size === 'grande') {
    score -= 5;
  } else if (prefs.housingType === 'casa') {
    score += 5;
    reasons.push('Tu vivienda ofrece buen espacio');
  }

  const experienceMap = { ninguna: 0, poca: 1, moderada: 2, amplia: 3 };
  const timeMap = { poco: 0, moderado: 1, mucho: 2 };

  if (experienceMap[prefs.experience] >= 2) {
    score += 5;
    reasons.push('Tu experiencia te prepara para esta adopción');
  }

  if (timeMap[prefs.availableTime] >= 1 && pet.age === 'cachorro') {
    score += 8;
    reasons.push('Tienes tiempo disponible para un cachorro');
  }

  if (pet.sterilized) {
    score += 3;
    reasons.push('Mascota esterilizada');
  }

  if (pet.vaccinated) {
    score += 3;
    reasons.push('Mascota con vacunas al día');
  }

  const compatibility = Math.max(0, Math.min(100, score));

  if (reasons.length === 0) {
    reasons.push('Perfil general compatible con tus preferencias');
  }

  return { pet, compatibility, reasons };
}

export function findCompatiblePets(pets: Pet[], prefs: AdoptionPreference): MatchResult[] {
  return pets
    .filter((p) => p.status === 'disponible')
    .map((pet) => calculateCompatibility(pet, prefs))
    .sort((a, b) => b.compatibility - a.compatibility);
}
