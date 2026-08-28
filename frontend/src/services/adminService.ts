import type { Campaign, Pet, Report, User } from '../types';
import { apiClient, delay, USE_MOCK } from './apiClient';
import { getMockStore, saveMockStore } from './mock/mockStore';

export const adminService = {
  async getDashboardStats() {
    if (USE_MOCK) {
      await delay();
      const store = getMockStore();
      return {
        totalUsers: store.users.length,
        activeUsers: store.users.filter((u) => u.emailVerified).length,
        totalPets: store.pets.length,
        adoptedPets: store.pets.filter((p) => p.status === 'adoptado').length,
        activeCampaigns: store.campaigns.filter((c) => c.status === 'activa').length,
        totalRaised: store.campaigns.reduce((s, c) => s + c.raisedAmount, 0),
        pendingReports: store.reports.filter((r) => r.status === 'reportado' || r.status === 'en_revision').length,
        resolvedReports: store.reports.filter((r) => r.status === 'resuelto').length,
        pendingPets: store.pets.filter((p) => p.status === 'pendiente').length,
        pendingCampaigns: store.campaigns.filter((c) => c.status === 'pendiente').length,
      };
    }
    const { data } = await apiClient.get('/admin/stats');
    return data;
  },

  async moderatePet(id: string, approved: boolean): Promise<Pet> {
    if (USE_MOCK) {
      await delay();
      const store = getMockStore();
      const pet = store.pets.find((p) => p.id === id);
      if (!pet) throw new Error('Mascota no encontrada');
      pet.status = approved ? 'disponible' : 'rechazado';
      saveMockStore(store);
      return pet;
    }
    const { data } = await apiClient.patch<Pet>(`/admin/pets/${id}`, { approved });
    return data;
  },

  async moderateCampaign(id: string, approved: boolean): Promise<Campaign> {
    if (USE_MOCK) {
      await delay();
      const store = getMockStore();
      const campaign = store.campaigns.find((c) => c.id === id);
      if (!campaign) throw new Error('Campaña no encontrada');
      campaign.status = approved ? 'activa' : 'rechazada';
      saveMockStore(store);
      return campaign;
    }
    const { data } = await apiClient.patch<Campaign>(`/admin/campaigns/${id}`, { approved });
    return data;
  },

  async suspendUser(id: string): Promise<User> {
    if (USE_MOCK) {
      await delay();
      const store = getMockStore();
      const user = store.users.find((u) => u.id === id);
      if (!user) throw new Error('Usuario no encontrado');
      saveMockStore(store);
      return { ...user, email: `[SUSPENDIDO] ${user.email}` };
    }
    const { data } = await apiClient.patch<User>(`/admin/users/${id}/suspend`);
    return data;
  },

  async getAllPets(): Promise<Pet[]> {
    if (USE_MOCK) return getMockStore().pets;
    const { data } = await apiClient.get<Pet[]>('/admin/pets');
    return data;
  },

  async getAllCampaigns(): Promise<Campaign[]> {
    if (USE_MOCK) return getMockStore().campaigns;
    const { data } = await apiClient.get<Campaign[]>('/admin/campaigns');
    return data;
  },

  async getAllReports(): Promise<Report[]> {
    if (USE_MOCK) return getMockStore().reports;
    const { data } = await apiClient.get<Report[]>('/admin/reports');
    return data;
  },
};
