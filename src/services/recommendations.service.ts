import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * handleServiceError: Função utilitária para centralizar o tratamento de erros técnicos
 * e transformá-los em mensagens amigáveis para o usuário final.
 */
const handleServiceError = (error: any, fallbackMessage: string) => {
  console.error(error);
  // Verifica se o backend está configurado
  if (!isSupabaseConfigured) return 'Configuração do Supabase ausente.';
  
  // Tratamento de casos específicos de autenticação e banco de dados
  if (error?.message?.includes('JWT')) return 'Sua sessão expirou. Entre novamente.';
  if (error?.message?.includes('authenticated')) return 'Entre na sua conta para continuar.';
  if (error?.code === 'PGRST202') return 'Módulo ainda não configurado no banco.';
  
  return error?.message || fallbackMessage;
};

/**
 * getRecommendedPlayers: Busca jogadores recomendados com base em algoritmos de IA no banco de dados.
 * Utiliza o sistema de matchmaking tático do Duo Loot.
 * 
 * @param game O jogo para filtrar as recomendações (padrão: valorant).
 * @param limit O número máximo de jogadores a retornar.
 */
export async function getRecommendedPlayers(game?: string, limit?: number) {
  // Retorna array vazio se não houver backend para evitar quebras na UI
  if (!isSupabaseConfigured) return [];

  // Chama a função RPC (Stored Procedure) no Postgres que processa as recomendações
  const { data, error } = await supabase.rpc('get_recommended_players', {
    p_game: game ?? 'valorant',
    p_limit: limit ?? 10
  });

  if (error) throw new Error(handleServiceError(error, 'Erro ao carregar recomendações.'));
  return data;
}

