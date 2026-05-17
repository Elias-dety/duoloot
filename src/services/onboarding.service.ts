import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getCurrentProfile } from './profiles.service';
import type { OnboardingData } from '@/features/onboarding/onboarding.schema';

const handleServiceError = (error: any, fallbackMessage: string) => {
  console.error(error);
  if (!isSupabaseConfigured) return 'Configuração do Supabase ausente.';
  if (error?.message?.includes('JWT')) return 'Sua sessão expirou. Entre novamente.';
  if (error?.message?.includes('authenticated')) return 'Entre na sua conta para continuar.';
  return error?.message || fallbackMessage;
};

/**
 * Verifica se o game_profile do usuário contém todos os campos táticos obrigatórios.
 * @param profile Objeto de perfil retornado da tabela profiles
 */
export function isGameProfileComplete(profile: any): boolean {
  if (!profile || !profile.game_profile) return false;
  
  const gp = profile.game_profile;
  const hasRequiredFields = 
    gp.mainGame && 
    gp.nickname && 
    gp.currentRank && 
    gp.mainRole && 
    gp.playStyle && 
    gp.availability &&
    Array.isArray(gp.preferredModes) && 
    gp.preferredModes.length >= 1;

  return !!hasRequiredFields;
}

/**
 * Obtém o perfil de jogo (game_profile) do operador logado atualmente.
 */
export async function getMyGameProfile(): Promise<Partial<OnboardingData> | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const profile = await getCurrentProfile();
    return profile?.game_profile || null;
  } catch (err) {
    console.warn('Erro ao obter perfil gamer:', err);
    return null;
  }
}

/**
 * Atualiza o perfil gamer e o nickname do operador logado no banco de dados.
 * @param payload Dados validados do onboarding
 */
export async function updateMyGameProfile(payload: OnboardingData) {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado no terminal.');

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Entre na sua conta para continuar.');

  try {
    // Buscar perfil atual para manter integridade de campos jsonb antigos
    const existingProfile = await getCurrentProfile();
    const existingGameProfile = existingProfile?.game_profile || {};
    
    // Mesclar dados do onboarding no game_profile
    const mergedGameProfile = {
      ...existingGameProfile,
      ...payload
    };

    // Garantir que mantemos o status, se não existir coloca 'online'
    const status = existingProfile?.status || 'online';

    const { data, error } = await supabase
      .from('profiles')
      .update({
        nickname: payload.nickname, // Atualiza o nickname do profile principal
        game_profile: mergedGameProfile, // Salva o jsonb mesclado
        status, // Mantém ou inicializa
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, 'Erro ao sincronizar perfil gamer com o servidor.'));
  }
}
