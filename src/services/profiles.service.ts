import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Utilitário de tratamento de erros específico para o serviço de perfis.
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
 * Obtém os dados do perfil do usuário autenticado no momento.
 */
export async function getCurrentProfile() {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  // Recupera o objeto de usuário da sessão ativa do Supabase Auth
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Entre na sua conta para continuar.');

  // Busca o registro correspondente na tabela 'profiles' do banco de dados
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw new Error(handleServiceError(error, 'Perfil não encontrado.'));
  return data;
}

/**
 * Busca informações públicas de qualquer jogador através do seu ID.
 * @param playerId UUID do jogador
 */
export async function getProfileById(playerId: string) {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', playerId)
    .single();

  if (error) throw new Error(handleServiceError(error, 'Perfil não encontrado.'));
  return data;
}

/**
 * Atualiza os campos do perfil do usuário logado.
 * @param payload Objeto contendo os campos a serem alterados (ex: nome, avatar, bio)
 */
export async function updateCurrentProfile(payload: Record<string, unknown>) {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Entre na sua conta para continuar.');

  // Executa o update filtrando pelo ID do usuário da sessão para garantir segurança
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw new Error(handleServiceError(error, 'Erro ao atualizar perfil.'));
  return data;
}

