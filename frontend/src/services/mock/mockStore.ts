import type {
  AdoptionPreference,
  AdoptionRequest,
  Campaign,
  Donation,
  Favorite,
  Foundation,
  Notification,
  Pet,
  Report,
  User,
} from '../types';

export interface MockStore {
  users: (User & { passwordHash: string })[];
  pets: Pet[];
  adoptionRequests: AdoptionRequest[];
  adoptionPreferences: AdoptionPreference[];
  campaigns: Campaign[];
  donations: Donation[];
  reports: Report[];
  foundations: Foundation[];
  notifications: Notification[];
  favorites: Favorite[];
  twoFactorCodes: Record<string, { codeHash: string; expiresAt: number }>;
  passwordResetTokens: Record<string, { userId: string; expiresAt: number }>;
  emailVerificationTokens: Record<string, { userId: string; expiresAt: number }>;
}

const STORAGE_KEY = 'appdoptar_mock_store';

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return `h${Math.abs(hash)}`;
}

export function hashPassword(password: string): string {
  return simpleHash(`pwd_${password}_salt`);
}

export function hashOTP(code: string): string {
  return simpleHash(`otp_${code}`);
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function getMockStore(): MockStore {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as MockStore;
    } catch {
      // fall through to seed
    }
  }
  const seed = getSeedData();
  saveMockStore(seed);
  return seed;
}

