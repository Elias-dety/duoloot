import { supabase, isSupabaseConfigured } from '@/lib/supabase';

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

export async function getActiveVaultEvent() {
  if (!isSupabaseConfigured) return null;

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
  return data || null;
}

export async function getVaultTasks(eventId: string) {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase.from('vault_tasks').select('*').eq('event_id', eventId);

  if (error) throw new Error(handleServiceError(error, 'Erro ao carregar tarefas.'));
  return data;
}

export async function legacyJoinVaultEvent(eventId: string) {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Entre na sua conta para participar.');

  const { data, error } = await supabase
    .from('vault_participants')
    .insert([{ event_id: eventId, player_id: user.id }])
    .select()
    .single();

  if (error) throw new Error(handleServiceError(error, 'Erro ao participar do evento.'));
  return data;
}

export async function claimVaultWinner(eventId: string, taskId: string, payload?: Record<string, unknown>) {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const { data, error } = await supabase.rpc('claim_vault_winner', {
    p_event_id: eventId,
    p_task_id: taskId,
    p_payload: payload || {},
  });

  if (error) throw new Error(handleServiceError(error, 'Erro ao reivindicar vitória.'));
  return data;
}

export async function submitVaultTask(eventId: string, taskId: string, payload?: Record<string, unknown>) {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const { data, error } = await supabase.rpc('submit_vault_task', {
    p_event_id: eventId,
    p_task_id: taskId,
    p_payload: payload || {},
  });

  if (error) throw new Error(handleServiceError(error, 'Erro ao enviar tarefa.'));

  if (data && data.length > 0) {
    if (!data[0].success) {
      throw new Error(data[0].message);
    }
    return data[0];
  }

  return null;
}

export async function validateVaultSubmission(submissionId: string, isValid: boolean) {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const { data, error } = await supabase.rpc('validate_vault_submission', {
    p_submission_id: submissionId,
    p_is_valid: isValid,
  });

  if (error) throw new Error(handleServiceError(error, 'Erro ao validar submissão.'));

  if (data && data.length > 0) {
    if (!data[0].success) {
      throw new Error(data[0].message);
    }
    return data[0];
  }

  return null;
}

export async function getVaultWinner(eventId: string) {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('vault_winners')
    .select('*')
    .eq('event_id', eventId)
    .single();

  if (error && error.code !== 'PGRST116') throw new Error(handleServiceError(error, 'Erro ao buscar vencedor.'));
  return data || null;
}
