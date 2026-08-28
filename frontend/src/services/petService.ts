import type { Pet, PetSpecies, PetSex, PetSize, PetAge, PetStatus } from '../types';
import { apiClient, delay, USE_MOCK } from './apiClient';
import { generateId, getMockStore, saveMockStore } from './mock/mockStore';

export interface PetFilters {
  search?: string;
  species?: PetSpecies | '';
  sex?: PetSex | '';
  age?: PetAge | '';
  size?: PetSize | '';
  region?: string;
  commune?: string;
  sterilized?: boolean;
  vaccinated?: boolean;
  status?: PetStatus;
  ownerId?: string;
  sort?: 'newest' | 'oldest' | 'name';
}

export const petService = {
  async getAll(filters: PetFilters = {}): Promise<Pet[]> {
    if (USE_MOCK) {
      await delay(200);
      let pets = [...getMockStore().pets];
      if (filters.status) pets = pets.filter((p) => p.status === filters.status);
      else pets = pets.filter((p) => p.status === 'disponible' || p.status === 'en_proceso');
      if (filters.species) pets = pets.filter((p) => p.species === filters.species);
      if (filters.sex) pets = pets.filter((p) => p.sex === filters.sex);
      if (filters.age) pets = pets.filter((p) => p.age === filters.age);
      if (filters.size) pets = pets.filter((p) => p.size === filters.size);
      if (filters.region) pets = pets.filter((p) => p.region === filters.region);
      if (filters.commune) pets = pets.filter((p) => p.commune === filters.commune);
      if (filters.sterilized !== undefined) pets = pets.filter((p) => p.sterilized === filters.sterilized);
      if (filters.vaccinated !== undefined) pets = pets.filter((p) => p.vaccinated === filters.vaccinated);
      if (filters.ownerId) pets = pets.filter((p) => p.ownerId === filters.ownerId);
      if (filters.search) {
        const q = filters.search.toLowerCase();
        pets = pets.filter(
          (p) => p.name.toLowerCase().includes(q)
            || p.breed.toLowerCase().includes(q)
            || p.commune.toLowerCase().includes(q),
        );
      }
      if (filters.sort === 'name') pets.sort((a, b) => a.name.localeCompare(b.name));
      else if (filters.sort === 'oldest') pets.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      else pets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return pets;
    }
    const { data } = await apiClient.get<Pet[]>('/pets', { params: filters });
    return data;
  },

  async getById(id: string): Promise<Pet | null> {
    if (USE_MOCK) {
      await delay(100);
      return getMockStore().pets.find((p) => p.id === id) || null;
    }
    const { data } = await apiClient.get<Pet>(`/pets/${id}`);
    return data;
  },

  async create(pet: Omit<Pet, 'id' | 'createdAt' | 'status'>): Promise<Pet> {
    if (USE_MOCK) {
      await delay();
      const store = getMockStore();
      const newPet: Pet = {
        ...pet,
        id: generateId('pet'),
        status: 'pendiente',
        createdAt: new Date().toISOString(),
      };
      store.pets.push(newPet);
      saveMockStore(store);
      return newPet;
    }
    const { data } = await apiClient.post<Pet>('/pets', pet);
    return data;
  },

  async update(id: string, updates: Partial<Pet>): Promise<Pet> {
    if (USE_MOCK) {
      await delay();
      const store = getMockStore();
      const idx = store.pets.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error('Mascota no encontrada');
      store.pets[idx] = { ...store.pets[idx], ...updates };
      saveMockStore(store);
      return store.pets[idx];
    }
    const { data } = await apiClient.patch<Pet>(`/pets/${id}`, updates);
    return data;
  },

  async delete(id: string): Promise<void> {
    if (USE_MOCK) {
      await delay();
      const store = getMockStore();
      store.pets = store.pets.filter((p) => p.id !== id);
      saveMockStore(store);
      return;
    }
    await apiClient.delete(`/pets/${id}`);
  },
};
