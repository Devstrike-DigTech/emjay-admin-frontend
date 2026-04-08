import { apiClient } from '@/shared/lib/api-client';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../types/category.types';

/** Raw shape returned by GET /categories and /categories/root */
interface BackendCategoryResponse {
  id: string;
  name: string;
  description?: string;
  parentId?: string;       // backend calls it parentId; frontend uses parentCategoryId
  parentName?: string;
  isActive: boolean;
  isRootCategory?: boolean;
  hasSubcategories?: boolean;
  productCount: number;
}

interface CategoryListResponse {
  categories: BackendCategoryResponse[];
  totalCount: number;
}

/** Raw shape returned by GET /categories/tree */
interface BackendCategoryTreeResponse {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  productCount: number;
  subcategories?: BackendCategoryTreeResponse[]; // backend key name
}

function mapCategory(r: BackendCategoryResponse): Category {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    parentCategoryId: r.parentId,   // parentId → parentCategoryId
    parentName: r.parentName,
    isActive: r.isActive,
    productCount: r.productCount,
    createdAt: '',
  };
}

function mapTreeNode(r: BackendCategoryTreeResponse): Category {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    isActive: r.isActive,
    productCount: r.productCount,
    createdAt: '',
    children: (r.subcategories ?? []).map(mapTreeNode), // subcategories → children
  };
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const raw = await apiClient.get<CategoryListResponse | BackendCategoryResponse[]>('/categories');
    // Handle both wrapped and unwrapped responses
    if (Array.isArray(raw)) {
      return (raw as BackendCategoryResponse[]).map(mapCategory);
    }
    const wrapped = raw as unknown as CategoryListResponse;
    return (wrapped.categories ?? []).map(mapCategory);
  },

  getRoot: async (): Promise<Category[]> => {
    const raw = await apiClient.get<CategoryListResponse | BackendCategoryResponse[]>('/categories/root');
    if (Array.isArray(raw)) {
      return (raw as BackendCategoryResponse[]).map(mapCategory);
    }
    const wrapped = raw as unknown as CategoryListResponse;
    return (wrapped.categories ?? []).map(mapCategory);
  },

  getTree: async (): Promise<Category[]> => {
    const raw = await apiClient.get<BackendCategoryTreeResponse[]>('/categories/tree');
    // Tree endpoint returns a direct array
    if (Array.isArray(raw)) {
      return (raw as BackendCategoryTreeResponse[]).map(mapTreeNode);
    }
    return [];
  },

  getById: (id: string) =>
    apiClient.get<Category>(`/categories/${id}`),

  getSubcategories: async (id: string): Promise<Category[]> => {
    const raw = await apiClient.get<CategoryListResponse | BackendCategoryResponse[]>(
      `/categories/${id}/subcategories`
    );
    if (Array.isArray(raw)) {
      return (raw as BackendCategoryResponse[]).map(mapCategory);
    }
    const wrapped = raw as unknown as CategoryListResponse;
    return (wrapped.categories ?? []).map(mapCategory);
  },

  create: (data: CreateCategoryDto) => {
    // Backend expects parentId; frontend DTO uses parentCategoryId
    const { parentCategoryId, ...rest } = data;
    return apiClient.post<Category>('/categories', { ...rest, parentId: parentCategoryId });
  },

  update: (id: string, data: UpdateCategoryDto) => {
    const { parentCategoryId, ...rest } = data;
    return apiClient.put<Category>(`/categories/${id}`, { ...rest, parentId: parentCategoryId });
  },

  delete: (id: string) =>
    apiClient.delete(`/categories/${id}`),
};
