import { apiClient } from '@/shared/lib/api-client';

export interface StoreAccountData {
  storeName: string;
  storeDescription: string | null;
  logoUrl: string | null;
}

export interface ContactInfoData {
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
}

export interface WebsiteInfoData {
  dateStarted: string | null;
  lastMaintenance: string | null;
  developerCompany: string | null;
}

export const settingsApi = {
  getStoreAccount: () => apiClient.get<StoreAccountData>('/settings/store'),
  updateStoreAccount: (data: Partial<StoreAccountData>) =>
    apiClient.put<StoreAccountData>('/settings/store', data),

  getContactInfo: () => apiClient.get<ContactInfoData>('/settings/contact'),
  updateContactInfo: (data: Partial<ContactInfoData>) =>
    apiClient.put<ContactInfoData>('/settings/contact', data),

  getWebsiteInfo: () => apiClient.get<WebsiteInfoData>('/settings/website'),
  updateWebsiteInfo: (data: Partial<WebsiteInfoData>) =>
    apiClient.put<WebsiteInfoData>('/settings/website', data),
};
