import { supabase } from '@/lib/supabase';

export async function getActiveVaultEvent() {
  const { data, error } = await supabase
    .from('vault_events')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return data || null;
}

export async function getVaultTasks(eventId: string) {
  const { data, error } = await supabase
    .from('vault_tasks')
    .select('*')
    .eq('event_id', eventId);

  if (error) throw new Error(error.message);
  return data;
}

export async function joinVaultEvent(eventId: string) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw new Error(userError.message);
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('vault_participants')
    .insert([{ event_id: eventId, player_id: user.id }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function claimVaultWinner(eventId: string, taskId: string, payload?: Record<string, unknown>) {
  const { data, error } = await supabase.rpc('claim_vault_winner', {
    p_event_id: eventId,
    p_task_id: taskId,
    p_payload: payload || {}
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function getVaultWinner(eventId: string) {
  const { data, error } = await supabase
    .from('vault_winners')
    .select('*')
    .eq('event_id', eventId)
    .single();

  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return data || null;
}
