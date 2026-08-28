import type { ReportType, UserRole } from '../types';

export const APP_NAME = 'AppDoptar Chile';
export const APP_TAGLINE = 'Conecta, ayuda y cambia una vida.';

export const CHILE_REGIONS = [
  'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo',
  'Valparaíso', 'Metropolitana', 'O\'Higgins', 'Maule', 'Ñuble',
  'Biobío', 'Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes',
];

export const ROLE_LABELS: Record<UserRole, string> = {
  USER: 'Usuario',
  RESCUER: 'Rescatista',
  FOUNDATION: 'Fundación',
  MODERATOR: 'Moderador',
  ADMIN: 'Administrador',
};

export const REPORT_TYPE_CONFIG: Record<ReportType, { label: string; color: string; icon: string }> = {
  herido: { label: 'Animal herido', color: '#EF4444', icon: 'bi-heart-pulse' },
  abandonado: { label: 'Animal abandonado', color: '#F59E0B', icon: 'bi-house-x' },
  perdido: { label: 'Animal perdido', color: '#3B82F6', icon: 'bi-search' },
  hambriento: { label: 'Animal hambriento', color: '#FCD34D', icon: 'bi-cup-straw' },
  maltratado: { label: 'Animal maltratado', color: '#8B5CF6', icon: 'bi-exclamation-triangle' },
  atrapado: { label: 'Animal atrapado', color: '#10B981', icon: 'bi-lock' },
  encontrado: { label: 'Animal encontrado', color: '#10B981', icon: 'bi-check-circle' },
  otro: { label: 'Otro', color: '#6B7280', icon: 'bi-question-circle' },
};

export const DEFAULT_MAP_CENTER: [number, number] = [-33.4489, -70.6693];
export const DEFAULT_MAP_ZOOM = 12;

export const DEMO_USERS = {
  admin: { email: 'admin@appdoptar.cl', password: 'Admin123!' },
  user: { email: 'usuario@appdoptar.cl', password: 'Usuario123!' },
  rescuer: { email: 'rescatista@appdoptar.cl', password: 'Rescatista123!' },
  foundation: { email: 'fundacion@appdoptar.cl', password: 'Fundacion123!' },
};
