import React, { useCallback, useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/atoms';
import { supabase } from '@/lib/supabase';
import {
  ConnectionMessage,
  getConnectionMessages,
  markConnectionMessagesAsRead,
  sendConnectionMessage,
} from '@/services';

interface ConnectionChatDrawerProps {
  connectionId: string;
  playerNickname: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectionChatDrawer: React.FC<ConnectionChatDrawerProps> = ({
  connectionId,
  playerNickname,
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ConnectionMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const fetchMessages = useCallback(
    async (silent = false) => {
      try {
        if (!silent) setIsLoading(true);
        const data = await getConnectionMessages(connectionId);
        setMessages(data);
      } catch (error: unknown) {
        console.error('Error loading messages:', error);
        if (!silent) setError('Falha ao carregar histórico de chat.');
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [connectionId]
  );

  const handleSendMessage = useCallback(
    async (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();

      const body = newMessage.trim();
      if (!body || isSending) return;

      try {
        setIsSending(true);
        const result = await sendConnectionMessage(connectionId, body);
        if (result.success) {
          setNewMessage('');
          await fetchMessages(true);
        } else {
          setError(result.message);
        }
      } catch {
        setError('Erro ao enviar mensagem.');
      } finally {
        setIsSending(false);
      }
    },
    [connectionId, fetchMessages, isSending, newMessage]
  );

  useEffect(() => {
    if (!isOpen) return;

    void supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id || null);
    });

    void fetchMessages();

    const channel = supabase
      .channel(`chat:${connectionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'connection_messages',
          filter: `connection_id=eq.${connectionId}`,
        },
        async () => {
          await fetchMessages(true);
          try {
            await markConnectionMessagesAsRead(connectionId);
          } catch (error) {
            console.error('Erro ao marcar mensagens em tempo real:', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [connectionId, fetchMessages, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <Card className="relative flex h-full w-full max-w-[400px] flex-col rounded-none border-l border-white/10 bg-[#0a0a0b] shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-[var(--dl-tactical-green)] shadow-[0_0_8px_rgba(56,242,139,0.5)]" />
            <h3 className="font-['Rajdhani'] text-lg font-bold uppercase tracking-wider text-white">Chat // {playerNickname}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded border border-white/10 text-white/50 transition-colors hover:bg-white/5"
          >
            ✕
          </button>
        </div>

        <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-4 scrollbar-thumb-white/10">
          {isLoading && messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-3 opacity-50">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--dl-tactical-purple)] border-t-transparent" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">Sincronizando...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center opacity-40">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-white/20 text-xl">💬</div>
              <p className="text-[10px] font-bold uppercase leading-relaxed tracking-widest">
                Nenhuma mensagem detectada.
                <br />
                Inicie a transmissão de dados.
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const isMine = message.sender_id === currentUserId;
              return (
                <div key={message.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] rounded p-3 text-sm ${
                      isMine
                        ? 'border border-[var(--dl-tactical-purple)]/30 bg-[var(--dl-tactical-purple)]/20 text-white [clip-path:polygon(0_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%)]'
                        : 'border border-white/10 bg-white/5 text-white/90 [clip-path:polygon(8px_0,100%_0,100%_100%,0_100%,0_8px)]'
                    }`}
                  >
                    {message.body}
                  </div>
                  <span className="mt-1 px-1 text-[9px] font-bold uppercase text-white/30">
                    {format(new Date(message.created_at), 'HH:mm')}
                  </span>
                </div>
              );
            })
          )}

          {error && (
            <div className="rounded border border-[var(--dl-tactical-red)]/20 bg-[var(--dl-tactical-red)]/10 p-2 text-center">
              <span className="text-[9px] font-bold uppercase text-[var(--dl-tactical-red)]">{error}</span>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 bg-white/[0.02] p-4">
          <form onSubmit={handleSendMessage} className="relative">
            <textarea
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value.slice(0, 1000))}
              placeholder="Digite sua mensagem tática..."
              rows={2}
              className="w-full resize-none rounded border border-white/10 bg-black/40 p-3 pr-12 text-sm text-white transition-colors placeholder:text-white/20 focus:border-[var(--dl-tactical-purple)]/50 focus:outline-none"
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void handleSendMessage();
                }
              }}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded bg-[var(--dl-tactical-purple)] text-white transition-opacity hover:opacity-90 disabled:grayscale disabled:opacity-20"
            >
              <span className="text-xs">➤</span>
            </button>
          </form>
          <div className="mt-2 flex justify-between">
            <span className="text-[8px] font-bold uppercase tracking-widest text-white/20">Conexão Encriptada // Ponta-a-ponta</span>
            <span className={`text-[8px] font-bold ${newMessage.length > 900 ? 'text-[var(--dl-tactical-red)]' : 'text-white/20'}`}>
              {newMessage.length}/1000
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
