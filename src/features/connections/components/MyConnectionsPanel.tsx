import React, { useEffect, useState, useCallback } from 'react';
import { getMyConnectionsWithUnread, markConnectionMessagesAsRead, PlayerConnection } from '@/services';
import { Card, Avatar, Badge, Button } from '@/components/atoms';
import { ConnectionChatDrawer } from '@/features/messages/components/ConnectionChatDrawer';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';

/**
 * Componente MyConnectionsPanel: Painel que exibe a lista de amigos/duos do usuário.
 * Permite visualizar o status de conexão, contagem de mensagens não lidas e abrir o chat.
 */
export const MyConnectionsPanel: React.FC = () => {
  // Estados para dados, carregamento, erros e chat selecionado
  const [connections, setConnections] = useState<PlayerConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<{ id: string; nickname: string } | null>(null);

  /**
   * Busca as conexões do usuário integrando os dados de mensagens não lidas.
   */
  const fetchConnections = useCallback(async (options?: { silent?: boolean }) => {
    try {
      if (!options?.silent) setIsLoading(true);
      const data = await getMyConnectionsWithUnread();
      setConnections(data);
    } catch (err: unknown) {
      console.error('Error fetching connections:', err);
      if (!options?.silent) setError('Falha ao sincronizar duos.');
    } finally {
      if (!options?.silent) setIsLoading(false);
    }
  }, []);

  /**
   * Lógica para abrir a janela de chat.
   * Se houver mensagens não lidas, marca-as como lidas no banco de dados.
   */
  const handleOpenChat = async (conn: PlayerConnection) => {
    setSelectedChat({ id: conn.connection_id, nickname: conn.nickname });
    if (conn.unread_count > 0) {
      try {
        await markConnectionMessagesAsRead(conn.connection_id);
        // Atualiza a lista silenciosamente para remover o badge de notificação
        fetchConnections({ silent: true });
      } catch (err) {
        console.error('Error marking as read:', err);
      }
    }
  };

  /**
   * Monitoramento Realtime: Escuta mudanças em conexões e mensagens.
   */
  useEffect(() => {
    fetchConnections();

    // Inscrição para atualizações nas conexões (novos duos, bloqueios, remoções)
    const connChannel = supabase
      .channel('my-connections-realtime-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'player_connections' },
        () => fetchConnections({ silent: true })
      )
      .subscribe();

    // Inscrição para notificações de novas mensagens para atualizar os badges de 'unread'
    const msgChannel = supabase
      .channel('chat-notifications-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'connection_messages' },
        () => fetchConnections({ silent: true })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(connChannel);
      supabase.removeChannel(msgChannel);
    };
  }, [fetchConnections]);

  // Renderização do estado de carregamento (Skeleton/Pulse)
  if (isLoading && connections.length === 0) {
    return (
      <Card className="p-6 animate-pulse border-white/5 bg-white/[0.02]">
        <div className="h-4 w-40 bg-white/10 rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-20 bg-white/10 rounded" />
          <div className="h-20 bg-white/10 rounded" />
          <div className="h-20 bg-white/10 rounded" />
        </div>
      </Card>
    );
  }

  // Renderização para quando o usuário não possui conexões (Empty State)
  if (connections.length === 0 && !isLoading) {
    return (
      <Card className="p-8 border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full border border-white/5 bg-white/5 flex items-center justify-center mb-4">
          <span className="text-[var(--dl-tactical-muted)] text-xl">⚡</span>
        </div>
        <h4 className="text-[var(--dl-tactical-muted)] font-bold font-['Rajdhani'] uppercase tracking-widest text-sm">
          Nenhum duo conectado ainda
        </h4>
        <p className="text-[10px] text-[var(--dl-tactical-muted)]/60 mt-2 max-w-[200px] uppercase">
          Aceite convites ou envie propostas para formar seu esquadrão.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho do Painel */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
           <div className="h-4 w-1 bg-[var(--dl-tactical-purple)] rounded-full shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
           <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-white">
             Esquadrão Ativo // Meus Duos
           </h3>
        </div>
        <Badge variant="premium" className="text-[9px]">{connections.length} Integrantes</Badge>
      </div>

      {/* Alerta de erro de sincronização */}
      {error && (
        <div className="p-3 bg-[var(--dl-tactical-red)]/10 border border-[var(--dl-tactical-red)]/20 rounded mb-2 [clip-path:var(--dl-cut-button)]">
          <p className="text-[10px] text-[var(--dl-tactical-red)] font-bold uppercase text-center">{error}</p>
        </div>
      )}

      {/* Grid de Cards de Conexão */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {connections.map((conn) => (
          <Card key={conn.connection_id} className="relative p-4 bg-white/[0.03] border-white/10 hover:border-[var(--dl-tactical-purple)]/30 transition-all group overflow-hidden">
            {/* Indicadores de Status e Mensagens Não Lidas */}
            <div className="absolute top-0 right-0 p-2 flex flex-col items-end gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-[var(--dl-tactical-green)] shadow-[0_0_8px_rgba(56,242,139,0.5)]" />
               {conn.unread_count > 0 && (
                 <Badge variant="premium" className="text-[8px] bg-[var(--dl-tactical-red)] border-none animate-pulse px-1.5 py-0.5">
                   {conn.unread_count} NOVAS
                 </Badge>
               )}
            </div>
            
            {/* Info Básica do Jogador */}
            <div className="flex items-center gap-3">
              <Avatar src={conn.avatar_url || undefined} fallback={conn.nickname} size="md" />
              <div className="min-w-0">
                <h4 className="text-white font-bold font-['Rajdhani'] text-md leading-none truncate">{conn.nickname}</h4>
                <p className="text-[9px] text-[var(--dl-tactical-muted)] uppercase tracking-wider mt-1 truncate">
                   {conn.name}
                </p>
              </div>
            </div>

            {/* Rodapé do Card com Trust Score e Tempo de Conexão */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[8px] uppercase text-[var(--dl-tactical-muted)] block font-bold mb-0.5">Trust Score</span>
                <span className="text-[12px] font-black text-[var(--dl-tactical-green)]">{conn.trust_score}</span>
              </div>
              <div className="text-right">
                <span className="text-[8px] uppercase text-[var(--dl-tactical-muted)] block font-bold mb-0.5">Conectado</span>
                <span className="text-[9px] text-white/60 font-medium uppercase">
                  {formatDistanceToNow(new Date(conn.created_at), { addSuffix: false, locale: ptBR })}
                </span>
              </div>
            </div>

            {/* Overlay de hover com botão de ação (Abrir Chat) */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-[10px] font-bold uppercase tracking-widest border-white/20 hover:border-[var(--dl-tactical-purple)]"
                onClick={() => handleOpenChat(conn)}
              >
                Abrir Canal de Chat
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Componente de Chat (Gaveta) renderizado se houver seleção */}
      {selectedChat && (
        <ConnectionChatDrawer
          connectionId={selectedChat.id}
          playerNickname={selectedChat.nickname}
          isOpen={!!selectedChat}
          onClose={() => setSelectedChat(null)}
        />
      )}
    </div>
  );
};

