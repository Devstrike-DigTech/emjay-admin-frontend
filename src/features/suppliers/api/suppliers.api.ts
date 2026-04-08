import { apiClient } from '@/shared/lib/api-client';
import { Supplier, SupplierListResponse, CreateSupplierDto, UpdateSupplierDto } from '../types/supplier.types';

// Backend uses 'paymentTerms'; frontend type uses 'notes'. Map at API boundary.
function mapSupplier(s: Record<string, unknown>): Supplier {
  return {
    id: s.id as string,
    name: s.name as string,
    contactPerson: (s.contactPerson as string | null) ?? null,
    email: (s.email as string | null) ?? null,
    phone: (s.phone as string | null) ?? null,
    address: (s.address as string | null) ?? null,
    notes: (s.paymentTerms as string | null) ?? (s.notes as string | null) ?? null,
    isActive: s.isActive as boolean,
    productCount: (s.productCount as number) ?? 0,
    createdAt: (s.createdAt as string) ?? '',
  };
}

function toBackendDto(data: CreateSupplierDto | UpdateSupplierDto) {
  const { notes, ...rest } = data as Record<string, unknown>;
  return { ...rest, paymentTerms: notes };
}

export const suppliersApi = {
  getAll: (): Promise<SupplierListResponse> =>
    apiClient
      .get<Record<string, unknown>>('/suppliers')
      .then((res) => {
        const raw = res as unknown as { suppliers: Record<string, unknown>[]; totalCount: number };
        return {
          suppliers: (raw.suppliers ?? []).map(mapSupplier),
          totalCount: raw.totalCount ?? 0,
        };
      }),

  getActive: (): Promise<SupplierListResponse> =>
    apiClient
      .get<Record<string, unknown>>('/suppliers/active')
      .then((res) => {
        const raw = res as unknown as { suppliers: Record<string, unknown>[]; totalCount: number };
        return {
          suppliers: (raw.suppliers ?? []).map(mapSupplier),
          totalCount: raw.totalCount ?? 0,
        };
      }),

  getById: (id: string): Promise<Supplier> =>
    apiClient
      .get<Record<string, unknown>>(`/suppliers/${id}`)
      .then((s) => mapSupplier(s as Record<string, unknown>)),

  create: (data: CreateSupplierDto): Promise<Supplier> =>
    apiClient
      .post<Record<string, unknown>>('/suppliers', toBackendDto(data))
      .then((s) => mapSupplier(s as Record<string, unknown>)),

  update: (id: string, data: UpdateSupplierDto): Promise<Supplier> =>
    apiClient
      .put<Record<string, unknown>>(`/suppliers/${id}`, toBackendDto(data))
      .then((s) => mapSupplier(s as Record<string, unknown>)),

  delete: (id: string) =>
    apiClient.delete(`/suppliers/${id}`),
};
