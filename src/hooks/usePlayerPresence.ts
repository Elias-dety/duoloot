import { useEffect, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getOnlinePresenceChannel, setCurrentUserStatus, subscribeToPresence } from '@/services';

type PresenceState = Record<string, Array<Record<string, unknown>>>;

let activeChannel: RealtimeChannel | null = null;
let activeUnsubscribe: (() => void) | null = null;
let currentUserId: string | null = null;
let referenceCount = 0;

const presenceListeners = new Set<(state: PresenceState) => void>();
let currentPresenceState: PresenceState = {};

export function usePlayerPresence() {
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const [presenceState, setPresenceState] = useState<PresenceState>({});
  const [isPresenceReady, setIsPresenceReady] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;

    const handlePresenceUpdate = (state: PresenceState) => {
      if (!isMounted) return;
      setPresenceState(state);
      setOnlineUserIds(Object.keys(state));
      setIsPresenceReady(true);
    };

    const initialize = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error || !user || !isMounted) return;

        referenceCount++;
        presenceListeners.add(handlePresenceUpdate);

        if (activeChannel) {
          handlePresenceUpdate(currentPresenceState);
          return;
        }

        currentUserId = user.id;
        await setCurrentUserStatus('online');

        const channel = getOnlinePresenceChannel(user.id);
        activeChannel = channel;

        const { unsubscribe } = subscribeToPresence(channel, user.id, {}, {
          onSync: (state) => {
            currentPresenceState = state;
            presenceListeners.forEach((listener) => listener(state));
          },
        });

        activeUnsubscribe = unsubscribe;
      } catch (error) {
        console.error('[Presence Hook] Erro ao configurar presença:', error);
      }
    };

    void initialize();

    return () => {
      isMounted = false;
      referenceCount--;
      presenceListeners.delete(handlePresenceUpdate);

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
          void setCurrentUserStatus('offline').catch((error) => {
            console.error('[Presence Hook] Erro ao definir status offline:', error);
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
