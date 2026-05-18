import React, { useCallback, useEffect, useState } from 'react';
import { VaultTemplate } from '@/templates/VaultTemplate';
import { useAuth } from '@/features/auth/useAuth';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import {
  claimVaultMissionProgress,
  finalizeVaultEvent,
  getActiveVault,
  getMyVaultProgress,
  getMyVaultRank,
  getVaultLeaderboard,
  getVaultOverview,
  getVaultSeasons,
  getVaultWinners,
  joinVaultEvent,
} from '@/services/vault-progress.service';
import {
  MyVaultRank,
  VaultEvent,
  VaultLeaderboardEntry,
  VaultMission,
  VaultMissionProgress,
  VaultParticipant,
  VaultSeason,
  VaultWinner,
} from '@/features/vault/vault.schema';

export default function VaultPage() {
  const { session, user } = useAuth();
  const isLoggedIn = !!session;

  const [activeEvent, setActiveEvent] = useState<VaultEvent | null>(null);
  const [missions, setMissions] = useState<(VaultMission & { progress: VaultMissionProgress | null })[]>([]);
  const [participant, setParticipant] = useState<VaultParticipant | null>(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [leaderboard, setLeaderboard] = useState<VaultLeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<MyVaultRank | null>(null);
  const [winners, setWinners] = useState<VaultWinner[]>([]);
  const [seasons, setSeasons] = useState<VaultSeason[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [leaderboardError, setLeaderboardError] = useState('');
  const [historyError, setHistoryError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionTone, setActionTone] = useState<'success' | 'danger' | 'warning' | 'info'>('info');

  const fetchLeaderboardData = useCallback(
    async (eventId: string, options?: { silent?: boolean; forceMyRank?: boolean }) => {
      if (!options?.silent) {
        setIsLeaderboardLoading(true);
      }

      try {
        setLeaderboardError('');

        const leaderboardData = await getVaultLeaderboard(eventId, 20);
        setLeaderboard(leaderboardData);

        const shouldLoadMyRank = isLoggedIn && (options?.forceMyRank || !!participant);
        if (shouldLoadMyRank) {
          const myRankData = await getMyVaultRank(eventId);
          setMyRank(myRankData);
        } else {
          setMyRank(null);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao carregar ranking do Cofre.';
        setLeaderboardError(message);
        setLeaderboard([]);
        setMyRank(null);
      } finally {
        if (!options?.silent) {
          setIsLeaderboardLoading(false);
        }
      }
    },
    [isLoggedIn, participant]
  );

  const fetchHistoryData = useCallback(async (options?: { silent?: boolean; winnersEventId?: string | null }) => {
    if (!options?.silent) {
      setIsHistoryLoading(true);
    }

    try {
      setHistoryError('');
      const [winnersData, seasonsData] = await Promise.all([
        getVaultWinners(options?.winnersEventId ?? null, 12),
        getVaultSeasons(10),
      ]);

      setWinners(winnersData);
      setSeasons(seasonsData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar historico do Cofre.';
      setHistoryError(message);
      setWinners([]);
      setSeasons([]);
    } finally {
      if (!options?.silent) {
        setIsHistoryLoading(false);
      }
    }
  }, []);

  const fetchVaultData = useCallback(
    async (options?: { silent?: boolean }) => {
      try {
        if (!options?.silent) {
          setIsLoading(true);
        }

        if (!isSupabaseConfigured) {
          setErrorMessage('Configuracao do Supabase ausente.');
          setActiveEvent(null);
          setMissions([]);
          setParticipant(null);
          setLeaderboard([]);
          setMyRank(null);
          setWinners([]);
          setSeasons([]);
          return;
        }

        setErrorMessage('');

        const eventData = await getActiveVault();
        if (!eventData) {
          setActiveEvent(null);
          setMissions([]);
          setParticipant(null);
          setParticipantCount(0);
          setTotalPoints(0);
          setPercentage(0);
          setLeaderboard([]);
          setMyRank(null);
          setIsLeaderboardLoading(false);
          await fetchHistoryData({ silent: options?.silent, winnersEventId: null });
          return;
        }

        setActiveEvent(eventData);

        const overview = await getVaultOverview(eventData.id);
        if (overview) {
          setParticipantCount(overview.participantCount);
        }

        let participantData: VaultParticipant | null = null;

        if (isLoggedIn) {
          const progress = await getMyVaultProgress(eventData.id);
          if (progress) {
            participantData = progress.participant;
            setParticipant(progress.participant);
            setMissions(progress.missionProgress);
            setTotalPoints(progress.totalPoints);
            setPercentage(progress.percentage);
          } else if (overview) {
            setParticipant(null);
            setTotalPoints(0);
            setPercentage(0);
            setMissions(overview.missions.map((mission) => ({ ...mission, progress: null })));
          }
        } else if (overview) {
          setParticipant(null);
          setTotalPoints(0);
          setPercentage(0);
          setMissions(overview.missions.map((mission) => ({ ...mission, progress: null })));
        }

        await Promise.all([
          fetchLeaderboardData(eventData.id, {
            silent: options?.silent,
            forceMyRank: !!participantData,
          }),
          fetchHistoryData({ silent: options?.silent, winnersEventId: null }),
        ]);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao carregar Cofre.';
        setErrorMessage(message);
      } finally {
        if (!options?.silent) {
          setIsLoading(false);
        }
      }
    },
    [fetchHistoryData, fetchLeaderboardData, isLoggedIn]
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchVaultData();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchVaultData]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel('vault-realtime-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vault_events' }, () => {
        void fetchVaultData({ silent: true });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vault_participants' }, () => {
        void fetchVaultData({ silent: true });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vault_mission_progress' }, () => {
        void fetchVaultData({ silent: true });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vault_winners' }, () => {
        void fetchHistoryData({ silent: true, winnersEventId: null });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchHistoryData, fetchVaultData]);

  const handleJoinVault = async () => {
    if (!activeEvent) return;

    try {
      setIsJoining(true);
      const response = await joinVaultEvent(activeEvent.id);
      if (response.success) {
        await fetchVaultData({ silent: true });
        setActionMessage('Operacao do Cofre ativada.');
        setActionTone('success');
      } else {
        setActionMessage(response.message);
        setActionTone('danger');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao se inscrever.';
      setActionMessage(message);
      setActionTone('danger');
    } finally {
      setIsJoining(false);
    }
  };

  const handleClaimTask = async (taskId: string) => {
    if (!activeEvent) return;

    try {
      setSubmittingTaskId(taskId);
      const response = await claimVaultMissionProgress(taskId, 1);

      if (response.success) {
        await fetchVaultData({ silent: true });
        setActionMessage('Progresso registrado.');
        setActionTone('success');
      } else {
        setActionMessage(response.message);
        setActionTone('danger');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao registrar progresso.';
      setActionMessage(message);
      setActionTone('danger');
    } finally {
      setSubmittingTaskId(null);
    }
  };

  const handleFinalizeVaultEvent = async () => {
    if (!activeEvent) return;

    try {
      setIsFinalizing(true);
      const response = await finalizeVaultEvent(activeEvent.id, 3);

      if (response.success) {
        await fetchVaultData({ silent: true });
        setActionMessage(`Cofre finalizado. ${response.winnersCount} vencedores registrados.`);
        setActionTone('success');
      } else {
        setActionMessage(response.message);
        setActionTone('warning');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao finalizar o Cofre.';
      setActionMessage(message);
      setActionTone('danger');
    } finally {
      setIsFinalizing(false);
    }
  };

  return (
    <VaultTemplate
      event={activeEvent}
      missions={missions}
      participant={participant}
      participantCount={participantCount}
      totalPoints={totalPoints}
      percentage={percentage}
      leaderboard={leaderboard}
      myRank={myRank}
      winners={winners}
      seasons={seasons}
      isLoading={isLoading}
      isLeaderboardLoading={isLeaderboardLoading}
      isHistoryLoading={isHistoryLoading}
      isFinalizing={isFinalizing}
      errorMessage={errorMessage}
      leaderboardError={leaderboardError}
      historyError={historyError}
      actionMessage={actionMessage}
      actionTone={actionTone}
      onDismissActionMessage={() => setActionMessage(null)}
      isLoggedIn={isLoggedIn}
      currentUserId={user?.id ?? null}
      onJoinVault={handleJoinVault}
      onClaimTask={handleClaimTask}
      onFinalizeVaultEvent={handleFinalizeVaultEvent}
      showDevFinalizeButton={Boolean(import.meta.env.DEV && activeEvent?.status === 'active')}
      isJoining={isJoining}
      submittingTaskId={submittingTaskId}
    />
  );
}
