import React from 'react';

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
import { VaultJoinPanel } from '@/features/vault/components/VaultJoinPanel';
import { VaultLeaderboard } from '@/features/vault/components/VaultLeaderboard';
import { VaultMissionCard } from '@/features/vault/components/VaultMissionCard';
import { VaultProgressPanel } from '@/features/vault/components/VaultProgressPanel';
import { VaultSeasonHistory } from '@/features/vault/components/VaultSeasonHistory';
import { VaultStatsPanel } from '@/features/vault/components/VaultStatsPanel';
import { VaultUserRankPanel } from '@/features/vault/components/VaultUserRankPanel';
import { VaultWinnersPanel } from '@/features/vault/components/VaultWinnersPanel';
import { Badge, Button, Card, ImagePlaceholder, SectionTitle } from '@/components/atoms';
import { LoadingState, EmptyState } from '@/components/molecules';
import { ASSETS } from '@/constants/assets';
import { useLanguage } from '@/i18n';

export interface VaultTemplateProps {
  event: VaultEvent | null;
  missions: (VaultMission & { progress: VaultMissionProgress | null })[];
  participant: VaultParticipant | null;
  participantCount: number;
  totalPoints: number;
  percentage: number;
  leaderboard: VaultLeaderboardEntry[];
  myRank: MyVaultRank | null;
  winners: VaultWinner[];
  seasons: VaultSeason[];
  isLoading: boolean;
  isLeaderboardLoading: boolean;
  isHistoryLoading: boolean;
  isFinalizing: boolean;
  errorMessage?: string;
  leaderboardError?: string;
  historyError?: string;
  actionMessage?: string | null;
  actionTone?: 'success' | 'danger' | 'warning' | 'info';
  onDismissActionMessage: () => void;
  isLoggedIn: boolean;
  currentUserId?: string | null;
  onJoinVault: () => void;
  onClaimTask: (taskId: string) => void;
  onFinalizeVaultEvent?: () => void;
  showDevFinalizeButton: boolean;
  isJoining: boolean;
  submittingTaskId: string | null;
}

