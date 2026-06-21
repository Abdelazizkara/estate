import { api } from './api';
import type { Property, SearchFilters } from '../types';

export async function fetchProperties(filters?: SearchFilters): Promise<Property[]> {
  const { data } = await api.get<Property[]>('/api/properties', { params: filters });
  return data;
}

export async function fetchPropertyById(id: string): Promise<Property> {
  const { data } = await api.get<Property>(`/api/properties/${id}`);
  return data;
}

export async function fetchMyProperties(): Promise<Property[]> {
  const { data } = await api.get<Property[]>('/api/my/properties');
  return data;
}

export async function createProperty(payload: Omit<Property, 'id' | 'agent' | 'createdAt' | 'updatedAt'>): Promise<Property> {
  const { data } = await api.post<Property>('/api/my/properties', payload);
  return data;
}

export async function updatePropertyById(
  id: string,
  patch: Partial<Omit<Property, 'id' | 'agent' | 'createdAt' | 'updatedAt'>>
): Promise<Property> {
  const { data } = await api.patch<Property>(`/api/my/properties/${id}`, patch);
  return data;
}

export async function deletePropertyById(id: string): Promise<void> {
  await api.delete(`/api/my/properties/${id}`);
}
