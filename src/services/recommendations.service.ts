import { supabase } from '@/lib/supabase';

export async function getRecommendedPlayers(game?: string, limit?: number) {
  const { data, error } = await supabase.rpc('get_recommended_players', {
    p_game: game ?? 'valorant',
    p_limit: limit ?? 10
  });

  if (error) throw new Error(error.message);
  return data;
}
