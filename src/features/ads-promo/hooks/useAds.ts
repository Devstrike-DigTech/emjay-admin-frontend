import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adsApi } from '../api/ads.api';
import { CreateAdDto, UpdateAdDto } from '../types/ads-promo.types';

export function useAds() {
  return useQuery({
    queryKey: ['ads'],
    queryFn: () => adsApi.getAll(),
  });
}

export function useActiveAds() {
  return useQuery({
    queryKey: ['ads', 'active'],
    queryFn: () => adsApi.getActive(),
  });
}

export function useAd(id: string) {
  return useQuery({
    queryKey: ['ads', id],
    queryFn: () => adsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateAd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdDto) => adsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] });
    },
  });
}

export function useUpdateAd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdDto }) =>
      adsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      queryClient.invalidateQueries({ queryKey: ['ads', variables.id] });
    },
  });
}

export function useDeleteAd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] });
    },
  });
}
