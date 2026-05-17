import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  MyVaultProgress,
  MyVaultRank,
  VaultEvent,
  VaultLeaderboardEntry,
  VaultLeaderboardEntrySchema,
  VaultMission,
  VaultMissionProgress,
  VaultOverview,
  VaultParticipant,
} from '@/features/vault/vault.schema';

type ServiceError = {
  code?: string;
  message?: string;
};

type VaultLeaderboardRpcRow = {
  rank_position: number | null;
  participant_id: string;
  player_id: string;
  player_name: string | null;
  player_nickname: string | null;
  avatar_url: string | null;
  trust_score: number | null;
  points: number | null;
  joined_at: string;
  missions_completed: number | null;
  total_missions: number | null;
  game_profile: Record<string, unknown> | null;
};

const handleServiceError = (error: ServiceError | null | undefined, fallbackMessage: string) => {
  console.error(error);

  if (!isSupabaseConfigured) return 'Configuração do Supabase ausente.';
  if (error?.message?.includes('JWT')) return 'Sua sessão expirou. Entre novamente.';
  if (error?.message?.includes('authenticated') || error?.message?.includes('Auth session missing')) {
    return 'Entre na sua conta para continuar.';
  }
  if (error?.code === 'PGRST202') return 'Ranking do Cofre ainda não configurado.';
  if (error?.code === 'PGRST116') return 'Nenhum registro encontrado.';

  return error?.message || fallbackMessage;
};

const mapVaultLeaderboardEntry = (row: VaultLeaderboardRpcRow): VaultLeaderboardEntry =>
  VaultLeaderboardEntrySchema.parse({
    rankPosition: row.rank_position ?? 0,
    participantId: row.participant_id,
    playerId: row.player_id,
    playerName: row.player_name,
    playerNickname: row.player_nickname,
    avatarUrl: row.avatar_url,
    trustScore: row.trust_score ?? 0,
    points: row.points ?? 0,
    joinedAt: row.joined_at,
    missionsCompleted: row.missions_completed ?? 0,
    totalMissions: row.total_missions ?? 0,
    gameProfile: row.game_profile ?? null,
  });

export async function getActiveVault(): Promise<VaultEvent | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data, error } = await supabase
      .from('vault_events')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(handleServiceError(error, 'Erro ao carregar evento do cofre.'));
    }

    return data as VaultEvent | null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getVaultOverview(eventId: string): Promise<VaultOverview | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data: eventData, error: eventError } = await supabase
      .from('vault_events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError) throw new Error(handleServiceError(eventError, 'Erro ao buscar evento.'));

    const { data: missionsData, error: missionsError } = await supabase
      .from('vault_missions')
      .select('*')
      .eq('event_id', eventId)
      .eq('status', 'active');

    if (missionsError) throw new Error(handleServiceError(missionsError, 'Erro ao buscar missões.'));

    const { count: participantCount, error: countError } = await supabase
      .from('vault_participants')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);

    if (countError) console.error(countError);

    return {
      event: eventData as VaultEvent,
      missions: (missionsData as VaultMission[]) || [],
      participantCount: participantCount || 0,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function joinVaultEvent(eventId: string): Promise<{ success: boolean; message: string; event_id?: string }> {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Entre na sua conta para participar do Cofre.');

  const { data, error } = await supabase.rpc('join_vault_event', { p_event_id: eventId });

  if (error) throw new Error(handleServiceError(error, 'Erro ao participar do Cofre.'));

  if (data && data.length > 0) {
    if (!data[0].success) throw new Error(data[0].message);
    return data[0];
  }

  return { success: false, message: 'Resposta inválida do servidor.' };
}

export async function getMyVaultProgress(eventId: string): Promise<MyVaultProgress | null> {
  if (!isSupabaseConfigured) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const { data: participantData, error: participantError } = await supabase
      .from('vault_participants')
      .select('*')
      .eq('event_id', eventId)
      .eq('player_id', user.id)
      .single();

    if (participantError && participantError.code !== 'PGRST116') {
      console.error(participantError);
    }

    const participant = participantData as VaultParticipant | null;

    const { data: missionsData, error: missionsError } = await supabase
      .from('vault_missions')
      .select('*')
      .eq('event_id', eventId)
      .eq('status', 'active')
      .order('created_at', { ascending: true });

    if (missionsError) throw new Error(handleServiceError(missionsError, 'Erro ao buscar missões.'));
    const missions = (missionsData as VaultMission[]) || [];

    const { data: progressData, error: progressError } = await supabase
      .from('vault_mission_progress')
      .select('*')
      .eq('event_id', eventId)
      .eq('player_id', user.id);

    if (progressError) throw new Error(handleServiceError(progressError, 'Erro ao buscar progresso.'));
    const progresses = (progressData as VaultMissionProgress[]) || [];

    const missionProgress = missions.map((mission) => {
      const progress = progresses.find((entry) => entry.mission_id === mission.id);
      return {
        ...mission,
        progress: progress || null,
      };
    });

    const totalPoints = participant?.points || 0;

    let maxTotal = 0;
    let currentTotal = 0;

    missionProgress.forEach((mission) => {
      maxTotal += mission.target_value;
      currentTotal += mission.progress?.current_value || 0;
    });

    const percentage = maxTotal > 0 ? Math.min(100, Math.round((currentTotal / maxTotal) * 100)) : 0;

    return {
      participant,
      missionProgress,
      totalPoints,
      percentage,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function claimVaultMissionProgress(
  missionId: string,
  increment: number = 1
): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Entre na sua conta para registrar progresso.');

  const { data, error } = await supabase.rpc('claim_vault_mission_progress', {
    p_mission_id: missionId,
    p_increment: increment,
  });

  if (error) throw new Error(handleServiceError(error, 'Erro ao atualizar progresso.'));

  if (data && data.length > 0) {
    if (!data[0].success) throw new Error(data[0].message);
    return data[0];
  }

  return { success: false, message: 'Resposta inválida do servidor.' };
}

export async function getVaultLeaderboard(eventId?: string | null, limit: number = 20): Promise<VaultLeaderboardEntry[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase.rpc('get_vault_leaderboard', {
      p_event_id: eventId ?? null,
      p_limit: limit,
    });

    if (error) throw error;

    return ((data ?? []) as VaultLeaderboardRpcRow[]).map(mapVaultLeaderboardEntry);
  } catch (error) {
    throw new Error(handleServiceError(error as ServiceError, 'Erro ao carregar ranking do Cofre.'), {
      cause: error,
    });
  }
}

export async function getMyVaultRank(eventId?: string | null): Promise<MyVaultRank | null> {
  if (!isSupabaseConfigured) {
    throw new Error('Configuração do Supabase ausente.');
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Entre na sua conta para continuar.');

  try {
    const { data, error } = await supabase.rpc('get_my_vault_rank', {
      p_event_id: eventId ?? null,
    });

    if (error) throw error;

    const rows = (data ?? []) as VaultLeaderboardRpcRow[];
    if (rows.length === 0) {
      return null;
    }

    return mapVaultLeaderboardEntry(rows[0]);
  } catch (error) {
    throw new Error(handleServiceError(error as ServiceError, 'Erro ao carregar sua posição no Cofre.'), {
      cause: error,
    });
  }
}
