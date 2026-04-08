import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  settingsApi,
  StoreAccountData,
  ContactInfoData,
  WebsiteInfoData,
} from '../api/settings.api';

// ── Store Account ──────────────────────────────────────────────────────────────

export function useStoreAccount() {
  return useQuery({
    queryKey: ['settings', 'store'],
    queryFn: () => settingsApi.getStoreAccount(),
  });
}

export function useUpdateStoreAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<StoreAccountData>) =>
      settingsApi.updateStoreAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'store'] });
    },
  });
}

// ── Contact Info ───────────────────────────────────────────────────────────────

export function useContactInfo() {
  return useQuery({
    queryKey: ['settings', 'contact'],
    queryFn: () => settingsApi.getContactInfo(),
  });
}

export function useUpdateContactInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ContactInfoData>) =>
      settingsApi.updateContactInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'contact'] });
    },
  });
}

// ── Website Info ───────────────────────────────────────────────────────────────

export function useWebsiteInfo() {
  return useQuery({
    queryKey: ['settings', 'website'],
    queryFn: () => settingsApi.getWebsiteInfo(),
  });
}

export function useUpdateWebsiteInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<WebsiteInfoData>) =>
      settingsApi.updateWebsiteInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'website'] });
    },
  });
}
