import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { LoginCredentials } from '../types/auth.types';
import { useAuthStore } from '@/shared/store/auth.store';

export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => 
      authApi.login(credentials),
    
    onSuccess: (data) => {
      login(data.user, data.token);
      navigate('/');
    },
  });
}