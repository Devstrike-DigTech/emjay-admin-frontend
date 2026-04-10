import { apiClient } from '@/shared/lib/api-client';
import {
  Product,
  BackendProductResponse,
  ProductPageResponse,
  ProductImageInfo,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
} from '../types/product.types';

/** Map backend ProductResponse field names to the frontend Product shape */
function mapProduct(r: BackendProductResponse): Product {
  const primaryImage = r.images?.find((img) => img.isPrimary) ?? r.images?.[0];
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    sku: r.sku,
    categoryId: r.categoryId,
    brandId: r.supplierId,           // backend uses supplierId; frontend calls it brandId
    basePrice: r.retailPrice,        // backend retailPrice → frontend basePrice
    costPrice: r.costPrice,
    stockQuantity: r.stockQuantity,
    reorderLevel: r.minStockThreshold,
    isActive: r.status === 'ACTIVE',
    imageUrl: primaryImage?.imageUrl,
    createdAt: '',
    updatedAt: '',
  };
}

/**
 * Map frontend CreateProductDto field names to backend CreateProductRequest shape.
 * Frontend:  brandId, basePrice, reorderLevel
 * Backend:   supplierId, retailPrice, minStockThreshold
 */
function toBackendCreateRequest(data: CreateProductDto): Record<string, unknown> {
  const { brandId, basePrice, reorderLevel, ...rest } = data;
  return {
    ...rest,
    supplierId: brandId,
    retailPrice: basePrice,
    minStockThreshold: reorderLevel,
  };
}

function toBackendUpdateRequest(data: UpdateProductDto): Record<string, unknown> {
  const { brandId, basePrice, reorderLevel, isActive, ...rest } = data;
  const req: Record<string, unknown> = { ...rest };
  if (brandId !== undefined) req.supplierId = brandId;
  if (basePrice !== undefined) req.retailPrice = basePrice;
  if (reorderLevel !== undefined) req.minStockThreshold = reorderLevel;
  if (isActive !== undefined) req.status = isActive ? 'ACTIVE' : 'INACTIVE';
  return req;
}

export const productsApi = {
  /** Returns a flat Product[] (content extracted from the paginated response) */
  getAll: async (filters?: ProductFilters): Promise<Product[]> => {
    const page = await apiClient.get<ProductPageResponse>('/products', { params: filters });
    const raw = page as unknown as ProductPageResponse;
    // Handle both unwrapped array (if typing was correct) and paginated object
    if (Array.isArray(raw)) {
      return (raw as unknown as BackendProductResponse[]).map(mapProduct);
    }
    return (raw.content ?? []).map(mapProduct);
  },

  getById: async (id: string): Promise<Product> => {
    const raw = await apiClient.get<BackendProductResponse>(`/products/${id}`);
    return mapProduct(raw as unknown as BackendProductResponse);
  },

  /** Returns the full raw backend response — use this on the detail page where all images are needed */
  getByIdFull: async (id: string): Promise<BackendProductResponse> => {
    return apiClient.get<BackendProductResponse>(`/products/${id}`) as unknown as BackendProductResponse;
  },

  create: async (data: CreateProductDto): Promise<Product> => {
    const payload = toBackendCreateRequest(data);
    const raw = await apiClient.post<BackendProductResponse>('/products', payload);
    return mapProduct(raw as unknown as BackendProductResponse);
  },

  update: async (id: string, data: UpdateProductDto): Promise<Product> => {
    const payload = toBackendUpdateRequest(data);
    const raw = await apiClient.put<BackendProductResponse>(`/products/${id}`, payload);
    return mapProduct(raw as unknown as BackendProductResponse);
  },

  delete: (id: string) =>
    apiClient.delete(`/products/${id}`),

  updateStock: (id: string, quantity: number, reason: string = 'ADJUSTMENT') =>
    apiClient.post('/stock-adjustments', {
      productId: id,
      quantityChange: quantity,
      adjustmentType: reason,
    }),

  /** Upload a product image via multipart/form-data (Axios auto-sets the boundary) */
  uploadImage: async (
    productId: string,
    file: File,
    isPrimary = false,
    displayOrder = 0
  ): Promise<ProductImageInfo> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isPrimary', String(isPrimary));
    formData.append('displayOrder', String(displayOrder));
    return apiClient.post<ProductImageInfo>(`/products/${productId}/images`, formData);
  },

  /** Get all images for a product */
  getImages: async (productId: string): Promise<ProductImageInfo[]> => {
    return apiClient.get<ProductImageInfo[]>(`/products/${productId}/images`);
  },

  /** Promote an image to primary */
  setPrimaryImage: async (productId: string, imageId: string): Promise<ProductImageInfo> => {
    return apiClient.patch<ProductImageInfo>(
      `/products/${productId}/images/${imageId}/set-primary`
    );
  },

  /** Delete a product image */
  deleteImage: (productId: string, imageId: string): Promise<void> =>
    apiClient.delete(`/products/${productId}/images/${imageId}`),
};