export function saveMockStore(store: MockStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function resetMockStore(): void {
  localStorage.removeItem(STORAGE_KEY);
}

function getSeedData(): MockStore {
  const adminId = 'user_admin';
  const userId = 'user_demo';
  const rescuerId = 'user_rescuer';
  const foundationUserId = 'user_foundation';
  const foundationId = 'foundation_1';

  const users: MockStore['users'] = [
    {
      id: adminId,
      email: 'admin@appdoptar.cl',
      passwordHash: hashPassword('Admin123!'),
      firstName: 'Admin',
      lastName: 'AppDoptar',
      phone: '+56912345678',
      region: 'Metropolitana',
      commune: 'Santiago',
      role: 'ADMIN',
      emailVerified: true,
      twoFactorEnabled: false,
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: userId,
      email: 'usuario@appdoptar.cl',
      passwordHash: hashPassword('Usuario123!'),
      firstName: 'Francisco',
      lastName: 'Díaz',
      phone: '+56987654321',
      region: 'Metropolitana',
      commune: 'Providencia',
      role: 'USER',
      emailVerified: true,
      twoFactorEnabled: false,
      createdAt: '2024-02-01T10:00:00Z',
    },
    {
      id: rescuerId,
      email: 'rescatista@appdoptar.cl',
      passwordHash: hashPassword('Rescatista123!'),
      firstName: 'María',
      lastName: 'González',
      phone: '+56911223344',
      region: 'Valparaíso',
      commune: 'Viña del Mar',
      role: 'RESCUER',
      emailVerified: true,
      twoFactorEnabled: false,
      createdAt: '2024-02-10T10:00:00Z',
    },
    {
      id: foundationUserId,
      email: 'fundacion@appdoptar.cl',
      passwordHash: hashPassword('Fundacion123!'),
      firstName: 'Refugio',
      lastName: 'Esperanza',
      phone: '+56955667788',
      region: 'Metropolitana',
      commune: 'La Florida',
      role: 'FOUNDATION',
      emailVerified: true,
      twoFactorEnabled: false,
      foundationId,
      createdAt: '2024-01-20T10:00:00Z',
    },
  ];

  const foundations: Foundation[] = [
    {
      id: foundationId,
      name: 'Refugio Esperanza',
      slug: 'refugio-esperanza',
      description: 'Fundación dedicada al rescate y rehabilitación de animales abandonados en la Región Metropolitana.',
      logo: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop',
      region: 'Metropolitana',
      commune: 'La Florida',
      website: 'https://refugioesperanza.cl',
      socialMedia: { facebook: 'refugioesperanza', instagram: 'refugio_esperanza' },
      userId: foundationUserId,
      verified: true,
      createdAt: '2024-01-20T10:00:00Z',
    },
    {
      id: 'foundation_2',
      name: 'Patitas Felices',
      slug: 'patitas-felices',
      description: 'Organización sin fines de lucro que promueve la adopción responsable y el cuidado animal.',
      logo: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop',
      region: 'Biobío',
      commune: 'Concepción',
      website: 'https://patitasfelices.cl',
      socialMedia: { instagram: 'patitas_felices' },
      userId: rescuerId,
      verified: true,
      createdAt: '2024-03-01T10:00:00Z',
    },
  ];

  const pets: Pet[] = [
    {
      id: 'pet_max',
      name: 'Max',
      species: 'perro',
      breed: 'Labrador mix',
      sex: 'macho',
      age: 'adulto',
      ageYears: 3,
      size: 'grande',
      color: 'Dorado',
      description: 'Max es un perro cariñoso y enérgico que busca una familia activa. Le encanta jugar y dar paseos largos.',
      healthStatus: 'Saludable',
      vaccinated: true,
      sterilized: true,
      region: 'Metropolitana',
      commune: 'Providencia',
      images: [
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop',
      ],
      contactInfo: 'Contactar vía plataforma',
      adoptionRequirements: 'Casa con patio, experiencia con perros grandes.',
      status: 'disponible',
      ownerId: rescuerId,
      createdAt: '2024-06-01T10:00:00Z',
      isDemo: true,
    },
    {
      id: 'pet_luna',
      name: 'Luna',
      species: 'gato',
      breed: 'Doméstico',
      sex: 'hembra',
      age: 'adulto',
      ageYears: 2,
      size: 'pequeño',
      color: 'Negro',
      description: 'Luna es una gata tranquila y cariñosa. Ideal para departamento.',
      healthStatus: 'Saludable, requiere tratamiento dental',
      vaccinated: true,
      sterilized: true,
      region: 'Metropolitana',
      commune: 'Ñuñoa',
      images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop'],
      contactInfo: 'Contactar vía plataforma',
      adoptionRequirements: 'Ambiente tranquilo, sin perros.',
      status: 'disponible',
      ownerId: foundationUserId,
      foundationId,
      createdAt: '2024-06-05T10:00:00Z',
      isDemo: true,
    },
    {
      id: 'pet_toby',
      name: 'Toby',
      species: 'perro',
      breed: 'Beagle',
      sex: 'macho',
      age: 'cachorro',
      ageYears: 1,
      size: 'mediano',
      color: 'Tricolor',
      description: 'Toby es un cachorro juguetón y curioso. Necesita paciencia y entrenamiento.',
      healthStatus: 'Saludable',
      vaccinated: true,
      sterilized: false,
      region: 'Valparaíso',
      commune: 'Viña del Mar',
      images: ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=400&fit=crop'],
      contactInfo: 'Contactar vía plataforma',
      adoptionRequirements: 'Tiempo para entrenamiento, familia activa.',
      status: 'disponible',
      ownerId: rescuerId,
      createdAt: '2024-06-10T10:00:00Z',
      isDemo: true,
    },
    {
      id: 'pet_nala',
      name: 'Nala',
      species: 'gato',
      breed: 'Siamés',
      sex: 'hembra',
      age: 'senior',
      ageYears: 10,
      size: 'pequeño',
      color: 'Crema',
      description: 'Nala es una gata senior muy dulce que busca un hogar tranquilo para sus últimos años.',
      healthStatus: 'Control veterinario al día',
      vaccinated: true,
      sterilized: true,
      region: 'Metropolitana',
      commune: 'Maipú',
      images: ['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=400&fit=crop'],
      contactInfo: 'Contactar vía plataforma',
      adoptionRequirements: 'Hogar sin niños pequeños.',
      status: 'disponible',
      ownerId: userId,
      createdAt: '2024-06-12T10:00:00Z',
      isDemo: true,
    },
    {
      id: 'pet_rocky',
      name: 'Rocky',
      species: 'perro',
      breed: 'Pastor Alemán',
      sex: 'macho',
      age: 'adulto',
      ageYears: 5,
      size: 'grande',
      color: 'Negro y marrón',
      description: 'Rocky es un perro leal y protector. Ideal como compañero para una persona activa.',
      healthStatus: 'Saludable',
      vaccinated: true,
      sterilized: true,
      region: 'Biobío',
      commune: 'Concepción',
      images: ['https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&h=400&fit=crop'],
      contactInfo: 'Contactar vía plataforma',
      adoptionRequirements: 'Experiencia con perros grandes.',
      status: 'disponible',
      ownerId: rescuerId,
      createdAt: '2024-06-15T10:00:00Z',
      isDemo: true,
    },
    {
      id: 'pet_mila',
      name: 'Mila',
      species: 'perro',
      breed: 'Mestiza',
      sex: 'hembra',
      age: 'adulto',
      ageYears: 4,
      size: 'mediano',
      color: 'Blanco',
      description: 'Mila fue rescatada de la calle. Es muy sociable y se lleva bien con niños.',
      healthStatus: 'Recuperándose de desnutrición',
      vaccinated: true,
      sterilized: true,
      region: 'Metropolitana',
      commune: 'La Florida',
      images: ['https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=600&h=400&fit=crop'],
      contactInfo: 'Contactar vía plataforma',
      adoptionRequirements: 'Familia comprometida con seguimiento.',
      status: 'disponible',
      ownerId: foundationUserId,
      foundationId,
      createdAt: '2024-06-18T10:00:00Z',
      isDemo: true,
    },
  ];

  const campaigns: Campaign[] = [
    {
      id: 'campaign_1',
      title: 'Operación de Max',
      slug: 'operacion-max',
      description: 'Max necesita una operación en la pata trasera tras un accidente.',
      image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=600&h=400&fit=crop',
      petId: 'pet_max',
      foundationId,
      userId: foundationUserId,
      category: 'operacion',
      goalAmount: 500000,
      raisedAmount: 325000,
      donorCount: 42,
      deadline: '2025-12-31T23:59:59Z',
      story: 'Max fue atropellado y necesita cirugía urgente para recuperar la movilidad.',
      evidence: [],
      vetInfo: 'Clínica Veterinaria San Francisco - Dr. Pérez',
      additionalInfo: 'Cualquier aporte ayuda.',
      status: 'activa',
      createdAt: '2024-07-01T10:00:00Z',
      updates: [
        {
          id: 'update_1',
          campaignId: 'campaign_1',
          title: 'Primera evaluación completada',
          content: 'Max fue evaluado y la operación está programada.',
          createdAt: '2024-07-05T10:00:00Z',
        },
      ],
      isDemo: true,
    },
    {
      id: 'campaign_2',
      title: 'Alimentación Refugio Esperanza',
      slug: 'alimentacion-refugio-esperanza',
      description: 'Ayúdanos a alimentar a más de 50 animales rescatados.',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop',
      foundationId,
      userId: foundationUserId,
      category: 'alimentacion',
      goalAmount: 800000,
      raisedAmount: 480000,
      donorCount: 67,
      deadline: '2025-11-30T23:59:59Z',
      story: 'El refugio necesita alimento para perros y gatos durante el invierno.',
      evidence: [],
      vetInfo: '',
      additionalInfo: '',
      status: 'activa',
      createdAt: '2024-07-10T10:00:00Z',
      updates: [],
      isDemo: true,
    },
    {
      id: 'campaign_3',
      title: 'Tratamiento de Luna',
      slug: 'tratamiento-luna',
      description: 'Luna necesita tratamiento dental y chequeos veterinarios.',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop',
      petId: 'pet_luna',
      userId: foundationUserId,
      category: 'tratamiento',
      goalAmount: 200000,
      raisedAmount: 95000,
      donorCount: 18,
      deadline: '2025-10-15T23:59:59Z',
      story: 'Luna fue rescatada con problemas dentales severos.',
      evidence: [],
      vetInfo: 'Veterinaria Ñuñoa',
      additionalInfo: '',
      status: 'activa',
      createdAt: '2024-07-15T10:00:00Z',
      updates: [],
      isDemo: true,
    },
    {
      id: 'campaign_4',
      title: 'Rescate de animales abandonados',
      slug: 'rescate-animales-abandonados',
      description: 'Campaña para rescatar animales en situación de abandono en Valparaíso.',
      image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=400&fit=crop',
      userId: rescuerId,
      category: 'rescate',
      goalAmount: 600000,
      raisedAmount: 150000,
      donorCount: 23,
      deadline: '2025-09-30T23:59:59Z',
      story: 'Necesitamos recursos para traslado, atención veterinaria y alimentación.',
      evidence: [],
      vetInfo: '',
      additionalInfo: 'Datos de demostración',
      status: 'activa',
      createdAt: '2024-07-20T10:00:00Z',
      updates: [],
      isDemo: true,
    },
  ];

  const reports: Report[] = [
    {
      id: 'report_1',
      type: 'herido',
      description: '[DEMO] Perro herido encontrado cerca del parque. Necesita atención veterinaria urgente.',
      images: ['https://images.unsplash.com/photo-1583511655857-d19b40a7ced6?w=400&h=300&fit=crop'],
      latitude: -33.4372,
      longitude: -70.6506,
      address: 'Parque Bustamante, Providencia',
      commune: 'Providencia',
      region: 'Metropolitana',
      urgency: 'alto',
      status: 'reportado',
      reporterId: userId,
      helpersCount: 3,
      helperIds: [rescuerId, foundationUserId, adminId],
      createdAt: '2024-08-01T14:30:00Z',
      isDemo: true,
    },
    {
      id: 'report_2',
      type: 'perdido',
      description: '[DEMO] Gato perdido, color negro con collar rojo. Responde al nombre de Michi.',
      images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop'],
      latitude: -33.4569,
      longitude: -70.6483,
      address: 'Sector Ñuñoa centro',
      commune: 'Ñuñoa',
      region: 'Metropolitana',
      urgency: 'medio',
      status: 'en_atencion',
      reporterId: userId,
      helpersCount: 2,
      helperIds: [userId],
      createdAt: '2024-08-02T09:15:00Z',
      isDemo: true,
    },
    {
      id: 'report_3',
      type: 'abandonado',
      description: '[DEMO] Cachorros abandonados en caja cerca de supermercado.',
      images: ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop'],
      latitude: -33.5117,
      longitude: -70.7525,
      address: 'Av. Vicuña Mackenna, La Florida',
      commune: 'La Florida',
      region: 'Metropolitana',
      urgency: 'critico',
      status: 'en_revision',
      reporterId: rescuerId,
      helpersCount: 5,
      helperIds: [foundationUserId, userId, rescuerId],
      createdAt: '2024-08-03T18:00:00Z',
      isDemo: true,
    },
    {
      id: 'report_4',
      type: 'hambriento',
      description: '[DEMO] Perro callejero visiblemente desnutrido en sector industrial.',
      images: ['https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=400&h=300&fit=crop'],
      latitude: -33.0472,
      longitude: -71.6127,
      address: 'Sector industrial, Viña del Mar',
      commune: 'Viña del Mar',
      region: 'Valparaíso',
      urgency: 'medio',
      status: 'reportado',
      reporterId: rescuerId,
      helpersCount: 1,
      helperIds: [],
      createdAt: '2024-08-04T11:45:00Z',
      isDemo: true,
    },
  ];

  return {
    users,
    pets,
    adoptionRequests: [],
    adoptionPreferences: [],
    campaigns,
    donations: [],
    reports,
    foundations,
    notifications: [],
    favorites: [],
    twoFactorCodes: {},
    passwordResetTokens: {},
    emailVerificationTokens: {},
  };
}

export function stripUser(user: User & { passwordHash?: string }): User {
  const { passwordHash: _, ...rest } = user;
  return rest;
}
