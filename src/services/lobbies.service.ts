import { Lobby } from '@/schemas/lobby.schema';
import { PlayerGameProfile, PlayerProfile } from '@/services/auth.service';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type ServiceError = {
  code?: string;
  message?: string;
};

type LobbyStatus = 'open' | 'full' | 'in-game' | 'closed';

type LobbyOwnerRecord = {
  id?: string;
  name?: string;
  avatar_url?: string | null;
  trust_score?: number | null;
  status?: 'online' | 'offline' | 'in-game' | null;
  game_profile?: PlayerGameProfile;
  gameProfile?: PlayerGameProfile;
};

type LobbyRecord = {
  id: string;
  owner?: LobbyOwnerRecord | null;
  slots_total?: number | string | null;
  slots_filled?: number | string | null;
  mode?: string | null;
  queue?: string | null;
  min_rank?: string | null;
  max_rank?: string | null;
  status?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
};

export type CreateLobbyPayload = {
  slots_total?: number;
  mode?: string;
  queue?: string;
  min_rank?: string;
  max_rank?: string;
  metadata?: Record<string, unknown>;
};

type CreateLobbyRpcResult = {
  success: boolean;
  message: string;
  lobby_id?: string | null;
};

type JoinLobbyRpcResult = {
  success: boolean;
  message: string;
  lobby_id?: string | null;
  slots_filled?: number | null;
  slots_total?: number | null;
};

type LeaveLobbyRpcResult = {
  success: boolean;
  message: string;
  lobby_id?: string | null;
  slots_filled?: number | null;
  status?: LobbyStatus | null;
};

const handleServiceError = (error: ServiceError | null | undefined, fallbackMessage: string) => {
  console.error(error);
  if (!isSupabaseConfigured) return 'Configuração do Supabase ausente.';
  if (error?.message?.includes('JWT')) return 'Sua sessão expirou. Entre novamente.';
  if (error?.message?.includes('authenticated')) return 'Entre na sua conta para continuar.';
  if (error?.code === 'PGRST202') return 'Módulo de lobbies ainda não configurado no banco. Aplique a migration do Supabase.';
  if (error?.message?.includes('row-level security')) return 'Sem permissão no banco para esta ação. Verifique as policies/RLS.';
  return error?.message || fallbackMessage;
};

