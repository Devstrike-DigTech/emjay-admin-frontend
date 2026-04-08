import { apiClient } from '@/shared/lib/api-client';
import { Ad, CreateAdDto, UpdateAdDto } from '../types/ads-promo.types';

export const adsApi = {
  getAll: () =>
    apiClient.get<Ad[]>('/ads'),

  getActive: () =>
    apiClient.get<Ad[]>('/ads/active'),

  getById: (id: string) =>
    apiClient.get<Ad>(`/ads/${id}`),

  create: (data: CreateAdDto) =>
    apiClient.post<Ad>('/ads', data),

  update: (id: string, data: UpdateAdDto) =>
    apiClient.put<Ad>(`/ads/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/ads/${id}`),
};
