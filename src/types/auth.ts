import { User } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'staff';
  is_active: boolean;
  last_login: string | null;
}