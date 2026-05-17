import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { PlayerProfile, ensureUserProfile, handleAuthError } from '@/services/auth.service';

/**
 * Interface que representa o contexto de autenticação do Duo Loot.
 */
export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: PlayerProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, metadata: { name: string; nickname: string }) => Promise<{ success: boolean; sessionCreated: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Recarrega o perfil do usuário logado diretamente da tabela de profiles no banco de dados.
   */
  const refreshProfile = useCallback(async () => {
    if (!isSupabaseConfigured || !user) {
      setProfile(null);
      return;
    }

    try {
      const currentProfile = await ensureUserProfile(user);
      setProfile(currentProfile);
    } catch (err) {
      console.error('Falha ao sincronizar perfil do usuário logado:', err);
    }
  }, [user]);

  // Sincroniza o perfil sempre que o usuário mudar
  useEffect(() => {
    if (user) {
      refreshProfile();
    } else {
      setProfile(null);
    }
  }, [user, refreshProfile]);

  /**
   * Inicialização e monitoramento do estado de autenticação real com Supabase Auth.
   */
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // 1. Busca sessão inicial se disponível localmente (cookie/localStorage)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    }).catch(err => {
      console.error('Erro ao recuperar sessão inicial:', err);
      setIsLoading(false);
    });

    // 2. Registra listener para monitorar mudanças de estado da sessão
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log(`Evento de Auth detectado: ${event}`);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Se houve login ou alteração tática, força atualização do perfil imediatamente
        if (currentSession?.user) {
          try {
            const currentProfile = await ensureUserProfile(currentSession.user);
            setProfile(currentProfile);
          } catch (err) {
            console.error('Erro ao atualizar perfil após mudança de auth:', err);
          }
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Loga o usuário no sistema.
   */
  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Configuração do Supabase ausente.' };
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

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
    } catch (err: any) {
      return { success: false, error: handleAuthError(err) };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cria uma nova conta de usuário.
   */
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
            nickname: metadata.nickname
          }
        }
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
        sessionCreated: hasSession
      };
    } catch (err: any) {
      return { success: false, sessionCreated: false, error: handleAuthError(err) };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Desloga o usuário do sistema.
   */
  const signOut = async () => {
    if (!isSupabaseConfigured) return;

    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (err) {
      console.error('Erro ao realizar logout:', err);
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
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
