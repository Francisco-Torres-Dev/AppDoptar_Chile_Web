import type { Campaign, CampaignStatus } from '../types';
import { slugify } from '../utils/formatters';
import { apiClient, delay, USE_MOCK } from './apiClient';
import { generateId, getMockStore, saveMockStore } from './mock/mockStore';

export const campaignService = {
  async getAll(filters: { status?: CampaignStatus; userId?: string; foundationId?: string } = {}): Promise<Campaign[]> {
    if (USE_MOCK) {
      await delay(200);
      let campaigns = [...getMockStore().campaigns];
      if (filters.status) campaigns = campaigns.filter((c) => c.status === filters.status);
      if (filters.userId) campaigns = campaigns.filter((c) => c.userId === filters.userId);
      if (filters.foundationId) campaigns = campaigns.filter((c) => c.foundationId === filters.foundationId);
      return campaigns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    const { data } = await apiClient.get<Campaign[]>('/campaigns', { params: filters });
    return data;
  },

  async getById(id: string): Promise<Campaign | null> {
    if (USE_MOCK) {
      await delay(100);
      return getMockStore().campaigns.find((c) => c.id === id || c.slug === id) || null;
    }
    const { data } = await apiClient.get<Campaign>(`/campaigns/${id}`);
    return data;
  },

  async create(campaign: Omit<Campaign, 'id' | 'slug' | 'raisedAmount' | 'donorCount' | 'status' | 'createdAt' | 'updates'>): Promise<Campaign> {
    if (USE_MOCK) {
      await delay();
      const store = getMockStore();
      const newCampaign: Campaign = {
        ...campaign,
        id: generateId('campaign'),
        slug: slugify(campaign.title),
        raisedAmount: 0,
        donorCount: 0,
        status: 'pendiente',
        createdAt: new Date().toISOString(),
        updates: [],
      };
      store.campaigns.push(newCampaign);
      saveMockStore(store);
      return newCampaign;
    }
    const { data } = await apiClient.post<Campaign>('/campaigns', campaign);
    return data;
  },

  async update(id: string, updates: Partial<Campaign>): Promise<Campaign> {
    if (USE_MOCK) {
      await delay();
      const store = getMockStore();
      const idx = store.campaigns.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error('Campaña no encontrada');
      store.campaigns[idx] = { ...store.campaigns[idx], ...updates };
      saveMockStore(store);
      return store.campaigns[idx];
    }
    const { data } = await apiClient.patch<Campaign>(`/campaigns/${id}`, updates);
    return data;
  },

  async addUpdate(campaignId: string, title: string, content: string): Promise<void> {
    if (USE_MOCK) {
      await delay();
      const store = getMockStore();
      const campaign = store.campaigns.find((c) => c.id === campaignId);
      if (!campaign) throw new Error('Campaña no encontrada');
      campaign.updates.unshift({
        id: generateId('update'),
        campaignId,
        title,
        content,
        createdAt: new Date().toISOString(),
      });
      saveMockStore(store);
      return;
    }
    await apiClient.post(`/campaigns/${campaignId}/updates`, { title, content });
  },
};
