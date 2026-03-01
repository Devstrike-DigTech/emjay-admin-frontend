import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products.api';

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}