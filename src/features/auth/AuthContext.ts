import { createContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import type { PlayerProfile } from '@/services/auth.service';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: PlayerProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    email: string,
    password: string,
    metadata: { name: string; nickname: string }
  ) => Promise<{ success: boolean; sessionCreated: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
