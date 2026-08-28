import type { Foundation } from '../types';
import { apiClient, delay, USE_MOCK } from './apiClient';
import { getMockStore } from './mock/mockStore';

export const foundationService = {
  async getAll(): Promise<Foundation[]> {
    if (USE_MOCK) {
      await delay(200);
      return getMockStore().foundations;
    }
    const { data } = await apiClient.get<Foundation[]>('/foundations');
    return data;
  },

  async getById(id: string): Promise<Foundation | null> {
    if (USE_MOCK) {
      await delay(100);
      return getMockStore().foundations.find((f) => f.id === id || f.slug === id) || null;
    }
    const { data } = await apiClient.get<Foundation>(`/foundations/${id}`);
    return data;
  },
};
