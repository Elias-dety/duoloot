import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Utilitário de tratamento de erros para o serviço do Vault (Cofre).
 */
const handleServiceError = (error: any, fallbackMessage: string) => {
  console.error(error);
  if (!isSupabaseConfigured) return 'Configuração do Supabase ausente.';
  if (error?.message?.includes('JWT')) return 'Sua sessão expirou. Entre novamente.';
  if (error?.message?.includes('authenticated')) return 'Entre na sua conta para continuar.';
  if (error?.code === 'PGRST202') return 'Módulo ainda não configurado no banco.';
  return error?.message || fallbackMessage;
};

/**
 * Recupera o evento do Cofre que está atualmente ativo.
 * O Cofre é o sistema de recompensas sazonais do DuoLoot.
 */
export async function getActiveVaultEvent() {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('vault_events')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // PGRST116 indica que nenhum registro foi encontrado (não é necessariamente um erro crítico)
  if (error && error.code !== 'PGRST116') throw new Error(handleServiceError(error, 'Erro ao carregar evento do cofre.'));
  return data || null;
}

/**
 * Lista todas as tarefas associadas a um evento específico do Cofre.
 * @param eventId UUID do evento
 */
export async function getVaultTasks(eventId: string) {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('vault_tasks')
    .select('*')
    .eq('event_id', eventId);

  if (error) throw new Error(handleServiceError(error, 'Erro ao carregar tarefas.'));
  return data;
}

/**
 * Registra o interesse do usuário atual em participar de um evento do Cofre.
 */
export async function joinVaultEvent(eventId: string) {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Entre na sua conta para participar.');

  const { data, error } = await supabase
    .from('vault_participants')
    .insert([{ event_id: eventId, player_id: user.id }])
    .select()
    .single();

  if (error) throw new Error(handleServiceError(error, 'Erro ao participar do evento.'));
  return data;
}

/**
 * Reivindica o prêmio final de um evento. 
 * Esta função utiliza uma RPC para garantir que a transação seja atômica.
 */
export async function claimVaultWinner(eventId: string, taskId: string, payload?: Record<string, unknown>) {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const { data, error } = await supabase.rpc('claim_vault_winner', {
    p_event_id: eventId,
    p_task_id: taskId,
    p_payload: payload || {}
  });

  if (error) throw new Error(handleServiceError(error, 'Erro ao reivindicar vitória.'));
  return data;
}

/**
 * Envia o progresso ou a conclusão de uma tarefa do Cofre para validação.
 */
export async function submitVaultTask(eventId: string, taskId: string, payload?: Record<string, unknown>) {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  // RPC 'submit_vault_task' gerencia as regras de negócio de submissão
  const { data, error } = await supabase.rpc('submit_vault_task', {
    p_event_id: eventId,
    p_task_id: taskId,
    p_payload: payload || {}
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

/**
 * (Admin/System) Valida se uma submissão de tarefa é legítima.
 */
export async function validateVaultSubmission(submissionId: string, isValid: boolean) {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const { data, error } = await supabase.rpc('validate_vault_submission', {
    p_submission_id: submissionId,
    p_is_valid: isValid
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

/**
 * Busca o registro do vencedor de um evento encerrado.
 */
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

