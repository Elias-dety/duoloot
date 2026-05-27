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
  nickname?: string;
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

type CreateLobbyPayload = {
  slots_total?: unknown;
  mode?: unknown;
  queue?: unknown;
  min_rank?: unknown;
  max_rank?: unknown;
  metadata?: unknown;
};

const SAFE_LOBBY_METADATA_KEYS = [
  'mainGame',
  'riotId',
  'currentRank',
  'mainRole',
  'secondaryRole',
  'playStyle',
  'sessionFocus',
  'availability',
  'microphone',
  'region',
  'bio',
] as const;

const handleServiceError = (error: ServiceError | null | undefined, fallbackMessage: string) => {
  console.error(error);
  if (!isSupabaseConfigured) return 'Configuração do Supabase ausente.';
  if (error?.message?.includes('JWT')) return 'Sua sessão expirou. Entre novamente.';
  if (error?.message?.includes('authenticated')) return 'Entre na sua conta para continuar.';
  if (error?.code === 'PGRST202') return 'Módulo ainda não configurado no banco.';
  return error?.message || fallbackMessage;
};

const asText = (value: unknown, fallback: string): string => {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed.slice(0, 80) : fallback;
};

const asSlotTotal = (value: unknown): number => {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return 5;
  return Math.min(5, Math.max(2, Math.trunc(parsed)));
};

const sanitizeLobbyMetadata = (metadata: unknown): Record<string, unknown> => {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return {};

  return SAFE_LOBBY_METADATA_KEYS.reduce<Record<string, unknown>>((accumulator, key) => {
    const value = (metadata as Record<string, unknown>)[key];

    if (typeof value === 'string') {
      accumulator[key] = value.trim().slice(0, 160);
      return accumulator;
    }

    if (typeof value === 'boolean') {
      accumulator[key] = value;
      return accumulator;
    }

    return accumulator;
  }, {});
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

export async function getOpenLobbies(): Promise<Lobby[]> {
  if (!isSupabaseConfigured) return [];

  let currentProfile: PlayerProfile | null = null;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('id, game_profile')
        .eq('id', user.id)
        .single();
      currentProfile = (data as PlayerProfile | null) || null;
    }
  } catch (error) {
    console.warn('Erro ao carregar perfil para matchmaking:', error);
  }

  const { data, error } = await supabase
    .from('lobbies')
    .select(
      `
      id,
      slots_total,
      slots_filled,
      mode,
      queue,
      min_rank,
      max_rank,
      status,
      metadata,
      created_at,
      owner:profiles!owner_id(
        id,
        name,
        nickname,
        avatar_url,
        trust_score,
        status,
        game_profile
      )
    `
    )
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (error) throw new Error(handleServiceError(error, 'Erro ao carregar lobbies.'));

  return ((data || []) as LobbyRecord[]).map((item) => {
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
  });
}

export async function createLobby(payload: CreateLobbyPayload) {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Entre na sua conta para criar um lobby.');

  const safePayload = {
    owner_id: user.id,
    slots_total: asSlotTotal(payload.slots_total),
    slots_filled: 1,
    mode: asText(payload.mode, 'competitivo'),
    queue: asText(payload.queue, 'ranked'),
    min_rank: asText(payload.min_rank, 'Livre'),
    max_rank: asText(payload.max_rank, 'Livre'),
    status: 'open',
    metadata: sanitizeLobbyMetadata(payload.metadata),
  };

  const { data, error } = await supabase
    .from('lobbies')
    .insert([safePayload])
    .select()
    .single();

  if (error) throw new Error(handleServiceError(error, 'Erro ao criar lobby.'));
  return data;
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

  const result = data[0];
  if (!result.success) {
    throw new Error(result.message);
  }

  return result;
}
