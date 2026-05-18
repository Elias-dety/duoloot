import type { OnboardingData } from '@/features/onboarding/onboarding.schema';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getCurrentProfile } from './profiles.service';

type ServiceError = {
  message?: string;
};

type ProfileWithGameProfile = {
  game_profile?: Record<string, unknown> | null;
  nickname?: string | null;
  status?: string | null;
};

const handleServiceError = (error: ServiceError | null | undefined, fallbackMessage: string) => {
  console.error(error);
  if (!isSupabaseConfigured) return 'Configuração do Supabase ausente.';
  if (error?.message?.includes('JWT')) return 'Sua sessão expirou. Entre novamente.';
  if (error?.message?.includes('authenticated')) return 'Entre na sua conta para continuar.';
  return error?.message || fallbackMessage;
};

export function isGameProfileComplete(profile: ProfileWithGameProfile | null | undefined): boolean {
  const gameProfile = profile?.game_profile;
  if (!gameProfile) return false;

  const hasRequiredFields =
    typeof gameProfile.mainGame === 'string' &&
    typeof gameProfile.nickname === 'string' &&
    typeof gameProfile.currentRank === 'string' &&
    typeof gameProfile.mainRole === 'string' &&
    typeof gameProfile.playStyle === 'string' &&
    typeof gameProfile.availability === 'string' &&
    Array.isArray(gameProfile.preferredModes) &&
    gameProfile.preferredModes.length >= 1;

  return hasRequiredFields;
}

export async function getMyGameProfile(): Promise<Partial<OnboardingData> | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const profile = (await getCurrentProfile()) as ProfileWithGameProfile | null;
    return (profile?.game_profile as Partial<OnboardingData> | null) || null;
  } catch (error) {
    console.warn('Erro ao obter perfil gamer:', error);
    return null;
  }
}

export async function updateMyGameProfile(payload: OnboardingData) {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado no terminal.');

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Entre na sua conta para continuar.');

  try {
    const existingProfile = (await getCurrentProfile()) as ProfileWithGameProfile | null;
    const existingGameProfile = existingProfile?.game_profile || {};

    const mergedGameProfile = {
      ...existingGameProfile,
      ...payload,
    };

    const status = existingProfile?.status || 'online';

    const { data, error } = await supabase
      .from('profiles')
      .update({
        nickname: payload.nickname,
        game_profile: mergedGameProfile,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: unknown) {
    throw new Error(handleServiceError(error as ServiceError, 'Erro ao sincronizar perfil gamer com o servidor.'), {
      cause: error,
    });
  }
}
