import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products.api';
import { ProductFilters } from '../types/product.types';

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getAll(filters),
  });
}