export const VaultTemplate: React.FC<VaultTemplateProps> = ({
  event,
  missions,
  participant,
  participantCount,
  totalPoints,
  percentage,
  leaderboard,
  myRank,
  winners,
  seasons,
  isLoading,
  isLeaderboardLoading,
  isHistoryLoading,
  isFinalizing,
  errorMessage,
  leaderboardError,
  historyError,
  actionMessage,
  onDismissActionMessage,
  isLoggedIn,
  currentUserId,
  onJoinVault,
  onClaimTask,
  onFinalizeVaultEvent,
  showDevFinalizeButton,
  isJoining,
  submittingTaskId,
}) => {
  const { messages: copy } = useLanguage();

  if (isLoading) {
    return <LoadingState message={copy.vault.loading} />;
  }

  if (errorMessage && !event && seasons.length === 0 && winners.length === 0) {
    return (
      <EmptyState 
        icon="error"
        title={errorMessage}
        description={copy.vault.loadError}
      />
    );
  }

  const isParticipating = !!participant;
  const completedMissionsCount = missions.filter((mission) => mission.progress?.completed).length;

  return (
    <div className="mx-auto w-full max-w-[2560px] 3xl:px-12 4xl:px-24 space-y-6 px-3 pb-12 md:px-6">
      <Card variant="accent" className="space-y-5 px-5 py-6 md:px-8 md:py-8">
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionTitle
            eyebrow={copy.vault.eyebrow}
            title={copy.vault.title}
            subtitle={event?.description || copy.vault.emptyDescription}
          />
          <div className="flex flex-wrap gap-3">
            <Badge variant="accent">{event ? copy.vault.open : copy.vault.archive}</Badge>
            {showDevFinalizeButton && onFinalizeVaultEvent ? (
              <Button variant="secondary" size="sm" onClick={onFinalizeVaultEvent} disabled={isFinalizing}>
                {isFinalizing ? 'Finalizando...' : 'DEV: finalizar Vault'}
              </Button>
            ) : null}
          </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: copy.vault.keys, icon: ASSETS.icons.vaultKey },
                { label: copy.vault.missions, icon: ASSETS.icons.mission },
                { label: 'DuoCoins', icon: ASSETS.rewards.duocoinsThumb },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-[1rem] border border-[var(--dl-border)] bg-black/20 px-4 py-3">
                  <img src={item.icon} alt="" aria-hidden="true" className="h-8 w-8 object-contain" />
                  <span className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <ImagePlaceholder
            label={copy.vault.vaultImage}
            src={event ? ASSETS.vault.openRewards : ASSETS.icons.vault}
            alt={event ? copy.vault.openAlt : copy.vault.closedAlt}
            className="min-h-[220px]"
            imageClassName={event ? 'p-3 md:p-4' : 'p-10 md:p-12'}
            loading="eager"
          />
        </div>
      </Card>

      {actionMessage ? (
        <Card variant="muted" className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white">{copy.vault.update}</p>
            <p className="text-sm text-[var(--dl-muted-light)]">{actionMessage}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={onDismissActionMessage}>
            {copy.common.close}
          </Button>
        </Card>
      ) : null}

      {!event ? (
        <Card variant="muted" className="mx-auto flex w-full flex-col items-center justify-center py-10 text-center">
          <p className="font-['Rajdhani'] text-lg font-bold uppercase text-white">{copy.vault.noActive}</p>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          {event && !isParticipating ? (
            <VaultJoinPanel
              event={event}
              isJoining={isJoining}
              onJoin={onJoinVault}
              isLoggedIn={isLoggedIn}
              participantCount={participantCount}
            />
          ) : null}

          {event && isParticipating && participant ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <VaultProgressPanel
                participant={participant}
                totalPoints={totalPoints}
                percentage={percentage}
                completedMissionsCount={completedMissionsCount}
              />
              <VaultUserRankPanel
                myRank={myRank}
                leaderboard={leaderboard}
                isLoggedIn={isLoggedIn}
                isParticipant={isParticipating}
              />
            </div>
          ) : null}

          {event && !isParticipating ? (
            <VaultUserRankPanel
              myRank={myRank}
              leaderboard={leaderboard}
              isLoggedIn={isLoggedIn}
              isParticipant={isParticipating}
            />
          ) : null}

          {event ? (
            <section id="vault-missions" className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 border-b border-[var(--dl-border)] pb-4">
                <h2 className="font-['Rajdhani'] text-2xl font-bold uppercase text-white">{copy.vault.activeMissions}</h2>
                <Badge>{missions.length} {copy.vault.missionCount}</Badge>
              </div>
              {missions.length === 0 ? (
                <Card variant="muted" className="p-8 text-center">
                  <span className="text-[13px] text-[var(--dl-muted-light)]">{copy.vault.noMissions}</span>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {missions.map((mission) => (
                    <VaultMissionCard
                      key={mission.id}
                      mission={mission}
                      onClaim={onClaimTask}
                      isSubmitting={submittingTaskId === mission.id}
                      participantExists={isParticipating}
                    />
                  ))}
                </div>
              )}
            </section>
          ) : null}

          <VaultLeaderboard entries={leaderboard} isLoading={isLeaderboardLoading} error={leaderboardError} currentUserId={currentUserId} />
          <VaultWinnersPanel winners={winners} isLoading={isHistoryLoading} error={historyError} />
        </div>

        <div className="space-y-6">
          {event ? <VaultStatsPanel event={event} participantCount={participantCount} /> : null}

          <Card variant="muted" className="p-5">
            <h4 className="mb-3 font-['Rajdhani'] text-xl font-bold uppercase text-white">{copy.vault.howItWorks}</h4>
            <div className="mb-4 flex justify-center">
              <img src={ASSETS.vault.keyThumb} alt="Chave do Vault" loading="lazy" decoding="async" className="h-20 w-20 object-contain" />
            </div>
            <ul className="space-y-3 text-sm text-[var(--dl-muted-light)]">
              {copy.vault.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </Card>

          <VaultSeasonHistory seasons={seasons} isLoading={isHistoryLoading} error={historyError} />
        </div>
      </div>
    </div>
  );
};
