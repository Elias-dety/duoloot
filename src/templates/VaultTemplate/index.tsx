import { UiMarker } from '@/components/atoms';
import { UI_MARKERS } from '@/config/uiMarkers';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

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
  seasons,
  actionMessage,
  onDismissActionMessage,
  onJoinVault,
  onClaimTask,
  isJoining,
  submittingTaskId,
  isLoggedIn,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

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
  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-16 pt-12 sm:px-6">
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

      <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-col gap-6">
        
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
          className="grid items-center gap-8 rounded-[2rem] border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl md:grid-cols-[minmax(0,1fr)_360px] md:p-8"
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
              <h1 className="max-w-4xl text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-white">
                {event?.title || 'Cofre Duo Loot'}
                <span className="block text-[var(--dl-warning)]">
                  Missões, ranking e recompensas.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl font-['Inter'] text-[1rem] font-light leading-[1.75] text-[var(--dl-muted-light)]">
                {event?.description ||
                  'Entre no evento, complete missões, acumule pontos e dispute recompensas com a comunidade.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {!isLoggedIn ? (
                <button
                  onClick={handleHeroAction}
                  className="rounded-xl bg-[var(--dl-keyword)] px-5 py-3 font-['Inter'] text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_4px_16px_rgba(255,70,85,0.28)] transition hover:bg-[var(--dl-error)]"
                >
                  Login para participar
                </button>
              ) : !isParticipating ? (
                <button
                  onClick={handleHeroAction}
                  disabled={isJoining}
                  className="rounded-xl bg-[var(--dl-keyword)] px-5 py-3 font-['Inter'] text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_4px_16px_rgba(255,70,85,0.28)] transition hover:bg-[var(--dl-error)] disabled:opacity-50"
                >
                  {isJoining ? 'Entrando...' : 'Participar do Cofre'}
                </button>
              ) : (
                <button
                  disabled
                  className="rounded-xl border border-[var(--dl-string)]/30 bg-[var(--dl-string)]/10 px-5 py-3 font-['Inter'] text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-[var(--dl-string)] disabled:opacity-100"
                >
                  ✓ Inscrito no Cofre
                </button>
              )}

              <button 
                onClick={() => {
                  const el = document.getElementById('vault-missions');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="rounded-xl border border-white/[0.1] bg-white/[0.04] px-5 py-3 font-['Inter'] text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-[var(--dl-muted-light)] transition hover:border-white/[0.18] hover:bg-white/[0.07] hover:text-white"
              >
                Ver missões
              </button>
            </div>
          </div>

          <div className="relative min-h-[300px] overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-black/20 p-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,209,102,.16),transparent_55%)]" />

            <div className="relative z-10 flex h-full min-h-[260px] flex-col items-center justify-center text-center">
              <div className="grid h-32 w-32 place-items-center rounded-[2rem] border border-[var(--dl-warning)]/30 bg-[var(--dl-warning)]/10 shadow-[0_0_44px_rgba(255,209,102,.16)]">
                <span className="text-6xl">🔐</span>
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
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
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
              className="flex flex-col gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.07]"
            >
              <div className="flex items-center gap-2">
                {stat.isRankingPoints && (
                  <img src={duoCoinIcon32} alt="DC" className="h-7 w-7 drop-shadow-[0_0_6px_rgba(255,209,102,0.4)]" />
                )}
                <span className={`font-mono text-2xl font-bold leading-none ${stat.color}`}>
                  {stat.value}
                </span>
              </div>
              <span className="font-['Inter'] text-[0.68rem] font-medium uppercase tracking-[0.12em] text-[var(--dl-muted)]">
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
          className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl md:p-6"
        >
          <UiMarker {...UI_MARKERS.vault.progress} />
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-['Inter'] text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--dl-string)]">
                ↳ Seu progresso
              </span>
              <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.2rem)] font-bold leading-[1.18] tracking-[-0.02em] text-white">
                Continue avançando para abrir o Cofre
              </h2>
            </div>

            <div className="text-right">
              <span className="block font-mono text-3xl font-bold text-[var(--dl-warning)]">
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

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            
            {/* Missions */}
            {/* UI_MARKER: vault.missions.204 | Missões ativas */}
            <section
              id="vault-missions"
              data-ui-id={UI_MARKERS.vault.missions.id}
              data-ui-label={UI_MARKERS.vault.missions.label}
              className="space-y-4"
            >
              <UiMarker {...UI_MARKERS.vault.missions} />
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                <div>
                  <span className="font-['Inter'] text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--dl-warning)]">
                    ↳ Missões ativas
                  </span>
                  <h2 className="mt-2 font-['Rajdhani'] text-3xl font-bold uppercase text-white">
                    Complete tarefas e ganhe pontos
                  </h2>
                </div>

                <span className="rounded-full border border-[var(--dl-warning)]/30 bg-[var(--dl-warning)]/10 px-3 py-1 font-mono text-[0.68rem] text-[var(--dl-warning)]">
                  {missions.length} missões
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {missions.map((mission) => {
                  const current = mission.progress?.current_value || 0;
                  const target = mission.target_value || 1;
                  const missionPercent = Math.min(100, Math.round((current / target) * 100));
                  const completed = mission.progress?.completed;

                  return (
                    <article
                      key={mission.id}
                      className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.07]"
                    >
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-['Rajdhani'] text-xl font-bold uppercase text-white">
                            {mission.title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-[var(--dl-muted-light)]">
                            {mission.description}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[0.62rem] ${
                            completed
                              ? 'border border-[var(--dl-string)]/30 bg-[var(--dl-string)]/10 text-[var(--dl-string)]'
                              : 'border border-[var(--dl-warning)]/30 bg-[var(--dl-warning)]/10 text-[var(--dl-warning)]'
                          }`}
                        >
                          {completed ? 'feito' : `${current}/${target}`}
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-white/[0.08] p-[2px]">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,var(--dl-number),var(--dl-string),var(--dl-warning))]"
                          style={{ width: `${missionPercent}%` }}
                        />
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 font-mono text-[0.68rem] text-[var(--dl-muted)]">
                          +{mission.points_reward}
                          <img src={duoCoinIcon16} alt="DC" className="h-4 w-4 drop-shadow-[0_0_4px_rgba(255,209,102,0.3)]" />
                          <span>pts</span>
                        </span>

                        <button 
                          onClick={() => onClaimTask(mission.id)}
                          disabled={completed || submittingTaskId === mission.id}
                          className="rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-2 font-['Inter'] text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[var(--dl-muted-light)] transition hover:bg-white/[0.07] hover:text-white disabled:opacity-50"
                        >
                          {completed ? 'Concluída' : submittingTaskId === mission.id ? 'Registrando...' : 'Registrar'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Leaderboard */}
            {/* UI_MARKER: vault.leaderboard.205 | Ranking do Cofre */}
            <section
              data-ui-id={UI_MARKERS.vault.leaderboard.id}
              data-ui-label={UI_MARKERS.vault.leaderboard.label}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl"
            >
              <UiMarker {...UI_MARKERS.vault.leaderboard} />
              <div className="mb-5 flex items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
                <div>
                  <span className="font-['Inter'] text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--dl-number)]">
                    ↳ Ranking do Cofre
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
                    className="grid grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-white/[0.05] bg-black/20 px-3 py-3"
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

                    <span className="inline-flex items-center gap-1 font-mono text-sm font-bold text-[var(--dl-string)]">
                      {entry.points}
                      <img src={duoCoinIcon16} alt="DC" className="h-4 w-4" />
                      <span>pts</span>
                    </span>
                  </div>
                ))}
              </div>
            </section>

          </div>

          <aside className="space-y-6">
            
            {/* Rewards */}
            {/* UI_MARKER: vault.rewards.206 | Recompensas */}
            <section
              data-ui-id={UI_MARKERS.vault.rewards.id}
              data-ui-label={UI_MARKERS.vault.rewards.label}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl"
            >
              <UiMarker {...UI_MARKERS.vault.rewards} />
              <span className="font-['Inter'] text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--dl-warning)]">
                ↳ Recompensas
              </span>

              <h2 className="mt-3 font-['Rajdhani'] text-3xl font-bold uppercase text-white">
                O que está dentro do Cofre
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
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
              className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl"
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
              className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl"
            >
              <UiMarker {...UI_MARKERS.vault.seasonHistory} />
              <span className="font-['Inter'] text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--dl-function)]">
                ↳ Histórico
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
    </div>
  );
};
