// Product feature types

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  categoryId: string;
  subcategory?: string; // client-side subcategory label (optional)
  brandId?: string;     // maps from backend supplierId
  basePrice: number;    // maps from backend retailPrice
  costPrice?: number;
  stockQuantity: number;
  reorderLevel: number; // maps from backend minStockThreshold
  weight?: number;
  weightUnit?: string;
  isActive: boolean;    // derived from backend status === 'ACTIVE'
  imageUrl?: string;    // first primary image url
  createdAt: string;
  updatedAt: string;
}

export interface ProductImageInfo {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

/** Raw shape returned by GET /products (backend ProductResponse) */
export interface BackendProductResponse {
  id: string;
  sku: string;
  name: string;
  description?: string;
  categoryId: string;
  categoryName?: string;
  supplierId?: string;
  retailPrice: number;
  wholesalePrice?: number;
  costPrice: number;
  stockQuantity: number;
  minStockThreshold: number;
  brand?: string;
  status: string; // 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED'
  isLowStock: boolean;
  isOutOfStock: boolean;
  profitMargin: number;
  totalValue: number;
  createdAt?: string;
  images: ProductImageInfo[];
}

/** Paginated wrapper from GET /products */
export interface ProductPageResponse {
  content: BackendProductResponse[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  sku: string;
  categoryId: string;
  brandId?: string;
  basePrice: number;
  costPrice?: number;
  stockQuantity: number;
  reorderLevel: number;
  weight?: number;
  weightUnit?: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  isActive?: boolean;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  brandId?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string;
}