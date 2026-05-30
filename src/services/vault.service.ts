import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { VaultMission } from '@/features/vault/vault.schema';

type ServiceError = {
  code?: string;
  message?: string;
};

const handleServiceError = (error: ServiceError | null | undefined, fallbackMessage: string) => {
  console.error(error);
  if (!isSupabaseConfigured) return 'Configuração do Supabase ausente.';
  if (error?.message?.includes('JWT')) return 'Sua sessão expirou. Entre novamente.';
  if (error?.message?.includes('authenticated')) return 'Entre na sua conta para continuar.';
  if (error?.code === 'PGRST202') return 'Módulo ainda não configurado no banco.';
  return error?.message || fallbackMessage;
};

export async function getVaultMissions(): Promise<VaultMission[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase.rpc('get_vault_missions');
    if (error) throw new Error(handleServiceError(error, 'Erro ao carregar missões.'));
    return (data || []) as VaultMission[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function submitVaultMission(payload: {
  missionId: string;
  evidenceText?: string;
  evidenceUrl?: string;
}): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Entre na sua conta para enviar a conclusão.');

  const { data, error } = await supabase.rpc('submit_vault_mission', {
    p_mission_id: payload.missionId,
    p_evidence_text: payload.evidenceText || null,
    p_evidence_url: payload.evidenceUrl || null,
  });

  if (error) throw new Error(handleServiceError(error, 'Erro ao enviar conclusão.'));

  if (data && data.length > 0) {
    if (!data[0].success) throw new Error(data[0].message);
    return { success: data[0].success, message: data[0].message };
  }

  return { success: false, message: 'Resposta inválida do servidor.' };
}

export async function getAdminVaultSubmissions() {
  if (!isSupabaseConfigured) return [];
  try {
    // Busca direta na tabela ja que eh admin
    const { data, error } = await supabase
      .from('vault_mission_submissions')
      .select(`
        *,
        mission:vault_missions(title, event_id),
        player:profiles(nickname, name, avatar_url, trust_score)
      `)
      .eq('status', 'submitted')
      .order('created_at', { ascending: true });

    if (error) throw new Error(handleServiceError(error, 'Erro ao buscar submissões.'));
    return data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function approveVaultSubmission(submissionId: string, reviewNote: string = '') {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');
  const { data, error } = await supabase.rpc('approve_vault_submission', {
    p_submission_id: submissionId,
    p_review_note: reviewNote,
  });

  if (error) throw new Error(handleServiceError(error, 'Erro ao aprovar.'));
  if (data && data.length > 0) {
    if (!data[0].success) throw new Error(data[0].message);
    return data[0];
  }
  return { success: false, message: 'Resposta inválida.' };
}

export async function rejectVaultSubmission(submissionId: string, reviewNote: string = '') {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');
  const { data, error } = await supabase.rpc('reject_vault_submission', {
    p_submission_id: submissionId,
    p_review_note: reviewNote,
  });

  if (error) throw new Error(handleServiceError(error, 'Erro ao rejeitar.'));
  if (data && data.length > 0) {
    if (!data[0].success) throw new Error(data[0].message);
    return data[0];
  }
  return { success: false, message: 'Resposta inválida.' };
}
