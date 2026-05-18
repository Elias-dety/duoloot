import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { ensureUserProfile, handleAuthError, PlayerProfile } from '@/services/auth.service';
import { AuthContext } from './AuthContext';
import logger from '@/lib/logger';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<import('@supabase/supabase-js').User | null>(null);
  const [session, setSession] = useState<import('@supabase/supabase-js').Session | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);

  const refreshProfile = useCallback(async () => {
    if (!isSupabaseConfigured || !user) {
      setProfile(null);
      return;
    }

    try {
      const currentProfile = await ensureUserProfile(user);
      setProfile(currentProfile);
    } catch (error) {
      console.error('Falha ao sincronizar perfil do usuário logado:', error);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    void refreshProfile();
  }, [refreshProfile, user]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    void supabase.auth
      .getSession()
      .then(({ data: { session: currentSession } }) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      })
      .catch((error: unknown) => {
        console.error('Erro ao recuperar sessão inicial:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      logger.debug(`Evento de Auth detectado: ${event}`);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        try {
          const currentProfile = await ensureUserProfile(currentSession.user);
          setProfile(currentProfile);
        } catch (error) {
          console.error('Erro ao atualizar perfil após mudança de auth:', error);
        }
      } else {
        setProfile(null);
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Configuração do Supabase ausente.' };
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        return { success: false, error: handleAuthError(error) };
      }

      setSession(data.session);
      setUser(data.user);

      if (data.user) {
        const userProfile = await ensureUserProfile(data.user);
        setProfile(userProfile);
      }

      return { success: true };
    } catch (error: unknown) {
      return { success: false, error: handleAuthError(error) };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata: { name: string; nickname: string }) => {
    if (!isSupabaseConfigured) {
      return { success: false, sessionCreated: false, error: 'Configuração do Supabase ausente.' };
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: metadata.name,
            nickname: metadata.nickname,
          },
        },
      });

      if (error) {
        return { success: false, sessionCreated: false, error: handleAuthError(error) };
      }

      const hasSession = !!data.session;

      if (data.user && hasSession) {
        setSession(data.session);
        setUser(data.user);
        const userProfile = await ensureUserProfile(data.user);
        setProfile(userProfile);
      }

      return {
        success: true,
        sessionCreated: hasSession,
      };
    } catch (error: unknown) {
      return { success: false, sessionCreated: false, error: handleAuthError(error) };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) return;

    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Erro ao realizar logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
