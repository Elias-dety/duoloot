import { supabase, isSupabaseConfigured } from '@/lib/supabase';

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

export async function getRecommendedPlayers(game?: string, limit?: number) {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase.rpc('get_recommended_players', {
    p_game: game ?? 'valorant',
    p_limit: limit ?? 10,
  });

  if (error) throw new Error(handleServiceError(error, 'Erro ao carregar recomendações.'));
  return data;
}
