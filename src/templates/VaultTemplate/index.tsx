import React from 'react';
import {
  MyVaultRank,
  VaultEvent,
  VaultLeaderboardEntry,
  VaultMission,
  VaultMissionProgress,
  VaultParticipant,
} from '@/features/vault/vault.schema';
import { VaultJoinPanel } from '@/features/vault/components/VaultJoinPanel';
import { VaultLeaderboard } from '@/features/vault/components/VaultLeaderboard';
import { VaultMissionCard } from '@/features/vault/components/VaultMissionCard';
import { VaultProgressPanel } from '@/features/vault/components/VaultProgressPanel';
import { VaultStatsPanel } from '@/features/vault/components/VaultStatsPanel';
import { VaultUserRankPanel } from '@/features/vault/components/VaultUserRankPanel';

export interface VaultTemplateProps {
  event: VaultEvent | null;
  missions: (VaultMission & { progress: VaultMissionProgress | null })[];
  participant: VaultParticipant | null;
  participantCount: number;
  totalPoints: number;
  percentage: number;
  leaderboard: VaultLeaderboardEntry[];
  myRank: MyVaultRank | null;
  isLoading: boolean;
  isLeaderboardLoading: boolean;
  errorMessage?: string;
  leaderboardError?: string;
  actionMessage?: string | null;
  actionTone?: 'success' | 'danger' | 'warning' | 'info';
  onDismissActionMessage: () => void;
  isLoggedIn: boolean;
  currentUserId?: string | null;
  onJoinVault: () => void;
  onClaimTask: (taskId: string) => void;
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
  isLoading,
  isLeaderboardLoading,
  errorMessage,
  leaderboardError,
  actionMessage,
  actionTone = 'info',
  onDismissActionMessage,
  isLoggedIn,
  currentUserId,
  onJoinVault,
  onClaimTask,
  isJoining,
  submittingTaskId,
}) => {
  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-[1240px] flex-col items-center justify-center space-y-6 pb-12">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--dl-tactical-yellow)] border-t-transparent" />
        <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--dl-tactical-muted)]">Sincronizando cofre...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="dl-panel mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center py-16" style={{ borderColor: 'rgba(255,51,102,0.3)' }}>
        <p className="mb-4 font-['Rajdhani'] text-lg font-bold uppercase text-[var(--dl-tactical-red)]">{errorMessage}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="dl-panel mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center py-16" style={{ borderColor: 'rgba(255,226,102,0.3)' }}>
        <p className="mb-4 font-['Rajdhani'] text-lg font-bold uppercase text-[var(--dl-tactical-yellow)]">Nenhuma operação de Cofre ativa.</p>
      </div>
    );
  }

  const isParticipating = !!participant;
  const completedMissionsCount = missions.filter((mission) => mission.progress?.completed).length;
  const actionToneStyles: Record<'success' | 'danger' | 'warning' | 'info', { border: string; bg: string; text: string }> = {
    success: {
      border: 'rgba(56,242,139,0.28)',
      bg: 'rgba(56,242,139,0.08)',
      text: 'var(--dl-tactical-green)',
    },
    danger: {
      border: 'rgba(255,51,102,0.3)',
      bg: 'rgba(255,51,102,0.08)',
      text: 'var(--dl-tactical-red)',
    },
    warning: {
      border: 'rgba(255,226,102,0.3)',
      bg: 'rgba(255,226,102,0.08)',
      text: 'var(--dl-tactical-yellow)',
    },
    info: {
      border: 'rgba(70,183,255,0.3)',
      bg: 'rgba(70,183,255,0.08)',
      text: 'var(--dl-tactical-blue)',
    },
  };
  const currentActionTone = actionToneStyles[actionTone];

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-6 px-3 pb-12 md:px-6">
      <div className="dl-panel relative mb-6 overflow-hidden p-[18px] md:p-[28px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,226,102,0.14),transparent_20rem),linear-gradient(120deg,transparent,rgba(255,226,102,0.04),transparent)]" />
        <div className="relative z-[2]">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="dl-hud-label" style={{ color: 'var(--dl-tactical-yellow)', borderColor: 'rgba(255,226,102,0.34)', background: 'rgba(255,226,102,0.08)' }}>
              VAULT OPERATION // LOOT MODULE
            </span>
            <span className="dl-stamp dl-stamp-yellow">Cofre Aberto</span>
          </div>
          <h1 className="dl-title mb-3 text-[clamp(28px,5vw,48px)] leading-[0.9]">
            Dispute recompensas no{' '}
            <span className="text-[var(--dl-tactical-yellow)] drop-shadow-[0_0_24px_rgba(255,226,102,0.3)]">Cofre</span>
          </h1>
          <p className="dl-muted max-w-[600px] text-[14px] leading-[1.65]">{event.description}</p>
        </div>
      </div>

      {actionMessage && (
        <div
          className="dl-panel flex items-start justify-between gap-4 p-4"
          style={{ borderColor: currentActionTone.border, background: currentActionTone.bg }}
        >
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: currentActionTone.text }}>
              SISTEMA // NOTIFICAÇÃO
            </p>
            <p className="text-sm text-white/85">{actionMessage}</p>
          </div>
          <button
            type="button"
            onClick={onDismissActionMessage}
            className="dl-btn h-8 shrink-0 px-3 text-[10px]"
          >
            FECHAR
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          {!isParticipating && (
            <VaultJoinPanel
              event={event}
              isJoining={isJoining}
              onJoin={onJoinVault}
              isLoggedIn={isLoggedIn}
              participantCount={participantCount}
            />
          )}

          {isParticipating && participant && (
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
          )}

          {!isParticipating && (
            <VaultUserRankPanel
              myRank={myRank}
              leaderboard={leaderboard}
              isLoggedIn={isLoggedIn}
              isParticipant={isParticipating}
            />
          )}

          <section id="vault-missions" className="space-y-4">
            <div className="flex items-center gap-3 border-b border-[var(--dl-tactical-line)] pb-4">
              <h2 className="font-['Rajdhani'] text-xl font-bold uppercase text-[var(--dl-tactical-text)]">Contratos ativos</h2>
              <span className="dl-stamp dl-stamp-yellow">{missions.length} missões</span>
            </div>
            {missions.length === 0 ? (
              <div className="dl-panel p-8 text-center">
                <span className="text-[13px] text-[var(--dl-tactical-muted)]">Nenhuma missão disponível no momento.</span>
              </div>
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

          <VaultLeaderboard
            entries={leaderboard}
            isLoading={isLeaderboardLoading}
            error={leaderboardError}
            currentUserId={currentUserId}
          />
        </div>

        <div className="space-y-6">
          <VaultStatsPanel event={event} participantCount={participantCount} />

          <div className="dl-panel bg-[var(--dl-tactical-metal)] p-5">
            <h4 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[var(--dl-tactical-yellow)]">
              <span className="h-1.5 w-1.5 bg-[var(--dl-tactical-yellow)] [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]" />
              Como o Cofre funciona
            </h4>
            <ul className="space-y-3 text-[12px] text-[var(--dl-tactical-muted)]">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[var(--dl-tactical-yellow)] opacity-60">1.</span>
                <span>Participe do evento ativando a operação de cofre.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[var(--dl-tactical-yellow)] opacity-60">2.</span>
                <span>Cumpra as exigências dos contratos ativos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[var(--dl-tactical-yellow)] opacity-60">3.</span>
                <span>Acumule pontos individuais e ajude na meta global.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[var(--dl-tactical-yellow)] opacity-60">4.</span>
                <span>O loot final é distribuído proporcionalmente ao seu esforço tático.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
