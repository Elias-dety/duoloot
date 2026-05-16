import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Função utilitária para centralizar o tratamento de erros do serviço de lobbies.
 * Converte erros técnicos em mensagens compreensíveis para o usuário final.
 */
const handleServiceError = (error: any, fallbackMessage: string) => {
  console.error(error);
  if (!isSupabaseConfigured) return 'Configuração do Supabase ausente.';
  if (error?.message?.includes('JWT')) return 'Sua sessão expirou. Entre novamente.';
  if (error?.message?.includes('authenticated')) return 'Entre na sua conta para continuar.';
  if (error?.code === 'PGRST202') return 'Módulo ainda não configurado no banco.';
  return error?.message || fallbackMessage;
};

/**
 * Busca todos os lobbies que estão com status 'open' (abertos para novos jogadores).
 * Faz o mapeamento dos dados do banco (snake_case) para o padrão do frontend (camelCase).
 */
export async function getOpenLobbies() {
  if (!isSupabaseConfigured) return [];

  // Consulta a tabela 'lobbies' trazendo os dados do proprietário (owner) via foreign key
  const { data, error } = await supabase
    .from('lobbies')
    .select(`
      *,
      owner:profiles!owner_id(*)
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (error) throw new Error(handleServiceError(error, 'Erro ao carregar lobbies.'));

  // Transforma o formato dos dados vindos do Supabase para o formato esperado pelos componentes React
  return (data || []).map(item => ({
    id: item.id,
    owner: {
      id: item.owner?.id,
      name: item.owner?.name || 'Operador desconhecido',
      avatarUrl: item.owner?.avatar_url,
      trustScore: item.owner?.trust_score || 0,
      status: item.owner?.status || 'offline',
      // Suporta game_profile tanto em snake quanto camel case
      gameProfile: item.owner?.game_profile || item.owner?.gameProfile || undefined,
    },
    slotsTotal: Number(item.slots_total) || 2,
    slotsFilled: Number(item.slots_filled) || 1,
    mode: item.mode || 'Modo indefinido',
    queue: item.queue || 'Fila aberta',
    minRank: item.min_rank || 'Livre',
    maxRank: item.max_rank || 'Livre',
    status: (['open', 'full', 'in-game', 'closed'].includes(item.status) ? item.status : 'open') as any,
    compatibilityScore: item.compatibility_score,
    createdAt: item.created_at,
  }));
}

/**
 * Recupera os detalhes de um lobby específico pelo seu ID único.
 * Traz também a lista de membros atuais do lobby.
 */
export async function getLobbyById(lobbyId: string) {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const { data, error } = await supabase
    .from('lobbies')
    .select('*, lobby_members(*)')
    .eq('id', lobbyId)
    .single();

  if (error) throw new Error(handleServiceError(error, 'Lobby não encontrado.'));
  return data;
}

/**
 * Cria um novo lobby de jogo.
 * O proprietário (owner_id) é definido automaticamente com base no usuário logado.
 */
export async function createLobby(payload: Record<string, unknown>) {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  // Verifica se há um usuário autenticado antes de prosseguir
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Entre na sua conta para criar um lobby.');

  // Insere o novo lobby e retorna o objeto criado
  const { data, error } = await supabase
    .from('lobbies')
    .insert([{ ...payload, owner_id: user.id }])
    .select()
    .single();

  if (error) throw new Error(handleServiceError(error, 'Erro ao criar lobby.'));
  return data;
}

/**
 * Tenta ingressar em um lobby existente utilizando uma RPC.
 * A RPC lida com as travas de concorrência (ex: evitar entrar em lobby cheio).
 */
export async function joinLobby(lobbyId: string) {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Entre na sua conta para entrar em um lobby.');

  // Chama a função SQL 'join_lobby' que gerencia slots e associações
  const { data, error } = await supabase.rpc('join_lobby', {
    p_lobby_id: lobbyId
  });

  if (error) throw new Error(handleServiceError(error, 'Erro ao entrar no lobby.'));

  // A RPC retorna um array; pegamos o primeiro item que contém o resultado da operação
  const result = data[0];
  if (!result.success) {
    throw new Error(result.message);
  }

  return result;
}

/**
 * Remove o usuário atual do lobby especificado.
 * Se o usuário for o dono, regras adicionais de encerramento podem ser aplicadas via SQL.
 */
export async function leaveLobby(lobbyId: string) {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  // Chama a função SQL 'leave_lobby' para processar a saída de forma segura
  const { data, error } = await supabase.rpc('leave_lobby', {
    p_lobby_id: lobbyId
  });

  if (error) throw new Error(handleServiceError(error, 'Erro ao sair do lobby.'));

  const result = data[0];
  if (!result.success) {
    throw new Error(result.message);
  }

  return result;
}

