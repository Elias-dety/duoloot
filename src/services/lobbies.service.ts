import { supabase } from '@/lib/supabase';

export async function getOpenLobbies() {
  const { data, error } = await supabase
    .from('lobbies')
    .select(`
      *,
      owner:profiles(*)
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  // Map database snake_case to camelCase
  return (data || []).map(item => ({
    id: item.id,
    owner: {
      id: item.owner.id,
      name: item.owner.name,
      avatarUrl: item.owner.avatar_url,
      trustScore: item.owner.trust_score,
      status: item.owner.status,
    },
    slotsTotal: item.slots_total,
    slotsFilled: item.slots_filled,
    mode: item.mode,
    queue: item.queue,
    minRank: item.min_rank,
    maxRank: item.max_rank,
    status: item.status,
    createdAt: item.created_at,
  }));
}

export async function getLobbyById(lobbyId: string) {
  const { data, error } = await supabase
    .from('lobbies')
    .select('*, lobby_members(*)')
    .eq('id', lobbyId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createLobby(payload: Record<string, unknown>) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw new Error(userError.message);
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('lobbies')
    .insert([{ ...payload, owner_id: user.id }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function joinLobby(lobbyId: string) {
  const { data, error } = await supabase.rpc('join_lobby', {
    p_lobby_id: lobbyId
  });

  if (error) throw new Error(error.message);

  const result = data[0];
  if (!result.success) {
    throw new Error(result.message);
  }

  return result;
}

export async function leaveLobby(lobbyId: string) {
  const { data, error } = await supabase.rpc('leave_lobby', {
    p_lobby_id: lobbyId
  });

  if (error) throw new Error(error.message);

  const result = data[0];
  if (!result.success) {
    throw new Error(result.message);
  }

  return result;
}
