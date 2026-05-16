import { supabase } from '@/lib/supabase';
import { validateVaultSubmission } from './vault.service';

export { validateVaultSubmission };

export async function getPendingVaultSubmissions() {
  const { data, error } = await supabase
    .from('vault_submissions')
    .select(`
      *,
      event:vault_events(title, prize_pool, prize_currency),
      task:vault_tasks(title, description),
      player:profiles(name, nickname, avatar_url, trust_score)
    `)
    .is('is_valid', null)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}
