import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Função utilitária para centralizar o tratamento de erros do serviço de convites.
 * Traduz erros técnicos do Supabase/PostgreSQL para mensagens amigáveis ao usuário.
 */
const handleServiceError = (error: any, fallbackMessage: string) => {
  console.error(error);
  // Verifica se o Supabase foi inicializado corretamente
  if (!isSupabaseConfigured) return 'Configuração do Supabase ausente.';
  // Erros comuns de autenticação e sessão
  if (error?.message?.includes('JWT')) return 'Sua sessão expirou. Entre novamente.';
  if (error?.message?.includes('authenticated')) return 'Entre na sua conta para continuar.';
  // Erro de função RPC não encontrada no banco
  if (error?.code === 'PGRST202') return 'Módulo ainda não configurado no banco.';
  return error?.message || fallbackMessage;
};

// Estrutura padrão de resposta para operações de convite
export interface InviteResponse {
  success: boolean;  // Indica se a operação foi bem-sucedida
  message: string;  // Mensagem explicativa (sucesso ou erro)
  invite_id?: string; // ID do convite gerado (opcional)
  status?: string;    // Status atual do convite (opcional)
}

/**
 * Envia um convite de amizade/Duo para outro jogador.
 * @param receiverId ID do jogador que receberá o convite
 * @param message Mensagem opcional de saudação
 */
export const sendPlayerInvite = async (receiverId: string, message?: string): Promise<InviteResponse> => {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  // Obtém o usuário logado para validar a autoria do convite
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Entre na sua conta para enviar convites.');

  // Chama a RPC que valida as regras de negócio (ex: não convidar a si mesmo, não duplicar convites)
  const { data, error } = await supabase.rpc('send_player_invite', {
    p_receiver_id: receiverId,
    p_message: message || null
  });

  if (error) throw new Error(handleServiceError(error, 'Erro ao enviar convite.'));
  return data as InviteResponse;
};

/**
 * Responde a um convite pendente (aceitar ou recusar).
 * @param inviteId ID do convite a ser respondido
 * @param status Novo status: 'accepted' ou 'declined'
 */
export const respondPlayerInvite = async (inviteId: string, status: 'accepted' | 'declined'): Promise<InviteResponse> => {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  // Chama a RPC que processa a resposta e cria o vínculo de conexão se aceito
  const { data, error } = await supabase.rpc('respond_player_invite', {
    p_invite_id: inviteId,
    p_status: status
  });

  if (error) throw new Error(handleServiceError(error, 'Erro ao responder convite.'));
  return data as InviteResponse;
};

/**
 * Recupera a lista de convites pendentes recebidos pelo usuário atual.
 * Inclui os dados básicos do remetente para exibição na UI.
 */
export const getMyPendingInvites = async () => {
  if (!isSupabaseConfigured) return [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Consulta direta à tabela com join lateral para pegar dados do perfil do remetente (sender)
  const { data, error } = await supabase
    .from('player_invites')
    .select(`
      *,
      sender:profiles!player_invites_sender_id_fkey(id, name, nickname, avatar_url, trust_score)
    `)
    .eq('receiver_id', user.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw new Error(handleServiceError(error, 'Erro ao buscar convites.'));
  return data;
};

