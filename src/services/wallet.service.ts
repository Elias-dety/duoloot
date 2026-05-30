import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { WalletAccount, WalletLedgerEntry, WalletRedemption, RewardCatalogItem } from '@/features/wallet/wallet.schema';

// ---------------------------------------------------------------------------
// Error handling (follows project pattern from vault-progress.service.ts)
// ---------------------------------------------------------------------------

type ServiceError = {
  code?: string;
  message?: string;
};

const handleServiceError = (
  error: ServiceError | null | undefined,
  fallbackMessage: string
): string => {
  console.error(error);
  if (!isSupabaseConfigured) return 'Configuração do Supabase ausente.';
  if (error?.message?.includes('JWT')) return 'Sua sessão expirou. Entre novamente.';
  if (error?.message?.includes('authenticated') || error?.message?.includes('Auth session missing')) {
    return 'Entre na sua conta para continuar.';
  }
  if (error?.code === 'PGRST202') return 'Módulo de carteira ainda não configurado no banco.';
  if (error?.code === 'PGRST116') return 'Nenhum registro encontrado.';
  return error?.message || fallbackMessage;
};

// ---------------------------------------------------------------------------
// User-facing wallet operations
// ---------------------------------------------------------------------------

/**
 * Fetches the current user's wallet account.
 * Returns null if no wallet exists yet or Supabase is not configured.
 */
export async function getMyWalletAccount(): Promise<WalletAccount | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('wallet_accounts')
    .select('*')
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(handleServiceError(error, 'Erro ao carregar carteira.'));
  }

  return (data as WalletAccount) ?? null;
}

/**
 * Fetches the current user's ledger entries (statement).
 */
export async function getMyWalletLedger(limit: number = 50): Promise<WalletLedgerEntry[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('wallet_ledger_entries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(handleServiceError(error, 'Erro ao carregar extrato.'));

  return (data as WalletLedgerEntry[]) ?? [];
}

/**
 * Fetches the current user's redemption history.
 */
export async function getMyRedemptions(limit: number = 20): Promise<WalletRedemption[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('wallet_redemptions')
    .select('*')
    .order('requested_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(handleServiceError(error, 'Erro ao carregar resgates.'));

  return (data as WalletRedemption[]) ?? [];
}

/**
 * Fetches active reward catalog items.
 */
export async function getRewardCatalog(): Promise<RewardCatalogItem[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('reward_catalog')
    .select('*')
    .eq('status', 'active')
    .order('cost', { ascending: true });

  if (error) throw new Error(handleServiceError(error, 'Erro ao carregar catálogo.'));

  return (data as RewardCatalogItem[]) ?? [];
}

/**
 * Requests a wallet redemption via secure RPC.
 * Moves funds from available_balance to locked_balance.
 */
export async function requestWalletRedemption(input: {
  rewardType: string;
  rewardLabel: string;
  amount: number;
  payoutPayload?: Record<string, unknown>;
}): Promise<{ success: boolean; redemption_id?: string; message?: string }> {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const { data, error } = await supabase.rpc('request_wallet_redemption', {
    p_reward_type: input.rewardType,
    p_reward_label: input.rewardLabel,
    p_amount: input.amount,
    p_payout_payload: input.payoutPayload ?? {},
  });

  if (error) throw new Error(handleServiceError(error, 'Erro ao solicitar resgate.'));

  return data as { success: boolean; redemption_id?: string; message?: string };
}
