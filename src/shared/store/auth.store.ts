import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Token, User } from '@/shared/types';

interface AuthState {
  user: User | null;
  token: Token | null;
  isAuthenticated: boolean;
  login: (user: User, token: Token) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        localStorage.setItem('access_token', token.accessToken);
        localStorage.setItem('refresh_token', token.refreshToken);
        localStorage.setItem('expires_in', token.expiresIn.toString());
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('expires_in');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (updatedUser) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
