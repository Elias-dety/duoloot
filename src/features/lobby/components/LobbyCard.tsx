import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

import { Lobby } from '@/schemas/lobby.schema';
import { LobbyRulesSummary } from './LobbyRulesSummary';

type MatchLevel = 'vou_carregar' | 'mesmo_nivel' | 'vai_me_carregar';
type KarmaLevel = 'baixo' | 'neutro' | 'alto';
type TagTone = 'green' | 'orange' | 'blue' | 'yellow' | 'pink';

type ProfileTag = {
  label: string;
  emoji: string;
  type: TagTone;
};

type CssVars = React.CSSProperties & Record<'--match-position' | '--karma-position', string>;

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

function getMatchLevel(matchPercent: number): MatchLevel {
  if (matchPercent <= 33) return 'vou_carregar';
  if (matchPercent <= 66) return 'mesmo_nivel';
  return 'vai_me_carregar';
}

function getMatchLabel(level: MatchLevel) {
  if (level === 'vou_carregar') return 'Vou carregar';
  if (level === 'mesmo_nivel') return 'Mesmo nível';
  return 'Vai me carregar';
}

function getKarmaPosition(level: KarmaLevel) {
  if (level === 'baixo') return '16%';
  if (level === 'neutro') return '50%';
  return '83%';
}

function getKarmaLabel(level: KarmaLevel) {
  if (level === 'baixo') return 'Karma baixo';
  if (level === 'neutro') return 'Karma neutro';
  return 'Karma alto';
}

function toText(value: unknown, fallback = '---') {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function toBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : false;
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'DL';
}

