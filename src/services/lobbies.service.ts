import { supabase } from '@/lib/supabase';

export async function getOpenLobbies() {
  const { data, error } = await supabase
    .from('lobbies')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
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
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw new Error(userError.message);
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('lobby_members')
    .insert([{ lobby_id: lobbyId, player_id: user.id }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function leaveLobby(lobbyId: string) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw new Error(userError.message);
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('lobby_members')
    .delete()
    .eq('lobby_id', lobbyId)
    .eq('player_id', user.id)
    .select()
    .single();

  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return data || null;
}
