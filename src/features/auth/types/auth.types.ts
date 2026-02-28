export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
}

export interface AuthResponse {
  token: string;
  user: User;
}