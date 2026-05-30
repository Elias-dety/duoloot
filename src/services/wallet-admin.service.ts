import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { WalletRedemption } from '@/features/wallet/wallet.schema';

// ---------------------------------------------------------------------------
// Error handling
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
  if (error?.message?.includes('Permissao insuficiente')) return 'Permissão insuficiente.';
  if (error?.code === 'PGRST202') return 'Módulo de carteira ainda não configurado no banco.';
  return error?.message || fallbackMessage;
};

// ---------------------------------------------------------------------------
// Admin wallet operations
// ---------------------------------------------------------------------------

/**
 * Fetches all pending/under_review redemptions for admin review queue.
 */
export async function adminGetPendingRedemptions(): Promise<WalletRedemption[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('wallet_redemptions')
    .select('*')
    .in('status', ['requested', 'under_review'])
    .order('requested_at', { ascending: true });

  if (error) throw new Error(handleServiceError(error, 'Erro ao carregar resgates pendentes.'));

  return (data as WalletRedemption[]) ?? [];
}

/**
 * Fetches all redemptions (any status) for admin investigation.
 */
export async function adminGetAllRedemptions(
  statusFilter?: string,
  limit: number = 50
): Promise<WalletRedemption[]> {
  if (!isSupabaseConfigured) return [];

  let query = supabase
    .from('wallet_redemptions')
    .select('*')
    .order('requested_at', { ascending: false })
    .limit(limit);

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  const { data, error } = await query;

  if (error) throw new Error(handleServiceError(error, 'Erro ao carregar resgates.'));

  return (data as WalletRedemption[]) ?? [];
}

/**
 * Admin approves a redemption request via secure RPC.
 */
export async function adminApproveRedemption(
  redemptionId: string,
  adminNotes?: string
): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const { data, error } = await supabase.rpc('admin_approve_wallet_redemption', {
    p_redemption_id: redemptionId,
    p_admin_notes: adminNotes ?? null,
  });

  if (error) throw new Error(handleServiceError(error, 'Erro ao aprovar resgate.'));

  return data as { success: boolean; message: string };
}

/**
 * Admin rejects a redemption request via secure RPC.
 * Refunds locked balance back to available.
 */
export async function adminRejectRedemption(
  redemptionId: string,
  adminNotes?: string
): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const { data, error } = await supabase.rpc('admin_reject_wallet_redemption', {
    p_redemption_id: redemptionId,
    p_admin_notes: adminNotes ?? null,
  });

  if (error) throw new Error(handleServiceError(error, 'Erro ao rejeitar resgate.'));

  return data as { success: boolean; message: string };
}
