import { supabase } from '@/lib/supabase';

// Interface que define a estrutura de uma conexão entre jogadores (amizades/duos)
export interface PlayerConnection {
  connection_id: string;   // ID único da conexão
  player_id: string;       // ID do jogador conectado
  name: string;            // Nome real ou de exibição do jogador
  nickname: string;        // Nickname (Riot ID ou similar)
  avatar_url: string | null; // URL da imagem de perfil
  trust_score: number;     // Pontuação de confiança do jogador no sistema
  status: 'active' | 'blocked' | 'removed'; // Estado atual do vínculo
  created_at: string;      // Data de criação da conexão
  unread_count: number;    // Quantidade de mensagens não lidas nesta conversa
}



/**
 * Busca todas as conexões ativas integrando a contagem de mensagens não lidas.
 * Esta função é útil para exibir badges de notificação na interface de chat.
 */
export const getMyConnectionsWithUnread = async (): Promise<PlayerConnection[]> => {
  // Chama a função SQL otimizada que já calcula os não lidos por conexão
  const { data, error } = await supabase.rpc('get_my_connections_with_unread');
  
  if (error) {
    console.error('Error fetching connections with unread:', error);
    throw error;
  }
  
  return data || [];
};

/**
 * Marca todas as mensagens de uma conexão específica como lidas.
 * Deve ser chamada sempre que o usuário abrir a janela de chat com aquele Duo.
 */
export const markConnectionMessagesAsRead = async (connectionId: string) => {
  // Passa o ID da conexão para a função de atualização no banco de dados
  const { data, error } = await supabase.rpc('mark_connection_messages_as_read', {
    p_connection_id: connectionId
  });

  if (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }

  // Retorna o resultado da operação (geralmente boolean ou void)
  return data;
};

