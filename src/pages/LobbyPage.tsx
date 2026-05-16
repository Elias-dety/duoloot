import React, { useState, useEffect, useCallback } from 'react';
import { LobbyTemplate } from '@/templates/LobbyTemplate';
import { Lobby } from '@/schemas/lobby.schema';
import { getOpenLobbies, createLobby, joinLobby } from '@/services/lobbies.service';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function LobbyPage() {
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [joiningLobbyId, setJoiningLobbyId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setErrorMessage('Configuração do Supabase ausente.');
      setIsLoading(false);
    }
  }, []);

  const fetchLobbies = useCallback(async (options?: { silent?: boolean }) => {
    try {
      if (!options?.silent) {
        setIsLoading(true);
      }
      setIsError(false);
      const data = await getOpenLobbies();
      setLobbies(data as unknown as Lobby[]);
    } catch (error) {
      console.error('Error fetching lobbies:', error);
      setIsError(true);
    } finally {
      if (!options?.silent) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLobbies();

    // Configurar Realtime
    const channel = supabase
      .channel('lobby-realtime-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lobbies' },
        () => fetchLobbies({ silent: true })
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lobby_members' },
        () => fetchLobbies({ silent: true })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLobbies]);

  const handleCreateTestLobby = async () => {
    try {
      setIsCreating(true);
      setErrorMessage(null);
      
      const payload = {
        slots_total: 5,
        slots_filled: 1,
        mode: 'competitivo',
        queue: 'ranked',
        min_rank: 'platina',
        max_rank: 'imortal',
        status: 'open'
      };

      await createLobby(payload);
      await fetchLobbies();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Erro ao criar lobby.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinLobby = async (lobbyId: string) => {
    try {
      setJoiningLobbyId(lobbyId);
      setErrorMessage(null);
      await joinLobby(lobbyId);
      await fetchLobbies();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Erro ao entrar no lobby.');
    } finally {
      setJoiningLobbyId(null);
    }
  };

  return (
    <LobbyTemplate 
      lobbies={lobbies} 
      isLoading={isLoading} 
      isError={isError}
      onJoinLobby={handleJoinLobby}
      onCreateTestLobby={handleCreateTestLobby}
      isCreating={isCreating}
      joiningLobbyId={joiningLobbyId}
      errorMessage={errorMessage}
    />
  );
}
