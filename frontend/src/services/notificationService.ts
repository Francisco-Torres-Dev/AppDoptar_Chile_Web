import type { Favorite, FavoriteType, Notification, NotificationType } from '../types';
import { apiClient, delay, USE_MOCK } from './apiClient';
import { generateId, getMockStore, saveMockStore } from './mock/mockStore';

export const notificationService = {
  async getByUser(userId: string): Promise<Notification[]> {
    if (USE_MOCK) {
      await delay(100);
      return getMockStore()
        .notifications
        .filter((n) => n.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    const { data } = await apiClient.get<Notification[]>(`/notifications/${userId}`);
    return data;
  },

  async create(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
  }): Promise<Notification> {
    if (USE_MOCK) {
      const store = getMockStore();
      const notification: Notification = {
        id: generateId('notif'),
        ...data,
        read: false,
        createdAt: new Date().toISOString(),
      };
      store.notifications.push(notification);
      saveMockStore(store);
      return notification;
    }
    const { data: res } = await apiClient.post<Notification>('/notifications', data);
    return res;
  },

  async markAsRead(id: string): Promise<void> {
    if (USE_MOCK) {
      const store = getMockStore();
      const notif = store.notifications.find((n) => n.id === id);
      if (notif) notif.read = true;
      saveMockStore(store);
      return;
    }
    await apiClient.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(userId: string): Promise<void> {
    if (USE_MOCK) {
      const store = getMockStore();
      store.notifications.filter((n) => n.userId === userId).forEach((n) => { n.read = true; });
      saveMockStore(store);
      return;
    }
    await apiClient.patch(`/notifications/${userId}/read-all`);
  },
};

export const favoriteService = {
  async getByUser(userId: string): Promise<Favorite[]> {
    if (USE_MOCK) {
      await delay(100);
      return getMockStore().favorites.filter((f) => f.userId === userId);
    }
    const { data } = await apiClient.get<Favorite[]>(`/favorites/${userId}`);
    return data;
  },

  async toggle(userId: string, itemType: FavoriteType, itemId: string): Promise<boolean> {
    if (USE_MOCK) {
      await delay(100);
      const store = getMockStore();
      const idx = store.favorites.findIndex(
        (f) => f.userId === userId && f.itemType === itemType && f.itemId === itemId,
      );
      if (idx >= 0) {
        store.favorites.splice(idx, 1);
        saveMockStore(store);
        return false;
      }
      store.favorites.push({
        id: generateId('fav'),
        userId,
        itemType,
        itemId,
        createdAt: new Date().toISOString(),
      });
      saveMockStore(store);
      return true;
    }
    const { data } = await apiClient.post<{ added: boolean }>('/favorites/toggle', { itemType, itemId });
    return data.added;
  },

  async isFavorite(userId: string, itemType: FavoriteType, itemId: string): Promise<boolean> {
    if (USE_MOCK) {
      return getMockStore().favorites.some(
        (f) => f.userId === userId && f.itemType === itemType && f.itemId === itemId,
      );
    }
    const { data } = await apiClient.get<{ favorite: boolean }>(`/favorites/check`, {
      params: { itemType, itemId },
    });
    return data.favorite;
  },
};
