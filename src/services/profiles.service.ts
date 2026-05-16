import { supabase } from '@/lib/supabase';

export async function getCurrentProfile() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw new Error(userError.message);
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getProfileById(playerId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', playerId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateCurrentProfile(payload: Record<string, unknown>) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw new Error(userError.message);
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
