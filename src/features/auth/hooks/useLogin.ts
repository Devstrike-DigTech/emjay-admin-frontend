import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { LoginCredentials } from '../types/auth.types';
import { useAuthStore } from '@/shared/store/auth.store';
import { Token } from '@/shared/types';

export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => 
      authApi.login(credentials),
    
    onSuccess: (data) => {
      console.log('Login successful:', data);
      const token: Token = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
      }
      login(data.user, token);
      navigate('/');
    },
  });
}