import type { AdoptionPreference, AdoptionRequest } from '../types';
import { apiClient, delay, USE_MOCK } from './apiClient';
import { generateId, getMockStore, saveMockStore } from './mock/mockStore';
import { notificationService } from './notificationService';

export const adoptionService = {
  async createRequest(data: Omit<AdoptionRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<AdoptionRequest> {
    if (USE_MOCK) {
      await delay();
      const store = getMockStore();
      const pet = store.pets.find((p) => p.id === data.petId);
      const request: AdoptionRequest = {
        ...data,
        id: generateId('adoption'),
        status: 'pendiente',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.adoptionRequests.push(request);
      if (pet) {
        await notificationService.create({
          userId: pet.ownerId,
          type: 'adoption_request',
          title: 'Nueva solicitud de adopción',
          message: `Alguien quiere adoptar a ${pet.name}.`,
          link: '/mis-publicaciones',
        });
      }
      saveMockStore(store);
      return request;
    }
    const { data: res } = await apiClient.post<AdoptionRequest>('/adoptions', data);
    return res;
  },

  async getRequests(filters: { userId?: string; petId?: string; ownerId?: string } = {}): Promise<AdoptionRequest[]> {
    if (USE_MOCK) {
      await delay();
      const store = getMockStore();
      let requests = [...store.adoptionRequests];
      if (filters.userId) requests = requests.filter((r) => r.userId === filters.userId);
      if (filters.petId) requests = requests.filter((r) => r.petId === filters.petId);
      if (filters.ownerId) {
        const ownerPetIds = store.pets.filter((p) => p.ownerId === filters.ownerId).map((p) => p.id);
        requests = requests.filter((r) => ownerPetIds.includes(r.petId));
      }
      return requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    const { data } = await apiClient.get<AdoptionRequest[]>('/adoptions', { params: filters });
    return data;
  },

  async updateRequestStatus(id: string, status: AdoptionRequest['status']): Promise<AdoptionRequest> {
    if (USE_MOCK) {
      await delay();
      const store = getMockStore();
      const idx = store.adoptionRequests.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error('Solicitud no encontrada');
      store.adoptionRequests[idx].status = status;
      store.adoptionRequests[idx].updatedAt = new Date().toISOString();
      const request = store.adoptionRequests[idx];
      const pet = store.pets.find((p) => p.id === request.petId);
      if (status === 'aprobada' && pet) {
        pet.status = 'en_proceso';
        await notificationService.create({
          userId: request.userId,
          type: 'adoption_approved',
          title: '¡Solicitud aprobada!',
          message: `Tu solicitud para adoptar a ${pet.name} fue aprobada.`,
          link: `/mascotas/${pet.id}`,
        });
      } else if (status === 'rechazada') {
        await notificationService.create({
          userId: request.userId,
          type: 'adoption_rejected',
          title: 'Solicitud rechazada',
          message: 'Tu solicitud de adopción no fue aprobada.',
          link: '/adopciones',
        });
      }
      saveMockStore(store);
      return request;
    }
    const { data } = await apiClient.patch<AdoptionRequest>(`/adoptions/${id}`, { status });
    return data;
  },

  async savePreferences(prefs: Omit<AdoptionPreference, 'id'>): Promise<AdoptionPreference> {
    if (USE_MOCK) {
      await delay();
      const store = getMockStore();
      const existing = store.adoptionPreferences.findIndex((p) => p.userId === prefs.userId);
      const preference: AdoptionPreference = {
        ...prefs,
        id: existing >= 0 ? store.adoptionPreferences[existing].id : generateId('pref'),
      };
      if (existing >= 0) store.adoptionPreferences[existing] = preference;
      else store.adoptionPreferences.push(preference);
      saveMockStore(store);
      return preference;
    }
    const { data } = await apiClient.post<AdoptionPreference>('/adoptions/preferences', prefs);
    return data;
  },

  async getPreferences(userId: string): Promise<AdoptionPreference | null> {
    if (USE_MOCK) {
      await delay(100);
      return getMockStore().adoptionPreferences.find((p) => p.userId === userId) || null;
    }
    const { data } = await apiClient.get<AdoptionPreference>(`/adoptions/preferences/${userId}`);
    return data;
  },
};
