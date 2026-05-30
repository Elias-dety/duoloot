import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

import { DuoFrame } from '@/components/atoms';
import { getGameRankTheme } from '@/features/ranks';
import { Lobby } from '@/schemas/lobby.schema';
import { getPlayerKarma, type KarmaSummary } from '@/services/karma.service';
import { LobbyRulesSummary } from './LobbyRulesSummary';

type KarmaLevel = 'baixo' | 'neutro' | 'alto';
type TagTone = 'green' | 'orange' | 'blue' | 'yellow' | 'pink';

type ProfileTag = {
  label: string;
  emoji: string;
  type: TagTone;
};

export interface LobbyCardProps {
  lobby: Lobby;
  onJoin?: (id: string) => void;
  onLeave?: (id: string) => void;
  isJoining?: boolean;
  isLeaving?: boolean;
  isJoined?: boolean;
  isOwner?: boolean;
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

function getKarmaLevel(score: number, hasSummary: boolean): KarmaLevel {
  if (!hasSummary) return 'neutro';
  if (score <= -10) return 'baixo';
  if (score >= 50) return 'alto';
  return 'neutro';
}

function getKarmaLabel(level: KarmaLevel) {
  if (level === 'baixo') return 'Karma baixo';
  if (level === 'neutro') return 'Karma neutro';
  return 'Karma alto';
}

function formatKarmaScore(score: number) {
  return score > 0 ? `+${score}` : String(score);
}

function toText(value: unknown, fallback = '---') {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function toBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : false;
}

function buildTags(profile: Record<string, unknown>, role: string, mic: boolean, rank: string, region: string): ProfileTag[] {
  const playStyle = toText(profile.playStyle, '');
  const sessionFocus = toText(profile.sessionFocus, '');

  return [
    { label: mic ? 'Mic ON' : 'Mic OFF', emoji: mic ? '🎙️' : '🔇', type: mic ? 'green' : 'orange' },
    role !== '---' ? { label: role, emoji: '🎯', type: 'yellow' as const } : null,
    rank !== '---' ? { label: rank, emoji: '🏆', type: 'blue' as const } : null,
    playStyle ? { label: playStyle, emoji: '🔥', type: 'orange' as const } : null,
    sessionFocus ? { label: sessionFocus, emoji: '🧭', type: 'pink' as const } : null,
    region !== '---' ? { label: region.toUpperCase(), emoji: '🌎', type: 'green' as const } : null,
  ].filter((tag): tag is ProfileTag => Boolean(tag));
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" />
      <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20V21H4V20Z" />
    </svg>
  );
}

