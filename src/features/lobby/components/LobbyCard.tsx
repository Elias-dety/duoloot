import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { Lobby } from '@/schemas/lobby.schema';

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
  density?: 'compact' | 'featured';
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

function toText(value: unknown, fallback = '---') {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function toBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : false;
}

function formatText(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getToneByRank(rank: string) {
  const normalized = rank.toLowerCase();

  if (normalized.includes('radiante') || normalized.includes('imortal')) {
    return {
      primary: '#ffd166',
      border: 'rgba(255,209,102,.34)',
      bg: 'rgba(255,209,102,.10)',
      glow: 'rgba(255,209,102,.18)',
    };
  }

  if (normalized.includes('ascendente') || normalized.includes('diamante')) {
    return {
      primary: '#b084ff',
      border: 'rgba(176,132,255,.34)',
      bg: 'rgba(176,132,255,.10)',
      glow: 'rgba(176,132,255,.18)',
    };
  }

  if (normalized.includes('platina') || normalized.includes('ouro')) {
    return {
      primary: '#0df0ff',
      border: 'rgba(13,240,255,.34)',
      bg: 'rgba(13,240,255,.10)',
      glow: 'rgba(13,240,255,.18)',
    };
  }

  return {
    primary: '#3bd982',
    border: 'rgba(59,217,130,.34)',
    bg: 'rgba(59,217,130,.10)',
    glow: 'rgba(59,217,130,.18)',
  };
}

function buildTags(profile: Record<string, unknown>, role: string, mic: boolean, rank: string, region: string): ProfileTag[] {
  const playStyle = toText(profile.playStyle, '');
  const sessionFocus = toText(profile.sessionFocus, '');

  return [
    { label: mic ? 'Mic ON' : 'Mic OFF', emoji: mic ? '🎙️' : '🔇', type: mic ? 'green' : 'orange' },
    role !== '---' ? { label: formatText(role), emoji: '🎯', type: 'yellow' as const } : null,
    rank !== '---' ? { label: formatText(rank), emoji: '🏆', type: 'blue' as const } : null,
    playStyle ? { label: formatText(playStyle), emoji: '🔥', type: 'orange' as const } : null,
    sessionFocus ? { label: formatText(sessionFocus), emoji: '🧭', type: 'pink' as const } : null,
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

function getTagClassName(type: TagTone) {
  const map = {
    green: 'border-[rgba(59,217,130,.24)] bg-[rgba(59,217,130,.08)] text-[var(--dl-string)]',
    orange: 'border-[rgba(255,209,102,.24)] bg-[rgba(255,209,102,.08)] text-[var(--dl-warning)]',
    blue: 'border-[rgba(13,240,255,.24)] bg-[rgba(13,240,255,.08)] text-[var(--dl-number)]',
    yellow: 'border-[rgba(255,209,102,.24)] bg-[rgba(255,209,102,.08)] text-[var(--dl-warning)]',
    pink: 'border-[rgba(176,132,255,.24)] bg-[rgba(176,132,255,.08)] text-[var(--dl-function)]',
  };

  return map[type];
}

export const LobbyCard: React.FC<LobbyCardProps> = ({
  lobby,
  onJoin,
  onLeave,
  isJoining,
  isLeaving,
  isJoined,
  isOwner,
  density = 'compact',
}) => {
  const navigate = useNavigate();
  const ownerName = lobby.owner?.name || 'Player desconhecido';
  const ownerId = lobby.owner?.id;
  const profile = { ...(lobby.metadata || {}), ...(lobby.owner?.gameProfile || {}) } as Record<string, unknown>;

  const slotsTotal = Math.max(2, Number(lobby.slotsTotal) || 5);
  const slotsFilled = Math.max(0, Math.min(slotsTotal, Number(lobby.slotsFilled) || 0));
  const openSlots = Math.max(0, slotsTotal - slotsFilled);
  const isFull = lobby.status === 'full' || openSlots === 0;
  const isClosed = lobby.status === 'closed';
  const matchPercent = clampPercent(lobby.compatibilityScore ?? 0);

  const mode = formatText(lobby.mode || 'Modo indefinido');
  const queue = formatText(lobby.queue || 'Fila aberta');
  const role = toText(profile.mainRole || lobby.metadata?.mainRole, '---');
  const rank = toText(profile.currentRank || profile.rank || lobby.metadata?.currentRank || lobby.minRank, '---');
  const region = toText(profile.region || lobby.metadata?.region, '---');
  const mic = toBoolean(profile.microphone ?? lobby.metadata?.microphone);
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

  const tone = getToneByRank(rank);
  const tags = buildTags(profile, role, mic, rank, region).slice(0, density === 'featured' ? 6 : 4);

  const statusLabel = isClosed
    ? 'Fechado'
    : isFull
      ? 'Cheio'
      : lobby.owner?.status === 'online'
        ? 'Online'
        : 'Ativo';

  const statusClassName = isClosed || isFull
    ? 'border-[rgba(255,70,85,.32)] bg-[rgba(255,70,85,.10)] text-[var(--dl-keyword)]'
    : 'border-[rgba(59,217,130,.34)] bg-[rgba(59,217,130,.10)] text-[var(--dl-string)]';

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

  const handleDetails = () => {
    if (ownerId) {
      navigate(ROUTES.PLAYER_PROFILE.replace(':playerId', ownerId));
    }
  };

  const cardStyle = {
    '--rank-primary': tone.primary,
    '--rank-border': tone.border,
    '--rank-bg': tone.bg,
    '--rank-glow': tone.glow,
  } as React.CSSProperties & Record<string, string>;

  const slots = Array.from({ length: slotsTotal }).map((_, index) => {
    const isFilled = index < slotsFilled;

    return (
      <div
        key={index}
        className={
          isFilled
            ? 'grid aspect-square place-items-center rounded-full border border-[var(--rank-border)] bg-[radial-gradient(circle_at_50%_35%,var(--rank-bg),rgba(3,8,14,.9)_67%)] text-[var(--rank-primary)] shadow-[0_0_12px_var(--rank-glow)]'
            : 'grid aspect-square place-items-center rounded-full border border-dashed border-[rgba(180,190,205,.42)] bg-white/[0.02] text-base font-light text-[rgba(245,247,250,.72)]'
        }
        aria-label={isFilled ? 'Jogador no lobby' : 'Vaga aberta'}
      >
        {isFilled ? (
          <span className="block [&>svg]:h-4 [&>svg]:w-4">
            <PersonIcon />
          </span>
        ) : (
          '+'
        )}
      </div>
    );
  });

  return (
    <article
      style={cardStyle}
      className="group relative min-w-0 overflow-hidden rounded-[1.45rem] border border-white/[0.09] bg-[radial-gradient(circle_at_15%_0%,var(--rank-glow),transparent_11rem),linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,.018)),linear-gradient(145deg,#101719,#0c1011_66%,#111617)] p-4 shadow-[0_24px_46px_rgba(0,0,0,.34),inset_0_1px_0_rgba(255,255,255,.065)] transition duration-300 hover:-translate-y-1 hover:border-[var(--rank-border)] hover:shadow-[0_30px_58px_rgba(0,0,0,.42),0_0_28px_var(--rank-glow)]"
    >
      <div className="pointer-events-none absolute right-[-0.3rem] top-16 text-[4.2rem] font-black leading-none tracking-[-0.28rem] text-[var(--rank-primary)] opacity-[0.09] [writing-mode:vertical-rl]">
        {matchPercent || 'DUO'}
      </div>

      <header className="relative z-[2] mb-3 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2.5">
        <div className={`inline-flex min-h-[28px] shrink-0 items-center justify-center gap-1.5 rounded-full border px-2.5 text-[0.6rem] font-black uppercase tracking-[0.08em] ${statusClassName}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_10px_currentColor]" />
          {statusLabel}
        </div>

        <p className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-['Inter'] text-[0.72rem] font-semibold leading-snug text-[rgba(235,239,246,.58)]">
          {shortDescription}
        </p>
      </header>

      <section className="relative z-[2] grid grid-cols-[62px_minmax(0,1fr)] items-center gap-3 border-b border-[var(--rank-border)] pb-3.5">
        <div className="relative grid h-[62px] w-[62px] shrink-0 place-items-center rounded-[1rem] border border-[var(--rank-border)] bg-[linear-gradient(145deg,var(--rank-bg),rgba(3,8,15,.96))] text-[var(--rank-primary)] shadow-[0_0_20px_var(--rank-glow),inset_0_0_0_1px_var(--rank-border)]">
          <span className="font-mono text-xl font-black uppercase">{ownerName.slice(0, 2)}</span>
        </div>

        <div className="min-w-0">
          <h3 className="m-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[1.55rem] font-black uppercase leading-[.9] tracking-[-0.04em] text-white sm:text-[1.72rem]">
            {ownerName}
          </h3>

          <div className="mt-1.5 flex min-w-0 items-center gap-1.5 overflow-hidden text-[0.76rem] font-black sm:text-[0.8rem]">
            <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[var(--rank-primary)]">
              {formatText(role)}
            </span>
            <span className="shrink-0 text-[rgba(160,180,205,.36)]">•</span>
            <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[var(--dl-warning)]">
              {formatText(mainAgent)}
            </span>
          </div>
        </div>
      </section>

      <section className="relative z-[2] border-b border-[rgba(160,180,205,.12)] py-3.5">
        <div className="mb-2.5 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--rank-border)] bg-[var(--rank-bg)] px-2.5 py-2 shadow-[0_0_14px_var(--rank-glow)]">
            <span className="text-[var(--rank-primary)] [&>svg]:h-4 [&>svg]:w-4">
              <PersonIcon />
            </span>
            <span className="whitespace-nowrap text-[1.25rem] font-black leading-none text-white">
              {slotsFilled}/{slotsTotal}
            </span>
          </div>

          <div className="text-right">
            <span className="block text-[0.58rem] font-black uppercase tracking-[0.12em] text-[rgba(238,241,246,.52)]">
              {openSlots === 0 ? 'Status' : 'Falta'}
            </span>
            <strong className="block text-[0.98rem] leading-none text-white">
              {openSlots === 0 ? 'Completo' : `${openSlots} vaga${openSlots > 1 ? 's' : ''}`}
            </strong>
          </div>
        </div>

        <div className="grid grid-cols-5 items-center gap-1.5">
          {slots.slice(0, 5)}
        </div>
      </section>

      <section className="relative z-[2] border-b border-[rgba(160,180,205,.12)] py-3.5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[0.78rem] font-black uppercase tracking-[.08em] text-[var(--dl-number)]">
            Matchmaking
          </span>

          <span className="whitespace-nowrap text-[1.65rem] font-black leading-none text-[var(--dl-warning)]">
            {matchPercent}%
          </span>
        </div>

        <div className="h-2.5 rounded-full bg-[rgba(160,180,205,.13)] p-[2px] shadow-[inset_0_0_0_1px_rgba(160,180,205,.08)]">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,var(--dl-number)_0%,var(--dl-string)_42%,var(--dl-warning)_100%)] shadow-[0_0_14px_rgba(20,216,255,.16)]"
            style={{ width: `${matchPercent}%` }}
          />
        </div>

        <p className="mt-2 line-clamp-1 text-[0.68rem] font-semibold leading-snug text-[rgba(235,239,246,.46)]">
          {matchPercent >= 80
            ? 'Compatibilidade excelente.'
            : matchPercent >= 60
              ? 'Alta compatibilidade.'
              : matchPercent >= 40
                ? 'Compatibilidade média.'
                : 'Baixa compatibilidade.'}
        </p>
      </section>

      <section className="relative z-[2] grid gap-2 py-3">
        <div className="grid grid-cols-2 gap-2 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[rgba(235,239,246,.58)]">
          <span className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-2.5 py-2">{mode}</span>
          <span className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-2.5 py-2">{queue}</span>
        </div>

        <div className="flex min-h-[2.3rem] flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={`${tag.emoji}-${tag.label}`} className={`rounded-full border px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.06em] ${getTagClassName(tag.type)}`}>
              {tag.emoji} {tag.label}
            </span>
          ))}
        </div>
      </section>

      <footer className="relative z-[2] grid grid-cols-2 gap-2.5 pt-1">
        <button
          type="button"
          className="inline-flex min-h-[42px] min-w-0 items-center justify-center rounded-xl border border-[rgba(160,180,205,.17)] bg-[linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02))] px-3 text-[0.76rem] font-black uppercase tracking-[.08em] text-[rgba(245,247,250,.80)] transition hover:-translate-y-0.5 hover:bg-white/[.07] disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleDetails}
          disabled={!ownerId}
        >
          Ver perfil
        </button>

        <button
          type="button"
          className={`inline-flex min-h-[42px] min-w-0 items-center justify-center rounded-xl px-3 text-[0.76rem] font-black uppercase tracking-[.08em] text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 ${
            actionDisabled
              ? 'border border-[rgba(160,180,205,.17)] bg-white/[.05]'
              : 'bg-[linear-gradient(135deg,#ff304b,#ff3f72_62%,#ff477a)] shadow-[0_10px_20px_rgba(255,63,102,.16),inset_0_1px_0_rgba(255,255,255,.18)]'
          }`}
          disabled={actionDisabled}
          onClick={handlePrimaryAction}
        >
          {actionLabel}
        </button>
      </footer>
    </article>
  );
};
