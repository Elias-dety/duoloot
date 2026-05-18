import React, { useCallback, useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Avatar, Badge, Button, Card } from '@/components/atoms';
import { ConnectionChatDrawer } from '@/features/messages/components/ConnectionChatDrawer';
import { usePlayerPresence } from '@/hooks/usePlayerPresence';
import { supabase } from '@/lib/supabase';
import { getMyConnectionsWithUnread, markConnectionMessagesAsRead, PlayerConnection } from '@/services';
import { isPlayerOnline } from '@/utils/presence';

export const MyConnectionsPanel: React.FC = () => {
  const { onlineUserIds } = usePlayerPresence();
  const [connections, setConnections] = useState<PlayerConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<{ id: string; nickname: string } | null>(null);

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

  const handleOpenChat = async (connection: PlayerConnection) => {
    setSelectedChat({ id: connection.connection_id, nickname: connection.nickname });
    if (connection.unread_count > 0) {
      try {
        await markConnectionMessagesAsRead(connection.connection_id);
        void fetchConnections({ silent: true });
      } catch (err) {
        console.error('Error marking as read:', err);
      }
    }
  };

  useEffect(() => {
    void fetchConnections();

    const connChannel = supabase
      .channel('my-connections-realtime-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'player_connections' }, () => {
        void fetchConnections({ silent: true });
      })
      .subscribe();

    const msgChannel = supabase
      .channel('chat-notifications-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'connection_messages' }, () => {
        void fetchConnections({ silent: true });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(connChannel);
      supabase.removeChannel(msgChannel);
    };
  }, [fetchConnections]);

  if (isLoading && connections.length === 0) {
    return (
      <Card className="animate-pulse border-white/5 bg-white/[0.02] p-6">
        <div className="mb-6 h-4 w-40 rounded bg-white/10" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="h-28 rounded bg-white/10" />
          <div className="h-28 rounded bg-white/10" />
          <div className="h-28 rounded bg-white/10" />
        </div>
      </Card>
    );
  }

  if (connections.length === 0 && !isLoading) {
    return (
      <Card className="flex flex-col items-center justify-center border-dashed border-white/10 bg-transparent p-8 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-white/5">
          <span className="text-xl text-[var(--dl-tactical-muted)]">◎</span>
        </div>
        <h4 className="font-['Rajdhani'] text-sm font-bold uppercase tracking-widest text-[var(--dl-tactical-muted)]">
          Nenhum duo conectado ainda
        </h4>
        <p className="mt-2 max-w-[240px] text-[10px] uppercase text-[var(--dl-tactical-muted)]/60">
          Aceite convites ou envie propostas no lobby para formar seu esquadrão.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 rounded-full bg-[var(--dl-tactical-purple)] shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
          <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-white">
            Esquadrão ativo // Meus duos
          </h3>
        </div>
        <Badge variant="premium" className="text-[9px]">{connections.length} integrantes</Badge>
      </div>

      {error && (
        <div className="mb-2 border border-[var(--dl-tactical-red)]/20 bg-[var(--dl-tactical-red)]/10 p-3 [clip-path:var(--dl-cut-button)]">
          <p className="text-center text-[10px] font-bold uppercase text-[var(--dl-tactical-red)]">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {connections.map((connection) => (
          <Card key={connection.connection_id} className="relative overflow-hidden border-white/10 bg-white/[0.03] p-4 transition-all hover:border-[var(--dl-tactical-purple)]/30">
            <div className="absolute right-0 top-0 flex flex-col items-end gap-1.5 p-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[7px] font-bold uppercase tracking-widest text-[var(--dl-tactical-muted)]">
                  {isPlayerOnline(connection.player_id, onlineUserIds) ? 'ONLINE' : 'OFFLINE'}
                </span>
                <div className={`h-1.5 w-1.5 rounded-full ${
                  isPlayerOnline(connection.player_id, onlineUserIds)
                    ? 'bg-[var(--dl-tactical-green)] shadow-[0_0_8px_rgba(56,242,139,0.5)]'
                    : 'bg-white/20'
                }`} />
              </div>
              {connection.unread_count > 0 && (
                <Badge variant="premium" className="animate-pulse border-none bg-[var(--dl-tactical-red)] px-1.5 py-0.5 text-[8px]">
                  {connection.unread_count} novas
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Avatar src={connection.avatar_url || undefined} fallback={connection.nickname} size="md" />
              <div className="min-w-0">
                <h4 className="truncate font-['Rajdhani'] text-md font-bold leading-none text-white">{connection.nickname}</h4>
                <p className="mt-1 truncate text-[9px] uppercase tracking-wider text-[var(--dl-tactical-muted)]">
                  {connection.name}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
              <div>
                <span className="mb-0.5 block text-[8px] font-bold uppercase text-[var(--dl-tactical-muted)]">Trust Score</span>
                <span className="text-[12px] font-black text-[var(--dl-tactical-green)]">{connection.trust_score}</span>
              </div>
              <div className="text-right">
                <span className="mb-0.5 block text-[8px] font-bold uppercase text-[var(--dl-tactical-muted)]">Conectado</span>
                <span className="text-[9px] uppercase text-white/60">
                  {formatDistanceToNow(new Date(connection.created_at), { addSuffix: false, locale: ptBR })}
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="mt-4 w-full border border-white/20 text-[10px] font-bold uppercase tracking-widest hover:border-[var(--dl-tactical-purple)]"
              onClick={() => handleOpenChat(connection)}
            >
              Abrir canal de chat
            </Button>
          </Card>
        ))}
      </div>

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
