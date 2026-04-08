import { apiClient } from '@/shared/lib/api-client';
import { Promotion, CreatePromotionDto } from '../types/ads-promo.types';

export const promotionsApi = {
  getAll: () =>
    apiClient.get<Promotion[]>('/promotions'),

  getActive: () =>
    apiClient.get<Promotion[]>('/promotions/active'),

  create: (data: CreatePromotionDto) =>
    apiClient.post<Promotion>('/promotions', data),
};
