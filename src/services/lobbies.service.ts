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
 * Calcula um escore de compatibilidade simples (0 a 100) entre o jogador logado e o lobby.
 */
function calculateCompatibility(userGp: any, lobbyMetadata: any, lobbyMode: string, lobbyQueue: string): number {
  if (!userGp || !lobbyMetadata) return 50; // Fallback neutro se não logado ou sem metadados

  let score = 0;

  // 1. +25 se mainGame igual
  if (userGp.mainGame && lobbyMetadata.mainGame && userGp.mainGame.toLowerCase() === lobbyMetadata.mainGame.toLowerCase()) {
    score += 25;
  }

  // 2. +20 se rank igual ou próximo
  if (userGp.currentRank && lobbyMetadata.currentRank) {
    const r1 = userGp.currentRank.toLowerCase();
    const r2 = lobbyMetadata.currentRank.toLowerCase();
    if (r1 === r2) {
      score += 20;
    } else {
      const ranks = ['ferro', 'bronze', 'prata', 'ouro', 'platina', 'diamante', 'ascendente', 'imortal', 'radiante'];
      const idx1 = ranks.indexOf(r1);
      const idx2 = ranks.indexOf(r2);
      if (idx1 !== -1 && idx2 !== -1 && Math.abs(idx1 - idx2) <= 1) {
        score += 15;
      }
    }
  }

  // 3. +20 se mainRole encaixa (diferente) ou não repete
  if (userGp.mainRole && lobbyMetadata.mainRole) {
    const userRole = userGp.mainRole.toLowerCase();
    const ownerRole = lobbyMetadata.mainRole.toLowerCase();
    if (userRole !== ownerRole) {
      score += 20;
    } else if (userGp.secondaryRole && userGp.secondaryRole.toLowerCase() !== ownerRole) {
      score += 15;
    } else {
      score += 5;
    }
  }

  // 4. +15 se availability igual
  if (userGp.availability && lobbyMetadata.availability && userGp.availability.toLowerCase() === lobbyMetadata.availability.toLowerCase()) {
    score += 15;
  }

  // 5. +10 se preferredModes inclui queue/mode
  if (Array.isArray(userGp.preferredModes)) {
    const modes = userGp.preferredModes.map((m: string) => m.toLowerCase());
    const m = (lobbyMode || '').toLowerCase();
    const q = (lobbyQueue || '').toLowerCase();
    if (modes.includes(m) || modes.includes(q)) {
      score += 10;
    }
  }

  // 6. +10 se microphone compatível
  if (userGp.microphone === lobbyMetadata.microphone) {
    score += 10;
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * Busca todos os lobbies que estão com status 'open' (abertos para novos jogadores).
 * Faz o mapeamento dos dados do banco (snake_case) para o padrão do frontend (camelCase).
 */
export async function getOpenLobbies() {
  if (!isSupabaseConfigured) return [];

  // Obter perfil do usuário logado se houver, para fins de compatibilidade
  let currentProfile: any = null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      currentProfile = data;
    }
  } catch (err) {
    console.warn('Erro ao carregar perfil para matchmaking:', err);
  }

  // Consulta a tabela 'lobbies' trazendo os dados do proprietário (owner) via profiles
  const { data, error } = await supabase
    .from('lobbies')
    .select(`
      *,
      owner:profiles!owner_id(*)
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (error) throw new Error(handleServiceError(error, 'Erro ao carregar lobbies.'));

  // Transforma o formato dos dados vindos do Supabase para o formato esperado
  return (data || []).map(item => {
    const ownerGameProfile = item.owner?.game_profile || item.owner?.gameProfile || undefined;
    const lobbyMetadata = item.metadata || {};
    
    // Calcula a compatibilidade
    const compScore = currentProfile 
      ? calculateCompatibility(currentProfile.game_profile, lobbyMetadata, item.mode, item.queue)
      : undefined;

    return {
      id: item.id,
      owner: {
        id: item.owner?.id,
        name: item.owner?.name || 'Operador desconhecido',
        avatarUrl: item.owner?.avatar_url,
        trustScore: item.owner?.trust_score || 0,
        status: item.owner?.status || 'offline',
        gameProfile: ownerGameProfile,
      },
      slotsTotal: Number(item.slots_total) || 2,
      slotsFilled: Number(item.slots_filled) || 1,
      mode: item.mode || 'Modo indefinido',
      queue: item.queue || 'Fila aberta',
      minRank: item.min_rank || 'Livre',
      maxRank: item.max_rank || 'Livre',
      status: (['open', 'full', 'in-game', 'closed'].includes(item.status) ? item.status : 'open') as any,
      compatibilityScore: compScore,
      metadata: lobbyMetadata,
      createdAt: item.created_at,
    };
  });
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

