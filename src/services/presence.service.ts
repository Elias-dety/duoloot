import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export type PlayerStatus = 'online' | 'offline' | 'in-game';

/**
 * Atualiza o status de presença do usuário atual na tabela de perfis.
 * @param status Novo status do jogador ('online', 'offline' ou 'in-game')
 */
export const setCurrentUserStatus = async (status: PlayerStatus) => {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile status:', error);
    throw error;
  }

  return data;
};

/**
 * Cria e configura um canal de presença global para monitoramento em tempo real.
 * @param userId ID do usuário atual
 * @param metadata Metadados adicionais de presença
 */
export const getOnlinePresenceChannel = (
  userId: string
): RealtimeChannel => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado.');
  }

  return supabase.channel('global-player-presence', {
    config: {
      presence: {
        key: userId,
      },
    },
  });
};

interface PresenceCallbacks {
  onSync?: (state: Record<string, any>) => void;
  onJoin?: (key: string, currentPresences: any[], newPresences: any[]) => void;
  onLeave?: (key: string, currentPresences: any[], leftPresences: any[]) => void;
}

/**
 * Se inscreve nos eventos de presença de um canal e opcionalmente inicia o rastreamento (track).
 * @param channel Canal Supabase Realtime criado anteriormente
 * @param userId ID do usuário atual para rastreamento
 * @param metadata Metadados adicionais para o track
 * @param callbacks Funções de retorno para sincronização, entrada e saída
 */
export const subscribeToPresence = (
  channel: RealtimeChannel,
  userId: string,
  metadata?: Record<string, unknown>,
  callbacks?: PresenceCallbacks
) => {
  const { onSync, onJoin, onLeave } = callbacks || {};

  const sub = channel
    .on('presence', { event: 'sync' }, () => {
      if (onSync) onSync(channel.presenceState());
    })
    .on('presence', { event: 'join' }, ({ key, currentPresences, newPresences }: any) => {
      if (onJoin) onJoin(key, currentPresences, newPresences);
    })
    .on('presence', { event: 'leave' }, ({ key, currentPresences, leftPresences }: any) => {
      if (onLeave) onLeave(key, currentPresences, leftPresences);
    });

  // Realiza a inscrição e inicia o rastreamento (track) após a confirmação
  const activeChannel = sub.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      try {
        await channel.track({
          user_id: userId,
          status: 'online',
          online_at: new Date().toISOString(),
          ...metadata,
        });
      } catch (err) {
        console.error('Error tracking presence:', err);
      }
    }
  });

  const unsubscribe = () => {
    try {
      channel.untrack().catch((err) => console.error('Error untracking:', err));
    } catch (err) {
      // Ignorar se o canal já foi removido
    }
    supabase.removeChannel(activeChannel);
  };

  return {
    channel: activeChannel,
    unsubscribe,
  };
};
