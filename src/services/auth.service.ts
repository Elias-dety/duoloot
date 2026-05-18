import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type ServiceError = {
  code?: string;
  message?: string;
};

export type PlayerGameProfile = {
  mainGame?: string;
  main_game?: string;
  riotId?: string;
  nickname?: string;
  currentRank?: string;
  rank?: string;
  mainRole?: string;
  secondaryRole?: string;
  playStyle?: string;
  sessionFocus?: string;
  availability?: string;
  preferredModes?: string[];
  microphone?: boolean;
  region?: string;
  bio?: string;
  [key: string]: unknown;
};

export interface PlayerProfile {
  id: string;
  name: string;
  nickname: string;
  avatar_url: string | null;
  trust_score: number;
  status: 'online' | 'offline' | 'in-game';
  is_premium: boolean;
  created_at: string;
  updated_at: string;
  game_profile?: PlayerGameProfile;
  metadata: Record<string, unknown>;
}

export const handleAuthError = (error: unknown): string => {
  console.error('Erro de autenticação:', error);
  if (!isSupabaseConfigured) return 'Configuração do Supabase ausente.';

  const message = error instanceof Error ? error.message : '';
  if (message.includes('Invalid login credentials')) {
    return 'Credenciais inválidas.';
  }
  if (message.includes('Email already registered') || message.includes('User already exists')) {
    return 'Este email já possui acesso.';
  }
  if (message.includes('Password should be at least 6 characters')) {
    return 'A senha precisa ter pelo menos 6 caracteres.';
  }
  if (message.includes('JWT') || message.includes('session expired')) {
    return 'Sua sessão expirou. Entre novamente.';
  }

  return message || 'Ocorreu um erro no processo de autenticação.';
};

export async function ensureUserProfile(user: User): Promise<PlayerProfile> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado.');
  }

  try {
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (fetchError) {
      console.error('Erro ao buscar perfil existente:', fetchError);
      throw new Error('Erro ao verificar perfil do jogador.');
    }

    if (existingProfile) {
      return existingProfile as PlayerProfile;
    }

    const emailPrefix = user.email ? user.email.split('@')[0] : 'Operador';
    const fallbackName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

    const initialProfile = {
      id: user.id,
      name: user.user_metadata?.name || fallbackName,
      nickname: user.user_metadata?.nickname || emailPrefix.toLowerCase(),
      avatar_url: user.user_metadata?.avatar_url || null,
      trust_score: 50,
      status: 'online' as const,
      metadata: {} as Record<string, unknown>,
    };

    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert(initialProfile)
      .select()
      .single();

    if (insertError) {
      console.error('Erro ao criar perfil inicial:', insertError);
      if ((insertError as ServiceError).code === '42501') {
        throw new Error('Permissão negada (RLS) ao registrar perfil inicial.');
      }
      throw new Error('Falha ao registrar perfil inicial no banco de dados.');
    }

    return newProfile as PlayerProfile;
  } catch (error: unknown) {
    console.error('Erro em ensureUserProfile:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Erro tático ao garantir registro de perfil.',
      { cause: error }
    );
  }
}
