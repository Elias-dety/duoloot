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