export const LobbyCard: React.FC<LobbyCardProps> = ({
  lobby,
  onJoin,
  onLeave,
  isJoining,
  isLeaving,
  isJoined,
  isOwner,
}) => {
  const navigate = useNavigate();
  const [karmaSummary, setKarmaSummary] = useState<KarmaSummary | null>(null);
  const [isKarmaLoading, setIsKarmaLoading] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const ownerName = lobby.owner?.name || 'Player desconhecido';
  const ownerId = lobby.owner?.id;
  const profile = { ...(lobby.metadata || {}), ...(lobby.owner?.gameProfile || {}) } as Record<string, unknown>;

  const slotsTotal = Math.max(2, Number(lobby.slotsTotal) || 5);
  const slotsFilled = Math.max(0, Math.min(slotsTotal, Number(lobby.slotsFilled) || 0));
  const openSlots = Math.max(0, slotsTotal - slotsFilled);
  const isFull = lobby.status === 'full' || openSlots === 0;
  const isClosed = lobby.status === 'closed';

  const matchPercent = clampPercent(lobby.compatibilityScore ?? 0);

  const karmaScore = karmaSummary?.karmaGeral ?? 0;
  const hasKarmaSummary = Boolean(karmaSummary);
  const karmaLevel = getKarmaLevel(karmaScore, hasKarmaSummary);
  const karmaBadgeLabel = isKarmaLoading ? 'Carregando' : hasKarmaSummary ? getKarmaLabel(karmaLevel) : 'Sem Karma';
  const karmaDetailLabel = isKarmaLoading
    ? 'Buscando Karma...'
    : hasKarmaSummary
      ? `${formatKarmaScore(karmaScore)} pontos • ${karmaSummary?.totalPartidasAvaliadas ?? 0} avaliações`
      : 'Jogador ainda sem avaliações';

  const game = toText(profile.mainGame || lobby.metadata?.mainGame, 'Jogo indefinido');
  const mode = lobby.mode || 'Modo indefinido';
  const queue = lobby.queue || 'Fila aberta';
  const role = toText(profile.mainRole || lobby.metadata?.mainRole, '---');
  const rank = toText(profile.currentRank || profile.rank || lobby.metadata?.currentRank || lobby.minRank, '---');
  const rankTheme = getGameRankTheme({ game: 'valorant', rank });
  const [avatarRankIconSrc, setAvatarRankIconSrc] = useState(rankTheme.icon || rankTheme.fallbackIcon || null);
  const region = toText(profile.region || lobby.metadata?.region, '---');
  const mic = toBoolean(profile.microphone ?? lobby.metadata?.microphone);
  const description = toText(profile.bio || lobby.metadata?.bio, 'Procuro squad para jogar com comunicação, foco e lobby organizado.');
  const mainAgent = toText(
    profile.mainAgent ||
      profile.favoriteAgent ||
      profile.mostPlayedAgent ||
      lobby.metadata?.mainAgent ||
      lobby.metadata?.favoriteAgent ||
      lobby.metadata?.mostPlayedAgent,
    'Agente indefinido'
  );
  const shortDescription = toText(
    profile.shortDescription ||
      profile.tagline ||
      lobby.metadata?.shortDescription ||
      lobby.metadata?.tagline ||
      profile.bio ||
      lobby.metadata?.bio,
    'Call limpa, foco competitivo e lobby organizado.'
  );

  useEffect(() => {
    setAvatarRankIconSrc(rankTheme.icon || rankTheme.fallbackIcon || null);
  }, [rankTheme.icon, rankTheme.fallbackIcon]);

  useEffect(() => {
    let isMounted = true;

    if (!ownerId) {
      setKarmaSummary(null);
      setIsKarmaLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setIsKarmaLoading(true);

    getPlayerKarma(ownerId)
      .then((summary) => {
        if (isMounted) setKarmaSummary(summary);
      })
      .catch((error) => {
        console.error(error);
        if (isMounted) setKarmaSummary(null);
      })
      .finally(() => {
        if (isMounted) setIsKarmaLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [ownerId]);

  const tags = buildTags(profile, role, mic, rank, region);

  const statusLabel = isClosed
    ? 'Fechado'
    : isFull
      ? 'Cheio'
      : lobby.owner?.status === 'online'
        ? 'Online'
        : 'Ativo';

  const statusClassName = isClosed || isFull
    ? 'border-[rgba(255,63,102,.32)] bg-[rgba(255,63,102,.10)] text-[#ff3f66]'
    : 'border-[rgba(35,209,139,.34)] bg-[rgba(35,209,139,.10)] text-[#27e58a]';

  const actionDisabled = isClosed || isJoining || isLeaving || (!isJoined && isFull);
  const actionLabel = isLeaving
    ? isOwner ? 'Fechando...' : 'Saindo...'
    : isJoining
      ? 'Entrando...'
      : isOwner
        ? 'Fechar'
        : isJoined
          ? 'Sair'
          : isClosed
            ? 'Fechado'
            : isFull
              ? 'Cheio'
              : 'Entrar';

  const handlePrimaryAction = () => {
    if (isJoined) {
      onLeave?.(lobby.id);
      return;
    }

    onJoin?.(lobby.id);
  };

  const renderSlots = () =>
    Array.from({ length: slotsTotal }).map((_, index) => {
      const isFilled = index < slotsFilled;

      return (
        <div
          key={index}
          className={
            isFilled
              ? 'grid aspect-square w-full max-w-16 place-items-center rounded-full border-2 border-[#16d7ff] bg-[radial-gradient(circle_at_50%_35%,rgba(20,216,255,.18),rgba(3,8,14,.9)_67%)] text-[#16d7ff] shadow-[0_0_16px_rgba(20,216,255,.18)]'
              : 'grid aspect-square w-full max-w-16 place-items-center rounded-full border-2 border-dashed border-[rgba(180,190,205,.42)] bg-white/[0.02] text-3xl font-light text-[rgba(245,247,250,.72)]'
          }
          aria-label={isFilled ? 'Jogador no lobby' : 'Vaga aberta'}
        >
          {isFilled ? (
            <span className="block [&>svg]:h-7 [&>svg]:w-7">
              <PersonIcon />
            </span>
          ) : (
            '+'
          )}
        </div>
      );
    });

  return (
    <>
      <DuoFrame
        variant="default"
        thickness="md"
        radius="xl"
        className="w-full"
        screenClassName="p-2"
      >
        <article className="relative overflow-hidden rounded-[1.75rem] border-0 bg-[linear-gradient(135deg,rgba(20,216,255,.08),transparent_28%),linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.012)),linear-gradient(145deg,#08111d,#050a12_66%,#08111b)] p-5 shadow-[0_22px_54px_rgba(0,0,0,.32),0_0_38px_rgba(20,216,255,.06)] md:p-6">
          <header className="relative z-[2] mb-5 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
            <div
              className={`inline-flex min-h-[38px] items-center justify-center gap-2 rounded-full border px-4 text-[0.78rem] font-black uppercase tracking-[0.09em] ${statusClassName}`}
            >
              <span className="h-2 w-2 rounded-full bg-current shadow-[0_0_14px_currentColor]" />
              {statusLabel}
            </div>

            <div className="min-w-0 overflow-hidden">
              <p className="m-0 overflow-hidden whitespace-nowrap font-['Inter'] text-[0.92rem] font-semibold leading-snug text-[rgba(235,239,246,.58)] [mask-image:linear-gradient(90deg,#000_0%,#000_78%,transparent_100%)] [-webkit-mask-image:linear-gradient(90deg,#000_0%,#000_78%,transparent_100%)]">
                {shortDescription}
              </p>
            </div>
          </header>

          <section className="relative z-[2] grid items-center gap-5 border-b-2 border-[rgba(160,180,205,.16)] pb-6 md:grid-cols-[116px_minmax(0,1fr)_minmax(180px,218px)]">
            <div className="grid h-[116px] w-[116px] place-items-center rounded-[1.65rem] border-2 border-[rgba(20,216,255,.72)] bg-[linear-gradient(145deg,rgba(13,31,48,.92),rgba(3,8,15,.96))] shadow-[0_0_28px_rgba(20,216,255,.18),inset_0_0_0_1px_rgba(140,98,255,.22)]">
              {avatarRankIconSrc ? (
                <img
                  src={avatarRankIconSrc}
                  alt={`Elo ${rankTheme.label}`}
                  className="h-[84px] w-[84px] object-contain drop-shadow-[0_0_16px_rgba(20,216,255,.32)]"
                  loading="lazy"
                  onError={() => {
                    setAvatarRankIconSrc((currentSrc) => {
                      if (rankTheme.fallbackIcon && currentSrc !== rankTheme.fallbackIcon) {
                        return rankTheme.fallbackIcon;
                      }
                      return null;
                    });
                  }}
                />
              ) : (
                <span className="font-['Rajdhani'] text-3xl font-black text-white">?</span>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="m-0 overflow-hidden text-ellipsis whitespace-nowrap font-['Rajdhani'] text-[clamp(2.6rem,5.4vw,4rem)] font-black uppercase leading-[.88] tracking-[.02em] text-white">
                {ownerName}
              </h3>

              <div className="mt-3 flex min-w-0 flex-wrap items-center gap-3 text-[clamp(1.18rem,2.5vw,1.6rem)] font-black">
                <span className="inline-flex items-center gap-2 whitespace-nowrap text-[#16d7ff]">
                  {role}
                </span>

                <span className="h-7 w-px bg-[rgba(160,180,205,.25)]" />

                <span className="inline-flex items-center gap-2 whitespace-nowrap text-[#ffd166]">
                  {mainAgent}
                </span>
              </div>
            </div>

            <div className="grid min-h-[76px] grid-cols-[auto_1fr_auto_auto] items-center gap-3 rounded-2xl border-2 border-[rgba(160,180,205,.18)] bg-[rgba(8,14,24,.56)] px-4 py-3">
              <span className="text-[rgba(225,238,255,.76)] [&>svg]:h-6 [&>svg]:w-6">
                <PersonIcon />
              </span>

              <span className="whitespace-nowrap text-[clamp(1.75rem,4vw,2.6rem)] font-black leading-none text-white">
                {slotsFilled} / {slotsTotal}
              </span>

              <span className="h-11 w-px bg-[rgba(160,180,205,.2)]" />

              <span className="grid text-center">
                <small className="text-[0.68rem] font-black uppercase tracking-[0.08em] text-[rgba(238,241,246,.62)]">
                  {openSlots === 0 ? 'Status' : 'Falta'}
                </small>
                <strong className="text-[1.75rem] leading-none text-white">
                  {openSlots === 0 ? 'OK' : openSlots}
                </strong>
              </span>
            </div>
          </section>

          <section className="relative z-[2] grid items-center gap-6 border-b-2 border-[rgba(160,180,205,.12)] py-6 md:grid-cols-[minmax(240px,1fr)_2px_minmax(240px,1fr)]">
            <div className="grid grid-cols-5 items-center gap-2">
              {renderSlots()}
            </div>

            <div className="hidden h-[102px] w-px bg-[rgba(160,180,205,.18)] md:block" />

            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[clamp(1.25rem,2.4vw,1.7rem)] font-black uppercase tracking-[.04em] text-[#16d7ff]">
                Matchmaking
              </div>

              <div className="whitespace-nowrap text-[clamp(1.75rem,4vw,2.6rem)] font-black leading-none text-[#ffd166]">
                {matchPercent}%
              </div>

              <div className="col-span-2 h-5 rounded-full bg-[rgba(160,180,205,.13)] p-[3px] shadow-[inset_0_0_0_2px_rgba(160,180,205,.08)]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#14d8ff_0%,#20ddca_42%,#ffd166_100%)] shadow-[0_0_18px_rgba(20,216,255,.18)]"
                  style={{ width: `${matchPercent}%` }}
                />
              </div>

              <div className="col-span-2 text-sm font-semibold leading-snug text-[rgba(235,239,246,.48)]">
                {matchPercent >= 80
                  ? 'Compatibilidade excelente com seu perfil.'
                  : matchPercent >= 60
                    ? 'Alta compatibilidade com seu perfil.'
                    : matchPercent >= 40
                      ? 'Compatibilidade média. Vale revisar.'
                      : 'Baixa compatibilidade para este lobby.'}
              </div>
            </div>
          </section>

          <footer className="relative z-[2] grid grid-cols-1 gap-4 pt-6 sm:grid-cols-[1fr_1.08fr]">
            <button
              type="button"
              className="inline-flex min-h-[64px] items-center justify-center gap-3 rounded-[1.125rem] border-2 border-[rgba(160,180,205,.17)] bg-[linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02))] px-4 text-[clamp(1.1rem,2.5vw,1.55rem)] font-black tracking-[.06em] text-[rgba(245,247,250,.80)] transition hover:-translate-y-0.5 hover:bg-white/[.07]"
              onClick={() => setIsDetailsOpen(true)}
            >
              Ver mais
            </button>

            <button
              type="button"
              className={`inline-flex min-h-[64px] items-center justify-center gap-3 rounded-[1.125rem] px-4 text-[clamp(1.1rem,2.5vw,1.55rem)] font-black tracking-[.06em] text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 ${
                actionDisabled
                  ? 'border-2 border-[rgba(160,180,205,.17)] bg-white/[.05]'
                  : 'bg-[linear-gradient(135deg,#ff304b,#ff3f72_62%,#ff477a)] shadow-[0_14px_28px_rgba(255,63,102,.18),inset_0_1px_0_rgba(255,255,255,.18)]'
              }`}
              disabled={actionDisabled}
              onClick={handlePrimaryAction}
            >
              {actionLabel}
            </button>
          </footer>
        </article>
      </DuoFrame>

      {isDetailsOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-5 backdrop-blur-xl"
          onClick={() => setIsDetailsOpen(false)}
        >
          <div
            className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] border border-[rgba(22,215,255,.24)] bg-[radial-gradient(circle_at_20%_0%,rgba(22,215,255,.12),transparent_18rem),radial-gradient(circle_at_90%_20%,rgba(255,63,102,.10),transparent_16rem),rgba(5,9,18,.96)] p-6 shadow-[0_30px_90px_rgba(0,0,0,.55)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="font-['Rajdhani'] text-4xl font-black uppercase leading-none text-white">
              Lobby de {ownerName}
            </h3>

            <p className="mt-4 text-sm leading-relaxed text-[var(--dl-muted-light)]">
              {description}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
                <small className="block text-[0.68rem] font-black uppercase tracking-[0.12em] text-[var(--dl-muted)]">
                  Função
                </small>
                <strong className="mt-1 block text-white">{role}</strong>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
                <small className="block text-[0.68rem] font-black uppercase tracking-[0.12em] text-[var(--dl-muted)]">
                  Agente
                </small>
                <strong className="mt-1 block text-white">{mainAgent}</strong>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
                <small className="block text-[0.68rem] font-black uppercase tracking-[0.12em] text-[var(--dl-muted)]">
                  Lobby
                </small>
                <strong className="mt-1 block text-white">{slotsFilled}/{slotsTotal}</strong>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
                <small className="block text-[0.68rem] font-black uppercase tracking-[0.12em] text-[var(--dl-muted)]">
                  Match
                </small>
                <strong className="mt-1 block text-white">{matchPercent}%</strong>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
                <small className="block text-[0.68rem] font-black uppercase tracking-[0.12em] text-[var(--dl-muted)]">
                  Jogo
                </small>
                <strong className="mt-1 block text-white">{game}</strong>
                <span className="mt-1 block text-xs text-[var(--dl-muted-light)]">{mode} • {queue}</span>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
                <small className="block text-[0.68rem] font-black uppercase tracking-[0.12em] text-[var(--dl-muted)]">
                  Comunicação
                </small>
                <strong className="mt-1 block text-white">{mic ? 'Mic ON' : 'Mic OFF'}</strong>
                <span className="mt-1 block text-xs text-[var(--dl-muted-light)]">{region}</span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <small className="block text-[0.68rem] font-black uppercase tracking-[0.12em] text-[var(--dl-muted)]">
                    Karma
                  </small>
                  <strong className="mt-1 block text-white">{karmaBadgeLabel}</strong>
                </div>
                <span className="rounded-full border border-[rgb(var(--dl-string-rgb)/0.24)] bg-[rgb(var(--dl-string-rgb)/0.14)] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.08em] text-[var(--dl-string)]">
                  {karmaDetailLabel}
                </span>
              </div>
            </div>

            {tags.length > 0 ? (
              <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
                <small className="block text-[0.68rem] font-black uppercase tracking-[0.12em] text-[var(--dl-muted)]">
                  Tags
                </small>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={`${tag.label}-${tag.emoji}`}
                      className={`inline-flex min-w-0 items-center gap-2 rounded-full border px-3 py-2 text-sm font-extrabold text-[#edf1ff] ${
                        tag.type === 'green'
                          ? 'border-[rgb(var(--dl-string-rgb)/0.26)] bg-[rgb(var(--dl-string-rgb)/0.14)]'
                          : tag.type === 'orange'
                            ? 'border-[rgba(251,146,60,.26)] bg-[rgba(251,146,60,.14)]'
                            : tag.type === 'blue'
                              ? 'border-[rgba(22,215,255,.24)] bg-[rgba(22,215,255,.10)]'
                              : tag.type === 'yellow'
                                ? 'border-[rgba(250,204,21,.26)] bg-[rgba(250,204,21,.14)]'
                                : 'border-[rgba(244,114,182,.26)] bg-[rgba(244,114,182,.14)]'
                      }`}
                    >
                      <span aria-hidden="true">{tag.emoji}</span>
                      <span className="break-words">{tag.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <LobbyRulesSummary metadata={lobby.metadata} />

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="min-h-12 rounded-2xl border border-white/[0.10] bg-white/[0.06] px-4 font-black text-white"
                disabled={!lobby.owner?.id}
                onClick={() => {
                  setIsDetailsOpen(false);
                  navigate(ROUTES.PLAYER_PROFILE.replace(':playerId', lobby.owner?.id || ''));
                }}
              >
                Ver perfil
              </button>

              <button
                type="button"
                className="min-h-12 rounded-2xl bg-[linear-gradient(135deg,#ff304b,#ff3f72_62%,#ff477a)] px-4 font-black text-white disabled:opacity-55"
                disabled={actionDisabled}
                onClick={handlePrimaryAction}
              >
                {actionLabel}
              </button>
            </div>

            <button
              type="button"
              className="mt-4 min-h-12 w-full rounded-2xl border border-white/[0.10] bg-white/[0.06] px-4 font-black text-white"
              onClick={() => setIsDetailsOpen(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};
