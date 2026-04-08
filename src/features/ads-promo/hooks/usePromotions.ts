import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { promotionsApi } from '../api/promotions.api';
import { CreatePromotionDto } from '../types/ads-promo.types';

export function usePromotions() {
  return useQuery({
    queryKey: ['promotions'],
    queryFn: () => promotionsApi.getAll(),
  });
}

export function useActivePromotions() {
  return useQuery({
    queryKey: ['promotions', 'active'],
    queryFn: () => promotionsApi.getActive(),
  });
}

export function useCreatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePromotionDto) => promotionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
  });
}
