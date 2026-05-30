import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DuoFrame, UiMarker } from '@/components/atoms';
import { UI_MARKERS } from '@/config/uiMarkers';
import { ROUTES } from '@/constants/routes';
import { VaultSubmissionModal } from './VaultSubmissionModal';

import duoCoinIcon16 from '@/assets/icons/duoloot_pontos_token_check_16px.png';
import duoCoinIcon32 from '@/assets/icons/duoloot_pontos_token_check_32px.png';

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
  onSubmitEvidence: (missionId: string, text: string, url: string) => Promise<void>;
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
  seasons,
  actionMessage,
  onDismissActionMessage,
  onJoinVault,
  onSubmitEvidence,
  isJoining,
  submittingTaskId,
  isLoggedIn,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeMissionForModal, setActiveMissionForModal] = useState<{ id: string; title: string } | null>(null);

  const isParticipating = !!participant;

  const handleHeroAction = () => {
    if (!isLoggedIn) {
      navigate(ROUTES.LOGIN, { state: { from: location } });
      return;
    }
    if (!isParticipating) {
      onJoinVault();
    }
  };

  const getMissionStatusMeta = (mission: VaultMission & { progress: VaultMissionProgress | null }) => {
    const submitted = mission.my_submission?.status === 'submitted';
    const approved = mission.my_submission?.status === 'approved';
    const rejected = mission.my_submission?.status === 'rejected';
    const closed = mission.status === 'closed' || mission.status === 'archived';
    const hasWinner = Boolean(mission.winners_count! >= mission.winner_limit!);

    if (approved) {
      return {
        label: 'Aprovado',
        tone: 'success',
        helper: 'Missão validada.',
        className: 'border-[rgba(35,209,139,.34)] bg-[rgba(35,209,139,.10)] text-[#27e58a]',
      };
    }

    if (submitted) {
      return {
        label: 'Em análise',
        tone: 'warning',
        helper: 'Aguardando avaliação.',
        className: 'border-[rgba(255,209,102,.34)] bg-[rgba(255,209,102,.10)] text-[#ffd166]',
      };
    }

    if (rejected) {
      return {
        label: 'Rejeitado',
        tone: 'danger',
        helper: 'Envie novamente se permitido.',
        className: 'border-[rgba(255,63,102,.34)] bg-[rgba(255,63,102,.10)] text-[#ff3f66]',
      };
    }

    if (closed || hasWinner) {
      return {
        label: 'Finalizada',
        tone: 'closed',
        helper: 'Missão encerrada.',
        className: 'border-[rgba(255,63,102,.34)] bg-[rgba(255,63,102,.10)] text-[#ff3f66]',
      };
    }

    return {
      label: 'Disponível',
      tone: 'active',
      helper: 'Pronta para conclusão.',
      className: 'border-[rgba(22,215,255,.32)] bg-[rgba(22,215,255,.10)] text-[#16d7ff]',
    };
  };

  const getMissionActionLabel = (mission: VaultMission & { progress: VaultMissionProgress | null }) => {
    const submitted = mission.my_submission?.status === 'submitted';
    const approved = mission.my_submission?.status === 'approved';
    const rejected = mission.my_submission?.status === 'rejected';
    const closed = mission.status === 'closed' || mission.status === 'archived';
    const hasWinner = Boolean(mission.winners_count! >= mission.winner_limit!);

    if (approved) return '✓ Aprovado';
    if (submitted) return 'Em análise';
    if (rejected) return 'Enviar novamente';
    if (closed || hasWinner) return 'Finalizada';

    return 'Registrar conclusão';
  };

  const isMissionActionDisabled = (mission: VaultMission & { progress: VaultMissionProgress | null }) => {
    const submitted = mission.my_submission?.status === 'submitted';
    const approved = mission.my_submission?.status === 'approved';
    const closed = mission.status === 'closed' || mission.status === 'archived';
    const hasWinner = Boolean(mission.winners_count! >= mission.winner_limit!);

    return approved || submitted || closed || hasWinner;
  };

  const renderMissionCard = (mission: VaultMission & { progress: VaultMissionProgress | null }) => {
    const approved = mission.my_submission?.status === 'approved';
    const rejected = mission.my_submission?.status === 'rejected';
    const closed = mission.status === 'closed' || mission.status === 'archived';
    const hasWinner = Boolean(mission.winners_count! >= mission.winner_limit!);
    const statusMeta = getMissionStatusMeta(mission);
    const actionDisabled = isMissionActionDisabled(mission);
    const actionLabel = getMissionActionLabel(mission);
    const cashReward = Number(mission.cash_reward_cents || 0) / 100;
    const pointsReward = Number(mission.points_reward || 0);
    const winnersCount = Number(mission.winners_count || 0);
    const winnerLimit = Number(mission.winner_limit || 0);
    const hasWinnerLimit = winnerLimit > 0;

    return (
      <DuoFrame
        key={mission.id}
        variant={approved ? 'soft' : rejected || closed || hasWinner ? 'red' : 'default'}
        thickness="sm"
        radius="lg"
        className="h-full min-w-0"
        screenClassName="p-1.5"
      >
        <article className="dl-panel relative flex h-full min-w-0 flex-col overflow-hidden rounded-[1.35rem] border-0 bg-[radial-gradient(circle_at_15%_0%,rgba(22,215,255,.10),transparent_14rem),linear-gradient(135deg,rgba(255,209,102,.06),transparent_34%),linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.012)),linear-gradient(145deg,#08111d,#050a12_66%,#08111b)] p-3.5 shadow-[0_18px_42px_rgba(0,0,0,.30),0_0_26px_rgba(22,215,255,.06)] sm:p-4">
          {(hasWinner && !approved) ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
              <span className="rotate-[-12deg] rounded-lg border-4 border-[var(--dl-error)] px-4 py-1 font-['Rajdhani'] text-2xl font-black uppercase text-[var(--dl-error)] shadow-[0_0_20px_rgba(255,70,85,0.4)]">
                Finalizada
              </span>
            </div>
          ) : null}

          <header className="relative z-[2] mb-3 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2.5">
            <span className={`inline-flex min-h-[30px] shrink-0 items-center justify-center gap-1.5 rounded-full border px-2.5 text-[0.62rem] font-black uppercase tracking-[0.08em] ${statusMeta.className}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_10px_currentColor]" />
              {statusMeta.label}
            </span>

            <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-right font-['Inter'] text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[rgba(235,239,246,.46)]">
              Missão do Cofre
            </span>
          </header>

          <section className="relative z-[2] border-b border-[rgba(160,180,205,.12)] pb-3.5">
            <h3 className="m-0 min-w-0 overflow-hidden text-ellipsis font-['Rajdhani'] text-[1.45rem] font-black uppercase leading-[.95] tracking-[.02em] text-white sm:text-[1.6rem]">
              {mission.title}
            </h3>

            <p className="mt-2 line-clamp-3 text-[0.76rem] leading-relaxed text-[rgba(235,239,246,.58)] sm:text-[0.82rem]">
              {mission.requirements || mission.description}
            </p>
          </section>

          <section className="relative z-[2] grid gap-2 border-b border-[rgba(160,180,205,.12)] py-3.5">
            <div className="grid grid-cols-2 gap-2">
              <div className="min-w-0 rounded-xl border border-[rgba(255,209,102,.22)] bg-[rgba(255,209,102,.08)] px-2.5 py-2 shadow-[0_0_14px_rgba(255,209,102,.06)]">
                <span className="block text-[0.56rem] font-black uppercase tracking-[0.12em] text-[rgba(238,241,246,.52)]">
                  Recompensa
                </span>
                <strong className="mt-1 block truncate font-mono text-[0.82rem] text-[var(--dl-warning)]">
                  {cashReward > 0 ? `+${cashReward} ${mission.currency}` : 'Evento'}
                </strong>
              </div>

              <div className="min-w-0 rounded-xl border border-[rgba(22,215,255,.22)] bg-[rgba(22,215,255,.08)] px-2.5 py-2 shadow-[0_0_14px_rgba(22,215,255,.06)]">
                <span className="block text-[0.56rem] font-black uppercase tracking-[0.12em] text-[rgba(238,241,246,.52)]">
                  Pontos
                </span>
                <strong className="mt-1 flex min-w-0 items-center gap-1 font-mono text-[0.82rem] text-[#16d7ff]">
                  +{pointsReward}
                  <img
                    src={duoCoinIcon16}
                    alt="DuoCoins"
                    className="h-4 w-4 shrink-0 drop-shadow-[0_0_4px_rgba(255,209,102,0.3)]"
                  />
                </strong>
              </div>
            </div>

            {hasWinnerLimit ? (
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-2.5 py-2">
                <div className="min-w-0">
                  <span className="block text-[0.56rem] font-black uppercase tracking-[0.12em] text-[rgba(238,241,246,.46)]">
                    Vencedores
                  </span>
                  <div className="mt-1 h-2 rounded-full bg-white/[0.08] p-[2px]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#14d8ff_0%,#20ddca_42%,#ffd166_100%)]"
                      style={{ width: `${Math.min(100, Math.round((winnersCount / winnerLimit) * 100))}%` }}
                    />
                  </div>
                </div>

                <span className="font-mono text-[0.75rem] font-bold text-[var(--dl-muted-light)]">
                  {winnersCount}/{winnerLimit}
                </span>
              </div>
            ) : null}
          </section>

          <section className="relative z-[2] mt-auto pt-3.5">
            <p className="mb-2 line-clamp-1 text-[0.68rem] font-semibold leading-snug text-[rgba(235,239,246,.46)]">
              {statusMeta.helper}
            </p>

            <button
              type="button"
              onClick={() => setActiveMissionForModal({ id: mission.id, title: mission.title })}
              disabled={actionDisabled}
              className={`inline-flex min-h-[42px] w-full min-w-0 items-center justify-center rounded-xl px-3 text-center text-[0.72rem] font-black uppercase tracking-[.08em] text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 ${
                actionDisabled
                  ? 'border border-[rgba(160,180,205,.17)] bg-white/[.05] text-[var(--dl-muted)]'
                  : 'bg-[linear-gradient(135deg,#ff304b,#ff3f72_62%,#ff477a)] shadow-[0_10px_20px_rgba(255,63,102,.16),inset_0_1px_0_rgba(255,255,255,.18)]'
              }`}
            >
              {actionLabel}
            </button>
          </section>
        </article>
      </DuoFrame>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-3 pb-12 pt-8 sm:px-5 sm:pb-14 sm:pt-10 lg:px-6 lg:pb-16 lg:pt-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 60% 50% at 15% 22%, rgba(13,240,255,0.08) 0%, transparent 60%)',
            'radial-gradient(ellipse 50% 45% at 85% 35%, rgba(255,70,85,0.08) 0%, transparent 55%)',
            'radial-gradient(ellipse 45% 38% at 60% 8%, rgba(176,132,255,0.06) 0%, transparent 55%)',
            'radial-gradient(ellipse 50% 40% at 50% 100%, rgba(255,209,102,0.05) 0%, transparent 60%)',
          ].join(', '),
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-col gap-4 sm:gap-5 lg:gap-6">
        
        {/* Action message */}
        {actionMessage ? (
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl flex justify-between items-start">
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white">Status</p>
              <p className="text-sm text-[var(--dl-muted-light)]">{actionMessage}</p>
            </div>
            <button onClick={onDismissActionMessage} className="text-[var(--dl-muted)] hover:text-white transition">
              ✕
            </button>
          </div>
        ) : null}

        {/* Hero do Cofre */}
        {/* UI_MARKER: vault.hero.201 | Hero do Cofre */}
        <section
          data-ui-id={UI_MARKERS.vault.hero.id}
          data-ui-label={UI_MARKERS.vault.hero.label}
          className="grid min-w-0 items-center gap-5 rounded-[1.5rem] border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl sm:rounded-[1.75rem] sm:p-5 md:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] md:gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 lg:rounded-[2rem] lg:p-8"
        >
          <div className="col-span-full">
            <UiMarker {...UI_MARKERS.vault.hero} />
          </div>
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.05] px-4 py-1.5 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--dl-warning)] shadow-[0_0_6px_var(--dl-warning)]" />
              <span className="font-['Inter'] text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
                Cofre ativo · dados de demonstração
              </span>
            </div>

            <div>
              <h1 className="max-w-4xl text-[clamp(2rem,12vw,3.4rem)] font-bold leading-[0.98] tracking-[-0.035em] text-white sm:text-[clamp(2.4rem,7vw,4rem)] lg:text-[clamp(3rem,6vw,5rem)]">
                {event?.title || 'Cofre Duo Loot'}
                <span className="block text-[var(--dl-warning)]">
                  Missões, ranking e recompensas.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl font-['Inter'] text-[0.9rem] font-light leading-[1.65] text-[var(--dl-muted-light)] sm:text-[0.96rem] lg:mt-5 lg:text-[1rem] lg:leading-[1.75]">
                {event?.description ||
                  'Entre no evento, complete missões, acumule pontos e dispute recompensas com a comunidade.'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
              {!isLoggedIn ? (
                <button
                  onClick={handleHeroAction}
                  className="w-full rounded-xl bg-[var(--dl-keyword)] px-4 py-3 text-center font-['Inter'] text-[0.74rem] font-semibold uppercase tracking-[0.09em] text-white shadow-[0_4px_16px_rgba(255,70,85,0.28)] transition hover:bg-[var(--dl-error)] sm:w-auto sm:px-5 sm:text-[0.8rem]"
                >
                  Login para participar
                </button>
              ) : !isParticipating ? (
                <button
                  onClick={handleHeroAction}
                  disabled={isJoining}
                  className="w-full rounded-xl bg-[var(--dl-keyword)] px-4 py-3 text-center font-['Inter'] text-[0.74rem] font-semibold uppercase tracking-[0.09em] text-white shadow-[0_4px_16px_rgba(255,70,85,0.28)] transition hover:bg-[var(--dl-error)] disabled:opacity-50 sm:w-auto sm:px-5 sm:text-[0.8rem]"
                >
                  {isJoining ? 'Entrando...' : 'Participar do Cofre'}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full rounded-xl border border-[var(--dl-string)]/30 bg-[var(--dl-string)]/10 px-4 py-3 text-center font-['Inter'] text-[0.74rem] font-semibold uppercase tracking-[0.09em] text-[var(--dl-string)] disabled:opacity-100 sm:w-auto sm:px-5 sm:text-[0.8rem]"
                >
                  ✓ Inscrito no Cofre
                </button>
              )}

              <button 
                onClick={() => {
                  const el = document.getElementById('vault-missions');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-center font-['Inter'] text-[0.74rem] font-semibold uppercase tracking-[0.09em] text-[var(--dl-muted-light)] transition hover:border-white/[0.18] hover:bg-white/[0.07] hover:text-white sm:w-auto sm:px-5 sm:text-[0.8rem]"
              >
                Ver missões
              </button>
            </div>
          </div>

          <div className="relative min-h-[220px] overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-black/20 p-4 sm:min-h-[260px] sm:rounded-[1.5rem] sm:p-5 md:min-h-[280px] lg:min-h-[300px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,209,102,.16),transparent_55%)]" />

            <div className="relative z-10 flex h-full min-h-[190px] flex-col items-center justify-center text-center sm:min-h-[230px] md:min-h-[250px] lg:min-h-[260px]">
              <div className="grid h-24 w-24 place-items-center rounded-[1.5rem] border border-[var(--dl-warning)]/30 bg-[var(--dl-warning)]/10 shadow-[0_0_34px_rgba(255,209,102,.14)] sm:h-28 sm:w-28 sm:rounded-[1.75rem] lg:h-32 lg:w-32 lg:rounded-[2rem]">
                <span className="text-5xl sm:text-6xl">🔐</span>
              </div>

              <p className="mt-5 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-[var(--dl-warning)]">
                reward vault
              </p>

              <strong className="mt-2 font-['Rajdhani'] text-3xl font-bold uppercase text-white">
                {event?.prize_label || 'Recompensa especial'}
              </strong>
            </div>
          </div>
        </section>

        {/* Stats */}
        {/* UI_MARKER: vault.eventStatus.202 | Status do evento */}
        <section
          data-ui-id={UI_MARKERS.vault.eventStatus.id}
          data-ui-label={UI_MARKERS.vault.eventStatus.label}
          className="grid min-w-0 gap-3 grid-cols-2 lg:grid-cols-4"
        >
          <div className="col-span-full">
            <UiMarker {...UI_MARKERS.vault.eventStatus} />
          </div>
          {[
            { value: `${participantCount}`, label: 'Participantes', color: 'text-[var(--dl-number)]' },
            { value: `${totalPoints}`, label: 'Pontos do Ranking', color: 'text-[var(--dl-string)]', isRankingPoints: true },
            { value: `${percentage}%`, label: 'Progresso', color: 'text-[var(--dl-warning)]' },
            { value: `${missions.length}`, label: 'Missões ativas', color: 'text-[var(--dl-function)]' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-3 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.07] sm:px-4 sm:py-3.5"
            >
              <div className="flex items-center gap-2">
                {stat.isRankingPoints && (
                  <img src={duoCoinIcon32} alt="DC" className="h-7 w-7 drop-shadow-[0_0_6px_rgba(255,209,102,0.4)]" />
                )}
                <span className={`font-mono text-xl font-bold leading-none ${stat.color} sm:text-2xl`}>
                  {stat.value}
                </span>
              </div>
              <span className="mt-1.5 block overflow-hidden text-ellipsis whitespace-nowrap font-['Inter'] text-[0.58rem] font-medium uppercase tracking-[0.1em] text-[var(--dl-muted)] sm:text-[0.68rem]">
                {stat.label}
              </span>
            </div>
          ))}
        </section>

        {/* Progress */}
        {/* UI_MARKER: vault.progress.203 | Seu progresso */}
        <section
          data-ui-id={UI_MARKERS.vault.progress.id}
          data-ui-label={UI_MARKERS.vault.progress.label}
          className="min-w-0 rounded-[1.35rem] border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl sm:rounded-2xl sm:p-5 md:p-6"
        >
          <UiMarker {...UI_MARKERS.vault.progress} />
          <div className="mb-4 grid gap-4 sm:mb-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div>
              <span className="font-['Inter'] text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--dl-string)]">
                Progresso do evento
              </span>
              <h2 className="mt-3 text-[clamp(1.35rem,6vw,1.9rem)] font-bold leading-[1.15] tracking-[-0.02em] text-white sm:text-[clamp(1.6rem,3vw,2.2rem)]">
                Continue avançando para abrir o Cofre
              </h2>
            </div>

            <div className="text-left sm:text-right">
              <span className="block font-mono text-2xl font-bold text-[var(--dl-warning)] sm:text-3xl">
                {percentage}%
              </span>
              <span className="font-['Inter'] text-[0.68rem] uppercase tracking-[0.12em] text-[var(--dl-muted)]">
                progresso total
              </span>
            </div>
          </div>

          <div className="h-3 rounded-full bg-white/[0.08] p-[2px]">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,var(--dl-number),var(--dl-string),var(--dl-warning))] shadow-[0_0_18px_rgba(13,240,255,0.16)]"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </section>

        <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,360px)] xl:gap-6">
          <div className="min-w-0 space-y-4 sm:space-y-5 lg:space-y-6">
            
            {/* Missions */}
            {/* UI_MARKER: vault.missions.204 | Missões ativas */}
            <section
              id="vault-missions"
              data-ui-id={UI_MARKERS.vault.missions.id}
              data-ui-label={UI_MARKERS.vault.missions.label}
              className="min-w-0 space-y-4"
            >
              <UiMarker {...UI_MARKERS.vault.missions} />
              <div className="grid gap-3 border-b border-white/[0.06] pb-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <div>
                  <span className="font-['Inter'] text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--dl-warning)]">
                    Desafios do Cofre
                  </span>
                  <h2 className="mt-2 font-['Rajdhani'] text-3xl font-bold uppercase text-white">
                    Complete tarefas e ganhe pontos
                  </h2>
                </div>

                <span className="rounded-full border border-[var(--dl-warning)]/30 bg-[var(--dl-warning)]/10 px-3 py-1 font-mono text-[0.68rem] text-[var(--dl-warning)]">
                  {missions.length} missões
                </span>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2 xl:gap-4">
                {missions.map(renderMissionCard)}
              </div>
            </section>

            {/* Leaderboard */}
            {/* UI_MARKER: vault.leaderboard.205 | Ranking do Cofre */}
            <section
              data-ui-id={UI_MARKERS.vault.leaderboard.id}
              data-ui-label={UI_MARKERS.vault.leaderboard.label}
              className="min-w-0 rounded-[1.35rem] border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl sm:rounded-2xl sm:p-5"
            >
              <UiMarker {...UI_MARKERS.vault.leaderboard} />
              <div className="mb-5 flex items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
                <div>
                  <span className="font-['Inter'] text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--dl-number)]">
                    Posições do evento
                  </span>
                  <h2 className="mt-2 font-['Rajdhani'] text-3xl font-bold uppercase text-white">
                    Top jogadores
                  </h2>
                </div>

                <span className="rounded-full border border-[var(--dl-number)]/30 bg-[var(--dl-number)]/10 px-3 py-1 font-mono text-[0.68rem] text-[var(--dl-number)]">
                  live preview
                </span>
              </div>

              <div className="space-y-2">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.participantId}
                    className="grid min-w-0 grid-cols-[36px_minmax(0,1fr)] gap-3 rounded-xl border border-white/[0.05] bg-black/20 px-3 py-3 sm:grid-cols-[42px_minmax(0,1fr)_auto] sm:items-center"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.04] font-mono text-sm text-[var(--dl-warning)]">
                      #{entry.rankPosition}
                    </span>

                    <div className="min-w-0">
                      <strong className="block truncate text-sm text-white">
                        {entry.playerNickname || entry.playerName || 'Player'}
                      </strong>
                      <span className="block truncate font-mono text-[0.65rem] text-[var(--dl-muted)]">
                        {entry.missionsCompleted}/{entry.totalMissions} missões · trust {entry.trustScore}
                      </span>
                    </div>

                    <span className="col-start-2 inline-flex items-center gap-1 font-mono text-sm font-bold text-[var(--dl-string)] sm:col-start-auto">
                      {entry.points}
                      <img src={duoCoinIcon16} alt="DC" className="h-4 w-4" />
                      <span>pts</span>
                    </span>
                  </div>
                ))}
              </div>
            </section>

          </div>

          <aside className="min-w-0 space-y-4 sm:space-y-5 lg:space-y-6">
            
            {/* Rewards */}
            {/* UI_MARKER: vault.rewards.206 | Recompensas */}
            <section
              data-ui-id={UI_MARKERS.vault.rewards.id}
              data-ui-label={UI_MARKERS.vault.rewards.label}
              className="min-w-0 rounded-[1.35rem] border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl sm:rounded-2xl sm:p-5"
            >
              <UiMarker {...UI_MARKERS.vault.rewards} />
              <span className="font-['Inter'] text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--dl-warning)]">
                Prêmios
              </span>

              <h2 className="mt-3 font-['Rajdhani'] text-3xl font-bold uppercase text-white">
                O que está dentro do Cofre
              </h2>

              <div className="mt-5 grid gap-3">
                {[
                  { title: 'Badge Fundador', detail: 'Visual exclusivo beta', color: 'var(--dl-warning)', isBadge: true },
                  { title: '1500 DuoCoins', detail: 'Saldo fictício de evento', color: 'var(--dl-string)', isCoins: true },
                  { title: 'Destaque no ranking', detail: 'Top players da semana', color: 'var(--dl-number)', isHighlight: true },
                ].map((reward) => (
                  <div
                    key={reward.title}
                    className="rounded-xl border border-white/[0.08] bg-black/20 p-4"
                  >
                    {reward.isCoins ? (
                      <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl border border-[var(--dl-warning)]/30 bg-[var(--dl-warning)]/10 shadow-[0_0_12px_rgba(255,209,102,0.2)]">
                        <img src={duoCoinIcon32} alt="DC" className="h-7 w-7 drop-shadow-[0_0_4px_rgba(255,209,102,0.4)]" />
                      </div>
                    ) : (
                      <div
                        className="mb-4 grid h-12 w-12 place-items-center rounded-xl font-mono text-sm font-bold"
                        style={{
                          color: reward.color,
                          background: `${reward.color}18`,
                          border: `1px solid ${reward.color}35`,
                        }}
                      >
                        {reward.isBadge ? '⭐' : '🏆'}
                      </div>
                    )}

                    <strong className="block text-sm text-white">{reward.title}</strong>
                    <span className="mt-1 block text-xs text-[var(--dl-muted-light)]">
                      {reward.detail}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* How it works */}
            {/* UI_MARKER: vault.how-it-works.209 | Como funciona */}
            <section
              data-ui-id={UI_MARKERS.vault.howItWorks.id}
              data-ui-label={UI_MARKERS.vault.howItWorks.label}
              className="min-w-0 rounded-[1.35rem] border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl sm:rounded-2xl sm:p-5"
            >
              <UiMarker {...UI_MARKERS.vault.howItWorks} />
              <h4 className="mb-3 font-['Rajdhani'] text-xl font-bold uppercase text-white">Como funciona</h4>
              <ul className="space-y-3 text-sm text-[var(--dl-muted-light)]">
                <li>1. Entre no Cofre da semana.</li>
                <li>2. Complete missões dentro da plataforma.</li>
                <li>3. Acumule pontos no ranking.</li>
                <li>4. Fique entre os melhores para desbloquear recompensas.</li>
              </ul>
            </section>

            {/* Seasons */}
            {/* UI_MARKER: vault.seasonHistory.208 | Histórico de temporadas */}
            <section
              data-ui-id={UI_MARKERS.vault.seasonHistory.id}
              data-ui-label={UI_MARKERS.vault.seasonHistory.label}
              className="min-w-0 rounded-[1.35rem] border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl sm:rounded-2xl sm:p-5"
            >
              <UiMarker {...UI_MARKERS.vault.seasonHistory} />
              <span className="font-['Inter'] text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--dl-function)]">
                Eventos passados
              </span>

              <h2 className="mt-3 font-['Rajdhani'] text-3xl font-bold uppercase text-white">
                Temporadas anteriores
              </h2>

              <div className="mt-5 space-y-3">
                {seasons.map((season) => (
                  <div
                    key={season.eventId}
                    className="rounded-xl border border-white/[0.06] bg-black/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <strong className="block text-sm text-white">{season.title}</strong>
                        <span className="mt-1 block text-xs leading-relaxed text-[var(--dl-muted-light)]">
                          {season.description}
                        </span>
                      </div>

                      <span className="shrink-0 rounded-full border border-[var(--dl-function)]/30 bg-[var(--dl-function)]/10 px-2.5 py-1 font-mono text-[0.62rem] text-[var(--dl-function)]">
                        {season.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-lg bg-white/[0.03] p-2">
                        <span className="block font-mono text-sm text-[var(--dl-number)]">
                          {season.participantCount}
                        </span>
                        <small className="text-[0.62rem] text-[var(--dl-muted)]">players</small>
                      </div>

                      <div className="rounded-lg bg-white/[0.03] p-2">
                        <span className="block font-mono text-sm text-[var(--dl-warning)]">
                          {season.winnersCount}
                        </span>
                        <small className="text-[0.62rem] text-[var(--dl-muted)]">vencedores</small>
                      </div>

                      <div className="rounded-lg bg-white/[0.03] p-2">
                        <span className="block truncate font-mono text-sm text-[var(--dl-string)]">
                          {season.topWinnerNickname || '---'}
                        </span>
                        <small className="text-[0.62rem] text-[var(--dl-muted)]">top 1</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </aside>
        </div>
      </div>

      {activeMissionForModal && (
        <VaultSubmissionModal
          isOpen={true}
          onClose={() => setActiveMissionForModal(null)}
          missionTitle={activeMissionForModal.title}
          isLoading={submittingTaskId === activeMissionForModal.id}
          onSubmit={async (text, url) => {
            await onSubmitEvidence(activeMissionForModal.id, text, url);
            setActiveMissionForModal(null);
          }}
        />
      )}
    </div>
  );
};
