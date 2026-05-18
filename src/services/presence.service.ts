import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export type PlayerStatus = 'online' | 'offline' | 'in-game';
export type PresenceState = Record<string, Array<Record<string, unknown>>>;

type PresenceChangePayload = {
  key: string;
  currentPresences: Array<Record<string, unknown>>;
  newPresences?: Array<Record<string, unknown>>;
  leftPresences?: Array<Record<string, unknown>>;
};

interface PresenceCallbacks {
  onSync?: (state: PresenceState) => void;
  onJoin?: (key: string, currentPresences: Array<Record<string, unknown>>, newPresences: Array<Record<string, unknown>>) => void;
  onLeave?: (key: string, currentPresences: Array<Record<string, unknown>>, leftPresences: Array<Record<string, unknown>>) => void;
}

export const setCurrentUserStatus = async (status: PlayerStatus) => {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
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

export const getOnlinePresenceChannel = (userId: string): RealtimeChannel => {
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

export const subscribeToPresence = (
  channel: RealtimeChannel,
  userId: string,
  metadata?: Record<string, unknown>,
  callbacks?: PresenceCallbacks
) => {
  const { onSync, onJoin, onLeave } = callbacks || {};

  const sub = channel
    .on('presence', { event: 'sync' }, () => {
      onSync?.(channel.presenceState() as PresenceState);
    })
    .on('presence', { event: 'join' }, (payload: PresenceChangePayload) => {
      onJoin?.(payload.key, payload.currentPresences, payload.newPresences || []);
    })
    .on('presence', { event: 'leave' }, (payload: PresenceChangePayload) => {
      onLeave?.(payload.key, payload.currentPresences, payload.leftPresences || []);
    });

  const activeChannel = sub.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      try {
        await channel.track({
          user_id: userId,
          status: 'online',
          online_at: new Date().toISOString(),
          ...metadata,
        });
      } catch (error) {
        console.error('Error tracking presence:', error);
      }
    }
  });

  const unsubscribe = () => {
    void channel.untrack().catch((error) => {
      console.error('Error untracking:', error);
    });
    supabase.removeChannel(activeChannel);
  };

  return {
    channel: activeChannel,
    unsubscribe,
  };
};
