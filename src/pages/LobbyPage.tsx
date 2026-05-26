import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LobbyTemplate } from '@/templates/LobbyTemplate';
import { Lobby } from '@/schemas/lobby.schema';
import { getOpenLobbies, createLobby, joinLobby, leaveLobby } from '@/services/lobbies.service';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/features/auth/useAuth';
import { ROUTES } from '@/constants/routes';
import { isGameProfileComplete } from '@/services/onboarding.service';
import type { PlayerGameProfile } from '@/services/auth.service';
import logger from '@/lib/logger';

export default function LobbyPage() {
  const { isAuthenticated, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [joiningLobbyId, setJoiningLobbyId] = useState<string | null>(null);
  const [leavingLobbyId, setLeavingLobbyId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setErrorMessage('Configuração do Supabase ausente.');
      setIsLoading(false);
    }
  }, []);

  const fetchLobbies = useCallback(async (options?: { silent?: boolean }) => {
    if (!isSupabaseConfigured) return;

    try {
      if (!options?.silent) {
        setIsLoading(true);
      }
      setIsError(false);
      const data = await getOpenLobbies();
      setLobbies(data);
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
    if (!isSupabaseConfigured) return;

    fetchLobbies();

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
    if (!isAuthenticated) {
      logger.info('Operador não autenticado para criar lobby. Redirecionando para login.');
      navigate(ROUTES.LOGIN, { state: { from: location } });
      return;
    }

    if (!profile || !isGameProfileComplete(profile)) {
      setErrorMessage('Complete seu perfil gamer antes de criar um lobby.');
      setTimeout(() => {
        navigate(ROUTES.ONBOARDING);
      }, 1500);
      return;
    }

    try {
      setIsCreating(true);
      setErrorMessage(null);
      setStatusMessage(null);
      
      const gp = (profile.game_profile || {}) as PlayerGameProfile;
      const payload = {
        slots_total: 5,
        mode: gp.preferredModes?.[0] || 'competitivo',
        queue: gp.preferredModes?.[0] || 'ranked',
        min_rank: gp.currentRank || 'ferro',
        max_rank: gp.currentRank || 'radiante',
        metadata: {
          mainGame: gp.mainGame,
          riotId: gp.riotId,
          currentRank: gp.currentRank,
          mainRole: gp.mainRole,
          secondaryRole: gp.secondaryRole,
          playStyle: gp.playStyle,
          sessionFocus: gp.sessionFocus,
          availability: gp.availability,
          microphone: gp.microphone,
          region: gp.region,
          bio: gp.bio
        }
      };

      await createLobby(payload);
      await fetchLobbies();
      setStatusMessage('Lobby criado com sucesso.');
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Erro ao criar lobby.');
    } finally {
      setIsCreating(false);
    }
  };

  const [joinedLobbyIds, setJoinedLobbyIds] = useState<string[]>([]);

  const handleJoinLobby = async (lobbyId: string) => {
    if (!isAuthenticated) {
      logger.info('Operador não autenticado para entrar em lobby. Redirecionando para login.');
      navigate(ROUTES.LOGIN, { state: { from: location } });
      return;
    }

    if (!profile || !isGameProfileComplete(profile)) {
      setErrorMessage('Complete seu perfil gamer antes de entrar em um lobby.');
      setTimeout(() => {
        navigate(ROUTES.ONBOARDING);
      }, 1500);
      return;
    }

    const targetLobby = lobbies.find((l) => l.id === lobbyId);
    if (targetLobby) {
      if (targetLobby.status !== 'open' || targetLobby.slotsFilled >= targetLobby.slotsTotal) {
        setErrorMessage('Este lobby não está mais disponível.');
        return;
      }
    }

    try {
      setJoiningLobbyId(lobbyId);
      setErrorMessage(null);
      setStatusMessage(null);
      await joinLobby(lobbyId);
      setJoinedLobbyIds((prev) => Array.from(new Set([...prev, lobbyId])));
      setStatusMessage('Você entrou no lobby.');
      await fetchLobbies({ silent: true });
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Erro ao entrar no lobby.');
    } finally {
      setJoiningLobbyId(null);
    }
  };

  const handleLeaveLobby = async (lobbyId: string) => {
    if (!isAuthenticated) {
      logger.info('Operador não autenticado para sair de lobby. Redirecionando para login.');
      navigate(ROUTES.LOGIN, { state: { from: location } });
      return;
    }

    try {
      setLeavingLobbyId(lobbyId);
      setErrorMessage(null);
      setStatusMessage(null);
      const result = await leaveLobby(lobbyId);
      setJoinedLobbyIds((prev) => prev.filter((id) => id !== lobbyId));
      setStatusMessage(result.message || 'Você saiu do lobby.');
      await fetchLobbies({ silent: true });
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Erro ao sair do lobby.');
    } finally {
      setLeavingLobbyId(null);
    }
  };

  return (
    <LobbyTemplate 
      lobbies={lobbies} 
      isLoading={isLoading} 
      isError={isError}
      onJoinLobby={handleJoinLobby}
      onLeaveLobby={handleLeaveLobby}
      onCreateTestLobby={handleCreateTestLobby}
      isCreating={isCreating}
      joiningLobbyId={joiningLobbyId}
      leavingLobbyId={leavingLobbyId}
      errorMessage={errorMessage}
      statusMessage={statusMessage}
      joinedLobbyIds={joinedLobbyIds}
      currentUserId={profile?.id}
    />
  );
}
