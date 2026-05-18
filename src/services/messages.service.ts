import { supabase } from '@/lib/supabase';

export interface ConnectionMessage {
  id: string;
  connection_id: string;
  sender_id: string;
  sender_nickname: string;
  sender_avatar_url: string | null;
  body: string;
  created_at: string;
  read_at: string | null;
}

interface SendConnectionMessageResponse {
  success: boolean;
  message: string;
  message_id?: string;
}

export const getConnectionMessages = async (
  connectionId: string,
  limit: number = 50
): Promise<ConnectionMessage[]> => {
  const { data, error } = await supabase.rpc('get_connection_messages', {
    p_connection_id: connectionId,
    p_limit: limit,
  });

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }

  return (data as ConnectionMessage[]) || [];
};

export const sendConnectionMessage = async (
  connectionId: string,
  body: string
): Promise<SendConnectionMessageResponse> => {
  const { data, error } = await supabase.rpc('send_connection_message', {
    p_connection_id: connectionId,
    p_body: body,
  });

  if (error) {
    console.error('Error sending message:', error);
    return { success: false, message: 'Erro tático: Falha no envio da mensagem.' };
  }

  return data as SendConnectionMessageResponse;
};