export function calculateCompatibility(
  userGp: PlayerGameProfile | null | undefined,
  lobbyMetadata: Record<string, unknown>,
  lobbyMode: string,
  lobbyQueue: string
): number {
  if (!userGp) return 50;

  let score = 0;
  const mainGame = typeof userGp.mainGame === 'string' ? userGp.mainGame : '';
  const currentRank = typeof userGp.currentRank === 'string' ? userGp.currentRank : '';
  const mainRole = typeof userGp.mainRole === 'string' ? userGp.mainRole : '';
  const secondaryRole = typeof userGp.secondaryRole === 'string' ? userGp.secondaryRole : '';
  const availability = typeof userGp.availability === 'string' ? userGp.availability : '';
  const preferredModes = Array.isArray(userGp.preferredModes) ? userGp.preferredModes.filter((mode): mode is string => typeof mode === 'string') : [];
  const microphone = typeof userGp.microphone === 'boolean' ? userGp.microphone : undefined;

  const lobbyMainGame = typeof lobbyMetadata.mainGame === 'string' ? lobbyMetadata.mainGame : '';
  const lobbyCurrentRank = typeof lobbyMetadata.currentRank === 'string' ? lobbyMetadata.currentRank : '';
  const lobbyMainRole = typeof lobbyMetadata.mainRole === 'string' ? lobbyMetadata.mainRole : '';
  const lobbyAvailability = typeof lobbyMetadata.availability === 'string' ? lobbyMetadata.availability : '';
  const lobbyMicrophone = typeof lobbyMetadata.microphone === 'boolean' ? lobbyMetadata.microphone : undefined;

  if (mainGame && lobbyMainGame && mainGame.toLowerCase() === lobbyMainGame.toLowerCase()) {
    score += 25;
  }

  if (currentRank && lobbyCurrentRank) {
    const r1 = currentRank.toLowerCase();
    const r2 = lobbyCurrentRank.toLowerCase();
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

  if (mainRole && lobbyMainRole) {
    const userRole = mainRole.toLowerCase();
    const ownerRole = lobbyMainRole.toLowerCase();
    if (userRole !== ownerRole) {
      score += 20;
    } else if (secondaryRole && secondaryRole.toLowerCase() !== ownerRole) {
      score += 15;
    } else {
      score += 5;
    }
  }

  if (availability && lobbyAvailability && availability.toLowerCase() === lobbyAvailability.toLowerCase()) {
    score += 15;
  }

  const mode = lobbyMode.toLowerCase();
  const queue = lobbyQueue.toLowerCase();
  if (preferredModes.some((preferredMode) => preferredMode.toLowerCase() === mode || preferredMode.toLowerCase() === queue)) {
    score += 10;
  }

  if (microphone !== undefined && microphone === lobbyMicrophone) {
    score += 10;
  }

  return Math.min(100, Math.max(0, score));
}

function normalizeLobbyStatus(status: string | null | undefined): LobbyStatus {
  return ['open', 'full', 'in-game', 'closed'].includes(status || '') ? (status as LobbyStatus) : 'open';
}

function mapLobbyRecord(item: LobbyRecord, currentProfile: PlayerProfile | null): Lobby {
  const ownerGameProfile = item.owner?.game_profile || item.owner?.gameProfile;
  const lobbyMetadata = item.metadata || {};
  const compatibilityScore = currentProfile
    ? calculateCompatibility(currentProfile.game_profile, lobbyMetadata, item.mode || '', item.queue || '')
    : undefined;

  return {
    id: item.id,
    owner: {
      id: item.owner?.id || '',
      name: item.owner?.name || 'Operador desconhecido',
      avatarUrl: item.owner?.avatar_url || undefined,
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
    status: normalizeLobbyStatus(item.status),
    compatibilityScore,
    metadata: lobbyMetadata,
    createdAt: item.created_at,
  };
}

export async function getOpenLobbies(): Promise<Lobby[]> {
  if (!isSupabaseConfigured) return [];

  let currentProfile: PlayerProfile | null = null;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      currentProfile = (data as PlayerProfile | null) || null;
    }
  } catch (error) {
    console.warn('Erro ao carregar perfil para matchmaking:', error);
  }

  const { data, error } = await supabase
    .from('lobbies')
    .select(
      `
      *,
      owner:profiles!owner_id(*)
    `
    )
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (error) throw new Error(handleServiceError(error, 'Erro ao carregar lobbies.'));

  const latestByOwner = new Map<string, LobbyRecord>();
  for (const item of (data || []) as LobbyRecord[]) {
    const ownerKey = item.owner?.id || item.id;
    if (!latestByOwner.has(ownerKey)) {
      latestByOwner.set(ownerKey, item);
    }
  }

  return Array.from(latestByOwner.values()).map((item) => mapLobbyRecord(item, currentProfile));
}

export async function createLobby(payload: CreateLobbyPayload) {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Entre na sua conta para criar um lobby.');

  const { data, error } = await supabase.rpc('create_lobby', {
    p_slots_total: payload.slots_total ?? 5,
    p_mode: payload.mode ?? 'competitivo',
    p_queue: payload.queue ?? 'ranked',
    p_min_rank: payload.min_rank ?? 'livre',
    p_max_rank: payload.max_rank ?? 'livre',
    p_metadata: payload.metadata ?? {},
  });

  if (error) throw new Error(handleServiceError(error, 'Erro ao criar lobby.'));

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Resposta inválida do servidor ao criar lobby.');
  }

  const result = data[0] as CreateLobbyRpcResult;
  if (!result.success) {
    throw new Error(result.message || 'Não foi possível criar o lobby.');
  }

  return result;
}

export async function joinLobby(lobbyId: string) {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Entre na sua conta para entrar em um lobby.');

  const { data, error } = await supabase.rpc('join_lobby', {
    p_lobby_id: lobbyId,
  });

  if (error) throw new Error(handleServiceError(error, 'Erro ao entrar no lobby.'));

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Resposta inválida do servidor ao entrar no lobby.');
  }

  const result = data[0] as JoinLobbyRpcResult;
  if (!result.success) {
    throw new Error(result.message || 'Não foi possível entrar no lobby.');
  }

  return result;
}

export async function leaveLobby(lobbyId: string) {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Entre na sua conta para sair do lobby.');

  const { data, error } = await supabase.rpc('leave_lobby', {
    p_lobby_id: lobbyId,
  });

  if (error) throw new Error(handleServiceError(error, 'Erro ao sair do lobby.'));

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Resposta inválida do servidor ao sair do lobby.');
  }

  const result = data[0] as LeaveLobbyRpcResult;
  if (!result.success) {
    throw new Error(result.message || 'Não foi possível sair do lobby.');
  }

  return result;
}
