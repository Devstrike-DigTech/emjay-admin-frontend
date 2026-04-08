import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bundlesApi } from '../api/bundles.api';
import { CreateBundleDto, UpdateBundleDto } from '../types/ads-promo.types';

export function useBundles() {
  return useQuery({
    queryKey: ['bundles'],
    queryFn: () => bundlesApi.getAll(),
  });
}

export function useActiveBundles() {
  return useQuery({
    queryKey: ['bundles', 'active'],
    queryFn: () => bundlesApi.getActive(),
  });
}

export function useBundle(id: string) {
  return useQuery({
    queryKey: ['bundles', id],
    queryFn: () => bundlesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateBundle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBundleDto) => bundlesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
    },
  });
}

export function useUpdateBundle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBundleDto }) =>
      bundlesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      queryClient.invalidateQueries({ queryKey: ['bundles', variables.id] });
    },
  });
}
