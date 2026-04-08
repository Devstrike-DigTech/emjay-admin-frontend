import { apiClient } from '@/shared/lib/api-client';
import { Bundle, CreateBundleDto, UpdateBundleDto } from '../types/ads-promo.types';

export const bundlesApi = {
  getAll: () =>
    apiClient.get<Bundle[]>('/bundles'),

  getActive: () =>
    apiClient.get<Bundle[]>('/bundles/active'),

  getById: (id: string) =>
    apiClient.get<Bundle>(`/bundles/${id}`),

  create: (data: CreateBundleDto) =>
    apiClient.post<Bundle>('/bundles', data),

  update: (id: string, data: UpdateBundleDto) =>
    apiClient.put<Bundle>(`/bundles/${id}`, data),
};
