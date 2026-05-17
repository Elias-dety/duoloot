import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

/**
 * Interface que representa o Perfil de um Jogador (Duo) no Duo Loot.
 */
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
  game_profile?: any;
  metadata: Record<string, any>;
}

/**
 * Utilitário de tratamento de erros amigáveis para operações de autenticação.
 */
export const handleAuthError = (error: any): string => {
  console.error('Erro de autenticação:', error);
  if (!isSupabaseConfigured) return 'Configuração do Supabase ausente.';
  
  const message = error?.message || '';
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

/**
 * Garante que um registro correspondente em public.profiles exista para o usuário autenticado.
 * Se não existir, cria um perfil básico inicial usando os metadados ou o email do usuário.
 * 
 * @param user Objeto de usuário retornado pelo Supabase Auth.
 */
export async function ensureUserProfile(user: User): Promise<PlayerProfile> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado.');
  }

  try {
    // 1. Verifica se já existe um perfil para este ID
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

    // 2. Se não existir, monta o perfil inicial e insere
    const emailPrefix = user.email ? user.email.split('@')[0] : 'Operador';
    const fallbackName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
    
    const initialProfile = {
      id: user.id,
      name: user.user_metadata?.name || fallbackName,
      nickname: user.user_metadata?.nickname || emailPrefix.toLowerCase(),
      avatar_url: user.user_metadata?.avatar_url || null,
      trust_score: 50,
      status: 'online',
      metadata: {}
    };

    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert(initialProfile)
      .select()
      .single();

    if (insertError) {
      console.error('Erro ao criar perfil inicial:', insertError);
      // Trata erro de RLS ou restrições de chave estrangeira
      if (insertError.code === '42501') {
        throw new Error('Permissão negada (RLS) ao registrar perfil inicial.');
      }
      throw new Error('Falha ao registrar perfil inicial no banco de dados.');
    }

    return newProfile as PlayerProfile;
  } catch (err: any) {
    console.error('Erro em ensureUserProfile:', err);
    throw new Error(err.message || 'Erro tático ao garantir registro de perfil.');
  }
}
