import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { ensureUserProfile, handleAuthError, PlayerProfile } from '@/services/auth.service';
import { AuthContext } from './AuthContext';
import logger from '@/lib/logger';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);

  const syncProfile = useCallback(async (currentUser: User | null) => {
    if (!isSupabaseConfigured || !currentUser) {
      setProfile(null);
      return;
    }

    try {
      const currentProfile = await ensureUserProfile(currentUser);
      setProfile(currentProfile);
    } catch (error) {
      console.error('Falha ao sincronizar perfil do usuario logado:', error);
      setProfile(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    await syncProfile(user);
  }, [syncProfile, user]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    let isMounted = true;

    void supabase.auth
      .getSession()
      .then(({ data: { session: currentSession } }) => {
        if (!isMounted) return;

        const currentUser = currentSession?.user ?? null;
        setSession(currentSession);
        setUser(currentUser);
        setIsLoading(false);

        window.setTimeout(() => {
          void syncProfile(currentUser);
        }, 0);
      })
      .catch((error: unknown) => {
        console.error('Erro ao recuperar sessao inicial:', error);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      logger.debug(`Evento de Auth detectado: ${event}`);

      const currentUser = currentSession?.user ?? null;
      setSession(currentSession);
      setUser(currentUser);

      if (!currentUser) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      window.setTimeout(() => {
        void syncProfile(currentUser);
      }, 0);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [syncProfile]);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Configuracao do Supabase ausente.' };
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        return { success: false, error: handleAuthError(error) };
      }

      setSession(data.session);
      setUser(data.user);
      await syncProfile(data.user);

      return { success: true };
    } catch (error: unknown) {
      return { success: false, error: handleAuthError(error) };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata: { name: string; nickname: string }) => {
    if (!isSupabaseConfigured) {
      return { success: false, sessionCreated: false, error: 'Configuracao do Supabase ausente.' };
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
        await syncProfile(data.user);
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
