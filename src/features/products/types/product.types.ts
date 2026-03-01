// Product feature types

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  categoryId: string;
  subcategory?: string; // Added for subcategory filtering
  brandId?: string;
  basePrice: number;
  costPrice?: number;
  stockQuantity: number;
  reorderLevel: number;
  unit: string;
  weight?: number;
  weightUnit?: string;
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
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
  unit: string;
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