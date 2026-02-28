import { apiClient } from '@/shared/lib/api-client';
import { LoginCredentials, AuthResponse } from '../types/auth.types';

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<AuthResponse>('/auth/login', credentials),

  logout: () =>
    apiClient.post('/auth/logout'),

  refreshToken: () =>
    apiClient.post<AuthResponse>('/auth/refresh'),
};