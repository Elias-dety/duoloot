import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { PlayerProfile } from './auth.service';

type ServiceError = {
  code?: string;
  message?: string;
};

const handleServiceError = (error: ServiceError | null | undefined, fallbackMessage: string) => {
  console.error(error);
  if (!isSupabaseConfigured) return 'Configuração do Supabase ausente.';
  if (error?.message?.includes('JWT')) return 'Sua sessão expirou. Entre novamente.';
  if (error?.message?.includes('authenticated')) return 'Entre na sua conta para continuar.';
  if (error?.code === 'PGRST202') return 'Módulo ainda não configurado no banco.';
  return error?.message || fallbackMessage;
};

export async function getCurrentProfile(): Promise<PlayerProfile> {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Entre na sua conta para continuar.');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw new Error(handleServiceError(error, 'Perfil não encontrado.'));
  return data as PlayerProfile;
}

export async function getProfileById(playerId: string): Promise<PlayerProfile> {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', playerId)
    .single();

  if (error) throw new Error(handleServiceError(error, 'Perfil não encontrado.'));
  return data as PlayerProfile;
}

export async function updateCurrentProfile(payload: Record<string, unknown>): Promise<PlayerProfile> {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Entre na sua conta para continuar.');

  const { data, error } = await supabase
    .from('profiles')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw new Error(handleServiceError(error, 'Erro ao atualizar perfil.'));
  return data as PlayerProfile;
}