function getRoleHint(role: string) {
  const normalized = role.toLowerCase();
  if (normalized.includes('duel')) return 'Entrada e pressão no combate';
  if (normalized.includes('control')) return 'Controle de espaço e ritmo';
  if (normalized.includes('sentin')) return 'Defesa, leitura e cobertura';
  if (normalized.includes('initi') || normalized.includes('inici')) return 'Abertura de jogadas e informação';
  return 'Função principal no lobby';
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

function RoleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3L20 7L12 11L4 7L12 3Z" fill="currentColor" />
      <path d="M7 10L12 13L17 10V15L12 18L7 15V10Z" fill="currentColor" opacity="0.78" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 14C13.66 14 15 12.66 15 11V6C15 4.34 13.66 3 12 3C10.34 3 9 4.34 9 6V11C9 12.66 10.34 14 12 14Z" fill="currentColor" />
      <path d="M17.5 10.5C17.5 13.54 15.04 16 12 16C8.96 16 6.5 13.54 6.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 16V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
  const [showAllTags, setShowAllTags] = useState(false);

  const ownerName = lobby.owner?.name || 'Player desconhecido';
  const profile = { ...(lobby.metadata || {}), ...(lobby.owner?.gameProfile || {}) } as Record<string, unknown>;

  const slotsTotal = Math.max(2, Number(lobby.slotsTotal) || 5);
  const slotsFilled = Math.max(0, Math.min(slotsTotal, Number(lobby.slotsFilled) || 0));
  const openSlots = Math.max(0, slotsTotal - slotsFilled);
  const isFull = lobby.status === 'full' || openSlots === 0;
  const isClosed = lobby.status === 'closed';

  const matchPercent = clampPercent(lobby.compatibilityScore ?? 0);
  const matchLevel = getMatchLevel(matchPercent);
  const matchPosition = `${matchPercent}%`;

  // TODO: substituir por dado real de Karma quando o resumo `reputacao_jogador` estiver conectado ao card.
  const karmaLevel: KarmaLevel = 'alto';
  const karmaPosition = getKarmaPosition(karmaLevel);

  const game = toText(profile.mainGame || lobby.metadata?.mainGame, 'Jogo indefinido');
  const mode = lobby.mode || 'Modo indefinido';
  const queue = lobby.queue || 'Fila aberta';
  const role = toText(profile.mainRole || lobby.metadata?.mainRole, '---');
  const rank = toText(profile.currentRank || profile.rank || lobby.metadata?.currentRank || lobby.minRank, '---');
  const region = toText(profile.region || lobby.metadata?.region, '---');
  const mic = toBoolean(profile.microphone ?? lobby.metadata?.microphone);
  const description = toText(profile.bio || lobby.metadata?.bio, 'Procuro squad para jogar com comunicação, foco e lobby organizado.');
  const initials = getInitials(toText(profile.nickname, ownerName));

  // TODO: no futuro trocar tags derivadas por tags persistidas no banco.
  const tags = buildTags(profile, role, mic, rank, region);
  const visibleTags = showAllTags ? tags : tags.slice(0, 2);
  const hiddenCount = Math.max(0, tags.length - 2);

  const statusLabel = isClosed
    ? 'Fechado'
    : isFull
      ? 'Lobby cheio'
      : lobby.owner?.status === 'online'
        ? 'Online • Lobby ativo'
        : 'Lobby ativo';

  const statusTone = isClosed || isFull
    ? 'border-[rgb(var(--dl-error-rgb)/0.28)] bg-[rgb(var(--dl-error-rgb)/0.14)] text-[var(--dl-error)]'
    : 'border-[rgb(var(--dl-string-rgb)/0.28)] bg-[rgb(var(--dl-string-rgb)/0.14)] text-[var(--dl-string)]';

  const actionDisabled = isClosed || isJoining || isLeaving || (!isJoined && isFull);
  const actionLabel = isLeaving
    ? isOwner ? 'Fechando...' : 'Saindo...'
    : isJoining
      ? 'Entrando...'
      : isOwner
        ? 'Fechar lobby'
        : isJoined
          ? 'Sair do lobby'
          : isClosed
            ? 'Fechado'
            : isFull
              ? 'Lobby cheio'
              : 'Entrar no lobby';

  const handlePrimaryAction = () => {
    if (isJoined) {
      onLeave?.(lobby.id);
      return;
    }

    onJoin?.(lobby.id);
  };

  const cssVars = {
    '--match-position': matchPosition,
    '--karma-position': karmaPosition,
  } as CssVars;

  return (
    <article
      className="dl-panel flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[var(--dl-border)] bg-[linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.018))] p-0 shadow-[0_26px_70px_rgba(0,0,0,.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-white/5"
      style={{ ...cssVars, opacity: isClosed ? 0.72 : 1 }}
    >
      <div className="flex h-full flex-col p-5 sm:p-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 items-end gap-3 sm:gap-4">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-[1.5rem] border-4 border-[var(--dl-surface)] bg-[linear-gradient(135deg,var(--dl-primary),var(--dl-info))] text-2xl font-black text-white shadow-[0_10px_24px_rgba(0,0,0,.32)] sm:h-[84px] sm:w-[84px]">
              {initials}
            </div>
            <div className="min-w-0 pb-1">
              <h3 className="break-words font-['Rajdhani'] text-2xl font-black uppercase leading-none tracking-[-0.02em] text-white sm:text-3xl">
                {ownerName}
              </h3>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.08em] text-[var(--dl-muted-light)]">
                <span>{game}</span>
                <span>•</span>
                <span>{mode}</span>
                <span>•</span>
                <span>{queue}</span>
              </div>
            </div>
          </div>

          <div className={`w-fit rounded-full border px-3 py-2 text-center text-[11px] font-black uppercase tracking-[0.1em] ${statusTone}`}>
            {statusLabel}
          </div>
        </header>

        <section className="mt-5 rounded-[1.125rem] border border-[rgba(250,204,21,.34)] bg-[linear-gradient(135deg,rgba(250,204,21,.18),rgba(250,204,21,.06))] p-4 text-[#facc15]">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <small className="block text-[10px] font-black uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">Compatibilidade</small>
              <strong className="block text-3xl font-black leading-none text-[#facc15]">{matchPercent}% Match</strong>
            </div>
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[1rem] border border-[rgba(250,204,21,.28)] bg-[rgba(250,204,21,.13)] text-2xl" aria-hidden="true">
              ⭐
            </div>
          </div>

          <div className="relative h-3 rounded-full bg-[linear-gradient(90deg,#38bdf8_0_33.33%,#34d399_33.33%_66.66%,#facc15_66.66%_100%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,.13)]" aria-label={`Compatibilidade: ${getMatchLabel(matchLevel)}`}>
            <span className="absolute top-1/2 h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-[#facc15] bg-[var(--dl-text)] shadow-[0_0_14px_rgba(250,204,21,.45)] [left:var(--match-position)]" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] font-black uppercase leading-tight tracking-[0.06em]">
            <span className="text-[#38bdf8]">Vou carregar</span>
            <span className="text-[#34d399]">Mesmo nível</span>
            <span className="text-[#facc15]">Vai me carregar</span>
          </div>
        </section>

        <section className="mt-5">
          <h4 className="mb-3 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">Capacidade do lobby</h4>
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${slotsTotal}, minmax(0, 1fr))` }} aria-label={`${slotsFilled} jogadores no lobby e ${openSlots} vagas livres`}>
            {Array.from({ length: slotsTotal }).map((_, index) => {
              const isFilled = index < slotsFilled;
              return (
                <span key={index} className={`grid min-w-0 place-items-center ${isFilled ? 'text-[var(--dl-string)] drop-shadow-[0_0_10px_rgba(52,211,153,.34)]' : 'text-[#4c566f]'}`}>
                  <span className="block [&>svg]:h-[clamp(46px,13vw,76px)] [&>svg]:w-[clamp(46px,13vw,76px)]">
                    <PersonIcon />
                  </span>
                </span>
              );
            })}
          </div>
        </section>

        <LobbyRulesSummary metadata={lobby.metadata} />

        <section className="mt-5">
          <h4 className="mb-3 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">Resumo rápido</h4>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex min-h-[92px] items-center gap-3 rounded-[1.25rem] border border-[var(--dl-border)] bg-[linear-gradient(135deg,rgba(255,255,255,.055),rgba(255,255,255,.02))] p-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[0.95rem] border border-dashed border-white/20 bg-white/[0.06] text-[#dfe6ff] [&>svg]:h-6 [&>svg]:w-6">
                <RoleIcon />
              </div>
              <div className="min-w-0">
                <small className="block text-[10px] font-black uppercase tracking-[0.1em] text-[var(--dl-muted-light)]">Função</small>
                <strong className="block break-words text-lg font-black uppercase leading-tight text-white">{role}</strong>
                <span className="mt-1 block break-words text-xs leading-snug text-[var(--dl-muted-light)]">{getRoleHint(role)}</span>
              </div>
            </div>

            <div className="flex min-h-[92px] items-center gap-3 rounded-[1.25rem] border border-[rgb(var(--dl-string-rgb)/0.24)] bg-[linear-gradient(135deg,rgba(52,211,153,.13),rgba(52,211,153,.035))] p-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[0.95rem] border border-[rgb(var(--dl-string-rgb)/0.24)] bg-[rgb(var(--dl-string-rgb)/0.12)] text-[var(--dl-string)] [&>svg]:h-6 [&>svg]:w-6">
                <MicIcon />
              </div>
              <div className="min-w-0">
                <small className="block text-[10px] font-black uppercase tracking-[0.1em] text-[var(--dl-muted-light)]">Comunicação</small>
                <strong className="block text-lg font-black uppercase leading-tight text-white">{mic ? 'Mic ON' : 'Mic OFF'}</strong>
                <span className="mt-1 block text-xs leading-snug text-[var(--dl-muted-light)]">{mic ? 'Usa call durante a partida' : 'Sem microfone'}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5">
          <h4 className="mb-3 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">Karma</h4>
          <div className="rounded-[1.125rem] border border-[var(--dl-border)] bg-[var(--dl-surface)] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <strong className="text-sm font-black text-white">Karma do jogador</strong>
              <span className="rounded-full border border-[rgb(var(--dl-string-rgb)/0.24)] bg-[rgb(var(--dl-string-rgb)/0.14)] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.08em] text-[var(--dl-string)]">
                {getKarmaLabel(karmaLevel)}
              </span>
            </div>
            <div className="relative h-3 rounded-full bg-[linear-gradient(90deg,#ef4444_0_33.33%,#facc15_33.33%_66.66%,#34d399_66.66%_100%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,.12)]" aria-label={`Karma do jogador: ${getKarmaLabel(karmaLevel)}`}>
              <span className="absolute top-1/2 h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-[var(--dl-string)] bg-[var(--dl-text)] shadow-[0_0_14px_rgba(52,211,153,.45)] [left:var(--karma-position)]" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] font-black uppercase tracking-[0.08em]">
              <span className="text-[#f87171]">Karma baixo</span>
              <span className="text-[#facc15]">Neutro</span>
              <span className="text-[#34d399]">Karma alto</span>
            </div>
          </div>
        </section>

        <section className="mt-5">
          <h4 className="mb-3 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">Tags do perfil</h4>
          <div className="flex flex-wrap gap-2.5">
            {visibleTags.map((tag) => (
              <span
                key={`${tag.label}-${tag.emoji}`}
                className={`inline-flex min-w-0 items-center gap-2 rounded-full border px-3 py-2 text-sm font-extrabold text-[#edf1ff] ${
                  tag.type === 'green'
                    ? 'border-[rgb(var(--dl-string-rgb)/0.26)] bg-[rgb(var(--dl-string-rgb)/0.14)]'
                    : tag.type === 'orange'
                      ? 'border-[rgba(251,146,60,.26)] bg-[rgba(251,146,60,.14)]'
                      : tag.type === 'blue'
                        ? 'border-[rgba(56,189,248,.26)] bg-[rgba(56,189,248,.14)]'
                        : tag.type === 'yellow'
                          ? 'border-[rgba(250,204,21,.26)] bg-[rgba(250,204,21,.14)]'
                          : 'border-[rgba(244,114,182,.26)] bg-[rgba(244,114,182,.14)]'
                }`}
              >
                <span aria-hidden="true">{tag.emoji}</span>
                <span className="break-words">{tag.label}</span>
              </span>
            ))}

            {hiddenCount > 0 ? (
              <button
                type="button"
                className="inline-flex min-w-0 cursor-pointer items-center gap-2 rounded-full border border-dashed border-[var(--dl-border)] bg-white/[0.07] px-3 py-2 text-sm font-extrabold text-white transition hover:bg-white/[0.12]"
                onClick={() => setShowAllTags((value) => !value)}
              >
                <span aria-hidden="true">＋</span>
                {showAllTags ? 'Ver menos' : 'Ver mais'}
              </button>
            ) : null}
          </div>
        </section>

        <section className="mt-5">
          <h4 className="mb-3 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">Descrição</h4>
          <p className="m-0 rounded-[1.125rem] border border-[var(--dl-border)] bg-white/[0.035] px-4 py-3 text-sm leading-relaxed text-[#d8def0]">
            {description}
          </p>
        </section>

        <footer className="mt-auto border-t border-[var(--dl-border)] pt-5">
          {isJoined && !isOwner ? (
            <button
              type="button"
              className="mb-3 w-full rounded-2xl border border-[var(--dl-border)] bg-white/[0.05] px-4 py-3 text-sm font-black text-white opacity-80"
              disabled
            >
              Você entrou
            </button>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="min-w-0 flex-1 rounded-2xl border border-[var(--dl-border)] bg-white/[0.05] px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!lobby.owner?.id}
              onClick={() => navigate(ROUTES.PLAYER_PROFILE.replace(':playerId', lobby.owner?.id || ''))}
            >
              Ver Perfil
            </button>
            <button
              type="button"
              className={`min-w-0 flex-1 rounded-2xl px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${
                isJoined || isFull || isClosed
                  ? 'border border-[var(--dl-border)] bg-white/[0.05]'
                  : 'bg-[linear-gradient(135deg,var(--dl-primary),#6338e8)] shadow-[0_12px_26px_rgba(99,56,232,.24)]'
              }`}
              disabled={actionDisabled}
              onClick={handlePrimaryAction}
            >
              {actionLabel}
            </button>
          </div>
        </footer>
      </div>
    </article>
  );
};
