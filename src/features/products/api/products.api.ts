import { apiClient } from '@/shared/lib/api-client';
import { Product, CreateProductDto, UpdateProductDto, ProductFilters } from '../types/product.types';

export const productsApi = {
  getAll: (filters?: ProductFilters) =>
    apiClient.get<Product[]>('/inventory/products', { params: filters }),

  getById: (id: string) =>
    apiClient.get<Product>(`/inventory/products/${id}`),

  create: (data: CreateProductDto) =>
    apiClient.post<Product>('/inventory/products', data),

  update: (id: string, data: UpdateProductDto) =>
    apiClient.put<Product>(`/inventory/products/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/inventory/products/${id}`),

  updateStock: (id: string, quantity: number) =>
    apiClient.patch(`/inventory/products/${id}/stock`, { quantity }),
};