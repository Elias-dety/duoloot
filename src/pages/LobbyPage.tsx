import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LobbyTemplate } from '@/templates/LobbyTemplate';
import { Lobby } from '@/schemas/lobby.schema';
import { getOpenLobbies, createLobby, joinLobby, leaveLobby, getMyJoinedLobbyIds } from '@/services/lobbies.service';
import type { CreateLobbyPayload } from '@/services/lobbies.service';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/features/auth/useAuth';
import { ROUTES } from '@/constants/routes';
import { isGameProfileComplete } from '@/services/onboarding.service';
import type { PlayerGameProfile } from '@/services/auth.service';
import { LobbyCreateModal } from '@/features/lobby/components/LobbyCreateModal';
import logger from '@/lib/logger';

export default function LobbyPage() {
  const { isAuthenticated, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [joiningLobbyId, setJoiningLobbyId] = useState<string | null>(null);
  const [leavingLobbyId, setLeavingLobbyId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [joinedLobbyIds, setJoinedLobbyIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setErrorMessage('Configuração do Supabase ausente.');
      setIsLoading(false);
    }
  }, []);

  const syncJoinedLobbyIds = useCallback(async () => {
    if (!isSupabaseConfigured || !isAuthenticated) {
      setJoinedLobbyIds([]);
      return [];
    }

    const ids = await getMyJoinedLobbyIds();
    setJoinedLobbyIds(ids);
    return ids;
  }, [isAuthenticated]);

  const fetchLobbies = useCallback(async (options?: { silent?: boolean }) => {
    if (!isSupabaseConfigured) return;

    try {
      if (!options?.silent) {
        setIsLoading(true);
      }
      setIsError(false);
      const [data] = await Promise.all([
        getOpenLobbies(),
        syncJoinedLobbyIds(),
      ]);
      setLobbies(data);
    } catch (error) {
      console.error('Error fetching lobbies:', error);
      setIsError(true);
    } finally {
      if (!options?.silent) {
        setIsLoading(false);
      }
    }
  }, [syncJoinedLobbyIds]);

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

  const requireReadyProfile = () => {
    if (!isAuthenticated) {
      logger.info('Operador não autenticado para criar lobby. Redirecionando para login.');
      navigate(ROUTES.LOGIN, { state: { from: location } });
      return false;
    }

    if (!profile || !isGameProfileComplete(profile)) {
      setErrorMessage('Complete seu perfil gamer antes de criar um lobby.');
      setTimeout(() => {
        navigate(ROUTES.ONBOARDING);
      }, 1500);
      return false;
    }

    return true;
  };

  const buildDefaultLobbyPayload = (): CreateLobbyPayload => {
    const gp = (profile?.game_profile || {}) as PlayerGameProfile;

    return {
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
        bio: gp.bio,
        creatorPosition: gp.mainRole || 'flex',
        creatorPositionLabel: gp.mainRole || 'Flex',
        requiredPositions: ['duelista', 'sentinela'],
        requiredPositionLabels: ['Duelista', 'Sentinela'],
        maxReputationAllowed: 100,
      },
    };
  };

  const handleOpenCreateLobby = () => {
    if (!requireReadyProfile()) return;
    setErrorMessage(null);
    setStatusMessage(null);
    setIsCreateModalOpen(true);
  };

  const handleCreateLobby = async (payload: CreateLobbyPayload) => {
    if (!requireReadyProfile()) return;

    try {
      setIsCreating(true);
      setErrorMessage(null);
      setStatusMessage(null);
      await createLobby(payload);
      await fetchLobbies();
      setStatusMessage('Lobby criado com sucesso.');
      setIsCreateModalOpen(false);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Erro ao criar lobby.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleQuickCreateLobby = async () => {
    await handleCreateLobby(buildDefaultLobbyPayload());
  };

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
      await syncJoinedLobbyIds();
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
      await syncJoinedLobbyIds();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Erro ao sair do lobby.');
    } finally {
      setLeavingLobbyId(null);
    }
  };

  const gp = (profile?.game_profile || {}) as PlayerGameProfile;

  return (
    <>
      <LobbyTemplate 
        lobbies={lobbies} 
        isLoading={isLoading} 
        isError={isError}
        onJoinLobby={handleJoinLobby}
        onLeaveLobby={handleLeaveLobby}
        onCreateTestLobby={handleQuickCreateLobby}
        onConfigureLobby={handleOpenCreateLobby}
        isCreating={isCreating}
        joiningLobbyId={joiningLobbyId}
        leavingLobbyId={leavingLobbyId}
        errorMessage={errorMessage}
        statusMessage={statusMessage}
        joinedLobbyIds={joinedLobbyIds}
        currentUserId={profile?.id}
      />

      <LobbyCreateModal
        isOpen={isCreateModalOpen}
        isCreating={isCreating}
        profileGameProfile={gp}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateLobby}
      />
    </>
  );
}
