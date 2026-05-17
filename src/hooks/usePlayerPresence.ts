import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { 
  setCurrentUserStatus, 
  getOnlinePresenceChannel, 
  subscribeToPresence 
} from '@/services';

// Instâncias globais de singleton para gerenciar o canal WebSocket de presença único
let activeChannel: any = null;
let activeUnsubscribe: (() => void) | null = null;
let currentUserId: string | null = null;
let referenceCount = 0;

const presenceListeners = new Set<(state: Record<string, any>) => void>();
let currentPresenceState: Record<string, any> = {};

/**
 * Hook customizado para monitoramento de presença online de jogadores em tempo real.
 * Utiliza o Supabase Presence para status dinâmico e atualiza profiles.status no banco.
 * Garante uma conexão única e previne canais duplicados.
 */
export function usePlayerPresence() {
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const [presenceState, setPresenceState] = useState<Record<string, any>>({});
  const [isPresenceReady, setIsPresenceReady] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;

    // Função de atualização para esta instância do hook
    const handlePresenceUpdate = (state: Record<string, any>) => {
      if (!isMounted) return;
      setPresenceState(state);
      setOnlineUserIds(Object.keys(state));
      setIsPresenceReady(true);
    };

    const initialize = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) return;

        if (!isMounted) return;

        // Incrementa o número de hooks ativos
        referenceCount++;
        presenceListeners.add(handlePresenceUpdate);

        // Se o canal global de presença já estiver ativo, herda o estado imediatamente
        if (activeChannel) {
          handlePresenceUpdate(currentPresenceState);
          return;
        }

        // Primeira inicialização do canal global
        currentUserId = user.id;
        
        // Define o status persistido no banco de dados como online
        await setCurrentUserStatus('online');

        // Cria o canal global de presença
        const channel = getOnlinePresenceChannel(user.id);
        activeChannel = channel;

        // Se inscreve no canal de presença e ativa o rastreamento (track)
        const { unsubscribe } = subscribeToPresence(channel, user.id, {}, {
          onSync: (state) => {
            currentPresenceState = state;
            presenceListeners.forEach((listener) => listener(state));
          },
        });

        activeUnsubscribe = unsubscribe;
      } catch (err) {
        console.error('[Presence Hook] Erro ao configurar presença:', err);
      }
    };

    initialize();

    return () => {
      isMounted = false;
      referenceCount--;
      presenceListeners.delete(handlePresenceUpdate);

      // Limpeza completa quando todos os componentes desmontarem
      if (referenceCount <= 0) {
        if (activeUnsubscribe) {
          activeUnsubscribe();
          activeUnsubscribe = null;
        }
        activeChannel = null;
        presenceListeners.clear();
        currentPresenceState = {};

        if (currentUserId) {
          currentUserId = null;
          setCurrentUserStatus('offline').catch((err) => {
            console.error('[Presence Hook] Erro ao definir status offline:', err);
          });
        }
      }
    };
  }, []);

  return {
    onlineUserIds,
    presenceState,
    isPresenceReady,
  };
}
