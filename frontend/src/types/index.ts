export type UserRole = 'USER' | 'RESCUER' | 'FOUNDATION' | 'MODERATOR' | 'ADMIN';

export type PetSpecies = 'perro' | 'gato' | 'otro';
export type PetSex = 'macho' | 'hembra';
export type PetSize = 'pequeño' | 'mediano' | 'grande';
export type PetAge = 'cachorro' | 'adulto' | 'senior';
export type PetStatus = 'disponible' | 'en_proceso' | 'adoptado' | 'pendiente' | 'rechazado';

export type AdoptionRequestStatus = 'pendiente' | 'en_revision' | 'aprobada' | 'rechazada' | 'finalizada';

export type CampaignStatus = 'pendiente' | 'activa' | 'finalizada' | 'cancelada' | 'rechazada';
export type CampaignCategory =
  | 'tratamiento'
  | 'operacion'
  | 'medicamentos'
  | 'alimentacion'
  | 'rescate'
  | 'refugio'
  | 'fundacion'
  | 'emergencia';

export type ReportType =
  | 'herido'
  | 'abandonado'
  | 'perdido'
  | 'hambriento'
  | 'maltratado'
  | 'atrapado'
  | 'encontrado'
  | 'otro';

export type ReportUrgency = 'bajo' | 'medio' | 'alto' | 'critico';
export type ReportStatus = 'reportado' | 'en_revision' | 'en_atencion' | 'resuelto' | 'cerrado';

export type FavoriteType = 'pet' | 'campaign' | 'foundation' | 'report';
export type NotificationType =
  | 'adoption_request'
  | 'adoption_approved'
  | 'adoption_rejected'
  | 'campaign_progress'
  | 'campaign_ended'
  | 'report_nearby'
  | 'report_reviewed'
  | 'report_resolved'
  | 'general';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  region: string;
  commune: string;
  avatar?: string;
  role: UserRole;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  foundationId?: string;
}

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  sex: PetSex;
  age: PetAge;
  ageYears: number;
  size: PetSize;
  color: string;
  description: string;
  healthStatus: string;
  vaccinated: boolean;
  sterilized: boolean;
  region: string;
  commune: string;
  images: string[];
  contactInfo: string;
  adoptionRequirements: string;
  status: PetStatus;
  ownerId: string;
  foundationId?: string;
  createdAt: string;
  isDemo?: boolean;
}

export interface AdoptionRequest {
  id: string;
  petId: string;
  userId: string;
  personalInfo: string;
  experience: string;
  housing: string;
  reason: string;
  availableTime: string;
  additionalInfo: string;
  status: AdoptionRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdoptionPreference {
  id: string;
  userId: string;
  housingType: 'casa' | 'departamento';
  hasYard: boolean;
  hasOtherPets: boolean;
  hasChildren: boolean;
  experience: 'ninguna' | 'poca' | 'moderada' | 'amplia';
  availableTime: 'poco' | 'moderado' | 'mucho';
  speciesPreference: PetSpecies[];
  sizePreference: PetSize[];
  agePreference: PetAge[];
}

export interface Campaign {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  petId?: string;
  foundationId?: string;
  userId: string;
  category: CampaignCategory;
  goalAmount: number;
  raisedAmount: number;
  donorCount: number;
  deadline: string;
  story: string;
  evidence: string[];
  vetInfo: string;
  additionalInfo: string;
  status: CampaignStatus;
  createdAt: string;
  updates: CampaignUpdate[];
  isDemo?: boolean;
}

export interface CampaignUpdate {
  id: string;
  campaignId: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Donation {
  id: string;
  campaignId: string;
  userId?: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  anonymous: boolean;
  message: string;
  createdAt: string;
}

export interface Report {
  id: string;
  type: ReportType;
  description: string;
  images: string[];
  latitude: number;
  longitude: number;
  address: string;
  commune: string;
  region: string;
  urgency: ReportUrgency;
  status: ReportStatus;
  reporterId: string;
  helpersCount: number;
  helperIds: string[];
  createdAt: string;
  isDemo?: boolean;
}

export interface Foundation {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  region: string;
  commune: string;
  website?: string;
  socialMedia: { facebook?: string; instagram?: string; twitter?: string };
  userId: string;
  verified: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  itemType: FavoriteType;
  itemId: string;
  createdAt: string;
}

export interface PlatformStats {
  petsAvailable: number;
  petsAdopted: number;
  activeCampaigns: number;
  totalRaised: number;
  reportsResolved: number;
  foundationsRegistered: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  requires2FA?: boolean;
  tempToken?: string;
}

export interface MatchResult {
  pet: Pet;
  compatibility: number;
  reasons: string[];
}
