import { supabase } from '@/lib/supabase';

// Interface que define a estrutura de uma mensagem enviada entre Duos (conexões)
export interface ConnectionMessage {
  id: string;                // ID único da mensagem
  connection_id: string;     // ID da conexão à qual a mensagem pertence
  sender_id: string;         // ID do jogador que enviou a mensagem
  sender_nickname: string;   // Nickname do remetente para exibição rápida
  sender_avatar_url: string | null; // Avatar do remetente
  body: string;              // Conteúdo textual da mensagem
  created_at: string;        // Timestamp de criação
  read_at: string | null;    // Timestamp de quando a mensagem foi lida (null se não lida)
}

/**
 * Busca o histórico de mensagens de uma conexão específica.
 * Retorna as mensagens em ordem cronológica para montar o chat.
 * @param connectionId ID da conexão (vínculo entre dois jogadores)
 * @param limit Quantidade máxima de mensagens a serem recuperadas (default 50)
 */
export const getConnectionMessages = async (
  connectionId: string, 
  limit: number = 50
): Promise<ConnectionMessage[]> => {
  // Chama RPC no Supabase que já resolve os nomes e avatares dos remetentes
  const { data, error } = await supabase.rpc('get_connection_messages', {
    p_connection_id: connectionId,
    p_limit: limit
  });

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }

  return data || [];
};

/**
 * Envia uma nova mensagem de texto em uma conexão ativa.
 * @param connectionId ID da conexão de destino
 * @param body Texto da mensagem
 */
export const sendConnectionMessage = async (
  connectionId: string, 
  body: string
): Promise<{ success: boolean; message: string; message_id?: string }> => {
  // Chama RPC que valida se o remetente faz parte da conexão e insere o registro
  const { data, error } = await supabase.rpc('send_connection_message', {
    p_connection_id: connectionId,
    p_body: body
  });

  if (error) {
    console.error('Error sending message:', error);
    return { success: false, message: 'Erro tático: Falha no envio da mensagem.' };
  }

  // Retorna o objeto de resposta contendo o status e possivelmente o ID da nova mensagem
  return data as any;
};

