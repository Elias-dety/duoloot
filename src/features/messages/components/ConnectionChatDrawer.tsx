import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getConnectionMessages, sendConnectionMessage, ConnectionMessage } from '@/services';
import { supabase } from '@/lib/supabase';
import { Card, Avatar, Button } from '@/components/atoms';
import { format } from 'date-fns';

// Propriedades do componente de Drawer (Gaveta) de Chat
interface ConnectionChatDrawerProps {
  connectionId: string;    // ID único da conexão entre os dois jogadores
  playerNickname: string;  // Nickname do destinatário para exibição no cabeçalho
  isOpen: boolean;         // Controla a visibilidade da gaveta
  onClose: () => void;     // Callback para fechar a gaveta
}

/**
 * Componente ConnectionChatDrawer: Interface de chat em tempo real.
 * Exibe o histórico de mensagens e permite o envio de novas mensagens criptografadas.
 */
export const ConnectionChatDrawer: React.FC<ConnectionChatDrawerProps> = ({
  connectionId,
  playerNickname,
  isOpen,
  onClose
}) => {
  // Estados para gerenciamento de mensagens, carregamento e erros
  const [messages, setMessages] = useState<ConnectionMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Referência para o container de scroll para manter o chat sempre no final
  const scrollRef = useRef<HTMLDivElement>(null);

  /**
   * Faz o scroll automático para o final da lista de mensagens.
   */
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  /**
   * Busca as mensagens do backend via serviço.
   * @param silent Se true, não exibe o spinner de carregamento (útil para atualizações silenciosas).
   */
  const fetchMessages = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      const data = await getConnectionMessages(connectionId);
      setMessages(data);
    } catch (err: any) {
      console.error('Error loading messages:', err);
      if (!silent) setError('Falha ao carregar histórico de chat.');
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [connectionId]);

  /**
   * Efeito principal: Inicialização do chat e inscrição Realtime.
   */
  useEffect(() => {
    if (!isOpen) return;

    // Obtém o ID do usuário atual para diferenciar mensagens enviadas/recebidas
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id || null);
    });

    // Carga inicial do histórico
    fetchMessages();

    // Inscrição Realtime: Escuta novas inserções na tabela 'connection_messages'
    // filtradas especificamente por esta conexão para otimizar o tráfego.
    const channel = supabase
      .channel(`chat:${connectionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'connection_messages',
          filter: `connection_id=eq.${connectionId}`
        },
        () => {
          // Quando uma nova mensagem é detectada, recarrega a lista
          fetchMessages(true);
        }
      )
      .subscribe();

    // Cleanup: Remove a inscrição ao fechar o chat ou mudar de conexão
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, connectionId, fetchMessages]);

  /**
   * Scroll automático sempre que o array de mensagens mudar.
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Processa o envio da mensagem ao pressionar o botão ou Enter.
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = newMessage.trim();
    if (!body || isSending) return;

    try {
      setIsSending(true);
      const result = await sendConnectionMessage(connectionId, body);
      if (result.success) {
        setNewMessage(''); // Limpa o campo de texto
        fetchMessages(true); // Atualiza a lista local
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Erro ao enviar mensagem.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Camada de fundo (Backdrop) com desfoque tático */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Painel lateral do Chat (Estilo Gaveta/Drawer) */}
      <Card className="relative w-full max-w-[400px] h-full rounded-none border-l border-white/10 bg-[#0a0a0b] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Cabeçalho do Chat */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[var(--dl-tactical-green)] shadow-[0_0_8px_rgba(56,242,139,0.5)]" />
            <h3 className="font-bold font-['Rajdhani'] text-lg uppercase tracking-wider text-white">
              Chat // {playerNickname}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded border border-white/10 hover:bg-white/5 transition-colors text-white/50"
          >
            ✕
          </button>
        </div>

        {/* Lista de Mensagens com Scroll Customizado */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10"
        >
          {isLoading && messages.length === 0 ? (
            // Feedback de sincronização inicial
            <div className="flex flex-col items-center justify-center h-full space-y-3 opacity-50">
               <div className="w-6 h-6 border-2 border-[var(--dl-tactical-purple)] border-t-transparent rounded-full animate-spin" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-white">Sincronizando...</span>
            </div>
          ) : messages.length === 0 ? (
            // Estado vazio quando não há histórico
            <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
               <div className="w-12 h-12 rounded-full border border-dashed border-white/20 mb-4 flex items-center justify-center text-xl">💬</div>
               <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                 Nenhuma mensagem detectada.<br/>Inicie a transmissão de dados.
               </p>
            </div>
          ) : (
            // Mapeamento e renderização dos balões de chat
            messages.map((msg) => {
              const isMine = msg.sender_id === currentUserId;
              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] p-3 text-sm rounded ${
                    isMine 
                      ? 'bg-[var(--dl-tactical-purple)]/20 border border-[var(--dl-tactical-purple)]/30 text-white [clip-path:polygon(0_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%)]' 
                      : 'bg-white/5 border border-white/10 text-white/90 [clip-path:polygon(8px_0,100%_0,100%_100%,0_100%,0_8px)]'
                  }`}>
                    {msg.body}
                  </div>
                  <span className="text-[9px] uppercase font-bold text-white/30 mt-1 px-1">
                    {format(new Date(msg.created_at), 'HH:mm')}
                  </span>
                </div>
              );
            })
          )}
          {/* Exibição de erros pontuais (ex: falha no envio) */}
          {error && (
            <div className="p-2 bg-[var(--dl-tactical-red)]/10 border border-[var(--dl-tactical-red)]/20 rounded text-center">
              <span className="text-[9px] text-[var(--dl-tactical-red)] font-bold uppercase">{error}</span>
            </div>
          )}
        </div>

        {/* Área de Entrada de Texto (Input) */}
        <div className="p-4 bg-white/[0.02] border-t border-white/10">
          <form onSubmit={handleSendMessage} className="relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value.slice(0, 1000))}
              placeholder="Digite sua mensagem tática..."
              rows={2}
              className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--dl-tactical-purple)]/50 transition-colors resize-none pr-12"
              onKeyDown={(e) => {
                // Atalho: Enter envia, Shift+Enter pula linha
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e as any);
                }
              }}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="absolute right-2 bottom-2 w-8 h-8 flex items-center justify-center bg-[var(--dl-tactical-purple)] text-white rounded hover:opacity-90 transition-opacity disabled:opacity-20 disabled:grayscale"
            >
              <span className="text-xs">➤</span>
            </button>
          </form>
          {/* Metadados e Contador de Caracteres */}
          <div className="flex justify-between mt-2">
            <span className="text-[8px] uppercase font-bold text-white/20 tracking-widest">
              Conexão Encriptada // Ponta-a-ponta
            </span>
            <span className={`text-[8px] font-bold ${newMessage.length > 900 ? 'text-[var(--dl-tactical-red)]' : 'text-white/20'}`}>
              {newMessage.length}/1000
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

