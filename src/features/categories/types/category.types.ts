export interface Category {
  id: string;
  name: string;
  description?: string;
  parentCategoryId?: string;
  parentName?: string;
  isActive: boolean;
  productCount: number;
  children?: Category[];
  createdAt: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  parentCategoryId?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  parentCategoryId?: string;
}
