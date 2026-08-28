import type { Donation } from '../types';
import { calculateProgress } from '../utils/formatters';
import { apiClient, delay, USE_MOCK } from './apiClient';
import { generateId, getMockStore, saveMockStore } from './mock/mockStore';
import { notificationService } from './notificationService';
import { paymentService } from './paymentService';

export interface DonationInput {
  campaignId: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  anonymous: boolean;
  message: string;
  userId?: string;
}

export const donationService = {
  async donate(input: DonationInput): Promise<Donation> {
    const paymentResult = await paymentService.processPayment({
      amount: input.amount,
      currency: 'CLP',
      description: `Donación campaña ${input.campaignId}`,
      metadata: { campaignId: input.campaignId },
    });

    if (!paymentResult.success) {
      throw new Error(paymentResult.error || 'Error al procesar la donación');
    }

    if (USE_MOCK) {
      await delay(500);
      const store = getMockStore();
      const donation: Donation = {
        id: generateId('donation'),
        ...input,
        createdAt: new Date().toISOString(),
      };
      store.donations.push(donation);
      const campaign = store.campaigns.find((c) => c.id === input.campaignId);
      if (campaign) {
        campaign.raisedAmount += input.amount;
        campaign.donorCount += 1;
        const progress = calculateProgress(campaign.raisedAmount, campaign.goalAmount);
        if (progress >= 50 && progress < 55) {
          await notificationService.create({
            userId: campaign.userId,
            type: 'campaign_progress',
            title: '¡Tu campaña alcanzó el 50%!',
            message: `La campaña "${campaign.title}" superó la mitad de su meta.`,
            link: `/crowdfunding/${campaign.id}`,
          });
        }
      }
      saveMockStore(store);
      return donation;
    }
    const { data } = await apiClient.post<Donation>('/donations', input);
    return data;
  },

  async getAll(filters: { userId?: string; campaignId?: string } = {}): Promise<Donation[]> {
    if (USE_MOCK) {
      await delay();
      let donations = [...getMockStore().donations];
      if (filters.userId) donations = donations.filter((d) => d.userId === filters.userId);
      if (filters.campaignId) donations = donations.filter((d) => d.campaignId === filters.campaignId);
      return donations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    const { data } = await apiClient.get<Donation[]>('/donations', { params: filters });
    return data;
  },
};
