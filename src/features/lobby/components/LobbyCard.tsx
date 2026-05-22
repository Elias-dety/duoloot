import React from 'react';

import { Avatar, Badge, Button, StatValue } from '@/components/atoms';
import { CompatibilityMeter } from '@/components/molecules';
import { Lobby } from '@/schemas/lobby.schema';
import { ASSETS } from '@/constants/assets';

export interface LobbyCardProps {
  lobby: Lobby;
  onJoin?: (id: string) => void;
  isJoining?: boolean;
}

export const LobbyCard: React.FC<LobbyCardProps> = ({ lobby, onJoin, isJoining }) => {
  const slotsTotal = Number(lobby.slotsTotal) || 0;
  const slotsFilled = Number(lobby.slotsFilled) || 0;
  const openSlots = Math.max(0, slotsTotal - slotsFilled);
  const isFull = lobby.status === 'full' || (slotsTotal > 0 && openSlots === 0);
  const isClosed = lobby.status === 'closed';
  const isRecommended = (lobby.compatibilityScore ?? 0) >= 85;

  const ownerName = lobby.owner?.name || 'Player desconhecido';
  const lobbyMode = lobby.mode || 'Modo indefinido';
  const lobbyQueue = lobby.queue || 'Fila aberta';

  const gp = lobby.owner?.gameProfile || lobby.metadata || {};
  const hasProfile = !!(gp.mainGame || gp.nickname || gp.currentRank || gp.mainRole);

  const mainGameVal = String(gp.mainGame || lobby.metadata?.mainGame || '---');
  const currentRankVal = String(gp.currentRank || gp.rank || lobby.metadata?.currentRank || lobby.minRank || '---');
  const mainRoleVal = String(gp.mainRole || lobby.metadata?.mainRole || '---');
  const playStyleVal = String(gp.playStyle || lobby.metadata?.playStyle || '---');
  const micVal = (gp.microphone !== undefined ? gp.microphone : lobby.metadata?.microphone) ? 'SIM' : 'NÃO';
  const regionVal = String(gp.region || lobby.metadata?.region || '---');

  const borderColor = isClosed || isFull ? 'rgb(var(--dl-error-rgb)/0.5)' : isRecommended ? 'rgb(var(--dl-string-rgb)/0.34)' : 'var(--dl-border)';

  const statusLabel = isClosed ? 'Fechado' : isFull ? 'Cheio' : lobby.status === 'open' ? 'Ativo' : 'Em jogo';
  const statusVariant = isClosed || isFull ? 'danger' : 'default';

  const getCompatibilityDetails = (score: number) => {
    if (score >= 85) return { label: 'Match ideal', tone: 'text-white bg-[rgb(var(--dl-string-rgb)/0.16)] border-[var(--dl-string)]' };
    if (score >= 65) return { label: 'Compatível', tone: 'text-white bg-white/[0.05] border-[var(--dl-border)]' };
    if (score >= 40) return { label: 'Neutro', tone: 'text-[var(--dl-muted-light)] bg-white/[0.03] border-[var(--dl-border)]' };
    return { label: 'Baixa sinergia', tone: 'text-[var(--dl-error)] bg-[rgb(var(--dl-error-rgb)/0.15)] border-[var(--dl-error)]' };
  };

  return (
    <div className="dl-panel flex h-full flex-col gap-4 p-5 transition-all hover:-translate-y-1" style={{ borderColor, opacity: isClosed ? 0.72 : 1 }}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar src={lobby.owner?.avatarUrl} alt={ownerName} fallback={ownerName} />
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <img src={ASSETS.icons.lobby} alt="" aria-hidden="true" className="h-5 w-5 shrink-0 object-contain" />
              <h3 className="truncate font-['Rajdhani'] text-lg font-bold uppercase text-white">{ownerName}</h3>
            </div>
            <p className="truncate text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--dl-muted-light)]">{lobbyMode} / {lobbyQueue}</p>
          </div>
        </div>
        <Badge variant={statusVariant}>{statusLabel}</Badge>
      </div>

      {isRecommended ? <Badge variant="success" className="w-fit">Recomendado</Badge> : null}

      {lobby.compatibilityScore !== undefined ? (
        <div className="space-y-2">
          <CompatibilityMeter score={lobby.compatibilityScore} />
          {(() => {
            const comp = getCompatibilityDetails(lobby.compatibilityScore);
            return (
              <div className={`rounded-full border px-3 py-1 text-center text-[10px] font-bold uppercase tracking-wider ${comp.tone}`}>
                {comp.label} ({lobby.compatibilityScore}%)
              </div>
            );
          })()}
        </div>
      ) : null}

      <div className="my-1 space-y-2 border-y border-[var(--dl-border)] py-3">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--dl-muted-light)]">
          <img src={ASSETS.icons.matchmakingTrustThumb} alt="" aria-hidden="true" className="h-7 w-7 object-contain" />
          Perfil do lobby
        </div>
        {!hasProfile ? (
          <div className="text-xs italic uppercase tracking-wider text-[var(--dl-muted-light)]">
            Perfil incompleto
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
            {[
              ['GAME', mainGameVal, 'text-white'],
              ['RANK', currentRankVal, 'text-white'],
              ['ROLE', mainRoleVal, 'text-white'],
              ['STYLE', playStyleVal, 'text-[var(--dl-muted-light)]'],
              ['MIC', micVal, 'text-white'],
              ['REGION', regionVal, 'text-white'],
            ].map(([label, value, color]) => (
              <div key={label} className="flex items-center justify-between rounded-[1rem] border border-[var(--dl-border)] bg-[var(--dl-surface)] px-3 py-2">
                <span className="text-[9px] font-bold text-[var(--dl-muted)]">{label}</span>
                <span className={`truncate pl-2 font-bold uppercase ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid flex-1 grid-cols-2 gap-3">
        <div className="rounded-[1rem] border border-[var(--dl-border)] bg-[var(--dl-surface)] p-3">
          <StatValue label="Rank Min" value={lobby.minRank || 'Livre'} description={`até ${lobby.maxRank || 'Livre'}`} />
        </div>
        <div className="rounded-[1rem] border border-[var(--dl-border)] bg-[var(--dl-surface)] p-3">
          <StatValue label="Vagas" value={slotsTotal > 0 && openSlots > 0 ? `${openSlots}/${slotsTotal}` : 'Lotado'} tone={isFull ? 'danger' : 'default'} />
        </div>
        <div className="rounded-[1rem] border border-[var(--dl-border)] bg-[var(--dl-surface)] p-3">
          <StatValue label="Trust" value={`${lobby.owner?.trustScore || 0}%`} />
        </div>
        <div className="rounded-[1rem] border border-[var(--dl-border)] bg-[var(--dl-surface)] p-3">
          <StatValue label="Fila" value={lobbyQueue} tone="info" />
        </div>
      </div>

      <div className="mt-auto border-t border-[var(--dl-border)] pt-4">
        <Button
          variant={isFull || isClosed ? 'secondary' : 'primary'}
          className="w-full"
          disabled={isFull || isClosed || isJoining}
          onClick={() => onJoin && onJoin(lobby.id)}
        >
          {isJoining ? 'Sincronizando...' : isClosed ? 'Fechado' : isFull ? 'Lobby cheio' : 'Entrar no Lobby'}
        </Button>
      </div>
    </div>
  );
};
