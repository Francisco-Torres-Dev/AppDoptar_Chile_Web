import type { PlatformStats, User } from '../types';
import { apiClient, delay, USE_MOCK } from './apiClient';
import { getMockStore, saveMockStore, stripUser } from './mock/mockStore';

export const userService = {
  async getById(id: string): Promise<User | null> {
    if (USE_MOCK) {
      await delay(100);
      const store = getMockStore();
      const user = store.users.find((u) => u.id === id);
      return user ? stripUser(user) : null;
    }
    const { data } = await apiClient.get<User>(`/users/${id}`);
    return data;
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    if (USE_MOCK) {
      await delay();
      const store = getMockStore();
      const idx = store.users.findIndex((u) => u.id === id);
      if (idx === -1) throw new Error('Usuario no encontrado');
      store.users[idx] = { ...store.users[idx], ...updates };
      saveMockStore(store);
      return stripUser(store.users[idx]);
    }
    const { data } = await apiClient.patch<User>(`/users/${id}`, updates);
    return data;
  },

  async getAll(): Promise<User[]> {
    if (USE_MOCK) {
      await delay();
      return getMockStore().users.map(stripUser);
    }
    const { data } = await apiClient.get<User[]>('/users');
    return data;
  },

  async getStats(): Promise<PlatformStats> {
    if (USE_MOCK) {
      await delay(100);
      const store = getMockStore();
      return {
        petsAvailable: store.pets.filter((p) => p.status === 'disponible').length,
        petsAdopted: store.pets.filter((p) => p.status === 'adoptado').length,
        activeCampaigns: store.campaigns.filter((c) => c.status === 'activa').length,
        totalRaised: store.campaigns.reduce((sum, c) => sum + c.raisedAmount, 0),
        reportsResolved: store.reports.filter((r) => r.status === 'resuelto').length,
        foundationsRegistered: store.foundations.length,
      };
    }
    const { data } = await apiClient.get<PlatformStats>('/stats');
    return data;
  },
};
